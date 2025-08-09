import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

interface CloudflareEnv {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Get the Cloudflare environment
    const { env } = getRequestContext() as { env: CloudflareEnv };
    const bucket = env.MEDIA_BUCKET;
    
    if (!bucket) {
      return NextResponse.json({ 
        error: 'Storage not available'
      }, { status: 500 });
    }

    const { path } = await context.params;
    const objectKey = path.join('/');

    // Get the object from R2
    const object = await bucket.get(objectKey);
    
    if (!object) {
      // Log the missing file for debugging
      console.warn(`Media file not found in R2: ${objectKey}`);
      
      return NextResponse.json({ 
        error: 'File not found',
        message: 'This file may have been deleted from storage. Run sync from admin panel to clean up.'
      }, { status: 404 });
    }

    // Get the content type from the object metadata
    const contentType = object.httpMetadata?.contentType || 'application/octet-stream';
    
    // Create response with proper headers
    const response = new NextResponse(object.body);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    response.headers.set('ETag', object.etag);
    
    // Set Last-Modified if available
    if (object.uploaded) {
      response.headers.set('Last-Modified', object.uploaded.toUTCString());
    }

    return response;

  } catch (error) {
    console.error('Error serving media file:', error);
    return NextResponse.json(
      { error: 'Failed to serve media file' },
      { status: 500 }
    );
  }
} 