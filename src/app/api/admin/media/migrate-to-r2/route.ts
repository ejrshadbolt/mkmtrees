import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/lib/auth';

export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

interface MediaItem {
  id: number;
  url: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  alt_text: string | null;
  uploaded_by: number;
  created_at: string;
  r2_key: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // Get the Cloudflare environment
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const db = env.DB;
    const bucket = env.MEDIA_BUCKET;
    
    if (!db || !bucket) {
      return NextResponse.json({ 
        error: 'Database or storage not available'
      }, { status: 500 });
    }

    // Check authentication - only admins should be able to run migrations
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all media items with base64 data URLs that haven't been migrated yet
    const mediaItems = await db.prepare(`
      SELECT * FROM media 
      WHERE url LIKE 'data:%' AND (r2_key IS NULL OR r2_key = '')
      ORDER BY id
    `).all();

    if (!mediaItems.results || mediaItems.results.length === 0) {
      return NextResponse.json({
        message: 'No base64 media items found to migrate',
        migrated: 0
      });
    }

    let migrated = 0;
    let errors = 0;
    const migrationResults = [];

    for (const media of (mediaItems.results as unknown) as MediaItem[]) {
      try {
        // Extract base64 data from data URL
        const dataUrl = media.url as string;
        const base64Data = dataUrl.split(',')[1];
        
        if (!base64Data) {
          console.error(`Invalid data URL for media ${media.id}`);
          errors++;
          continue;
        }

        // Convert base64 to ArrayBuffer
        const binaryString = atob(base64Data);
        const bytes = new ArrayBuffer(binaryString.length);
        const byteArray = new Uint8Array(bytes);
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        // Generate R2 object key
        const objectKey = `media/${media.filename}`;

        // Upload to R2
        await bucket.put(objectKey, bytes, {
          httpMetadata: {
            contentType: media.mime_type,
            cacheControl: 'public, max-age=31536000',
          },
          customMetadata: {
            originalName: media.original_filename,
            uploadedBy: media.uploaded_by.toString(),
            uploadedAt: media.created_at.toString(),
            altText: media.alt_text || '',
            migratedFrom: 'base64',
          },
        });

        // Construct new public URL
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        const publicUrl = `${baseUrl}/api/media/${objectKey}`;

        // Update database record
        await db.prepare(`
          UPDATE media 
          SET url = ?, r2_key = ?, updated_at = ?
          WHERE id = ?
        `).bind(publicUrl, objectKey, Date.now(), media.id).run();

        migrated++;
        migrationResults.push({
          id: media.id,
          filename: media.filename,
          status: 'migrated',
          r2_key: objectKey
        });

        console.log(`Migrated media ${media.id}: ${media.filename} to R2`);

      } catch (error) {
        console.error(`Failed to migrate media ${media.id}:`, error);
        errors++;
        migrationResults.push({
          id: media.id,
          filename: media.filename,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      message: `Migration completed. ${migrated} items migrated, ${errors} errors.`,
      migrated,
      errors,
      total: mediaItems.results.length,
      results: migrationResults
    });

  } catch (error) {
    console.error('Error during R2 migration:', error);
    return NextResponse.json(
      { error: 'Failed to migrate media to R2' },
      { status: 500 }
    );
  }
} 