import { DatasetManager } from "../dataset";
import { ImageUtils } from "../utils";
import { VersionManager } from "../version";

// Sample dataset for testing
const sampleDataset = {
  metadata: {
    version: "v2025-08-17T00-00-00-000Z",
    createdAt: "2025-08-17T00:00:00.000Z",
    updatedAt: "2025-08-17T00:00:00.000Z",
    description: "Test dataset",
    schemaVersion: "1.0.0",
  },
  images: {
    test_image_1: {
      src: "https://res.cloudinary.com/test/image/upload/v123/sample.jpg",
      caption: "Test Image 1",
      metadata: {
        artist: "Test Artist",
        year: 2023,
      },
      tags: ["test", "sample"],
    },
    test_image_2: {
      src: "https://example.com/image2.jpg",
      caption: "Test Image 2 with Artist Name",
      metadata: {
        artist: "Another Artist",
        year: 2022,
      },
      tags: ["test", "different"],
    },
  },
};

describe("DatasetManager", () => {
  let manager: DatasetManager;

  beforeEach(() => {
    manager = new DatasetManager(sampleDataset);
  });

  describe("Basic Operations", () => {
    test("should get image by ID", () => {
      const image = manager.getImage("test_image_1");
      expect(image).toBeTruthy();
      expect(image?.caption).toBe("Test Image 1");
    });

    test("should return null for non-existent image", () => {
      const image = manager.getImage("non_existent");
      expect(image).toBeNull();
    });

    test("should get all images", () => {
      const images = manager.getAllImages();
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveProperty("id");
    });

    test("should get images by tag", () => {
      const testImages = manager.getImagesByTag("test");
      expect(testImages).toHaveLength(2);

      const differentImages = manager.getImagesByTag("different");
      expect(differentImages).toHaveLength(1);
    });
  });

  describe("Search Functionality", () => {
    test("should search images by text", () => {
      const results = manager.searchImages("Artist Name");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("test_image_2");
    });

    test("should search images with filters", () => {
      const results = manager.searchImages("Test", {
        artist: "Test Artist",
      });
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("test_image_1");
    });

    test("should limit search results", () => {
      const results = manager.searchImages("Test", { limit: 1 });
      expect(results).toHaveLength(1);
    });
  });

  describe("Slide Integration", () => {
    test("should get slide image with default options", () => {
      const url = manager.getSlideImage("test_image_1");
      expect(url).toBe(sampleDataset.images.test_image_1.src);
    });

    test("should get image with caption", () => {
      const result = manager.getImageWithCaption("test_image_1");
      expect(result).toBeTruthy();
      expect(result?.caption).toBe("Test Image 1");
      expect(result?.id).toBe("test_image_1");
    });

    test("should return null for non-existent image with caption", () => {
      const result = manager.getImageWithCaption("non_existent");
      expect(result).toBeNull();
    });
  });

  describe("Dataset Management", () => {
    test("should add new images", () => {
      const manager = new DatasetManager(
        JSON.parse(JSON.stringify(sampleDataset))
      );
      manager.addImages({
        new_image: {
          src: "https://example.com/new.jpg",
          caption: "New Image",
        },
      });

      const image = manager.getImage("new_image");
      expect(image).toBeTruthy();
      expect(image?.caption).toBe("New Image");
    });

    test("should remove images", () => {
      const manager = new DatasetManager(
        JSON.parse(JSON.stringify(sampleDataset))
      );
      const removed = manager.removeImage("test_image_1");
      expect(removed).toBe(true);

      const image = manager.getImage("test_image_1");
      expect(image).toBeNull();
    });

    test("should export dataset", () => {
      const exported = manager.exportDataset();
      expect(exported).toHaveProperty("metadata");
      expect(exported).toHaveProperty("images");
    });

    test("should get all tags", () => {
      const tags = manager.getAllTags();
      expect(tags).toContain("test");
      expect(tags).toContain("sample");
      expect(tags).toContain("different");
    });

    test("should get all artists", () => {
      const artists = manager.getAllArtists();
      expect(artists).toContain("Test Artist");
      expect(artists).toContain("Another Artist");
    });
  });
});

describe("ImageUtils", () => {
  describe("Cloudinary URL Detection", () => {
    test("should detect Cloudinary URLs", () => {
      const cloudinaryUrl =
        "https://res.cloudinary.com/test/image/upload/v123/sample.jpg";
      const regularUrl = "https://example.com/image.jpg";

      expect(ImageUtils.isCloudinaryUrl(cloudinaryUrl)).toBe(true);
      expect(ImageUtils.isCloudinaryUrl(regularUrl)).toBe(false);
    });
  });

  describe("Transform Building", () => {
    test("should build transform string", () => {
      const transform = ImageUtils.buildTransformString({
        width: 300,
        height: 200,
        crop: "fill",
        quality: "auto",
      });

      expect(transform).toBe("w_300,h_200,c_fill,q_auto");
    });

    test("should apply transforms to Cloudinary URL", () => {
      const url =
        "https://res.cloudinary.com/test/image/upload/v123/sample.jpg";
      const transformed = ImageUtils.applyTransform(url, { width: 300 });

      expect(transformed).toContain("w_300");
    });

    test("should not transform non-Cloudinary URLs", () => {
      const url = "https://example.com/image.jpg";
      const transformed = ImageUtils.applyTransform(url, { width: 300 });

      expect(transformed).toBe(url);
    });
  });

  describe("Presets", () => {
    test("should apply preset transformations", () => {
      const url =
        "https://res.cloudinary.com/test/image/upload/v123/sample.jpg";
      const transformed = ImageUtils.applyPreset(url, "thumbnail");

      expect(transformed).toContain("w_300");
      expect(transformed).toContain("h_200");
    });
  });
});

describe("VersionManager", () => {
  test("should generate valid version string", () => {
    const version = VersionManager.generateVersion();
    expect(version).toMatch(/^v\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z$/);
  });

  test("should get schema version", () => {
    const schemaVersion = VersionManager.getSchemaVersion();
    expect(schemaVersion).toBe("1.0.0");
  });

  test("should parse version to date", () => {
    const version = "v2025-08-17T12-30-45-123Z";
    const date = VersionManager.parseVersion(version);

    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2025);
  });

  test("should create metadata", () => {
    const metadata = VersionManager.createMetadata("Test dataset", ["test"]);

    expect(metadata).toHaveProperty("version");
    expect(metadata).toHaveProperty("createdAt");
    expect(metadata).toHaveProperty("updatedAt");
    expect(metadata.description).toBe("Test dataset");
    expect(metadata.tags).toContain("test");
  });
});
