import { D1Database } from '@cloudflare/workers-types';

// Type for Cloudflare request with bindings
interface CloudflareRequest {
  env?: {
    DB: D1Database;
    macell_electrical_cms?: D1Database;
  };
  DB?: D1Database;
  cf?: {
    env?: {
      DB?: D1Database;
      macell_electrical_cms?: D1Database;
    };
  };
}

// Type for globalThis with potential D1 binding
interface GlobalWithD1 {
  DB?: D1Database;
  macell_electrical_cms?: D1Database;
  process?: {
    env?: {
      CF_PAGES?: string;
      CLOUDFLARE_LOCAL_MODE?: string;
    };
  };
  __env?: {
    DB?: D1Database;
    macell_electrical_cms?: D1Database;
  };
  // Add more potential binding locations for wrangler dev
  MINIFLARE_BINDINGS?: {
    DB?: D1Database;
    macell_electrical_cms?: D1Database;
  };
  // Add other potential locations
  [key: string]: unknown;
}

// Function to get database through next-on-pages context
function getDatabaseFromNextOnPages(): D1Database | null {
  try {
    // Try to import and use getRequestContext from @cloudflare/next-on-pages
    // This is the proper way to access bindings in next-on-pages
    let getRequestContext: (() => { env?: { DB?: D1Database } }) | null = null;
    
    // Try to access getRequestContext from the global context
    try {
      // In the bundled worker, next-on-pages might be available globally
      const nextOnPages = (globalThis as Record<string, unknown>).__nextOnPages;
      if (nextOnPages && typeof nextOnPages === 'object' && nextOnPages !== null && 'getRequestContext' in nextOnPages) {
        getRequestContext = (nextOnPages as { getRequestContext: () => { env?: { DB?: D1Database } } }).getRequestContext;
      }
    } catch {
      // Ignore errors
    }

    // Try alternative access methods
    if (!getRequestContext) {
      try {
        // Check if it's available on the global object
        const globalContext = (globalThis as Record<string, unknown>).getRequestContext;
        if (typeof globalContext === 'function') {
          getRequestContext = globalContext as () => { env?: { DB?: D1Database } };
        }
      } catch {
        // Ignore errors
      }
    }

    if (getRequestContext) {
      console.log('Found getRequestContext, attempting to get database');
      const context = getRequestContext();
      if (context?.env?.DB) {
        console.log('Successfully found database through next-on-pages context');
        return context.env.DB;
      }
    }
  } catch (error) {
    console.log('Error accessing next-on-pages context:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  return null;
}

// Simplified debugging function to find the database
function debugDatabaseAccess() {
  console.log('=== DEBUG: Searching for D1 database bindings ===');
  
  // First try next-on-pages context
  const contextDb = getDatabaseFromNextOnPages();
  if (contextDb) return contextDb;
  
  // Log all global keys that might be relevant
  const allKeys = Object.keys(globalThis);
  const relevantKeys = allKeys.filter(key => 
    key.toLowerCase().includes('db') || 
    key.toLowerCase().includes('d1') ||
    key.toLowerCase().includes('macell') || 
    key.toLowerCase().includes('env') || 
    key.toLowerCase().includes('binding') ||
    key.toLowerCase().includes('next') ||
    key.toLowerCase().includes('context')
  );
  console.log('Relevant globalThis keys:', relevantKeys);
  
  // Check if any global variables contain database objects
  for (const key of relevantKeys) {
    const value = (globalThis as Record<string, unknown>)[key];
    if (value && typeof value === 'object') {
      console.log(`Global ${key}:`, typeof value, Object.keys(value as Record<string, unknown>));
      
      // Check if this object has D1 database methods
      if ((value as Record<string, unknown>).prepare && typeof (value as Record<string, unknown>).prepare === 'function') {
        console.log(`*** FOUND POTENTIAL D1 DATABASE AT globalThis.${key} ***`);
        return value as D1Database;
      }
    }
  }
  
  return null;
}

// For Cloudflare Pages, we access the database through the runtime context
export function getDatabase(): D1Database | null {
  try {
    console.log('Development mode: Searching for database...');
    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      CF_PAGES: process.env.CF_PAGES,
      CLOUDFLARE_LOCAL_MODE: process.env.CLOUDFLARE_LOCAL_MODE
    });

    // First try next-on-pages context
    const contextDb = getDatabaseFromNextOnPages();
    if (contextDb) return contextDb;
    
    const globalWithD1 = globalThis as unknown as GlobalWithD1;
    
    // Check multiple potential database binding locations
    if (typeof globalThis !== 'undefined') {
      console.log('Checking globalThis for database bindings...');
      
      // Try direct DB binding
      if (globalWithD1.DB) {
        console.log('Development mode: Found database via globalThis.DB');
        return globalWithD1.DB;
      }
      
      // Try named database binding
      if (globalWithD1.macell_electrical_cms) {
        console.log('Development mode: Found database via globalThis.macell_electrical_cms');
        return globalWithD1.macell_electrical_cms;
      }
      
      // Try __env object (sometimes used by Wrangler)
      if (globalWithD1.__env?.DB) {
        console.log('Development mode: Found database via globalThis.__env.DB');
        return globalWithD1.__env.DB;
      }
      
      if (globalWithD1.__env?.macell_electrical_cms) {
        console.log('Development mode: Found database via globalThis.__env.macell_electrical_cms');
        return globalWithD1.__env.macell_electrical_cms;
      }

      // Try MINIFLARE_BINDINGS (used by Miniflare/Wrangler)
      if (globalWithD1.MINIFLARE_BINDINGS?.DB) {
        console.log('Development mode: Found database via globalThis.MINIFLARE_BINDINGS.DB');
        return globalWithD1.MINIFLARE_BINDINGS.DB;
      }

      if (globalWithD1.MINIFLARE_BINDINGS?.macell_electrical_cms) {
        console.log('Development mode: Found database via globalThis.MINIFLARE_BINDINGS.macell_electrical_cms');
        return globalWithD1.MINIFLARE_BINDINGS.macell_electrical_cms;
      }
    }

    // Try the debug function as a last resort
    console.log('Trying debug function to search all globals...');
    const db = debugDatabaseAccess();
    if (db) return db;
    
    console.log('Development mode: No database found');
    console.log('Please ensure you are running "npm run dev:local" which includes the D1 binding');
    console.log('If the issue persists, check that the local D1 database exists and is properly configured');
    return null;
  } catch (error) {
    console.error('Error getting database context:', error);
    return null;
  }
}

