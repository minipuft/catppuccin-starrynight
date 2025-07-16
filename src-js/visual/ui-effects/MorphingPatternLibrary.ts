/**
 * MorphingPatternLibrary - Semantic morphing patterns for Year 3000 System
 * 
 * Purpose: Provide meaningful morphing patterns that serve specific UX purposes
 * rather than random decorative effects. Each pattern amplifies human agency.
 * 
 * Philosophy: "Kinetic Verbs" - Animations that ripple, oscillate, bloom, 
 * refract, and harmonize to guide user attention and provide feedback.
 */

export interface MorphingPattern {
  name: string;
  purpose: string;
  render: (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options?: any
  ) => void;
}

export interface PatternOptions {
  color?: string;
  opacity?: number;
  size?: number;
  speed?: number;
  musicSync?: boolean;
  accessibility?: boolean;
}

export class MorphingPatternLibrary {
  private patterns: Map<string, MorphingPattern> = new Map();
  private patternCache: Map<string, {
    cachedPattern: ImageData | null;
    lastParams: string;
    expiry: number;
  }> = new Map();
  private objectPool: {
    imageDataPool: ImageData[];
    tempCanvasPool: HTMLCanvasElement[];
    contextPool: CanvasRenderingContext2D[];
  } = {
    imageDataPool: [],
    tempCanvasPool: [],
    contextPool: []
  };
  
  private readonly CACHE_EXPIRY = 5000; // 5 seconds
  private readonly MAX_POOL_SIZE = 10;
  
  constructor() {
    this._initializePatterns();
    this._initializeObjectPool();
  }
  
  private _initializeObjectPool(): void {
    // Pre-create reusable objects for performance
    for (let i = 0; i < this.MAX_POOL_SIZE; i++) {
      // Create temp canvases
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const context = canvas.getContext('2d');
      
      if (context) {
        this.objectPool.tempCanvasPool.push(canvas);
        this.objectPool.contextPool.push(context);
        
        // Create ImageData for caching
        const imageData = context.createImageData(200, 200);
        this.objectPool.imageDataPool.push(imageData);
      }
    }
  }
  
