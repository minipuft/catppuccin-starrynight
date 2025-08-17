/**
 * PostCSS Configuration with PurgeCSS for Catppuccin StarryNight
 * 
 * This configuration includes PurgeCSS for aggressive size reduction
 * while maintaining full Spicetify compatibility through comprehensive safelisting.
 * 
 * Use this configuration only after thorough testing!
 */

const purgecssConfig = require('./purgecss-settings.js');

module.exports = {
  plugins: [
    // PurgeCSS - Remove unused CSS (FIRST)
    require('@fullhuman/postcss-purgecss')(purgecssConfig),

    // Autoprefixer for Chromium compatibility 
    require('autoprefixer')({
      overrideBrowserslist: [
        'Chrome >= 88'  // Spotify's Chromium version baseline
      ],
      supports: false,
      flexbox: 'no-2009',
      grid: 'autoplace'
    }),

    // cssnano for final optimization (LAST)
    require('cssnano')({
      preset: ['default', {
        // Conservative settings after PurgeCSS
        discardComments: {
          removeAll: false,
          removeAllButFirst: false
        },
        
        // Safe optimizations
        normalizeWhitespace: true,
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        
        // Preserve CSS custom properties (critical for Spicetify)
        normalizeString: { preferredQuote: 'double' },
        convertValues: {
          ignore: ['--sn-*', '--spice-*']
        },
        
        // Conservative minification after PurgeCSS
        reduceIdents: false,
        zindex: false,
        discardDuplicates: true,
        
        // Disable calc() optimization to prevent CSS variable issues
        calc: false
      }]
    })
  ]
};