import type { CinematicPalette, MusicEmotion, BeatData, RGB, BiologicalConsciousnessManager } from '@/types/colorStubs'

export interface HolographicState {
  flickerIntensity: number      // 0-1 holographic flicker intensity
  transparency: number          // 0-1 overall transparency
  chromatic: number             // 0-1 chromatic aberration strength
  scanlineIntensity: number     // 0-1 scanline visibility
  dataStreamFlow: number        // 0-1 data stream animation speed
  interferenceLevel: number     // 0-1 interference pattern strength
  energyStability: number       // 0-1 energy stability (affects flicker)
  projectionDistance: number    // 0-1 perceived projection distance
}

export interface HolographicElement {
  id: string
  element: HTMLElement
  originalStyles: CSSStyleDeclaration
  holographicType: HolographicType
  intensity: number
  isActive: boolean
  lastUpdate: number
  animation: Animation | null
  consciousnessLevel: number    // 0-1 consciousness influence
  organicIntegration: boolean   // Whether element has organic integration
}

export type HolographicType = 
  | 'translucent_panel'
  | 'data_stream'
  | 'energy_barrier'
  | 'consciousness_interface'
  | 'organic_hologram'
  | 'musical_visualization'
  | 'scanline_overlay'
  | 'chromatic_ghost'

export interface ScanlineEffect {
  frequency: number             // Scanlines per pixel
  opacity: number               // Scanline opacity
  animation: boolean            // Whether scanlines animate
  speed: number                 // Animation speed
  organic: boolean              // Whether scanlines follow organic patterns
}

export interface ChromaticAberration {
  offsetX: number               // Horizontal chromatic offset
  offsetY: number               // Vertical chromatic offset
  redChannel: number            // Red channel shift
  greenChannel: number          // Green channel shift
  blueChannel: number           // Blue channel shift
  intensity: number             // Overall aberration intensity
}

export interface DataStream {
  characters: string[]          // Characters for data stream
  speed: number                 // Stream speed
  density: number               // Character density
  organic: boolean              // Whether stream follows organic patterns
  consciousness: boolean        // Whether stream reflects consciousness
  musicalSync: boolean          // Whether stream syncs with music
}

export interface InterferencePattern {
  frequency: number             // Interference frequency
  amplitude: number             // Interference amplitude
  phase: number                 // Current phase
  organic: boolean              // Whether interference follows organic patterns
  type: 'wave' | 'noise' | 'grid' | 'organic'
}

/**
 * HolographicUISystem - Translucent holographic interface elements
 * 
 * This system creates futuristic holographic UI elements that:
 * - Transform regular UI elements into holographic projections
 * - Add scanlines, chromatic aberration, and interference patterns
 * - Create data streams and energy barriers
 * - Sync with music and consciousness for dynamic effects
 * - Maintain Star Wars and Blade Runner holographic aesthetics
 */
export class HolographicUISystem {
  private manager: BiologicalConsciousnessManager
  private holographicState: HolographicState
  private holographicElements: Map<string, HolographicElement> = new Map()
  private interfaceContainer: HTMLElement | null = null
  private scanlineOverlay: HTMLElement | null = null
  private chromaticCanvas: HTMLCanvasElement | null = null
  private dataStreamCanvas: HTMLCanvasElement | null = null
  private isInitialized = false
  private isEnabled = true
  
  // Holographic effects
  private scanlineEffect: ScanlineEffect
  private chromaticAberration: ChromaticAberration
  private dataStream: DataStream
  private interferencePattern: InterferencePattern
  
  // Performance metrics
  private performanceMetrics = {
    elementsProcessed: 0,
    effectsApplied: 0,
    averageProcessingTime: 0,
    memoryUsage: 0,
    lastUpdate: 0
  }
  
  // Animation state
  private animationState = {
    lastFrameTime: 0,
    flickerPhase: 0,
    scanlinePhase: 0,
    chromaticPhase: 0,
    dataStreamPhase: 0,
    interferencePhase: 0,
    organicPhase: 0,
    isAnimating: false
  }
  
  // Holographic presets
  private holographicPresets = {
    'star-wars': {
      flickerIntensity: 0.4,
      transparency: 0.8,
      chromatic: 0.3,
      scanlineIntensity: 0.6,
      dataStreamFlow: 0.5,
      interferenceLevel: 0.2,
      energyStability: 0.7,
      projectionDistance: 0.8
    },
    'blade-runner': {
      flickerIntensity: 0.6,
      transparency: 0.7,
      chromatic: 0.5,
      scanlineIntensity: 0.8,
      dataStreamFlow: 0.8,
      interferenceLevel: 0.4,
      energyStability: 0.6,
      projectionDistance: 0.6
    },
    'organic-consciousness': {
      flickerIntensity: 0.3,
      transparency: 0.9,
      chromatic: 0.2,
      scanlineIntensity: 0.4,
      dataStreamFlow: 0.6,
      interferenceLevel: 0.3,
      energyStability: 0.8,
      projectionDistance: 0.9
    }
  }

  constructor(manager: BiologicalConsciousnessManager) {
    this.manager = manager
    
    // Initialize holographic state
    this.holographicState = {
      flickerIntensity: 0.4,
      transparency: 0.8,
      chromatic: 0.3,
      scanlineIntensity: 0.6,
      dataStreamFlow: 0.5,
      interferenceLevel: 0.2,
      energyStability: 0.7,
      projectionDistance: 0.8
    }
    
    // Initialize effects
    this.scanlineEffect = {
      frequency: 4,
      opacity: 0.1,
      animation: true,
      speed: 0.5,
      organic: false
    }
    
    this.chromaticAberration = {
      offsetX: 2,
      offsetY: 1,
      redChannel: 0.5,
      greenChannel: 0.0,
      blueChannel: -0.5,
      intensity: 0.3
    }
    
    this.dataStream = {
      characters: ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      speed: 0.5,
      density: 0.3,
      organic: false,
      consciousness: true,
      musicalSync: true
    }
    
    this.interferencePattern = {
      frequency: 0.1,
      amplitude: 0.05,
      phase: 0,
      organic: false,
      type: 'wave'
    }
  }

  // Initialize holographic UI system
  public async initialize(): Promise<void> {
    if (this.isInitialized) return
    
    try {
      // Create interface container
      await this.createInterfaceContainer()
      
      // Create scanline overlay
      await this.createScanlineOverlay()
      
      // Create chromatic aberration canvas
      await this.createChromaticCanvas()
      
      // Create data stream canvas
      await this.createDataStreamCanvas()
      
      // Initialize holographic elements
      await this.initializeHolographicElements()
      
      // Start holographic animation
      this.startHolographicAnimation()
      
      this.isInitialized = true
      
      console.log('[HolographicUISystem] Initialized holographic interface system')
      
    } catch (error) {
      console.error('[HolographicUISystem] Failed to initialize:', error)
      throw error
    }
  }

