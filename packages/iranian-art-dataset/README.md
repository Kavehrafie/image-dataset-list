# Iranian Modern Art Dataset

A curated collection of Iranian modern art images with comprehensive metadata, perfect for educational presentations, art history research, and cultural projects.

## Installation

```bash
npm install @kavehrafie/iranian-art-dataset
```

## Usage

### Basic Usage

```javascript
import iranianArt from '@kavehrafie/iranian-art-dataset';
import { DatasetManager } from '@kavehrafie/image-dataset-manager';

const artCollection = new DatasetManager(iranianArt);

// Get a specific artwork
const ziapourWork = artCollection.getImage('ziapour_khorus_jangi');
console.log(ziapourWork.caption); // "Jalil Ziapour, Khorus Jangi magazine cover, 1949"

// Get optimized image for presentations
const heroImage = artCollection.getSlideImage('ziapour_khorus_jangi', 'hero');
```

### Advanced Usage

```javascript
import { 
  iranianArtDataset, 
  getArtistWorks, 
  getWorksByDecade, 
  artists 
} from '@kavehrafie/iranian-art-dataset';

// Get all works by Jalil Ziapour
const ziapourWorks = getArtistWorks('Ziapour');

// Get all artworks from the 1940s
const fortiesArt = getWorksByDecade('1940');

// List all available artists
console.log(artists);
// ['Jalil Ziāpour', 'Pablo Picasso', 'Hūshang Pezeshkniya', ...]
```

### In Slidev Presentations

```vue
<script setup>
import { DatasetManager } from '@kavehrafie/image-dataset-manager'
import iranianArt from '@kavehrafie/iranian-art-dataset'

const images = new DatasetManager(iranianArt)
</script>

<template>
  <div class="slide-content">
    <h1>Iranian Modern Art</h1>
    
    <!-- Hero image -->
    <img 
      :src="images.getSlideImage('ziapour_khorus_jangi', 'hero')" 
      alt="Ziapour Khorus Jangi"
    />
    
    <!-- Gallery of 1940s works -->
    <div class="gallery">
      <img 
        v-for="artwork in images.searchImages('1940', { limit: 4 })"
        :key="artwork.id"
        :src="images.getSlideImage(artwork.id, 'thumbnail')"
        :alt="artwork.caption"
      />
    </div>
  </div>
</template>
```

## Dataset Contents

This collection includes:

- **10 curated artworks** from Iranian modern art movement
- **Comprehensive metadata** including artist, year, medium, dimensions
- **High-quality images** hosted on Cloudinary with optimization support
- **Detailed captions** with proper attribution
- **Categorized tags** for easy filtering

### Featured Artists

- **Jalil Ziāpour** (1920-1999) - Pioneer of modern Iranian painting
- **Hūshang Pezeshkniya** - Contemporary Iranian artist
- **Manouchehr Sheybānī** - Modern Iranian painter
- **Pablo Picasso** - Reference works for comparative study

### Time Periods

- **1940s** - Early modern Iranian art movement
- **1950s** - Development of Iranian modernism
- **1960s-1970s** - Mature period of Iranian modern art

## Schema

Each artwork entry includes:

```json
{
  "src": "https://cloudinary-url",
  "caption": "Artist Name, Title, Year, Medium, Dimensions, Collection",
  "metadata": {
    "artist": "Artist Name",
    "year": 1949,
    "medium": "oil on canvas",
    "dimensions": "80cm x 120cm",
    "collection": "Museum/Collection"
  },
  "tags": ["tag1", "tag2", "period", "style"]
}
```

## License

MIT License - Cultural and educational use encouraged

## Contributing

This dataset is part of ongoing research into Iranian modern art. Contributions, corrections, and additions are welcome.

## Related Packages

- [`@kavehrafie/image-dataset-manager`](https://www.npmjs.com/package/@kavehrafie/image-dataset-manager) - Core dataset management library
- [`@kavehrafie/image-dataset-cli`](https://www.npmjs.com/package/@kavehrafie/image-dataset-cli) - CLI tools for dataset management
