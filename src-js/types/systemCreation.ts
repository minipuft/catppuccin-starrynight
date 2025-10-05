/**
 * System Creation Interfaces
 *
 * Standardized interfaces for system construction and dependency injection.
 * Part of Phase 2: Integration Architecture Refactoring
 *
 * Replaces the FacadeAdapter pattern with direct system construction.
 */

import type { Year3000Config, AdvancedSystemConfig } from "@/types/models";
import type * as Utils from "@/utils/core/ThemeUtilities";
import type { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import type { CSSVariableWriter } from "@/core/css/CSSVariableWriter";
import type { MusicSyncService } from "@/audio/MusicSyncService";
import type { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import type { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import type { EnhancedDeviceTierDetector } from "@/core/performance/EnhancedDeviceTierDetector";
import type { WebGLSystemsIntegration } from "@/core/webgl/WebGLSystemsIntegration";

/**
 * Shared dependencies available for system construction
 *
 * Systems can request dependencies by declaring them in systemDependencies registry.
 * Dependencies are injected during system creation.
 */
export interface SharedDependencies {
  // Performance systems (supports both PerformanceAnalyzer and SimplePerformanceCoordinator)
  performanceCoordinator?: SimplePerformanceCoordinator | any; // Can be PerformanceAnalyzer or SimplePerformanceCoordinator
  performanceAnalyzer?: SimplePerformanceCoordinator | any; // Legacy alias
  simplePerformanceCoordinator?: SimplePerformanceCoordinator; // Legacy alias
  performanceOrchestrator?: SimplePerformanceCoordinator | any; // Legacy alias

  // Device detection
  deviceDetector?: DeviceCapabilityDetector;
  deviceCapabilityDetector?: DeviceCapabilityDetector; // Legacy alias
  enhancedDeviceTierDetector?: EnhancedDeviceTierDetector;

  // WebGL integration
  webglSystemsIntegration?: WebGLSystemsIntegration;

  // CSS management
  cssVariableManager?: CSSVariableWriter;
  cssVariableController?: CSSVariableWriter; // Legacy alias
  cssConsciousnessController?: CSSVariableWriter; // Legacy alias

  // Audio/Visual services
  musicSyncService?: MusicSyncService;
  colorHarmonyEngine?: ColorHarmonyEngine;

  // System reference
  year3000System?: any;
}

/**
 * Standard context provided to all systems during construction
 *
 * Systems can use this context to access configuration, utilities,
 * and shared dependencies without hardcoded constructor parameters.
 */
export interface SystemCreationContext {
  /** System configuration */
  config: Year3000Config | AdvancedSystemConfig;

  /** Theme utilities */
  utils: typeof Utils;

  /** Shared dependencies available for injection */
  dependencies: SharedDependencies;

  /** Reference to main system (for backward compatibility) */
  year3000System?: any;
}

/**
 * Interface for system constructors that accept standard context
 *
 * Systems implementing this pattern are "self-constructing" and
 * know their own dependencies.
 */
export interface ISystemConstructor {
  new (context: SystemCreationContext): any;
}

/**
 * Legacy constructor pattern (for systems not yet migrated)
 *
 * Many systems use varied constructor signatures. This type
 * represents the flexible constructor pattern used during migration.
 */
export type LegacySystemConstructor = new (...args: any[]) => any;
