/**
 * Example: Basic Usage of Image Dataset Manager
 */

import { DatasetManager, createFromJSON } from "../src/index";

// Example dataset (you would typically load this from a JSON file)
const exampleDataset = {
  metadata: {
    version: "v2025-08-17T00-00-00-000Z",
    createdAt: "2025-08-17T00:00:00.000Z",
    updatedAt: "2025-08-17T00:00:00.000Z",
    description: "Example Art Collection",
    tags: ["art", "example", "demo"],
  },
  images: {
    artwork_1: {
      src: "https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg",
      caption: "Beautiful Landscape by Demo Artist, 2023",
      metadata: {
        artist: "Demo Artist",
        year: 2023,
        medium: "oil on canvas",
        dimensions: "100x80cm",
      },
      tags: ["landscape", "oil", "contemporary"],
    },
    artwork_2: {
      src: "https://res.cloudinary.com/demo/image/upload/v1235/portrait.jpg",
      caption: "Portrait Study by Another Artist, 2022",
      metadata: {
        artist: "Another Artist",
        year: 2022,
        medium: "acrylic on board",
        dimensions: "60x40cm",
      },
      tags: ["portrait", "acrylic", "modern"],
    },
    sculpture_1: {
      src: "https://res.cloudinary.com/demo/image/upload/v1236/sculpture.jpg",
      caption: "Abstract Form in Bronze, 2021",
      metadata: {
        artist: "Sculptor Name",
        year: 2021,
        medium: "bronze",
        dimensions: "150x50x50cm",
      },
      tags: ["sculpture", "bronze", "abstract"],
    },
  },
};

// Create dataset manager
const artCollection = createFromJSON(exampleDataset);

console.log("=== Image Dataset Manager Example ===\n");

// 1. Basic image retrieval
console.log("1. Getting a specific image:");
const artwork1 = artCollection.getImage("artwork_1");
console.log(`Image: ${artwork1?.caption}`);
console.log(`Artist: ${artwork1?.metadata?.artist}\n`);

// 2. Get all images
console.log("2. All images in the collection:");
const allImages = artCollection.getAllImages();
allImages.forEach((img) => {
  console.log(`- ${img.id}: ${img.caption}`);
});
console.log();

// 3. Search by tags
console.log('3. Images tagged as "oil":');
const oilPaintings = artCollection.getImagesByTag("oil");
oilPaintings.forEach((img) => {
  console.log(`- ${img.caption}`);
});
console.log();

// 4. Text search
console.log('4. Search for "Portrait":');
const portraits = artCollection.searchImages("Portrait");
portraits.forEach((img) => {
  console.log(`- ${img.caption}`);
});
console.log();

// 5. Advanced search with filters
console.log('5. Search by artist "Demo Artist":');
const demoArtistWorks = artCollection.searchImages("", {
  artist: "Demo Artist",
});
demoArtistWorks.forEach((img) => {
  console.log(`- ${img.caption}`);
});
console.log();

// 6. Get optimized images for slides
console.log("6. Optimized URLs for presentations:");
console.log("Hero image:", artCollection.getSlideImage("artwork_1", "hero"));
console.log(
  "Thumbnail:",
  artCollection.getSlideImage("artwork_1", "thumbnail")
);
console.log(
  "Custom size:",
  artCollection.getSlideImage("artwork_1", {
    width: 600,
    height: 400,
    crop: "fill",
    quality: "auto",
  })
);
console.log();

// 7. Get image with caption for slide display
console.log("7. Image with caption for slide:");
const slideImage = artCollection.getImageWithCaption("artwork_1", "medium");
if (slideImage) {
  console.log(`URL: ${slideImage.src}`);
  console.log(`Caption: ${slideImage.caption}`);
  console.log(`Artist: ${slideImage.metadata?.artist}`);
}
console.log();

// 8. Dataset metadata
console.log("8. Dataset information:");
const metadata = artCollection.getMetadata();
console.log(`Version: ${metadata.version}`);
console.log(`Description: ${metadata.description}`);
console.log(`Last Updated: ${metadata.updatedAt}`);
console.log();

// 9. Get all available tags and artists
console.log("9. Available tags:", artCollection.getAllTags().join(", "));
console.log("10. Available artists:", artCollection.getAllArtists().join(", "));
console.log();

// 10. Add new images
console.log("11. Adding a new image:");
artCollection.addImages({
  new_artwork: {
    src: "https://res.cloudinary.com/demo/image/upload/v1237/new.jpg",
    caption: "Newly Added Artwork, 2024",
    metadata: {
      artist: "New Artist",
      year: 2024,
      medium: "digital art",
    },
    tags: ["digital", "contemporary", "new"],
  },
});

const newImage = artCollection.getImage("new_artwork");
console.log(`Added: ${newImage?.caption}`);
console.log();

// 11. Export updated dataset
console.log("12. Exporting dataset:");
const exportedDataset = artCollection.exportDataset();
console.log(`Total images: ${Object.keys(exportedDataset.images).length}`);
console.log(`Dataset version: ${exportedDataset.metadata.version}`);

console.log("\n=== Example Complete ===");

export { artCollection, exampleDataset };
