/**
 * PurgeCSS Configuration for Catppuccin StarryNight Spicetify Theme
 * 
 * Carefully configured to preserve all Spicetify-essential classes while
 * removing unused CSS to achieve maximum size reduction safely.
 */

const path = require('path');

module.exports = {
  // Content sources to analyze for class usage
  content: [
    './src-js/**/*.{ts,tsx}',      // TypeScript source files
    './src/**/*.scss',              // SCSS source files  
    './theme.js',                   // Compiled JavaScript theme
    './user.css'                    // Current CSS for cross-references
  ],

  // Advanced content extraction for dynamic class generation
  defaultExtractor: content => {
    // Standard class extraction
    const classes = content.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]/g) || [];
    
    // CSS variable extraction
    const cssVars = content.match(/--[a-zA-Z0-9-_]+/g) || [];
    
    // Data attribute extraction  
    const dataAttrs = content.match(/data-[a-zA-Z0-9-_]+/g) || [];
    
    // Spicetify-specific patterns
    const spicetifyPatterns = content.match(/(?:main|Root|spice)-[a-zA-Z0-9-_]+/g) || [];
    
    return [...classes, ...cssVars, ...dataAttrs, ...spicetifyPatterns];
  },

  // Comprehensive safelist for Spicetify compatibility
  safelist: {
    // Always preserve these exact classes
    standard: [
      // Core Spicetify variables (critical for theming)
      'spice', 'spicetify',
      
      // Essential utility classes
      'hidden', 'visible', 'active', 'inactive', 'disabled', 'enabled',
      'loading', 'loaded', 'error', 'success', 'warning', 'info',
      
      // Animation states
      'animate', 'transition', 'transform',
      
      // Layout essentials
      'container', 'grid', 'flex'
    ],

    // Pattern-based preservation (regex)
    greedy: [
      // === SPICETIFY CORE PATTERNS ===
      /^main-/,                    // All main-* classes (Spicetify UI)
      /^Root/,                     // All Root* classes (Spicetify Root)
      /^spice-/,                   // All spice-* classes
      /^--spice-/,                 // All --spice-* CSS variables

      // === THEME PATTERNS ===
      /^sn-/,                      // StarryNight theme classes
      /^catppuccin-/,              // Catppuccin theme classes
      /^starrynight-/,             // Alternative theme naming

      // === STATE PATTERNS ===
      /-active$/,                  // Interactive states
      /-hover$/,
      /-focus$/,
      /-disabled$/,
      /-selected$/,
      /-playing$/,                 // Music playback states
      /-paused$/,
      /-buffering$/,

      // === VISUAL EFFECT PATTERNS ===
      /^glow-/,                    // Glow effects
      /^shimmer-/,                 // Shimmer effects  
      /^pulse-/,                   // Pulse animations
      /^fade-/,                    // Fade transitions
      /^slide-/,                   // Slide animations
      /^bounce-/,                  // Bounce effects

      // === MUSIC SYNC PATTERNS ===
      /^beat-/,                    // Beat synchronization
      /^music-/,                   // Music-related classes
      /^audio-/,                   // Audio visualization
      /^sync-/,                    // Synchronization classes
      /^tempo-/,                   // Tempo-based classes
      /^rhythm-/,                  // Rhythm classes

      // === LAYOUT PATTERNS ===
      /^grid-/,                    // Grid layout
      /^flex-/,                    // Flexbox layout
      /^container-/,               // Container classes
      /^wrapper-/,                 // Wrapper classes

      // === RESPONSIVE PATTERNS ===
      /^mobile-/,                  // Mobile-specific
      /^tablet-/,                  // Tablet-specific
      /^desktop-/,                 // Desktop-specific
      /^responsive-/,              // Responsive utilities

      // === PERFORMANCE PATTERNS ===
      /^optimized-/,               // Performance optimizations
      /^cached-/,                  // Cached elements
      /^preload-/,                 // Preloaded content
      /^lazy-/,                    // Lazy loading

      // === DYNAMIC CONTENT PATTERNS ===
      /^artist-/,                  // Artist pages
      /^album-/,                   // Album pages
      /^playlist-/,                // Playlist pages
      /^track-/,                   // Track elements
      /^episode-/,                 // Podcast episodes
      /^show-/,                    // Podcast shows

      // === INTERACTION PATTERNS ===
      /^drag-/,                    // Drag and drop
      /^drop-/,                    // Drop zones
      /^tooltip-/,                 // Tooltips
      /^modal-/,                   // Modals
      /^popup-/,                   // Popups

      // === CSS CUSTOM PROPERTIES ===
      /^--sn-/,                    // StarryNight variables
      /^--catppuccin-/,            // Catppuccin variables
      /^--/                        // All CSS variables (safe fallback)
    ],

    // Deep scanning patterns for nested selectors
    deep: [
      // Data attributes (essential for Spicetify functionality)
      /^data-/,
      
      // Pseudo-classes and elements
      /^:/,
      
      // CSS at-rules
      /@/,
      
      // Attribute selectors
      /^\[/,
      
      // Complex selectors
      /\s/
    ]
  },

  // Advanced options for Spicetify compatibility
  variables: true,                 // Always preserve CSS variables
  keyframes: true,                // Preserve animation keyframes
  fontFace: true,                 // Preserve font declarations
  
  // Rejected selector analysis (for debugging)
  rejected: false,                // Set to true for debugging
  rejectedCss: false,             // Set to true to see what was removed

  // Blocklist (selectors to always remove)
  blocklist: [
    // Remove development-only classes
    /^debug-/,
    /^test-/,
    /^dev-/,
    
    // Remove commented-out styles
    /\/\*/,
    
    // Remove source map references
    /sourceMappingURL/
  ]
};