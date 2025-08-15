# API Reference

> **"With advanced systems, every interface becomes a portal to visual excellence—each method a pathway to transcendent user experience, each parameter a note in the symphony of dynamic visual effects."**

## Overview

This comprehensive API reference documents all public interfaces, classes, and methods in the Catppuccin StarryNight theme architecture. The API is designed around the **Advanced System philosophy** where interfaces are systematically enhanced, and each component contributes to a unified visual-aware experience.

### API Design Philosophy

1. **Visual Effects Coordination** - Unified state management through VisualEffectsCoordinator and VisualEffectState
2. **Performance-Aware** - All methods respect performance budgets and adaptive quality
3. **Type-Safe** - Strict TypeScript with zero `any` types allowed
4. **Facade-Integrated** - Unified access through facade pattern architecture
5. **Dynamic Evolution** - APIs evolve naturally through performance-optimized patterns

## Core Architecture Interfaces

### IManagedSystem

The foundational interface implemented by all systems in the Advanced architecture.

**Location**: `src-js/core/interfaces/IManagedSystem.ts`

```typescript
interface IManagedSystem {
  initialized: boolean;
  initialize(): Promise<void>;
  updateAnimation(deltaTime: number): void;
  healthCheck(): Promise<HealthCheckResult>;
  destroy(): void;
  forceRepaint?(reason?: string): void;
}
```

#### Methods

##### `initialize(): Promise<void>`

Initializes the system, setting up required resources and listeners.

**Returns**: Promise that resolves when initialization is complete

**Example**:
```typescript
const system = new MyVisualSystem(config);
await system.initialize();
console.log(system.initialized); // true
```

##### `updateAnimation(deltaTime: number): void`

Periodic update tick for animations and visual effects evolution.

**Parameters**:
- `deltaTime` (number): Time in milliseconds since last frame

**Performance**: Must complete in <10ms for 60fps target

**Example**:
```typescript
// Called by animation frame coordinator
system.updateAnimation(16.67); // 60fps target
```

##### `healthCheck(): Promise<HealthCheckResult>`

Performs system health diagnostics.

**Returns**: Promise resolving to health check result

**Example**:
```typescript
const health = await system.healthCheck();
if (health.healthy) {
  console.log('System operational:', health.details);
} else {
  console.warn('System issues:', health.issues);
}
```

##### `destroy(): void`

Cleans up resources, listeners, and intervals.

**Example**:
```typescript
// Cleanup before page unload
window.addEventListener('beforeunload', () => {
  system.destroy();
});
```

##### `forceRepaint?(reason?: string): void` *(Optional)*

Forces immediate visual update for settings changes.

**Parameters**:
- `reason` (string, optional): Description of repaint reason

**Performance**: Must be lightweight (<1ms)

**Example**:
```typescript
// User changed color settings
system.forceRepaint?.('color-scheme-change');
```

### HealthCheckResult

Health check response interface providing system status information.

**Location**: `src-js/types/systems.ts`

```typescript
interface HealthCheckResult {
  system?: string;        // System identifier
  healthy: boolean;       // Overall health status
  ok?: boolean;          // Legacy compatibility field
  details?: string;      // Human-readable status description
  issues?: string[];     // Array of detected issues
  metrics?: Record<string, any>; // Performance metrics
}
```

**Example Response**:
```typescript
{
  system: "FlowingLiquidVisualSystem",
  healthy: true,
  details: "System operational, performance optimal",
  metrics: {
    frameRate: 60,
    memoryUsage: 12.5,
    visualLevel: 0.8
  }
}
```

## Configuration Interfaces

### AdvancedSystemConfig

Main configuration object for the entire Year 3000 System.

**Location**: `src-js/types/models.ts`

```typescript
interface AdvancedSystemConfig {
  // Core Settings
  enableDebug: boolean;
  enableContextualIntelligence: boolean;
  enableColorExtraction: boolean;
  enableMusicAnalysis: boolean;
  enableCosmicSync: boolean;
  
  // Performance Configuration
  logging: {
    level: "off" | "error" | "warn" | "info" | "debug" | "verbose";
    performance: {
      enableFrameBudgetWarnings: boolean;
      throttleWarnings: boolean;
      throttleInterval: number;
      enableAdaptiveDegradation: boolean;
    };
  };
  
  // Artistic Configuration
  artisticMode: ArtisticMode;
  musicModulationIntensity: number;
  currentHarmonicMode: string;
  harmonicBaseColor: string | null;
  harmonicIntensity: number;
  harmonicEvolution: boolean;
  
  // Methods
  init(): AdvancedSystemConfig;
  getCurrentModeProfile(): ArtisticModeProfile;
  getCurrentMultipliers(): MultiplierProfile;
  getCurrentFeatures(): FeatureProfile;
  getCurrentPerformanceSettings(): PerformanceProfile;
  isFullyInitialized(): boolean;
  safeSetArtisticMode(mode: ArtisticMode): boolean;
  setLoggingLevel(level: LogLevel): boolean;
  setupForProduction(): void;
  setupForDevelopment(): void;
  setupForDebugging(): void;
  validateConfigHealth(): any;
}
```

#### Key Methods

##### `init(): AdvancedSystemConfig`

