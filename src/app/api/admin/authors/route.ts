import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

interface CreateAuthorBody {
  name: string;
  slug: string;
  bio?: string;
  avatar_id?: number;
  email?: string;
  website?: string;
  social_links?: string;
  is_default?: boolean;
}

export async function GET() {
  try {
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

    // Get all authors
    const result = await db.prepare(`
      SELECT id, name, email, bio, created_at, updated_at 
      FROM authors 
      ORDER BY name ASC
    `).all();

    return NextResponse.json({ 
      authors: result.results || [] 
    });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json() as CreateAuthorBody;
    const { name, slug, bio, avatar_id, email, website, social_links, is_default } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // If this is being set as default, unset other defaults
    if (is_default) {
      await db.prepare('UPDATE authors SET is_default = 0').run();
    }

    // Insert the new author
    const result = await db.prepare(`
      INSERT INTO authors (name, slug, bio, avatar_id, email, website, social_links, is_default, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      Date.now()
    ).run();

    // Return the created author
    const createdAuthor = await db.prepare('SELECT * FROM authors WHERE id = ?')
      .bind(result.meta.last_row_id)
      .first();

    return NextResponse.json({
      author: createdAuthor,
      message: 'Author created successfully'
    });

  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
} 