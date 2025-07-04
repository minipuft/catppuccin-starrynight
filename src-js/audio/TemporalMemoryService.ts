import type { PersonalAestheticSignature } from "@/types/signature";
import { createDefaultSignature } from "@/types/signature";
import { DBSchema, IDBPDatabase, openDB } from "idb";

const DB_NAME = "Year3000-TemporalMemory";
const DB_VERSION = 1;
const SIGNATURE_STORE = "aestheticSignatures";
const SIGNATURE_KEY = "currentUser";

interface TemporalMemoryDBSchema extends DBSchema {
  [SIGNATURE_STORE]: {
    key: string;
    value: PersonalAestheticSignature;
  };
}

class TemporalMemoryService {
  private dbPromise: Promise<IDBPDatabase<TemporalMemoryDBSchema>>;

  constructor() {
    this.dbPromise = openDB<TemporalMemoryDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db: IDBPDatabase<TemporalMemoryDBSchema>) {
        if (!db.objectStoreNames.contains(SIGNATURE_STORE)) {
          db.createObjectStore(SIGNATURE_STORE);
        }
      },
    });
  }

  public async getSignature(
    userId: string = "defaultUser"
  ): Promise<PersonalAestheticSignature> {
    try {
      const db = await this.dbPromise;
      const signature = await db.get(SIGNATURE_STORE, SIGNATURE_KEY);

      if (signature) {
        // TODO: Add schema migration logic if signature.version !== currentVersion
        return signature;
      } else {
        const defaultSignature = createDefaultSignature(userId);
        await this.saveSignature(defaultSignature);
        return defaultSignature;
      }
    } catch (error) {
      console.error(
        "[TemporalMemoryService] Failed to get signature from IndexedDB. Returning default.",
        error
      );
      return createDefaultSignature(userId);
    }
  }

  public async saveSignature(
    signature: PersonalAestheticSignature
  ): Promise<void> {
    try {
      const db = await this.dbPromise;
      signature.lastModified = Date.now();
      await db.put(SIGNATURE_STORE, signature, SIGNATURE_KEY);
    } catch (error) {
      console.error(
        "[TemporalMemoryService] Failed to save signature to IndexedDB.",
        error
      );
    }
  }

  public async resetSignature(
    userId: string = "defaultUser"
  ): Promise<PersonalAestheticSignature> {
    const defaultSignature = createDefaultSignature(userId);
    await this.saveSignature(defaultSignature);
    console.log("[TemporalMemoryService] Aesthetic signature has been reset.");
    return defaultSignature;
  }

  public async getSignatureTrends(
    signature: PersonalAestheticSignature
  ): Promise<any> {
    if (!signature) return null;

    const trends = {
      dominantColor: null,
      dominantRhythm: null,
      avgEnergy: 0,
      avgValence: 0,
    };

    // Analyze Color Memories
    let dominantColor: { hex: string; count: number } | null = null;
    signature.colorMemories.forEach((mem, hex) => {
      if (!dominantColor || mem.count > dominantColor.count) {
        dominantColor = { hex, count: mem.count };
      }
      trends.avgValence += mem.emotionalValence * mem.count;
    });

    let totalColorCount = 0;
    signature.colorMemories.forEach((mem) => (totalColorCount += mem.count));
    if (totalColorCount > 0) {
      trends.avgValence /= totalColorCount;
    }
    trends.dominantColor = dominantColor;

    // Analyze Rhythmic Preferences
    let dominantRhythm: { id: string; count: number } | null = null;
    signature.rhythmicPreferences.forEach((pattern, id) => {
      if (!dominantRhythm || pattern.count > dominantRhythm.count) {
        dominantRhythm = { id, count: pattern.count };
      }
      trends.avgEnergy += pattern.associatedEnergy * pattern.count;
    });

    let totalRhythmCount = 0;
    signature.rhythmicPreferences.forEach((p) => (totalRhythmCount += p.count));
    if (totalRhythmCount > 0) {
      trends.avgEnergy /= totalRhythmCount;
    }
    trends.dominantRhythm = dominantRhythm;

    return trends;
  }
}

export const temporalMemoryService = new TemporalMemoryService();
