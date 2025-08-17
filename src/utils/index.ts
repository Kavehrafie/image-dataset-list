/**
 * Utility functions for image transformations and URL building
 */

import {
  TransformOptions,
  SlideImageOptions,
  CloudinaryTransforms,
} from "../types";

export class ImageUtils {
  /**
   * Predefined transform presets for common use cases
   */
  private static readonly PRESETS: Record<string, TransformOptions> = {
    thumbnail: {
      width: 300,
      height: 200,
      crop: "fill",
      quality: "auto",
      format: "auto",
    },
    hero: {
      width: 1200,
      height: 600,
      crop: "fill",
      quality: "auto",
      format: "auto",
    },
    fullscreen: {
      width: 1920,
      height: 1080,
      crop: "fit",
      quality: "auto",
      format: "auto",
    },
    medium: {
      width: 800,
      height: 600,
      crop: "fit",
      quality: "auto",
      format: "auto",
    },
  };

  /**
   * Build Cloudinary transformation string from options
   */
  static buildTransformString(options: TransformOptions): string {
    const transforms: string[] = [];

    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.crop) transforms.push(`c_${options.crop}`);
    if (options.quality) transforms.push(`q_${options.quality}`);
    if (options.format) transforms.push(`f_${options.format}`);
    if (options.gravity) transforms.push(`g_${options.gravity}`);

    return transforms.join(",");
  }

  /**
   * Apply transformation to Cloudinary URL
   */
  static applyTransform(
    url: string,
    options: TransformOptions | string
  ): string {
    if (!this.isCloudinaryUrl(url)) {
      return url; // Return original URL if not Cloudinary
    }

    const transformString =
      typeof options === "string"
        ? options
        : this.buildTransformString(options);

    if (!transformString) return url;

    // Insert transformation into Cloudinary URL
    const parts = url.split("/upload/");
    if (parts.length !== 2) return url;

    const [base, path] = parts;
    const existingTransforms = path.split("/")[0];

    // Check if there are existing transforms
    if (existingTransforms && !existingTransforms.includes(".")) {
      // Merge with existing transforms
      return `${base}/upload/${existingTransforms},${transformString}/${path
        .split("/")
        .slice(1)
        .join("/")}`;
    } else {
      // Add new transforms
      return `${base}/upload/${transformString}/${path}`;
    }
  }

  /**
   * Apply preset transformation
   */
  static applyPreset(
    url: string,
    preset: keyof typeof ImageUtils.PRESETS
  ): string {
    const presetOptions = this.PRESETS[preset];
    if (!presetOptions) {
      console.warn(`Unknown preset: ${preset}`);
      return url;
    }
    return this.applyTransform(url, presetOptions);
  }

  /**
   * Apply slide-specific transformations
   */
  static applySlideTransform(url: string, options: SlideImageOptions): string {
    if (options.preset) {
      const presetOptions = { ...this.PRESETS[options.preset], ...options };
      delete presetOptions.preset;
      return this.applyTransform(url, presetOptions);
    }
    return this.applyTransform(url, options);
  }

  /**
   * Check if URL is a Cloudinary URL
   */
  static isCloudinaryUrl(url: string): boolean {
    return url.includes("cloudinary.com") && url.includes("/upload/");
  }

  /**
   * Extract image ID from Cloudinary URL
   */
  static extractImageId(url: string): string | null {
    try {
      const parts = url.split("/");
      const uploadIndex = parts.findIndex((part) => part === "upload");
      if (uploadIndex === -1) return null;

      const imagePart = parts[parts.length - 1];
      return imagePart.split(".")[0];
    } catch {
      return null;
    }
  }

  /**
   * Sanitize and validate image data
   */
  static sanitizeImageData(data: any): any {
    return {
      src: typeof data.src === "string" ? data.src.trim() : "",
      caption: typeof data.caption === "string" ? data.caption.trim() : "",
      metadata:
        data.metadata && typeof data.metadata === "object" ? data.metadata : {},
      tags: Array.isArray(data.tags)
        ? data.tags.filter((tag: any) => typeof tag === "string")
        : [],
      cloudinaryTransforms:
        data.cloudinaryTransforms &&
        typeof data.cloudinaryTransforms === "object"
          ? data.cloudinaryTransforms
          : {},
    };
  }

  /**
   * Generate responsive image srcset for different screen sizes
   */
  static generateSrcSet(
    url: string,
    breakpoints: number[] = [480, 768, 1024, 1440, 1920]
  ): string {
    if (!this.isCloudinaryUrl(url)) return "";

    return breakpoints
      .map((width) => {
        const transformedUrl = this.applyTransform(url, {
          width,
          quality: "auto",
          format: "auto",
        });
        return `${transformedUrl} ${width}w`;
      })
      .join(", ");
  }
}
