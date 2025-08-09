/**
 * Utility to read wrangler.jsonc configuration dynamically
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to parse JSONC (JSON with comments)
function parseJsonc(content) {
  // Remove comments and trailing commas
  const cleaned = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
    .replace(/\/\/.*$/gm, '') // Remove // comments
    .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
  
  return JSON.parse(cleaned);
}

// Read wrangler configuration
export function getWranglerConfig(env = 'development') {
  const configPath = path.join(__dirname, '..', 'wrangler.jsonc');
  
  if (!fs.existsSync(configPath)) {
    throw new Error('wrangler.jsonc not found');
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  const config = parseJsonc(content);
  
  // Get environment-specific config or default
  const envConfig = config.env?.[env] || {};
  
  // Merge default config with environment-specific config
  return {
    ...config,
    ...envConfig
  };
}

// Get database name from wrangler config
export function getDatabaseName(env = 'development') {
  const config = getWranglerConfig(env);
  const databases = config.d1_databases || [];
  
  if (databases.length === 0) {
    throw new Error('No D1 databases found in wrangler.jsonc');
  }
  
  // Return the first database name
  return databases[0].database_name;
}

// Get R2 bucket name from wrangler config
export function getBucketName(env = 'development') {
  const config = getWranglerConfig(env);
  const buckets = config.r2_buckets || [];
  
  if (buckets.length === 0) {
    throw new Error('No R2 buckets found in wrangler.jsonc');
  }
  
  // Return the first bucket name
  return buckets[0].bucket_name;
}

// Get project name from wrangler config
export function getProjectName() {
  const config = getWranglerConfig();
  return config.name || 'small-business-cms';
}

// Get compatibility date from wrangler config
export function getCompatibilityDate() {
  const config = getWranglerConfig();
  return config.compatibility_date || '2025-03-01';
}