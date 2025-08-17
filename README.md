# Image Dataset Manager

A comprehensive TypeScript library for managing versioned image datasets with seamless integration for Slidev presentations. Features powerful utility functions, Cloudinary transformations, and CLI tools for modern web development workflows.

## Quick Start

### 1. For JavaScript/TypeScript Projects

```bash
# Install the core library
npm install @kavehrafie/image-dataset-manager

# Add a dataset
npm install @kavehrafie/iranian-art-dataset
```

```javascript
import { DatasetManager } from '@kavehrafie/image-dataset-manager'
import iranianArt from '@kavehrafie/iranian-art-dataset'

const images = new DatasetManager(iranianArt)
const heroImage = images.getSlideImage('ziapour_khorus_jangi', 'hero')
```

### 2. For Slidev Presentations

```bash
# Create new Slidev project
npx create-slidev my-presentation
cd my-presentation

# Setup dataset management
npx @kavehrafie/image-dataset-cli init --template slidev

# Add Iranian art collection
npx @kavehrafie/image-dataset-cli add iranian-art
```

### 3. Command Line Usage

```bash
# Install CLI globally
npm install -g @kavehrafie/image-dataset-cli

# Create custom dataset
idm create my-collection

# Validate dataset structure
idm validate ./data/my-dataset.json
```

## Overview

This monorepo contains three packages designed to work together:

### [@kavehrafie/image-dataset-manager](./packages/core) ![npm](https://img.shields.io/npm/v/@kavehrafie/image-dataset-manager)

The core TypeScript library providing:
- **DatasetManager**: Load and query image datasets
- **ImageUtils**: Cloudinary transformations and optimizations  
- **VersionManager**: Handle dataset versioning and updates
- **Type Safety**: Full TypeScript definitions

### [@kavehrafie/image-dataset-cli](./packages/cli) ![npm](https://img.shields.io/npm/v/@kavehrafie/image-dataset-cli)

Command-line tools for:
- **Project Setup**: Initialize dataset structure in projects
- **Dataset Management**: Add, create, and validate datasets
- **Template Integration**: Slidev-specific configurations

### [@kavehrafie/iranian-art-dataset](./packages/iranian-art-dataset) ![npm](https://img.shields.io/npm/v/@kavehrafie/iranian-art-dataset)

A curated collection of Iranian modern art:
- **12 High-Quality Images**: From renowned Iranian artists
- **Rich Metadata**: Artist info, descriptions, historical context
- **Helper Functions**: Filter by artist, decade, or style
- **Educational Focus**: Perfect for presentations and research

## Installation

### Core Library

```bash
npm install @kavehrafie/image-dataset-manager
```

### CLI Tools

```bash
# Global installation
npm install -g @kavehrafie/image-dataset-cli

# Or use directly
npx @kavehrafie/image-dataset-cli --help
```

### Dataset Packages

```bash
npm install @kavehrafie/iranian-art-dataset
```

## Key Features

- **🎨 Slidev Integration**: Optimized for presentation workflows
- **☁️ Cloudinary Support**: Advanced image transformations
- **📱 Responsive Images**: Automatic sizing for different screen sizes
- **🔧 TypeScript First**: Full type safety and IntelliSense
- **📦 Zero Dependencies**: Lightweight core library
- **🚀 Modern ESM**: ES modules with CommonJS compatibility
- **🎯 CLI Tools**: Streamlined project setup and management

## Basic Usage

### DatasetManager

```javascript
import { DatasetManager } from '@kavehrafie/image-dataset-manager'
import dataset from './my-dataset.json'

const manager = new DatasetManager(dataset)

// Get image by ID
const image = manager.getImage('artwork_001')

// Get optimized image for presentations
const slideImage = manager.getSlideImage('artwork_001', 'hero')
```

### ImageUtils

```javascript
import { ImageUtils } from '@kavehrafie/image-dataset-manager'

// Apply Cloudinary transformations
const optimized = ImageUtils.applyCloudinaryTransform(
  'sample_image',
  { width: 800, height: 600, crop: 'fill' }
)

// Get responsive image with preset
const responsive = ImageUtils.getResponsiveImage('my_image', 'hero')
```

### VersionManager

```javascript
import { VersionManager } from '@kavehrafie/image-dataset-manager'

const versionManager = new VersionManager()

// Check for updates
const hasUpdates = await versionManager.checkForUpdates('my-dataset', '1.0.0')

// Get changelog
const changelog = await versionManager.getChangelog('my-dataset')
```

## Cloudinary Integration

Configure Cloudinary for advanced image transformations:

