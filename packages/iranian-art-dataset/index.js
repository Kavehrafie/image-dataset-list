/**
 * Iranian Modern Art Dataset
 * 
 * A curated collection of Iranian modern art images with comprehensive metadata.
 * Perfect for educational presentations, art history research, and cultural projects.
 */

import dataset from './iranian-modern-art-v1.json' assert { type: 'json' };

export default dataset;

// Named exports for convenience
export const iranianArtDataset = dataset;
export const metadata = dataset.metadata;
export const images = dataset.images;

// Helper to get specific artists
export const getArtistWorks = (artistName) => {
  return Object.entries(images)
    .filter(([_, image]) => 
      image.metadata?.artist?.toLowerCase().includes(artistName.toLowerCase())
    )
    .reduce((acc, [id, image]) => {
      acc[id] = image;
      return acc;
    }, {});
};

// Get works by decade
export const getWorksByDecade = (decade) => {
  const startYear = parseInt(decade);
  const endYear = startYear + 9;
  
  return Object.entries(images)
    .filter(([_, image]) => {
      const year = parseInt(image.metadata?.year);
      return year >= startYear && year <= endYear;
    })
    .reduce((acc, [id, image]) => {
      acc[id] = image;
      return acc;
    }, {});
};

// Available artists
export const artists = [...new Set(
  Object.values(images)
    .map(img => img.metadata?.artist)
    .filter(Boolean)
)].sort();
