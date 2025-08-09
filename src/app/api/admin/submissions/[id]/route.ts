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

// GET /api/admin/submissions/[id] - Get a specific submission
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

    const submissionId = parseInt(resolvedParams.id);
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    const submission = await db.prepare('SELECT * FROM submissions WHERE id = ?')
      .bind(submissionId)
      .first();

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/submissions/[id] - Update a specific submission
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const submissionId = parseInt(resolvedParams.id);
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    const body = await request.json() as { action?: string; processed?: boolean };
    const { action, processed } = body;

    // Check if submission exists
    const existingSubmission = await db.prepare('SELECT * FROM submissions WHERE id = ?')
      .bind(submissionId)
      .first();

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    let updateQuery = '';
    let updateParams: unknown[] = [];

    if (action === 'mark_processed') {
      updateQuery = 'UPDATE submissions SET processed = 1, updated_at = ? WHERE id = ?';
      updateParams = [Date.now(), submissionId];
    } else if (action === 'mark_unprocessed') {
      updateQuery = 'UPDATE submissions SET processed = 0, updated_at = ? WHERE id = ?';
      updateParams = [Date.now(), submissionId];
    } else if (typeof processed === 'boolean') {
      updateQuery = 'UPDATE submissions SET processed = ?, updated_at = ? WHERE id = ?';
      updateParams = [processed ? 1 : 0, Date.now(), submissionId];
    } else {
      return NextResponse.json({ error: 'Invalid action or processed value' }, { status: 400 });
    }

    // Update submission
    await db.prepare(updateQuery).bind(...updateParams).run();

    // Get updated submission
    const updatedSubmission = await db.prepare('SELECT * FROM submissions WHERE id = ?')
      .bind(submissionId)
      .first();

    return NextResponse.json({
      data: updatedSubmission,
      message: 'Submission updated successfully'
    });

  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/submissions/[id] - Delete a specific submission
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

    const submissionId = parseInt(resolvedParams.id);
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    // Check if submission exists
    const existingSubmission = await db.prepare('SELECT * FROM submissions WHERE id = ?')
      .bind(submissionId)
      .first();

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Delete submission
    await db.prepare('DELETE FROM submissions WHERE id = ?').bind(submissionId).run();

    return NextResponse.json({ message: 'Submission deleted successfully' });

  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 