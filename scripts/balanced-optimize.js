import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    const originalSizeMB = originalSize / 1024 / 1024;
    
    // Determine quality based on original file size and use case
    let quality = 85; // Start with higher base quality
    let maxWidth = 1920; // Allow larger images
    
    // For very large files (>10MB), be more aggressive but still preserve quality
    if (originalSizeMB > 10) {
      quality = 80;
      maxWidth = 1600;
    } else if (originalSizeMB > 5) {
      quality = 82;
      maxWidth = 1800;
    }
    
    // Apply additional quality for specific image types
    const filename = path.basename(inputPath).toLowerCase();
    
    // Hero/important images get highest quality
    if (filename.includes('homepage') || filename.includes('aboutus') || 
        filename.includes('portfolio') || filename.includes('contactuspage')) {
      quality = Math.min(quality + 5, 90);
    }
    
    console.log(`🔄 Processing: ${path.basename(inputPath)}`);
    console.log(`   Original: ${originalSizeMB.toFixed(1)}MB`);
    console.log(`   Settings: Q${quality}, Max width: ${maxWidth}px`);
    
    await sharp(inputPath)
      .resize(maxWidth, null, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ 
        quality: quality,
        effort: 6, // Max compression effort
        smartSubsample: true,
        nearLossless: false // Use lossy for better compression
      })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const newSizeMB = newSize / 1024 / 1024;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`   Result: ${newSizeMB.toFixed(1)}MB (${reduction}% reduction)`);
    console.log('');
    
    return { originalSize, newSize, reduction: parseFloat(reduction) };
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎨 Starting balanced image optimization...\n');
  console.log('Target: High quality with reasonable file sizes\n');
  
  const files = fs.readdirSync(PUBLIC_DIR);
  const imageFiles = files.filter(file => file.match(/\.(jpe?g|png)$/i));
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let optimizedCount = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    
    let outputPath;
    let result;
    
    if (ext === '.png') {
      // Keep PNGs as PNG but optimize them
      outputPath = path.join(PUBLIC_DIR, `${baseName}_optimized.png`);
      
      try {
        const stats = fs.statSync(inputPath);
        const originalSize = stats.size;
        
        await sharp(inputPath)
          .png({ 
            compressionLevel: 9,
            quality: 95, // Higher quality for PNGs
            effort: 10
          })
          .toFile(outputPath);
        
        const newStats = fs.statSync(outputPath);
        const newSize = newStats.size;
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ ${file} → ${path.basename(outputPath)}`);
        console.log(`   ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(newSize / 1024 / 1024).toFixed(1)}MB (${reduction}% reduction)`);
        console.log('');
        
        // Replace original with optimized
        fs.unlinkSync(inputPath);
        fs.renameSync(outputPath, inputPath);
        
        result = { originalSize, newSize, reduction: parseFloat(reduction) };
      } catch (error) {
        console.error(`❌ Error optimizing PNG ${inputPath}:`, error.message);
        continue;
      }
    } else {
      // Convert JPEG/JPG to WebP
      outputPath = path.join(PUBLIC_DIR, `${baseName}.webp`);
      result = await optimizeImage(inputPath, outputPath);
      
      if (result) {
        // Remove original JPEG
        fs.unlinkSync(inputPath);
      }
    }
    
    if (result) {
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;
      optimizedCount++;
    }
  }
  
  const totalReduction = ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log('🎉 Balanced optimization complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Files optimized: ${optimizedCount}`);
  console.log(`   Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB → ${(totalNewSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Total reduction: ${totalReduction}%`);
  
  // Show file size distribution
  const allFiles = fs.readdirSync(PUBLIC_DIR);
  const optimizedFiles = allFiles.filter(f => f.match(/\.(webp|png)$/i));
  
  console.log('\n📈 Final file sizes:');
  for (const file of optimizedFiles) {
    const filePath = path.join(PUBLIC_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeMB = stats.size / 1024 / 1024;
    console.log(`   ${file}: ${sizeMB.toFixed(1)}MB`);
  }
  
  console.log('\n✨ Quality-focused optimization complete!');
  console.log('   • Maintained high visual quality');
  console.log('   • Significant size reduction achieved');
  console.log('   • Ready for web deployment');
}

main().catch(console.error);