Initializes the configuration system.

**Returns**: Initialized configuration object

**Example**:
```typescript
const config = ADVANCED_SYSTEM_CONFIG.init();
console.log(config.isFullyInitialized()); // true
```

##### `safeSetArtisticMode(mode: ArtisticMode): boolean`

Safely changes artistic mode with validation.

**Parameters**:
- `mode`: One of `"corporate-safe"`, `"artist-vision"`, `"cosmic-maximum"`

**Returns**: `true` if mode change successful

**Example**:
```typescript
const success = config.safeSetArtisticMode('cosmic-maximum');
if (success) {
  console.log('Artistic mode updated');
}
```

##### `setupForProduction(): void`

Configures optimized settings for production deployment.

**Example**:
```typescript
// Production configuration
config.setupForProduction();
// Debug disabled, warnings throttled, performance optimized
```

### ArtisticModeProfile

Configuration profile for different artistic visual levels.

```typescript
interface ArtisticModeProfile {
  displayName: string;
  description: string;
  philosophy: string;
  multipliers: MultiplierProfile;
  features: FeatureProfile;
  performance: PerformanceProfile;
}
```

**Example**:
```typescript
const cosmicProfile = config.getCurrentModeProfile();
console.log(cosmicProfile.philosophy);
// "Transcendent interfaces that evolve beyond imagination"

const multipliers = cosmicProfile.multipliers;
console.log(multipliers.visualIntensityBase); // 1.0 for cosmic-maximum
```

## Visual System Interfaces

### VisualBackplane

Unified interface for all visual rendering systems providing standardized integration.

**Location**: `src-js/types/systems.ts`

```typescript
interface VisualBackplane extends IManagedSystem {
  readonly backendId: 'css' | 'webgl' | string;
  readonly isReady: boolean;
  readonly capabilities: BackendCapabilities;
  
  init(root: HTMLElement, constraints?: PerformanceConstraints): Promise<void>;
  setPalette(stops: RGBStop[], transition?: number): void;
  setMusicMetrics(metrics: MusicMetrics): void;
  setPerformanceConstraints(constraints: PerformanceConstraints): void;
  setEnabled(enabled: boolean, fadeMs?: number): void;
  getPerformanceMetrics(): PerformanceMetrics;
  handleContextLoss?(): Promise<void>;
  resize?(width: number, height: number): void;
  applyAccessibilityPreferences?(preferences: AccessibilityPreferences): void;
}
```

#### Key Methods

##### `setPalette(stops: RGBStop[], transition?: number): void`

Updates color palette for gradient rendering.

**Parameters**:
- `stops`: Array of RGB color stops with positions (0.0-1.0)
- `transition` (optional): Transition duration in milliseconds

**Example**:
```typescript
const colorStops = [
  { r: 255, g: 100, b: 150, position: 0.0 },
  { r: 100, g: 150, b: 255, position: 1.0 }
];
visualSystem.setPalette(colorStops, 500); // 500ms transition
```

##### `setMusicMetrics(metrics: MusicMetrics): void`

Updates music synchronization data for audio-visual integration.

**Parameters**:
- `metrics`: Music analysis data including BPM, energy, valence

**Example**:
```typescript
const musicData = {
  bpm: 128,
  energy: 0.8,
  valence: 0.6,
  beatIntensity: 0.9,
  rhythmPhase: 180,
  pulsingScale: 1.1
};
visualSystem.setMusicMetrics(musicData);
```

##### `getPerformanceMetrics(): PerformanceMetrics`

Returns current rendering performance statistics.

**Returns**: Object containing FPS, memory usage, CPU/GPU usage

**Example**:
```typescript
const metrics = visualSystem.getPerformanceMetrics();
console.log(`FPS: ${metrics.fps}, Memory: ${metrics.memoryUsageMB}MB`);
```

### BaseVisualSystem

Abstract base class providing common functionality for visual systems.

**Location**: `src-js/visual/base/BaseVisualSystem.ts`

```typescript
abstract class BaseVisualSystem {
  protected config: AdvancedSystemConfig;
  protected utils: typeof ThemeUtilities;
  protected performanceMonitor: PerformanceAnalyzer;
  protected musicSyncService: MusicSyncService | null;
  protected settingsManager: SettingsManager | null;
  protected systemName: string;
  public initialized: boolean;
  public isActive: boolean;
  
  constructor(
    config: AdvancedSystemConfig,
    utils: typeof ThemeUtilities,
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null,
    settingsManager: SettingsManager | null
  );
  
  abstract initialize(): Promise<void>;
  abstract updateAnimation(deltaTime: number): void;
  abstract healthCheck(): Promise<HealthCheckResult>;
  abstract destroy(): void;
  
  // Utility Methods
  protected _createOptimizedKineticCanvas(
    id: string,
    zIndex: number,
    blendMode: string,
    kineticMode: string
  ): Promise<CanvasResult>;
  
  protected handleSettingsChange(event: Event): void;
  protected setupPerformanceMonitoring(): void;
}
```

#### Canvas Creation

##### `_createOptimizedKineticCanvas(id, zIndex, blendMode, kineticMode): Promise<CanvasResult>`

Creates performance-optimized canvas with visual-aware settings.

