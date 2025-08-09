#!/usr/bin/env node

/**
 * Interactive admin user creation script for the small business template.
 * Creates admin users in the D1 database with proper password hashing.
 * 
 * Usage:
 *   node scripts/create-admin.js
 *   node scripts/create-admin.js --username admin --email admin@example.com --password mypassword
 *   node scripts/create-admin.js --local (for local development)
 *   node scripts/create-admin.js --production (for production database)
 */

import bcrypt from 'bcryptjs';
import { execSync } from 'child_process';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabaseName } from './config-reader.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(`--${name}`);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
};

const isLocal = args.includes('--local');
const isProduction = args.includes('--production');
const username = getArg('username');
const email = getArg('email');
const password = getArg('password');

// Create readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility function to prompt for input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

// Utility function to prompt for password (hidden input)
const promptPassword = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
    process.stdout.write('\n');
    resolve(answer);
  });
  
  // Hide the input
  rl.stdoutMuted = true;
  rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) {
      rl.output.write('*');
    } else {
      rl.output.write(stringToWrite);
    }
  };
  });
};

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUsername = (username) => {
  return username && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

const validatePassword = (password) => {
  return password && password.length >= 8; // Increased minimum length for production
};

// Enhanced password validation for production
const validateProductionPassword = (password) => {
  if (!password || password.length < 12) {
    return 'Password must be at least 12 characters long for production.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number.';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character.';
  }
  return null; // Valid password
};

// Check if user is authenticated with Cloudflare
const checkCloudflareAuth = () => {
  try {
    execSync('wrangler whoami', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
};

// Verify database exists and is accessible
const verifyDatabase = (environment) => {
  try {
    const databaseName = getDatabaseName();
    const command = environment === 'production' 
      ? `wrangler d1 execute ${databaseName} --remote --command="SELECT 1 as test;"`
      : `wrangler d1 execute ${databaseName} --local --command="SELECT 1 as test;"`;
    
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
};

async function createAdminUser() {
  try {
    console.log('🚀 Admin User Creation Tool');
    console.log('================================');
    
    // Determine environment
    let environment = 'local';
    if (isProduction) {
      environment = 'production';
    } else if (!isLocal && !isProduction) {
      const envChoice = await prompt('Environment (local/production) [local]: ');
      environment = envChoice.toLowerCase() || 'local';
    }
    
    console.log(`\n📍 Using ${environment} database`);
    
    // Production-specific checks
    if (environment === 'production') {
      console.log('\n🔐 Production Mode - Enhanced Security Checks');
      console.log('============================================');
      
      // Check Cloudflare authentication
      if (!checkCloudflareAuth()) {
        console.error('❌ Not authenticated with Cloudflare. Please run: wrangler login');
        process.exit(1);
      }
      console.log('✅ Cloudflare authentication verified');
      
      // Verify database access
      console.log('🔍 Verifying database access...');
      if (!verifyDatabase(environment)) {
        console.error('❌ Cannot access production database. Please check your configuration.');
        process.exit(1);
      }
      console.log('✅ Database access verified');
      
      // Production warning
      const confirm = await prompt('\n⚠️  You are creating a user in PRODUCTION. Continue? (yes/no): ');
      if (confirm.toLowerCase() !== 'yes') {
        console.log('👋 Operation cancelled');
        process.exit(0);
      }
    }
    
    // Get user details
    let userUsername = username;
    let userEmail = email;
    let userPassword = password;
    
    // Interactive prompts if not provided via CLI
    if (!userUsername) {
      do {
        userUsername = await prompt('\n👤 Username (3+ chars, alphanumeric): ');
        if (!validateUsername(userUsername)) {
          console.log('❌ Invalid username. Must be 3+ characters, alphanumeric and underscores only.');
        }
      } while (!validateUsername(userUsername));
    }
    
    if (!userEmail) {
      do {
        userEmail = await prompt('📧 Email address: ');
        if (!validateEmail(userEmail)) {
          console.log('❌ Invalid email format.');
        }
      } while (!validateEmail(userEmail));
    }
    
    if (!userPassword) {
      do {
        const passwordPrompt = environment === 'production' 
          ? '🔒 Password (12+ chars, uppercase, lowercase, number, special char): '
          : '🔒 Password (8+ chars): ';
        userPassword = await promptPassword(passwordPrompt);
        
        if (environment === 'production') {
          const validationError = validateProductionPassword(userPassword);
          if (validationError) {
            console.log(`❌ ${validationError}`);
            userPassword = null;
          }
        } else if (!validatePassword(userPassword)) {
          console.log('❌ Password must be at least 8 characters long.');
          userPassword = null;
        }
      } while (!userPassword);
    } else {
      // Validate provided password
      if (environment === 'production') {
        const validationError = validateProductionPassword(userPassword);
        if (validationError) {
          console.error(`❌ ${validationError}`);
          process.exit(1);
        }
      } else if (!validatePassword(userPassword)) {
        console.error('❌ Password must be at least 8 characters long.');
        process.exit(1);
      }
    }
    
    rl.close();
    
    console.log('\n🔐 Hashing password...');
    
    // Generate password hash using bcryptjs (same as auth system)
    const saltRounds = environment === 'production' ? 12 : 10; // Higher rounds for production
    const passwordHash = await bcrypt.hash(userPassword, saltRounds);
    
    console.log('💾 Creating user in database...');
    
    // Create a temporary SQL file to avoid command line escaping issues
    const tempSqlFile = path.join(__dirname, 'temp-user-creation.sql');
    const sql = `INSERT INTO users (username, email, password_hash, created_at, updated_at) 
VALUES ('${userUsername.replace(/'/g, "''")}', '${userEmail.replace(/'/g, "''")}', '${passwordHash.replace(/'/g, "''")}', unixepoch(), unixepoch()) 
ON CONFLICT(username) DO UPDATE SET 
  email = excluded.email, 
  password_hash = excluded.password_hash, 
  updated_at = unixepoch();`;
    
    // Write SQL to temporary file
    fs.writeFileSync(tempSqlFile, sql);
    
    // Build wrangler command using the file
    const databaseName = getDatabaseName();
    let command;
    if (environment === 'production') {
      command = `wrangler d1 execute ${databaseName} --remote --file="${tempSqlFile}"`;
    } else {
      command = `wrangler d1 execute ${databaseName} --local --file="${tempSqlFile}"`;
    }
    
    console.log('⚡ Executing database command...');
    
    try {
      execSync(command, { stdio: 'pipe', encoding: 'utf8' });
      
      // Clean up temporary file
      fs.unlinkSync(tempSqlFile);
      
      console.log('\n✅ Admin user created successfully!');
      console.log('================================');
      console.log(`👤 Username: ${userUsername}`);
      console.log(`📧 Email: ${userEmail}`);
      console.log(`🔒 Password: [hidden]`);
      console.log(`🌍 Environment: ${environment}`);
      
      if (environment === 'production') {
        console.log('\n⚠️  PRODUCTION SECURITY CHECKLIST:');
        console.log('===================================');
        console.log('1. Store credentials securely (password manager)');
        console.log('2. Change password after first login');
        console.log('3. Enable 2FA if available');
        console.log('4. Use strong, unique passwords');
        console.log('5. Limit admin access to trusted individuals');
        console.log('\n🌐 Login at your production domain/admin/login');
      } else {
        console.log(`\n🧪 You can now login with these credentials at http://localhost:8787/admin/login`);
      }
      
    } catch (execError) {
      // Clean up temporary file even on error
      if (fs.existsSync(tempSqlFile)) {
        fs.unlinkSync(tempSqlFile);
      }
      
      console.error('\n❌ Database command failed:');
      console.error(execError.message);
      
      // Try to provide helpful error messages
      if (execError.message.includes('UNIQUE constraint failed')) {
        console.log('\n💡 This username already exists. The user has been updated with new email/password.');
      } else if (execError.message.includes('no such table')) {
        console.log('\n💡 Database tables not found. Run database migrations first:');
        if (environment === 'production') {
          const databaseName = getDatabaseName();
          console.log(`   wrangler d1 execute ${databaseName} --remote --file=schema.sql`);
        } else {
          console.log('   npm run db:init');
        }
      } else if (execError.message.includes('authentication')) {
        console.log('\n💡 Authentication error. Please run: wrangler login');
      } else if (execError.message.includes('database not found')) {
        console.log('\n💡 Database not found. Please verify your wrangler.jsonc configuration.');
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Operation cancelled by user');
  rl.close();
  process.exit(0);
});

// Show usage if help is requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🚀 Admin User Creation Tool

Usage:
  node scripts/create-admin.js                          # Interactive mode
  node scripts/create-admin.js --local                  # Force local database
  node scripts/create-admin.js --production             # Force production database
  node scripts/create-admin.js --username admin --email admin@example.com --password mypass

Options:
  --username    Username for the admin user
  --email       Email address for the admin user  
  --password    Password for the admin user
  --local       Use local database (default)
  --production  Use production database
  --help, -h    Show this help message

Password Requirements:
  Local:        8+ characters
  Production:   12+ characters with uppercase, lowercase, number, and special character

Examples:
  node scripts/create-admin.js --username johndoe --email john@company.com
  node scripts/create-admin.js --production --username admin --email admin@company.com --password 'SecureP@ss123!'

Security Notes:
  - Production mode enforces stronger password requirements
  - All passwords are hashed with bcrypt (production uses higher rounds)
  - Temporary SQL files are automatically cleaned up
  - Authentication and database access are verified before operations
`);
  process.exit(0);
}

// Run the function
createAdminUser(); 