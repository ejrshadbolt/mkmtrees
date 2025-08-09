// Cloudflare Pages Function for portfolio categories API
// This replaces the Next.js API route to properly access D1 database

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    console.log('Pages Function: Database found for categories:', !!db);
    
    if (!db) {
      return new Response(JSON.stringify({ 
        error: 'Database not available',
        message: 'D1 database binding not found in Pages Function context',
        categories: []
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get categories with published project counts
    const categories = await db.prepare(`
      SELECT 
        pc.id,
        pc.name,
        pc.slug,
        pc.description,
        COUNT(pp.id) as project_count
      FROM portfolio_categories pc
      LEFT JOIN portfolio_projects pp ON pc.id = pp.category_id AND pp.published = 1
      GROUP BY pc.id, pc.name, pc.slug, pc.description
      HAVING project_count > 0 OR pc.id IN (
        SELECT DISTINCT category_id FROM portfolio_projects WHERE published = 1
      )
      ORDER BY pc.name ASC
    `).all();

    const formattedCategories = categories.results?.map((category: Record<string, unknown>) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      project_count: category.project_count,
    }));

    return new Response(JSON.stringify({
      categories: formattedCategories || [],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching portfolio categories:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      categories: []
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 