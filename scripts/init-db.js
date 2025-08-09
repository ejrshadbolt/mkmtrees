#!/usr/bin/env node

/**
 * This script initializes the D1 database using Wrangler CLI
 * Before running, make sure you have:
 * 1. Authenticated with Cloudflare (wrangler login)
 * 2. Created a D1 database (wrangler d1 create YOUR_DATABASE_NAME)
 * 3. Updated the database_id in wrangler.jsonc with the ID from step 2
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabaseName } from './config-reader.js';

// Calculate __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the schema file
const schemaPath = path.join(__dirname, '..', 'schema.sql');

// Check if schema file exists
if (!fs.existsSync(schemaPath)) {
  console.error('Error: schema.sql file not found!');
  process.exit(1);
}

async function initializeDatabase() {
  console.log('Initializing D1 database...');

  try {
    // Get database name from config
    const databaseName = getDatabaseName();
    
    // Try to apply the schema to D1 database
    try {
      console.log('Applying schema...');
      execSync(`wrangler d1 execute ${databaseName} --file=${schemaPath}`, { stdio: 'inherit' });
      console.log('Database schema applied successfully!');
    } catch (schemaError) {
      // If tables already exist, this is expected
      if (schemaError.message && schemaError.message.includes('already exists')) {
        console.log('Tables already exist, skipping schema creation.');
      } else {
        // If it's another error, rethrow it
        throw schemaError;
      }
    }
    
    console.log('Database initialization completed!');
    console.log('');
    console.log('🔐 SECURITY NOTICE:');
    console.log('===================');
    console.log('No default admin users have been created for security reasons.');
    console.log('To create your first admin user, run:');
    console.log('');
    console.log('  node scripts/create-admin.js --local');
    console.log('');
    console.log('This will guide you through creating a secure admin account.');
    
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
}

// Run the initialization function
initializeDatabase(); 