  // Update holographic effects from music
  public async updateFromMusic(
    emotion: MusicEmotion,
    beat: BeatData,
    palette: CinematicPalette
  ): Promise<void> {
    if (!this.isInitialized || !this.isEnabled) return
    
    const startTime = performance.now()
    
    try {
      // Update holographic state based on music
      this.updateHolographicState(emotion, beat)
      
      // Update holographic effects
      this.updateHolographicEffects(emotion, beat, palette)
      
      // Update element appearances
      await this.updateElementAppearances()
      
      // Update performance metrics
      const processingTime = performance.now() - startTime
      this.updatePerformanceMetrics(processingTime)
      
    } catch (error) {
      console.error('[HolographicUISystem] Error updating from music:', error)
    }
  }

  // Update holographic state from music
  private updateHolographicState(emotion: MusicEmotion, beat: BeatData): void {
    // Update flicker intensity based on beat and emotion
    const targetFlicker = 0.2 + (emotion.intensity * 0.5) + (beat.strength * 0.3)
    this.holographicState.flickerIntensity = this.smoothTransition(
      this.holographicState.flickerIntensity,
      targetFlicker,
      0.1
    )
    
    // Update transparency based on valence
    const targetTransparency = 0.6 + (emotion.valence * 0.4)
    this.holographicState.transparency = this.smoothTransition(
      this.holographicState.transparency,
      targetTransparency,
      0.05
    )
    
    // Update chromatic aberration based on arousal
    const targetChromatic = 0.1 + ((emotion.arousal || 0.5) * 0.4)
    this.holographicState.chromatic = this.smoothTransition(
      this.holographicState.chromatic,
      targetChromatic,
      0.08
    )
    
    // Update scanline intensity based on energy
    const targetScanlines = 0.3 + (emotion.intensity * 0.5)
    this.holographicState.scanlineIntensity = this.smoothTransition(
      this.holographicState.scanlineIntensity,
      targetScanlines,
      0.06
    )
    
    // Update data stream flow based on tempo
    const consciousnessState = this.manager.getConsciousnessState()
    const targetDataFlow = 0.3 + (consciousnessState.symbioticResonance * 0.7)
    this.holographicState.dataStreamFlow = this.smoothTransition(
      this.holographicState.dataStreamFlow,
      targetDataFlow,
      0.04
    )
    
    // Update interference based on consciousness
    const targetInterference = 0.1 + (consciousnessState.membraneFluidityIndex * 0.3)
    this.holographicState.interferenceLevel = this.smoothTransition(
      this.holographicState.interferenceLevel,
      targetInterference,
      0.03
    )
    
    // Update energy stability (inverse of intensity for more chaos)
    const targetStability = 1.0 - (emotion.intensity * 0.4)
    this.holographicState.energyStability = this.smoothTransition(
      this.holographicState.energyStability,
      targetStability,
      0.02
    )
  }

  // Update holographic effects
  private updateHolographicEffects(emotion: MusicEmotion, beat: BeatData, palette: CinematicPalette): void {
    // Update scanline effect
    this.scanlineEffect.frequency = 2 + (this.holographicState.scanlineIntensity * 6)
    this.scanlineEffect.opacity = this.holographicState.scanlineIntensity * 0.15
    this.scanlineEffect.speed = 0.3 + (this.holographicState.dataStreamFlow * 0.7)
    this.scanlineEffect.organic = this.holographicState.energyStability > 0.7
    
    // Update chromatic aberration
    this.chromaticAberration.intensity = this.holographicState.chromatic
    this.chromaticAberration.offsetX = this.holographicState.chromatic * 3
    this.chromaticAberration.offsetY = this.holographicState.chromatic * 2
    
    // Update data stream
    this.dataStream.speed = 0.2 + (this.holographicState.dataStreamFlow * 0.8)
    this.dataStream.density = 0.2 + (this.holographicState.dataStreamFlow * 0.6)
    this.dataStream.organic = this.holographicState.energyStability > 0.6
    
    // Update interference pattern
    this.interferencePattern.frequency = 0.05 + (this.holographicState.interferenceLevel * 0.15)
    this.interferencePattern.amplitude = this.holographicState.interferenceLevel * 0.1
    this.interferencePattern.organic = this.holographicState.energyStability > 0.5
    
    // Update type based on emotion
    if (emotion.type === 'ambient') {
      this.interferencePattern.type = 'organic'
    } else if (emotion.intensity > 0.7) {
      this.interferencePattern.type = 'noise'
    } else {
      this.interferencePattern.type = 'wave'
    }
  }

  // Update element appearances
  private async updateElementAppearances(): Promise<void> {
    const updatePromises = []
    
    for (const [id, element] of this.holographicElements) {
      if (element.isActive) {
        updatePromises.push(this.updateElementAppearance(element))
      }
    }
    
    await Promise.allSettled(updatePromises)
  }

  // Update single element appearance
  private async updateElementAppearance(holographicElement: HolographicElement): Promise<void> {
    const { element, holographicType, intensity, consciousnessLevel, organicIntegration } = holographicElement
    
    try {
      // Apply holographic base effects
      this.applyHolographicBase(element, intensity)
      
      // Apply type-specific effects
      switch (holographicType) {
        case 'translucent_panel':
          this.applyTranslucentPanel(element, intensity)
          break
        case 'data_stream':
          this.applyDataStream(element, intensity)
          break
        case 'energy_barrier':
          this.applyEnergyBarrier(element, intensity)
          break
        case 'consciousness_interface':
          this.applyConsciousnessInterface(element, intensity, consciousnessLevel)
          break
        case 'organic_hologram':
          this.applyOrganicHologram(element, intensity, organicIntegration)
          break
        case 'musical_visualization':
          this.applyMusicalVisualization(element, intensity)
          break
        case 'scanline_overlay':
          this.applyScanlineOverlay(element, intensity)
          break
        case 'chromatic_ghost':
          this.applyChromaticGhost(element, intensity)
          break
      }
      
      // Apply consciousness and organic modifiers
      if (consciousnessLevel > 0.5) {
        this.applyConsciousnessModifiers(element, consciousnessLevel)
      }
      
      if (organicIntegration) {
        this.applyOrganicModifiers(element, intensity)
      }
      
      holographicElement.lastUpdate = performance.now()
      
    } catch (error) {
      console.warn(`[HolographicUISystem] Failed to update element ${holographicElement.id}:`, error)
    }
  }

