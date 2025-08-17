/**
 * Example: Using Your Iranian Art Collection Dataset
 *
 * This example demonstrates how to use the image dataset manager
 * with your actual Iranian modern art collection.
 */

import { DatasetManager } from "../src/index.js";
import iranianArtDataset from "../data/datasets/iranian-modern-art-v1.json" assert { type: "json" };

// Create the dataset manager with your art collection
const artCollection = new DatasetManager(iranianArtDataset);

console.log("=== Iranian Modern Art Collection Example ===\n");

// 1. Dataset overview
console.log("1. Collection Overview:");
const metadata = artCollection.getMetadata();
console.log(`📚 Collection: ${metadata.description}`);
console.log(`📅 Version: ${metadata.version}`);
console.log(`🖼️  Total Images: ${artCollection.getAllImages().length}`);
console.log(`🏷️  Available Tags: ${artCollection.getAllTags().length}`);
console.log(`👨‍🎨 Artists: ${artCollection.getAllArtists().length}`);
console.log();

// 2. Featured artworks by Jalil Ziapour
console.log("2. Jalil Ziapour Artworks:");
const ziapourWorks = artCollection.searchImages("", {
  artist: "Jalil Ziapour",
});
ziapourWorks.forEach((work) => {
  console.log(`- ${work.caption}`);
  console.log(
    `  🔗 Slide URL: ${artCollection.getSlideImage(work.id, "medium")}`
  );
});
console.log();

// 3. Images from the 1940s
console.log("3. Artworks from the 1940s:");
const forties = artCollection.getImagesByTag("1940s");
forties.forEach((work) => {
  console.log(`- ${work.metadata?.artist}: ${work.metadata?.year}`);
});
console.log();

// 4. TMoCA Collection
console.log("4. Tehran Museum of Contemporary Art (TMoCA) pieces:");
const tmocaWorks = artCollection.searchImages("TMoCA");
tmocaWorks.forEach((work) => {
  console.log(
    `- ${work.metadata?.artist}: ${work.caption.split(",")[1]?.trim()}`
  );
});
console.log();

// 5. Oil paintings
console.log("5. Oil Paintings:");
const oilPaintings = artCollection.getImagesByTag("oil_painting");
oilPaintings.forEach((work) => {
  console.log(`- ${work.metadata?.artist} (${work.metadata?.year})`);
});
console.log();

// 6. Roosters theme (comparison between Picasso and Pezeshkniya)
console.log("6. Rooster Theme Comparison:");
const roosterWorks = artCollection.searchImages("rooster");
roosterWorks.forEach((work) => {
  console.log(`- ${work.metadata?.artist}: ${work.caption}`);
  console.log(
    `  🔗 Comparison URL: ${artCollection.getSlideImage(work.id, {
      width: 800,
      height: 600,
      crop: "fit",
    })}`
  );
});
console.log();

// 7. Photographers and ethnographic work
console.log("7. Ethnographic and Documentary Images:");
const ethnographicWorks = artCollection.getImagesByTag("ethnographic");
ethnographicWorks.forEach((work) => {
  console.log(`- ${work.caption}`);
  console.log(`  📍 Location: ${work.metadata?.location || "Not specified"}`);
});
console.log();

// 8. Optimized URLs for different presentation contexts
console.log("8. Presentation-Ready URLs for Key Artworks:");
const keyArtworks = [
  "ziapour_khorus_jangi",
  "picasso_rooster",
  "ziapour_public_bath",
];

keyArtworks.forEach((artworkId) => {
  const artwork = artCollection.getImage(artworkId);
  if (artwork) {
    console.log(
      `\n📷 ${artwork.metadata?.artist} - ${artwork.caption.split(",")[0]}`
    );
    console.log(
      `   🔸 Hero (1200x600): ${artCollection.getSlideImage(artworkId, "hero")}`
    );
    console.log(
      `   🔸 Thumbnail (300x200): ${artCollection.getSlideImage(
        artworkId,
        "thumbnail"
      )}`
    );
    console.log(
      `   🔸 Full Screen: ${artCollection.getSlideImage(
        artworkId,
        "fullscreen"
      )}`
    );
    console.log(
      `   🔸 Custom (600x400): ${artCollection.getSlideImage(artworkId, {
        width: 600,
        height: 400,
        crop: "fill",
        quality: "auto",
      })}`
    );
  }
});

// 9. Slidev presentation structure example
console.log("\n9. Slidev Presentation Structure:");
console.log(`
# Iranian Modern Art Presentation

## Slide 1: Hero
${artCollection.getSlideImage("ziapour_khorus_jangi", "hero")}
"${artCollection.getImage("ziapour_khorus_jangi")?.caption}"

## Slide 2: Timeline Gallery (1940s)
${forties
  .map(
    (work) =>
      `- ${artCollection.getSlideImage(work.id, "thumbnail")} // ${
        work.metadata?.artist
      }, ${work.metadata?.year}`
  )
  .join("\n")}

## Slide 3: Museum Collection (TMoCA)
${tmocaWorks
  .slice(0, 3)
  .map(
    (work) =>
      `- ${artCollection.getSlideImage(work.id, "medium")} // ${
        work.metadata?.artist
      }`
  )
  .join("\n")}

## Slide 4: Artistic Influences
${artCollection.getSlideImage("picasso_rooster", {
  width: 500,
  height: 400,
  crop: "fit",
})} | ${artCollection.getSlideImage("pezeshkniya_rooster", {
  width: 500,
  height: 400,
  crop: "fit",
})}
`);

// 10. Export for external use
console.log("\n10. Exporting collection for external tools:");
const exportedData = artCollection.exportDataset();
console.log(`📦 Exported ${Object.keys(exportedData.images).length} images`);
console.log(`📊 Metadata version: ${exportedData.metadata.version}`);
console.log(`💾 Ready for use in Slidev, websites, or other applications`);

// 11. Performance demonstration
console.log("\n11. Performance Features:");
console.log("🚀 Caching enabled for fast repeated access");
console.log("🔍 Indexed search by artist, year, tags, and text");
console.log("🖼️  Cloudinary optimization for web performance");
console.log("📱 Responsive image generation support");

console.log("\n=== Iranian Art Collection Example Complete ===");

// Export for use in other modules
export { artCollection, iranianArtDataset };
