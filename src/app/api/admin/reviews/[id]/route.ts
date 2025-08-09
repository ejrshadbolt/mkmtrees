import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/reviews/[id] - Get a specific review
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

    const reviewId = parseInt(resolvedParams.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    const review = await db.prepare(`
      SELECT 
        r.*,
        m.url as reviewer_image_url
      FROM reviews r
      LEFT JOIN media m ON r.reviewer_image_id = m.id
      WHERE r.id = ?
    `)
      .bind(reviewId)
      .first();

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    // Get the database instance
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

    const reviewId = parseInt(resolvedParams.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    const body = await request.json() as { action?: string; approved?: boolean };
    const { action, approved } = body;

    // Check if review exists
    const existingReview = await db.prepare('SELECT * FROM reviews WHERE id = ?')
      .bind(reviewId)
      .first();

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    let updateQuery = '';
    let updateParams: unknown[] = [];

    if (action === 'approve') {
      updateQuery = 'UPDATE reviews SET approved = 1, updated_at = ? WHERE id = ?';
      updateParams = [Date.now(), reviewId];
    } else if (action === 'reject') {
      updateQuery = 'UPDATE reviews SET approved = 0, updated_at = ? WHERE id = ?';
      updateParams = [Date.now(), reviewId];
    } else if (typeof approved === 'boolean') {
      updateQuery = 'UPDATE reviews SET approved = ?, updated_at = ? WHERE id = ?';
      updateParams = [approved ? 1 : 0, Date.now(), reviewId];
    } else {
      return NextResponse.json({ error: 'Invalid action or approved value' }, { status: 400 });
    }

    // Update review
    await db.prepare(updateQuery).bind(...updateParams).run();

    // Get updated review
    const updatedReview = await db.prepare(`
      SELECT 
        r.*,
        m.url as reviewer_image_url
      FROM reviews r
      LEFT JOIN media m ON r.reviewer_image_id = m.id
      WHERE r.id = ?
    `).bind(reviewId).first();

    return NextResponse.json({
      data: updatedReview,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    // Get the database instance
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

    const reviewId = parseInt(resolvedParams.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    // Check if review exists
    const existingReview = await db.prepare('SELECT * FROM reviews WHERE id = ?')
      .bind(reviewId)
      .first();

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Delete review
    await db.prepare('DELETE FROM reviews WHERE id = ?').bind(reviewId).run();

    return NextResponse.json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 