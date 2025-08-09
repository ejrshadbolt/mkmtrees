#!/usr/bin/env node

/**
 * Simple script to output the database name from wrangler config
 * Used in package.json scripts
 */

import { getDatabaseName } from './config-reader.js';

try {
  console.log(getDatabaseName());
} catch (error) {
  console.error('Error getting database name:', error.message);
  process.exit(1);
}