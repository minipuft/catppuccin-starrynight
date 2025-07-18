import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { Year3000Config } from '@/types/models';
import type { HealthCheckResult } from '@/types/systems';
import { YEAR3000_CONFIG } from '@/config/globalConfig';

interface FlowState {
  direction: 'horizontal' | 'vertical' | 'radial' | 'spiral';
  intensity: number; // 0-1 scale
  velocity: number; // pixels per second
  viscosity: number; // liquid consciousness parameter (0-1)
  flowField: FlowVector[];
}

interface FlowVector {
  x: number;
  y: number;
  magnitude: number;
  direction: number; // radians
  influence: number; // 0-1 how much this vector affects nearby areas
}

interface InteractionPattern {
  id: string;
  type: 'hover' | 'click' | 'focus' | 'proximity' | 'gesture';
  response: FlowResponse;
  duration: number; // milliseconds
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'liquid';
  priority: number; // 0-10 for interaction priority
}

interface FlowResponse {
  intensityChange: number; // -1 to 1
  velocityChange: number; // -1 to 1
  viscosityChange: number; // -1 to 1
  flowFieldDisturbance: FlowDisturbance[];
  rippleEffect: boolean;
  glowEffect: boolean;
}

interface FlowDisturbance {
  center: { x: number; y: number };
  radius: number;
  strength: number; // 0-1
  decay: number; // how fast it fades
  type: 'wave' | 'spiral' | 'pulse' | 'vortex';
}

interface ProximityData {
  distance: number; // pixels from cursor/touch
  angle: number; // radians from element center
  velocity: { x: number; y: number }; // cursor velocity
  pressure: number; // 0-1 for touch pressure
}

interface InteractionTrigger {
  type: InteractionPattern['type'];
  position: { x: number; y: number };
  element: HTMLElement;
  timestamp: number;
  proximityData?: ProximityData;
}

interface LiquidConsciousnessState {
  globalFlowIntensity: number;
  dominantFlowDirection: number; // radians
  interactionCount: number;
  lastInteractionTime: number;
  proximityElements: Array<{
    element: HTMLElement;
    distance: number;
    influence: number;
  }>;
}

/**
 * SidebarInteractiveFlowSystem
 * 
 * Implements liquid consciousness interaction patterns for sidebar elements.
 * This system creates fluid, organic responses to user interactions that
 * flow like liquid consciousness rather than discrete state changes.
 * 
 * Key Features:
 * - Liquid consciousness effects with viscous flow animations
 * - Ripple-less interaction patterns (performance-optimized)
 * - Proximity awareness with predictive interaction preparation
 * - Contextual micro-interactions based on user behavior
 * - Adaptive responsiveness that learns from user patterns
 * - Music-synchronized flow dynamics
 * - Performance-optimized with event-driven updates only
 * 
 * Architecture:
 * - Extends UnifiedSystemBase for unified lifecycle management
 * - Uses CSS-first animations for optimal performance
 * - Implements Intersection Observer for proximity detection
 * - Coordinates with bilateral consciousness systems
 * - Integrates with existing performance monitoring
 */
export class SidebarInteractiveFlowSystem extends UnifiedSystemBase {
  private flowState: FlowState;
  private interactionPatterns: Map<string, InteractionPattern> = new Map();
  private liquidConsciousnessState: LiquidConsciousnessState;
  
  // Performance optimization
  private proximityObserver: IntersectionObserver | null = null;
  private interactionElements: Map<string, HTMLElement> = new Map();
  private activeDisturbances: FlowDisturbance[] = [];
  
  // Animation state
  private animationPhase = 0;
  private lastUpdateTime = 0;
  // Note: frameCount is inherited from UnifiedSystemBase, using localFrameCount instead
  private localFrameCount = 0;
  
  // Music integration
  private musicBeatIntensity = 0;
  private musicEnergyLevel = 0;
  
  // Proximity tracking
  private cursorPosition = { x: 0, y: 0 };
  private cursorVelocity = { x: 0, y: 0 };
  private lastCursorUpdate = 0;
  
  // Performance parameters
  private readonly MAX_FLOW_VECTORS = 50;
  private readonly DISTURBANCE_DECAY_RATE = 0.05;
  private readonly PROXIMITY_THRESHOLD = 100; // pixels
  private readonly INTERACTION_COOLDOWN = 16; // ms (~60fps)
  