**Parameters**:
- `id`: Unique canvas identifier
- `zIndex`: CSS z-index for layering
- `blendMode`: CSS blend mode (`multiply`, `screen`, `overlay`, etc.)
- `kineticMode`: Visual mode (`pulse`, `flow`, `smooth`)

**Returns**: Promise resolving to canvas result with context and element

**Example**:
```typescript
const canvasResult = await this._createOptimizedKineticCanvas(
  'visual-layer',
  10,
  'multiply',
  'pulse'
);
console.log('Canvas ready:', canvasResult.success);
```

## Facade Pattern API

### SystemCoordinator

Central coordinator managing all visual and non-visual system facades.

**Location**: `src-js/core/integration/SystemCoordinator.ts`

```typescript
class SystemCoordinator {
  constructor(dependencies: SystemDependencies);
  
  async initialize(): Promise<void>;
  createVisualSystem<T>(systemType: string): T | null;
  createNonVisualSystem<T>(systemType: string): T | null;
  getSharedDependency<T>(dependencyName: string): T | null;
  propagateEvent(eventData: SystemEvent): void;
  getSystemHealth(): Promise<SystemHealthReport>;
  destroy(): void;
}
```

#### Methods

##### `createVisualSystem<T>(systemType: string): T | null`

Creates visual system instance through facade pattern.

**Parameters**:
- `systemType`: System type identifier

**Returns**: Typed system instance or null if creation failed

**Example**:
```typescript
const coordinator = new SystemCoordinator(dependencies);
await coordinator.initialize();

const particleSystem = coordinator.createVisualSystem<LightweightParticleSystem>('Particle');
if (particleSystem) {
  await particleSystem.initialize();
}
```

##### `propagateEvent(eventData: SystemEvent): void`

Distributes events across all registered systems.

**Parameters**:
- `eventData`: Event data including type, payload, and metadata

**Example**:
```typescript
coordinator.propagateEvent({
  type: 'visual-effects-shift',
  payload: { level: 0.8, intensity: 'high' },
  timestamp: performance.now(),
  source: 'MusicSyncService'
});
```

### VisualSystemFacade

Facade managing all visual systems with factory pattern and dependency injection.

**Location**: `src-js/visual/integration/VisualSystemFacade.ts`

```typescript
class VisualSystemFacade {
  constructor(dependencies: VisualSystemDependencies);
  
  async initialize(): Promise<void>;
  getVisualSystem<T>(systemType: string): T | null;
  initializeVisualSystems(): Promise<void>;
  propagateVisualEvent(eventData: VisualEvent): void;
  getSystemCapabilities(): SystemCapabilitiesMatrix;
  performHealthCheck(): Promise<VisualSystemHealthReport>;
  destroy(): void;
}
```

#### Factory Pattern Usage

##### `getVisualSystem<T>(systemType: string): T | null`

Creates or retrieves visual system instance with dependency injection.

**Parameters**:
- `systemType`: System type (`'Particle'`, `'FlowingLiquid'`, `'IridescentShimmer'`, etc.)

**Returns**: Fully configured system instance

**Example**:
```typescript
const facade = new VisualSystemFacade(dependencies);
await facade.initialize();

// Create particle system with automatic dependency injection
const particles = facade.getVisualSystem<LightweightParticleSystem>('Particle');
await particles?.initialize();

// Create flowing liquid system
const flowing = facade.getVisualSystem<FlowingLiquidDynamicSystem>('FlowingLiquid');
await flowing?.initialize();
```

##### `initializeVisualSystems(): Promise<void>`

Initializes all registered visual systems in dependency order.

**Example**:
```typescript
// Initialize all visual systems
await facade.initializeVisualSystems();

// All systems are now ready and coordinated
const healthReport = await facade.performHealthCheck();
console.log('Visual systems ready:', healthReport.allHealthy);
```

## Visual Effects Coordination API

### VisualEffectState

Interface representing the shared visual state coordinated across all background systems.

**Location**: `src-js/visual/effects/VisualEffectsCoordinator.ts`

```typescript
interface VisualEffectState {
  // === MUSIC INTEGRATION ===
  musicIntensity: number;        // 0-1 beat intensity from music analysis
  flowDirection: Vector2D;       // Flow direction derived from music characteristics
  energyLevel: number;           // 0-1 overall music energy level
  colorTemperature: number;      // Color temperature (1000K-20000K) from music emotion
  tempoModulation: number;       // 0-2 tempo-driven scaling factor
  harmonicComplexity: number;    // 0-1 musical complexity for system sophistication

  // === VISUAL PARAMETERS ===
  fluidIntensity: number;        // 0-2 fluid dynamics intensity
  depthPerception: number;       // 0-1 3D space illusion strength
  luminosity: number;            // 0-2 hardware acceleration intensity
  colorHarmony: number;          // 0-1 color harmony synchronization
  visualCoherence: number;       // 0-1 how unified the visual systems appear

  // === ANIMATION PARAMETERS ===
  pulseRate: number;             // 0.5-4.0 seconds - synchronized pulse rhythm
  transitionFluidity: number;    // 0-1 transition smoothness between systems
  scalingFactor: number;         // 0.1-2.0 animation scaling factor
  effectDepth: number;           // 0-1 depth of effect integration
  systemHarmony: number;         // 0-1 how well systems coordinate together

  // === PERFORMANCE AWARENESS ===
  deviceCapabilities: DeviceCapabilities;
  performanceMode: PerformanceMode;
  adaptiveQuality: number;       // 0-1 current quality level
  thermalState: number;          // 0-1 thermal throttling level
  batteryConservation: number;   // 0-1 battery optimization level

  // === TEMPORAL TRACKING ===
  timestamp: number;             // When this state was created
  evolutionPhase: number;        // 0-1 how the visual state has evolved
  continuityIndex: number;       // 0-1 temporal continuity with previous state
}
```

