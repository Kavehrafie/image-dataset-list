/**
 * Example: Using Image Dataset Manager in Slidev Presentations
 *
 * This example shows how to integrate the package with Slidev
 * for optimized image handling in presentations.
 */

// slidev-example.vue
export const slidevExample = `
<script setup>
import { DatasetManager } from 'image-dataset-manager';
// Import your dataset JSON file
import artDataset from '../data/art-collection.json';

// Create the dataset manager
const images = new DatasetManager(artDataset);

// Get images for different sections
const heroImage = images.getImageWithCaption('featured_artwork', 'hero');
const galleryImages = images.getImagesByTag('gallery').slice(0, 6);
const comparisonImages = images.searchImages('comparison', { limit: 2 });

// Preload images for better performance
onMounted(async () => {
  const imageIds = ['featured_artwork', ...galleryImages.map(img => img.id)];
  await images.preloadImages(imageIds, 'medium');
});
</script>

<template>
  <!-- Slide 1: Hero Slide -->
  <div class="hero-slide">
    <div class="hero-content">
      <img 
        :src="images.getSlideImage('featured_artwork', 'hero')" 
        :alt="heroImage?.caption"
        class="hero-image"
      />
      <div class="hero-text">
        <h1>{{ heroImage?.metadata?.artist }}</h1>
        <p>{{ heroImage?.caption }}</p>
      </div>
    </div>
  </div>

  <!-- Slide 2: Gallery Grid -->
  <div class="gallery-slide">
    <h2>Gallery Collection</h2>
    <div class="image-grid">
      <div 
        v-for="img in galleryImages" 
        :key="img.id"
        class="gallery-item"
      >
        <img 
          :src="images.getSlideImage(img.id, 'thumbnail')" 
          :alt="img.caption"
          class="gallery-image"
        />
        <p class="image-caption">{{ img.metadata?.artist }}, {{ img.metadata?.year }}</p>
      </div>
    </div>
  </div>

  <!-- Slide 3: Comparison Slide -->
  <div class="comparison-slide">
    <h2>Visual Comparison</h2>
    <div class="comparison-container">
      <div 
        v-for="img in comparisonImages" 
        :key="img.id"
        class="comparison-item"
      >
        <img 
          :src="images.getSlideImage(img.id, { width: 600, height: 400, crop: 'fit' })" 
          :alt="img.caption"
        />
        <div class="comparison-details">
          <h3>{{ img.metadata?.artist }}</h3>
          <p>{{ img.caption }}</p>
          <span class="year">{{ img.metadata?.year }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Slide 4: Detail View with Multiple Sizes -->
  <div class="detail-slide">
    <div class="detail-layout">
      <div class="main-image">
        <img 
          :src="images.getSlideImage('detail_artwork', 'fullscreen')" 
          alt="Detailed view"
        />
      </div>
      <div class="thumbnails">
        <img 
          v-for="id in ['detail_1', 'detail_2', 'detail_3']"
          :key="id"
          :src="images.getSlideImage(id, 'thumbnail')"
          :alt="images.getImage(id)?.caption"
          class="detail-thumbnail"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-slide {
  @apply h-full flex items-center justify-center bg-gray-900;
}

.hero-content {
  @apply flex items-center gap-8 max-w-6xl mx-auto px-8;
}

.hero-image {
  @apply w-1/2 h-auto rounded-lg shadow-2xl;
}

.hero-text {
  @apply w-1/2 text-white;
}

.hero-text h1 {
  @apply text-4xl font-bold mb-4;
}

.hero-text p {
  @apply text-xl opacity-90;
}

.gallery-slide {
  @apply p-8 h-full;
}

.gallery-slide h2 {
  @apply text-3xl font-bold mb-8 text-center;
}

.image-grid {
  @apply grid grid-cols-3 gap-6 max-w-4xl mx-auto;
}

.gallery-item {
  @apply text-center;
}

.gallery-image {
  @apply w-full h-48 object-cover rounded-lg shadow-lg;
}

.image-caption {
  @apply mt-2 text-sm text-gray-600;
}

.comparison-slide {
  @apply p-8 h-full;
}

.comparison-container {
  @apply flex gap-8 items-center justify-center h-full;
}

.comparison-item {
  @apply flex-1 text-center;
}

.comparison-item img {
  @apply w-full h-auto rounded-lg shadow-lg mb-4;
}

.comparison-details h3 {
  @apply text-xl font-semibold mb-2;
}

.comparison-details p {
  @apply text-gray-600 mb-1;
}

.year {
  @apply text-sm text-gray-500;
}

.detail-slide {
  @apply p-8 h-full;
}

.detail-layout {
  @apply flex gap-8 h-full;
}

.main-image {
  @apply flex-1;
}

.main-image img {
  @apply w-full h-full object-contain;
}

.thumbnails {
  @apply w-48 flex flex-col gap-4;
}

.detail-thumbnail {
  @apply w-full h-32 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity;
}
</style>
`;