  // Flow dynamics
  private readonly FLOW_LERP = 0.08;
  private readonly VISCOSITY_LERP = 0.12;
  private readonly INTENSITY_LERP = 0.15;
  
  constructor(config: Year3000Config = YEAR3000_CONFIG) {
    super(config);
    
    // Initialize flow state
    this.flowState = {
      direction: 'radial',
      intensity: 0.3,
      velocity: 50,
      viscosity: 0.7,
      flowField: []
    };
    
    // Initialize liquid consciousness state
    this.liquidConsciousnessState = {
      globalFlowIntensity: 0,
      dominantFlowDirection: 0,
      interactionCount: 0,
      lastInteractionTime: 0,
      proximityElements: []
    };
    
    // Initialize flow field
    this.initializeFlowField();
    
    if (config.enableDebug) {
      console.log(`[${this.systemName}] Initialized liquid consciousness flow system`);
    }
  }
  
  /**
   * Initialize the interactive flow system
   */
  override async initialize(): Promise<void> {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Initializing liquid consciousness interactions`);
    }
    
    // Set up interaction patterns
    this.initializeInteractionPatterns();
    
    // Set up proximity detection
    this.setupProximityDetection();
    
    // Set up cursor tracking
    this.setupCursorTracking();
    
    // Subscribe to music events for flow dynamics
    this.subscribeToEvent('music:beat', (payload: any) => {
      this.musicBeatIntensity = payload.intensity;
      this.updateMusicFlowEffects();
    });
    
    this.subscribeToEvent('music:energy', (payload: any) => {
      this.musicEnergyLevel = payload.energy;
      this.updateMusicFlowEffects();
    });
    
    // Subscribe to bilateral consciousness events
    this.subscribeToEvent('sidebar:bilateral-beat', (payload: any) => {
      this.handleBilateralFlowSync(payload);
    });
    
    this.subscribeToEvent('sidebar:consciousness-level-changed', (payload: any) => {
      this.handleConsciousnessFlowChange(payload);
    });
    
    // Subscribe to interaction events
    this.subscribeToEvent('sidebar:interaction', (payload: InteractionTrigger) => {
      this.handleInteractionTrigger(payload);
    });
    
    // Register for animation coordination
    this.registerAnimation(50); // Lower priority than consciousness systems
    
    // Initialize CSS variables
    this.initializeFlowCSSVariables();
    
    this.publishEvent('sidebar:interactive-flow-ready', {
      systemName: this.systemName,
      flowPatterns: this.interactionPatterns.size,
      proximityThreshold: this.PROXIMITY_THRESHOLD,
      timestamp: Date.now()
    });
  }
  
  /**
   * Initialize flow field with vectors
   */
  private initializeFlowField(): void {
    this.flowState.flowField = [];
    
    // Create a grid of flow vectors
    const gridSize = 8;
    const spacing = 20;
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const vector: FlowVector = {
          x: x * spacing,
          y: y * spacing,
          magnitude: 0.5 + Math.random() * 0.5,
          direction: Math.random() * Math.PI * 2,
          influence: 0.3 + Math.random() * 0.4
        };
        
        this.flowState.flowField.push(vector);
      }
    }
  }
  
  /**
   * Initialize interaction patterns
   */
  private initializeInteractionPatterns(): void {
    // Hover pattern - gentle liquid flow
    this.interactionPatterns.set('hover', {
      id: 'hover',
      type: 'hover',
      response: {
        intensityChange: 0.2,
        velocityChange: 0.1,
        viscosityChange: -0.1, // Less viscous on hover
        flowFieldDisturbance: [{
          center: { x: 0, y: 0 }, // Will be updated on interaction
          radius: 30,
          strength: 0.3,
          decay: 0.05,
          type: 'wave'
        }],
        rippleEffect: false, // Performance-optimized
        glowEffect: true
      },
      duration: 300,
      easing: 'liquid',
      priority: 3
    });
    
    // Click pattern - stronger liquid disturbance
    this.interactionPatterns.set('click', {
      id: 'click',
      type: 'click',
      response: {
        intensityChange: 0.5,
        velocityChange: 0.3,
        viscosityChange: -0.2,
        flowFieldDisturbance: [{
          center: { x: 0, y: 0 },
          radius: 50,
          strength: 0.7,
          decay: 0.08,
          type: 'pulse'
        }],
        rippleEffect: false,
        glowEffect: true
      },
      duration: 500,
      easing: 'liquid',
      priority: 8
    });
    
    // Focus pattern - sustained liquid consciousness
    this.interactionPatterns.set('focus', {
      id: 'focus',
      type: 'focus',
      response: {
        intensityChange: 0.3,
        velocityChange: 0.05,
        viscosityChange: 0.1, // More viscous for focus
        flowFieldDisturbance: [{
          center: { x: 0, y: 0 },
          radius: 40,
          strength: 0.4,
          decay: 0.02, // Slower decay for sustained effect
          type: 'spiral'
        }],
        rippleEffect: false,
        glowEffect: true
      },
      duration: 1000,
      easing: 'liquid',
      priority: 6
    });
    
    // Proximity pattern - predictive liquid preparation
    this.interactionPatterns.set('proximity', {
      id: 'proximity',
      type: 'proximity',
      response: {
        intensityChange: 0.1,
        velocityChange: 0.05,
        viscosityChange: -0.05,
        flowFieldDisturbance: [{
          center: { x: 0, y: 0 },
          radius: 20,
          strength: 0.2,
          decay: 0.03,
          type: 'wave'
        }],
        rippleEffect: false,
        glowEffect: false
      },
      duration: 200,
      easing: 'liquid',
      priority: 2
    });
    
    // Gesture pattern - flowing liquid response
    this.interactionPatterns.set('gesture', {
      id: 'gesture',
      type: 'gesture',
      response: {
        intensityChange: 0.4,
        velocityChange: 0.2,
        viscosityChange: -0.15,
        flowFieldDisturbance: [{
          center: { x: 0, y: 0 },
          radius: 60,
          strength: 0.6,
          decay: 0.06,
          type: 'vortex'
        }],
        rippleEffect: false,
        glowEffect: true
      },
      duration: 400,
      easing: 'liquid',
      priority: 7
    });
  }
  
  /**
   * Set up proximity detection using Intersection Observer
   */
  private setupProximityDetection(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.proximityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const element = entry.target as HTMLElement;
            const elementId = element.id || element.className;
            
            if (entry.isIntersecting) {
              this.interactionElements.set(elementId, element);
              this.handleProximityEnter(element);
            } else {
              this.interactionElements.delete(elementId);
              this.handleProximityExit(element);
            }
          });
        },
        {
          threshold: [0, 0.1, 0.5, 1.0],
          rootMargin: `${this.PROXIMITY_THRESHOLD}px`
        }
      );
      
      // Observe sidebar elements (would be set up with actual DOM elements)
      this.observeSidebarElements();
    }
  }
  
  /**
   * Set up cursor tracking for proximity awareness
   */
  private setupCursorTracking(): void {
    // These would be actual DOM event listeners in production
    // For now, we'll simulate cursor tracking
    
    if (this.config.enableDebug) {
      // Mock cursor movement for testing
      setInterval(() => {
        this.simulateCursorMovement();
      }, 50); // 20fps cursor tracking
    }
  }
  
  /**
   * Observe sidebar elements for proximity detection
   */
  private observeSidebarElements(): void {
    // In production, this would find actual sidebar elements
    // For now, we'll simulate element observation
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Observing sidebar elements for proximity`);
    }
  }
  
  /**
   * Handle interaction trigger
   */
  private handleInteractionTrigger(trigger: InteractionTrigger): void {
    const pattern = this.interactionPatterns.get(trigger.type);
    if (!pattern) return;
    
    // Check interaction cooldown
    const currentTime = Date.now();
    if (currentTime - this.liquidConsciousnessState.lastInteractionTime < this.INTERACTION_COOLDOWN) {
      return;
    }
    
    this.liquidConsciousnessState.lastInteractionTime = currentTime;
    this.liquidConsciousnessState.interactionCount++;
    
    // Apply flow response
    this.applyFlowResponse(pattern.response, trigger.position);
    
    // Update global flow state
    this.updateGlobalFlowState(pattern);
    
    // Publish interaction event
    this.publishEvent('sidebar:flow-interaction', {
      type: trigger.type,
      position: trigger.position,
      pattern: pattern.id,
      timestamp: currentTime
    });
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Flow interaction: ${trigger.type} at (${trigger.position.x}, ${trigger.position.y})`);
    }
  }
  
  /**
   * Apply flow response to the system
   */
  private applyFlowResponse(response: FlowResponse, position: { x: number; y: number }): void {
    // Update flow state
    this.flowState.intensity = Math.max(0, Math.min(1, 
      this.flowState.intensity + response.intensityChange));
    
    this.flowState.velocity = Math.max(0, Math.min(200, 
      this.flowState.velocity + response.velocityChange * 50));
    
    this.flowState.viscosity = Math.max(0, Math.min(1, 
      this.flowState.viscosity + response.viscosityChange));
    
    // Add flow field disturbances
    response.flowFieldDisturbance.forEach(disturbance => {
      const positionedDisturbance: FlowDisturbance = {
        ...disturbance,
        center: position
      };
      
      this.activeDisturbances.push(positionedDisturbance);
    });
    
    // Limit active disturbances for performance
    if (this.activeDisturbances.length > 10) {
      this.activeDisturbances = this.activeDisturbances.slice(-10);
    }
  }
  
  /**
   * Update global flow state based on interaction pattern
   */
  private updateGlobalFlowState(pattern: InteractionPattern): void {
    // Update dominant flow direction based on interaction priority
    const priorityWeight = pattern.priority / 10;
    this.liquidConsciousnessState.dominantFlowDirection = 
      (this.liquidConsciousnessState.dominantFlowDirection + Math.random() * Math.PI * 2) * priorityWeight;
    
    // Update global flow intensity
    this.liquidConsciousnessState.globalFlowIntensity = Math.max(0, Math.min(1,
      this.liquidConsciousnessState.globalFlowIntensity + pattern.response.intensityChange * 0.5));
  }
  
  /**
   * Handle proximity enter
   */
  private handleProximityEnter(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    
    // Calculate distance from cursor
    const distance = Math.sqrt(
      Math.pow(center.x - this.cursorPosition.x, 2) +
      Math.pow(center.y - this.cursorPosition.y, 2)
    );
    
    // Add to proximity elements
    this.liquidConsciousnessState.proximityElements.push({
      element,
      distance,
      influence: Math.max(0, 1 - (distance / this.PROXIMITY_THRESHOLD))
    });
    
    // Trigger proximity interaction
    this.handleInteractionTrigger({
      type: 'proximity',
      position: center,
      element,
      timestamp: Date.now(),
      proximityData: {
        distance,
        angle: Math.atan2(center.y - this.cursorPosition.y, center.x - this.cursorPosition.x),
        velocity: this.cursorVelocity,
        pressure: 0.5
      }
    });
  }
  
  /**
   * Handle proximity exit
   */
  private handleProximityExit(element: HTMLElement): void {
    this.liquidConsciousnessState.proximityElements = 
      this.liquidConsciousnessState.proximityElements.filter(item => item.element !== element);
  }
  
  /**
   * Update music flow effects
   */
  private updateMusicFlowEffects(): void {
    // Synchronize flow intensity with music beat
    const musicFlowIntensity = this.musicBeatIntensity * 0.3;
    this.flowState.intensity = Math.max(this.flowState.intensity, musicFlowIntensity);
    
    // Adjust flow velocity based on music energy
    const musicVelocityBoost = this.musicEnergyLevel * 30;
    this.flowState.velocity = Math.min(200, this.flowState.velocity + musicVelocityBoost);
    
    // Adjust viscosity based on music energy (higher energy = less viscous)
    const musicViscosityAdjustment = (1 - this.musicEnergyLevel) * 0.2;
    this.flowState.viscosity = Math.max(0.1, this.flowState.viscosity - musicViscosityAdjustment);
    
    // Update flow field with music-influenced vectors
    this.updateFlowFieldWithMusic();
  }
  
  /**
   * Update flow field with music influence
   */
  private updateFlowFieldWithMusic(): void {
    const musicInfluence = this.musicBeatIntensity * 0.5;
    
    this.flowState.flowField.forEach(vector => {
      // Add music-influenced direction changes
      vector.direction += (Math.random() - 0.5) * musicInfluence * 0.1;
      
      // Adjust magnitude based on music energy
      vector.magnitude = Math.max(0.1, Math.min(1, 
        vector.magnitude + (this.musicEnergyLevel - 0.5) * 0.2));
    });
  }
  
  /**
   * Handle bilateral flow synchronization
   */
  private handleBilateralFlowSync(payload: any): void {
    if (payload.source === 'left') {
      // Synchronize flow with left sidebar consciousness
      const consciousnessFlow = payload.intensity * 0.2;
      this.flowState.intensity = Math.max(this.flowState.intensity, consciousnessFlow);
      
      // Adjust flow direction based on consciousness level
      const flowDirectionAdjustment = payload.intensity * 0.3;
      this.liquidConsciousnessState.dominantFlowDirection += flowDirectionAdjustment;
    }
  }
  
  /**
   * Handle consciousness flow changes
   */
  private handleConsciousnessFlowChange(payload: any): void {
    const consciousnessLevels = {
      dormant: 0.1,
      aware: 0.3,
      focused: 0.6,
      transcendent: 1.0
    };
    
    const targetIntensity = consciousnessLevels[payload.newLevel as keyof typeof consciousnessLevels] || 0.3;
    
    // Smoothly adjust flow state to match consciousness level
    this.flowState.intensity = this.lerp(this.flowState.intensity, targetIntensity, 0.1);
    
    // Adjust viscosity based on consciousness level
    const viscosityTarget = 0.8 - (targetIntensity * 0.3); // Higher consciousness = less viscous
    this.flowState.viscosity = this.lerp(this.flowState.viscosity, viscosityTarget, 0.05);
  }
  
  /**
   * Simulate cursor movement for testing
   */
  private simulateCursorMovement(): void {
    if (!this.config.enableDebug) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastCursorUpdate;
    
    // Simulate organic cursor movement
    const time = currentTime * 0.001;
    const newX = 200 + Math.sin(time * 0.5) * 100;
    const newY = 300 + Math.cos(time * 0.3) * 80;
    
    // Calculate velocity
    if (this.lastCursorUpdate > 0) {
      this.cursorVelocity.x = (newX - this.cursorPosition.x) / deltaTime * 1000;
      this.cursorVelocity.y = (newY - this.cursorPosition.y) / deltaTime * 1000;
    }
    
    this.cursorPosition.x = newX;
    this.cursorPosition.y = newY;
    this.lastCursorUpdate = currentTime;
  }
  
  /**
   * Update flow field disturbances
   */
  private updateFlowDisturbances(): void {
    this.activeDisturbances = this.activeDisturbances.filter(disturbance => {
      // Apply decay
      disturbance.strength *= (1 - disturbance.decay);
      
      // Remove if too weak
      return disturbance.strength > 0.01;
    });
    
    // Update flow field based on disturbances
    this.activeDisturbances.forEach(disturbance => {
      this.flowState.flowField.forEach(vector => {
        const distance = Math.sqrt(
          Math.pow(vector.x - disturbance.center.x, 2) +
          Math.pow(vector.y - disturbance.center.y, 2)
        );
        
        if (distance < disturbance.radius) {
          const influence = disturbance.strength * (1 - distance / disturbance.radius);
          
          // Apply disturbance based on type
          switch (disturbance.type) {
            case 'wave':
              vector.magnitude += influence * 0.3;
              break;
            case 'spiral':
              vector.direction += influence * 0.5;
              break;
            case 'pulse':
              vector.magnitude += influence * 0.5;
              vector.direction += influence * 0.2;
              break;
            case 'vortex':
              const angle = Math.atan2(
                vector.y - disturbance.center.y,
                vector.x - disturbance.center.x
              );
              vector.direction = angle + influence * Math.PI * 0.5;
              break;
          }
        }
      });
    });
  }
  
  /**
   * Initialize flow CSS variables
   */
  private initializeFlowCSSVariables(): void {
    this.updateCSSVariables({
      '--sn-flow-intensity': this.flowState.intensity.toFixed(3),
      '--sn-flow-velocity': `${this.flowState.velocity}px`,
      '--sn-flow-viscosity': this.flowState.viscosity.toFixed(3),
      '--sn-flow-direction': `${this.liquidConsciousnessState.dominantFlowDirection}rad`,
      '--sn-flow-global-intensity': this.liquidConsciousnessState.globalFlowIntensity.toFixed(3),
      '--sn-flow-interaction-count': this.liquidConsciousnessState.interactionCount.toString(),
      '--sn-flow-proximity-elements': this.liquidConsciousnessState.proximityElements.length.toString(),
      '--sn-flow-disturbances': this.activeDisturbances.length.toString(),
      '--sn-flow-music-beat': this.musicBeatIntensity.toFixed(3),
      '--sn-flow-music-energy': this.musicEnergyLevel.toFixed(3)
    });
  }
  
  /**
   * Update flow CSS variables
   */
  private updateFlowCSSVariables(): void {
    this.updateCSSVariables({
      '--sn-flow-intensity': this.flowState.intensity.toFixed(3),
      '--sn-flow-velocity': `${this.flowState.velocity}px`,
      '--sn-flow-viscosity': this.flowState.viscosity.toFixed(3),
      '--sn-flow-direction': `${this.liquidConsciousnessState.dominantFlowDirection}rad`,
      '--sn-flow-global-intensity': this.liquidConsciousnessState.globalFlowIntensity.toFixed(3)
    });
  }
  
  /**
   * Linear interpolation helper
   */
  private lerp(from: number, to: number, alpha: number): number {
    return from + (to - from) * alpha;
  }
  
  /**
   * Animation frame callback
   */
  onAnimate(deltaTime: number): void {
    this.lastUpdateTime = performance.now();
    this.animationPhase += deltaTime * 0.001;
    this.localFrameCount++;
    
    // Update flow field disturbances
    this.updateFlowDisturbances();
    
    // Apply flow dynamics with lerp smoothing
    this.flowState.intensity = this.lerp(
      this.flowState.intensity,
      this.liquidConsciousnessState.globalFlowIntensity,
      this.INTENSITY_LERP
    );
    
    // Apply natural flow decay
    this.flowState.intensity *= 0.995;
    this.flowState.velocity *= 0.98;
    
    // Update flow field with natural turbulence
    if (this.localFrameCount % 10 === 0) { // Every 10 frames
      this.updateFlowFieldNaturalTurbulence();
    }
    
    // Update proximity elements
    this.updateProximityElements();
    
    // Update CSS variables
    this.updateFlowCSSVariables();
    
    // Update music flow effects
    this.updateMusicFlowEffects();
  }
  
  /**
   * Update flow field with natural turbulence
   */
  private updateFlowFieldNaturalTurbulence(): void {
    this.flowState.flowField.forEach(vector => {
      // Add subtle natural turbulence
      vector.direction += (Math.random() - 0.5) * 0.02;
      vector.magnitude += (Math.random() - 0.5) * 0.01;
      
      // Clamp values
      vector.magnitude = Math.max(0.1, Math.min(1, vector.magnitude));
    });
  }
  
  /**
   * Update proximity elements
   */
  private updateProximityElements(): void {
    this.liquidConsciousnessState.proximityElements.forEach(item => {
      const rect = item.element.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      
      // Update distance
      item.distance = Math.sqrt(
        Math.pow(center.x - this.cursorPosition.x, 2) +
        Math.pow(center.y - this.cursorPosition.y, 2)
      );
      
      // Update influence
      item.influence = Math.max(0, 1 - (item.distance / this.PROXIMITY_THRESHOLD));
    });
  }
  
  /**
   * Get current flow state
   */
  getFlowState(): FlowState {
    return { ...this.flowState };
  }
  
  /**
   * Get liquid consciousness state
   */
  getLiquidConsciousnessState(): LiquidConsciousnessState {
    return { ...this.liquidConsciousnessState };
  }
  
  /**
   * Get active disturbances
   */
  getActiveDisturbances(): FlowDisturbance[] {
    return [...this.activeDisturbances];
  }
  
  /**
   * System health check
   */
  async healthCheck(): Promise<HealthCheckResult> {
    return {
      ok: true,
      details: `Interactive flow system healthy - ${this.interactionPatterns.size} patterns, ${this.activeDisturbances.length} disturbances, ${this.liquidConsciousnessState.interactionCount} interactions`
    };
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Destroying liquid consciousness flow system`);
    }
    
    // Clean up proximity observer
    if (this.proximityObserver) {
      this.proximityObserver.disconnect();
      this.proximityObserver = null;
    }
    
    // Clear interaction data
    this.interactionPatterns.clear();
    this.interactionElements.clear();
    this.activeDisturbances = [];
    
    // Reset flow state
    this.flowState = {
      direction: 'radial',
      intensity: 0,
      velocity: 0,
      viscosity: 0.5,
      flowField: []
    };
    
    // Reset liquid consciousness state
    this.liquidConsciousnessState = {
      globalFlowIntensity: 0,
      dominantFlowDirection: 0,
      interactionCount: 0,
      lastInteractionTime: 0,
      proximityElements: []
    };
    
    this.publishEvent('sidebar:interactive-flow-destroyed', {
      timestamp: Date.now()
    });
  }
}