import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
}

// GET /api/admin/portfolio/categories - List all portfolio categories
export async function GET() {
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

    const categories = await db.prepare(`
      SELECT 
        pc.*,
        COUNT(pp.id) as project_count
      FROM portfolio_categories pc
      LEFT JOIN portfolio_projects pp ON pc.id = pp.category_id
      GROUP BY pc.id, pc.name, pc.slug, pc.description, pc.created_at, pc.updated_at
      ORDER BY pc.name ASC
    `).all();

    const formattedCategories = categories.results?.map((category: Record<string, unknown>) => ({
      ...category,
      created_at: new Date((category.created_at as number) * 1000).toISOString(),
      updated_at: new Date((category.updated_at as number) * 1000).toISOString(),
    }));

    return NextResponse.json({
      categories: formattedCategories || [],
    });
  } catch (error) {
    console.error('Error fetching portfolio categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/portfolio/categories - Create a new portfolio category
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
      name: string;
      slug: string;
      description?: string;
    };
    const { name, slug, description } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json({ 
        error: 'Name and slug are required' 
      }, { status: 400 });
    }

    // Check if slug already exists
    const existingCategory = await db.prepare('SELECT id FROM portfolio_categories WHERE slug = ?')
      .bind(slug)
      .first();

    if (existingCategory) {
      return NextResponse.json({ 
        error: 'A category with this slug already exists' 
      }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);

    // Create the category
    const result = await db.prepare(`
      INSERT INTO portfolio_categories (name, slug, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(name, slug, description || null, now, now)
      .run();

    // Return the created category
    const createdCategory = await db.prepare(`
      SELECT * FROM portfolio_categories WHERE id = ?
    `)
      .bind(result.meta.last_row_id)
      .first();

    return NextResponse.json({
      ...createdCategory,
      created_at: new Date((createdCategory?.created_at as number) * 1000).toISOString(),
      updated_at: new Date((createdCategory?.updated_at as number) * 1000).toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 