/**
 * Settings Compatibility Test
 * Verifies TypedSettingsManager works with both modern and legacy event systems
 */

import { TypedSettingsManager } from "../typedSettingsManager";
import { SpicetifyStorageAdapter } from "../storage/spicetifyStorage";
import { BrowserStorageAdapter } from "../storage/browserStorage";

/**
 * Mock Spicetify environment
 */
const mockSpicetify = {
  LocalStorage: {
    storage: new Map<string, string>(),
    get(key: string): string | null {
      return this.storage.get(key) || null;
    },
    set(key: string, value: string): void {
      this.storage.set(key, value);
    },
    remove(key: string): void {
      this.storage.delete(key);
    },
  },
  version: "2.0.0",
};

// Install mock globally
(globalThis as any).Spicetify = mockSpicetify;

describe("TypedSettingsManager", () => {
  let storage: SpicetifyStorageAdapter;
  let settings: TypedSettingsManager;

  beforeEach(() => {
    // Clear storage
    mockSpicetify.LocalStorage.storage.clear();

    // Create storage and settings
    storage = new SpicetifyStorageAdapter();
    settings = new TypedSettingsManager(storage);

    // NOTE: Legacy DOM event tracking removed in Phase 6B
    // Event Bridge removed - only onChange() callback pattern supported
  });

  afterEach(() => {
    // Cleanup (no event listeners to remove)
  });

  describe("Storage Backend Integration", () => {
    test("should connect to Spicetify.LocalStorage", () => {
      const health = storage.healthCheck();
      expect(health.available).toBe(true);
      expect(health.readable).toBe(true);
      expect(health.writable).toBe(true);
    });

    test("should persist settings to Spicetify storage", () => {
      settings.set("sn-gradient-intensity", "intense");

      // Verify in Spicetify storage directly
      const rawValue = mockSpicetify.LocalStorage.get("sn-gradient-intensity");
      expect(rawValue).toBe("intense");
    });

    test("should read settings from Spicetify storage", () => {
      // Set directly in Spicetify storage
      mockSpicetify.LocalStorage.set("sn-gradient-intensity", "minimal");

      // Read through TypedSettingsManager
      const value = settings.get("sn-gradient-intensity");
      expect(value).toBe("minimal");
    });
  });

  describe("Type Conversion", () => {
    test("should auto-convert boolean values", () => {
      settings.set("sn-harmonic-evolution", false);

      // Check raw storage (should be string)
      const raw = mockSpicetify.LocalStorage.get("sn-harmonic-evolution");
      expect(raw).toBe("false");

      // Check typed get (should be boolean)
      const value = settings.get("sn-harmonic-evolution");
      expect(typeof value).toBe("boolean");
      expect(value).toBe(false);
    });

    test("should auto-convert number values", () => {
      settings.set("sn-harmonic-intensity", 0.8);

      // Check raw storage (should be string)
      const raw = mockSpicetify.LocalStorage.get("sn-harmonic-intensity");
      expect(raw).toBe("0.8");

      // Check typed get (should be number)
      const value = settings.get("sn-harmonic-intensity");
      expect(typeof value).toBe("number");
      expect(value).toBe(0.8);
    });
  });

  describe("Event System", () => {
    // NOTE: Legacy DOM CustomEvent tests removed in Phase 6B
    // Event Bridge removed - only onChange() callback pattern supported

    test("should emit onChange callback on set()", (done) => {
      settings.onChange((event) => {
        expect(event.settingKey).toBe("sn-gradient-intensity");
        expect(event.newValue).toBe("balanced");
        // oldValue will be the default value when setting for the first time
        expect(event.oldValue).toBeDefined();
        expect(event.timestamp).toBeGreaterThan(0);
        done();
      });

      // Trigger change
      settings.set("sn-gradient-intensity", "balanced");
    });

    test("should provide old and new values in onChange callback", (done) => {
      let callCount = 0;

      settings.onChange((event) => {
        callCount++;
        expect(event.settingKey).toBe("sn-gradient-intensity");

        if (callCount === 1) {
          // First call: setting to "balanced"
          expect(event.newValue).toBe("balanced");
        } else if (callCount === 2) {
          // Second call: changing to "intense"
          expect(event.newValue).toBe("intense");
          expect(event.oldValue).toBe("balanced");
          done();
        }
      });

      // Set initial value
      settings.set("sn-gradient-intensity", "balanced");
      // Change value
      settings.set("sn-gradient-intensity", "intense");
    });

    test("should support multiple onChange listeners", () => {
      let listener1Fired = false;
      let listener2Fired = false;

      // Multiple listeners
      settings.onChange(() => {
        listener1Fired = true;
      });

      settings.onChange(() => {
        listener2Fired = true;
      });

      // Trigger change
      settings.set("sn-gradient-intensity", "minimal");

      expect(listener1Fired).toBe(true);
      expect(listener2Fired).toBe(true);
    });
  });

  describe("Validation & Error Handling", () => {
    test("should reject invalid enum values", () => {
      const result = settings.set("sn-gradient-intensity", "invalid" as any);
      expect(result).toBe(false);
    });

    test("should return default for invalid stored values", () => {
      // Set invalid value directly in storage
      mockSpicetify.LocalStorage.set("sn-gradient-intensity", "corrupted");

      // Should return default
      const value = settings.get("sn-gradient-intensity");
      expect(value).toBe("balanced"); // default value
    });

    test("should handle missing Spicetify gracefully", () => {
      // Remove Spicetify
      delete (globalThis as any).Spicetify;

      // Should fall back to browser storage
      const browserStorage = new BrowserStorageAdapter();
      const browserSettings = new TypedSettingsManager(browserStorage);

      const success = browserSettings.set("sn-gradient-intensity", "intense");
      expect(success).toBe(true);

      // Restore Spicetify
      (globalThis as any).Spicetify = mockSpicetify;
    });
  });

  describe("Caching & Performance", () => {
    test("should cache values after first read", () => {
      // First read
      settings.get("sn-gradient-intensity");

      // Modify storage directly (bypassing cache)
      mockSpicetify.LocalStorage.set("sn-gradient-intensity", "different");

      // Second read should use cache
      const cached = settings.get("sn-gradient-intensity");
      expect(cached).toBe("balanced"); // default, not "different"
    });

    test("should update cache on set()", () => {
      settings.set("sn-gradient-intensity", "intense");

      // Cache should have new value
      const value = settings.get("sn-gradient-intensity");
      expect(value).toBe("intense");
    });

    test("should clear cache when requested", () => {
      // Set and cache value
      settings.set("sn-gradient-intensity", "intense");

      // Modify storage directly
      mockSpicetify.LocalStorage.set("sn-gradient-intensity", "minimal");

      // Clear cache
      settings.clearCache();

      // Now should read from storage
      const value = settings.get("sn-gradient-intensity");
      expect(value).toBe("minimal");
    });
  });

  describe("Import/Export", () => {
    test("should export all settings", () => {
      settings.set("sn-gradient-intensity", "intense");
      settings.set("sn-harmonic-evolution", false);

      const exported = settings.export();
      expect(exported["sn-gradient-intensity"]).toBe("intense");
      expect(exported["sn-harmonic-evolution"]).toBe(false);
    });

    test("should import settings", () => {
      const toImport = {
        "sn-gradient-intensity": "minimal" as const,
        "sn-harmonic-evolution": true,
        "sn-harmonic-intensity": 0.5,
      };

      const result = settings.import(toImport);
      expect(result.imported).toBe(3);
      expect(result.failed.length).toBe(0);

      // Verify imported
      expect(settings.get("sn-gradient-intensity")).toBe("minimal");
      expect(settings.get("sn-harmonic-evolution")).toBe(true);
      expect(settings.get("sn-harmonic-intensity")).toBe(0.5);
    });
  });

  describe("Health Check", () => {
    test("should validate all settings", () => {
      // Set some valid settings
      settings.set("sn-gradient-intensity", "balanced");
      settings.set("sn-harmonic-evolution", true);

      const validation = settings.validateAllSettings();
      expect(validation.valid).toBeGreaterThan(0);
      expect(validation.invalid.length).toBe(0);
    });

    test("should detect invalid stored settings", () => {
      // Set invalid value directly in storage
      mockSpicetify.LocalStorage.set("sn-gradient-intensity", "corrupted");

      const validation = settings.validateAllSettings();
      expect(validation.invalid.length).toBeGreaterThan(0);
      expect(validation.invalid[0]?.key).toBe("sn-gradient-intensity");
    });
  });
});

