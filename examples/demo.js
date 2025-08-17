/**
 * Simple demo script to test the image dataset manager
 */

import { DatasetManager } from '../dist/index.esm.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the dataset
const datasetPath = join(__dirname, '../data/datasets/iranian-modern-art-v1.json');
const iranianArtDataset = JSON.parse(readFileSync(datasetPath, 'utf-8'));

// Create the dataset manager
const artCollection = new DatasetManager(iranianArtDataset);

console.log('=== Iranian Modern Art Collection Demo ===\n');

// 1. Dataset overview
console.log('1. Collection Overview:');
const metadata = artCollection.getMetadata();
console.log(`📚 Collection: ${metadata.description}`);
console.log(`📅 Version: ${metadata.version}`);
console.log(`🖼️  Total images: ${Object.keys(iranianArtDataset.images).length}\n`);

// 2. Get a specific image
console.log('2. Featured Artwork:');
const ziapourImage = artCollection.getImageWithCaption('ziapour_khorus_jangi');
if (ziapourImage) {
  console.log(`🎨 ${ziapourImage.caption}`);
  console.log(`🔗 Original: ${ziapourImage.src}`);
  
  // Get optimized versions
  const heroUrl = artCollection.getSlideImage('ziapour_khorus_jangi', 'hero');
  const thumbnailUrl = artCollection.getSlideImage('ziapour_khorus_jangi', 'thumbnail');
  
  console.log(`🖼️  Hero version: ${heroUrl}`);
  console.log(`📱 Thumbnail: ${thumbnailUrl}\n`);
}

// 3. Search by artist
console.log('3. Works by Jalil Ziapour:');
const ziapourWorks = artCollection.searchImages('Ziapour', { limit: 3 });
ziapourWorks.forEach((work, index) => {
  console.log(`   ${index + 1}. ${work.caption} (ID: ${work.id})`);
});
console.log();

// 4. Get all tags
console.log('4. Available Tags:');
const tags = artCollection.getAllTags();
console.log(`   ${tags.slice(0, 10).join(', ')}${tags.length > 10 ? '...' : ''}\n`);

// 5. Images from the 1940s
console.log('5. Artworks from the 1940s:');
const forties = artCollection.searchImages('1940', { limit: 3 });
forties.forEach((work, index) => {
  console.log(`   ${index + 1}. ${work.caption}`);
});
console.log();

// 6. Custom transform example
console.log('6. Custom Image Transform:');
const customUrl = artCollection.getSlideImage('picasso_rooster', {
  width: 600,
  height: 400,
  crop: 'fill',
  quality: 90
});
console.log(`   Custom Picasso URL: ${customUrl}\n`);

console.log('✅ Demo completed successfully!');
console.log('💡 Try running: npm test');
console.log('🏗️  Build with: npm run build');
