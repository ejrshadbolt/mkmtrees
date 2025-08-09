import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
}

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/admin/portfolio/projects/[id] - Get a specific project
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
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

    const projectId = parseInt(resolvedParams.id);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    // Get project with category and featured image information
    const project = await db.prepare(`
      SELECT 
        pp.*,
        pc.name as category_name,
        pc.slug as category_slug,
        m.url as featured_image_url,
        m.alt_text as featured_image_alt,
        u.username as created_by_name
      FROM portfolio_projects pp
      LEFT JOIN portfolio_categories pc ON pp.category_id = pc.id
      LEFT JOIN media m ON pp.featured_image_id = m.id
      LEFT JOIN users u ON pp.created_by = u.id
      WHERE pp.id = ?
    `)
      .bind(projectId)
      .first();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Format the project data
    const formattedProject = {
      ...project,
      published: Boolean(project.published),
      created_at: new Date((project.created_at as number) * 1000).toISOString(),
      updated_at: new Date((project.updated_at as number) * 1000).toISOString(),
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/portfolio/projects/[id] - Update a specific project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
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

    const projectId = parseInt(resolvedParams.id);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const body = await request.json() as {
      title: string;
      slug: string;
      description: string;
      short_description?: string;
      client_name?: string;
      project_url?: string;
      project_date?: string;
      technologies?: string;
      featured_image_id?: number | null;
      category_id?: number | null;
      published: boolean;
      sort_order?: number;
      author_id?: number | null;
    };
    const { 
      title, slug, description, short_description, client_name, 
      project_url, project_date, technologies, featured_image_id, category_id, published, sort_order, author_id 
    } = body;

    // Validation
    if (!title || !slug || !description) {
      return NextResponse.json({ 
        error: 'Title, slug, and description are required' 
      }, { status: 400 });
    }

    // Check if project exists
    const existingProject = await db.prepare('SELECT id FROM portfolio_projects WHERE id = ?')
      .bind(projectId)
      .first();

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if slug already exists for a different project
    const slugCheck = await db.prepare('SELECT id FROM portfolio_projects WHERE slug = ? AND id != ?')
      .bind(slug, projectId)
      .first();

    if (slugCheck) {
      return NextResponse.json({ 
        error: 'A project with this slug already exists' 
      }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);

    // Update the project
    await db.prepare(`
      UPDATE portfolio_projects 
      SET title = ?, slug = ?, description = ?, short_description = ?, 
          client_name = ?, project_url = ?, project_date = ?, technologies = ?,
          featured_image_id = ?, category_id = ?, published = ?, sort_order = ?, updated_at = ?, author_id = ?
      WHERE id = ?
    `)
      .bind(
        title,
        slug,
        description,
        short_description || null,
        client_name || null,
        project_url || null,
        project_date || null,
        technologies || null,
        featured_image_id || null,
        category_id || null,
        published ? 1 : 0,
        sort_order || 0,
        now,
        author_id || null,
        projectId
      )
      .run();

    // Return the updated project with category info
    const updatedProject = await db.prepare(`
      SELECT 
        pp.*,
        pc.name as category_name,
        pc.slug as category_slug,
        m.url as featured_image_url,
        m.alt_text as featured_image_alt,
        u.username as created_by_name
      FROM portfolio_projects pp
      LEFT JOIN portfolio_categories pc ON pp.category_id = pc.id
      LEFT JOIN media m ON pp.featured_image_id = m.id
      LEFT JOIN users u ON pp.created_by = u.id
      WHERE pp.id = ?
    `)
      .bind(projectId)
      .first();

    return NextResponse.json({
      ...updatedProject,
      published: Boolean(updatedProject?.published),
      created_at: new Date((updatedProject?.created_at as number) * 1000).toISOString(),
      updated_at: new Date((updatedProject?.updated_at as number) * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/portfolio/projects/[id] - Delete a specific project
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
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

    const projectId = parseInt(resolvedParams.id);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    // Check if project exists
    const existingProject = await db.prepare('SELECT id FROM portfolio_projects WHERE id = ?')
      .bind(projectId)
      .first();

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete the project
    await db.prepare('DELETE FROM portfolio_projects WHERE id = ?')
      .bind(projectId)
      .run();

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 