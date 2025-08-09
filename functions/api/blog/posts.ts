// Cloudflare Pages Function for blog posts API
// This replaces the Next.js API route to properly access D1 database

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    console.log('Pages Function: Database found:', !!db);
    
    if (!db) {
      return new Response(JSON.stringify({ 
        error: 'Database not available',
        message: 'D1 database binding not found in Pages Function context'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const tag = url.searchParams.get('tag') || '';

    const offset = (page - 1) * limit;

    // Build the query based on filters
    let whereClause = 'WHERE p.published = ?';
    const params: unknown[] = [1]; // for published = 1

    if (search) {
      whereClause += ' AND (p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (tag) {
      whereClause += ' AND EXISTS (SELECT 1 FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id AND t.slug = ?)';
      params.push(tag);
    }

    // Get posts with author information, media, and tags
    const postsQuery = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.content,
        p.excerpt,
        p.published_at,
        p.created_at,
        u.username as author_name,
        m.url as featured_image_url,
        m.alt_text as featured_image_alt,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      JOIN users u ON p.author_id_new = u.id
      LEFT JOIN media m ON p.featured_image_id = m.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      ${whereClause}
      GROUP BY p.id, p.title, p.slug, p.content, p.excerpt, p.published_at, p.created_at, u.username, m.url, m.alt_text
      ORDER BY p.published_at DESC
      LIMIT ? OFFSET ?
    `;

    // Build count query with same parameters structure
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM posts p
    `;
    
    if (tag) {
      countQuery += ' JOIN post_tags pt ON p.id = pt.post_id JOIN tags t ON pt.tag_id = t.id';
    }
    
    countQuery += ` ${whereClause}`;

    // Execute queries
    const posts = await db.prepare(postsQuery)
      .bind(...params, limit, offset)
      .all();

    const countResult = await db.prepare(countQuery)
      .bind(...params) // Use same params for count query
      .first();

    const total = Number(countResult?.total) || 0;
    const totalPages = Math.ceil(total / limit);

    // Format posts
    const formattedPosts = posts.results?.map((post: Record<string, unknown>) => ({
      ...post,
      tags: typeof post.tags === 'string' ? post.tags.split(',').filter(Boolean) : [],
      published_at: new Date((post.published_at as number) * 1000).toISOString(),
      created_at: new Date((post.created_at as number) * 1000).toISOString(),
    }));

    return new Response(JSON.stringify({
      posts: formattedPosts || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 