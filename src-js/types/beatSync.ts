export interface HarmonicLayer {
  frequency: number;
  phase: number;
  amplitude: number;
  name: string;
}

export interface HarmonicSyncState {
  masterFrequency: number;
  harmonicLayers: HarmonicLayer[];
  subscribedSystems: Set<any>;
  syncEventChannel: string;
}

export interface HarmonicDataLayer {
  frequency: number;
  amplitude: number;
  value: number;
  phase: number;
}

export interface HarmonicData {
  timestamp: number;
  masterFrequency: number;
  layers: { [key: string]: HarmonicDataLayer };
  composite: {
    oscillation: number;
    pulse: number;
    flow: number;
  };
}

export interface BeatSyncModeConfig {
  systemEnabled: boolean;
  harmonicSyncEnabled: boolean;
  oscillateEnabled: boolean;
  intensityMultiplier: number;
  temporalPlayEnabled: boolean;
}

export interface BeatFlashIntensity {
  base: number;
  peak: number;
  /**
   * Transient runtime value representing the current eased intensity (0-1). Not
   * required by all call-sites, hence optional.
   */
  intensity?: number;
  enabled: boolean;
}
