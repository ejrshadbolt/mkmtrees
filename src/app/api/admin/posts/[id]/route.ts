import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/posts/[id] - Get a specific post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    // Get the database from the Cloudflare context using next-on-pages
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = parseInt(resolvedParams.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    // Get the post with author information and tags
    const post = await db.prepare(`
      SELECT 
        p.*,
        a.name as author_name
      FROM posts p
      LEFT JOIN authors a ON p.author_id_new = a.id
      WHERE p.id = ?
    `)
      .bind(postId)
      .first();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get tags for this post
    const tags = await db.prepare(`
      SELECT t.name, t.slug
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `)
      .bind(postId)
      .all();

    return NextResponse.json({
      ...post,
      tags: tags.results,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/posts/[id] - Update a specific post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    // Get the database from the Cloudflare context using next-on-pages
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = parseInt(resolvedParams.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    // Debug: Check if authors table and author_id_new column exist
    try {
      const authorsCheck = await db.prepare('SELECT COUNT(*) as count FROM authors').first();
      console.log('Authors table check:', authorsCheck);
      
      const columnCheck = await db.prepare('PRAGMA table_info(posts)').all();
      console.log('Posts table columns:', columnCheck.results?.map((col: Record<string, unknown>) => 
        (col as { name: string }).name
      ));
    } catch (schemaError) {
      console.error('Schema check failed:', schemaError);
      return NextResponse.json({ 
        error: 'Database schema error',
        details: 'Required tables or columns not found. Please run database migrations.'
      }, { status: 500 });
    }

    const body = await request.json() as {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      featured_image_id?: number;
      published: boolean;
      tags?: string[];
      meta_description?: string;
      og_title?: string;
      og_description?: string;
      og_image?: string;
      author_id?: number;
    };
    const { 
      title, slug, content, excerpt, featured_image_id, published, tags,
      meta_description, og_title, og_description, og_image, author_id 
    } = body;

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json({ 
        error: 'Title, slug, and content are required' 
      }, { status: 400 });
    }

    // Check if post exists
    const existingPost = await db.prepare('SELECT * FROM posts WHERE id = ?')
      .bind(postId)
      .first();

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if slug is being changed and if the new slug already exists
    if (slug !== existingPost.slug) {
      const slugExists = await db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?')
        .bind(slug, postId)
        .first();

      if (slugExists) {
        return NextResponse.json({ 
          error: 'A post with this slug already exists' 
        }, { status: 400 });
      }
    }

    const now = Math.floor(Date.now() / 1000);
    let published_at = existingPost.published_at;

    // If changing from unpublished to published, set published_at
    if (published && !existingPost.published) {
      published_at = now;
    }
    // If changing from published to unpublished, clear published_at
    else if (!published && existingPost.published) {
      published_at = null;
    }

    // Update the post
    await db.prepare(`
      UPDATE posts 
      SET title = ?, slug = ?, content = ?, excerpt = ?, 
          featured_image_id = ?, published = ?, published_at = ?, updated_at = ?,
          meta_description = ?, og_title = ?, og_description = ?, og_image = ?,
          author_id = ?, author_id_new = ?
      WHERE id = ?
    `)
      .bind(
        title,
        slug,
        content,
        excerpt || null,
        featured_image_id || null,
        published ? 1 : 0,
        published_at,
        now,
        meta_description || null,
        og_title || null,
        og_description || null,
        og_image || null,
        parseInt(session.user.id), // Current user ID for legacy column (references users table)
        author_id || null, // Selected author ID for new column (references authors table)
        postId
      )
      .run();

    // Handle tags update
    if (tags && Array.isArray(tags)) {
      // Remove existing tags for this post
      await db.prepare('DELETE FROM post_tags WHERE post_id = ?')
        .bind(postId)
        .run();

      // Add new tags
      for (const tagName of tags) {
        // First, create tag if it doesn't exist
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
        await db.prepare(`
          INSERT OR IGNORE INTO tags (name, slug)
          VALUES (?, ?)
        `)
          .bind(tagName, tagSlug)
          .run();

        // Get the tag ID
        const tag = await db.prepare('SELECT id FROM tags WHERE slug = ?')
          .bind(tagSlug)
          .first();

        if (tag) {
          // Link the post and tag
          await db.prepare(`
            INSERT OR IGNORE INTO post_tags (post_id, tag_id)
            VALUES (?, ?)
          `)
            .bind(postId, tag.id)
            .run();
        }
      }
    }

    // Return the updated post
    const updatedPost = await db.prepare(`
      SELECT 
        p.*,
        a.name as author_name
      FROM posts p
      LEFT JOIN authors a ON p.author_id_new = a.id
      WHERE p.id = ?
    `)
      .bind(postId)
      .first();

    // Get updated tags
    const updatedTags = await db.prepare(`
      SELECT t.name, t.slug
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `)
      .bind(postId)
      .all();

    return NextResponse.json({
      ...updatedPost,
      tags: updatedTags.results,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/admin/posts/[id] - Delete a specific post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    // Get the database from the Cloudflare context using next-on-pages
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = parseInt(resolvedParams.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    // Check if post exists
    const existingPost = await db.prepare('SELECT id FROM posts WHERE id = ?')
      .bind(postId)
      .first();

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete the post (this will cascade to post_tags due to foreign key constraints)
    await db.prepare('DELETE FROM posts WHERE id = ?')
      .bind(postId)
      .run();

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 