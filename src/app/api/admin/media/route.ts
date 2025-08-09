import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Configure for Cloudflare Pages edge runtime
export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
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
    const type = url.searchParams.get('type') || '';

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereClause = '';
    const params: unknown[] = [];

    if (search) {
      whereClause = 'WHERE (original_filename LIKE ? OR alt_text LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (type) {
      if (whereClause) {
        whereClause += ' AND mime_type LIKE ?';
      } else {
        whereClause = 'WHERE mime_type LIKE ?';
      }
      params.push(`${type}/%`);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM media ${whereClause}`;
    const countResult = await db.prepare(countQuery).bind(...params).first() as { total: number } | null;
    const total = countResult?.total || 0;

    // Get media items
    const query = `
      SELECT 
        m.*,
        u.username as uploaded_by_name
      FROM media m
      LEFT JOIN users u ON m.uploaded_by = u.id
      ${whereClause}
      ORDER BY m.created_at DESC
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
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the Cloudflare environment bindings
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    const bucket = env.MEDIA_BUCKET;
    
    if (!db) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'D1 database binding not found'
      }, { status: 500 });
    }

    if (!bucket) {
      return NextResponse.json({ 
        error: 'Storage not available',
        message: 'R2 bucket binding not found'
      }, { status: 500 });
    }

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altText = formData.get('altText') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
    const objectKey = `media/${filename}`;

    // Convert file to ArrayBuffer for R2 upload
    const bytes = await file.arrayBuffer();

    // Upload to R2
    await bucket.put(objectKey, bytes, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000', // 1 year cache
      },
      customMetadata: {
        originalName: file.name,
        uploadedBy: session.user.id,
        uploadedAt: timestamp.toString(),
        altText: altText,
      },
    });

    // Construct the public URL using our API endpoint
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const publicUrl = `${baseUrl}/api/media/${objectKey}`;

    // Get image dimensions if it's an image
    let width: number | null = null;
    let height: number | null = null;

    if (file.type.startsWith('image/')) {
      try {
        // For now, we'll set default values
        // In production, you could use Cloudflare Images API or a library to get actual dimensions
        width = 1920; // Default width
        height = 1080; // Default height
      } catch (error) {
        console.warn('Could not get image dimensions:', error);
      }
    }

    // Save metadata to database with R2 reference
    const mediaData = {
      filename,
      original_filename: file.name,
      mime_type: file.type,
      size: file.size,
      width,
      height,
      url: publicUrl,
      r2_key: objectKey, // Store the R2 object key for future reference
      alt_text: altText,
      uploaded_by: parseInt(session.user.id),
      created_at: Date.now(),
      updated_at: Date.now()
    };

    const result = await db.prepare(`
      INSERT INTO media (filename, original_filename, mime_type, size, width, height, url, r2_key, alt_text, uploaded_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      mediaData.filename,
      mediaData.original_filename,
      mediaData.mime_type,
      mediaData.size,
      mediaData.width,
      mediaData.height,
      mediaData.url,
      mediaData.r2_key,
      mediaData.alt_text,
      mediaData.uploaded_by,
      mediaData.created_at,
      mediaData.updated_at
    ).run();

    // Return the created media item
    const createdMedia = await db.prepare('SELECT * FROM media WHERE id = ?')
      .bind(result.meta.last_row_id)
      .first();

    return NextResponse.json({
      data: createdMedia,
      message: 'Media uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
} 