/**
 * Unified Variable Groups - CSS Variable Group Definitions
 * 
 * This module defines the standardized CSS variable groups that align with
 * the unified system architecture. It provides type-safe access to variable
 * names and group management for the UnifiedCSSVariableManager.
 * 
 * @architecture Phase 1 of CSS module refactoring
 * @performance Enables priority-based CSS variable updates
 */

export type VariableGroup = 
  | 'music'
  | 'color'
  | 'background'
  | 'animation'
  | 'layout'
  | 'performance'
  | 'visual-effects'
  | 'utility';

export type VariablePriority = 'critical' | 'high' | 'normal' | 'low';

export interface VariableGroupDefinition {
  name: VariableGroup;
  priority: VariablePriority;
  description: string;
  variables: Record<string, {
    name: string;
    defaultValue: string;
    type: 'number' | 'string' | 'color' | 'time' | 'length' | 'angle' | 'percentage' | 'boolean';
    description: string;
    critical?: boolean; // Variables that need immediate DOM updates
  }>;
}

/**
 * Unified Variable Group Definitions
 * Maps CSS variable groups to their properties and metadata
 */
export const UNIFIED_VARIABLE_GROUPS: Record<VariableGroup, VariableGroupDefinition> = {
  music: {
    name: 'music',
    priority: 'critical',
    description: 'Real-time audio synchronization and beat detection',
    variables: {
      'beat.pulse.intensity': {
        name: '--sn-music-beat-pulse-intensity',
        defaultValue: '0',
        type: 'number',
        description: 'Current beat intensity (0-1)',
        critical: true
      },
      'beat.frequency': {
        name: '--sn-music-beat-frequency',
        defaultValue: '120',
        type: 'number',
        description: 'BPM value'
      },
      'beat.phase': {
        name: '--sn-music-beat-phase',
        defaultValue: '0',
        type: 'number',
        description: 'Current beat phase (0-1)'
      },
      'beat.confidence': {
        name: '--sn-music-beat-confidence',
        defaultValue: '0',
        type: 'number',
        description: 'Beat detection confidence (0-1)'
      },
      'spectrum.phase': {
        name: '--sn-music-spectrum-phase',
        defaultValue: '0deg',
        type: 'angle',
        description: 'Hue shift based on spectrum',
        critical: true
      },
      'spectrum.energy': {
        name: '--sn-music-spectrum-energy',
        defaultValue: '0',
        type: 'number',
        description: 'Overall energy level (0-1)'
      },
      'spectrum.bass': {
        name: '--sn-music-spectrum-bass',
        defaultValue: '0',
        type: 'number',
        description: 'Bass frequency energy (0-1)'
      },
      'spectrum.mids': {
        name: '--sn-music-spectrum-mids',
        defaultValue: '0',
        type: 'number',
        description: 'Mid frequency energy (0-1)'
      },
      'spectrum.treble': {
        name: '--sn-music-spectrum-treble',
        defaultValue: '0',
        type: 'number',
        description: 'Treble frequency energy (0-1)'
      },
      'animation.scale': {
        name: '--sn-music-animation-scale',
        defaultValue: '1',
        type: 'number',
        description: 'Breathing scale factor (0.95-1.05)',
        critical: true
      },
      'animation.rate': {
        name: '--sn-music-animation-rate',
        defaultValue: '4s',
        type: 'time',
        description: 'Breathing animation duration'
      },
      'rhythm.phase': {
        name: '--sn-music-rhythm-phase',
        defaultValue: '0',
        type: 'number',
        description: 'Rhythm phase (radians)',
        critical: true
      },
      'rhythm.intensity': {
        name: '--sn-music-rhythm-intensity',
        defaultValue: '0',
        type: 'number',
        description: 'Rhythm intensity (0-1)'
      },
      'tempo.bpm': {
        name: '--sn-music-tempo-bpm',
        defaultValue: '120',
        type: 'number',
        description: 'Current song BPM'
      },
      'energy.level': {
        name: '--sn-music-energy-level',
        defaultValue: '0.5',
        type: 'number',
        description: 'Song energy level (0-1)'
      },
      'valence': {
        name: '--sn-music-valence',
        defaultValue: '0.5',
        type: 'number',
        description: 'Song valence/mood (0-1)'
      },
      'danceability': {
        name: '--sn-music-danceability',
        defaultValue: '0.5',
        type: 'number',
        description: 'Song danceability (0-1)'
      }
    }
  },

  color: {
    name: 'color',
    priority: 'high',
    description: 'Dynamic color extraction and palette management',
    variables: {
      'accent.hex': {
        name: '--sn-color-accent-hex',
        defaultValue: '#cba6f7',
        type: 'color',
        description: 'Current accent color (hex)',
        critical: true
      },
      'accent.rgb': {
        name: '--sn-color-accent-rgb',
        defaultValue: '203, 166, 247',
        type: 'color',
        description: 'Current accent color (RGB)',
        critical: true
      },
      'accent.hsl': {
        name: '--sn-color-accent-hsl',
        defaultValue: '267, 84%, 81%',
        type: 'color',
        description: 'Current accent color (HSL)'
      },
      'accent.oklch': {
        name: '--sn-color-accent-oklch',
        defaultValue: '0.75, 0.15, 295',
        type: 'color',
        description: 'Current accent color (OKLCH)'
      },
      'extracted.primary.rgb': {
        name: '--sn-color-extracted-primary-rgb',
        defaultValue: '203, 166, 247',
        type: 'color',
        description: 'Primary extracted color from album art'
      },
      'extracted.secondary.rgb': {
        name: '--sn-color-extracted-secondary-rgb',
        defaultValue: '166, 227, 161',
        type: 'color',
        description: 'Secondary extracted color from album art'
      },
      'extracted.tertiary.rgb': {
        name: '--sn-color-extracted-tertiary-rgb',
        defaultValue: '250, 179, 135',
        type: 'color',
        description: 'Tertiary extracted color from album art'
      },
      'extracted.dominant.rgb': {
        name: '--sn-color-extracted-dominant-rgb',
        defaultValue: '203, 166, 247',
        type: 'color',
        description: 'Dominant extracted color from album art'
      },
      'extracted.vibrant.rgb': {
        name: '--sn-color-extracted-vibrant-rgb',
        defaultValue: '203, 166, 247',
        type: 'color',
        description: 'Vibrant extracted color from album art'
      },
      'harmony.complementary.rgb': {
        name: '--sn-color-harmony-complementary-rgb',
        defaultValue: '166, 227, 161',
        type: 'color',
        description: 'Complementary color harmony'
      },
      'harmony.analogous.rgb': {
        name: '--sn-color-harmony-analogous-rgb',
        defaultValue: '243, 166, 247',
        type: 'color',
        description: 'Analogous color harmony'
      },
      'harmony.triadic.rgb': {
        name: '--sn-color-harmony-triadic-rgb',
        defaultValue: '247, 203, 166',
        type: 'color',
        description: 'Triadic color harmony'
      },
      'harmony.blend.intensity': {
        name: '--sn-color-harmony-blend-intensity',
        defaultValue: '0.8',
        type: 'number',
        description: 'Color harmony blend intensity (0-1)'
      },
      'shift.hue': {
        name: '--sn-color-shift-hue',
        defaultValue: '0deg',
        type: 'angle',
        description: 'Global hue shift'
      },
      'shift.saturation': {
        name: '--sn-color-shift-saturation',
        defaultValue: '1',
        type: 'number',
        description: 'Global saturation multiplier'
      },
      'shift.lightness': {
        name: '--sn-color-shift-lightness',
        defaultValue: '1',
        type: 'number',
        description: 'Global lightness multiplier'
      },
      'shift.temperature': {
        name: '--sn-color-shift-temperature',
        defaultValue: '0',
        type: 'number',
        description: 'Color temperature (-1 to 1)'
      }
    }
  },

  background: {
    name: 'background',
    priority: 'normal',
    description: 'Gradient, WebGL, and background effects',
    variables: {
      'gradient.primary.rgb': {
        name: '--sn-bg-gradient-primary-rgb',
        defaultValue: '203, 166, 247',
        type: 'color',
        description: 'Primary gradient color'
      },
      'gradient.secondary.rgb': {
        name: '--sn-bg-gradient-secondary-rgb',
        defaultValue: '166, 227, 161',
        type: 'color',
        description: 'Secondary gradient color'
      },
      'gradient.tertiary.rgb': {
        name: '--sn-bg-gradient-tertiary-rgb',
        defaultValue: '250, 179, 135',
        type: 'color',
        description: 'Tertiary gradient color'
      },
      'gradient.opacity': {
        name: '--sn-bg-gradient-opacity',
        defaultValue: '0.15',
        type: 'number',
        description: 'Gradient opacity (0-1)'
      },
      'gradient.blur': {
        name: '--sn-bg-gradient-blur',
        defaultValue: '40px',
        type: 'length',
        description: 'Gradient blur radius'
      },
      'gradient.angle': {
        name: '--sn-bg-gradient-angle',
        defaultValue: '135deg',
        type: 'angle',
        description: 'Gradient angle'
      },
      'gradient.flow.direction': {
        name: '--sn-bg-gradient-flow-direction',
        defaultValue: '0deg',
        type: 'angle',
        description: 'Gradient flow direction'
      },
      'gradient.flow.speed': {
        name: '--sn-bg-gradient-flow-speed',
        defaultValue: '1',
        type: 'number',
        description: 'Gradient flow speed multiplier'
      },
      'webgl.ready': {
        name: '--sn-bg-webgl-ready',
        defaultValue: '0',
        type: 'boolean',
        description: 'WebGL system ready state (0/1)',
        critical: true
      },
      'webgl.quality': {
        name: '--sn-bg-webgl-quality',
        defaultValue: '1',
        type: 'number',
        description: 'WebGL quality level (0-1)'
      },
      'webgl.noise.scale': {
        name: '--sn-bg-webgl-noise-scale',
        defaultValue: '1',
        type: 'number',
        description: 'WebGL noise scale factor'
      },
      'webgl.noise.intensity': {
        name: '--sn-bg-webgl-noise-intensity',
        defaultValue: '0.1',
        type: 'number',
        description: 'WebGL noise intensity'
      },
      'webgl.flow.speed': {
        name: '--sn-bg-webgl-flow-speed',
        defaultValue: '0.5',
        type: 'number',
        description: 'WebGL flow animation speed'
      },
      'webgl.flow.direction': {
        name: '--sn-bg-webgl-flow-direction',
        defaultValue: '0deg',
        type: 'angle',
        description: 'WebGL flow direction'
      },
      'active-backend': {
        name: '--sn-bg-active-backend',
        defaultValue: 'css',
        type: 'string',
        description: 'Active background backend (css/webgl)',
        critical: true
      },
      'transition.duration': {
        name: '--sn-bg-transition-duration',
        defaultValue: '0.8s',
        type: 'time',
        description: 'Background transition duration'
      },
      'transition.easing': {
        name: '--sn-bg-transition-easing',
        defaultValue: 'ease-in-out',
        type: 'string',
        description: 'Background transition easing'
      }
    }
  },

  animation: {
    name: 'animation',
    priority: 'normal',
    description: 'Animation coordination and effects',
    variables: {
      'duration.fast': {
        name: '--sn-anim-duration-fast',
        defaultValue: '0.2s',
        type: 'time',
        description: 'Fast animation duration'
      },
      'duration.normal': {
        name: '--sn-anim-duration-normal',
        defaultValue: '0.4s',
        type: 'time',
        description: 'Normal animation duration'
      },
      'duration.slow': {
        name: '--sn-anim-duration-slow',
        defaultValue: '0.8s',
        type: 'time',
        description: 'Slow animation duration'
      },
      'duration.animation': {
        name: '--sn-anim-duration-animation',
        defaultValue: '4s',
        type: 'time',
        description: 'Breathing animation duration'
      },
      'easing.standard': {
        name: '--sn-anim-easing-standard',
        defaultValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
        type: 'string',
        description: 'Standard easing function'
      },
      'easing.decelerate': {
        name: '--sn-anim-easing-decelerate',
        defaultValue: 'cubic-bezier(0, 0, 0.2, 1)',
        type: 'string',
        description: 'Decelerate easing function'
      },
      'easing.accelerate': {
        name: '--sn-anim-easing-accelerate',
        defaultValue: 'cubic-bezier(0.4, 0, 1, 1)',
        type: 'string',
        description: 'Accelerate easing function'
      },
      'easing.bounce': {
        name: '--sn-anim-easing-bounce',
        defaultValue: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        type: 'string',
        description: 'Bounce easing function'
      },
      'motion.reduced': {
        name: '--sn-anim-motion-reduced',
        defaultValue: '0',
        type: 'boolean',
        description: 'Reduced motion preference (0/1)'
      },
      'motion.scale': {
        name: '--sn-anim-motion-scale',
        defaultValue: '1',
        type: 'number',
        description: 'Global animation scale factor'
      },
      'motion.blur': {
        name: '--sn-anim-motion-blur',
        defaultValue: '0',
        type: 'number',
        description: 'Motion blur intensity'
      },
      'frame.budget': {
        name: '--sn-anim-frame-budget',
        defaultValue: '16.67ms',
        type: 'time',
        description: 'Target frame budget'
      },
      'frame.priority': {
        name: '--sn-anim-frame-priority',
        defaultValue: 'normal',
        type: 'string',
        description: 'Animation priority level'
      },
      'frame.fps': {
        name: '--sn-anim-frame-fps',
        defaultValue: '60',
        type: 'number',
        description: 'Target frames per second'
      }
    }
  },

  layout: {
    name: 'layout',
    priority: 'normal',
    description: 'Layout, spacing, and responsive design',
    variables: {
      'sidebar.width': {
        name: '--sn-layout-sidebar-width',
        defaultValue: '280px',
        type: 'length',
        description: 'Sidebar width'
      },
      'sidebar.collapsed.width': {
        name: '--sn-layout-sidebar-collapsed-width',
        defaultValue: '72px',
        type: 'length',
        description: 'Collapsed sidebar width'
      },
      'sidebar.transition': {
        name: '--sn-layout-sidebar-transition',
        defaultValue: '0.3s',
        type: 'time',
        description: 'Sidebar transition duration'
      },
      'content.padding': {
        name: '--sn-layout-content-padding',
        defaultValue: '24px',
        type: 'length',
        description: 'Content padding'
      },
      'content.max-width': {
        name: '--sn-layout-content-max-width',
        defaultValue: '1200px',
        type: 'length',
        description: 'Content max width'
      },
      'content.gap': {
        name: '--sn-layout-content-gap',
        defaultValue: '16px',
        type: 'length',
        description: 'Content gap'
      },
      'card.border-radius': {
        name: '--sn-layout-card-border-radius',
        defaultValue: '12px',
        type: 'length',
        description: 'Card border radius'
      },
      'card.padding': {
        name: '--sn-layout-card-padding',
        defaultValue: '16px',
        type: 'length',
        description: 'Card padding'
      },
      'card.gap': {
        name: '--sn-layout-card-gap',
        defaultValue: '12px',
        type: 'length',
        description: 'Card gap'
      },
      'card.hover.lift': {
        name: '--sn-layout-card-hover-lift',
        defaultValue: '8px',
        type: 'length',
        description: 'Card hover lift distance'
      },
      'breakpoint.mobile': {
        name: '--sn-layout-breakpoint-mobile',
        defaultValue: '768px',
        type: 'length',
        description: 'Mobile breakpoint'
      },
      'breakpoint.tablet': {
        name: '--sn-layout-breakpoint-tablet',
        defaultValue: '1024px',
        type: 'length',
        description: 'Tablet breakpoint'
      },
      'breakpoint.desktop': {
        name: '--sn-layout-breakpoint-desktop',
        defaultValue: '1200px',
        type: 'length',
        description: 'Desktop breakpoint'
      }
    }
  },

  performance: {
    name: 'performance',
    priority: 'high',
    description: 'Performance monitoring and optimization',
    variables: {
      'mode': {
        name: '--sn-perf-mode',
        defaultValue: 'quality',
        type: 'string',
        description: 'Performance mode (quality/performance)'
      },
      'quality.level': {
        name: '--sn-perf-quality-level',
        defaultValue: '1',
        type: 'number',
        description: 'Quality level (0-1)'
      },
      'fps.target': {
        name: '--sn-perf-fps-target',
        defaultValue: '60',
        type: 'number',
        description: 'Target frames per second'
      },
      'frame.budget': {
        name: '--sn-perf-frame-budget',
        defaultValue: '16.67',
        type: 'number',
        description: 'Frame budget in milliseconds'
      },
      'gpu.acceleration.enabled': {
        name: '--sn-perf-gpu-acceleration-enabled',
        defaultValue: '1',
        type: 'boolean',
        description: 'GPU acceleration enabled (0/1)'
      },
      'gpu.memory.budget': {
        name: '--sn-perf-gpu-memory-budget',
        defaultValue: '100',
        type: 'number',
        description: 'GPU memory budget in MB'
      },
      'gpu.shader.quality': {
        name: '--sn-perf-gpu-shader-quality',
        defaultValue: '1',
        type: 'number',
        description: 'Shader quality level (0-1)'
      },
      'thermal.throttle': {
        name: '--sn-perf-thermal-throttle',
        defaultValue: '0',
        type: 'boolean',
        description: 'Thermal throttling active (0/1)'
      },
      'thermal.temperature': {
        name: '--sn-perf-thermal-temperature',
        defaultValue: '0',
        type: 'number',
        description: 'Estimated temperature (0-1)'
      },
      'thermal.threshold': {
        name: '--sn-perf-thermal-threshold',
        defaultValue: '0.8',
        type: 'number',
        description: 'Thermal threshold (0-1)'
      },
      'battery.saver': {
        name: '--sn-perf-battery-saver',
        defaultValue: '0',
        type: 'boolean',
        description: 'Battery saver mode (0/1)'
      },
      'battery.level': {
        name: '--sn-perf-battery-level',
        defaultValue: '1',
        type: 'number',
        description: 'Battery level (0-1)'
      },
      'battery.charging': {
        name: '--sn-perf-battery-charging',
        defaultValue: '0',
        type: 'boolean',
        description: 'Battery charging state (0/1)'
      }
    }
  },

  'visual-effects': {
    name: 'visual-effects',
    priority: 'normal',
    description: 'Consciousness fields and magnetic depth',
    variables: {
      'depth.field': {
        name: '--sn-visual-effects-depth-field',
        defaultValue: '800px',
        type: 'length',
        description: '3D perspective depth field'
      },
      'depth.near': {
        name: '--sn-visual-effects-depth-near',
        defaultValue: '12px',
        type: 'length',
        description: 'Near depth distance'
      },
      'depth.far': {
        name: '--sn-visual-effects-depth-far',
        defaultValue: '-10px',
        type: 'length',
        description: 'Far depth distance'
      },
      'depth.neutral': {
        name: '--sn-visual-effects-depth-neutral',
        defaultValue: '0px',
        type: 'length',
        description: 'Neutral depth position'
      },
      'field.intensity': {
        name: '--sn-visual-effects-field-intensity',
        defaultValue: '0.4',
        type: 'number',
        description: 'Consciousness field intensity (0-1)'
      },
      'field.animation.rate': {
        name: '--sn-visual-effects-field-animation-rate',
        defaultValue: '12s',
        type: 'time',
        description: 'Consciousness field animation rate'
      },
      'field.sensitivity': {
        name: '--sn-visual-effects-field-sensitivity',
        defaultValue: '0.8',
        type: 'number',
        description: 'Field response sensitivity (0-1)'
      },
      'bilateral.left.lead': {
        name: '--sn-visual-effects-bilateral-left-lead',
        defaultValue: '-150ms',
        type: 'time',
        description: 'Left sidebar lead time'
      },
      'bilateral.right.delay': {
        name: '--sn-visual-effects-bilateral-right-delay',
        defaultValue: '150ms',
        type: 'time',
        description: 'Right sidebar delay'
      },
      'bilateral.sync': {
        name: '--sn-visual-effects-bilateral-sync',
        defaultValue: '1',
        type: 'boolean',
        description: 'Bilateral sync enabled (0/1)'
      },
      'hover.pull': {
        name: '--sn-visual-effects-hover-pull',
        defaultValue: '12px',
        type: 'length',
        description: 'Hover pull distance'
      },
      'focus.pull': {
        name: '--sn-visual-effects-focus-pull',
        defaultValue: '18px',
        type: 'length',
        description: 'Focus pull distance'
      },
      'transition.speed': {
        name: '--sn-visual-effects-transition-speed',
        defaultValue: '0.6s',
        type: 'time',
        description: 'Consciousness transition speed'
      },
      'system.active': {
        name: '--sn-visual-effects-system-active',
        defaultValue: '1',
        type: 'boolean',
        description: 'Visual effects system active state (0/1)',
        critical: true
      },
      'level': {
        name: '--sn-visual-effects-level',
        defaultValue: '0.7',
        type: 'number',
        description: 'Overall visual effects level (0-1)'
      },
      'awareness.level': {
        name: '--sn-visual-effects-awareness-level',
        defaultValue: '0.5',
        type: 'number',
        description: 'User awareness level (0-1)'
      },
      'music.sync.strength': {
        name: '--sn-visual-effects-music-sync-strength',
        defaultValue: '0.7',
        type: 'number',
        description: 'Music synchronization strength (0-1)'
      },
      'interaction.mode': {
        name: '--sn-visual-effects-interaction-mode',
        defaultValue: '0',
        type: 'number',
        description: 'Current interaction mode (0-4)'
      },
      'focus.depth': {
        name: '--sn-visual-effects-focus-depth',
        defaultValue: '0.3',
        type: 'number',
        description: 'User focus depth (0-1)'
      },
      'content.engagement': {
        name: '--sn-visual-effects-content-engagement',
        defaultValue: '0.5',
        type: 'number',
        description: 'Content engagement level (0-1)'
      },
      'scroll.velocity': {
        name: '--sn-visual-effects-scroll-velocity',
        defaultValue: '0',
        type: 'number',
        description: 'Normalized scroll velocity (0-1)'
      },
      'dwell.time.factor': {
        name: '--sn-visual-effects-dwell-time-factor',
        defaultValue: '0',
        type: 'number',
        description: 'Dwell time factor (0-1)'
      },
      'interaction.pattern': {
        name: '--sn-visual-effects-interaction-pattern',
        defaultValue: '1',
        type: 'number',
        description: 'Interaction pattern type (0-3)'
      },
      'temporal.flow.direction.x': {
        name: '--sn-visual-effects-temporal-flow-direction-x',
        defaultValue: '0.5',
        type: 'number',
        description: 'Temporal flow X direction (0-1)'
      },
      'temporal.flow.direction.y': {
        name: '--sn-visual-effects-temporal-flow-direction-y',
        defaultValue: '0.5',
        type: 'number',
        description: 'Temporal flow Y direction (0-1)'
      },
      'memory.intensity': {
        name: '--sn-visual-effects-memory-intensity',
        defaultValue: '0.4',
        type: 'number',
        description: 'Memory pattern intensity (0-1)'
      },
      'fluidity.index': {
        name: '--sn-visual-effects-fluidity-index',
        defaultValue: '0.5',
        type: 'number',
        description: 'Membrane fluidity index (0-1)'
      },
      'genre.shift': {
        name: '--sn-visual-effects-genre-shift',
        defaultValue: '0.5',
        type: 'number',
        description: 'Genre-based visual effects shift (0-1)'
      },
      'user.interaction.detected': {
        name: '--sn-visual-effects-user-interaction-detected',
        defaultValue: '0',
        type: 'boolean',
        description: 'User interaction detected (0/1)'
      },
      'content.protection.level': {
        name: '--sn-visual-effects-content-protection-level',
        defaultValue: '0.95',
        type: 'number',
        description: 'Content protection level (0-1)'
      },
      'chrome.enhancement.level': {
        name: '--sn-visual-effects-chrome-enhancement-level',
        defaultValue: '2.0',
        type: 'number',
        description: 'Chrome enhancement level'
      }
    }
  },

  utility: {
    name: 'utility',
    priority: 'low',
    description: 'Utility classes and helper variables',
    variables: {
      'debug.enabled': {
        name: '--sn-debug-enabled',
        defaultValue: '0',
        type: 'boolean',
        description: 'Debug mode enabled (0/1)'
      },
      'debug.verbose': {
        name: '--sn-debug-verbose',
        defaultValue: '0',
        type: 'boolean',
        description: 'Verbose debug mode (0/1)'
      },
      'debug.performance': {
        name: '--sn-debug-performance',
        defaultValue: '0',
        type: 'boolean',
        description: 'Performance debug mode (0/1)'
      },
      'debug.grid.visible': {
        name: '--sn-debug-grid-visible',
        defaultValue: '0',
        type: 'boolean',
        description: 'Debug grid visible (0/1)'
      },
      'a11y.contrast.enhanced': {
        name: '--sn-a11y-contrast-enhanced',
        defaultValue: '0',
        type: 'boolean',
        description: 'Enhanced contrast mode (0/1)'
      },
      'a11y.focus.visible': {
        name: '--sn-a11y-focus-visible',
        defaultValue: '1',
        type: 'boolean',
        description: 'Focus visible (0/1)'
      },
      'a11y.motion.reduced': {
        name: '--sn-a11y-motion-reduced',
        defaultValue: '0',
        type: 'boolean',
        description: 'Reduced motion preference (0/1)'
      },
      'a11y.text.size.scale': {
        name: '--sn-a11y-text-size-scale',
        defaultValue: '1',
        type: 'number',
        description: 'Text size scale factor'
      },
      'feature.webgl.enabled': {
        name: '--sn-feature-webgl-enabled',
        defaultValue: '1',
        type: 'boolean',
        description: 'WebGL features enabled (0/1)'
      },
      'feature.visual-effects.enabled': {
        name: '--sn-feature-visual-effects-enabled',
        defaultValue: '1',
        type: 'boolean',
        description: 'Consciousness features enabled (0/1)'
      },
      'feature.music.sync.enabled': {
        name: '--sn-feature-music-sync-enabled',
        defaultValue: '1',
        type: 'boolean',
        description: 'Music sync enabled (0/1)'
      },
      'feature.animations.enabled': {
        name: '--sn-feature-animations-enabled',
        defaultValue: '1',
        type: 'boolean',
        description: 'Animations enabled (0/1)'
      },
      'feature.reading.mode.active': {
        name: '--sn-feature-reading-mode-active',
        defaultValue: '0',
        type: 'boolean',
        description: 'Reading mode active (0/1)'
      }
    }
  }
};

