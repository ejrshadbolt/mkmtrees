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
    const processedStatus = url.searchParams.get('processed') || 'all'; // 'processed', 'unprocessed', or 'all'
    const sort_by = url.searchParams.get('sort_by') || 'created_at';
    const sort_order = url.searchParams.get('sort_order') || 'desc'; // 'asc' or 'desc'

    const offset = (page - 1) * limit;

    // Build the query based on filters
    let whereClause = '';
    const params: unknown[] = [];

    if (search) {
      whereClause = 'WHERE (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (processedStatus !== 'all') {
      const processedValue = processedStatus === 'processed' ? 1 : 0;
      if (whereClause) {
        whereClause += ' AND processed = ?';
      } else {
        whereClause = 'WHERE processed = ?';
      }
      params.push(processedValue);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM submissions ${whereClause}`;
    const countResult = await db.prepare(countQuery).bind(...params).first() as { total: number } | null;
    const total = countResult?.total || 0;

    // Get submissions
    const submissionsQuery = `
      SELECT *
      FROM submissions
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;
    
    const result = await db.prepare(submissionsQuery).bind(...params, limit, offset).all();

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
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
} 