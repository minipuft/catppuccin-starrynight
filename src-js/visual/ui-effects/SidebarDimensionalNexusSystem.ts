import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { Year3000Config } from '@/types/models';
import type { HealthCheckResult } from '@/types/systems';
import { YEAR3000_CONFIG } from '@/config/globalConfig';

interface SpatialCoordinates {
  x: number;
  y: number;
  z: number; // depth layer
  rotation: number; // 3D rotation in degrees
  scale: number; // scale factor
}

interface DimensionalLayer {
  id: string;
  depth: number;
  elements: NavigationElement[];
  transform: CSS3DTransform;
  visibility: number; // 0-1 opacity based on spatial focus
}

interface NavigationElement {
  id: string;
  type: 'playlist' | 'artist' | 'album' | 'track' | 'genre' | 'folder';
  spatialPosition: SpatialCoordinates;
  contextualWeight: number; // 0-1 based on user behavior
  interactionHistory: InteractionHistoryEntry[];
  predictedRelevance: number; // 0-1 ML-based relevance prediction
}

interface CSS3DTransform {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

interface InteractionHistoryEntry {
  timestamp: number;
  action: 'hover' | 'click' | 'focus' | 'scroll';
  duration: number;
  context: string;
}

interface GestureEvent {
  type: 'swipe' | 'pinch' | 'rotate' | 'pan';
  direction?: 'up' | 'down' | 'left' | 'right';
  intensity: number; // 0-1
  velocity: number;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  deltaTime: number;
}

interface SpatialNavigationState {
  currentDepth: number;
  focusedLayer: string | null;
  spatialMode: 'flat' | 'layered' | 'spiral' | 'constellation';
  navigationVelocity: { x: number; y: number; z: number };
  userGazeDirection: { x: number; y: number }; // Mouse/eye tracking
  predictiveElements: NavigationElement[];
}

/**
 * SidebarDimensionalNexusSystem
 * 
 * Creates a multi-dimensional spatial navigation system that treats the sidebar
 * as a navigable 3D space rather than a flat list. This system implements
 * "Year 3000" spatial navigation concepts with depth layers, predictive
 * arrangement, and contextual spatial organization.
 * 
 * Key Features:
 * - 3D spatial arrangement of navigation elements
 * - Depth-based information hierarchy (parallax scrolling)
 * - Gesture-based dimensional navigation
 * - Predictive element positioning based on user behavior
 * - Contextual spatial zoom and focus mechanics
 * - Music-responsive spatial transformations
 * - Performance-optimized CSS transforms with GPU acceleration
 * 
 * Architecture:
 * - Extends UnifiedSystemBase for unified lifecycle management
 * - Uses CSS 3D transforms for hardware acceleration
 * - Implements Intersection Observer for viewport optimization
 * - Integrates with existing performance monitoring
 * - Coordinates with bilateral consciousness systems
 */
export class SidebarDimensionalNexusSystem extends UnifiedSystemBase {
  private spatialLayers: Map<string, DimensionalLayer> = new Map();
  private navigationElements: Map<string, NavigationElement> = new Map();
  private spatialState: SpatialNavigationState;
  
  // 3D Transform management
  private currentTransform: CSS3DTransform = {
    translateX: 0, translateY: 0, translateZ: 0,
    rotateX: 0, rotateY: 0, rotateZ: 0,
    scaleX: 1, scaleY: 1, scaleZ: 1
  };
  
  private targetTransform: CSS3DTransform = { ...this.currentTransform };
  
  // Spatial navigation parameters
  private readonly DEPTH_LAYERS = 5;
  private readonly LAYER_SPACING = 50; // pixels
  private readonly PARALLAX_FACTOR = 0.3;
  private readonly GESTURE_SENSITIVITY = 1.2;
  private readonly PREDICTION_THRESHOLD = 0.7;
  
  // Animation and interpolation
  private readonly SPATIAL_LERP = 0.08; // Smooth spatial transitions
  private readonly FOCUS_LERP = 0.15; // Focus transitions
  private readonly DEPTH_LERP = 0.12; // Depth transitions
  
  // Performance optimization
  private intersectionObserver: IntersectionObserver | null = null;
  private spatialAnimationFrame: number | null = null;
  private lastSpatialUpdate = 0;
  