**Example Usage**:
```typescript
const visualState: VisualEffectState = {
  musicIntensity: 0.8,
  flowDirection: { x: 1.0, y: 0.5 },
  energyLevel: 0.9,
  colorTemperature: 6500,
  fluidIntensity: 1.2,
  pulseRate: 1.5,
  adaptiveQuality: 0.8,
  timestamp: performance.now(),
  // ... other properties
};
```

### BackgroundSystemParticipant

Interface that background systems must implement to participate in visual effects coordination.

**Location**: `src-js/visual/effects/VisualEffectsCoordinator.ts`

```typescript
interface BackgroundSystemParticipant {
  systemName: string;
  onVisualStateUpdate(state: VisualEffectState): void;
  onVisualEffectEvent(eventType: string, payload: any): void;
  getVisualContribution(): Partial<VisualEffectState>;
}
```

**Example Implementation**:
```typescript
class MyBackgroundSystem implements BackgroundSystemParticipant {
  public systemName = "MyBackgroundSystem";
  
  onVisualStateUpdate(state: VisualEffectState): void {
    // Update system based on shared visual state
    this.updateFlowIntensity(state.fluidIntensity);
    this.syncWithMusic(state.musicIntensity);
    this.adjustForPerformance(state.adaptiveQuality);
  }
  
  onVisualEffectEvent(eventType: string, payload: any): void {
    switch (eventType) {
      case "visual:rhythm-shift":
        this.handleRhythmChange(payload);
        break;
      case "visual:color-shift":
        this.updateColorScheme(payload);
        break;
    }
  }
  
  getVisualContribution(): Partial<VisualEffectState> {
    return {
      fluidIntensity: this.getCurrentFluidLevel(),
      effectDepth: this.getDepthContribution(),
      visualCoherence: this.isSystemStable() ? 1.0 : 0.5
    };
  }
}
```

### VisualEffectsCoordinator

Singleton coordinator managing visual effect state evolution and participant coordination.

**Location**: `src-js/visual/effects/VisualEffectsCoordinator.ts`

```typescript
class VisualEffectsCoordinator implements IManagedSystem {
  private currentVisualState: VisualEffectState | null = null;
  private registeredParticipants: Map<string, BackgroundSystemParticipant>;
  
  // Core lifecycle methods
  public async initialize(): Promise<void>;
  public updateAnimation(deltaTime: number): void;
  public destroy(): void;
  
  // Participant management
  public registerVisualParticipant(participant: BackgroundSystemParticipant): void;
  public unregisterVisualParticipant(systemName: string): void;
  
  // State management
  public getCurrentVisualState(): VisualEffectState | null;
  public forceStateUpdate(): void;
  
  // Performance monitoring
  public getPerformanceMetrics(): CoordinationMetrics;
}
```

**Example Usage**:
```typescript
// Get singleton instance
const coordinator = VisualEffectsCoordinator.getInstance();
await coordinator.initialize();

// Register a background system
const backgroundSystem = new MyBackgroundSystem();
coordinator.registerVisualParticipant(backgroundSystem);

// Monitor coordination
const metrics = coordinator.getPerformanceMetrics();
console.log(`State updates: ${metrics.stateUpdates}`);
console.log(`Coordination events: ${metrics.coordinationEvents}`);
```

### VisualEffects Event Interfaces

#### BeatVisualEffectsEvent

Beat visual-effects event for rhythmic synchronization.

```typescript
interface BeatVisualEffectsEvent {
  intensity: number;      // 0-1 beat strength
  bpm?: number;          // Current BPM
  energy?: number;       // 0-1 music energy
  timestamp?: number;    // Event timestamp
  [key: string]: any;   // Additional beat data
}
```

**Example**:
```typescript
const beatEvent: BeatVisualEffectsEvent = {
  intensity: 0.9,
  bpm: 128,
  energy: 0.8,
  timestamp: performance.now()
};

dynamicSystem.handleBeatVisualEffects(beatEvent);
```

#### EmotionalVisualEffectsEvent

Emotional visual-effects event for mood-based visual adaptation.

```typescript
interface EmotionalVisualEffectsEvent {
  emotion: string;        // Detected emotion
  valence: number;        // 0-1 pleasantness
  energy: number;         // 0-1 intensity
  arousal?: number;       // 0-1 activation level
  confidence?: number;    // 0-1 detection confidence
  timestamp?: number;     // Event timestamp
}
```

