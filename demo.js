/**
 * Simple Demo Script
 * Run this to see the package in action
 */

const { DatasetManager } = require('./dist/index.js');
const iranianArtDataset = require('./data/datasets/iranian-modern-art-v1.json');

// Create the dataset manager
const artCollection = new DatasetManager(iranianArtDataset);

console.log('=== Image Dataset Manager Demo ===\n');

// 1. Basic info
console.log('📚 Collection:', artCollection.getMetadata().description);
console.log('🖼️  Total Images:', artCollection.getAllImages().length);
console.log('👨‍🎨 Artists:', artCollection.getAllArtists().join(', '));
console.log();

// 2. Get a specific image
const heroImage = artCollection.getImage('ziapour_khorus_jangi');
console.log('🎨 Featured Artwork:');
console.log('   Caption:', heroImage?.caption);
console.log('   Artist:', heroImage?.metadata?.artist);
console.log('   Year:', heroImage?.metadata?.year);
console.log();

// 3. Search functionality
console.log('🔍 Search Results for "Ziapour":');
const ziapourWorks = artCollection.searchImages('Ziapour');
ziapourWorks.forEach(work => {
  console.log(`   - ${work.caption}`);
});
console.log();

// 4. Get images by tag
console.log('🏷️  Images tagged "1940s":');
const fortiesWorks = artCollection.getImagesByTag('1940s');
fortiesWorks.forEach(work => {
  console.log(`   - ${work.metadata?.artist}: ${work.metadata?.year}`);
});
console.log();

// 5. Optimized URLs for presentations
console.log('🎯 Presentation URLs:');
console.log('   Hero:', artCollection.getSlideImage('ziapour_khorus_jangi', 'hero'));
console.log('   Thumbnail:', artCollection.getSlideImage('ziapour_khorus_jangi', 'thumbnail'));
console.log('   Custom:', artCollection.getSlideImage('ziapour_khorus_jangi', { width: 600, height: 400 }));
console.log();

// 6. Image with caption for slides
const slideImage = artCollection.getImageWithCaption('picasso_rooster', 'medium');
console.log('📝 Slide Image with Caption:');
console.log('   URL:', slideImage?.src);
console.log('   Caption:', slideImage?.caption);
console.log();

console.log('✅ Demo Complete! Your image dataset manager is working perfectly.');
console.log('🚀 Ready to use in your Slidev presentations and web applications!');