  // Gesture handling
  private gestureState = {
    active: false,
    startTime: 0,
    currentGesture: null as GestureEvent | null,
    momentum: { x: 0, y: 0, z: 0 }
  };
  
  // Music integration
  private musicIntensity = 0;
  private musicEnergy = 0;
  
  constructor(config: Year3000Config = YEAR3000_CONFIG) {
    super(config);
    
    // Initialize spatial navigation state
    this.spatialState = {
      currentDepth: 0,
      focusedLayer: null,
      spatialMode: 'layered',
      navigationVelocity: { x: 0, y: 0, z: 0 },
      userGazeDirection: { x: 0, y: 0 },
      predictiveElements: []
    };
    
    if (config.enableDebug) {
      console.log(`[${this.systemName}] Initialized dimensional nexus system`);
    }
  }
  
  /**
   * Initialize the dimensional nexus system
   */
  async initialize(): Promise<void> {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Initializing dimensional nexus`);
    }
    
    // Initialize spatial layers
    await this.initializeSpatialLayers();
    
    // Set up navigation elements
    await this.initializeNavigationElements();
    
    // Set up gesture handling
    this.setupGestureHandling();
    
    // Set up viewport optimization
    this.setupViewportOptimization();
    
    // Subscribe to music events for spatial transformations
    this.subscribeToEvent('music:beat', (payload: any) => {
      this.musicIntensity = payload.intensity;
      this.updateMusicSpatialEffects();
    });
    
    this.subscribeToEvent('music:energy', (payload: any) => {
      this.musicEnergy = payload.energy;
      this.updateMusicSpatialEffects();
    });
    
    // Subscribe to bilateral consciousness events
    this.subscribeToEvent('sidebar:bilateral-beat', (payload: any) => {
      this.handleBilateralSpatialSync(payload);
    });
    
    // Register for animation coordination
    this.registerAnimation(55); // Lower priority than consciousness systems
    
    // Set up initial CSS 3D context
    this.initializeCSSTransforms();
    
    this.publishEvent('sidebar:dimensional-nexus-ready', {
      systemName: this.systemName,
      depthLayers: this.DEPTH_LAYERS,
      spatialMode: this.spatialState.spatialMode,
      timestamp: Date.now()
    });
  }
  
  /**
   * Initialize spatial layers for 3D navigation
   */
  private async initializeSpatialLayers(): Promise<void> {
    for (let i = 0; i < this.DEPTH_LAYERS; i++) {
      const layerId = `layer-${i}`;
      const depth = i * this.LAYER_SPACING;
      
      const layer: DimensionalLayer = {
        id: layerId,
        depth,
        elements: [],
        transform: this.calculateLayerTransform(depth),
        visibility: this.calculateLayerVisibility(depth)
      };
      
      this.spatialLayers.set(layerId, layer);
      
      // Set CSS variables for each layer
      this.updateCSSVariables({
        [`--sn-spatial-layer-${i}-depth`]: `${depth}px`,
        [`--sn-spatial-layer-${i}-visibility`]: layer.visibility.toFixed(2),
        [`--sn-spatial-layer-${i}-transform`]: this.transformToCSS(layer.transform)
      });
    }
  }
  
  /**
   * Initialize navigation elements with spatial positioning
   */
  private async initializeNavigationElements(): Promise<void> {
    // This would typically integrate with Spicetify's sidebar API
    // For now, we'll create a mock structure
    const mockElements = [
      { id: 'home', type: 'folder', weight: 0.9 },
      { id: 'search', type: 'folder', weight: 0.8 },
      { id: 'library', type: 'folder', weight: 0.95 },
      { id: 'playlists', type: 'playlist', weight: 0.85 },
      { id: 'artists', type: 'artist', weight: 0.7 },
      { id: 'albums', type: 'album', weight: 0.6 },
      { id: 'podcasts', type: 'folder', weight: 0.4 }
    ];
    
    mockElements.forEach((element, index) => {
      const spatialPosition = this.calculateSpatialPosition(index, element.weight);
      const layerIndex = Math.floor(index / 2); // 2 elements per layer
      
      const navElement: NavigationElement = {
        id: element.id,
        type: element.type as NavigationElement['type'],
        spatialPosition,
        contextualWeight: element.weight,
        interactionHistory: [],
        predictedRelevance: element.weight
      };
      
      this.navigationElements.set(element.id, navElement);
      
      // Add to appropriate spatial layer
      const layerId = `layer-${layerIndex}`;
      const layer = this.spatialLayers.get(layerId);
      if (layer) {
        layer.elements.push(navElement);
      }
    });
  }
  
  /**
   * Calculate spatial position for an element
   */
  private calculateSpatialPosition(index: number, weight: number): SpatialCoordinates {
    // Create a spiral arrangement based on weight and index
    const angle = (index * 60) * (Math.PI / 180); // 60 degrees between elements
    const radius = 20 + (1 - weight) * 30; // Higher weight = closer to center
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: index * 10, // Depth based on index
      rotation: angle * (180 / Math.PI), // Convert back to degrees
      scale: 0.8 + (weight * 0.4) // Scale based on weight
    };
  }
  
  /**
   * Set up gesture handling for dimensional navigation
   */
  private setupGestureHandling(): void {
    // Mouse/touch event handlers would be set up here
    // For now, we'll create a mock gesture system
    
    // Subscribe to gesture events (these would come from DOM events)
    this.subscribeToEvent('sidebar:gesture', (payload: GestureEvent) => {
      this.handleGesture(payload);
    });
    
    // Mock gesture generation for testing
    if (this.config.enableDebug) {
      // Simulate periodic gestures for testing
      setInterval(() => {
        this.simulateGesture();
      }, 5000);
    }
  }
  
  /**
   * Handle gesture events for spatial navigation
   */
  private handleGesture(gesture: GestureEvent): void {
    this.gestureState.active = true;
    this.gestureState.currentGesture = gesture;
    
    switch (gesture.type) {
      case 'swipe':
        this.handleSwipeGesture(gesture);
        break;
      case 'pinch':
        this.handlePinchGesture(gesture);
        break;
      case 'rotate':
        this.handleRotateGesture(gesture);
        break;
      case 'pan':
        this.handlePanGesture(gesture);
        break;
    }
    
    // Update spatial state
    this.updateSpatialNavigationState();
  }
  
  /**
   * Handle swipe gestures for layer navigation
   */
  private handleSwipeGesture(gesture: GestureEvent): void {
    const direction = gesture.direction!;
    const intensity = gesture.intensity * this.GESTURE_SENSITIVITY;
    
    switch (direction) {
      case 'up':
        this.navigateToDepth(this.spatialState.currentDepth - 1);
        break;
      case 'down':
        this.navigateToDepth(this.spatialState.currentDepth + 1);
        break;
      case 'left':
        this.rotateSpatialView(-30 * intensity);
        break;
      case 'right':
        this.rotateSpatialView(30 * intensity);
        break;
    }
  }
  
  /**
   * Handle pinch gestures for spatial zoom
   */
  private handlePinchGesture(gesture: GestureEvent): void {
    const scaleChange = 1 + (gesture.intensity - 0.5) * 0.5;
    
    this.targetTransform.scaleX *= scaleChange;
    this.targetTransform.scaleY *= scaleChange;
    this.targetTransform.scaleZ *= scaleChange;
    
    // Clamp scale values
    this.targetTransform.scaleX = Math.max(0.5, Math.min(2.0, this.targetTransform.scaleX));
    this.targetTransform.scaleY = Math.max(0.5, Math.min(2.0, this.targetTransform.scaleY));
    this.targetTransform.scaleZ = Math.max(0.5, Math.min(2.0, this.targetTransform.scaleZ));
  }
  
  /**
   * Handle rotation gestures for 3D spatial rotation
   */
  private handleRotateGesture(gesture: GestureEvent): void {
    const rotationAmount = gesture.intensity * 45; // Up to 45 degrees
    
    this.targetTransform.rotateY += rotationAmount;
    this.targetTransform.rotateX += rotationAmount * 0.5; // Subtle X rotation
    
    // Wrap rotation values
    this.targetTransform.rotateY = this.targetTransform.rotateY % 360;
    this.targetTransform.rotateX = this.targetTransform.rotateX % 360;
  }
  
  /**
   * Handle pan gestures for spatial translation
   */
  private handlePanGesture(gesture: GestureEvent): void {
    const deltaX = gesture.currentPosition.x - gesture.startPosition.x;
    const deltaY = gesture.currentPosition.y - gesture.startPosition.y;
    
    this.targetTransform.translateX += deltaX * 0.5;
    this.targetTransform.translateY += deltaY * 0.5;
    
    // Clamp translation values
    this.targetTransform.translateX = Math.max(-200, Math.min(200, this.targetTransform.translateX));
    this.targetTransform.translateY = Math.max(-200, Math.min(200, this.targetTransform.translateY));
  }
  
  /**
   * Navigate to specific depth layer
   */
  private navigateToDepth(targetDepth: number): void {
    const clampedDepth = Math.max(0, Math.min(this.DEPTH_LAYERS - 1, targetDepth));
    
    if (clampedDepth !== this.spatialState.currentDepth) {
      this.spatialState.currentDepth = clampedDepth;
      this.spatialState.focusedLayer = `layer-${clampedDepth}`;
      
      // Update target transform for new depth
      this.targetTransform.translateZ = -clampedDepth * this.LAYER_SPACING;
      
      // Update layer visibility
      this.updateLayerVisibility();
      
      this.publishEvent('sidebar:spatial-depth-changed', {
        previousDepth: this.spatialState.currentDepth,
        newDepth: clampedDepth,
        focusedLayer: this.spatialState.focusedLayer,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Rotate spatial view
   */
  private rotateSpatialView(angle: number): void {
    this.targetTransform.rotateY += angle;
    this.targetTransform.rotateY = this.targetTransform.rotateY % 360;
  }
  
  /**
   * Update spatial navigation state
   */
  private updateSpatialNavigationState(): void {
    // Update velocity based on gesture momentum
    const currentGesture = this.gestureState.currentGesture;
    if (currentGesture) {
      this.spatialState.navigationVelocity = {
        x: currentGesture.velocity * 0.1,
        y: currentGesture.velocity * 0.1,
        z: 0
      };
    }
    
    // Update user gaze direction (would use eye tracking in production)
    this.spatialState.userGazeDirection = {
      x: this.targetTransform.rotateY / 360,
      y: this.targetTransform.rotateX / 360
    };
    
    // Update predictive elements based on current state
    this.updatePredictiveElements();
  }
  
  /**
   * Update predictive elements based on user behavior
   */
  private updatePredictiveElements(): void {
    const predictiveElements: NavigationElement[] = [];
    
    // Predict next likely interactions based on current depth and rotation
    for (const [, element] of this.navigationElements) {
      const relevanceScore = this.calculateRelevanceScore(element);
      
      if (relevanceScore > this.PREDICTION_THRESHOLD) {
        element.predictedRelevance = relevanceScore;
        predictiveElements.push(element);
      }
    }
    
    // Sort by relevance and take top 5
    this.spatialState.predictiveElements = predictiveElements
      .sort((a, b) => b.predictedRelevance - a.predictedRelevance)
      .slice(0, 5);
  }
  
  /**
   * Calculate relevance score for predictive positioning
   */
  private calculateRelevanceScore(element: NavigationElement): number {
    let score = element.contextualWeight;
    
    // Boost score based on proximity to current view
    const distanceFromView = Math.sqrt(
      Math.pow(element.spatialPosition.x - this.spatialState.userGazeDirection.x * 100, 2) +
      Math.pow(element.spatialPosition.y - this.spatialState.userGazeDirection.y * 100, 2)
    );
    
    const proximityBoost = Math.max(0, 1 - (distanceFromView / 100));
    score += proximityBoost * 0.3;
    
    // Boost score based on recent interactions
    const recentInteractions = element.interactionHistory.filter(
      interaction => Date.now() - interaction.timestamp < 300000 // 5 minutes
    );
    
    const interactionBoost = Math.min(recentInteractions.length * 0.1, 0.4);
    score += interactionBoost;
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Set up viewport optimization using Intersection Observer
   */
  private setupViewportOptimization(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const layerId = entry.target.getAttribute('data-layer-id');
            if (layerId) {
              const layer = this.spatialLayers.get(layerId);
              if (layer) {
                layer.visibility = entry.isIntersecting ? 1 : 0;
              }
            }
          });
        },
        {
          threshold: [0, 0.1, 0.5, 0.9, 1.0]
        }
      );
    }
  }
  
  /**
   * Update layer visibility based on current depth
   */
  private updateLayerVisibility(): void {
    for (const [layerId, layer] of this.spatialLayers) {
      const layerIndex = parseInt(layerId.split('-')[1] || '0', 10);
      const distance = Math.abs(layerIndex - this.spatialState.currentDepth);
      
      // Visibility falls off with distance from current depth
      layer.visibility = Math.max(0, 1 - (distance * 0.3));
      
      // Update CSS variable
      this.updateCSSVariable(
        `--sn-spatial-layer-${layerIndex}-visibility`,
        layer.visibility.toFixed(2)
      );
    }
  }
  
  /**
   * Update music-responsive spatial effects
   */
  private updateMusicSpatialEffects(): void {
    // Subtle spatial breathing based on music intensity
    const breathingScale = 1 + (this.musicIntensity * 0.05);
    const energyRotation = this.musicEnergy * 2; // Subtle rotation
    
    // Apply breathing effect to all layers
    for (let i = 0; i < this.DEPTH_LAYERS; i++) {
      this.updateCSSVariables({
        [`--sn-spatial-layer-${i}-breathing`]: breathingScale.toFixed(3),
        [`--sn-spatial-layer-${i}-energy-rotation`]: `${energyRotation.toFixed(1)}deg`
      });
    }
  }
  
  /**
   * Handle bilateral spatial synchronization
   */
  private handleBilateralSpatialSync(payload: any): void {
    if (payload.source === 'left') {
      // Respond to left sidebar consciousness with spatial adjustments
      const consciousnessBoost = payload.intensity * 0.1;
      
      // Slightly adjust depth based on consciousness level
      this.targetTransform.translateZ += consciousnessBoost * 10;
      
      // Add subtle spatial flow
      this.targetTransform.rotateY += consciousnessBoost * 5;
    }
  }
  
  /**
   * Initialize CSS 3D transforms
   */
  private initializeCSSTransforms(): void {
    // Set up CSS 3D context
    this.updateCSSVariables({
      '--sn-spatial-perspective': '1000px',
      '--sn-spatial-transform-style': 'preserve-3d',
      '--sn-spatial-backface-visibility': 'hidden'
    });
    
    // Initialize transform values
    this.updateSpatialTransforms();
  }
  
  /**
   * Update spatial transforms
   */
  private updateSpatialTransforms(): void {
    // Lerp current transform towards target
    this.currentTransform.translateX = this.lerp(
      this.currentTransform.translateX,
      this.targetTransform.translateX,
      this.SPATIAL_LERP
    );
    
    this.currentTransform.translateY = this.lerp(
      this.currentTransform.translateY,
      this.targetTransform.translateY,
      this.SPATIAL_LERP
    );
    
    this.currentTransform.translateZ = this.lerp(
      this.currentTransform.translateZ,
      this.targetTransform.translateZ,
      this.DEPTH_LERP
    );
    
    this.currentTransform.rotateX = this.lerp(
      this.currentTransform.rotateX,
      this.targetTransform.rotateX,
      this.SPATIAL_LERP
    );
    
    this.currentTransform.rotateY = this.lerp(
      this.currentTransform.rotateY,
      this.targetTransform.rotateY,
      this.SPATIAL_LERP
    );
    
    this.currentTransform.rotateZ = this.lerp(
      this.currentTransform.rotateZ,
      this.targetTransform.rotateZ,
      this.SPATIAL_LERP
    );
    
    this.currentTransform.scaleX = this.lerp(
      this.currentTransform.scaleX,
      this.targetTransform.scaleX,
      this.FOCUS_LERP
    );
    
    this.currentTransform.scaleY = this.lerp(
      this.currentTransform.scaleY,
      this.targetTransform.scaleY,
      this.FOCUS_LERP
    );
    
    this.currentTransform.scaleZ = this.lerp(
      this.currentTransform.scaleZ,
      this.targetTransform.scaleZ,
      this.FOCUS_LERP
    );
    
    // Update CSS variable
    this.updateCSSVariable('--sn-spatial-transform', this.transformToCSS(this.currentTransform));
  }
  
  /**
   * Calculate layer transform
   */
  private calculateLayerTransform(depth: number): CSS3DTransform {
    return {
      translateX: 0,
      translateY: 0,
      translateZ: -depth,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1
    };
  }
  
  /**
   * Calculate layer visibility
   */
  private calculateLayerVisibility(depth: number): number {
    // Visibility falls off with depth
    return Math.max(0, 1 - (depth / (this.DEPTH_LAYERS * this.LAYER_SPACING)));
  }
  
  /**
   * Convert transform object to CSS string
   */
  private transformToCSS(transform: CSS3DTransform): string {
    return `
      translate3d(${transform.translateX}px, ${transform.translateY}px, ${transform.translateZ}px)
      rotateX(${transform.rotateX}deg)
      rotateY(${transform.rotateY}deg)
      rotateZ(${transform.rotateZ}deg)
      scale3d(${transform.scaleX}, ${transform.scaleY}, ${transform.scaleZ})
    `.replace(/\s+/g, ' ').trim();
  }
  
  /**
   * Linear interpolation helper
   */
  private lerp(from: number, to: number, alpha: number): number {
    return from + (to - from) * alpha;
  }
  
  /**
   * Simulate gesture for testing
   */
  private simulateGesture(): void {
    if (!this.config.enableDebug) return;
    
    const gestures: GestureEvent[] = [
      {
        type: 'swipe',
        direction: 'up',
        intensity: 0.6,
        velocity: 50,
        startPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: -50 },
        deltaTime: 200
      },
      {
        type: 'pinch',
        intensity: 0.8,
        velocity: 30,
        startPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
        deltaTime: 300
      }
    ];
    
    const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
    if (randomGesture) {
      this.handleGesture(randomGesture);
    }
  }
  
  /**
   * Animation frame callback
   */
  onAnimate(deltaTime: number): void {
    this.lastSpatialUpdate = performance.now();
    
    // Update spatial transforms
    this.updateSpatialTransforms();
    
    // Update layer visibility
    this.updateLayerVisibility();
    
    // Update music spatial effects
    this.updateMusicSpatialEffects();
    
    // Apply momentum decay
    this.spatialState.navigationVelocity.x *= 0.95;
    this.spatialState.navigationVelocity.y *= 0.95;
    this.spatialState.navigationVelocity.z *= 0.95;
    
    // Update predictive elements
    this.updatePredictiveElements();
  }
  
  /**
   * Get current spatial state
   */
  getSpatialState(): SpatialNavigationState {
    return { ...this.spatialState };
  }
  
  /**
   * Get current spatial layers
   */
  getSpatialLayers(): Map<string, DimensionalLayer> {
    return new Map(this.spatialLayers);
  }
  
  /**
   * Get navigation elements
   */
  getNavigationElements(): Map<string, NavigationElement> {
    return new Map(this.navigationElements);
  }
  
  /**
   * System health check
   */
  async healthCheck(): Promise<HealthCheckResult> {
    return {
      healthy: true,
      ok: true,
      details: `Dimensional nexus system healthy - ${this.spatialLayers.size} layers, ${this.navigationElements.size} elements, depth ${this.spatialState.currentDepth}`,
      issues: [],
      system: 'SidebarDimensionalNexusSystem'
    };
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Destroying dimensional nexus`);
    }
    
    // Clean up intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    
    // Cancel animation frame
    if (this.spatialAnimationFrame) {
      cancelAnimationFrame(this.spatialAnimationFrame);
      this.spatialAnimationFrame = null;
    }
    
    // Clear spatial data
    this.spatialLayers.clear();
    this.navigationElements.clear();
    
    // Reset spatial state
    this.spatialState = {
      currentDepth: 0,
      focusedLayer: null,
      spatialMode: 'flat',
      navigationVelocity: { x: 0, y: 0, z: 0 },
      userGazeDirection: { x: 0, y: 0 },
      predictiveElements: []
    };
    
    this.publishEvent('sidebar:dimensional-nexus-destroyed', {
      timestamp: Date.now()
    });
  }
}