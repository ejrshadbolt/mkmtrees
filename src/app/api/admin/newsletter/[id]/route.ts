import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    const resolvedParams = await params;
    const subscriberId = parseInt(resolvedParams.id);
    if (isNaN(subscriberId)) {
      return NextResponse.json({ error: 'Invalid subscriber ID' }, { status: 400 });
    }

    const body = await request.json() as { status: string };
    const { status } = body;

    // Validate status
    if (!['active', 'unsubscribed', 'bounced'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be active, unsubscribed, or bounced' 
      }, { status: 400 });
    }

    // Check if subscriber exists
    const subscriber = await db
      .prepare('SELECT id FROM newsletter_subscribers WHERE id = ?')
      .bind(subscriberId)
      .first();

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    // Update subscriber status
    const updateQuery = status === 'unsubscribed' 
      ? 'UPDATE newsletter_subscribers SET status = ?, unsubscribed_at = unixepoch() WHERE id = ?'
      : 'UPDATE newsletter_subscribers SET status = ?, unsubscribed_at = NULL WHERE id = ?';

    const result = await db
      .prepare(updateQuery)
      .bind(status, subscriberId)
      .run();

    if (!result.success) {
      throw new Error('Failed to update subscriber');
    }

    return NextResponse.json({
      message: 'Subscriber status updated successfully'
    });

  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    const resolvedParams2 = await params;
    const subscriberId = parseInt(resolvedParams2.id);
    if (isNaN(subscriberId)) {
      return NextResponse.json({ error: 'Invalid subscriber ID' }, { status: 400 });
    }

    // Check if subscriber exists
    const subscriber = await db
      .prepare('SELECT id FROM newsletter_subscribers WHERE id = ?')
      .bind(subscriberId)
      .first();

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    // Delete subscriber
    const result = await db
      .prepare('DELETE FROM newsletter_subscribers WHERE id = ?')
      .bind(subscriberId)
      .run();

    if (!result.success) {
      throw new Error('Failed to delete subscriber');
    }

    return NextResponse.json({
      message: 'Subscriber deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
} 