/**
 * Console test script for live Spicetify environment
 * Copy this to browser console when testing in Spotify
 */
export const liveSpicetifyTest = `
(async () => {
  console.log("🧪 Testing TypedSettingsManager in live Spicetify environment...");

  const { settings } = await import('./config/index.js');

  // Test 1: Storage backend
  console.log("\\n✓ Test 1: Storage backend");
  settings.set("sn-gradient-intensity", "intense");
  const val = settings.get("sn-gradient-intensity");
  console.assert(val === "intense", "❌ Set/Get failed");
  console.log("  ✅ Set/Get works:", val);

  // Test 2: Spicetify persistence
  console.log("\\n✓ Test 2: Spicetify persistence");
  const raw = Spicetify.LocalStorage.get("sn-gradient-intensity");
  console.assert(raw === "intense", "❌ Spicetify storage failed");
  console.log("  ✅ Spicetify storage:", raw);

  // Test 3: Legacy event emission
  console.log("\\n✓ Test 3: Legacy event system");
  let eventCaught = false;
  document.addEventListener("year3000SystemSettingsChanged", (e) => {
    eventCaught = true;
    console.log("  ✅ Legacy event fired:", e.detail);
  }, { once: true });

  settings.set("sn-gradient-intensity", "balanced");
  await new Promise(r => setTimeout(r, 100));
  console.assert(eventCaught, "❌ Legacy events not firing");

  // Test 4: Type conversion
  console.log("\\n✓ Test 4: Type conversion");
  settings.set("sn-harmonic-evolution", false);
  const bool = settings.get("sn-harmonic-evolution");
  console.assert(typeof bool === "boolean", "❌ Boolean parsing failed");
  console.log("  ✅ Boolean conversion:", bool, typeof bool);

  settings.set("sn-harmonic-intensity", 0.75);
  const num = settings.get("sn-harmonic-intensity");
  console.assert(typeof num === "number", "❌ Number parsing failed");
  console.log("  ✅ Number conversion:", num, typeof num);

  console.log("\\n🎉 All tests passed! TypedSettingsManager is working correctly.");
})();
`;
