# 🎨 Color Harmony Engine Documentation

## Overview

The Color Harmony Engine is the core component of the Year 3000 dynamic color system, responsible for extracting colors from album art and applying them throughout the Spicetify interface with proper RGB variable support for gradients and transparency effects.

## ✅ **MAJOR UPDATE (January 2025): Complete RGB Variable System**

### Critical Discovery: RGB Variables for Gradients

**The Problem Solved**: SCSS gradients using `rgba(var(--variable-rgb), opacity)` format require RGB values, not hex values. This was the primary cause of gradient failures in dynamic themes.

**The Solution Implemented**: Complete RGB variable pipeline that automatically generates both hex and RGB versions of all color variables.

### Enhanced RGB Variable Generation

The Color Harmony Engine now automatically generates RGB versions of ALL spice variables that SCSS files expect:

```javascript
// Generate RGB versions of all spice variables for SCSS compatibility
addRgb("--spice-rgb-accent", accentHex);
addRgb("--spice-rgb-button", accentHex);

// Generate RGB versions of existing spice variables by reading their current hex values
const root = this.utils.getRootStyle();
if (root) {
  const computedStyle = getComputedStyle(root);

  // Helper to safely get and convert existing spice variables to RGB
  const addSpiceRgb = (
    rgbProp: string,
    hexProp: string,
    fallbackHex: string
  ) => {
    const hexValue =
      computedStyle.getPropertyValue(hexProp).trim() || fallbackHex;
    addRgb(rgbProp, hexValue);
  };

  // Add RGB versions of all spice variables that SCSS files expect
  addSpiceRgb("--spice-rgb-main", "--spice-main", "#cdd6f4");
  addSpiceRgb("--spice-rgb-base", "--spice-base", "#1e1e2e");
  addSpiceRgb("--spice-rgb-player", "--spice-player", "#181825");
  addSpiceRgb("--spice-rgb-sidebar", "--spice-sidebar", "#313244");
  addSpiceRgb("--spice-rgb-surface0", "--spice-surface0", "#313244");
  addSpiceRgb("--spice-rgb-surface1", "--spice-surface1", "#45475a");
  addSpiceRgb("--spice-rgb-text", "--spice-text", "#cdd6f4");
}
```

### Dynamic Accent System Integration

**New Central Variable**: `--sn-dynamic-accent-rgb` serves as the unified variable that all visual systems reference:

```scss
// Central dynamic accent variable with comprehensive fallback chain
--sn-dynamic-accent-rgb: var(--sn-gradient-accent-rgb, var(--spice-rgb-accent));

// Usage in SCSS with proper fallbacks
background: rgba(
  var(--sn-gradient-primary-rgb, var(--sn-dynamic-accent-rgb, 202, 158, 230)),
  0.12
);
```

---

## 🧬 Implementation Details

The **Color Harmony Engine** is implemented as a JavaScript class named `ColorHarmonyEngine` within the main theme script: `theme.js`.

**Key Points:**

- **Location**: The class definition for `ColorHarmonyEngine` can be found in `theme.js` (starting around line 844 in a typical version).
- **Instantiation**: An instance of the engine is created within `theme.js` (around line 2126) as part of a larger `year3000System` object. It's typically accessible as `year3000System.harmonyEngine` after the theme's core systems are initialized.
  ```javascript
  // Simplified example from theme.js
  const year3000System = {
    // ... other systems ...
    harmonyEngine: new ColorHarmonyEngine(),
    // ...
  };
  ```
- **Dependencies**:
  - **`YEAR3000_CONFIG`**: The engine relies on this global configuration object (also defined in `theme.js`) for settings like the current "Artistic Mode" (`YEAR3000_CONFIG.artisticMode` or `YEAR3000_CONFIG.loadArtisticPreference()`) and music energy multipliers (`YEAR3000_CONFIG.getCurrentMultipliers()`), which dynamically influence its behavior.
  - **`Year3000Utilities`**: It utilizes helper functions from this utility object (e.g., `Year3000Utilities.hexToRgb`, `Year3000Utilities.rgbToHsl`, `Year3000Utilities.calculateContrastRatio`) for color conversions and calculations.

---

## 🔧 Utilizing the Engine

To leverage the Color Harmony Engine in your theme modules or custom extensions, follow these general steps:

