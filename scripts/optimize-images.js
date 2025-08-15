import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const BACKUP_DIR = path.join(__dirname, '../public-backup');

async function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('Created backup directory');
  }
  
  const files = fs.readdirSync(PUBLIC_DIR);
  for (const file of files) {
    if (file.match(/\.(jpe?g|png)$/i)) {
      const srcPath = path.join(PUBLIC_DIR, file);
      const backupPath = path.join(BACKUP_DIR, file);
      
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(srcPath, backupPath);
        console.log(`Backed up: ${file}`);
      }
    }
  }
}

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    await sharp(inputPath)
      .resize(options.width, options.height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ 
        quality: options.quality || 85,
        effort: 6
      })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(newSize / 1024 / 1024).toFixed(1)}MB (${reduction}% reduction)`);
    
    return { originalSize, newSize, reduction };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizePNG(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    await sharp(inputPath)
      .png({ 
        compressionLevel: 9,
        quality: 90
      })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(newSize / 1024 / 1024).toFixed(1)}MB (${reduction}% reduction)`);
    
    return { originalSize, newSize, reduction };
  } catch (error) {
    console.error(`Error optimizing PNG ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🔄 Starting image optimization...\n');
  
  await createBackup();
  
  const files = fs.readdirSync(PUBLIC_DIR);
  const imageFiles = files.filter(file => file.match(/\.(jpe?g|png)$/i));
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let optimizedCount = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    
    let result;
    
    if (ext === '.png') {
      // Optimize PNG files (keep as PNG for logos)
      const outputPath = path.join(PUBLIC_DIR, `${baseName}_optimized.png`);
      result = await optimizePNG(inputPath, outputPath);
      
      if (result) {
        // Replace original with optimized
        fs.unlinkSync(inputPath);
        fs.renameSync(outputPath, inputPath);
      }
    } else {
      // Convert JPEG/JPG to WebP
      const outputPath = path.join(PUBLIC_DIR, `${baseName}.webp`);
      
      // Determine quality based on file size
      const stats = fs.statSync(inputPath);
      const sizeInMB = stats.size / 1024 / 1024;
      const quality = sizeInMB > 10 ? 75 : sizeInMB > 5 ? 80 : 85;
      
      result = await optimizeImage(inputPath, outputPath, { quality });
      
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
    
    console.log('');
  }
  
  const totalReduction = ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log('🎉 Optimization complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Files optimized: ${optimizedCount}`);
  console.log(`   Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB → ${(totalNewSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Total reduction: ${totalReduction}%`);
  console.log(`\n💾 Backups saved in: ${BACKUP_DIR}`);
}

main().catch(console.error);