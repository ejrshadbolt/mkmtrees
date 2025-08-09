// Cloudflare Pages Function for portfolio projects API
// This replaces the Next.js API route to properly access D1 database

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    console.log('Pages Function: Database found for portfolio:', !!db);
    
    if (!db) {
      return new Response(JSON.stringify({ 
        error: 'Database not available',
        message: 'D1 database binding not found in Pages Function context',
        projects: []
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(context.request.url);
    const category = url.searchParams.get('category') || '';

    // Build the query based on filters
    let whereClause = 'WHERE pp.published = 1';
    const params: unknown[] = [];

    if (category) {
      whereClause += ' AND pc.slug = ?';
      params.push(category);
    }

    // Get published projects with category and featured image information
    const projectsQuery = `
      SELECT 
        pp.id,
        pp.title,
        pp.slug,
        pp.description,
        pp.short_description,
        pp.client_name,
        pp.project_url,
        pp.sort_order,
        pp.created_at,
        pc.name as category_name,
        pc.slug as category_slug,
        m.url as featured_image_url,
        m.alt_text as featured_image_alt
      FROM portfolio_projects pp
      LEFT JOIN portfolio_categories pc ON pp.category_id = pc.id
      LEFT JOIN media m ON pp.featured_image_id = m.id
      ${whereClause}
      ORDER BY pp.sort_order ASC, pp.created_at DESC
    `;

    // Execute query
    const projects = await db.prepare(projectsQuery)
      .bind(...params)
      .all();

    // Format projects
    const formattedProjects = projects.results?.map((project: Record<string, unknown>) => ({
      ...project,
      created_at: new Date((project.created_at as number) * 1000).toISOString(),
    }));

    return new Response(JSON.stringify({
      projects: formattedProjects || [],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      projects: []
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 