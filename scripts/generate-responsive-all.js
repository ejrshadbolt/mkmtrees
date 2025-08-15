import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');

// Responsive sizes optimized for 2025 web standards
const RESPONSIVE_SIZES = [
  { suffix: '-mobile', width: 480, quality: 70 },
  { suffix: '-tablet', width: 768, quality: 75 }, 
  { suffix: '-desktop', width: 1200, quality: 80 },
  { suffix: '-large', width: 1920, quality: 85 } // For hero/background images
];

async function generateResponsiveVersions(inputPath, baseName) {
  console.log(`📱 Generating responsive versions for ${baseName}`);
  
  for (const size of RESPONSIVE_SIZES) {
    const outputPath = path.join(PUBLIC_DIR, `${baseName}${size.suffix}.webp`);
    
    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`   ${size.suffix}: Already exists, skipping`);
      continue;
    }
    
    try {
      await sharp(inputPath)
        .resize(size.width, null, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ 
          quality: size.quality,
          effort: 6,
          smartSubsample: true
        })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      const sizeKB = stats.size / 1024;
      console.log(`   ✅ ${size.suffix}: ${sizeKB.toFixed(0)}KB`);
    } catch (error) {
      console.error(`   ❌ Error generating ${size.suffix}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Generating responsive versions for all images...\n');
  
  const files = fs.readdirSync(PUBLIC_DIR);
  const imageFiles = files.filter(file => 
    file.match(/\.webp$/i) && 
    !file.includes('-mobile') && 
    !file.includes('-tablet') && 
    !file.includes('-desktop') && 
    !file.includes('-large')
  );
  
  console.log(`Found ${imageFiles.length} base images to process\n`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const baseName = path.basename(file, '.webp');
    
    await generateResponsiveVersions(inputPath, baseName);
    console.log(''); // Empty line for readability
  }
  
  console.log('🎉 Responsive image generation complete!\n');
  
  // Show summary
  const allFiles = fs.readdirSync(PUBLIC_DIR);
  const responsiveFiles = allFiles.filter(f => f.match(/-mobile\.webp$|-tablet\.webp$|-desktop\.webp$|-large\.webp$/));
  console.log(`📊 Total responsive variants created: ${responsiveFiles.length}`);
  console.log(`📊 Images with full responsive sets: ${responsiveFiles.length / 4}`);
}

main().catch(console.error);