# 🌌 Year 3000 System Documentation

## Overview

The Year 3000 System is the complete dynamic theming architecture for Catppuccin StarryNight, featuring real-time color extraction, RGB variable generation, and music-reactive visual effects.

## ✅ **IMPLEMENTATION COMPLETE (January 2025)**

### System Status: FULLY OPERATIONAL

The Year 3000 System has been successfully implemented with all core components:

- ✅ **RGB Variable Pipeline**: Complete hex → RGB conversion for all gradients
- ✅ **Dynamic Color Extraction**: Spicetify native API integration
- ✅ **Comprehensive Variable Coverage**: All spice and gradient RGB variables
- ✅ **Unified Dynamic Accent System**: Central `--sn-dynamic-accent-rgb` variable
- ✅ **Fallback Chain Management**: Robust compatibility across all themes
- ✅ **Settings Integration**: "Dynamic" accent mode in StarryNight settings

## Architecture Overview

```
🎵 Spicetify Audio Data
    ↓
🎛️ Year3000System (Central Orchestrator)
    ↓ ↓ ↓
🎨 ColorHarmonyEngine    🎵 MusicAnalysisService    ⚙️ SettingsManager
(RGB Variable Pipeline)  (Audio Processing)        (Dynamic Mode Control)
    ↓ ↓ ↓
🌊 CSS Variables → 🌟 Live SCSS Integration → Real-time Visual Magic
```

## Core Components

### 1. **Year3000System (Central Orchestrator)**

**Location**: `src-js/core/year3000System.ts`

**Key Features**:

- Orchestrates all subsystems
- Manages RGB variable generation
- Handles dynamic accent mode switching
- Provides unified API for color updates

```typescript
class Year3000System {
  // Core subsystems
  private colorHarmonyEngine: ColorHarmonyEngine;
  private musicAnalysisService: MusicAnalysisService;
  private settingsManager: SettingsManager;

  // RGB variable generation pipeline
  async updateColorsFromCurrentTrack(): Promise<void> {
    const colors = await this.extractColorsFromCurrentTrack();
    if (colors) {
      // Generate both hex and RGB versions
      this.colorHarmonyEngine.applyColorsToTheme(colors);
    }
  }

  // Dynamic accent mode support
  private async handleAccentModeChange(newAccent: string): Promise<void> {
    if (newAccent === "dynamic") {
      // Enable dynamic color extraction
      await this.updateColorsFromCurrentTrack();
    } else {
      // Apply static Catppuccin accent
      await this.colorHarmonyEngine.applyCatppuccinAccent(newAccent);
    }
  }
}
```

### 2. **ColorHarmonyEngine (RGB Variable Pipeline)**

**Location**: `src-js/systems/ColorHarmonyEngine.ts`

**Major Enhancement**: Complete RGB variable generation for all spice variables

```typescript
// Enhanced RGB variable generation
private generateRgbVariables(colors: ExtractedColors): void {
  const root = document.documentElement;

  // Helper function for hex → RGB conversion and CSS variable setting
  const addRgb = (property: string, hexColor: string) => {
    const rgb = this.utils.hexToRgb(hexColor);
    if (rgb) {
      root.style.setProperty(property, `${rgb.r},${rgb.g},${rgb.b}`);
    }
  };

  // Set Year 3000 gradient RGB variables
  addRgb("--sn-gradient-primary-rgb", colors.VIBRANT || "#ca9ee6");
  addRgb("--sn-gradient-secondary-rgb", colors.DARK_VIBRANT || "#babbf1");
  addRgb("--sn-gradient-accent-rgb", colors.LIGHT_VIBRANT || "#8caaee");

  // Set unified dynamic accent variable
  addRgb("--sn-dynamic-accent-rgb", colors.VIBRANT || "#ca9ee6");

  // Generate RGB versions of ALL existing spice variables
  const computedStyle = getComputedStyle(root);
  const addSpiceRgb = (rgbProp: string, hexProp: string, fallback: string) => {
    const hexValue = computedStyle.getPropertyValue(hexProp).trim() || fallback;
    addRgb(rgbProp, hexValue);
  };

  // Complete spice RGB variable coverage
  addSpiceRgb("--spice-rgb-main", "--spice-main", "#cdd6f4");
  addSpiceRgb("--spice-rgb-base", "--spice-base", "#1e1e2e");
  addSpiceRgb("--spice-rgb-player", "--spice-player", "#181825");
  addSpiceRgb("--spice-rgb-sidebar", "--spice-sidebar", "#313244");
  addSpiceRgb("--spice-rgb-surface0", "--spice-surface0", "#313244");
  addSpiceRgb("--spice-rgb-surface1", "--spice-surface1", "#45475a");
  addSpiceRgb("--spice-rgb-text", "--spice-text", "#cdd6f4");
  addSpiceRgb("--spice-rgb-accent", "--spice-accent", "#ca9ee6");
  addSpiceRgb("--spice-rgb-button", "--spice-button", "#ca9ee6");
}
```

