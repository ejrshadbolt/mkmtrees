import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const TARGET_SIZE_KB = 300; // Target max 300KB per image
const HERO_TARGET_SIZE_KB = 150; // Hero images even smaller for LCP

// Images that are likely hero/above-fold (prioritize these)
const HERO_IMAGES = [
  'homepage',
  'aboutus', 
  'contactuspage',
  'portfolio'
];

async function getOptimalSettings(inputPath, targetSizeKB) {
  const stats = fs.statSync(inputPath);
  const currentSizeKB = stats.size / 1024;
  
  // Start with aggressive settings and adjust
  let quality = 65;
  let width = 1200;
  
  // For very large files, be more aggressive
  if (currentSizeKB > 5000) {
    quality = 55;
    width = 1000;
  } else if (currentSizeKB > 2000) {
    quality = 60;
    width = 1100;
  }
  
  // Hero images get even more aggressive treatment
  if (HERO_IMAGES.some(hero => inputPath.includes(hero))) {
    quality = Math.min(quality - 10, 50);
    width = Math.min(width - 200, 800);
  }
  
  return { quality, width };
}

async function optimizeWithTargetSize(inputPath, outputPath, targetSizeKB) {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const isHero = HERO_IMAGES.some(hero => baseName.includes(hero));
  const targetSize = isHero ? HERO_TARGET_SIZE_KB : targetSizeKB;
  
  let { quality, width } = await getOptimalSettings(inputPath, targetSize);
  
  console.log(`🎯 Optimizing ${baseName} (${isHero ? 'HERO' : 'STANDARD'}) - Target: ${targetSize}KB`);
  
  let attempt = 0;
  const maxAttempts = 5;
  
  while (attempt < maxAttempts) {
    try {
      const tempPath = `${outputPath}.temp`;
      
      await sharp(inputPath)
        .resize(width, null, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ 
          quality,
          effort: 6,
          smartSubsample: true
        })
        .toFile(tempPath);
      
      const stats = fs.statSync(tempPath);
      const sizeKB = stats.size / 1024;
      
      console.log(`   Attempt ${attempt + 1}: ${sizeKB.toFixed(0)}KB (Q:${quality}, W:${width})`);
      
      if (sizeKB <= targetSize || attempt === maxAttempts - 1) {
        // Accept this result
        fs.renameSync(tempPath, outputPath);
        return {
          quality,
          width,
          finalSizeKB: sizeKB,
          attempts: attempt + 1
        };
      } else {
        // Need to be more aggressive
        fs.unlinkSync(tempPath);
        if (sizeKB > targetSize * 1.5) {
          // Much too large - reduce both
          quality = Math.max(quality - 15, 30);
          width = Math.max(width - 200, 600);
        } else {
          // Close but still too large - reduce quality more
          quality = Math.max(quality - 10, 30);
          width = Math.max(width - 100, 600);
        }
      }
      
      attempt++;
    } catch (error) {
      console.error(`Error on attempt ${attempt + 1}:`, error.message);
      attempt++;
    }
  }
  
  return null;
}

async function generateResponsiveSizes(inputPath, baseName) {
  console.log(`📱 Generating responsive sizes for ${baseName}`);
  
  const sizes = [
    { suffix: '-mobile', width: 480, quality: 65 },
    { suffix: '-tablet', width: 768, quality: 70 },
    { suffix: '-desktop', width: 1200, quality: 75 }
  ];
  
  for (const size of sizes) {
    const outputPath = path.join(PUBLIC_DIR, `${baseName}${size.suffix}.webp`);
    
    try {
      await sharp(inputPath)
        .resize(size.width, null, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ 
          quality: size.quality,
          effort: 6 
        })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      const sizeKB = stats.size / 1024;
      console.log(`   ${size.suffix}: ${sizeKB.toFixed(0)}KB`);
    } catch (error) {
      console.error(`Error generating ${size.suffix}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting aggressive optimization for LCP performance...\n');
  
  const files = fs.readdirSync(PUBLIC_DIR);
  const imageFiles = files.filter(file => file.match(/\.webp$/i));
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let optimizedCount = 0;
  const results = [];
  
  for (const file of imageFiles) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const baseName = path.basename(file, '.webp');
    const outputPath = path.join(PUBLIC_DIR, `${baseName}_optimized.webp`);
    
    const originalStats = fs.statSync(inputPath);
    const originalSizeKB = originalStats.size / 1024;
    
    console.log(`\n🔄 Processing: ${file} (${originalSizeKB.toFixed(0)}KB)`);
    
    const result = await optimizeWithTargetSize(inputPath, outputPath, TARGET_SIZE_KB);
    
    if (result) {
      // Replace original with optimized
      fs.unlinkSync(inputPath);
      fs.renameSync(outputPath, inputPath);
      
      totalOriginalSize += originalStats.size;
      totalNewSize += result.finalSizeKB * 1024;
      optimizedCount++;
      
      results.push({
        file: baseName,
        originalKB: originalSizeKB,
        finalKB: result.finalSizeKB,
        reduction: ((originalSizeKB - result.finalSizeKB) / originalSizeKB * 100),
        isHero: HERO_IMAGES.some(hero => baseName.includes(hero))
      });
      
      // Generate responsive sizes for hero images
      if (HERO_IMAGES.some(hero => baseName.includes(hero))) {
        await generateResponsiveSizes(inputPath, baseName);
      }
      
      console.log(`✅ ${baseName}: ${originalSizeKB.toFixed(0)}KB → ${result.finalSizeKB.toFixed(0)}KB`);
    }
  }
  
  console.log('\n🎉 Aggressive optimization complete!\n');
  console.log('📊 Final Results:');
  console.log(`   Files optimized: ${optimizedCount}`);
  console.log(`   Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB → ${(totalNewSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Total reduction: ${((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1)}%\n`);
  
  // Show breakdown by size
  const under100 = results.filter(r => r.finalKB < 100).length;
  const under200 = results.filter(r => r.finalKB < 200).length;
  const under300 = results.filter(r => r.finalKB < 300).length;
  const under500 = results.filter(r => r.finalKB < 500).length;
  
  console.log('📈 Size Distribution:');
  console.log(`   Under 100KB: ${under100} files`);
  console.log(`   Under 200KB: ${under200} files`);
  console.log(`   Under 300KB: ${under300} files`);
  console.log(`   Under 500KB: ${under500} files`);
  
  // Show hero images specifically
  const heroResults = results.filter(r => r.isHero);
  if (heroResults.length > 0) {
    console.log('\n🎯 Hero Images (LCP Priority):');
    heroResults.forEach(r => {
      console.log(`   ${r.file}: ${r.finalKB.toFixed(0)}KB (${r.reduction.toFixed(1)}% reduction)`);
    });
  }
  
  console.log('\n💡 Next steps:');
  console.log('   1. Update image references to use .webp extensions');
  console.log('   2. Implement responsive images for hero images');
  console.log('   3. Add proper loading="lazy" for non-hero images');
  console.log('   4. Consider using responsive sizes for mobile performance');
}

main().catch(console.error);