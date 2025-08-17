/**
 * PurgeCSS Debug Configuration
 * 
 * This configuration enables debugging to see what PurgeCSS is actually removing
 */

const purgecssConfig = require('./purgecss-settings.js');

module.exports = {
  plugins: [
    // PurgeCSS with debugging enabled
    require('@fullhuman/postcss-purgecss')({
      ...purgecssConfig,
      
      // Enable debugging
      rejected: true,
      rejectedCss: true,
      
      // More aggressive settings for testing
      safelist: {
        // Reduced standard safelist for testing
        standard: [
          'spice', 'spicetify',
          'active', 'inactive', 'hidden', 'visible'
        ],

        // Keep critical patterns but reduce some
        greedy: [
          /^main-/,
          /^Root/,
          /^spice-/,
          /^--spice-/,
          /^sn-/,
          /^--sn-/,
          /-active$/,
          /-hover$/,
          /-playing$/
        ],

        deep: [
          /^data-/,
          /^--/,
          /^:/,
          /@/
        ]
      }
    })
  ]
};