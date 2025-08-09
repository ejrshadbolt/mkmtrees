import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database from the Cloudflare context using next-on-pages
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || ''; // 'approved', 'pending', or '' for all

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereClause = '';
    const params: unknown[] = [];

    if (search) {
      whereClause = 'WHERE (reviewer_name LIKE ? OR title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      const approvedValue = status === 'approved' ? 1 : 0;
      if (whereClause) {
        whereClause += ' AND approved = ?';
      } else {
        whereClause = 'WHERE approved = ?';
      }
      params.push(approvedValue);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM reviews ${whereClause}`;
    const countResult = await db.prepare(countQuery).bind(...params).first() as { total: number } | null;
    const total = countResult?.total || 0;

    // Get reviews
    const query = `
      SELECT 
        r.*,
        m.url as reviewer_image_url
      FROM reviews r
      LEFT JOIN media m ON r.reviewer_image_id = m.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await db.prepare(query).bind(...params, limit, offset).all();

    return NextResponse.json({
      data: result.results || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 