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
    const status = url.searchParams.get('status') || 'all'; // 'active', 'unsubscribed', 'bounced', or 'all'
    const export_csv = url.searchParams.get('export') === 'csv';
    const sort_by = url.searchParams.get('sort_by') || 'subscribed_at';
    const sort_order = url.searchParams.get('sort_order') || 'desc';

    // Handle CSV export
    if (export_csv) {
      let whereClause = '';
      const params: unknown[] = [];

      if (search) {
        whereClause = 'WHERE email LIKE ?';
        params.push(`%${search}%`);
      }

      if (status !== 'all') {
        if (whereClause) {
          whereClause += ' AND status = ?';
        } else {
          whereClause = 'WHERE status = ?';
        }
        params.push(status);
      }

      const exportQuery = `
        SELECT email, status, subscribed_at, unsubscribed_at, source
        FROM newsletter_subscribers
        ${whereClause}
        ORDER BY ${sort_by} ${sort_order.toUpperCase()}
      `;

      const result = await db.prepare(exportQuery).bind(...params).all();
      const subscribers = result.results || [];

      // Generate CSV content
      const headers = ['Email', 'Status', 'Subscribed Date', 'Unsubscribed Date', 'Source'];
      const csvContent = [
        headers.join(','),
               ...subscribers.map((sub: Record<string, unknown>) => [
         `"${sub.email}"`,
         `"${sub.status}"`,
         `"${new Date((sub.subscribed_at as number) * 1000).toISOString().split('T')[0]}"`,
         sub.unsubscribed_at ? `"${new Date((sub.unsubscribed_at as number) * 1000).toISOString().split('T')[0]}"` : '""',
         `"${sub.source || 'website'}"`
       ].join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Regular pagination query
    const offset = (page - 1) * limit;

    // Build the query based on filters
    let whereClause = '';
    const params: unknown[] = [];

    if (search) {
      whereClause = 'WHERE email LIKE ?';
      params.push(`%${search}%`);
    }

    if (status !== 'all') {
      if (whereClause) {
        whereClause += ' AND status = ?';
      } else {
        whereClause = 'WHERE status = ?';
      }
      params.push(status);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM newsletter_subscribers ${whereClause}`;
    const countResult = await db.prepare(countQuery).bind(...params).first() as { total: number } | null;
    const total = countResult?.total || 0;

    // Get subscribers
    const subscribersQuery = `
      SELECT *
      FROM newsletter_subscribers
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;
    
    const result = await db.prepare(subscribersQuery).bind(...params, limit, offset).all();

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
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter subscribers' },
      { status: 500 }
    );
  }
} 