1.  **Access the Engine Instance**:
    Once the Spicetify theme script (`theme.js`) has loaded and initialized its core components, the Color Harmony Engine should be accessible, typically via a global or semi-global object. In the context of `theme.js`, it's part of the `year3000System` object:

    ```javascript
    const engine = year3000System.harmonyEngine;
    ```

2.  **Core Workflow for Color Processing**:

        a. **Obtain Raw Colors**: Extract initial colors from the source (e.g., album artwork using `Spicetify.colorExtractor` or other means). This will be an object with color roles like `VIBRANT`, `DARK_VIBRANT`, etc.

        b. **(Optional) Gather Music Context**: If you want the blending to be influenced by musical characteristics, obtain the music's energy and valence values.

        c. **Harmonize & Blend Colors**: Use the `blendWithCatppuccin` method to get a Catppuccin-aware, harmonized palette. This method automatically considers the current "Artistic Mode" and `vibrancyConfig`.
        `javascript

    const extractedColors = { VIBRANT: "#ff0000", DARK*VIBRANT: "#800000", /* ... \_/ };
    const musicContext = { energy: 0.7, valence: 0.6 }; // Optional
    const harmonizedPalette = engine.blendWithCatppuccin(extractedColors, musicContext);
    // harmonizedPalette will contain harmonized hex color strings for VIBRANT, etc.
    `

        d. **Validate Colors for Specific UI Contexts**: For critical UI elements (like text, search fields, buttons), validate if a chosen color (either an original extracted color or a harmonized one) is suitable for its specific use case.

        ````javascript
        const colorForSearchText = harmonizedPalette.VIBRANT || extractedColors.VIBRANT;
        const validationResult = engine.validateColorHarmony(colorForSearchText, 'search');

            if (validationResult.valid) {
              // Color is suitable for search context
            } else {
              // Color is not suitable, consider recommendations or fallbacks
              console.warn("Color validation failed for search:", validationResult.recommendations);
              // Implement fallback logic here, e.g., use a default Catppuccin accent
            }
            ```
            Refer to the `validateColorHarmony` API documentation for available contexts and the structure of `validationResult`.

        e. **Apply Colors (Set CSS Variables)**: Use the processed (harmonized and/or validated) colors to update CSS custom properties, which your SCSS/CSS rules will then use. Remember to set both HEX and RGB versions if gradients or transparency effects depend on them.
        ```javascript
        const root = document.documentElement;
        const primaryColorHex = harmonizedPalette.VIBRANT;
        const primaryColorRgb = Year3000Utilities.hexToRgb(primaryColorHex);

            root.style.setProperty('--my-dynamic-color-hex', primaryColorHex);
            if (primaryColorRgb) {
              root.style.setProperty('--my-dynamic-color-rgb', `${primaryColorRgb.r},${primaryColorRgb.g},${primaryColorRgb.b}`);
            }
            ```

        ````

3.  **Key Configuration Considerations**:

    - **Artistic Modes**: The behavior of the Color Harmony Engine, especially its validation thresholds (`contextRequirements`) and blending ratios (`vibrancyConfig.getBlendRatio`), is significantly influenced by the "Artistic Mode" (e.g., `"corporate-safe"`, `"artist-vision"`, `"cosmic-maximum"`). This mode is typically managed by `YEAR3000_CONFIG.setArtisticMode(mode)` and loaded via `YEAR3000_CONFIG.loadArtisticPreference()`. Ensure the desired mode is active for your use case.
    - **`vibrancyConfig`**: This object within the engine instance holds crucial parameters (like `defaultBlendRatio`, `contrastBoostIntensity`, `harmonyTolerance`). While most are used internally by methods like `blendWithCatppuccin` and `validateColorHarmony`, understanding `contrastBoostIntensity` (currently `2.2`) is important. Your UI components (especially SCSS) might need to apply this boost factor to ensure visibility for critical elements, particularly in search contexts.
    - **CSS Variables for RGB**: If your SCSS uses `rgba(var(--some-color-rgb), opacity)`, ensure you are setting the `*-rgb` CSS variables with comma-separated R,G,B values after processing colors through the engine.

---

## 🏗️ Architecture

### Core Components

```javascript
// Main harmony engine class
ColorHarmonyEngine {
  // Catppuccin palette definitions for all variants
  catppuccinPalettes: {
    frappe: { accents: {...}, neutrals: {...} },
    latte: { accents: {...}, neutrals: {...} },
    macchiato: { accents: {...}, neutrals: {...} },
    mocha: { accents: {...}, neutrals: {...} }
  },

  // Core validation and blending methods
  validateColorHarmony(color, context),
  blendWithCatppuccin(extractedColors, musicContext),
  findBestHarmoniousAccent(rgb, palette),

  // Performance monitoring
  harmonyMetrics: { validations, harmonizations, blends, performance }
}
```

### Integration Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Album Artwork  │───▶│  Spicetify API   │───▶│ Color Extraction│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Search UI     │◀───│ Harmony Engine   │◀───│ Raw Colors      │
│   Visibility    │    │   Validation     │    │ Validation      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ CSS Variables   │◀───│ Catppuccin       │◀───│ Color Blending  │
│ Application     │    │ Palette Mixing   │    │ Algorithms      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🔬 How It Works

The Color Harmony Engine's functionality, as implemented in `theme.js`, relies on configurations from `YEAR3000_CONFIG` (e.g., for artistic mode selection) and utility functions from `Year3000Utilities` (e.g., for color conversions and contrast calculations).

### 1. Color Validation Process

The engine validates extracted colors against context-specific requirements. These requirements are defined within the `validateColorHarmony` method in `theme.js` and are influenced by the currently selected "Artistic Mode".

**Base Context Requirements (from `theme.js`):**

```javascript
// 🎨 ARTISTIC REQUIREMENTS - Bold Expression Over Corporate Safety
const contextRequirements = {
  general: {
    minContrast: 1.8, // BOLD! Down from paranoid 2.5
    minHarmony: this.vibrancyConfig.harmonyTolerance, // Uses artistic 0.35
  },
  search: {
    minContrast: 2.8, // ARTISTIC! Down from paranoid 3.5
    minHarmony: 0.4, // PERMISSIVE! Down from restrictive 0.6
  },
  navigation: {
    minContrast: 2.5, // EXPRESSIVE! Down from 3.5
    minHarmony: 0.45, // FREEDOM! Down from 0.65
  },
  text: {
    minContrast: 4.5, // READABLE! Down from excessive 6.0
    minHarmony: 0.6, // BALANCED! Down from 0.8
  },
  accent: {
    minContrast: 1.5, // VIBRANT! Down from 2.5
    minHarmony: 0.3, // ARTISTIC! Down from 0.5
  },
};
```

**Dynamic Adjustments via Artistic Modes:**
The base `contextRequirements` are dynamically adjusted based on the active "Artistic Mode" (retrieved from `YEAR3000_CONFIG.artisticMode`):

- **`cosmic-maximum`**: Requirements become significantly more permissive (e.g., `minContrast *= 0.7`, `minHarmony *= 0.6`).
- **`artist-vision`**: Requirements become moderately more permissive (e.g., `minContrast *= 0.85`, `minHarmony *= 0.8`).
- **`corporate-safe`**: Base requirements are used without adjustment.

**Validation Steps:**

1.  **Contrast Checking**: Calculates contrast ratio against the theme's base background color using `Year3000Utilities.calculateContrastRatio`.
2.  **Harmony Analysis**: Measures color relationships with the current Catppuccin palette using `calculateHarmonyScore`.
3.  **Context Validation**: Ensures colors meet the (potentially artistically-adjusted) requirements for the given context (e.g., search, navigation).
4.  **Accessibility Compliance**: While specific WCAG level targeting isn't explicitly stated as a boolean, the contrast and harmony checks aim to ensure usability and readability.

### 2. Intelligent Blending Algorithm

The engine blends extracted colors with harmonious Catppuccin accents, driven by a detailed `vibrancyConfig` object defined in its constructor in `theme.js`. This configuration emphasizes "Artistic Boldness".

**Core `vibrancyConfig` (from `theme.js`):**

```javascript
// 🌌 REVOLUTIONARY BLENDING CONFIGURATION - Year 3000 Artistic Boldness
this.vibrancyConfig = {
  defaultBlendRatio: 0.95, // BOLD! 95% extracted color dominance
  minimumSaturation: 0.6, // DEMAND VIBRANCY!
  maximumDesaturation: 0.05, // PREVENT COLOR DEATH!
  contrastBoostIntensity: 2.2, // STRONGER CONTRAST!
  harmonyTolerance: 0.35, // ARTISTIC FREEDOM!

  // 🎨 NEW: Artistic Enhancement Factors
  artisticSaturationBoost: 1.2, // 20% saturation enhancement
  cosmicLuminanceBoost: 1.15, // 15% luminance boost
  energyResponsiveness: 0.8, // How music energy affects color intensity

  // 🌟 Dynamic Blending Based on Artistic Mode
  getBlendRatio(artisticMode = "artist-vision") {
    const ratios = {
      "corporate-safe": 0.75, // Conservative: 75% extracted
      "artist-vision": 0.95, // Bold: 95% extracted (default)
      "cosmic-maximum": 0.98, // Maximum: 98% extracted!
    };
    return ratios[artisticMode] || this.defaultBlendRatio;
  },

  // 🎵 Music-Driven Intensity Scaling
  getMusicIntensityMultiplier(energy = 0.5, valence = 0.5) {
    const baseMultiplier =
      YEAR3000_CONFIG.getCurrentMultipliers().musicEnergyBoost;
    const energyBoost = energy > 0.7 ? 1.3 : energy > 0.4 ? 1.0 : 0.8;
    const valenceBoost = valence > 0.6 ? 1.2 : valence < 0.4 ? 0.9 : 1.0;
    return baseMultiplier * energyBoost * valenceBoost;
  },
};
```

**Blending Process & Factors:**

1.  **Select Best Accent**: `findBestHarmoniousAccent` identifies the most compatible Catppuccin accent for the extracted color.
2.  **Determine Blend Ratio**: The `vibrancyConfig.getBlendRatio(artisticMode)` method determines the mix percentage between the extracted color and the Catppuccin accent, heavily favoring the extracted color in modes like `artist-vision` (95%) and `cosmic-maximum` (98%).
3.  **Music Influence**: `vibrancyConfig.getMusicIntensityMultiplier(energy, valence)` can further modulate color intensity based on the music's characteristics, using a base multiplier from `YEAR3000_CONFIG`.
4.  **Harmonize Colors**: `blendColors(extractedRgb, accentRgb, ratio)` creates the final harmonized color.
5.  **Enhancements**: Additional factors like `artisticSaturationBoost` and `cosmicLuminanceBoost` are part of the `vibrancyConfig`, suggesting further processing steps or considerations in color manipulation, although their direct application point isn't shown in the `blendColors` method itself.

**Key Blending Factors (derived from `vibrancyConfig`):**

- **Artistic Mode**: Significantly influences the blend ratio (how much of the extracted color is used).
- **Music Energy & Valence**: Can scale color intensity.
- **Configured Saturation/Desaturation Limits**: Ensures colors remain vibrant and don't become washed out.
- **Harmony Tolerance**: Defines how "harmonious" a color needs to be with the palette.

### 3. Search Safety Integration

Special handling for search interface components ensures visibility, primarily through context-specific validation requirements and potential contrast boosting.

- **Contextual Requirements**: The `validateColorHarmony` method uses specific `minContrast` (e.g., 2.8 for 'search') and `minHarmony` (e.g., 0.4 for 'search') values, which are further adjusted by the selected "Artistic Mode".
- **Contrast Boosting**: The `vibrancyConfig` includes a `contrastBoostIntensity: 2.2`. While the `COLOR_HARMONY_ENGINE.md` previously showed an SCSS variable `--sn-search-contrast-boost`, the primary mechanism for defining this boost now resides in the JavaScript `vibrancyConfig`. This intensity factor is likely used by other parts of the theme system or utility functions when applying colors to UI elements, especially critical ones like search.
- **SCSS Usage**: SCSS rules can still leverage a contrast boost variable, which would ideally be set based on the `contrastBoostIntensity` from the engine's configuration. For example:
  ```scss
  // Search-specific variables with harmony boost
  // --sn-search-contrast-boost would ideally be influenced by
  // vibrancyConfig.contrastBoostIntensity
  --sn-search-intensity-boosted: calc(
    var(--sn-search-intensity) * var(--sn-search-contrast-boost, 1)
  );
  ```
- **Fallback Colors**: The system aims for harmonious blends, but if validation consistently fails, other theme mechanisms would be responsible for applying truly safe fallback Catppuccin colors.
- **Module Integration**: Search modules (`_sn_search_precision.scss`, `_sn_search_quantum.scss`) are expected to use CSS variables that can be influenced by these harmony and contrast settings.

---

## 🎨 Catppuccin Palette Integration

### Theme Detection

The engine automatically detects the current Catppuccin variant:

```javascript
detectCurrentTheme() {
  const rootStyle = getComputedStyle(document.documentElement);
  const baseColor = rootStyle.getPropertyValue('--spice-main').trim();

  const themeMap = {
    '303446': 'frappe',
    'EFF1F5': 'latte',
    '24273A': 'macchiato',
    '1e1e2e': 'mocha'
  };

  return themeMap[baseColor] || 'mocha';
}
```

### Harmonious Color Selection

For each extracted color, the engine finds the most compatible Catppuccin accent:

```javascript
// Harmony scoring based on HSL relationships
const harmoniousAngles = [0, 30, 60, 120, 150, 180, 210, 240, 300, 330];
const isHarmonious = harmoniousAngles.some(
  (angle) => Math.abs(hueDiff - angle) < 15
);

