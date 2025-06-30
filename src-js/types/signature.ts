// src-js/types/signature.ts

// Represents a color and its significance in the user's history.
export interface ColorMemory {
  hex: string;
  count: number;
  // Emotional valence associated with this color (-1 to 1)
  emotionalValence: number;
  // Last time this color was dominant
  lastSeen: number;
}

// Represents a recognized rhythmic pattern.
export interface TemporalPattern {
  // e.g., '4/4 steady', 'syncopated triplets'
  patternId: string;
  // How often this pattern has been detected
  count: number;
  // User's average energy level when this pattern is playing
  associatedEnergy: number;
}

// Maps emotional states to user preferences.
export interface EmotionalResonanceProfile {
  // Key: mood identifier (e.g., 'high-energy-positive')
  // Value: preferred color temperature, animation intensity, etc.
  [mood: string]: {
    preferredColorTemp?: "warm" | "cool" | "neutral";
    preferredIntensity?: number; // 0-1
  };
}

// Tracks the learning and adaptation trajectory of the system for this user.
export interface LearningVector {
  // How quickly the system adapts to new user tastes (0-1)
  adaptability: number;
  // How much the system favors novelty vs. familiarity (0-1)
  explorationFactor: number;
  // Last significant adaptation event
  lastUpdate: number;
}

export interface PersonalAestheticSignature {
  // Version of the signature schema
  version: string;
  // Unique identifier for this signature
  userId: string;
  // Timestamp of creation
  createdAt: number;
  // Last time the signature was updated
  lastModified: number;

  // A map where the key is a color hex string
  colorMemories: Map<string, ColorMemory>;

  // A map where the key is a pattern identifier
  rhythmicPreferences: Map<string, TemporalPattern>;

  emotionalResonanceProfile: EmotionalResonanceProfile;

  evolutionaryTrajectory: LearningVector;
}

export const createDefaultSignature = (
  userId: string
): PersonalAestheticSignature => ({
  version: "1.0.0",
  userId,
  createdAt: Date.now(),
  lastModified: Date.now(),
  colorMemories: new Map(),
  rhythmicPreferences: new Map(),
  emotionalResonanceProfile: {},
  evolutionaryTrajectory: {
    adaptability: 0.5, // Start balanced
    explorationFactor: 0.5, // Start balanced
    lastUpdate: Date.now(),
  },
});