  // Apply holographic base effects
  private applyHolographicBase(element: HTMLElement, intensity: number): void {
    const transparency = this.holographicState.transparency * intensity
    const flicker = this.holographicState.flickerIntensity * intensity
    const chromatic = this.holographicState.chromatic * intensity
    
    // Base transparency
    element.style.opacity = transparency.toString()
    
    // Holographic flicker
    if (flicker > 0.3) {
      const flickerAmount = Math.sin(this.animationState.flickerPhase * 10) * flicker * 0.3
      element.style.opacity = Math.max(0.1, transparency + flickerAmount).toString()
    }
    
    // Chromatic aberration
    if (chromatic > 0.2) {
      const chromaticOffset = chromatic * 2
      element.style.filter = `
        drop-shadow(${chromaticOffset}px 0 0 rgba(255, 0, 0, 0.5))
        drop-shadow(-${chromaticOffset}px 0 0 rgba(0, 255, 255, 0.5))
      `
    }
    
    // Holographic glow
    const glowIntensity = intensity * 0.3
    element.style.boxShadow = `
      0 0 ${glowIntensity * 20}px rgba(var(--organic-holographic-rgb, 100, 255, 200), ${glowIntensity}),
      inset 0 0 ${glowIntensity * 10}px rgba(var(--organic-holographic-rgb, 100, 255, 200), ${glowIntensity * 0.5})
    `
  }

  // Apply translucent panel effect
  private applyTranslucentPanel(element: HTMLElement, intensity: number): void {
    const transparency = this.holographicState.transparency * intensity
    
    element.style.background = `
      rgba(var(--organic-holographic-rgb, 100, 255, 200), ${transparency * 0.1}),
      linear-gradient(45deg, 
        transparent 0%, 
        rgba(var(--organic-holographic-rgb, 100, 255, 200), ${transparency * 0.05}) 50%,
        transparent 100%)
    `
    element.style.backdropFilter = `blur(${intensity * 8}px)`
    element.style.border = `1px solid rgba(var(--organic-holographic-rgb, 100, 255, 200), ${transparency * 0.6})`
  }

  // Apply data stream effect
  private applyDataStream(element: HTMLElement, intensity: number): void {
    const streamSpeed = this.dataStream.speed * intensity
    const streamDensity = this.dataStream.density * intensity
    
    // Create scrolling data stream background
    const streamGradient = this.generateDataStreamGradient(streamSpeed, streamDensity)
    element.style.background = streamGradient
    element.style.backgroundSize = '100% 20px'
    element.style.animation = `dataStream ${2 / streamSpeed}s linear infinite`
    
    // Add CSS animation if not exists
    if (!document.getElementById('dataStreamAnimation')) {
      const style = document.createElement('style')
      style.id = 'dataStreamAnimation'
      style.textContent = `
        @keyframes dataStream {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }
      `
      document.head.appendChild(style)
    }
  }

  // Apply energy barrier effect
  private applyEnergyBarrier(element: HTMLElement, intensity: number): void {
    const energyStability = this.holographicState.energyStability
    const interference = this.holographicState.interferenceLevel * intensity
    
    // Energy barrier shimmer
    const shimmerIntensity = (1.0 - energyStability) * intensity
    element.style.background = `
      linear-gradient(90deg,
        rgba(var(--organic-neon-glow-rgb, 0, 255, 255), ${shimmerIntensity * 0.3}) 0%,
        rgba(var(--organic-neon-glow-rgb, 0, 255, 255), ${shimmerIntensity * 0.1}) 50%,
        rgba(var(--organic-neon-glow-rgb, 0, 255, 255), ${shimmerIntensity * 0.3}) 100%)
    `
    element.style.backgroundSize = '200% 100%'
    element.style.animation = `energyBarrier ${1 / shimmerIntensity}s ease-in-out infinite`
    
    // Add CSS animation if not exists
    if (!document.getElementById('energyBarrierAnimation')) {
      const style = document.createElement('style')
      style.id = 'energyBarrierAnimation'
      style.textContent = `
        @keyframes energyBarrier {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 0% 0%; }
        }
      `
      document.head.appendChild(style)
    }
  }

  // Apply consciousness interface effect
  private applyConsciousnessInterface(element: HTMLElement, intensity: number, consciousnessLevel: number): void {
    const consciousnessState = this.manager.getConsciousnessState()
    const resonance = consciousnessState.symbioticResonance * consciousnessLevel
    
    // Consciousness-responsive glow
    const glowIntensity = resonance * intensity * 0.5
    element.style.boxShadow = `
      0 0 ${glowIntensity * 30}px rgba(var(--organic-accent-rgb, 203, 166, 247), ${glowIntensity}),
      inset 0 0 ${glowIntensity * 15}px rgba(var(--organic-accent-rgb, 203, 166, 247), ${glowIntensity * 0.3})
    `
    
    // Consciousness-responsive transparency
    const consciousnessTransparency = 0.7 + (resonance * 0.3)
    element.style.opacity = consciousnessTransparency.toString()
    
    // Consciousness pulsing
    if (resonance > 0.6) {
      const pulsePhase = this.animationState.organicPhase * 2
      const pulseIntensity = 1.0 + (Math.sin(pulsePhase) * resonance * 0.2)
      element.style.transform = `scale(${pulseIntensity})`
    }
  }

  // Apply organic hologram effect
  private applyOrganicHologram(element: HTMLElement, intensity: number, organicIntegration: boolean): void {
    if (!organicIntegration) return
    
    const organicPhase = this.animationState.organicPhase
    const organicIntensity = this.holographicState.energyStability * intensity
    
    // Organic morphing
    const morphX = Math.sin(organicPhase * 1.5) * organicIntensity * 2
    const morphY = Math.cos(organicPhase * 2.0) * organicIntensity * 1.5
    element.style.transform = `translate(${morphX}px, ${morphY}px)`
    
    // Organic color shifting
    const colorPhase = organicPhase * 0.5
    const hueShift = Math.sin(colorPhase) * organicIntensity * 30
    element.style.filter = `hue-rotate(${hueShift}deg)`
    
    // Organic breathing
    const breathingPhase = organicPhase * 0.8
    const breathingScale = 1.0 + (Math.sin(breathingPhase) * organicIntensity * 0.05)
    element.style.transform += ` scale(${breathingScale})`
  }

  // Apply musical visualization effect
  private applyMusicalVisualization(element: HTMLElement, intensity: number): void {
    const consciousnessState = this.manager.getConsciousnessState()
    const musicalIntensity = consciousnessState.symbioticResonance * intensity
    
    // Musical responsiveness
    const visualPhase = this.animationState.dataStreamPhase * 3
    const visualIntensity = musicalIntensity * 0.8
    
    // Musical bars visualization
    const barHeight = Math.sin(visualPhase) * visualIntensity * 20
    element.style.background = `
      linear-gradient(0deg,
        rgba(var(--organic-primary-rgb, 205, 214, 244), ${visualIntensity * 0.8}) 0%,
        rgba(var(--organic-primary-rgb, 205, 214, 244), ${visualIntensity * 0.4}) ${50 + barHeight}%,
        transparent ${50 + barHeight}%)
    `
    
    // Musical pulsing
    const pulseIntensity = 1.0 + (Math.sin(visualPhase * 2) * musicalIntensity * 0.1)
    element.style.transform = `scaleY(${pulseIntensity})`
  }