// Priority order for accent selection
const accentPriority = ["mauve", "lavender", "blue", "sapphire", "sky"];
```

---

## 🔌 API Reference

### Debug Interface

The harmony engine provides a comprehensive debug interface:

```javascript
// Core testing functions
Year3000Debug.testHarmonyEngine(); // Test color validation system
Year3000Debug.testCatppuccinBlending(); // Test color blending algorithms
Year3000Debug.testSearchSafety(); // Test search visibility validation
Year3000Debug.testThemeDetection(); // Test theme variant detection

// Search integration testing
Year3000Debug.testSearchModulesIntegration(); // Test both search modules
Year3000Debug.testSearchVisibility(); // Quick visual verification

// Performance and monitoring
Year3000Debug.getPerformanceMetrics(); // Performance analysis
Year3000Debug.clearAllCaches(); // Clear all caches
```

### Color Validation API

```javascript
// Validate a color for specific context
const validation = harmonyEngine.validateColorHarmony('#e74c3c', 'search');

// Returns:
{
  valid: boolean,              // Overall validation result
  contrastRatio: number,       // Calculated contrast ratio
  harmonyScore: number,        // Harmony with Catppuccin palette
  meetsContrast: boolean,      // Meets contrast requirements
  isHarmonious: boolean,       // Harmonious with palette
  recommendations: string[]   // Improvement suggestions
}
```

### Color Blending API

```javascript
// Blend extracted colors with Catppuccin palette
const harmonized = harmonyEngine.blendWithCatppuccin(
  extractedColors,
  musicContext  // Optional music analysis data
);