/**
 * Legacy Variable Mappings
 * Maps old variable names to new unified variable names
 */
export const LEGACY_VARIABLE_MAPPINGS: Record<string, string> = {
  // Beat sync legacy mappings
  '--sn-beat-pulse-intensity': '--sn-music-beat-pulse-intensity',
  '--sn-rhythm-phase': '--sn-music-rhythm-phase',
  '--sn-spectrum-phase': '--sn-music-spectrum-phase',
  '--sn-animation-scale': '--sn-music-animation-scale',
  '--sn-feed-bloom-intensity': '--sn-music-beat-pulse-intensity',
  
  // Color legacy mappings
  '--sn-accent-hex': '--sn-color-accent-hex',
  '--sn-accent-rgb': '--sn-color-accent-rgb',
  '--sn-gradient-primary-rgb': '--sn-bg-gradient-primary-rgb',
  '--sn-gradient-secondary-rgb': '--sn-bg-gradient-secondary-rgb',
  '--sn-gradient-accent-rgb': '--sn-color-accent-rgb',
  
  // Background legacy mappings
  '--sn-gradient-opacity': '--sn-bg-gradient-opacity',
  '--sn-gradient-blur': '--sn-bg-gradient-blur',
  '--sn-gradient-transition': '--sn-bg-transition-duration',
  
  // Consciousness legacy mappings
  '--magnetic-depth-field': '--sn-visual-effects-depth-field',
  '--magnetic-hover-pull': '--sn-visual-effects-hover-pull',
  '--magnetic-focus-pull': '--sn-visual-effects-focus-pull',
  '--magnetic-transition-speed': '--sn-visual-effects-transition-speed',
  '--visual-effects-field-intensity': '--sn-visual-effects-field-intensity',
  '--visual-effects-animation-rate': '--sn-visual-effects-field-animation-rate',
  
  // Animation legacy mappings
  '--sn-transition-timing-default': '--sn-anim-easing-standard',
  '--sn-transition-duration-fast': '--sn-anim-duration-fast',
  '--sn-transition-duration-normal': '--sn-anim-duration-normal',
  '--sn-transition-duration-slow': '--sn-anim-duration-slow',
  
  // Visual effects legacy mappings (DepthLayerController compatibility)
  '--visualEffects-system-active': '--sn-visual-effects-system-active',
  '--visualEffects-intensity': '--sn-visual-effects-field-intensity',
  '--visualEffects-level': '--sn-visual-effects-level',
  '--awareness-level': '--sn-visual-effects-awareness-level',
  '--musical-sync-intensity': '--sn-music-energy-level',
  '--musical-sync-strength': '--sn-visual-effects-music-sync-strength',
  '--reading-mode-active': '--sn-feature-reading-mode-active',
  '--user-interaction-detected': '--sn-visual-effects-user-interaction-detected',
  '--current-interaction-mode': '--sn-visual-effects-interaction-mode',
  '--focus-depth': '--sn-visual-effects-focus-depth',
  '--content-engagement': '--sn-visual-effects-content-engagement',
  '--scroll-velocity': '--sn-visual-effects-scroll-velocity',
  '--dwell-time-factor': '--sn-visual-effects-dwell-time-factor',
  '--interaction-pattern': '--sn-visual-effects-interaction-pattern',
  '--temporal-flow-direction-x': '--sn-visual-effects-temporal-flow-direction-x',
  '--temporal-flow-direction-y': '--sn-visual-effects-temporal-flow-direction-y',
  '--memory-intensity': '--sn-visual-effects-memory-intensity',
  '--genre-visualEffects-shift': '--sn-visual-effects-genre-shift',
  '--sn-fluidity-index': '--sn-visual-effects-fluidity-index',
  '--visualEffects-breath-rate': '--sn-visual-effects-field-animation-rate',
  '--content-protection-level': '--sn-visual-effects-content-protection-level',
  '--chrome-enhancement-level': '--sn-visual-effects-chrome-enhancement-level'
};

