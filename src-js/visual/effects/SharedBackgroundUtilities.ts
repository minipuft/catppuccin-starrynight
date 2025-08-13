/**
 * Shared Background Consciousness Utilities
 *
 * Shared utilities and base classes for background systems implementing
 * consciousness choreography patterns, eliminating code duplication across
 * WebGL, Liquid, and Depth background systems.
 *
 * @architecture Phase 2.2C Optimization & Consolidation
 * @philosophy Organic consciousness coordination through shared infrastructure
 */

import { getGlobalOptimizedCSSController, OptimizedCSSVariableManager } from "@/core/performance/OptimizedCSSVariableManager";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import { ShaderLoader } from "@/utils/graphics/ShaderLoader";
import type {
  VisualEffectsCoordinator as BackgroundAnimationCoordinator,
  BackgroundSystemParticipant,
  VisualEffectState as ConsciousnessField,
} from "./VisualEffectsCoordinator";

// ===================================================================
// SHARED CONSCIOUSNESS REGISTRATION UTILITIES
// ===================================================================

/**
 * Standard consciousness choreographer registration pattern
 * Eliminates duplicate registration code across all background systems
 */
export class BackgroundSystemRegistry {
  /**
   * Register a background system as a consciousness participant
   * Standard pattern used by WebGL, Liquid, and Depth systems
   */
  public static registerWithConsciousnessChoreographer(
    participant: BackgroundSystemParticipant,
    choreographer: BackgroundAnimationCoordinator | null,
    systemName: string
  ): boolean {
    if (!choreographer) {
      Y3KDebug?.debug?.log(
        systemName,
        "Consciousness choreographer not available, skipping registration"
      );
      return false;
    }

    try {
      choreographer.registerConsciousnessParticipant(participant);
      Y3KDebug?.debug?.log(
        systemName,
        "Successfully registered with consciousness choreographer"
      );
      return true;
    } catch (error) {
      Y3KDebug?.debug?.error(
        systemName,
        "Failed to register with consciousness choreographer:",
        error
      );
      return false;
    }
  }

  /**
   * Unregister from consciousness choreographer during cleanup
   * Standard cleanup pattern for all background systems
   */
  public static unregisterFromConsciousnessChoreographer(
    choreographer: BackgroundAnimationCoordinator | null,
    systemName: string
  ): void {
    if (!choreographer) return;

    try {
      choreographer.unregisterConsciousnessParticipant(systemName);
      Y3KDebug?.debug?.log(
        systemName,
        "Unregistered from consciousness choreographer"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        systemName,
        "Error unregistering from consciousness choreographer:",
        error
      );
    }
  }
}

// ===================================================================
// SHARED SHADER MANAGEMENT UTILITIES
// ===================================================================

/**
 * Consolidated shader compilation and uniform management
 * Eliminates duplicate shader setup code across WebGL-based systems
 */