// Returns harmonized color palette
{
  VIBRANT: '#harmonized_color',
  DARK_VIBRANT: '#harmonized_color',
  LIGHT_VIBRANT: '#harmonized_color',
  // ... other color roles
}
```

---

## ⚡ Performance Characteristics

### Processing Times

- **Color Validation**: ~2-5ms per color
- **Catppuccin Blending**: ~1-3ms per color
- **Theme Detection**: ~0.5ms (cached)
- **Total Per Song**: ~10-20ms overhead

### Optimization Features

- **Result Caching**: Validation results cached per color
- **Theme Persistence**: Current theme cached for session
- **Lazy Computation**: HSL conversions computed on demand
- **Performance Monitoring**: Built-in timing metrics

### Memory Usage

- **Palette Storage**: ~5KB for all Catppuccin variants
- **Cache Size**: ~50KB for 100 cached validations
- **Runtime Overhead**: <1MB total memory footprint

---

## 🧪 Testing & Validation

### Test Scenarios

The engine handles problematic color scenarios:

```javascript
// Test with dark colors that cause search invisibility
const darkScenarios = [
  { name: "Nearly Black", color: "#0a0a0a" },
  { name: "Dark Gray", color: "#333333" },
  { name: "Theme Background", color: "#1e1e2e" },
  { name: "Very Dark Blue", color: "#0f0f23" },
];

