# Image Dataset Manager

A robust TypeScript package for managing versioned image datasets with utility functions optimized for Slidev presentations and web applications.

## Features

- 🎯 **Type-safe** - Full TypeScript support with comprehensive type definitions
- 📦 **Versioned datasets** - Built-in versioning system for dataset management
- 🖼️ **Cloudinary integration** - Optimized for Cloudinary transformations
- 🎪 **Slidev ready** - Purpose-built utilities for presentation software
- 🔍 **Powerful search** - Search by text, tags, artist, year, and more
- ⚡ **Performance optimized** - Built-in caching and lazy loading support
- 🌳 **Tree-shakable** - Import only what you need
- 🚀 **Zero dependencies** - Lightweight with no external dependencies

## Installation

```bash
npm install image-dataset-manager
```

## Quick Start

```typescript
import { DatasetManager, createFromJSON } from 'image-dataset-manager';

// Load your dataset
const dataset = {
  metadata: {
    version: "v2025-08-17T00-00-00-000Z",
    createdAt: "2025-08-17T00:00:00.000Z",
    updatedAt: "2025-08-17T00:00:00.000Z",
    description: "My Image Collection"
  },
  images: {
    "my_image": {
      src: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      caption: "A beautiful sample image",
      tags: ["nature", "sample"]
    }
  }
};

// Create manager instance
const manager = createFromJSON(dataset);

// Get optimized image for slides
const slideImage = manager.getSlideImage('my_image', 'hero');

// Search images
const natureImages = manager.getImagesByTag('nature');
```

## Usage in Slidev

Perfect for Slidev presentations with built-in image optimization:

```vue
<script setup>
import { DatasetManager } from 'image-dataset-manager';
import myDataset from './data/my-images.json';

const images = new DatasetManager(myDataset);
</script>

<template>
  <div class="slide-content">
    <!-- Hero image with automatic optimization -->
    <img :src="images.getSlideImage('hero_image', 'hero')" alt="Hero" />
    
    <!-- Thumbnail gallery -->
    <div class="gallery">
      <img 
        v-for="img in images.getImagesByTag('gallery')"
        :key="img.id"
        :src="images.getSlideImage(img.id, 'thumbnail')"
        :alt="img.caption"
      />
    </div>
    
    <!-- Image with caption -->
    <div class="featured">
      <img :src="images.getSlideImage('featured', { width: 800, quality: 'auto' })" />
      <p>{{ images.getImage('featured')?.caption }}</p>
    </div>
  </div>
</template>
```

## API Reference

### DatasetManager

#### Constructor
```typescript
new DatasetManager(dataset: ImageDataset, options?: DatasetManagerOptions)
```

#### Core Methods

**getImage(id: string): ImageData | null**
Get a single image by ID.

**getAllImages(): ImageSearchResult[]**
Get all images in the dataset.

**getImagesByTag(tag: string): ImageSearchResult[]**
Get all images with a specific tag.

**searchImages(query: string, options?: SearchOptions): ImageSearchResult[]**
Search images with text and filters.

#### Slidev Integration

**getSlideImage(id: string, options?: SlideImageOptions | string): string**
Get optimized image URL for slides.

```typescript
// Using presets
const heroUrl = manager.getSlideImage('image_id', 'hero');
const thumbnailUrl = manager.getSlideImage('image_id', 'thumbnail');

// Using custom options
const customUrl = manager.getSlideImage('image_id', {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto'
});
```

**getImageWithCaption(id: string, transform?: SlideImageOptions): ImageWithCaption | null**
Get image with caption and metadata.

**preloadImages(ids: string[], transform?: SlideImageOptions): Promise<void>**
Preload images for better performance.

#### Dataset Management

**addImages(images: Record<string, ImageData>): void**
Add new images to the dataset.

**removeImage(id: string): boolean**
Remove an image from the dataset.

**updateDataset(newData: Partial<ImageDataset>): void**
Update dataset with new data.

**exportDataset(): ImageDataset**
Export the complete dataset.

### Image Transforms

#### Presets
- `thumbnail` - 300x200, optimized for galleries
- `hero` - 1200x600, perfect for hero sections
- `fullscreen` - 1920x1080, full-screen displays
- `medium` - 800x600, general purpose

#### Custom Transforms
```typescript
interface TransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'scale' | 'fill' | 'fit' | 'crop';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
}
```

### Search Options

```typescript
interface SearchOptions {
  tags?: string[];           // Filter by tags
  artist?: string;          // Filter by artist
  year?: string | number;   // Filter by year
  collection?: string;      // Filter by collection
  limit?: number;          // Limit results
}
```

## Dataset Structure

### JSON Format
```json
{
  "metadata": {
    "version": "v2025-08-17T00-00-00-000Z",
    "createdAt": "2025-08-17T00:00:00.000Z",
    "updatedAt": "2025-08-17T00:00:00.000Z",
    "description": "Dataset description",
    "tags": ["tag1", "tag2"],
    "schemaVersion": "1.0.0"
  },
  "images": {
    "image_id": {
      "src": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      "caption": "Image description",
      "metadata": {
        "artist": "Artist Name",
        "year": 2023,
        "medium": "oil on canvas",
        "dimensions": "100x80cm",
        "collection": "Museum Name"
      },
      "tags": ["art", "painting"],
      "cloudinaryTransforms": {
        "custom_preset": "w_500,h_300,c_fill"
      }
    }
  }
}
```

## Versioning

The package uses semantic versioning for itself and timestamp-based versioning for datasets:

```typescript
import { VersionManager } from 'image-dataset-manager';

// Generate new version
const version = VersionManager.generateVersion(); // "v2025-08-17T12-30-45-123Z"

// Create metadata
const metadata = VersionManager.createMetadata("My dataset", ["art", "photos"]);
```

## Performance Tips

1. **Use presets** for common transformations
2. **Enable caching** (enabled by default)
3. **Preload images** for slide shows
4. **Use appropriate image sizes** for your use case

## Browser Support

- Modern browsers with ES2020 support
- Node.js 16+
- Works in both CommonJS and ES modules

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Examples

See the `/examples` directory for complete usage examples including:
- Basic Slidev integration
- Advanced search and filtering
- Custom transform presets
- Dataset migration scripts

---

Built with ❤️ for the creative community
