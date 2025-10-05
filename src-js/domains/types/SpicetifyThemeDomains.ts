/**
 * Spicetify Theme Architecture Types - Clean Service Organization
 * 
 * Defines the core services that coordinate Spicetify theme functionality,
 * based on real theme responsibilities and industry best practices.
 * 
 * Philosophy: "Clean organization that reflects what the system actually does -
 * music integration, theme aesthetics, visual effects, Spotify UI adaptation,
 * and system coordination for a beautiful, performant theme experience."
 */

import type { IManagedSystem, HealthCheckResult } from '@/types/systems';
import type { UnifiedColor, PaletteSystem } from '@/utils/color/PaletteSystemManager';

// ============================================================================
// Core Service Interfaces
// ============================================================================

export interface ThemeService<T = any> {
  serviceName: string;
  components: Map<string, IManagedSystem>;
  initialize(): Promise<void>;
  coordinate(change: ServiceChange): Promise<void>;
  validateIntegrity(): Promise<HealthCheckResult>;
  getMetrics(): ServiceMetrics;
  cleanup(): Promise<void>;
}

export interface CrossDomainChange {
  changeType: "configuration" | "performance" | "integration" | "health";
  sourceSystem: string;
  targetSystems: string[];
  changeData: any;
  priority: "low" | "medium" | "high" | "critical";
  timestamp: number;
}

export interface ServiceChange {
  trigger: string;
  data: any;
  timestamp: number;
  source: string;
  affectedComponents?: string[];
}

export interface ServiceMetrics {
  componentCount: number;
  healthyComponents: number;
  lastCoordination: number;
  coordinationCount: number;
  averageCoordinationTime: number;
}

// ============================================================================
// Service 1: Music Integration & Analysis
// ============================================================================

export interface MusicData {
  track?: {
    uri: string;
    name: string;
    artist: string;
    album: string;
  };
  audio?: {
    tempo: number;
    energy: number;
    valence: number;
    danceability: number;
    loudness: number;
  };
  timing?: {
    position: number;
    duration: number;
    isPlaying: boolean;
  };
}

export interface MusicAnalysisResult {
  emotionalState: string;
  energyLevel: number;
  genreCharacteristics: any;
  colorSuggestions: Record<string, string>;
  visualIntensity: number;
}

export interface MusicIntegration extends ThemeService {
  // Core components managed by this service
  musicSyncService: any; // MusicSyncService
  colorHarmonyEngine: any; // ColorHarmonyEngine
  emotionalGradientMapper: any; // EmotionalGradientMapper
  genreProfileManager: any; // GenreProfileManager
  musicalOKLABCoordinator: any; // MusicalOKLABCoordinator
  
  // Service-specific coordination methods
  processMusicData(musicData: MusicData): Promise<MusicAnalysisResult>;
  updateVisualSystemsFromMusic(result: MusicAnalysisResult): Promise<void>;
  handleTrackChange(newTrack: MusicData['track']): Promise<void>;
  handlePlayStateChange(isPlaying: boolean): Promise<void>;
  
  // Spotify integration
  getSpicetifyPlayerState(): Promise<MusicData>;
  subscribeToPlayerEvents(): void;
  unsubscribeFromPlayerEvents(): void;
}

// ============================================================================
// Service 2: Theme Appearance & Colors
// ============================================================================

export interface ThemeAppearanceConfig {
  paletteSystem: PaletteSystem;
  catppuccinFlavor: string;
  brightnessMode: 'bright' | 'balanced' | 'dark';
  accentColor: string;
  dynamicAccentEnabled: boolean;
  userCustomizations: Record<string, any>;
}

export interface ColorApplicationResult {
  appliedColors: Record<string, string>;
  cssVariables: Record<string, string>;
  visualFeedback: {
    primaryAccent: string;
    backgroundGradient: [string, string];
    textContrast: string;
  };
}

export interface ThemeAppearance extends ThemeService {
  // Core components managed by this service
  paletteSystemManager: any; // PaletteSystemManager
  colorStateManager: any; // ColorStateManager
  settingsManager: any; // SettingsManager
  oklabColorProcessor: any; // OKLABColorProcessor
  
