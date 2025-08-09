#!/usr/bin/env node

/**
 * Create a new project from the template
 * Usage: node scripts/create-project.js <project-name> [options]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getDatabaseName, getBucketName } from './config-reader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const projectName = args[0];
const options = {};

// Parse options
for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    options[key] = value || true;
  }
}

if (!projectName) {
  console.error('Usage: node scripts/create-project.js <project-name> [options]');
  console.error('');
  console.error('Options:');
  console.error('  --business-name="Your Business Name"');
  console.error('  --email="your@email.com"');
  console.error('  --phone="123-456-7890"');
  process.exit(1);
}

const projectPath = path.resolve(process.cwd(), '..', projectName);
const templatePath = path.resolve(__dirname, '..');

console.log(`Creating new project: ${projectName}`);
console.log(`Project path: ${projectPath}`);
console.log(`Template path: ${templatePath}`);

// Check if project directory already exists
if (fs.existsSync(projectPath)) {
  console.error(`Error: Directory ${projectName} already exists!`);
  process.exit(1);
}

// Create project directory
fs.mkdirSync(projectPath, { recursive: true });

// Copy template files
console.log('Copying template files...');
try {
  // Use cp command to copy all files except .git
  execSync(`cp -r "${templatePath}/." "${projectPath}/"`, { stdio: 'inherit' });
  
  // Remove .git directory if it exists
  const gitDir = path.join(projectPath, '.git');
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }
  
  console.log('Template files copied successfully!');
} catch (error) {
  console.error('Error copying template files:', error.message);
  process.exit(1);
}

// Update package.json
console.log('Updating package.json...');
const packageJsonPath = path.join(projectPath, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.name = projectName;
packageJson.version = '1.0.0';

// Update database references to use dynamic database name
if (packageJson.scripts['dev:local']) {
  try {
    const currentDbName = getDatabaseName();
    packageJson.scripts['dev:local'] = packageJson.scripts['dev:local'].replace(
      currentDbName,
      `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_cms`
    );
  } catch (error) {
    // Fallback to hardcoded replacement if config can't be read
    packageJson.scripts['dev:local'] = packageJson.scripts['dev:local'].replace(
      'small_business_cms',
      `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_cms`
    );
  }
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Update business configuration if options provided
if (options['business-name'] || options.email || options.phone) {
  console.log('Updating business configuration...');
  
  const businessConfigPath = path.join(projectPath, 'src/config/business.ts');
  let businessConfig = fs.readFileSync(businessConfigPath, 'utf8');
  
  if (options['business-name']) {
    businessConfig = businessConfig.replace(
      'name: "Your Business Name"',
      `name: "${options['business-name']}"`
    );
  }
  
  if (options.email) {
    businessConfig = businessConfig.replace(
      'email: "info@yourbusiness.com"',
      `email: "${options.email}"`
    );
  }
  
  if (options.phone) {
    businessConfig = businessConfig.replace(
      'phone: "123-456-7890"',
      `phone: "${options.phone}"`
    );
  }
  
  fs.writeFileSync(businessConfigPath, businessConfig);
}

// Create .env.example
console.log('Creating environment files...');
const envExample = `# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# Database Configuration
DATABASE_NAME=${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_cms

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Optional: Cloudflare R2 Storage
R2_BUCKET_NAME=${projectName.replace(/[^a-zA-Z0-9]/g, '-')}-media
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_REGION=auto

# Optional: Turnstile (Cloudflare CAPTCHA)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
`;

fs.writeFileSync(path.join(projectPath, '.env.example'), envExample);
fs.writeFileSync(path.join(projectPath, '.dev.vars'), envExample);

// Initialize git repository
console.log('Initializing git repository...');
try {
  execSync('git init', { cwd: projectPath, stdio: 'inherit' });
  execSync('git add .', { cwd: projectPath, stdio: 'inherit' });
  execSync('git commit -m "Initial commit from template"', { cwd: projectPath, stdio: 'inherit' });
  console.log('Git repository initialized!');
} catch (error) {
  console.warn('Warning: Could not initialize git repository:', error.message);
}

console.log('');
console.log('🎉 Project created successfully!');
console.log('');
console.log('Next steps:');
console.log(`1. cd ${projectName}`);
console.log('2. npm install');
console.log('3. Update .dev.vars with your Cloudflare credentials');
console.log('4. npm run db:schema');
console.log('5. npm run db:create-admin');
console.log('6. npm run dev:local');
console.log('');
console.log('📝 Customize your project:');
console.log('- Edit src/config/business.ts with your business information');
console.log('- Use page type components (src/components/page-types/) for consistent structure');
console.log('- Build custom pages with Claude Code using the page type components');
console.log('- Add your logo and images to public/images/');
console.log('');
console.log('🚀 Deploy when ready:');
console.log('- Set up Cloudflare Pages');
console.log('- npm run deploy');