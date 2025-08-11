import type { StorageInterface } from "../typedSettingsManager";

/**
 * Browser localStorage adapter
 * Fallback storage for non-Spicetify environments
 */
export class BrowserStorageAdapter implements StorageInterface {
  private prefix: string;
  
  constructor(prefix: string = "sn-") {
    this.prefix = prefix;
  }
  
  /**
   * Get prefixed key for storage
   */
  private getPrefixedKey(key: string): string {
    return key.startsWith(this.prefix) ? key : `${this.prefix}${key}`;
  }
  
  /**
   * Check if localStorage is available
   */
  private isAvailable(): boolean {
    try {
      return typeof localStorage !== "undefined" && localStorage !== null;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get value from localStorage
   */
  get(key: string): string | null {
    if (!this.isAvailable()) {
      console.warn(`[BrowserStorageAdapter] localStorage not available for key: ${key}`);
      return null;
    }
    
    try {
      return localStorage.getItem(this.getPrefixedKey(key));
    } catch (error) {
      console.error(`[BrowserStorageAdapter] Error reading key ${key}:`, error);
      return null;
    }
  }
  
  /**
   * Set value in localStorage
   */
  set(key: string, value: string): boolean {
    if (!this.isAvailable()) {
      console.warn(`[BrowserStorageAdapter] localStorage not available for key: ${key}`);
      return false;
    }
    
    try {
      localStorage.setItem(this.getPrefixedKey(key), value);
      return true;
    } catch (error) {
      console.error(`[BrowserStorageAdapter] Error setting key ${key}:`, error);
      return false;
    }
  }
  
  /**
   * Remove value from localStorage
   */
  remove(key: string): boolean {
    if (!this.isAvailable()) {
      console.warn(`[BrowserStorageAdapter] localStorage not available for key: ${key}`);
      return false;
    }
    
    try {
      localStorage.removeItem(this.getPrefixedKey(key));
      return true;
    } catch (error) {
      console.error(`[BrowserStorageAdapter] Error removing key ${key}:`, error);
      return false;
    }
  }
  
  /**
   * Get all keys with the configured prefix
   */
  getAllKeys(): string[] {
    if (!this.isAvailable()) {
      return [];
    }
    
    const keys: string[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          // Return the key without the prefix
          keys.push(key.substring(this.prefix.length));
        }
      }
    } catch (error) {
      console.error("[BrowserStorageAdapter] Error enumerating keys:", error);
    }
    
    return keys;
  }
  
  /**
   * Clear all keys with the configured prefix
   */
  clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    
    try {
      const keys = this.getAllKeys();
      for (const key of keys) {
        localStorage.removeItem(this.getPrefixedKey(key));
      }
      return true;
    } catch (error) {
      console.error("[BrowserStorageAdapter] Error clearing storage:", error);
      return false;
    }
  }
  
  /**
   * Get storage usage statistics
   */
  getUsageStats(): {
    totalKeys: number;
    totalSize: number;
    avgKeySize: number;
    availableQuota?: number;
  } {
    const stats: {
      totalKeys: number;
      totalSize: number;
      avgKeySize: number;
      availableQuota?: number;
    } = {
      totalKeys: 0,
      totalSize: 0,
      avgKeySize: 0,
    };
    
    if (!this.isAvailable()) {
      return stats;
    }
    
    try {
      const keys = this.getAllKeys();
      stats.totalKeys = keys.length;
      
      for (const key of keys) {
        const value = this.get(key);
        if (value !== null) {
          stats.totalSize += key.length + value.length;
        }
      }
      
      stats.avgKeySize = stats.totalKeys > 0 ? stats.totalSize / stats.totalKeys : 0;
      
      // Try to estimate available quota (not reliably available)
      if (typeof navigator !== "undefined" && "storage" in navigator && "estimate" in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          if (estimate.quota !== undefined) {
            stats.availableQuota = estimate.quota;
          }
        }).catch(() => {
          // Ignore quota estimation errors
        });
      }
    } catch (error) {
      console.error("[BrowserStorageAdapter] Error calculating usage stats:", error);
    }
    
    return stats;
  }
}

/**
 * Create a browser storage adapter instance
 */
export function createBrowserStorage(prefix?: string): BrowserStorageAdapter {
  return new BrowserStorageAdapter(prefix);
}