// Test with light colors on light themes
const lightScenarios = [
  { name: "Nearly White", color: "#f8f8f8" },
  { name: "Light Gray", color: "#e8e8e8" },
  { name: "Pale Yellow", color: "#fffacd" },
];
```

### Validation Results

Each test returns comprehensive validation data:

```javascript
{
  scenario: 'Dark Album Art',
  originalColor: '#1a1a1a',
  harmonizedColor: '#6c5ce7',
  searchValidation: {
    valid: true,
    contrastRatio: 5.2,
    meetsSearchRequirements: true
  },
  contrastBoost: 1.5,
  harmonyScore: 0.8,
  wouldBeVisible: true
}
```

---

## 🔗 Module Integration

### Search Modules Enhanced

Both search modules now integrate with the harmony engine:

**Precision Module (`_sn_search_precision.scss`)**:

```scss
// Harmony-boosted intensity variables
--sn-search-intensity-boosted: calc(
  var(--sn-search-intensity) * var(--sn-search-contrast-boost, 1)
);

// Applied to search elements
background: rgba(
  var(--sn-search-gradient-primary-rgb),
  var(--sn-search-intensity-boosted)
);
```

**Quantum Module (`_sn_search_quantum.scss`)**:

```scss
// Harmony boost for quantum effects
background: rgba(
  var(--sn-search-gradient-primary-rgb),
  calc(0.8 * var(--sn-search-contrast-boost, 1))
);
```

### Compatible Modules

The following modules already use harmony RGB variables:

- ✅ `_sn_gradient.scss` - Core gradient system
- ✅ `_sn_enhanced_cards.scss` - Card interactions
- ✅ `_sn_header_actionBar.scss` - Header elements
- ✅ `_sn_loading.scss` - Loading states
- ✅ `_sn_atmospheric.scss` - Atmospheric effects
- ✅ `_main.scss` - Core layout elements

---

## 🚀 Future Enhancements

### Planned Features

1. **Advanced Music Integration**

   - Genre-specific color palettes
   - Tempo-based intensity modulation
   - Mood-driven color selection

2. **Accessibility Extensions**

   - High contrast mode support
   - Color blindness adaptations
   - Custom contrast requirements

3. **Theme Expansion**

   - Support for custom Catppuccin variants
   - User-defined harmony rules
   - Dynamic palette generation

4. **Performance Optimizations**
   - WebWorker-based processing
   - GPU-accelerated calculations
   - Advanced caching strategies

### Extension Points

The harmony engine is designed for extensibility:

```javascript
// Custom harmony rules
harmonyEngine.addCustomRule("energetic-music", {
  blendRatio: 0.9, // More extracted color
  contrastBoost: 1.3, // Higher contrast
  saturationBoost: 1.2, // More vibrant colors
});