// Advanced usage with reactive search
export const reactiveSearchExample = `
<script setup>
import { ref, computed } from 'vue';
import { DatasetManager } from 'image-dataset-manager';
import artDataset from '../data/art-collection.json';

const images = new DatasetManager(artDataset);

// Reactive search state
const searchQuery = ref('');
const selectedTag = ref('');
const selectedArtist = ref('');

// Available options
const availableTags = computed(() => images.getAllTags());
const availableArtists = computed(() => images.getAllArtists());

// Reactive search results
const searchResults = computed(() => {
  if (!searchQuery.value && !selectedTag.value && !selectedArtist.value) {
    return images.getAllImages().slice(0, 9); // Show first 9 images
  }

  return images.searchImages(searchQuery.value, {
    tags: selectedTag.value ? [selectedTag.value] : undefined,
    artist: selectedArtist.value || undefined,
    limit: 12
  });
});

// Clear filters
const clearFilters = () => {
  searchQuery.value = '';
  selectedTag.value = '';
  selectedArtist.value = '';
};
</script>

<template>
  <div class="search-slide">
    <h2>Interactive Art Browser</h2>
    
    <!-- Search Controls -->
    <div class="search-controls">
      <input 
        v-model="searchQuery"
        placeholder="Search artworks..."
        class="search-input"
      />
      
      <select v-model="selectedTag" class="filter-select">
        <option value="">All Tags</option>
        <option v-for="tag in availableTags" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>
      
      <select v-model="selectedArtist" class="filter-select">
        <option value="">All Artists</option>
        <option v-for="artist in availableArtists" :key="artist" :value="artist">
          {{ artist }}
        </option>
      </select>
      
      <button @click="clearFilters" class="clear-button">
        Clear Filters
      </button>
    </div>

    <!-- Results -->
    <div class="results-info">
      Found {{ searchResults.length }} artwork(s)
    </div>

    <!-- Image Grid -->
    <div class="results-grid">
      <div 
        v-for="img in searchResults" 
        :key="img.id"
        class="result-item"
      >
        <img 
          :src="images.getSlideImage(img.id, 'thumbnail')" 
          :alt="img.caption"
          class="result-image"
        />
        <div class="result-info">
          <h4>{{ img.metadata?.artist }}</h4>
          <p>{{ img.caption }}</p>
          <div class="tags">
            <span 
              v-for="tag in img.tags" 
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-slide {
  @apply p-6 h-full overflow-y-auto;
}

.search-controls {
  @apply flex gap-4 mb-6 items-center;
}

.search-input {
  @apply flex-1 px-4 py-2 border rounded-lg;
}

.filter-select {
  @apply px-4 py-2 border rounded-lg bg-white;
}

.clear-button {
  @apply px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600;
}

.results-info {
  @apply mb-4 text-gray-600;
}

.results-grid {
  @apply grid grid-cols-3 gap-6;
}

.result-item {
  @apply border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow;
}

.result-image {
  @apply w-full h-48 object-cover;
}

.result-info {
  @apply p-4;
}

.result-info h4 {
  @apply font-semibold mb-1;
}

.result-info p {
  @apply text-sm text-gray-600 mb-2;
}

.tags {
  @apply flex gap-1 flex-wrap;
}

.tag {
  @apply text-xs bg-gray-200 px-2 py-1 rounded;
}
</style>
`;

console.log("Slidev integration examples created!");
console.log("Check the exported examples for copy-paste templates.");