/**
 * Get variable definition by name
 */
export function getVariableDefinition(variableName: string): {
  group: VariableGroup;
  definition: VariableGroupDefinition['variables'][string];
} | null {
  for (const [groupName, group] of Object.entries(UNIFIED_VARIABLE_GROUPS)) {
    for (const [varKey, definition] of Object.entries(group.variables)) {
      if (definition.name === variableName) {
        return {
          group: groupName as VariableGroup,
          definition
        };
      }
    }
  }
  return null;
}

/**
 * Get all variables for a specific group
 */
export function getVariablesForGroup(groupName: VariableGroup): VariableGroupDefinition['variables'] {
  return UNIFIED_VARIABLE_GROUPS[groupName]?.variables || {};
}

/**
 * Get all critical variables across all groups
 */
export function getCriticalVariables(): string[] {
  const criticalVars: string[] = [];
  
  for (const group of Object.values(UNIFIED_VARIABLE_GROUPS)) {
    for (const variable of Object.values(group.variables)) {
      if (variable.critical) {
        criticalVars.push(variable.name);
      }
    }
  }
  
  return criticalVars;
}

/**
 * Convert legacy variable name to unified variable name
 */
export function convertLegacyVariable(legacyName: string): string {
  return LEGACY_VARIABLE_MAPPINGS[legacyName] || legacyName;
}