**Example**:
```typescript
const emotionalEvent: EmotionalVisualEffectsEvent = {
  emotion: 'energetic',
  valence: 0.8,
  energy: 0.9,
  arousal: 0.7,
  confidence: 0.85,
  timestamp: performance.now()
};

dynamicSystem.handleEmotionalVisualEffects(emotionalEvent);
```

## Audio Integration API

### MusicSyncService

Service providing real-time music analysis and beat detection.

**Location**: `src-js/audio/MusicSyncService.ts`

```typescript
class MusicSyncService {
  constructor(config: AdvancedSystemConfig);
  
  async initialize(): Promise<void>;
  subscribe(system: any, systemName: string): void;
  unsubscribe(systemName: string): void;
  getCurrentAnalysis(): MusicAnalysisData;
  getBPMEstimate(): number;
  getEnergyLevel(): number;
  getValenceLevel(): number;
  destroy(): void;
}
```

#### Methods

##### `subscribe(system: any, systemName: string): void`

Subscribes a system to receive music analysis updates.

**Parameters**:
- `system`: System instance with `updateFromMusicAnalysis` method
- `systemName`: Unique identifier for the system

**Example**:
```typescript
const musicSync = new MusicSyncService(config);
await musicSync.initialize();

// Subscribe visual system to music updates
musicSync.subscribe(visualSystem, 'FlowingLiquidSystem');

// System will now receive updateFromMusicAnalysis calls
```

##### `getCurrentAnalysis(): MusicAnalysisData`

Returns current music analysis data.

**Returns**: Object with BPM, energy, valence, and emotional temperature

**Example**:
```typescript
const analysis = musicSync.getCurrentAnalysis();
console.log(`BPM: ${analysis.bpm}, Energy: ${analysis.energy}`);
```

### ColorHarmonyEngine

Engine providing OKLAB color science and perceptually uniform color processing.

**Location**: `src-js/audio/ColorHarmonyEngine.ts`

```typescript
class ColorHarmonyEngine {
  constructor(config: AdvancedSystemConfig);
  
  async initialize(): Promise<void>;
  blendColors(rgb1: RGBColor, rgb2: RGBColor, ratio?: number): RGBColor;
  extractDominantColors(imageData: ImageData): Promise<RGBColor[]>;
  generateHarmonicPalette(baseColor: RGBColor, mode: HarmonicMode): RGBColor[];
  convertToOKLAB(rgb: RGBColor): OKLABColor;
  convertFromOKLAB(oklab: OKLABColor): RGBColor;
  calculatePerceptualDistance(color1: RGBColor, color2: RGBColor): number;
  adaptToEmotionalTemperature(colors: RGBColor[], temperature: number): RGBColor[];
}
```

#### Color Science Methods

##### `blendColors(rgb1, rgb2, ratio?): RGBColor`

Blends two colors using perceptually uniform OKLAB color space.

**Parameters**:
- `rgb1`: First RGB color
- `rgb2`: Second RGB color  
- `ratio` (optional): Blend ratio, defaults to config value

**Returns**: Blended RGB color

**Example**:
```typescript
const colorEngine = new ColorHarmonyEngine(config);
await colorEngine.initialize();

const color1 = { r: 255, g: 100, b: 150 };
const color2 = { r: 100, g: 150, b: 255 };
const blended = colorEngine.blendColors(color1, color2, 0.5);
console.log('Blended color:', blended);
```

##### `generateHarmonicPalette(baseColor, mode): RGBColor[]`

Generates harmonious color palette using music theory principles.

**Parameters**:
- `baseColor`: Base RGB color
- `mode`: Harmonic mode (`analogous`, `triadic`, `complementary`, etc.)

**Returns**: Array of harmonious RGB colors

**Example**:
```typescript
const baseColor = { r: 200, g: 100, b: 255 };
const harmonicMode = { rule: 'triadic', angle: 120, description: 'Triadic harmony' };
const palette = colorEngine.generateHarmonicPalette(baseColor, harmonicMode);
console.log('Harmonic palette:', palette);
```

## Performance Monitoring API

### PerformanceAnalyzer

System providing comprehensive performance monitoring and adaptive quality management.

**Location**: `src-js/core/performance/PerformanceAnalyzer.ts`

```typescript
class PerformanceAnalyzer {
  constructor(config: AdvancedSystemConfig);
  
  async initialize(): Promise<void>;
  startTiming(label: string): number;
  endTiming(timingId: number): number;
  recordMetric(metricName: string, value: number): void;
  getMetrics(): PerformanceMetrics;
  calculateHealthScore(): number;
  getAdaptiveQualityRecommendation(): QualityLevel;
  enableAdaptiveScaling(): void;
  disableAdaptiveScaling(): void;
  destroy(): void;
}
```

#### Performance Monitoring

##### `startTiming(label: string): number`

Starts performance timing measurement.

**Parameters**:
- `label`: Timing label for identification

**Returns**: Timing ID for use with `endTiming`

**Example**:
```typescript
const analyzer = new PerformanceAnalyzer(config);
await analyzer.initialize();

const timingId = analyzer.startTiming('visual-update');
// ... perform visual update ...
const duration = analyzer.endTiming(timingId);
console.log(`Visual update took ${duration}ms`);
```

##### `calculateHealthScore(): number`

