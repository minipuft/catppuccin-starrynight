/**
 * PostCSS Configuration for Catppuccin StarryNight Spicetify Theme
 * 
 * Optimized for Spicetify compatibility with:
 * - CSS custom properties preservation (--sn-*, --spice-*)
 * - Chromium browser compatibility
 * - Safe optimizations that don't break dynamic styling
 */

module.exports = {
  plugins: [
    // Autoprefixer for Chromium compatibility
    require('autoprefixer')({
      overrideBrowserslist: [
        'Chrome >= 88'  // Spotify's Chromium version baseline
      ],
      // Preserve CSS custom properties
      supports: false,
      flexbox: 'no-2009',
      grid: 'autoplace'
    }),

    // cssnano with Spicetify-safe configuration
    require('cssnano')({
      preset: ['default', {
        // Preserve all comments (some may be important for Spicetify)
        discardComments: {
          removeAll: false,
          removeAllButFirst: false
        },
        
        // Safe optimizations
        normalizeWhitespace: true,
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        
        // Preserve CSS custom properties (critical for Spicetify theming)
        normalizeString: { preferredQuote: 'double' },
        convertValues: {
          // Don't convert CSS custom properties
          ignore: ['--sn-*', '--spice-*']
        },
        
        // Safe minification that won't break Spicetify's dynamic CSS
        reduceIdents: false,  // Don't minify keyframe and counter names
        zindex: false,        // Don't optimize z-index values
        discardDuplicates: true,
        
        // Disable calc() optimization to prevent issues with CSS variables
        calc: false
      }]
    })
  ]
};