/**
 * Check if a variable is critical (needs immediate DOM updates)
 */
export function isVariableCritical(variableName: string): boolean {
  const definition = getVariableDefinition(variableName);
  return definition?.definition.critical || false;
}

/**
 * Get the priority for a variable group
 */
export function getGroupPriority(groupName: VariableGroup): VariablePriority {
  return UNIFIED_VARIABLE_GROUPS[groupName]?.priority || 'normal';
}

/**
 * Get default value for a variable
 */
export function getVariableDefaultValue(variableName: string): string {
  const definition = getVariableDefinition(variableName);
  return definition?.definition.defaultValue || '';
}

/**
 * Validate variable value based on type
 */
export function validateVariableValue(variableName: string, value: string): boolean {
  const definition = getVariableDefinition(variableName);
  if (!definition) return true; // Allow unknown variables
  
  const { type } = definition.definition;
  
  switch (type) {
    case 'number':
      return !isNaN(Number(value));
    case 'boolean':
      return value === '0' || value === '1';
    case 'time':
      return /^\d+(\.\d+)?(s|ms)$/.test(value);
    case 'length':
      return /^\d+(\.\d+)?(px|em|rem|vh|vw|%)$/.test(value);
    case 'angle':
      return /^\d+(\.\d+)?(deg|rad|turn)$/.test(value);
    case 'percentage':
      return /^\d+(\.\d+)?%$/.test(value);
    case 'color':
      return /^(#[0-9A-F]{6}|#[0-9A-F]{3}|\d+,\s*\d+,\s*\d+)$/i.test(value);
    case 'string':
      return true; // Any string is valid
    default:
      return true;
  }
}