Calculates overall system health score based on performance metrics.

**Returns**: Health score from 0-100

**Example**:
```typescript
const healthScore = analyzer.calculateHealthScore();
if (healthScore < 70) {
  console.warn('Performance degradation detected');
  // Trigger adaptive quality reduction
}
```

##### `getAdaptiveQualityRecommendation(): QualityLevel`

Recommends optimal quality level based on current performance.

**Returns**: Recommended quality (`'minimal'`, `'balanced'`, `'high'`, `'ultra'`)

**Example**:
```typescript
const recommendation = analyzer.getAdaptiveQualityRecommendation();
visualSystem.setQualityLevel(recommendation);
```

### DeviceCapabilityDetector

Detector analyzing device capabilities for performance optimization.

**Location**: `src-js/core/performance/DeviceCapabilityDetector.ts`

```typescript
class DeviceCapabilityDetector {
  constructor();
  
  async initialize(): Promise<void>;
  getGPUCapabilities(): GPUCapabilities;
  getCPUCapabilities(): CPUCapabilities;
  getMemoryCapabilities(): MemoryCapabilities;
  recommendPerformanceQuality(): QualityLevel;
  isHighPerformanceDevice(): boolean;
  supportsWebGL2(): boolean;
  getMaxTextureSize(): number;
  destroy(): void;
}
```

**Example Usage**:
```typescript
const detector = new DeviceCapabilityDetector();
await detector.initialize();

const quality = detector.recommendPerformanceQuality();
const gpuCaps = detector.getGPUCapabilities();

console.log(`Recommended quality: ${quality}`);
console.log(`WebGL2 support: ${detector.supportsWebGL2()}`);
console.log(`Max texture size: ${detector.getMaxTextureSize()}`);
```

### UnifiedCSSVariableManager

**Phase 2.6 Consolidation**: Unified CSS variable management system that consolidates three overlapping systems into one optimized controller with priority queues, adaptive throttling, and global instance management.

**Location**: `src-js/core/css/UnifiedCSSVariableManager.ts`

```typescript
class UnifiedCSSVariableManager {
  constructor(config: AdvancedSystemConfig, performanceAnalyzer: PerformanceAnalyzer);
  
  // Core CSS Variable Management
  queueCSSVariableUpdate(
    property: string, 
    value: string, 
    element?: HTMLElement | null, 
    priority?: "low" | "normal" | "high" | "critical",
    source?: string
  ): void;
  
  updateVariables(
    variables: Record<string, string>,
    priority?: "low" | "normal" | "high" | "critical",
    source?: string
  ): void;
  
  // Legacy Compatibility Methods (from CSSVariableCoordinator)
  async batchSetVariables(
    caller: string,
    variables: Record<string, string>, 
    priority?: "low" | "normal" | "high" | "critical",
    source?: string
  ): Promise<void>;
  
  async setVariable(
    caller: string,
    property: string,
    value: string,
    priority?: "low" | "normal" | "high" | "critical", 
    source?: string
  ): Promise<void>;
  
  // Performance & Control
  flushUpdates(): void;
  setEnabled(enabled: boolean): void;
  getPerformanceMetrics(): CSSPerformanceMetrics;
  
  // Global Instance Management
  static getGlobalInstance(): UnifiedCSSVariableManager;
}

// Global instance functions
export function getGlobalOptimizedCSSController(): UnifiedCSSVariableManager;
export function setGlobalOptimizedCSSController(instance: UnifiedCSSVariableManager): void;
```

#### Priority System

The unified controller implements a sophisticated priority queue system:

- **Critical** (0ms throttling): Beat sync, breathing, accent colors
- **High** (8ms throttling): Now playing, track progress, volume
- **Normal** (16ms throttling): General UI updates, settings changes  
- **Low** (33ms throttling): Background effects, non-critical animations

**Example Usage**:
```typescript
// Get global instance
const cssController = getGlobalOptimizedCSSController();

// Critical real-time music sync (no throttling)
cssController.queueCSSVariableUpdate(
  "--sn-beat-pulse-intensity", 
  "0.8", 
  null, 
  "critical", 
  "BeatSyncSystem"
);

// Batch update multiple variables
await cssController.batchSetVariables("ColorSystem", {
  "--sn-primary-color": "#ff6b9d",
  "--sn-secondary-color": "#6bcf7f", 
  "--sn-accent-color": "#ffd93d"
}, "high", "AlbumArtExtraction");

// Performance monitoring
const metrics = cssController.getPerformanceMetrics();
console.log(`CSS updates/sec: ${metrics.updatesPerSecond}`);
console.log(`Average batch size: ${metrics.averageBatchSize}`);
```

#### Adaptive Throttling

The system automatically adjusts throttling based on performance:

```typescript
// Throttling adapts to current FPS
if (currentFPS < 45) {
  // Emergency mode: More aggressive batching
  throttleMultiplier = 2.0;
} else if (currentFPS < 55) {
  // Performance mode: Moderate batching
  throttleMultiplier = 1.5;
} else {
  // Optimal mode: Standard throttling
  throttleMultiplier = 1.0;
}
```

## Event System API

### Event Interfaces

#### SystemEvent

Base interface for system-wide events.