  // Service-specific coordination methods
  applyThemeConfiguration(config: ThemeAppearanceConfig): Promise<ColorApplicationResult>;
  switchPaletteSystem(newSystem: PaletteSystem): Promise<void>;
  updateUserSettings(settings: Record<string, any>): Promise<void>;
  handleDynamicColorChange(colors: Record<string, string>): Promise<void>;
  
  // Theme management
  getCurrentThemeState(): ThemeAppearanceConfig;
  validateThemeIntegrity(): Promise<HealthCheckResult>;
  resetToDefaults(): Promise<void>;
}

// ============================================================================
// Service 3: Visual Effects & Rendering
// ============================================================================

export interface VisualEffectConfig {
  webglEnabled: boolean;
  visualEffectsLevel: number;
  visualIntensity: number;
  effectQuality: 'low' | 'medium' | 'high';
  enabledEffects: string[];
  deviceCapabilities: {
    hasWebGL: boolean;
    memoryMB: number;
    performanceLevel: string;
  };
}

export interface VisualRenderingResult {
  activeEffects: string[];
  renderingMode: 'webgl' | 'css' | 'hybrid';
  performanceMetrics: {
    fps: number;
    memoryUsage: number;
    renderTime: number;
  };
}

export interface VisualEffects extends ThemeService {
  // Core components managed by this service
  webglGradientSystem: any; // WebGLGradientBackgroundSystem
  flowingLiquidSystem: any; // FluidGradientBackgroundSystem
  depthLayeredSystem: any; // DepthLayeredGradientSystem
  visualEffectsChoreographer: any; // BackgroundAnimationCoordinator
  backgroundStrategySelector: any; // BackgroundStrategySelector
  
  // Service-specific coordination methods
  configureVisualEffects(config: VisualEffectConfig): Promise<VisualRenderingResult>;
  updateEffectsFromMusic(musicAnalysis: MusicAnalysisResult): Promise<void>;
  optimizeForDevice(deviceCapabilities: any): Promise<void>;
  handlePerformanceConstraints(constraints: any): Promise<void>;
  
  // Rendering coordination
  selectOptimalRenderingStrategy(): Promise<string>;
  switchRenderingMode(mode: 'webgl' | 'css' | 'hybrid'): Promise<void>;
  validateVisualIntegrity(): Promise<HealthCheckResult>;
}

// ============================================================================
// Service 4: Spotify UI Integration
// ============================================================================

export interface SpotifyUIState {
  currentView: string;
  sidebarState: 'expanded' | 'collapsed' | 'hidden';
  nowPlayingState: 'expanded' | 'collapsed' | 'hidden';
  focusedElement: string | null;
  interactionMode: 'mouse' | 'keyboard' | 'touch';
}

export interface UIEnhancementResult {
  appliedEnhancements: string[];
  domModifications: {
    added: string[];
    modified: string[];
    monitored: string[];
  };
  interactionCapabilities: string[];
}

export interface SpotifyUI extends ThemeService {
  // Core components managed by this service
  domWatcher: any; // NowPlayingDomWatcher
  sidebarManager: any; // Various sidebar systems
  interactionTracker: any; // InteractionTrackingSystem
  card3DManager: any; // Card3DManager
  glassmorphismManager: any; // GlassmorphismManager
  
  // Service-specific coordination methods
  adaptToSpotifyUI(uiState: SpotifyUIState): Promise<UIEnhancementResult>;
  handleSpotifyUIChange(change: any): Promise<void>;
  enhanceUserInteractions(interactions: any): Promise<void>;
  monitorSpotifyDOM(): void;
  
  // Platform integration
  injectThemeEnhancements(): Promise<void>;
  cleanupThemeEnhancements(): Promise<void>;
  validateSpotifyCompatibility(): Promise<HealthCheckResult>;
}

// ============================================================================
// Service 5: System Architecture & Performance
// ============================================================================

export interface SystemArchitectureConfig {
  performanceProfile: 'low' | 'balanced' | 'high' | 'ultra';
  enableAdvancedFeatures: boolean;
  debugMode: boolean;
  healthCheckInterval: number;
  coordinationStrategy: 'reactive' | 'proactive' | 'adaptive';
}

