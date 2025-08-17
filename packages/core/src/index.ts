/**
 * Image Dataset Manager - Main Entry Point
 *
 * A robust TypeScript package for managing versioned image datasets
 * with utility functions optimized for Slidev presentations.
 */

// Export types
export * from "./types";

// Export core classes
export { DatasetManager } from "./dataset";
export { ImageUtils } from "./utils";
export { VersionManager } from "./version";

// Export convenience functions
import { DatasetManager } from "./dataset";
import { ImageDataset, DatasetManagerOptions } from "./types";

/**
 * Create a new dataset manager instance
 */
export function createDatasetManager(
  dataset: ImageDataset,
  options?: DatasetManagerOptions
): DatasetManager {
  return new DatasetManager(dataset, options);
}

/**
 * Create dataset manager from JSON data
 */
export function createFromJSON(
  jsonData: any,
  options?: DatasetManagerOptions
): DatasetManager {
  return DatasetManager.fromJSON(jsonData, options);
}

/**
 * Quick helper to get an image URL with transforms
 */
export function getImageUrl(
  dataset: ImageDataset,
  imageId: string,
  transform?: any
): string {
  const manager = new DatasetManager(dataset);
  return manager.getSlideImage(imageId, transform);
}

/**
 * Quick helper to search images
 */
export function searchImages(
  dataset: ImageDataset,
  query: string,
  options?: any
): any[] {
  const manager = new DatasetManager(dataset);
  return manager.searchImages(query, options);
}

// Default export
export default {
  DatasetManager,
  createDatasetManager,
  createFromJSON,
  getImageUrl,
  searchImages,
};
