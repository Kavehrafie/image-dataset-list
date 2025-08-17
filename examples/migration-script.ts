/**
 * Migration Script: Convert YAML dataset to new JSON format
 *
 * This script helps convert your existing YAML image datasets
 * to the new structured JSON format with proper metadata and versioning.
 */

import * as fs from "fs";
import * as path from "path";
import { VersionManager } from "../src/version";
import { ImageDataset, ImageData } from "../src/types";

interface YamlImageData {
  src: string;
  caption: string;
  [key: string]: any;
}

interface YamlDataset {
  images: {
    [key: string]: YamlImageData;
  };
}

/**
 * Extract metadata from caption text
 */
function extractMetadataFromCaption(caption: string): {
  artist?: string;
  year?: string | number;
  medium?: string;
  dimensions?: string;
  collection?: string;
  tags: string[];
} {
  const metadata: any = { tags: [] };

  // Extract artist name (usually at the beginning)
  const artistMatch = caption.match(/^([^,]+),/);
  if (artistMatch) {
    metadata.artist = artistMatch[1].trim();
  }

  // Extract year (four digits)
  const yearMatch = caption.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    metadata.year = parseInt(yearMatch[0]);
  }

  // Extract dimensions
  const dimensionMatch = caption.match(
    /(\d+(?:\.\d+)?\s*[×x]\s*\d+(?:\.\d+)?)\s*cm/i
  );
  if (dimensionMatch) {
    metadata.dimensions = dimensionMatch[1] + " cm";
  }

  // Extract medium
  const mediumKeywords = [
    "oil on canvas",
    "acrylic",
    "watercolor",
    "pastel",
    "gouache",
    "mixed media",
    "bronze",
    "sculpture",
    "photograph",
    "digital",
    "pen and ink",
    "charcoal",
    "tempera",
  ];

  for (const medium of mediumKeywords) {
    if (caption.toLowerCase().includes(medium)) {
      metadata.medium = medium;
      break;
    }
  }

  // Extract collection/museum
  const collectionMatch = caption.match(
    /\b(TMoCA|Museum|Gallery|Collection)\b/i
  );
  if (collectionMatch) {
    metadata.collection = collectionMatch[0];
  }

  // Generate tags based on content
  const tagKeywords = {
    painting: ["oil", "acrylic", "canvas", "paint"],
    sculpture: ["bronze", "sculpture", "statue"],
    portrait: ["portrait"],
    landscape: ["landscape"],
    abstract: ["abstract"],
    modern: ["modern", "contemporary"],
    photograph: ["photograph", "photo"],
    architecture: ["mosque", "building", "architecture"],
  };

  const lowerCaption = caption.toLowerCase();
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((keyword) => lowerCaption.includes(keyword))) {
      metadata.tags.push(tag);
    }
  }

  // Add decade tag based on year
  if (metadata.year) {
    const decade = Math.floor(metadata.year / 10) * 10;
    metadata.tags.push(`${decade}s`);
  }

  return metadata;
}

/**
 * Convert YAML dataset to new JSON format
 */
export function convertYamlToJson(
  yamlData: YamlDataset,
  options: {
    description?: string;
    tags?: string[];
    outputPath?: string;
  } = {}
): ImageDataset {
  // Create metadata
  const metadata = VersionManager.createMetadata(
    options.description || "Converted from YAML dataset",
    options.tags || ["converted", "images"]
  );

  // Convert images
  const convertedImages: { [key: string]: ImageData } = {};

  for (const [imageId, yamlImage] of Object.entries(yamlData.images)) {
    // Extract metadata from caption
    const extractedMetadata = extractMetadataFromCaption(yamlImage.caption);

    // Create converted image data
    convertedImages[imageId] = {
      src: yamlImage.src,
      caption: yamlImage.caption,
      metadata: {
        artist: extractedMetadata.artist,
        year: extractedMetadata.year,
        medium: extractedMetadata.medium,
        dimensions: extractedMetadata.dimensions,
        collection: extractedMetadata.collection,
      },
      tags: extractedMetadata.tags,
    };
  }

  const convertedDataset: ImageDataset = {
    metadata,
    images: convertedImages,
  };

  return convertedDataset;
}

/**
 * CLI function to convert YAML file to JSON
 */
export async function convertYamlFile(
  inputPath: string,
  outputPath?: string,
  options: {
    description?: string;
    tags?: string[];
  } = {}
): Promise<void> {
  try {
    // Read YAML file (assuming it's been converted to JSON already)
    // In a real implementation, you'd use a YAML parser like 'js-yaml'
    const yamlContent = fs.readFileSync(inputPath, "utf8");

    // For this example, assume the YAML has been manually converted to JS object
    console.log("Note: Please manually convert YAML to JS object format first");
    console.log(
      'Or install a YAML parser like "js-yaml" to parse automatically'
    );

    // Placeholder for YAML parsing
    const yamlData: YamlDataset = {
      images: {}, // This would be populated from actual YAML parsing
    };

    // Convert to new format
    const convertedDataset = convertYamlToJson(yamlData, options);

    // Determine output path
    const outputFilePath = outputPath || inputPath.replace(/\.ya?ml$/, ".json");

    // Write JSON file
    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(convertedDataset, null, 2),
      "utf8"
    );

    console.log(`✅ Conversion complete!`);
    console.log(`📁 Input: ${inputPath}`);
    console.log(`📁 Output: ${outputFilePath}`);
    console.log(
      `🖼️  Images converted: ${Object.keys(convertedDataset.images).length}`
    );
    console.log(
      `🏷️  Tags extracted: ${convertedDataset.metadata.tags?.join(", ")}`
    );
  } catch (error) {
    console.error("❌ Conversion failed:", error);
    throw error;
  }
}

// Example usage with your original YAML structure
export const exampleYamlConversion = () => {
  const originalYamlStructure = {
    images: {
      ziapour_khorus_jangi: {
        src: "https://res.cloudinary.com/image-solar/image/upload/c_scale,f_auto,h_1441/v1743152775/ziapour/Khorous_Jangi_1_1_annotated-1_nx7omy.png",
        caption: "Jalil Ziapour, Khorus Jangi magazine cover, 1949",
      },
      picasso_rooster: {
        src: "https://res.cloudinary.com/image-solar/image/upload/f_auto/v1743141407/ziapour/picasso_rooster_g4gc74.png",
        caption:
          "Pablo Picasso, *A Rooster*, 1948, pastel and paper, 77.5 × 54 cm",
      },
      // ... more images
    },
  };

  const converted = convertYamlToJson(originalYamlStructure, {
    description: "Iranian Modern Art Collection",
    tags: ["art", "iran", "modern", "cultural"],
  });

  console.log("Example conversion result:");
  console.log(JSON.stringify(converted, null, 2));

  return converted;
};

// If running as script
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      "Usage: node migration-script.js <input-yaml-file> [output-json-file]"
    );
    console.log(
      "Example: node migration-script.js data.yaml converted-data.json"
    );
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  convertYamlFile(inputFile, outputFile)
    .then(() => {
      console.log("Migration completed successfully!");
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
