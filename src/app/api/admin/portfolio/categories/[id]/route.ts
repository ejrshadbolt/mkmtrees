import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDatabase } from '@/lib/cloudflare-context';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/portfolio/categories/[id] - Get a specific category
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    // Get the database from the Cloudflare context
    const db = getDatabase();
    
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

    const categoryId = parseInt(resolvedParams.id);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const category = await db.prepare(`
      SELECT 
        pc.*,
        COUNT(pp.id) as project_count
      FROM portfolio_categories pc
      LEFT JOIN portfolio_projects pp ON pc.id = pp.category_id
      WHERE pc.id = ?
      GROUP BY pc.id, pc.name, pc.slug, pc.description, pc.created_at, pc.updated_at
    `)
      .bind(categoryId)
      .first();

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...category,
      created_at: new Date((category.created_at as number) * 1000).toISOString(),
      updated_at: new Date((category.updated_at as number) * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error fetching portfolio category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/portfolio/categories/[id] - Update a specific category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    // Get the database from the Cloudflare context
    const db = getDatabase();
    
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

    const categoryId = parseInt(resolvedParams.id);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
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

    // Check if category exists
    const existingCategory = await db.prepare('SELECT * FROM portfolio_categories WHERE id = ?')
      .bind(categoryId)
      .first();

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if slug is being changed and if the new slug already exists
    if (slug !== existingCategory.slug) {
      const slugExists = await db.prepare('SELECT id FROM portfolio_categories WHERE slug = ? AND id != ?')
        .bind(slug, categoryId)
        .first();

      if (slugExists) {
        return NextResponse.json({ 
          error: 'A category with this slug already exists' 
        }, { status: 400 });
      }
    }

    const now = Math.floor(Date.now() / 1000);

    // Update the category
    await db.prepare(`
      UPDATE portfolio_categories 
      SET name = ?, slug = ?, description = ?, updated_at = ?
      WHERE id = ?
    `)
      .bind(name, slug, description || null, now, categoryId)
      .run();

    // Return the updated category
    const updatedCategory = await db.prepare(`
      SELECT * FROM portfolio_categories WHERE id = ?
    `)
      .bind(categoryId)
      .first();

    return NextResponse.json({
      ...updatedCategory,
      created_at: new Date((updatedCategory?.created_at as number) * 1000).toISOString(),
      updated_at: new Date((updatedCategory?.updated_at as number) * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error updating portfolio category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/portfolio/categories/[id] - Delete a specific category
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    // Get the database from the Cloudflare context
    const db = getDatabase();
    
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

    const categoryId = parseInt(resolvedParams.id);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    // Check if category exists
    const existingCategory = await db.prepare('SELECT * FROM portfolio_categories WHERE id = ?')
      .bind(categoryId)
      .first();

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category has projects
    const projectCount = await db.prepare('SELECT COUNT(*) as count FROM portfolio_projects WHERE category_id = ?')
      .bind(categoryId)
      .first() as { count: number } | null;

    if (projectCount && projectCount.count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category with existing projects. Please move projects to another category first.' 
      }, { status: 400 });
    }

    // Delete the category
    await db.prepare('DELETE FROM portfolio_categories WHERE id = ?')
      .bind(categoryId)
      .run();

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 