// Custom palette integration
harmonyEngine.addPalette("custom-variant", {
  accents: {
    /* custom colors */
  },
  neutrals: {
    /* custom backgrounds */
  },
});
```

---

## 📋 Implementation Checklist

### For Theme Developers

- [ ] Include `ColorHarmonyEngine` class in extension
- [ ] Set up RGB variable application system
- [ ] Integrate harmony validation in color extraction
- [ ] Add contrast boosting variables to SCSS
- [ ] Implement fallback color system
- [ ] Add debug interface for testing
- [ ] Test with various album artworks
- [ ] Validate search interface visibility

### For Module Integration

- [ ] Use harmony RGB variables with fallbacks
- [ ] Implement contrast boost calculations
- [ ] Add theme detection awareness
- [ ] Include performance optimizations
- [ ] Test with all Catppuccin variants
- [ ] Validate accessibility compliance

---

## 🔍 Troubleshooting

### Common Issues

**Search Components Not Visible**

```javascript
// Check contrast boost is applied
const contrastBoost = getComputedStyle(
  document.documentElement
).getPropertyValue("--sn-search-contrast-boost");
console.log("Contrast boost:", contrastBoost); // Should be 1.5 for dark colors
```

**Colors Not Harmonizing**

```javascript
// Verify theme detection
const currentTheme = harmonyEngine.detectCurrentTheme();
console.log("Detected theme:", currentTheme); // Should match actual variant
```

**Performance Issues**

```javascript
// Check validation cache size
const metrics = harmonyEngine.getPerformanceReport();
console.log("Validation count:", metrics.validations);
console.log("Average time:", metrics.averageProcessingTime);
```

### Debug Commands

```javascript
// Quick validation test
Year3000Debug.testHarmonyEngine();

// Visual search test
Year3000Debug.testSearchVisibility();

// Performance analysis
Year3000Debug.getPerformanceMetrics();
```

---

**Implementation Date:** January 2025
**Engine Version:** 1.0
**Compatibility:** Catppuccin StarryNight Theme
**Status:** ✅ Production Ready
