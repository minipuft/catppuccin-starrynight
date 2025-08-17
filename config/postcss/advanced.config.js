/**
 * Advanced PostCSS Configuration for Maximum Optimization
 * 
 * This configuration applies comprehensive CSS optimization including:
 * - PurgeCSS for unused code removal
 * - Advanced rule merging and deduplication  
 * - Media query optimization
 * - Final cssnano optimization
 * 
 * Designed for production builds with maximum size reduction.
 */

const purgecssConfig = require('./purgecss.config.js');

module.exports = {
  plugins: [
    // === PHASE 1: STRUCTURAL OPTIMIZATION ===
    
    // Remove empty rules and declarations
    require('postcss-discard-empty')({
      removeEmpty: true,
      removeEmptyDeclarations: true
    }),

    // Remove duplicate rules and declarations
    require('postcss-discard-duplicates')(),

    // === PHASE 2: CONTENT OPTIMIZATION ===
    
    // PurgeCSS - Remove unused CSS selectors
    require('@fullhuman/postcss-purgecss')({
      ...purgecssConfig,
      
      // Production settings
      rejected: false,
      rejectedCss: false,
      
      // Enhanced extraction for better results
      defaultExtractor: content => {
        // Multi-pass extraction for better coverage
        const patterns = [
          // Standard classes and IDs
          /[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]/g,
          
          // CSS variables
          /--[a-zA-Z0-9-_]+/g,
          
          // Data attributes
          /data-[a-zA-Z0-9-_]+/g,
          
          // Spicetify patterns
          /(?:main|Root|spice)-[a-zA-Z0-9-_]+/g,
          
          // Theme patterns
          /(?:sn|catppuccin|starrynight)-[a-zA-Z0-9-_]+/g,
          
          // State patterns
          /[a-zA-Z0-9-_]*-(?:active|hover|focus|playing|selected)/g
        ];
        
        const matches = new Set();
        
        patterns.forEach(pattern => {
          const patternMatches = content.match(pattern) || [];
          patternMatches.forEach(match => matches.add(match));
        });
        
        return Array.from(matches);
      }
    }),

    // === PHASE 3: RULE OPTIMIZATION ===
    
    // Merge duplicate rules and selectors
    require('postcss-merge-rules')({
      preserve: false  // Allow aggressive merging for size reduction
    }),

    // Sort and optimize media queries
    require('postcss-sort-media-queries')({
      sort: 'mobile-first',  // Optimize for mobile-first approach
      configuration: {
        unitlessMqAlwaysFirst: true
      }
    }),

    // === PHASE 4: BROWSER COMPATIBILITY ===
    
    // Autoprefixer for Chromium compatibility
    require('autoprefixer')({
      overrideBrowserslist: [
        'Chrome >= 88'  // Spotify's Chromium baseline
      ],
      supports: false,
      flexbox: 'no-2009',
      grid: 'autoplace',
      // Remove outdated prefixes for size reduction
      remove: true
    }),

    // === PHASE 5: FINAL MINIFICATION ===
    
    // cssnano for aggressive final optimization
    require('cssnano')({
      preset: ['advanced', {
        // Advanced preset for maximum compression
        
        // Aggressive comment removal
        discardComments: {
          removeAll: true
        },
        
        // Advanced optimizations
        normalizeWhitespace: true,
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        convertValues: true,
        
        // Preserve critical Spicetify functionality
        normalizeString: { preferredQuote: 'double' },
        
        // Safe advanced optimizations
        reduceIdents: {
          // Preserve Spicetify-specific identifiers
          exclude: /^(main|Root|spice|sn)-/
        },
        
        // Z-index optimization with safety limits
        zindex: {
          startIndex: 1,
          exclude: [9999, 10000] // Preserve high z-indexes for overlays
        },
        
        // Remove duplicates after all other optimizations
        discardDuplicates: true,
        
        // Advanced CSS optimizations
        mergeLonghand: true,
        mergeRules: true,
        normalizeUrl: true,
        normalizeTimingFunctions: true,
        normalizeRepeatStyle: true,
        normalizePositions: true,
        
        // Preserve CSS variables (critical for theming)
        cssDeclarationSorter: {
          keepOverrides: true
        },
        
        // Disable problematic optimizations
        calc: false,  // Prevent CSS variable calc() issues
        colormin: {
          // Preserve theme color accuracy
          exclude: /^(--spice|--sn)-/
        }
      }]
    })
  ]
};