export function getDatabaseFromRequest(request: Request): D1Database | null {
  try {
    console.log('Checking request for database binding...');

    // First try next-on-pages context (this is the most reliable method)
    const contextDb = getDatabaseFromNextOnPages();
    if (contextDb) return contextDb;
    
    const cfRequest = request as unknown as CloudflareRequest;
    
    // In Cloudflare Pages Functions, the env is available on the request context
    // Check for Cloudflare binding in request object
    if (cfRequest.env?.DB) {
      console.log('Found database from request.env.DB');
      return cfRequest.env.DB;
    }
    
    if (cfRequest.env?.macell_electrical_cms) {
      console.log('Found database from request.env.macell_electrical_cms');
      return cfRequest.env.macell_electrical_cms;
    }

    // Check for direct database binding on request
    if (cfRequest.DB) {
      console.log('Found database from request.DB');
      return cfRequest.DB;
    }
    
    // Check cf object
    if (cfRequest.cf?.env?.DB) {
      console.log('Found database from request.cf.env.DB');
      return cfRequest.cf.env.DB;
    }
    
    if (cfRequest.cf?.env?.macell_electrical_cms) {
      console.log('Found database from request.cf.env.macell_electrical_cms');
      return cfRequest.cf.env.macell_electrical_cms;
    }

    // Check runtime context for database
    if (typeof globalThis !== 'undefined') {
      const globalWithD1 = globalThis as unknown as GlobalWithD1;
      
      // In wrangler dev mode, check for DB in global context
      if (globalWithD1.DB) {
        console.log('Found database from globalThis.DB');
        return globalWithD1.DB;
      }
      
      if (globalWithD1.macell_electrical_cms) {
        console.log('Found database from globalThis.macell_electrical_cms');
        return globalWithD1.macell_electrical_cms;
      }

      // Check for Cloudflare Worker environment variables
      if (globalWithD1.process?.env?.CF_PAGES || globalWithD1.process?.env?.CLOUDFLARE_LOCAL_MODE) {
        console.log('In Cloudflare Worker environment, checking __env...');
        if (globalWithD1.__env?.DB) {
          console.log('Found database from globalThis.__env.DB');
          return globalWithD1.__env.DB;
        }
        if (globalWithD1.__env?.macell_electrical_cms) {
          console.log('Found database from globalThis.__env.macell_electrical_cms');
          return globalWithD1.__env.macell_electrical_cms;
        }
      }

      // Try MINIFLARE_BINDINGS (used by Miniflare/Wrangler)
      if (globalWithD1.MINIFLARE_BINDINGS?.DB) {
        console.log('Found database from globalThis.MINIFLARE_BINDINGS.DB');
        return globalWithD1.MINIFLARE_BINDINGS.DB;
      }

      if (globalWithD1.MINIFLARE_BINDINGS?.macell_electrical_cms) {
        console.log('Found database from globalThis.MINIFLARE_BINDINGS.macell_electrical_cms');
        return globalWithD1.MINIFLARE_BINDINGS.macell_electrical_cms;
      }
    }

    // Fallback for development
    console.log('No database found in request context, trying fallback');
    return getDatabase();
  } catch (error) {
    console.error('Error getting database from request:', error);
    return null;
  }
}

// Pages-specific function to get database from function context
export function getDatabaseFromContext(context: { env?: { DB: D1Database } }): D1Database | null {
  try {
    if (context?.env?.DB) {
      console.log('Using database from function context');
      return context.env.DB;
    }
    console.log('No database in function context');
    return null;
  } catch (error) {
    console.error('Error getting database from context:', error);
    return null;
  }
} 