```typescript
interface SystemEvent {
  type: string;              // Event type identifier
  payload: any;              // Event data
  timestamp: number;         // Event timestamp
  source: string;           // Event source system
  priority?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}
```

#### VisualEvent

Extended interface for visual system events.

```typescript
interface VisualEvent extends SystemEvent {
  visualData?: {
    colors?: RGBColor[];
    intensity?: number;
    quality?: QualityLevel;
    animations?: AnimationData[];
  };
  performanceData?: {
    fps?: number;
    memoryUsage?: number;
    frameTime?: number;
  };
}
```

**Example Usage**:
```typescript
const visualEvent: VisualEvent = {
  type: 'color-palette-change',
  payload: { newPalette: colorStops },
  timestamp: performance.now(),
  source: 'ColorHarmonyEngine',
  priority: 'medium',
  visualData: {
    colors: newColorPalette,
    intensity: 0.8
  }
};

systemCoordinator.propagateEvent(visualEvent);
```

## Utility APIs

### ThemeUtilities

Collection of utility functions for the Year 3000 System.

**Location**: `src-js/utils/core/ThemeUtilities.ts`

```typescript
export namespace ThemeUtilities {
  // Color Utilities
  export function rgbToOklab(r: number, g: number, b: number): OKLABColor;
  export function oklabToRgb(L: number, a: number, b: number): RGBColor;
  export function calculateColorDistance(color1: RGBColor, color2: RGBColor): number;
  
  // Performance Utilities
  export function throttle<T extends (...args: any[]) => any>(
    func: T, 
    delay: number
  ): (...args: Parameters<T>) => void;
  
  export function debounce<T extends (...args: any[]) => any>(
    func: T, 
    delay: number
  ): (...args: Parameters<T>) => void;
  
  // Animation Utilities
  export function easeInOutCubic(t: number): number;
  export function easeInOutQuart(t: number): number;
  export function lerp(start: number, end: number, factor: number): number;
  
  // DOM Utilities
  export function createOptimizedElement(
    tag: string, 
    className?: string, 
    attributes?: Record<string, string>
  ): HTMLElement;
  
  export function setOptimizedStyles(
    element: HTMLElement, 
    styles: Record<string, string>
  ): void;
}
```

**Example Usage**:
```typescript
import * as ThemeUtilities from '@/utils/core/ThemeUtilities';

// Color conversion
const oklab = ThemeUtilities.rgbToOklab(255, 100, 150);
const rgb = ThemeUtilities.oklabToRgb(oklab.L, oklab.a, oklab.b);

// Performance optimization
const throttledUpdate = ThemeUtilities.throttle(updateVisualization, 16);

// Animation easing
const progress = ThemeUtilities.easeInOutCubic(0.5);
const interpolated = ThemeUtilities.lerp(0, 100, progress);

// DOM optimization
const element = ThemeUtilities.createOptimizedElement('div', 'visual-effects-layer');
ThemeUtilities.setOptimizedStyles(element, {
  'will-change': 'transform',
  'contain': 'layout style paint'
});
```

## Error Handling and Debugging

### Debug API

Global debug object exposed when debug mode is enabled.

```typescript
// Available when ADVANCED_SYSTEM_CONFIG.enableDebug = true
declare global {
  var Y3K: {
    systems: Map<string, IManagedSystem>;
    performance: PerformanceAnalyzer;
    coordinator: SystemCoordinator;
    config: AdvancedSystemConfig;
    
    // Debug Methods
    getSystemHealth(): Promise<SystemHealthReport>;
    getPerformanceMetrics(): PerformanceMetrics;
    setQualityLevel(level: QualityLevel): void;
    triggerHealthCheck(): Promise<void>;
    dumpSystemState(): void;
  };
}
```

**Example Debug Usage**:
```typescript
// In browser console when debug enabled
Y3K.getSystemHealth().then(health => {
  console.log('System health:', health);
});

const metrics = Y3K.getPerformanceMetrics();
console.log('Current FPS:', metrics.fps);

// Force quality change for testing
Y3K.setQualityLevel('minimal');

// Dump complete system state
Y3K.dumpSystemState();
```

### Error Handling Patterns

#### Standard Error Handling

```typescript
try {
  await system.initialize();
} catch (error) {
  console.error(`[${system.constructor.name}] Initialization failed:`, error);
  
  // Report to performance analyzer
  performanceAnalyzer.recordMetric('initialization_errors', 1);
  
  // Attempt graceful degradation
  await system.fallbackInitialization();
}
```

#### Performance Budget Monitoring

```typescript
const timingId = performanceAnalyzer.startTiming('critical-operation');

try {
  // Performance-critical operation
  await performCriticalOperation();
} finally {
  const duration = performanceAnalyzer.endTiming(timingId);
  
  if (duration > PERFORMANCE_BUDGET_MS) {
    console.warn(`Performance budget exceeded: ${duration}ms`);
    // Trigger adaptive quality reduction
  }
}
```

## Migration and Compatibility

### Legacy API Compatibility

#### Legacy BeatSync Migration

