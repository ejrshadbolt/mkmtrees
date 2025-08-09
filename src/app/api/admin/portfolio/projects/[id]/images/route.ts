import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { CloudflareEnv } from '@/lib/types';

export const runtime = 'edge';

interface ProjectImageData {
  media_id: number;
  caption?: string;
  sort_order: number;
  image_type?: 'before' | 'after' | 'general' | 'progress';
}

// GET /api/admin/portfolio/projects/[id]/images - Get project images
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;

    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const query = `
      SELECT 
        ppi.*,
        m.url,
        m.alt_text,
        m.original_filename
      FROM portfolio_project_images ppi
      JOIN media m ON ppi.media_id = m.id
      WHERE ppi.project_id = ?
      ORDER BY ppi.sort_order ASC
    `;

    const result = await db.prepare(query).bind(id).all();
    
    return NextResponse.json({
      images: result.results || []
    });

  } catch (error) {
    console.error('Error fetching project images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/portfolio/projects/[id]/images - Add project image
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;

    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const body = await request.json() as ProjectImageData;
    const { media_id, caption, sort_order, image_type } = body;

    if (!media_id) {
      return NextResponse.json({ error: 'media_id is required' }, { status: 400 });
    }

    // Check if the project exists
    const projectCheck = await db.prepare(
      'SELECT id FROM portfolio_projects WHERE id = ?'
    ).bind(id).first();

    if (!projectCheck) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if the media exists
    const mediaCheck = await db.prepare(
      'SELECT id FROM media WHERE id = ?'
    ).bind(media_id).first();

    if (!mediaCheck) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Insert the project image
    const insertQuery = `
      INSERT INTO portfolio_project_images (project_id, media_id, caption, sort_order, image_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.prepare(insertQuery).bind(
      id,
      media_id,
      caption || null,
      sort_order || 0,
      image_type || 'general'
    ).run();

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error('Error adding project image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/portfolio/projects/[id]/images - Update project images (batch update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;

    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const body = await request.json() as { images: ProjectImageData[] };
    const { images } = body;

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'images must be an array' }, { status: 400 });
    }

    // Check if the project exists
    const projectCheck = await db.prepare(
      'SELECT id FROM portfolio_projects WHERE id = ?'
    ).bind(id).first();

    if (!projectCheck) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete existing images for this project
    await db.prepare(
      'DELETE FROM portfolio_project_images WHERE project_id = ?'
    ).bind(id).run();

    // Insert new images
    for (const image of images) {
      const insertQuery = `
        INSERT INTO portfolio_project_images (project_id, media_id, caption, sort_order, image_type)
        VALUES (?, ?, ?, ?, ?)
      `;

      await db.prepare(insertQuery).bind(
        id,
        image.media_id,
        image.caption || null,
        image.sort_order || 0,
        image.image_type || 'general'
      ).run();
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating project images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 