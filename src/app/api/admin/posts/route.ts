import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
}

// GET /api/admin/posts - List posts with pagination
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database from the Cloudflare context using next-on-pages
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const published = searchParams.get('published'); // 'true', 'false', or null for all

    const offset = (page - 1) * limit;

    // Build the query based on filters
    let whereClause = '';
    const params: unknown[] = [];

    if (search) {
      whereClause += 'WHERE (title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (published !== null) {
      const publishedValue = published === 'true' ? 1 : 0;
      if (whereClause) {
        whereClause += ' AND published = ?';
      } else {
        whereClause = 'WHERE published = ?';
      }
      params.push(publishedValue);
    }

    // Get posts with author information
    const postsQuery = `
      SELECT 
        p.*,
        a.name as author_name
      FROM posts p
      LEFT JOIN authors a ON p.author_id_new = a.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM posts p
      ${whereClause}
    `;

    // Execute queries
    const posts = await db.prepare(postsQuery)
      .bind(...params, limit, offset)
      .all();

    const countResult = await db.prepare(countQuery)
      .bind(...params)
      .first();

    const total = Number(countResult?.total) || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      posts: posts.results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
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

    // Check if slug already exists
    const existingPost = await db.prepare('SELECT id FROM posts WHERE slug = ?')
      .bind(slug)
      .first();

    if (existingPost) {
      return NextResponse.json({ 
        error: 'A post with this slug already exists' 
      }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);
    const published_at = published ? now : null;

    // Create the post
    const result = await db.prepare(`
      INSERT INTO posts (
        title, slug, content, excerpt, featured_image_id, 
        published, published_at, created_at, updated_at, author_id, author_id_new,
        meta_description, og_title, og_description, og_image
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        now,
        parseInt(session.user.id), // Current user ID for legacy column (references users table)
        author_id || 1, // Selected author ID for new column (references authors table)
        meta_description || null,
        og_title || null,
        og_description || null,
        og_image || null
      )
      .run();

    const postId = result.meta.last_row_id;

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
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

    // Return the created post
    const createdPost = await db.prepare(`
      SELECT 
        p.*,
        a.name as author_name
      FROM posts p
      LEFT JOIN authors a ON p.author_id_new = a.id
      WHERE p.id = ?
    `)
      .bind(postId)
      .first();

    return NextResponse.json(createdPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 