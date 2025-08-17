/**
 * Version management utilities for dataset versioning
 */

export class VersionManager {
  private static readonly SCHEMA_VERSION = "1.0.0";

  /**
   * Generate a new dataset version string
   */
  static generateVersion(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `v${timestamp}`;
  }

  /**
   * Get current schema version
   */
  static getSchemaVersion(): string {
    return this.SCHEMA_VERSION;
  }

  /**
   * Parse version string to extract timestamp
   */
  static parseVersion(version: string): Date | null {
    try {
      // Convert v2025-08-17T12-30-45-123Z to 2025-08-17T12:30:45.123Z
      const timestampStr = version.replace("v", "");
      const parts = timestampStr.split("T");
      if (parts.length !== 2) return null;

      const datePart = parts[0]; // 2025-08-17
      const timePart = parts[1].replace("Z", ""); // 12-30-45-123
      const timeSegments = timePart.split("-"); // [12, 30, 45, 123]

      if (timeSegments.length !== 4) return null;

      const isoString = `${datePart}T${timeSegments[0]}:${timeSegments[1]}:${timeSegments[2]}.${timeSegments[3]}Z`;
      return new Date(isoString);
    } catch {
      return null;
    }
  }

  /**
   * Compare two version strings
   */
  static compareVersions(v1: string, v2: string): number {
    const date1 = this.parseVersion(v1);
    const date2 = this.parseVersion(v2);

    if (!date1 || !date2) {
      return v1.localeCompare(v2);
    }

    return date1.getTime() - date2.getTime();
  }

  /**
   * Check if version is compatible with current schema
   */
  static isCompatible(version: string): boolean {
    // For now, all versions are compatible
    // This can be extended for breaking changes
    return true;
  }

  /**
   * Generate metadata for a new dataset version
   */
  static createMetadata(description?: string, tags?: string[]) {
    const now = new Date().toISOString();
    return {
      version: this.generateVersion(),
      createdAt: now,
      updatedAt: now,
      schemaVersion: this.SCHEMA_VERSION,
      description,
      tags,
    };
  }
}
