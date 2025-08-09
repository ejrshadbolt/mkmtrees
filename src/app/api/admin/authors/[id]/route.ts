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

interface UpdateAuthorBody {
  name: string;
  slug: string;
  bio?: string;
  avatar_id?: number;
  email?: string;
  website?: string;
  social_links?: string;
  is_default?: boolean;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database from the Cloudflare context
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    const authorId = parseInt(resolvedParams.id);
    if (isNaN(authorId)) {
      return NextResponse.json({ error: 'Invalid author ID' }, { status: 400 });
    }

    const author = await db.prepare('SELECT * FROM authors WHERE id = ?')
      .bind(authorId)
      .first();

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json({ author });
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database from the Cloudflare context
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    const authorId = parseInt(resolvedParams.id);
    if (isNaN(authorId)) {
      return NextResponse.json({ error: 'Invalid author ID' }, { status: 400 });
    }

    const body = await request.json() as UpdateAuthorBody;
    const { name, slug, bio, avatar_id, email, website, social_links, is_default } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if author exists
    const existingAuthor = await db.prepare('SELECT * FROM authors WHERE id = ?')
      .bind(authorId)
      .first();

    if (!existingAuthor) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    // Check if slug is being changed and if the new slug already exists
    if (slug !== (existingAuthor as { slug: string }).slug) {
      const slugExists = await db.prepare('SELECT id FROM authors WHERE slug = ? AND id != ?')
        .bind(slug, authorId)
        .first();

      if (slugExists) {
        return NextResponse.json({ 
          error: 'An author with this slug already exists' 
        }, { status: 400 });
      }
    }

    // If this is being set as default, unset other defaults
    if (is_default) {
      await db.prepare('UPDATE authors SET is_default = 0 WHERE id != ?')
        .bind(authorId)
        .run();
    }

    // Update the author
    await db.prepare(`
      UPDATE authors 
      SET name = ?, slug = ?, bio = ?, avatar_id = ?, email = ?, website = ?, 
          social_links = ?, is_default = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      name,
      slug,
      bio || null,
      avatar_id || null,
      email || null,
      website || null,
      social_links || null,
      is_default ? 1 : 0,
      Date.now(),
      authorId
    ).run();

    // Return the updated author
    const updatedAuthor = await db.prepare('SELECT * FROM authors WHERE id = ?')
      .bind(authorId)
      .first();

    return NextResponse.json({
      author: updatedAuthor,
      message: 'Author updated successfully'
    });

  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json(
      { error: 'Failed to update author' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database from the Cloudflare context
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    const authorId = parseInt(resolvedParams.id);
    if (isNaN(authorId)) {
      return NextResponse.json({ error: 'Invalid author ID' }, { status: 400 });
    }

    // Check if author exists
    const existingAuthor = await db.prepare('SELECT * FROM authors WHERE id = ?')
      .bind(authorId)
      .first();

    if (!existingAuthor) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    // Check total number of authors
    const totalAuthors = await db.prepare('SELECT COUNT(*) as count FROM authors')
      .first() as { count: number } | null;

    if (!totalAuthors || totalAuthors.count <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last remaining author. At least one author must exist.' },
        { status: 400 }
      );
    }

    // Check if author is being used by any posts
    const usedByPosts = await db.prepare('SELECT COUNT(*) as count FROM posts WHERE author_id_new = ?')
      .bind(authorId)
      .first() as { count: number } | null;

    if (usedByPosts && usedByPosts.count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete author that is being used by posts' },
        { status: 400 }
      );
    }

    // Check if author is being used by any portfolio projects
    const usedByProjects = await db.prepare('SELECT COUNT(*) as count FROM portfolio_projects WHERE author_id = ?')
      .bind(authorId)
      .first() as { count: number } | null;

    if (usedByProjects && usedByProjects.count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete author that is being used by portfolio projects' },
        { status: 400 }
      );
    }

    // If we're deleting the default author, promote another author to be default
    const isDefaultAuthor = (existingAuthor as { is_default: number }).is_default;
    if (isDefaultAuthor) {
      // Find another author to make default (excluding the one being deleted)
      const nextAuthor = await db.prepare('SELECT id FROM authors WHERE id != ? LIMIT 1')
        .bind(authorId)
        .first();

      if (nextAuthor) {
        await db.prepare('UPDATE authors SET is_default = 1 WHERE id = ?')
          .bind((nextAuthor as { id: number }).id)
          .run();
      }
    }

    // Delete the author
    await db.prepare('DELETE FROM authors WHERE id = ?')
      .bind(authorId)
      .run();

    return NextResponse.json({
      message: isDefaultAuthor 
        ? 'Default author deleted successfully. Another author has been set as default.'
        : 'Author deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { error: 'Failed to delete author' },
      { status: 500 }
    );
  }
} 