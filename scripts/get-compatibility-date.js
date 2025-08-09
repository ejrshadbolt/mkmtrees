#!/usr/bin/env node

/**
 * Simple script to output the compatibility date from wrangler config
 * Used in package.json scripts
 */

import { getCompatibilityDate } from './config-reader.js';

try {
  console.log(getCompatibilityDate());
} catch (error) {
  console.error('Error getting compatibility date:', error.message);
  process.exit(1);
}