  // Apply scanline overlay effect
  private applyScanlineOverlay(element: HTMLElement, intensity: number): void {
    const scanlineIntensity = this.holographicState.scanlineIntensity * intensity
    const scanlineFrequency = this.scanlineEffect.frequency
    
    // Scanline pattern
    element.style.background = `
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent ${scanlineFrequency - 1}px,
        rgba(var(--organic-holographic-rgb, 100, 255, 200), ${scanlineIntensity * 0.1}) ${scanlineFrequency}px,
        rgba(var(--organic-holographic-rgb, 100, 255, 200), ${scanlineIntensity * 0.1}) ${scanlineFrequency}px
      )
    `
    
    // Animated scanlines
    if (this.scanlineEffect.animation) {
      element.style.animation = `scanlines ${1 / this.scanlineEffect.speed}s linear infinite`
    }
    
    // Add CSS animation if not exists
    if (!document.getElementById('scanlineAnimation')) {
      const style = document.createElement('style')
      style.id = 'scanlineAnimation'
      style.textContent = `
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 ${scanlineFrequency}px; }
        }
      `
      document.head.appendChild(style)
    }
  }

  // Apply chromatic ghost effect
  private applyChromaticGhost(element: HTMLElement, intensity: number): void {
    const chromaticIntensity = this.holographicState.chromatic * intensity
    
    // Multiple chromatic ghosts
    const redOffset = chromaticIntensity * 3
    const greenOffset = chromaticIntensity * 1.5
    const blueOffset = chromaticIntensity * 2
    
    element.style.filter = `
      drop-shadow(${redOffset}px 0 0 rgba(255, 0, 0, 0.4))
      drop-shadow(-${greenOffset}px 0 0 rgba(0, 255, 0, 0.4))
      drop-shadow(0 ${blueOffset}px 0 rgba(0, 0, 255, 0.4))
    `
    
    // Chromatic animation
    const chromaticPhase = this.animationState.chromaticPhase
    const offsetAnimation = Math.sin(chromaticPhase * 5) * chromaticIntensity
    element.style.transform = `translate(${offsetAnimation}px, 0)`
  }

  // Apply consciousness modifiers
  private applyConsciousnessModifiers(element: HTMLElement, consciousnessLevel: number): void {
    const consciousnessState = this.manager.getConsciousnessState()
    const resonance = consciousnessState.symbioticResonance * consciousnessLevel
    
    // Consciousness-based brightness
    const brightness = 1.0 + (resonance * 0.3)
    element.style.filter = (element.style.filter || '') + ` brightness(${brightness})`
    
    // Consciousness-based saturation
    const saturation = 1.0 + (resonance * 0.5)
    element.style.filter = (element.style.filter || '') + ` saturate(${saturation})`
  }

  // Apply organic modifiers
  private applyOrganicModifiers(element: HTMLElement, intensity: number): void {
    const organicPhase = this.animationState.organicPhase
    const organicIntensity = this.holographicState.energyStability * intensity
    
    // Organic blur breathing
    const blurPhase = organicPhase * 1.2
    const blurAmount = Math.sin(blurPhase) * organicIntensity * 2
    element.style.filter = (element.style.filter || '') + ` blur(${Math.max(0, blurAmount)}px)`
    
    // Organic opacity pulsing
    const opacityPhase = organicPhase * 0.7
    const opacityModifier = 1.0 + (Math.sin(opacityPhase) * organicIntensity * 0.2)
    const currentOpacity = parseFloat(element.style.opacity) || 1.0
    element.style.opacity = Math.max(0.1, Math.min(1.0, currentOpacity * opacityModifier)).toString()
  }

  // Generate data stream gradient
  private generateDataStreamGradient(speed: number, density: number): string {
    const characters = this.dataStream.characters
    const characterCount = Math.floor(density * 20)
    
    let gradient = 'linear-gradient(90deg, '
    
    for (let i = 0; i < characterCount; i++) {
      const position = (i / characterCount) * 100
      const character = characters[Math.floor(Math.random() * characters.length)]
      const opacity = 0.1 + (Math.random() * 0.3)
      
      gradient += `rgba(var(--organic-holographic-rgb, 100, 255, 200), ${opacity}) ${position}%, `
    }
    
    gradient = gradient.slice(0, -2) + ')'
    return gradient
  }

  // Create interface container
  private async createInterfaceContainer(): Promise<void> {
    this.interfaceContainer = document.createElement('div')
    this.interfaceContainer.id = 'holographic-interface-container'
    this.interfaceContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
      mix-blend-mode: screen;
    `
    
    document.body.appendChild(this.interfaceContainer)
  }

  // Create scanline overlay
  private async createScanlineOverlay(): Promise<void> {
    this.scanlineOverlay = document.createElement('div')
    this.scanlineOverlay.id = 'holographic-scanline-overlay'
    this.scanlineOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.5;
    `
    
    this.interfaceContainer?.appendChild(this.scanlineOverlay)
  }

  // Create chromatic aberration canvas
  private async createChromaticCanvas(): Promise<void> {
    this.chromaticCanvas = document.createElement('canvas')
    this.chromaticCanvas.id = 'holographic-chromatic-canvas'
    this.chromaticCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `
    
    this.chromaticCanvas.width = window.innerWidth
    this.chromaticCanvas.height = window.innerHeight
    
    this.interfaceContainer?.appendChild(this.chromaticCanvas)
  }

  // Create data stream canvas
  private async createDataStreamCanvas(): Promise<void> {
    this.dataStreamCanvas = document.createElement('canvas')
    this.dataStreamCanvas.id = 'holographic-datastream-canvas'
    this.dataStreamCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.3;
    `
    
    this.dataStreamCanvas.width = window.innerWidth
    this.dataStreamCanvas.height = window.innerHeight
    
    this.interfaceContainer?.appendChild(this.dataStreamCanvas)
  }