```javascript
import { ImageUtils } from '@kavehrafie/image-dataset-manager'

// Set your cloud name globally
ImageUtils.setCloudName('your-cloud-name')

// Use transformations
const transformed = ImageUtils.applyCloudinaryTransform('image_id', {
  width: 1200,
  height: 800,
  crop: 'fill',
  quality: 'auto',
  format: 'webp'
})
```

## Development

### Prerequisites

- Node.js 16+
- npm 7+

### Setup

```bash
# Clone repository
git clone https://github.com/kavehrafie/image-dataset-list.git
cd image-dataset-list

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

### Package Structure

```
packages/
├── core/                 # Main library (@kavehrafie/image-dataset-manager)
├── cli/                  # CLI tools (@kavehrafie/image-dataset-cli)
└── iranian-art-dataset/  # Sample dataset (@kavehrafie/iranian-art-dataset)
```

### Development Workflow

1. Make changes in relevant package
2. Run tests: `npm test`
3. Build: `npm run build`
4. Test locally: `npm link` in package directory

## Versioning and Publishing

### Development Workflow

```bash
# 1. Clone and setup
git clone https://github.com/kavehrafie/image-dataset-list.git
cd image-dataset-list
npm install

# 2. Make changes and test
npm run build
npm test

# 3. Update package versions
cd packages/core && npm version patch  # or minor/major
cd packages/cli && npm version patch
cd packages/iranian-art-dataset && npm version patch
```

### Publishing Process

#### Individual Package Publishing

```bash
# Core library
cd packages/core
npm publish --access public

# CLI tools
cd packages/cli  
npm publish --access public

# Dataset
cd packages/iranian-art-dataset
npm publish --access public
```

#### Automated Publishing (Lerna)

```bash
# Publish all changed packages
npx lerna publish

# Publish specific version
npx lerna publish --exact
```

### Pre-Publication Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Version numbers updated
- [ ] CHANGELOG.md updated
- [ ] README.md reviewed
- [ ] No sensitive data in packages

### Version Strategy

- **Core Library**: Semantic versioning (major.minor.patch)
  - Major: Breaking API changes
  - Minor: New features, backward compatible
  - Patch: Bug fixes
  
- **CLI Tools**: Follows core library major/minor versions
  - Independent patch versions for tool-specific fixes
  
- **Dataset Packages**: Content-based versioning
  - Major: Structural changes to dataset schema
  - Minor: New images or metadata fields
  - Patch: Corrections, optimizations

### Dependency Management

```bash
# Update dependencies across all packages
npx lerna exec -- npm update

# Check for outdated packages
npx lerna exec -- npm outdated

# Add dependency to specific package
npx lerna add lodash --scope=@kavehrafie/image-dataset-manager
```

### Release Notes Template

```markdown
## [1.2.0] - 2024-01-15

### Added
- New transformation presets for mobile displays
- Support for WebP format optimization

### Changed  
- Improved error handling in DatasetManager
- Updated TypeScript to 5.0

### Fixed
- Fixed memory leak in large dataset processing
- Corrected Cloudinary URL generation for special characters

### Breaking Changes
- None

### Migration Guide
- No migration required for this version
```

### Emergency Fixes

For critical bugs requiring immediate patch:

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-bug main

# 2. Fix and test
npm test

# 3. Version bump (patch only)
cd packages/core && npm version patch

# 4. Publish immediately
npm publish --access public

# 5. Merge back to main
git checkout main
git merge hotfix/critical-bug
```

### Package Size Monitoring

```bash
# Check package sizes before publishing
npx bundlesize

# Analyze what's included
npm pack --dry-run
```

## FAQ

### Can I use this with other presentation frameworks besides Slidev?

Yes! While optimized for Slidev, the core library works with any JavaScript framework including React, Vue, Angular, or vanilla HTML/JS.

### How do I add my own images to a dataset?

Use the CLI to create a new dataset:

```bash
idm create my-photos
```

Then edit the generated JSON file to add your image metadata.

### Can I use external image URLs instead of Cloudinary?

Absolutely! The `url` field in each image object can point to any accessible image URL. Cloudinary integration is optional.

### How do I contribute new datasets?

1. Fork this repository
2. Create a new package in `packages/` following the Iranian art dataset structure  
3. Submit a pull request with proper attribution and licensing

### What image formats are supported?

The library supports any web-compatible image format (JPEG, PNG, WebP, SVG). Cloudinary transformations work best with JPEG and PNG.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/kavehrafie/image-dataset-list#readme)
- 🐛 [Issue Tracker](https://github.com/kavehrafie/image-dataset-list/issues)  
- 💬 [Discussions](https://github.com/kavehrafie/image-dataset-list/discussions)
