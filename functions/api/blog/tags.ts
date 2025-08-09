// Cloudflare Pages Function for blog tags API
// This replaces the Next.js API route to properly access D1 database

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    console.log('Pages Function: Database found for tags:', !!db);
    
    if (!db) {
      return new Response(JSON.stringify({ 
        error: 'Database not available',
        message: 'D1 database binding not found in Pages Function context',
        tags: []
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get tags with post counts
    const tagsQuery = `
      SELECT 
        t.id,
        t.name,
        t.slug,
        COUNT(pt.post_id) as post_count
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      JOIN posts p ON pt.post_id = p.id
      WHERE p.published = 1
      GROUP BY t.id, t.name, t.slug
      ORDER BY post_count DESC, t.name ASC
    `;

    const tags = await db.prepare(tagsQuery).all();

    return new Response(JSON.stringify({
      tags: tags.results || [],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      tags: []
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 