  // Initialize holographic elements
  private async initializeHolographicElements(): Promise<void> {
    const elementSelectors = [
      { selector: '.main-view-container', type: 'translucent_panel' },
      { selector: '.Root__nav-bar', type: 'data_stream' },
      { selector: '.Root__now-playing-bar', type: 'consciousness_interface' },
      { selector: '.main-view-container__scroll-node', type: 'organic_hologram' },
      { selector: '.root-now-playing-view', type: 'energy_barrier' },
      { selector: '.main-view-container__scroll-node-child', type: 'scanline_overlay' }
    ]
    
    for (const config of elementSelectors) {
      const elements = document.querySelectorAll(config.selector)
      
      for (const element of elements) {
        const holographicElement: HolographicElement = {
          id: `holographic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          element: element as HTMLElement,
          originalStyles: getComputedStyle(element),
          holographicType: config.type as HolographicType,
          intensity: 0.7,
          isActive: true,
          lastUpdate: 0,
          animation: null,
          consciousnessLevel: 0.8,
          organicIntegration: true
        }
        
        this.holographicElements.set(holographicElement.id, holographicElement)
      }
    }
  }

  // Update holographic animation
  public updateHolographicAnimation(deltaMs: number): void {
    if (!this.isInitialized || !this.isEnabled) return
    
    const deltaSeconds = deltaMs / 1000
    
    // Update animation phases
    this.animationState.flickerPhase += deltaSeconds * 2
    this.animationState.scanlinePhase += deltaSeconds * this.scanlineEffect.speed
    this.animationState.chromaticPhase += deltaSeconds * 1.5
    this.animationState.dataStreamPhase += deltaSeconds * this.dataStream.speed
    this.animationState.interferencePhase += deltaSeconds * this.interferencePattern.frequency
    this.animationState.organicPhase += deltaSeconds * 0.5
    
    // Update scanline overlay
    this.updateScanlineOverlay()
    
    // Update data stream canvas
    this.updateDataStreamCanvas()
    
    // Update performance metrics
    this.performanceMetrics.lastUpdate = performance.now()
  }

  // Update scanline overlay
  private updateScanlineOverlay(): void {
    if (!this.scanlineOverlay) return
    
    const scanlineIntensity = this.holographicState.scanlineIntensity
    const scanlineFrequency = this.scanlineEffect.frequency
    
    this.scanlineOverlay.style.background = `
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent ${scanlineFrequency - 1}px,
        rgba(var(--organic-holographic-rgb, 100, 255, 200), ${scanlineIntensity * 0.1}) ${scanlineFrequency}px
      )
    `
    
    // Animate scanlines
    if (this.scanlineEffect.animation) {
      const offset = this.animationState.scanlinePhase * scanlineFrequency
      this.scanlineOverlay.style.backgroundPosition = `0 ${offset}px`
    }
  }

  // Update data stream canvas
  private updateDataStreamCanvas(): void {
    if (!this.dataStreamCanvas) return
    
    const ctx = this.dataStreamCanvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, this.dataStreamCanvas.width, this.dataStreamCanvas.height)
    
    // Draw data stream characters
    const streamDensity = this.dataStream.density
    const streamSpeed = this.dataStream.speed
    const characters = this.dataStream.characters
    
    ctx.fillStyle = `rgba(var(--organic-holographic-rgb, 100, 255, 200), 0.3)`
    ctx.font = '12px monospace'
    
    const columnCount = Math.floor(this.dataStreamCanvas.width / 20)
    
    for (let i = 0; i < columnCount; i++) {
      const x = i * 20
      const characterCount = Math.floor(streamDensity * 10)
      
      for (let j = 0; j < characterCount; j++) {
        const y = (j * 20 + (this.animationState.dataStreamPhase * 100)) % this.dataStreamCanvas.height
        const character = characters[Math.floor(Math.random() * characters.length)]
        
        if (character) {
          ctx.fillText(character, x, y)
        }
      }
    }
  }

  // Start holographic animation
  private startHolographicAnimation(): void {
    this.animationState.isAnimating = true
    this.animationState.lastFrameTime = performance.now()
    
    const animate = (currentTime: number) => {
      if (!this.animationState.isAnimating) return
      
      const deltaTime = currentTime - this.animationState.lastFrameTime
      this.animationState.lastFrameTime = currentTime
      
      // Update holographic animation
      this.updateHolographicAnimation(deltaTime)
      
      // Continue animation loop
      requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)
  }

  // Utility methods
  private smoothTransition(current: number, target: number, speed: number): number {
    return current + (target - current) * speed
  }

  // Update performance metrics
  private updatePerformanceMetrics(processingTime: number): void {
    this.performanceMetrics.averageProcessingTime = 
      (this.performanceMetrics.averageProcessingTime * 0.9) + (processingTime * 0.1)
    
    this.performanceMetrics.elementsProcessed = this.holographicElements.size
    this.performanceMetrics.memoryUsage = this.holographicElements.size * 256 // Approximate bytes per element
  }

  // Public API methods
  public getHolographicState(): HolographicState {
    return { ...this.holographicState }
  }

  public getPerformanceMetrics(): typeof this.performanceMetrics {
    return { ...this.performanceMetrics }
  }

  public getElementCount(): number {
    return this.holographicElements.size
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    
    if (!enabled) {
      // Clear all holographic effects
      for (const [id, element] of this.holographicElements) {
        element.element.style.opacity = '1'
        element.element.style.filter = ''
        element.element.style.background = ''
        element.element.style.boxShadow = ''
        element.element.style.transform = ''
      }
    }
  }

  public setHolographicPreset(presetName: string): void {
    const preset = this.holographicPresets[presetName as keyof typeof this.holographicPresets]
    if (preset) {
      this.holographicState = { ...preset }
    }
  }

  public setFlickerIntensity(intensity: number): void {
    this.holographicState.flickerIntensity = Math.max(0, Math.min(1, intensity))
  }

  /**
   * Enable volumetric depth effects for 3D holographic consciousness
   */
  public enableVolumetricDepth(depthLevel: number = 0.8): void {
    const perspectiveDepth = 800 + (depthLevel * 1200); // 800px-2000px range
    
    // Set global perspective for volumetric effects
    if (this.interfaceContainer) {
      this.interfaceContainer.style.perspective = `${perspectiveDepth}px`;
      this.interfaceContainer.style.transformStyle = 'preserve-3d';
    }
    
    // Update all holographic elements with volumetric layers
    for (const [id, holographicElement] of this.holographicElements) {
      this.applyVolumetricLayers(holographicElement.element, depthLevel, holographicElement.intensity);
    }
    
    console.log(`[HolographicUISystem] 🌊 Volumetric depth enabled: ${perspectiveDepth}px perspective`);
  }

  /**
   * Update volumetric layers for 3D consciousness depth
   */
  public updateVolumetricLayers(consciousnessLevel: number, emotionalTemperature: number): void {
    const depthIntensity = consciousnessLevel * 0.8;
    const temperatureDepth = (emotionalTemperature - 4000) / 4000; // Normalize 4000K-8000K to 0-1
    
    for (const [id, holographicElement] of this.holographicElements) {
      this.applyVolumetricLayers(
        holographicElement.element, 
        depthIntensity, 
        holographicElement.intensity,
        temperatureDepth
      );
    }
  }

  /**
   * Apply volumetric 3D layers to holographic element
   */
  private applyVolumetricLayers(
    element: HTMLElement, 
    depthLevel: number, 
    intensity: number, 
    temperatureDepth: number = 0.5
  ): void {
    // Calculate depth offset based on consciousness and temperature
    const baseDepth = depthLevel * 100; // -100px to +100px range
    const temperatureOffset = temperatureDepth * 50; // Additional depth based on emotional temperature
    const finalDepth = baseDepth + temperatureOffset;
    
    // Apply 3D transform with consciousness-driven depth
    const currentTransform = element.style.transform || '';
    const volumetricTransform = `translateZ(${finalDepth}px)`;
    
    // Preserve existing transforms and add volumetric depth
    if (currentTransform.includes('translateZ')) {
      element.style.transform = currentTransform.replace(/translateZ\([^)]*\)/, volumetricTransform);
    } else {
      element.style.transform = `${currentTransform} ${volumetricTransform}`.trim();
    }
    
    // Add volumetric shadow effects based on depth
    const shadowIntensity = Math.abs(finalDepth) / 100 * intensity;
    const shadowBlur = shadowIntensity * 30;
    const shadowOffset = finalDepth > 0 ? shadowIntensity * 5 : -shadowIntensity * 3;
    
    const existingShadow = element.style.boxShadow || '';
    const volumetricShadow = `0 ${shadowOffset}px ${shadowBlur}px rgba(var(--organic-holographic-rgb, 100, 255, 200), ${shadowIntensity * 0.3})`;
    
    if (existingShadow) {
      element.style.boxShadow = `${existingShadow}, ${volumetricShadow}`;
    } else {
      element.style.boxShadow = volumetricShadow;
    }
    
    // Add volumetric atmosphere for depth perception
    this.applyVolumetricAtmosphere(element, depthLevel, intensity);
  }

  /**
   * Apply volumetric atmosphere effects for depth perception
   */
  private applyVolumetricAtmosphere(element: HTMLElement, depthLevel: number, intensity: number): void {
    // Create depth-based atmospheric effects
    const atmosphereIntensity = depthLevel * intensity;
    const blurAmount = Math.max(0, (depthLevel - 0.5) * 4); // Blur distant elements
    const brightnessAdjust = 1 + (depthLevel - 0.5) * 0.3; // Brighten near elements
    
    // Apply atmospheric filters
    const currentFilter = element.style.filter || '';
    const atmosphericFilters = [
      blurAmount > 0 ? `blur(${blurAmount}px)` : '',
      `brightness(${brightnessAdjust})`,
      `saturate(${1 + atmosphereIntensity * 0.2})`
    ].filter(f => f).join(' ');
    
    // Merge with existing filters
    if (currentFilter && !currentFilter.includes('brightness')) {
      element.style.filter = `${currentFilter} ${atmosphericFilters}`;
    } else if (!currentFilter) {
      element.style.filter = atmosphericFilters;
    }
    
    // Add depth-based opacity scaling for atmospheric perspective
    const baseOpacity = parseFloat(element.style.opacity || '1');
    const atmosphericOpacity = Math.max(0.3, baseOpacity - (1 - depthLevel) * 0.3);
    element.style.opacity = atmosphericOpacity.toString();
  }

  /**
   * Update consciousness data stream with real-time data
   * Phase 4.2b: Consciousness Data Integration
   */
  public updateConsciousnessDataStream(consciousnessState: any): void {
    if (!this.dataStreamCanvas) {
      this.createConsciousnessDataStreamCanvas();
    }
    
    // Generate consciousness data text
    const consciousnessData = this.generateConsciousnessDataText(consciousnessState);
    
    // Update data stream with consciousness information
    this.renderConsciousnessDataStream(consciousnessData);
    
    console.log('[HolographicUISystem] 🌊 Consciousness data stream updated');
  }

  /**
   * Generate consciousness data text for Matrix-style display
   */
  private generateConsciousnessDataText(consciousnessState: any): string[] {
    const dataLines: string[] = [];
    
    // Extract consciousness data
    const { 
      consciousnessResonance = 0,
      dominantEmotionalTemperature = 6000,
      totalIntensity = 0,
      activeLayerCount = 0,
      currentPalette = []
    } = consciousnessState;
    
    // Format RGB data from current palette
    if (currentPalette.length > 0) {
      const primaryColor = currentPalette[0];
      if (primaryColor && primaryColor.rgb) {
        dataLines.push(`RGB: ${primaryColor.rgb.r},${primaryColor.rgb.g},${primaryColor.rgb.b}`);
      }
      
      // OKLAB data if available
      if (primaryColor && primaryColor.oklab) {
        const { L, a, b } = primaryColor.oklab;
        dataLines.push(`OKLAB: ${L.toFixed(2)},${a.toFixed(2)},${b.toFixed(2)}`);
      }
    }
    
    // Consciousness metrics
    dataLines.push(`CONSCIOUSNESS: ${Math.round(consciousnessResonance * 100)}%`);
    dataLines.push(`TEMP: ${Math.round(dominantEmotionalTemperature)}K`);
    dataLines.push(`INTENSITY: ${Math.round(totalIntensity * 100)}%`);
    dataLines.push(`LAYERS: ${activeLayerCount}`);
    
    // Musical emotion data (placeholder - will be enhanced when musical data is available)
    dataLines.push(`STATUS: CONSCIOUS`);
    dataLines.push(`MODE: HOLOGRAPHIC`);
    
    return dataLines;
  }

  /**
   * Create consciousness data stream canvas
   */
  private createConsciousnessDataStreamCanvas(): void {
    if (this.dataStreamCanvas) return;
    
    this.dataStreamCanvas = document.createElement('canvas');
    this.dataStreamCanvas.style.position = 'fixed';
    this.dataStreamCanvas.style.top = '0';
    this.dataStreamCanvas.style.left = '0';
    this.dataStreamCanvas.style.width = '200px';
    this.dataStreamCanvas.style.height = '100%';
    this.dataStreamCanvas.style.pointerEvents = 'none';
    this.dataStreamCanvas.style.opacity = '0.6';
    this.dataStreamCanvas.style.zIndex = '9999';
    this.dataStreamCanvas.style.fontFamily = 'monospace';
    
    // Set canvas size
    this.dataStreamCanvas.width = 200;
    this.dataStreamCanvas.height = window.innerHeight;
    
    // Add to interface container
    if (this.interfaceContainer) {
      this.interfaceContainer.appendChild(this.dataStreamCanvas);
    } else {
      document.body.appendChild(this.dataStreamCanvas);
    }
  }

  /**
   * Render consciousness data stream on canvas
   */
  private renderConsciousnessDataStream(dataLines: string[]): void {
    if (!this.dataStreamCanvas) return;
    
    const ctx = this.dataStreamCanvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.dataStreamCanvas.width, this.dataStreamCanvas.height);
    
    // Set text properties
    ctx.font = '12px monospace';
    ctx.fillStyle = `rgba(var(--organic-holographic-rgb, 100, 255, 200), 0.8)`;
    ctx.textAlign = 'left';
    
    // Render data lines with Matrix-style streaming effect
    const lineHeight = 16;
    const startY = 50;
    const streamOffset = (Date.now() * 0.05) % (lineHeight * 2); // Continuous scrolling
    
    dataLines.forEach((line, index) => {
      const y = startY + (index * lineHeight * 2) - streamOffset;
      
      // Only render if within canvas bounds
      if (y > -lineHeight && y < this.dataStreamCanvas!.height + lineHeight) {
        // Add streaming effect with character-by-character reveal
        const revealProgress = (Date.now() * 0.01 + index) % 1;
        const revealLength = Math.floor(line.length * revealProgress);
        const visibleText = line.substring(0, revealLength);
        
        // Render main text
        ctx.fillStyle = `rgba(var(--organic-holographic-rgb, 100, 255, 200), 0.9)`;
        ctx.fillText(visibleText, 10, y);
        
        // Add cursor effect
        if (revealLength < line.length) {
          ctx.fillStyle = `rgba(var(--organic-holographic-rgb, 100, 255, 200), 1.0)`;
          ctx.fillText('_', 10 + (revealLength * 7), y);
        }
        
        // Add trailing characters for Matrix effect
        for (let i = 0; i < 3; i++) {
          const trailY = y + (i + 1) * lineHeight;
          if (trailY < this.dataStreamCanvas!.height) {
            const randomChar = this.dataStream.characters[Math.floor(Math.random() * this.dataStream.characters.length)];
            const trailOpacity = 0.3 - (i * 0.1);
            ctx.fillStyle = `rgba(var(--organic-holographic-rgb, 100, 255, 200), ${trailOpacity})`;
            if (randomChar) {
              ctx.fillText(randomChar, 10 + Math.random() * 150, trailY);
            }
          }
        }
      }
    });
    
    // Schedule next frame
    requestAnimationFrame(() => this.renderConsciousnessDataStream(dataLines));
  }

  /**
   * Organic consciousness atmospheric effects system
   * Phase 4.2c: Advanced Atmospheric Enhancement - flowing, seamless, organic
   */
  public updateConsciousnessScanlines(consciousnessLevel: number, emotionalTemperature: number, musicalIntensity: number): void {
    if (!this.scanlineOverlay) return;

    // Calculate consciousness-driven atmospheric parameters
    const consciousnessDensity = Math.max(0.2, consciousnessLevel * 1.5); // Denser atmosphere for higher consciousness
    const temperatureFrequency = this.mapTemperatureToFrequency(emotionalTemperature); // Flow speed based on emotional temperature
    const musicalPulse = Math.sin(performance.now() * 0.005 * musicalIntensity) * 0.3 + 0.7; // Musical pulse modulation

    // Update organic atmospheric effect parameters
    this.scanlineEffect.frequency = temperatureFrequency * consciousnessDensity;
    this.scanlineEffect.opacity = Math.min(0.15, consciousnessLevel * 0.2 * musicalPulse); // Reduced for organic subtlety
    this.scanlineEffect.speed = 0.2 + (musicalIntensity * 0.8) + (consciousnessLevel * 0.3);

    // Apply organic consciousness-responsive atmospheric pattern
    this.applySophisticatedScanlines(consciousnessLevel, emotionalTemperature, musicalIntensity);
    
    console.log(`[HolographicUISystem] 🌊 Organic atmosphere updated: density=${consciousnessDensity.toFixed(2)}, flow=${temperatureFrequency.toFixed(1)}Hz, pulse=${musicalPulse.toFixed(2)}`);
  }

  /**
   * Map emotional temperature to scanline frequency
   */
  private mapTemperatureToFrequency(temperature: number): number {
    // Cool temperatures (3000K-5000K) = slower, denser scanlines (2-4Hz)
    // Warm temperatures (5000K-7000K) = faster, sparser scanlines (4-8Hz)
    // Hot temperatures (7000K+) = rapid, energetic scanlines (8-12Hz)
    const normalizedTemp = Math.max(3000, Math.min(8000, temperature));
    const tempRatio = (normalizedTemp - 3000) / 5000; // 0-1 range
    return 2 + (tempRatio * 10); // 2-12Hz range
  }

  /**
   * Apply organic consciousness-responsive atmospheric effects
   * Redesigned to match visualGuide.png aesthetic - flowing, atmospheric, seamless
   */
  private applySophisticatedScanlines(consciousnessLevel: number, emotionalTemperature: number, musicalIntensity: number): void {
    if (!this.scanlineOverlay) return;

    const time = performance.now() * 0.001;
    const baseOpacity = this.scanlineEffect.opacity;

    // Create organic atmospheric interference layers
    let atmosphericPattern = '';

    // Primary consciousness enhancement zone - subtle color grading enhancement
    const enhancementIntensity = consciousnessLevel * baseOpacity * 0.3; // Much more subtle
    const enhancementSize = 150 + (consciousnessLevel * 100); // Larger, softer zones
    const flowSpeed = musicalIntensity * 0.2 + 0.05; // Slower, more cinematic
    
    atmosphericPattern += `
      radial-gradient(
        ellipse ${enhancementSize * 1.8}px ${enhancementSize * 1.2}px at 
        ${50 + Math.sin(time * flowSpeed) * 15}% 
        ${50 + Math.cos(time * flowSpeed * 0.8) * 18}%,
        hsla(${180 + ((emotionalTemperature - 5000) / 3000) * 40}, 50%, 65%, ${enhancementIntensity}) 0%,
        hsla(${180 + ((emotionalTemperature - 5000) / 3000) * 40}, 50%, 65%, ${enhancementIntensity * 0.3}) 50%,
        transparent 85%
      )`;

    // Secondary emotional temperature enhancement layer - subtle color shift
    if (consciousnessLevel > 0.4) {
      const tempIntensity = (consciousnessLevel - 0.4) * baseOpacity * 0.2; // Much more subtle
      const tempSize = 120 + ((emotionalTemperature - 5000) / 3000) * 60; // Larger, softer enhancement
      const tempHue = ((emotionalTemperature - 4000) / 4000) * 30; // Reduced hue shift
      
      atmosphericPattern += `, 
        radial-gradient(
          ellipse ${tempSize * 2}px ${tempSize * 1.5}px at 
          ${30 + Math.sin(time * flowSpeed * 1.1) * 12}% 
          ${70 + Math.cos(time * flowSpeed * 0.7) * 15}%,
          hsla(${200 + tempHue}, 40%, 70%, ${tempIntensity}) 0%,
          hsla(${200 + tempHue}, 40%, 70%, ${tempIntensity * 0.2}) 60%,
          transparent 90%
        )`;
    }

    // Tertiary musical energy enhancement - gentle breathing pulse
    if (consciousnessLevel > 0.6) {
      const musicalIntensityAdj = musicalIntensity * baseOpacity * 0.15; // Much more subtle
      const pulseSize = 80 + (musicalIntensity * 80); // Larger, softer
      const pulsePhase = Math.sin(time * musicalIntensity * 1.5) * 0.3 + 0.7; // Gentle pulse
      
      atmosphericPattern += `, 
        radial-gradient(
          circle ${pulseSize * (0.8 + pulsePhase * 0.2)}px at 
          ${70 + Math.sin(time * flowSpeed * 1.3) * 8}% 
          ${30 + Math.cos(time * flowSpeed * 0.9) * 12}%,
          hsla(${40 + ((emotionalTemperature - 5000) / 3000) * 20}, 45%, 75%, ${musicalIntensityAdj * pulsePhase}) 0%,
          hsla(${40 + ((emotionalTemperature - 5000) / 3000) * 20}, 45%, 75%, ${musicalIntensityAdj * pulsePhase * 0.2}) 40%,
          transparent 80%
        )`;
    }

    // Advanced consciousness subtle enhancement for very high levels (>0.8) - gentle complexity
    if (consciousnessLevel > 0.8) {
      const complexityIntensity = (consciousnessLevel - 0.8) * baseOpacity * 0.1; // Very subtle
      const complexityScale = 60 + Math.sin(time * 0.3) * 15; // Gentler variation
      
      // Create subtle complexity enhancement zones
      for (let i = 0; i < 2; i++) { // Reduced from 3 to 2 for subtlety
        const complexityOffset = i * 3.7; // Different prime for organic distribution
        const complexityPhase = time * (0.2 + i * 0.05); // Slower, more cinematic
        atmosphericPattern += `, 
          radial-gradient(
            ellipse ${complexityScale * (1 + i * 0.5)}px ${complexityScale * (0.8 + i * 0.3)}px at 
            ${25 + i * 35 + Math.sin(complexityPhase + complexityOffset) * 6}% 
            ${30 + i * 25 + Math.cos(complexityPhase * 1.1 + complexityOffset) * 8}%,
            hsla(${160 + i * 40 + ((emotionalTemperature - 5000) / 3000) * 15}, 30%, 80%, ${complexityIntensity * (0.7 + Math.sin(complexityPhase) * 0.2)}) 0%,
            transparent 70%
          )`;
      }
    }

    // Apply the organic atmospheric pattern
    this.scanlineOverlay.style.background = atmosphericPattern;

    // Organic transform effects
    const organicScale = 1 + (consciousnessLevel * 0.02); // Subtle breathing scale
    const organicRotation = Math.sin(time * flowSpeed * 0.5) * (consciousnessLevel * 2); // Gentle rotation
    const organicTranslateX = Math.sin(time * flowSpeed * 0.7) * (musicalIntensity * 3);
    const organicTranslateY = Math.cos(time * flowSpeed * 0.9) * (consciousnessLevel * 2);
    
    this.scanlineOverlay.style.transform = `
      scale(${organicScale}) 
      rotate(${organicRotation}deg) 
      translate(${organicTranslateX}px, ${organicTranslateY}px)
    `;

    // Enhancement lens effects - no blur, only enhancement filters
    const brightness = 1 + (musicalIntensity * consciousnessLevel * 0.05); // Subtle brightness boost
    const contrast = 1 + (consciousnessLevel * 0.1); // Enhanced contrast
    const saturation = 1 + (consciousnessLevel * 0.15); // Enhanced saturation
    
    // Use backdrop-filter for lens effect that enhances underlying content
    this.scanlineOverlay.style.backdropFilter = `
      brightness(${brightness}) 
      contrast(${contrast})
      saturate(${saturation})
      hue-rotate(${((emotionalTemperature - 5000) / 3000) * 20}deg)
    `;
    
    // Remove filter blur that was causing overlay effect
    this.scanlineOverlay.style.filter = 'none';

    // Update CSS variables for cross-system integration
    this.updateScanlineCSSVariables(consciousnessLevel, emotionalTemperature, musicalIntensity);
  }

  /**
   * Update CSS variables for scanline system integration
   */
  private updateScanlineCSSVariables(consciousnessLevel: number, emotionalTemperature: number, musicalIntensity: number): void {
    const root = document.documentElement;
    
    // Scanline consciousness variables
    root.style.setProperty('--consciousness-scanline-density', consciousnessLevel.toString());
    root.style.setProperty('--consciousness-scanline-frequency', `${this.scanlineEffect.frequency}px`);
    root.style.setProperty('--consciousness-scanline-opacity', this.scanlineEffect.opacity.toString());
    root.style.setProperty('--consciousness-scanline-speed', `${this.scanlineEffect.speed}s`);
    
    // Temperature-based scanline variables
    root.style.setProperty('--temperature-scanline-color-shift', `${((emotionalTemperature - 5000) / 2000) * 30}deg`);
    root.style.setProperty('--musical-scanline-pulse', musicalIntensity.toString());
    
    // Advanced consciousness scanline effects
    if (consciousnessLevel > 0.7) {
      root.style.setProperty('--consciousness-scanline-interference', 'visible');
      root.style.setProperty('--consciousness-scanline-complexity', Math.min(1, (consciousnessLevel - 0.7) * 3.33).toString());
    } else {
      root.style.setProperty('--consciousness-scanline-interference', 'none');
      root.style.setProperty('--consciousness-scanline-complexity', '0');
    }
  }

  public setTransparency(transparency: number): void {
    this.holographicState.transparency = Math.max(0, Math.min(1, transparency))
  }

  public setChromaticAberration(chromatic: number): void {
    this.holographicState.chromatic = Math.max(0, Math.min(1, chromatic))
  }

  // Cleanup
  public destroy(): void {
    console.log('[HolographicUISystem] Destroying holographic UI system...')
    
    // Stop animation
    this.animationState.isAnimating = false
    
    // Clear holographic elements
    for (const [id, element] of this.holographicElements) {
      // Restore original styles
      element.element.style.opacity = '1'
      element.element.style.filter = ''
      element.element.style.background = ''
      element.element.style.boxShadow = ''
      element.element.style.transform = ''
      
      // Cancel animations
      if (element.animation) {
        element.animation.cancel()
      }
    }
    this.holographicElements.clear()
    
    // Remove interface container
    if (this.interfaceContainer && this.interfaceContainer.parentNode) {
      this.interfaceContainer.parentNode.removeChild(this.interfaceContainer)
    }
    
    // Remove CSS animations
    const animations = ['dataStreamAnimation', 'energyBarrierAnimation', 'scanlineAnimation']
    animations.forEach(animationId => {
      const style = document.getElementById(animationId)
      if (style) {
        style.remove()
      }
    })
    
    this.isInitialized = false
  }
}