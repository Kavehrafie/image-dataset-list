/**
 * Core type definitions for the image dataset manager
 */

export interface ImageMetadata {
  artist?: string;
  year?: string | number;
  medium?: string;
  dimensions?: string;
  collection?: string;
  [key: string]: any;
}

export interface CloudinaryTransforms {
  [transformName: string]: string;
}

export interface ImageData {
  src: string;
  caption: string;
  metadata?: ImageMetadata;
  tags?: string[];
  cloudinaryTransforms?: CloudinaryTransforms;
}

export interface DatasetMetadata {
  version: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  tags?: string[];
  schemaVersion?: string;
}

export interface ImageDataset {
  metadata: DatasetMetadata;
  images: {
    [imageId: string]: ImageData;
  };
}

export interface SearchOptions {
  tags?: string[];
  artist?: string;
  year?: string | number;
  collection?: string;
  limit?: number;
}

export interface TransformOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg" | "png";
  crop?: "scale" | "fill" | "fit" | "crop";
  gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
}

export interface SlideImageOptions extends TransformOptions {
  preset?: "thumbnail" | "hero" | "fullscreen" | "medium";
  lazy?: boolean;
}

export interface ImageWithCaption {
  id: string;
  src: string;
  caption: string;
  metadata?: ImageMetadata;
}

export interface DatasetManagerOptions {
  datasetPath?: string;
  cacheEnabled?: boolean;
  defaultTransforms?: CloudinaryTransforms;
}

export type ImageSearchResult = ImageData & { id: string };