export class ShaderResourceManager {
  /**
   * Compile vertex and fragment shaders with standardized error handling
   * Common pattern across WebGL and Liquid systems
   */
  public static async compileShaderProgram(
    gl: WebGL2RenderingContext,
    fragmentShaderSource: string,
    systemName: string
  ): Promise<WebGLProgram | null> {
    try {
      const standardVertexShader = `#version 300 es
        in vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

      const vertexShader = ShaderLoader.loadVertex(gl, standardVertexShader);
      const fragmentShader = ShaderLoader.loadFragment(
        gl,
        fragmentShaderSource
      );

      if (!vertexShader || !fragmentShader) {
        throw new Error(`Failed to compile shaders for ${systemName}`);
      }

      const shaderProgram = ShaderLoader.createProgram(
        gl,
        vertexShader,
        fragmentShader
      );

      if (!shaderProgram) {
        throw new Error(`Failed to create shader program for ${systemName}`);
      }

      Y3KDebug?.debug?.log(
        systemName,
        "Successfully compiled consciousness shaders"
      );
      return shaderProgram;
    } catch (error) {
      Y3KDebug?.debug?.error(
        systemName,
        "Failed to compile consciousness shaders:",
        error
      );
      return null;
    }
  }

  /**
   * Setup uniform locations from a list of uniform names
   * Eliminates duplicate uniform location setup code
   */
  public static setupUniformLocations(
    gl: WebGL2RenderingContext,
    shaderProgram: WebGLProgram,
    uniformNames: string[]
  ): { [key: string]: WebGLUniformLocation | null } {
    const uniforms: { [key: string]: WebGLUniformLocation | null } = {};

    uniformNames.forEach((name) => {
      uniforms[name] = gl.getUniformLocation(shaderProgram, name);
    });

    return uniforms;
  }

  /**
   * Update WebGL uniform with null safety
   * Standard pattern for all shader uniform updates
   */
  public static updateUniform1f(
    gl: WebGL2RenderingContext,
    location: WebGLUniformLocation | null,
    value: number
  ): void {
    if (location) {
      gl.uniform1f(location, value);
    }
  }

  /**
   * Update WebGL vec2 uniform with null safety
   * Standard pattern for directional and position uniforms
   */
  public static updateUniform2f(
    gl: WebGL2RenderingContext,
    location: WebGLUniformLocation | null,
    x: number,
    y: number
  ): void {
    if (location) {
      gl.uniform2f(location, x, y);
    }
  }

  /**
   * Update WebGL vec2 array uniform with null safety
   * Used for flow direction and similar vector uniforms
   */
  public static updateUniform2fv(
    gl: WebGL2RenderingContext,
    location: WebGLUniformLocation | null,
    values: number[] | Float32Array
  ): void {
    if (location) {
      gl.uniform2fv(location, values);
    }
  }
}

// ===================================================================
// SHARED CSS CONSCIOUSNESS INTEGRATION
// ===================================================================

/**
 * Consolidated CSS consciousness variable updates
 * Eliminates duplicate CSS variable update patterns
 */
export class CSSVariableIntegrator {
  private static cssController: OptimizedCSSVariableManager | null = null;

  /**
   * Get or cache the CSS consciousness controller instance
   */
  private static getCSSController(): OptimizedCSSVariableManager | null {
    if (!this.cssController) {
      this.cssController = getGlobalOptimizedCSSController();
    }
    return this.cssController;
  }

  /**
   * Update CSS variable with consciousness awareness
   * Standard pattern for hybrid WebGL/CSS coordination
   */
  public static updateConsciousnessVariable(
    variableName: string,
    value: string | number
  ): void {
    const cssController = this.getCSSController();
    if (cssController) {
      cssController.queueCSSVariableUpdate(variableName, value.toString());
    }
  }

  /**
   * Batch update multiple consciousness CSS variables
   * Optimized for systems updating multiple variables simultaneously
   */
  public static updateConsciousnessVariablesBatch(variables: {
    [key: string]: string | number;
  }): void {
    const cssController = this.getCSSController();
    if (!cssController) return;

    for (const [name, value] of Object.entries(variables)) {
      cssController.queueCSSVariableUpdate(name, value.toString());
    }
  }
}

// ===================================================================
// SHARED CONSCIOUSNESS FIELD RESPONSE PATTERNS
// ===================================================================

/**
 * Standard consciousness field response utilities
 * Common patterns for responding to consciousness field updates
 */
export class BackgroundEventResponder {
  /**
   * Standard rhythmic pulse response calculation
   * Used by all systems for beat-synchronized effects
   */
  public static calculateRhythmicResponse(
    baseValue: number,
    rhythmicPulse: number,
    intensity: number = 0.5
  ): number {
    return baseValue * (1.0 + rhythmicPulse * intensity);
  }

  /**
   * Standard breathing cycle modulation
   * Organic breathing pattern used across systems
   */
  public static calculateBreathingModulation(
    baseValue: number,
    breathingCycle: number,
    amplitude: number = 0.1
  ): number {
    const breathingPhase = Math.sin(breathingCycle * Math.PI * 2);
    return baseValue * (1.0 + breathingPhase * amplitude);
  }

  /**
   * Musical flow direction response
   * Standard flow direction calculation from consciousness field
   */
  public static calculateFlowResponse(
    musicalFlow: { x: number; y: number },
    baseFlow: [number, number],
    sensitivity: number = 0.5
  ): [number, number] {
    return [
      baseFlow[0] + musicalFlow.x * sensitivity,
      baseFlow[1] + musicalFlow.y * sensitivity,
    ];
  }

  /**
   * Energy resonance modulation
   * Standard energy response pattern for dynamic effects
   */
  public static calculateEnergyResponse(
    baseValue: number,
    energyResonance: number,
    minMultiplier: number = 0.5,
    maxMultiplier: number = 1.5
  ): number {
    return (
      baseValue *
      (minMultiplier + energyResonance * (maxMultiplier - minMultiplier))
    );
  }
}

// ===================================================================
// SHARED CHOREOGRAPHY EVENT HANDLERS
// ===================================================================

/**
 * Standard choreography event response patterns
 * Common event handling logic across background systems
 */
export class ChoreographyEventResponder {
  /**
   * Standard rhythm shift response
   * Common pattern for BPM-based parameter adjustments
   */
  public static handleRhythmShift(
    currentValue: number,
    newBPM: number,
    baseBPM: number = 120,
    minValue: number = 0.2,
    maxValue: number = 1.0
  ): number {
    const rhythmRatio = Math.max(0.5, Math.min(2.0, newBPM / baseBPM));
    return Math.max(minValue, Math.min(maxValue, currentValue * rhythmRatio));
  }

  /**
   * Standard energy surge response
   * Common pattern for intensity-based parameter modulation
   */
  public static handleEnergySurge(
    currentValue: number,
    surgeIntensity: number,
    maxMultiplier: number = 1.5
  ): number {
    return Math.min(maxMultiplier, currentValue * (1.0 + surgeIntensity * 0.5));
  }

  /**
   * Standard breathing cycle synchronization
   * Common pattern for organic breathing effects
   */
  public static handleBreathingCycle(
    baseValue: number,
    breathingPhase: number,
    amplitude: number = 0.3
  ): number {
    return baseValue + Math.sin(breathingPhase * Math.PI * 2) * amplitude;
  }

  /**
   * Standard membrane fluidity response
   * Common pattern for boundary fluidity effects
   */
  public static handleMembraneFluid(
    targetProperty: number,
    fluidityIndex: number
  ): number {
    return fluidityIndex;
  }
}

// ===================================================================
// SHARED MUSIC SYNC UTILITIES
// ===================================================================

/**
 * Standard music synchronization patterns
 * Common music sync handling across background systems
 */
export class MusicSyncUtilities {
  /**
   * Standard music event throttling
   * Common pattern to limit music update frequency
   */
  public static shouldUpdateMusic(
    lastUpdateTime: number,
    throttleMs: number = 33 // 30fps default
  ): boolean {
    return performance.now() - lastUpdateTime >= throttleMs;
  }

  /**
   * Standard flow direction calculation from music intensity
   * Common pattern for music-driven directional effects
   */
  public static calculateMusicFlowDirection(
    animationPhase: number,
    intensity: number
  ): [number, number] {
    return [
      Math.sin(animationPhase * 0.3) * intensity,
      Math.cos(animationPhase * 0.2) * intensity,
    ];
  }

  /**
   * Standard beat-based animation phase increment
   * Common pattern for beat-synchronized animations
   */
  public static incrementAnimationPhase(
    currentPhase: number,
    beatIntensity: number,
    baseIncrement: number = 0.1
  ): number {
    return currentPhase + baseIncrement * (0.5 + beatIntensity * 0.5);
  }
}

// ===================================================================
// BASE CONSCIOUSNESS PARTICIPANT CLASS
// ===================================================================

/**
 * Base class implementing common BackgroundSystemParticipant patterns
 * Eliminates duplicate interface implementation code
 */
export abstract class BaseBackgroundSystem
  implements BackgroundSystemParticipant
{
  protected consciousnessChoreographer: BackgroundAnimationCoordinator | null =
    null;
  protected currentConsciousnessField: ConsciousnessField | null = null;

  // Abstract properties that must be implemented by subclasses
  public abstract readonly systemName: string;
  public abstract get systemPriority(): "low" | "normal" | "high" | "critical";

  // Abstract methods that must be implemented by subclasses
  public abstract getConsciousnessContribution(): any;
  protected abstract updateFromConsciousness(field: ConsciousnessField): void;

  // Shared implementation of consciousness field updates
  public onConsciousnessFieldUpdate(field: ConsciousnessField): void {
    try {
      this.currentConsciousnessField = field;
      this.updateFromConsciousness(field);

      Y3KDebug?.debug?.log(
        this.systemName,
        "Updated from consciousness field:",
        {
          rhythmicPulse: field.pulseRate,
          energyResonance: field.energyLevel,
          breathingCycle: field.pulseRate,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        this.systemName,
        "Error updating from consciousness field:",
        error
      );
    }
  }

  // Standard choreography event handling with common patterns
  public onChoreographyEvent(eventType: string, payload: any): void {
    try {
      switch (eventType) {
        case "choreography:rhythm-shift":
          this.handleRhythmShift(payload);
          break;
        case "choreography:energy-surge":
          this.handleEnergySurge(payload);
          break;
        case "consciousness:breathing-cycle":
          this.handleBreathingCycle(payload);
          break;
        case "consciousness:membrane-fluid":
          this.handleMembraneFluid(payload);
          break;
        default:
          // Allow subclasses to handle additional events
          this.handleCustomChoreographyEvent(eventType, payload);
          break;
      }

      // Reapply consciousness field if available
      if (this.currentConsciousnessField) {
        this.updateFromConsciousness(this.currentConsciousnessField);
      }

      Y3KDebug?.debug?.log(
        this.systemName,
        `Handled choreography event: ${eventType}`,
        payload
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        this.systemName,
        `Error handling choreography event ${eventType}:`,
        error
      );
    }
  }

  // Default event handlers using shared utilities
  protected handleRhythmShift(payload: any): void {
    // Override in subclasses for specific rhythm shift handling
  }

  protected handleEnergySurge(payload: any): void {
    // Override in subclasses for specific energy surge handling
  }

  protected handleBreathingCycle(payload: any): void {
    // Override in subclasses for specific breathing cycle handling
  }

  protected handleMembraneFluid(payload: any): void {
    // Override in subclasses for specific membrane fluid handling
  }

  // Allow subclasses to handle custom events
  protected handleCustomChoreographyEvent(
    eventType: string,
    payload: any
  ): void {
    // Override in subclasses for custom event handling
  }

  // Standard registration and cleanup
  protected registerWithChoreographer(
    choreographer: BackgroundAnimationCoordinator | null
  ): void {
    this.consciousnessChoreographer = choreographer;
    BackgroundSystemRegistry.registerWithConsciousnessChoreographer(
      this,
      choreographer,
      this.systemName
    );
  }

  protected unregisterFromChoreographer(): void {
    BackgroundSystemRegistry.unregisterFromConsciousnessChoreographer(
      this.consciousnessChoreographer,
      this.systemName
    );
  }

  // =========================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE (ABSTRACT)
  // =========================================================================

  public abstract onVisualStateUpdate(state: ConsciousnessField): void;
  public abstract onVisualEffectEvent(eventType: string, payload: any): void;
  public abstract getVisualContribution(): Partial<ConsciousnessField>;
}
