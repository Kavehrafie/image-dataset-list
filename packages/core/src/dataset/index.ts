/**
 * Core dataset management class
 */

import {
  ImageDataset,
  ImageData,
  ImageSearchResult,
  SearchOptions,
  SlideImageOptions,
  ImageWithCaption,
  DatasetManagerOptions,
} from "../types";
import { ImageUtils } from "../utils";
import { VersionManager } from "../version";

export class DatasetManager {
  private dataset: ImageDataset;
  private cache: Map<string, any> = new Map();
  private options: DatasetManagerOptions;

  constructor(dataset: ImageDataset, options: DatasetManagerOptions = {}) {
    this.dataset = this.validateAndSanitizeDataset(dataset);
    this.options = {
      cacheEnabled: true,
      ...options,
    };
  }

  /**
   * Create a new dataset manager from JSON data
   */
  static fromJSON(
    jsonData: any,
    options: DatasetManagerOptions = {}
  ): DatasetManager {
    return new DatasetManager(jsonData, options);
  }

  /**
   * Get image by ID
   */
  getImage(id: string): ImageData | null {
    const cacheKey = `image_${id}`;

    if (this.options.cacheEnabled && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const image = this.dataset.images[id] || null;

    if (this.options.cacheEnabled && image) {
      this.cache.set(cacheKey, image);
    }

    return image;
  }

  /**
   * Get all images
   */
  getAllImages(): ImageSearchResult[] {
    const cacheKey = "all_images";

    if (this.options.cacheEnabled && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const images = Object.entries(this.dataset.images).map(([id, data]) => ({
      id,
      ...data,
    }));

    if (this.options.cacheEnabled) {
      this.cache.set(cacheKey, images);
    }

    return images;
  }

  /**
   * Get images by tag
   */
  getImagesByTag(tag: string): ImageSearchResult[] {
    const cacheKey = `tag_${tag}`;

    if (this.options.cacheEnabled && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const images = Object.entries(this.dataset.images)
      .filter(([_, data]) => data.tags?.includes(tag))
      .map(([id, data]) => ({ id, ...data }));

    if (this.options.cacheEnabled) {
      this.cache.set(cacheKey, images);
    }

    return images;
  }

  /**
   * Search images with various criteria
   */
  searchImages(
    query: string,
    options: SearchOptions = {}
  ): ImageSearchResult[] {
    const normalizedQuery = query.toLowerCase();

    return this.getAllImages()
      .filter((image) => {
        // Text search in caption
        const matchesText = image.caption
          .toLowerCase()
          .includes(normalizedQuery);

        // Tag filter
        const matchesTags =
          !options.tags ||
          options.tags.some((tag) => image.tags?.includes(tag));

        // Artist filter
        const matchesArtist =
          !options.artist ||
          image.metadata?.artist
            ?.toLowerCase()
            .includes(options.artist.toLowerCase());

        // Year filter
        const matchesYear =
          !options.year ||
          image.metadata?.year?.toString() === options.year.toString();

        // Collection filter
        const matchesCollection =
          !options.collection ||
          image.metadata?.collection
            ?.toLowerCase()
            .includes(options.collection.toLowerCase());

        return (
          matchesText &&
          matchesTags &&
          matchesArtist &&
          matchesYear &&
          matchesCollection
        );
      })
      .slice(0, options.limit);
  }

  /**
   * Get image optimized for slides with transformations
   */
  getSlideImage(id: string, options: SlideImageOptions | string = {}): string {
    const image = this.getImage(id);
    if (!image) {
      console.warn(`Image with ID "${id}" not found`);
      return "";
    }

    if (typeof options === "string") {
      // If options is a string, treat it as a preset or transform
      if (image.cloudinaryTransforms?.[options]) {
        return ImageUtils.applyTransform(
          image.src,
          image.cloudinaryTransforms[options]
        );
      }
      return ImageUtils.applyPreset(image.src, options as any);
    }

    return ImageUtils.applySlideTransform(image.src, options);
  }

  /**
   * Get image with caption for slide display
   */
  getImageWithCaption(
    id: string,
    transformOptions?: SlideImageOptions | string
  ): ImageWithCaption | null {
    const image = this.getImage(id);
    if (!image) return null;

    return {
      id,
      src: transformOptions
        ? this.getSlideImage(id, transformOptions)
        : image.src,
      caption: image.caption,
      metadata: image.metadata,
    };
  }

  /**
   * Get multiple images with captions
   */
  getImagesWithCaptions(
    ids: string[],
    transformOptions?: SlideImageOptions | string
  ): ImageWithCaption[] {
    return ids
      .map((id) => this.getImageWithCaption(id, transformOptions))
      .filter((image): image is ImageWithCaption => image !== null);
  }

  /**
   * Preload images for better performance
   */
  async preloadImages(
    ids: string[],
    transformOptions?: SlideImageOptions | string
  ): Promise<void> {
    const promises = ids.map((id) => {
      const src = this.getSlideImage(id, transformOptions);
      if (!src) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn("Some images failed to preload:", error);
    }
  }

  /**
   * Get dataset metadata
   */
  getMetadata() {
    return { ...this.dataset.metadata };
  }

  /**
   * Get all available tags
   */
  getAllTags(): string[] {
    const tagSet = new Set<string>();

    Object.values(this.dataset.images).forEach((image) => {
      image.tags?.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }

  /**
   * Get all artists
   */
  getAllArtists(): string[] {
    const artistSet = new Set<string>();

    Object.values(this.dataset.images).forEach((image) => {
      if (image.metadata?.artist) {
        artistSet.add(image.metadata.artist);
      }
    });

    return Array.from(artistSet).sort();
  }

  /**
   * Export dataset as JSON
   */
  exportDataset(): ImageDataset {
    return JSON.parse(JSON.stringify(this.dataset));
  }

  /**
   * Update dataset with new data
   */
  updateDataset(newData: Partial<ImageDataset>): void {
    if (newData.images) {
      Object.entries(newData.images).forEach(([id, imageData]) => {
        this.dataset.images[id] = ImageUtils.sanitizeImageData(imageData);
      });
    }

    if (newData.metadata) {
      this.dataset.metadata = {
        ...this.dataset.metadata,
        ...newData.metadata,
        updatedAt: new Date().toISOString(),
      };
    }

    // Clear cache after update
    this.clearCache();
  }

  /**
   * Add new images to dataset
   */
  addImages(images: Record<string, ImageData>): void {
    Object.entries(images).forEach(([id, imageData]) => {
      this.dataset.images[id] = ImageUtils.sanitizeImageData(imageData);
    });

    this.dataset.metadata.updatedAt = new Date().toISOString();
    this.clearCache();
  }

  /**
   * Remove image from dataset
   */
  removeImage(id: string): boolean {
    if (this.dataset.images[id]) {
      delete this.dataset.images[id];
      this.dataset.metadata.updatedAt = new Date().toISOString();
      this.clearCache();
      return true;
    }
    return false;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Validate and sanitize dataset
   */
  private validateAndSanitizeDataset(dataset: any): ImageDataset {
    if (!dataset || typeof dataset !== "object") {
      throw new Error("Invalid dataset: must be an object");
    }

    if (!dataset.metadata) {
      dataset.metadata = VersionManager.createMetadata();
    }

    if (!dataset.images || typeof dataset.images !== "object") {
      dataset.images = {};
    }

    // Sanitize each image
    Object.keys(dataset.images).forEach((id) => {
      dataset.images[id] = ImageUtils.sanitizeImageData(dataset.images[id]);
    });

    return dataset as ImageDataset;
  }
}