### 3. **Enhanced Fallback Management**

**PaletteExtensionManager Updates**:

- Replaced hardcoded fallback colors with dynamic variable references
- Enhanced accent color detection with multiple dynamic variable sources

**SystemHealthMonitor Updates**:

- Replaced all hardcoded status colors with dynamic spice variables
- Added safe color handling for any status type

## CSS Variable System

### Complete Variable Coverage

```scss
// === Year 3000 Gradient Variables (BOTH hex and RGB) ===
--sn-gradient-primary: "#ca9ee6"              /* Hex version for solid colors */
--sn-gradient-primary-rgb: "202,158,230"      /* RGB version for gradients */
--sn-gradient-secondary: "#babbf1"
--sn-gradient-secondary-rgb: "186,187,241"
--sn-gradient-accent: "#8caaee"
--sn-gradient-accent-rgb: "140,170,238"

// === Unified Dynamic Accent System ===
--sn-dynamic-accent-rgb: "202,158,230"        /* Central dynamic variable */

// === Complete Spice RGB Variables ===
--spice-rgb-main: "205,214,244"               /* Main background RGB */
--spice-rgb-base: "30,30,46"                  /* Base background RGB */
--spice-rgb-player: "24,24,37"                /* Player background RGB */
--spice-rgb-sidebar: "49,50,68"               /* Sidebar background RGB */
--spice-rgb-surface0: "49,50,68"              /* Surface0 RGB */
--spice-rgb-surface1: "69,71,90"              /* Surface1 RGB */
--spice-rgb-text: "205,214,244"               /* Text color RGB */
--spice-rgb-accent: "202,158,230"             /* Accent color RGB */
--spice-rgb-button: "202,158,230"             /* Button color RGB */
```

### SCSS Integration Examples

```scss
// Gradient backgrounds with transparency
.dynamic-gradient {
  background: linear-gradient(
    135deg,
    rgba(
        var(
          --sn-gradient-primary-rgb,
          var(--sn-dynamic-accent-rgb, 202, 158, 230)
        ),
        0.12
      ) 0%,
    rgba(
        var(--sn-gradient-secondary-rgb, var(--spice-rgb-surface0, 49, 50, 68)),
        0.08
      ) 50%,
    transparent 100%
  );
}

// Text effects with dynamic colors
.dynamic-text-glow {
  text-shadow: 0 0 8px rgba(var(--sn-dynamic-accent-rgb, 202, 158, 230), 0.6);
}

// Button styling with fallback chains
.dynamic-button {
  background: rgba(
    var(--spice-rgb-button, var(--sn-dynamic-accent-rgb, 202, 158, 230)),
    0.15
  );
  border: 1px solid rgba(var(--spice-rgb-accent, var(--sn-dynamic-accent-rgb, 202, 158, 230)), 0.3);
}
```

## Settings Integration

### Dynamic Accent Mode

The system integrates with StarryNight settings to provide a "Dynamic" accent option:

```javascript
// Settings configuration
{
  key: "catppuccin-accent",
  type: "dropdown",
  options: [
    { value: "dynamic", label: "🌈 Dynamic (Album Colors)" },
    { value: "rosewater", label: "🌸 Rosewater" },
    { value: "flamingo", label: "🦩 Flamingo" },
    // ... other Catppuccin colors
  ],
  default: "dynamic"
}
```

### Mode Switching Logic

```typescript
// Dynamic mode detection and handling
private async handleAccentModeChange(newAccent: string): Promise<void> {
  const isDynamicMode = newAccent === "dynamic";

  if (isDynamicMode) {
    // Skip static Catppuccin color overrides
    console.log("🌈 Dynamic mode enabled - using album art colors");
    await this.updateColorsFromCurrentTrack();
  } else {
    // Apply static Catppuccin accent
    console.log(`🎨 Static mode: applying ${newAccent} accent`);
    await this.colorHarmonyEngine.applyCatppuccinAccent(newAccent);
  }
}
```

## Performance Optimizations

### Color Extraction Caching

```typescript
// Intelligent color caching to prevent redundant processing
private colorCache = new Map<string, ExtractedColors>();

async extractColorsFromCurrentTrack(): Promise<ExtractedColors | null> {
  const currentTrack = this.musicAnalysisService?.getCurrentTrack();
  if (!currentTrack?.uri) return null;

  // Check cache first
  if (this.colorCache.has(currentTrack.uri)) {
    return this.colorCache.get(currentTrack.uri)!;
  }

  // Extract new colors
  const colors = await this.extractColorsUsingSpicetifyAPI(currentTrack.uri);
  if (colors) {
    this.colorCache.set(currentTrack.uri, colors);
  }

  return colors;
}
```

### Debounced Updates