export interface SystemCoordinationResult {
  activeSystems: string[];
  systemHealth: Record<string, HealthCheckResult>;
  performanceMetrics: {
    totalMemoryUsage: number;
    coordinationOverhead: number;
    systemResponseTime: number;
  };
  coordinationEvents: number;
}

export interface SystemArchitecture extends ThemeService {
  // Core components managed by this service
  systemCoordinator: any; // SystemCoordinator
  performanceAnalyzer: any; // PerformanceAnalyzer
  eventBus: any; // UnifiedEventBus
  cssController: any; // CSSVariableWriter
  year3000System: any; // year3000System
  
  // Service-specific coordination methods
  configureSystemArchitecture(config: SystemArchitectureConfig): Promise<void>;
  coordinateAllDomains(change: CrossDomainChange): Promise<SystemCoordinationResult>;
  optimizeSystemPerformance(): Promise<void>;
  handleSystemHealthIssues(issues: HealthCheckResult[]): Promise<void>;
  
  // Cross-domain coordination
  facilitateDomainCommunication(from: string, to: string, message: any): Promise<void>;
  validateOverallSystemIntegrity(): Promise<HealthCheckResult>;
  emergencySystemRecovery(): Promise<void>;
}

// ============================================================================
// Cross-Service Coordination Types
// ============================================================================

export interface CrossServiceChange {
  originService: string;
  targetServices: string[];
  changeType: 'configuration' | 'state' | 'performance' | 'error' | 'user-action';
  data: any;
  priority: 'low' | 'normal' | 'high' | 'critical';
  requiresCoordination: boolean;
}

export interface ThemeServiceRegistry {
  musicIntegration: MusicIntegration;
  themeAppearance: ThemeAppearance;
  visualEffects: VisualEffects;
  spotifyUI: SpotifyUI;
  systemArchitecture: SystemArchitecture;
}

export interface SpicetifyThemeCoordinator {
  services: ThemeServiceRegistry;
  
  // Global coordination methods
  initializeAllServices(): Promise<void>;
  coordinateChange(change: CrossServiceChange): Promise<void>;
  validateThemeIntegrity(): Promise<HealthCheckResult>;
  getThemeMetrics(): Record<string, ServiceMetrics>;
  shutdownTheme(): Promise<void>;
  
  // Theme-specific methods
  handleUserSettingChange(setting: string, value: any): Promise<void>;
  handleSpotifyTrackChange(trackData: MusicData): Promise<void>;
  handleSpotifyUIUpdate(uiState: SpotifyUIState): Promise<void>;
  handlePerformanceIssue(issue: any): Promise<void>;
}

// ============================================================================
// Event System Integration
// ============================================================================

export interface ThemeServiceEvents {
  // Music Integration Domain Events
  'music:track-changed': { musicData: MusicData; analysis: MusicAnalysisResult };
  'music:analysis-complete': { analysis: MusicAnalysisResult };
  'music:player-state-changed': { isPlaying: boolean; position: number };
  
  // Theme Appearance Domain Events
  'theme:configuration-changed': { config: ThemeAppearanceConfig; result: ColorApplicationResult };
  'theme:palette-switched': { oldSystem: PaletteSystem; newSystem: PaletteSystem };
  'theme:colors-applied': { colors: Record<string, string> };
  
  // Visual Effects Domain Events
  'visual:effects-configured': { config: VisualEffectConfig; result: VisualRenderingResult };
  'visual:rendering-mode-changed': { oldMode: string; newMode: string };
  'visual:performance-optimized': { optimizations: string[] };
  
  // Spotify UI Integration Domain Events
  'spotify:ui-state-changed': { uiState: SpotifyUIState; enhancements: UIEnhancementResult };
  'spotify:dom-modified': { modifications: string[] };
  'spotify:interaction-enhanced': { enhancements: string[] };
  
  // System Architecture Domain Events
  'system:coordination-complete': { result: SystemCoordinationResult };
  'system:health-check': { health: Record<string, HealthCheckResult> };
  'system:performance-optimized': { metrics: any };
  
  // Cross-Service Events
  'service:coordination-requested': { change: CrossServiceChange };
  'service:coordination-complete': { change: CrossServiceChange; results: any[] };
  'theme:integrity-validated': { health: HealthCheckResult; services: string[] };
}