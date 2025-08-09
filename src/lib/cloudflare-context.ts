import { getRequestContext } from '@cloudflare/next-on-pages';
import { D1Database } from '@cloudflare/workers-types';

interface CloudflareEnv {
  DB: D1Database;
}

/**
 * Safely get the Cloudflare context and database
 * Returns null during build time to prevent errors
 */
export function getCloudflareContext(): { env: CloudflareEnv } | null {
  try {
    // Check if we're in a build context
    if (process.env.NODE_ENV === 'production' && !process.env.CF_PAGES) {
      // During build time, CF_PAGES won't be set
      return null;
    }
    
    const context = getRequestContext() as { env: CloudflareEnv };
    return context;
  } catch (error) {
    // During build or when context is not available
    console.warn('Cloudflare context not available:', error);
    return null;
  }
}

/**
 * Get the D1 database from Cloudflare context
 * Returns null during build time
 */
export function getDatabase(): D1Database | null {
  const context = getCloudflareContext();
  return context?.env?.DB || null;
} 