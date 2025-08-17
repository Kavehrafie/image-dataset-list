# @kavehrafie/image-dataset-cli

Command-line tools for managing image datasets in your projects.

## Installation

```bash
# Global installation
npm install -g @kavehrafie/image-dataset-cli

# Or use directly with npx
npx @kavehrafie/image-dataset-cli --help
```

## Commands

### Initialize Project

```bash
# Create dataset management structure in current directory
idm init

# Initialize with a specific template
idm init --template slidev
```

### Add Datasets

```bash
# Add Iranian art collection
idm add iranian-art

# Add to specific directory
idm add iranian-art --dir ./assets/data
```

### Create Custom Dataset

```bash
# Create new empty dataset
idm create my-collection

# Create with description and tags
idm create my-photos --dir ./data
```

### List Available Datasets

```bash
# Show all bundled datasets
idm list
```

### Validate Dataset

```bash
# Validate dataset against schema
idm validate ./data/my-dataset.json
```

## Usage in Slidev Projects

```bash
# 1. Setup Slidev project with dataset support
npx create-slidev my-presentation
cd my-presentation
idm init --template slidev

# 2. Add Iranian art dataset
idm add iranian-art ./src/data/

# 3. Use in your slides
```

```vue
<script setup>
import { DatasetManager } from '@kavehrafie/image-dataset-manager'
import iranianArt from './src/data/iranian-art.json'

const images = new DatasetManager(iranianArt)
</script>

<template>
  <img :src="images.getSlideImage('ziapour_khorus_jangi', 'hero')" />
</template>
```

## Aliases

- `idm` - Short alias for `image-dataset-manager`
- `image-dataset-manager` - Full command name

## Related Packages

- [@kavehrafie/image-dataset-manager](../core) - Core library
- [@kavehrafie/iranian-art-dataset](../iranian-art-dataset) - Iranian art collection

## Development

```bash
# Build CLI
npm run build

# Test locally
node dist/index.js --help
```

## Publishing Updates

```bash
# Update version
npm version patch|minor|major

# Publish
npm publish --access public
```
