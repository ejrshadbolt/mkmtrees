import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/lib/auth';

export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

interface MediaRecord {
  id: number;
  filename: string;
  r2_key: string;
  url: string;
  original_filename: string;
}

export async function POST() {
  try {
    // Check authentication - only admins should be able to run sync
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the Cloudflare environment
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

    // Get all media records from database that have R2 keys
    const mediaRecords = await db.prepare(`
      SELECT id, filename, r2_key, url, original_filename 
      FROM media 
      WHERE r2_key IS NOT NULL AND r2_key != ''
      ORDER BY id
    `).all();

    if (!mediaRecords.results || mediaRecords.results.length === 0) {
      return NextResponse.json({
        message: 'No R2 media records found to sync',
        checked: 0,
        removed: 0
      });
    }

    let checked = 0;
    let removed = 0;
    let errors = 0;
    const syncResults = [];

    for (const media of (mediaRecords.results as unknown) as MediaRecord[]) {
      try {
        checked++;
        
        // Check if the file exists in R2
        const object = await bucket.head(media.r2_key);
        
        if (!object) {
          // File doesn't exist in R2, remove from database
          await db.prepare('DELETE FROM media WHERE id = ?').bind(media.id).run();
          removed++;
          
          syncResults.push({
            id: media.id,
            filename: media.original_filename,
            r2_key: media.r2_key,
            status: 'removed_from_db',
            reason: 'file_not_found_in_r2'
          });
          
          console.log(`Removed orphaned media record ${media.id}: ${media.original_filename}`);
        } else {
          syncResults.push({
            id: media.id,
            filename: media.original_filename,
            r2_key: media.r2_key,
            status: 'exists',
            reason: 'file_found_in_r2'
          });
        }

      } catch (error) {
        console.error(`Error checking media ${media.id}:`, error);
        errors++;
        syncResults.push({
          id: media.id,
          filename: media.original_filename,
          r2_key: media.r2_key,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      message: `Sync completed. Checked ${checked} files, removed ${removed} orphaned records, ${errors} errors.`,
      checked,
      removed,
      errors,
      results: syncResults
    });

  } catch (error) {
    console.error('Error during media sync:', error);
    return NextResponse.json(
      { error: 'Failed to sync media with R2' },
      { status: 500 }
    );
  }
} 