  private _getTempCanvas(width: number, height: number): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } {
    let canvas = this.objectPool.tempCanvasPool.pop();
    let context = this.objectPool.contextPool.pop();
    
    if (!canvas || !context) {
      // Create new if pool is empty
      canvas = document.createElement('canvas');
      context = canvas.getContext('2d')!;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    return { canvas, context };
  }
  
  private _returnTempCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
    if (this.objectPool.tempCanvasPool.length < this.MAX_POOL_SIZE) {
      this.objectPool.tempCanvasPool.push(canvas);
      this.objectPool.contextPool.push(context);
    }
  }
  
  private _generateCacheKey(patternName: string, x: number, y: number, intensity: number, time: number, options?: PatternOptions): string {
    const timeKey = Math.floor(time / 100) * 100; // Cache for 100ms intervals
    const intensityKey = Math.round(intensity * 10) / 10; // Round to 1 decimal
    const optionsKey = options ? JSON.stringify(options) : '';
    return `${patternName}_${x}_${y}_${intensityKey}_${timeKey}_${optionsKey}`;
  }
  
  private _getCachedPattern(cacheKey: string): ImageData | null {
    const cached = this.patternCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.cachedPattern;
    }
    
    // Clean expired cache
    if (cached && cached.expiry <= Date.now()) {
      this.patternCache.delete(cacheKey);
    }
    
    return null;
  }
  
  private _setCachedPattern(cacheKey: string, imageData: ImageData): void {
    // Limit cache size
    if (this.patternCache.size > 50) {
      // Remove oldest entries
      const entries = Array.from(this.patternCache.entries());
      entries.sort((a, b) => a[1].expiry - b[1].expiry);
      for (let i = 0; i < 10; i++) {
        this.patternCache.delete(entries[i][0]);
      }
    }
    
    this.patternCache.set(cacheKey, {
      cachedPattern: imageData,
      lastParams: cacheKey,
      expiry: Date.now() + this.CACHE_EXPIRY
    });
  }
  
  private _initializePatterns(): void {
    // Focus Flow - Gentle liquid flow toward focused elements
    this.patterns.set('focus-flow', {
      name: 'Focus Flow',
      purpose: 'Guide user attention to focused interactive elements',
      render: this._renderFocusFlow.bind(this),
    });
    
    // Beat Pulse - Music-synchronized morphing pulses
    this.patterns.set('beat-pulse', {
      name: 'Beat Pulse',
      purpose: 'Provide rhythmic feedback synchronized with music',
      render: this._renderBeatPulse.bind(this),
    });
    
    // Interaction Ripple - User action feedback
    this.patterns.set('interaction-ripple', {
      name: 'Interaction Ripple',
      purpose: 'Provide immediate feedback for user interactions',
      render: this._renderInteractionRipple.bind(this),
    });
    
    // Loading Pulse - Loading state indication
    this.patterns.set('loading-pulse', {
      name: 'Loading Pulse',
      purpose: 'Indicate system processing or loading states',
      render: this._renderLoadingPulse.bind(this),
    });
    
    // Attention Trail - Subtle guidance toward clickable elements
    this.patterns.set('attention-trail', {
      name: 'Attention Trail',
      purpose: 'Guide user attention to available interaction opportunities',
      render: this._renderAttentionTrail.bind(this),
    });
    
    // Harmony Bloom - Emotional response to music valence
    this.patterns.set('harmony-bloom', {
      name: 'Harmony Bloom',
      purpose: 'Reflect musical emotional content through visual blooming',
      render: this._renderHarmonyBloom.bind(this),
    });
    
    // Energy Ripple - High-energy music visualization
    this.patterns.set('energy-ripple', {
      name: 'Energy Ripple',
      purpose: 'Visualize high-energy musical moments',
      render: this._renderEnergyRipple.bind(this),
    });
    
    // Calm Flow - Low-energy, meditative visualization
    this.patterns.set('calm-flow', {
      name: 'Calm Flow',
      purpose: 'Provide gentle, meditative visual flow for calm music',
      render: this._renderCalmFlow.bind(this),
    });
  }
  
  public getPattern(name: string): MorphingPattern | undefined {
    return this.patterns.get(name);
  }
  
  public getAllPatterns(): MorphingPattern[] {
    return Array.from(this.patterns.values());
  }
  
  public renderPattern(
    name: string,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options: PatternOptions = {}
  ): boolean {
    const pattern = this.patterns.get(name);
    if (!pattern) return false;
    
    // Respect accessibility preferences
    if (options.accessibility && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    
    // Generate cache key for this pattern
    const cacheKey = this._generateCacheKey(name, x, y, intensity, time, options);
    
    // Try to use cached pattern first
    const cachedPattern = this._getCachedPattern(cacheKey);
    if (cachedPattern && options.size && options.size <= 200) {
      // Use cached pattern for small patterns
      try {
        context.putImageData(cachedPattern, x - (options.size / 2), y - (options.size / 2));
        return true;
      } catch (error) {
        // Fallback to rendering if cache fails
      }
    }
    
    try {
      // For cacheable patterns (small, repeated), render to temp canvas first
      if (options.size && options.size <= 200 && this._shouldCachePattern(name, intensity)) {
        const { canvas: tempCanvas, context: tempContext } = this._getTempCanvas(options.size, options.size);
        
        // Clear temp canvas
        tempContext.clearRect(0, 0, options.size, options.size);
        
        // Render pattern to temp canvas
        pattern.render(tempContext, options.size / 2, options.size / 2, intensity, time, options);
        
        // Cache the result
        const imageData = tempContext.getImageData(0, 0, options.size, options.size);
        this._setCachedPattern(cacheKey, imageData);
        
        // Draw cached pattern to main canvas
        context.putImageData(imageData, x - (options.size / 2), y - (options.size / 2));
        
        // Return temp canvas to pool
        this._returnTempCanvas(tempCanvas, tempContext);
      } else {
        // Render directly for large or non-cacheable patterns
        pattern.render(context, x, y, intensity, time, options);
      }
      
      return true;
    } catch (error) {
      console.warn(`[MorphingPatternLibrary] Error rendering pattern '${name}':`, error);
      return false;
    }
  }
  
  private _shouldCachePattern(patternName: string, intensity: number): boolean {
    // Cache patterns that are frequently repeated or computationally expensive
    const cacheablePatterns = ['interaction-ripple', 'beat-pulse', 'focus-flow'];
    return cacheablePatterns.includes(patternName) && intensity > 0.1;
  }
  
  public clearCache(): void {
    this.patternCache.clear();
  }
  
  public getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.patternCache.size,
      hitRate: 0 // TODO: Implement hit rate tracking
    };
  }
  
  public destroy(): void {
    this.clearCache();
    this.objectPool.imageDataPool = [];
    this.objectPool.tempCanvasPool = [];
    this.objectPool.contextPool = [];
  }
  
  // Pattern Implementations
  
  private _renderFocusFlow(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options: PatternOptions = {}
  ): void {
    const { color = 'rgba(var(--sn-accent-rgb), 0.3)', size = 50, speed = 1 } = options;
    
    // Create gentle flowing lines that guide attention
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.lineCap = 'round';
    
    // Create flowing curves that breathe with intensity
    const radius = size * intensity;
    const offset = Math.sin(time * speed * 0.001) * 10;
    
    context.moveTo(x - radius, y + offset);
    context.quadraticCurveTo(x, y - radius + offset, x + radius, y + offset);
    context.quadraticCurveTo(x, y + radius + offset, x - radius, y + offset);
    
    context.stroke();
  }
  
  private _renderBeatPulse(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options: PatternOptions = {}
  ): void {
    const { color = 'rgba(var(--sn-accent-rgb), 0.2)', size = 100 } = options;
    
    // Create rhythmic pulse that syncs with music
    const pulseRadius = size * intensity;
    const pulseOpacity = Math.max(0.1, intensity * 0.5);
    
    context.beginPath();
    context.arc(x, y, pulseRadius, 0, Math.PI * 2);
    context.fillStyle = color.replace(/[\d.]+\)$/, `${pulseOpacity})`);
    context.fill();
    
    // Add outer ring for emphasis
    context.beginPath();
    context.arc(x, y, pulseRadius * 1.2, 0, Math.PI * 2);
    context.strokeStyle = color.replace(/[\d.]+\)$/, `${pulseOpacity * 0.5})`);
    context.lineWidth = 1;
    context.stroke();
  }
  
  private _renderInteractionRipple(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options: PatternOptions = {}
  ): void {
    const { color = 'rgba(var(--sn-accent-rgb), 0.4)', size = 80, speed = 2 } = options;
    
    // Create expanding ripple for interaction feedback
    const rippleProgress = (time * speed * 0.001) % 1;
    const rippleRadius = size * rippleProgress;
    const rippleOpacity = Math.max(0, (1 - rippleProgress) * intensity);
    
    context.beginPath();
    context.arc(x, y, rippleRadius, 0, Math.PI * 2);
    context.strokeStyle = color.replace(/[\d.]+\)$/, `${rippleOpacity})`);
    context.lineWidth = 3;
    context.stroke();
    
    // Add secondary ripple for depth
    if (rippleProgress > 0.3) {
      const secondaryRadius = size * (rippleProgress - 0.3);
      const secondaryOpacity = Math.max(0, (0.7 - rippleProgress) * intensity * 0.5);
      
      context.beginPath();
      context.arc(x, y, secondaryRadius, 0, Math.PI * 2);
      context.strokeStyle = color.replace(/[\d.]+\)$/, `${secondaryOpacity})`);
      context.lineWidth = 2;
      context.stroke();
    }
  }
  
  private _renderLoadingPulse(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options: PatternOptions = {}
  ): void {
    const { color = 'rgba(var(--sn-accent-rgb), 0.3)', size = 40, speed = 1.5 } = options;
    
    // Create steady pulsing for loading indication
    const pulsePhase = Math.sin(time * speed * 0.003) * 0.5 + 0.5;
    const pulseRadius = size * (0.5 + pulsePhase * 0.5) * intensity;
    const pulseOpacity = (0.3 + pulsePhase * 0.4) * intensity;
    
    context.beginPath();
    context.arc(x, y, pulseRadius, 0, Math.PI * 2);
    context.fillStyle = color.replace(/[\d.]+\)$/, `${pulseOpacity})`);
    context.fill();
    
    // Add inner glow
    context.beginPath();
    context.arc(x, y, pulseRadius * 0.6, 0, Math.PI * 2);
    context.fillStyle = color.replace(/[\d.]+\)$/, `${pulseOpacity * 0.6})`);
    context.fill();
  }
  
  private _renderAttentionTrail(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options: PatternOptions = {}
  ): void {
    const { color = 'rgba(var(--sn-accent-rgb), 0.2)', size = 30, speed = 1 } = options;
    
    // Create subtle trail that guides attention
    const trailLength = 5;
    const trailSpacing = size * 0.3;
    
    for (let i = 0; i < trailLength; i++) {
      const trailProgress = (time * speed * 0.002 + i * 0.2) % 1;
      const trailX = x + Math.cos(trailProgress * Math.PI * 2) * trailSpacing * i;
      const trailY = y + Math.sin(trailProgress * Math.PI * 2) * trailSpacing * i;
      const trailOpacity = Math.max(0, (1 - i / trailLength) * intensity * 0.3);
      const trailSize = size * (1 - i / trailLength) * 0.3;
      
      context.beginPath();
      context.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
      context.fillStyle = color.replace(/[\d.]+\)$/, `${trailOpacity})`);
      context.fill();
    }
  }
  
  private _renderHarmonyBloom(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options: PatternOptions = {}
  ): void {
    const { color = 'rgba(var(--sn-accent-rgb), 0.25)', size = 60, speed = 0.8 } = options;
    
    // Create organic blooming pattern for positive valence
    const bloomPhase = Math.sin(time * speed * 0.001) * 0.5 + 0.5;
    const petalCount = 6;
    
    context.beginPath();
    context.fillStyle = color.replace(/[\d.]+\)$/, `${intensity * 0.4})`);
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalRadius = size * intensity * (0.7 + bloomPhase * 0.3);
      const petalX = x + Math.cos(angle) * petalRadius * 0.6;
      const petalY = y + Math.sin(angle) * petalRadius * 0.6;
      
      context.moveTo(x, y);
      context.arc(petalX, petalY, petalRadius * 0.3, 0, Math.PI * 2);
    }
    
    context.fill();
  }
  
  private _renderEnergyRipple(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options: PatternOptions = {}
  ): void {
    const { color = 'rgba(var(--sn-accent-rgb), 0.3)', size = 100, speed = 3 } = options;
    
    // Create high-energy ripple pattern
    const rippleCount = 3;
    
    for (let i = 0; i < rippleCount; i++) {
      const ripplePhase = (time * speed * 0.002 + i * 0.33) % 1;
      const rippleRadius = size * ripplePhase * intensity;
      const rippleOpacity = Math.max(0, (1 - ripplePhase) * intensity * 0.5);
      
      context.beginPath();
      context.arc(x, y, rippleRadius, 0, Math.PI * 2);
      context.strokeStyle = color.replace(/[\d.]+\)$/, `${rippleOpacity})`);
      context.lineWidth = 2 + intensity * 2;
      context.stroke();
    }
  }
  
  private _renderCalmFlow(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number,
    options: PatternOptions = {}
  ): void {
    const { color = 'rgba(var(--sn-accent-rgb), 0.15)', size = 80, speed = 0.5 } = options;
    
    // Create gentle, meditative flow
    const flowPhase = time * speed * 0.0005;
    const waveCount = 3;
    
    context.beginPath();
    context.strokeStyle = color.replace(/[\d.]+\)$/, `${intensity * 0.3})`);
    context.lineWidth = 1.5;
    context.lineCap = 'round';
    
    for (let i = 0; i < waveCount; i++) {
      const waveOffset = i * (Math.PI * 2 / waveCount);
      const waveRadius = size * intensity * 0.8;
      const waveX = x + Math.cos(flowPhase + waveOffset) * waveRadius;
      const waveY = y + Math.sin(flowPhase + waveOffset) * waveRadius;
      
      if (i === 0) {
        context.moveTo(waveX, waveY);
      } else {
        context.lineTo(waveX, waveY);
      }
    }
    
    context.stroke();
  }
}