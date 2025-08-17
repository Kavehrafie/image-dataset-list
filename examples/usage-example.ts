import { DatasetManager } from "../src";
import dataset from "../data/datasets/iranian-modern-art-v1.json";

/**
 * Example usage of the Image Dataset Manager
 * This demonstrates common use cases for Slidev presentations
 */

// Create dataset manager
const images = new DatasetManager(dataset);

console.log("=== Image Dataset Manager Examples ===\n");

// 1. Basic image retrieval
console.log("1. Get a specific image:");
const heroImage = images.getImage("ziapour_khorus_jangi");
console.log(`   Title: ${heroImage?.caption}`);
console.log(`   Artist: ${heroImage?.metadata?.artist}`);
console.log(`   Year: ${heroImage?.metadata?.year}\n`);

// 2. Get optimized image URLs for slides
console.log("2. Optimized URLs for slides:");
console.log(
  `   Hero size: ${images.getSlideImage("ziapour_khorus_jangi", "hero")}`
);
console.log(
  `   Thumbnail: ${images.getSlideImage("ziapour_khorus_jangi", "thumbnail")}`
);
console.log(
  `   Custom size: ${images.getSlideImage("ziapour_khorus_jangi", {
    width: 600,
    height: 400,
  })}\n`
);

// 3. Search by tags
console.log("3. Search by tags:");
const artworks1940s = images.getImagesByTag("1940s");
console.log(`   Found ${artworks1940s.length} artworks from the 1940s:`);
artworks1940s.forEach((img) => {
  console.log(`   - ${img.caption}`);
});
console.log();

// 4. Text search
console.log("4. Text search:");
const roosterArt = images.searchImages("rooster");
console.log(`   Found ${roosterArt.length} images with "rooster":`);
roosterArt.forEach((img) => {
  console.log(`   - ${img.caption}`);
});
console.log();

// 5. Advanced search with filters
console.log("5. Advanced search:");
const pezeshkniyaWorks = images.searchImages("", { artist: "Pezeshkniya" });
console.log(
  `   Found ${pezeshkniyaWorks.length} works by artists with "Pezeshkniya" in name:`
);
pezeshkniyaWorks.forEach((img) => {
  console.log(`   - ${img.caption}`);
});
console.log();

// 6. Get images with captions for slides
console.log("6. Images with captions for slides:");
const imageWithCaption = images.getImageWithCaption(
  "ziapour_public_bath",
  "medium"
);
if (imageWithCaption) {
  console.log(`   ID: ${imageWithCaption.id}`);
  console.log(`   URL: ${imageWithCaption.src}`);
  console.log(`   Caption: ${imageWithCaption.caption}`);
}
console.log();

// 7. Get all available tags
console.log("7. Available tags in dataset:");
const allTags = images.getAllTags();
console.log(`   ${allTags.join(", ")}\n`);

// 8. Get all artists
console.log("8. Artists in dataset:");
const allArtists = images.getAllArtists();
console.log(`   ${allArtists.join(", ")}\n`);

// 9. Dataset statistics
console.log("9. Dataset statistics:");
const allImages = images.getAllImages();
const metadata = images.getMetadata();
console.log(`   Total images: ${allImages.length}`);
console.log(`   Dataset version: ${metadata.version}`);
console.log(`   Last updated: ${metadata.updatedAt}`);
console.log(`   Description: ${metadata.description}\n`);

// 10. Example: Preparing images for a slide show
console.log("10. Preparing a slideshow:");
const slideshowImages = [
  "ziapour_khorus_jangi",
  "picasso_rooster",
  "pezeshkniya_rooster",
  "ziapour_public_bath",
];

console.log("   Slideshow images with optimized URLs:");
slideshowImages.forEach((id, index) => {
  const image = images.getImageWithCaption(id, "hero");
  if (image) {
    console.log(`   Slide ${index + 1}:`);
    console.log(`     Image: ${image.src}`);
    console.log(`     Caption: ${image.caption}`);
    console.log(`     Artist: ${image.metadata?.artist || "Unknown"}`);
    console.log();
  }
});

// 11. Example: Creating a gallery grid
console.log("11. Gallery grid (thumbnails):");
const galleryImages = images.getImagesByTag("ziapour").slice(0, 4);
console.log("   Thumbnail URLs for gallery:");
galleryImages.forEach((img) => {
  const thumbnailUrl = images.getSlideImage(img.id, "thumbnail");
  console.log(`   - ${img.id}: ${thumbnailUrl}`);
});

export { images };
