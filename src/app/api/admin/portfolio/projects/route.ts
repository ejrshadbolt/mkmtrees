import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
}

// GET /api/admin/portfolio/projects - List projects with pagination
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const published = searchParams.get('published'); // 'true', 'false', or null for all

    const offset = (page - 1) * limit;

    // Build the query based on filters
    let whereClause = '';
    const params: unknown[] = [];

    if (search) {
      whereClause = 'WHERE (pp.title LIKE ? OR pp.description LIKE ? OR pp.client_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      if (whereClause) {
        whereClause += ' AND pc.slug = ?';
      } else {
        whereClause = 'WHERE pc.slug = ?';
      }
      params.push(category);
    }

    if (published !== null) {
      const publishedValue = published === 'true' ? 1 : 0;
      if (whereClause) {
        whereClause += ' AND pp.published = ?';
      } else {
        whereClause = 'WHERE pp.published = ?';
      }
      params.push(publishedValue);
    }

    // Get projects with category and featured image information
    const projectsQuery = `
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
      ${whereClause}
      ORDER BY pp.sort_order ASC, pp.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM portfolio_projects pp
      LEFT JOIN portfolio_categories pc ON pp.category_id = pc.id
      ${whereClause}
    `;

    // Execute queries
    const projects = await db.prepare(projectsQuery)
      .bind(...params, limit, offset)
      .all();

    const countResult = await db.prepare(countQuery)
      .bind(...params)
      .first();

    const total = Number(countResult?.total) || 0;
    const totalPages = Math.ceil(total / limit);

    // Format projects
    const formattedProjects = projects.results?.map((project: Record<string, unknown>) => ({
      ...project,
      published: Boolean(project.published),
      created_at: new Date((project.created_at as number) * 1000).toISOString(),
      updated_at: new Date((project.updated_at as number) * 1000).toISOString(),
    }));

    return NextResponse.json({
      projects: formattedProjects || [],
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
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/portfolio/projects - Create a new project
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
      description: string;
      short_description?: string;
      client_name?: string;
      project_url?: string;
      project_date?: string;
      technologies?: string;
      featured_image_id?: number;
      category_id?: number;
      published: boolean;
      sort_order?: number;
    };
    const { 
      title, slug, description, short_description, client_name, 
      project_url, project_date, technologies, featured_image_id, category_id, published, sort_order 
    } = body;

    // Validation
    if (!title || !slug || !description) {
      return NextResponse.json({ 
        error: 'Title, slug, and description are required' 
      }, { status: 400 });
    }

    // Check if slug already exists
    const existingProject = await db.prepare('SELECT id FROM portfolio_projects WHERE slug = ?')
      .bind(slug)
      .first();

    if (existingProject) {
      return NextResponse.json({ 
        error: 'A project with this slug already exists' 
      }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);

    // Create the project
    const result = await db.prepare(`
      INSERT INTO portfolio_projects (
        title, slug, description, short_description, client_name, project_url,
        project_date, technologies, featured_image_id, category_id, published, sort_order, 
        created_at, updated_at, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        now,
        parseInt(session.user.id)
      )
      .run();

    // Return the created project with category info
    const createdProject = await db.prepare(`
      SELECT 
        pp.*,
        pc.name as category_name,
        pc.slug as category_slug,
        m.url as featured_image_url,
        m.alt_text as featured_image_alt
      FROM portfolio_projects pp
      LEFT JOIN portfolio_categories pc ON pp.category_id = pc.id
      LEFT JOIN media m ON pp.featured_image_id = m.id
      WHERE pp.id = ?
    `)
      .bind(result.meta.last_row_id)
      .first();

    return NextResponse.json({
      ...createdProject,
      published: Boolean(createdProject?.published),
      created_at: new Date((createdProject?.created_at as number) * 1000).toISOString(),
      updated_at: new Date((createdProject?.updated_at as number) * 1000).toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 