```typescript
// Legacy interface (deprecated)
interface LegacyBeatSyncCompat {
  beatIntensity: number;
  bpm: number;
  energy: number;
  visualIntensity: number;
}

// Migration helper
interface DynamicVisualEffectsMigration {
  convertLegacyBeatSync(legacy: LegacyBeatSyncCompat): DynamicVisualEffectsState;
  convertLegacyConfig(legacy: any): DynamicVisualEffectsConfig;
  migrateLegacyEventHandlers(legacy: any): void;
}
```

**Example Migration**:
```typescript
// Convert legacy beat sync data
const legacy: LegacyBeatSyncCompat = {
  beatIntensity: 0.8,
  bpm: 128,
  energy: 0.9,
  visualIntensity: 0.7
};

const dynamicState = migration.convertLegacyBeatSync(legacy);
console.log('Migrated to dynamic visual-effects:', dynamicState);
```

## Type Definitions Summary

### Core Types

```typescript
// System Management
type QualityLevel = 'minimal' | 'balanced' | 'high' | 'ultra';
type ArtisticMode = 'corporate-safe' | 'artist-vision' | 'cosmic-maximum';
type LogLevel = 'off' | 'error' | 'warn' | 'info' | 'debug' | 'verbose';

// Colors
interface RGBColor { r: number; g: number; b: number; }
interface OKLABColor { L: number; a: number; b: number; }
interface RGBStop extends RGBColor { position: number; }

// Performance
interface PerformanceMetrics {
  fps: number;
  memoryUsageMB: number;
  cpuUsagePercent: number;
  frameTimeMs: number;
  healthScore: number;
}

// Canvas
type CanvasContextType = '2d' | 'webgl' | 'webgl2';
interface CanvasResult {
  success: boolean;
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext | null;
  error?: string;
}
```

---

## Usage Examples

### Complete System Setup

```typescript
// 1. Initialize configuration
const config = ADVANCED_SYSTEM_CONFIG.init();
config.setupForProduction();

// 2. Create system coordinator with dependencies
const coordinator = new SystemCoordinator({
  config,
  performanceAnalyzer: new PerformanceAnalyzer(config),
  musicSyncService: new MusicSyncService(config),
  colorHarmonyEngine: new ColorHarmonyEngine(config)
});

// 3. Initialize coordinator
await coordinator.initialize();

// 4. Create and initialize visual systems
const particleSystem = coordinator.createVisualSystem<LightweightParticleSystem>('Particle');
const flowingSystem = coordinator.createVisualSystem<FlowingLiquidDynamicSystem>('FlowingLiquid');

await Promise.all([
  particleSystem?.initialize(),
  flowingSystem?.initialize()
]);

// 5. Set up music synchronization
const musicSync = coordinator.getSharedDependency<MusicSyncService>('musicSyncService');
musicSync?.subscribe(particleSystem, 'ParticleSystem');
musicSync?.subscribe(flowingSystem, 'FlowingLiquidSystem');

// 6. Monitor system health
setInterval(async () => {
  const health = await coordinator.getSystemHealth();
  if (!health.allHealthy) {
    console.warn('System health issues detected:', health.issues);
  }
}, 30000); // Check every 30 seconds
```

### Performance-Aware Development

```typescript
class MyVisualSystem extends BaseVisualSystem {
  async initialize(): Promise<void> {
    await super.initialize();
    
    // Create optimized canvas with visual-effects awareness
    const canvasResult = await this._createOptimizedKineticCanvas(
      'my-system-canvas',
      10,
      'multiply',
      'breathe'
    );
    
    if (!canvasResult.success) {
      throw new Error('Canvas initialization failed');
    }
    
    // Set up performance monitoring
    this.performanceMonitor.recordMetric('system_initialization', 1);
  }
  
  updateAnimation(deltaTime: number): void {
    const timingId = this.performanceMonitor.startTiming('update_animation');
    
    try {
      // VisualEffects-aware animation updates
      this.updateWithVisualEffects(deltaTime);
    } finally {
      this.performanceMonitor.endTiming(timingId);
    }
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    const metrics = this.performanceMonitor.getMetrics();
    
    return {
      system: this.systemName,
      healthy: metrics.fps > 30 && metrics.memoryUsageMB < 50,
      details: `FPS: ${metrics.fps}, Memory: ${metrics.memoryUsageMB}MB`,
      metrics: {
        fps: metrics.fps,
        memory: metrics.memoryUsageMB,
        visual-effectsLevel: this.getCurrentVisualEffectsLevel()
      }
    };
  }
}
```

---

## Related Documentation

- [Master Architecture Overview](./MASTER_ARCHITECTURE_OVERVIEW.md) - Complete system architecture
- [Visual Effects Coordination](./VISUAL_EFFECTS_COORDINATION.md) - Complete coordination architecture guide
- [Visual Systems Reference](./VISUAL_SYSTEMS_REFERENCE.md) - Visual system capabilities
- [Performance Architecture Guide](./PERFORMANCE_ARCHITECTURE_GUIDE.md) - Performance optimization
- [Development Workflow Guide](./DEVELOPMENT_WORKFLOW_GUIDE.md) - Development processes
- [Build System Guide](./BUILD_SYSTEM_GUIDE.md) - Build and deployment

---

*Part of the Advanced System - where every API becomes a gateway to transcendent user experience and visual-effects-aware interface development.*