```typescript
// Prevent excessive color updates during rapid track changes
private colorUpdateTimeout: NodeJS.Timeout | null = null;

private debouncedColorUpdate(): void {
  if (this.colorUpdateTimeout) {
    clearTimeout(this.colorUpdateTimeout);
  }

  this.colorUpdateTimeout = setTimeout(async () => {
    await this.updateColorsFromCurrentTrack();
  }, 150);
}
```

## Debugging and Development

### Enhanced Debug Tools

```javascript
// Complete Year 3000 system debugging
window.Year3000Debug = {
  // Test RGB variable generation
  validateRgbVariables: () => {
    const requiredRgbVars = [
      "--sn-gradient-primary-rgb",
      "--sn-gradient-secondary-rgb",
      "--sn-gradient-accent-rgb",
      "--sn-dynamic-accent-rgb",
      "--spice-rgb-main",
      "--spice-rgb-base",
      "--spice-rgb-player",
      "--spice-rgb-sidebar",
      "--spice-rgb-surface0",
      "--spice-rgb-surface1",
      "--spice-rgb-text",
      "--spice-rgb-accent",
      "--spice-rgb-button",
    ];

    const root = document.documentElement;
    const validation = {};

    requiredRgbVars.forEach((varName) => {
      const value = getComputedStyle(root).getPropertyValue(varName).trim();
      validation[varName] = {
        present: !!value,
        value: value,
        validFormat: /^\d+,\d+,\d+$/.test(value),
      };
    });

    console.table(validation);
    return validation;
  },

  // Test gradient application
  testGradients: () => {
    console.log("🧪 Testing gradient application...");
    globalThis.year3000System?.updateColorsFromCurrentTrack();
    return Year3000Debug.validateRgbVariables();
  },

  // Complete system status
  getSystemStatus: () => {
    return {
      systemInitialized: !!globalThis.year3000System,
      colorHarmonyEngine: !!globalThis.year3000System?.colorHarmonyEngine,
      musicAnalysisService: !!globalThis.year3000System?.musicAnalysisService,
      settingsManager: !!globalThis.year3000System?.settingsManager,
      currentAccentMode:
        globalThis.year3000System?.settingsManager?.getSetting(
          "catppuccin-accent"
        ),
      rgbVariableValidation: Year3000Debug.validateRgbVariables(),
    };
  },
};
```

## Usage Examples

### Basic Color Extraction and Application

```typescript
// Extract colors from current track and apply to theme
const year3000System = globalThis.year3000System;
await year3000System.updateColorsFromCurrentTrack();
```

### Manual Color Application

```typescript
// Apply specific colors to the theme
const customColors = {
  VIBRANT: "#ff6b9d",
  DARK_VIBRANT: "#c44569",
  LIGHT_VIBRANT: "#ff9ff3",
  PROMINENT: "#f8b500",
  DESATURATED: "#786fa6",
  VIBRANT_NON_ALARMING: "#f19066",
};

year3000System.colorHarmonyEngine.applyColorsToTheme(customColors);
```

### Settings Integration

```typescript
// Listen for accent mode changes
year3000System.settingsManager.onSettingChange(
  "catppuccin-accent",
  (newValue) => {
    console.log(`Accent mode changed to: ${newValue}`);
    // System automatically handles the change
  }
);
```

## Integration with Visual Systems

### SCSS File Updates

All SCSS files have been updated to use the new RGB variable system:

- `src/core/_sn_variables.scss` - Central variable definitions
- `src/core/_sn_typography.scss` - Text effects with dynamic colors
- `src/sidebar/_sidebar_dimensional_nexus.scss` - Sidebar gradients
- `src/layout/_top_bar.scss` - Top bar styling
- `src/features/_sn_glassmorphism.scss` - Glass effects
- `src/features/_sn_3d_morphing.scss` - 3D morphing effects
- `src/components/_now_playing.scss` - Now playing component
- `src/components/_sn_loading.scss` - Loading animations

### JavaScript File Updates

All JavaScript files with hardcoded colors have been updated:

- `src-js/core/year3000System.ts` - Complete RGB variable generation
- `src-js/systems/ColorHarmonyEngine.ts` - Enhanced color processing
- `src-js/utils/PaletteExtensionManager.ts` - Dynamic fallback management
- `src-js/debug/SystemHealthMonitor.ts` - Dynamic status colors

## Future Enhancements

- **Machine Learning Color Prediction**: Predict optimal colors based on genre and mood
- **Advanced Color Theory**: Implement triadic, tetradic, and split-complementary harmonies
- **User Preference Learning**: Learn user color preferences over time (privacy-first)
- **Accessibility Integration**: Ensure color choices meet accessibility standards
- **Performance Monitoring**: Advanced metrics for color extraction and application performance

---

**Status**: ✅ IMPLEMENTATION COMPLETE
**Last Updated**: January 2025
**Version**: 2.0
**Compatibility**: Spicetify CLI 2.27+ | Spotify 1.2.0+
