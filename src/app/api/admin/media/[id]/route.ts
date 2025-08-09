import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database instance
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;

    const { id } = await context.params;

    const media = await db.prepare(`
      SELECT 
        m.*,
        u.username as uploaded_by_name
      FROM media m
      LEFT JOIN users u ON m.uploaded_by = u.id
      WHERE m.id = ?
    `).bind(id).first();

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ data: media });

  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Get the database instance
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json() as { alt_text?: string };
    const { alt_text } = body;

    // Check if media exists
    const existingMedia = await db.prepare('SELECT * FROM media WHERE id = ?')
      .bind(id)
      .first();

    if (!existingMedia) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Update media
    await db.prepare(`
      UPDATE media 
      SET alt_text = ?, updated_at = ?
      WHERE id = ?
    `).bind(alt_text || null, Date.now(), id).run();

    // Get updated media
    const updatedMedia = await db.prepare(`
      SELECT 
        m.*,
        u.username as uploaded_by_name
      FROM media m
      LEFT JOIN users u ON m.uploaded_by = u.id
      WHERE m.id = ?
    `).bind(id).first();

    return NextResponse.json({
      data: updatedMedia,
      message: 'Media updated successfully'
    });

  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database and bucket instances
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    const bucket = env.MEDIA_BUCKET;

    const { id } = await context.params;

    // Get media info before deletion
    const media = await db.prepare('SELECT * FROM media WHERE id = ?')
      .bind(id)
      .first() as { filename: string; url: string; r2_key?: string } | null;

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Check if media is being used by any posts
    const usedByPosts = await db.prepare('SELECT COUNT(*) as count FROM posts WHERE featured_image_id = ?')
      .bind(id)
      .first() as { count: number } | null;

    if (usedByPosts && usedByPosts.count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete media that is being used by posts' },
        { status: 400 }
      );
    }

    // Check if media is being used by any portfolio projects
    const usedByProjects = await db.prepare('SELECT COUNT(*) as count FROM portfolio_projects WHERE featured_image_id = ?')
      .bind(id)
      .first() as { count: number } | null;

    if (usedByProjects && usedByProjects.count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete media that is being used by portfolio projects' },
        { status: 400 }
      );
    }

    // Delete from database first
    await db.prepare('DELETE FROM media WHERE id = ?').bind(id).run();

    // If the media has an R2 key, delete the object from R2
    if (bucket && media.r2_key) {
      try {
        await bucket.delete(media.r2_key);
        console.log('Media file deleted from R2:', media.r2_key);
      } catch (error) {
        console.warn('Failed to delete file from R2:', error);
        // Don't fail the entire operation if R2 deletion fails
        // The database record has already been deleted
      }
    }

    console.log('Media deleted from database:', media.filename);

    return NextResponse.json({
      message: 'Media deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
} 