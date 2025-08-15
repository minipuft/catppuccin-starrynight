import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";

// Type definition for RGB color
interface RgbColor {
  r: number;
  g: number;
  b: number;
}

// Type definition for HSL color
interface HslColor {
  h: number;
  s: number;
  l: number;
}

// Type definition for Oklab color
interface OklabColor {
  L: number;
  a: number;
  b: number;
}

// Type definition for Oklab color with Chroma and Hue
interface OklabColorLCH {
  L: number;
  C: number;
  h: number | null;
}

// Centralized getRootStyle
export function getRootStyle(): HTMLElement {
  return document.documentElement;
}

// Centralized throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function throttled(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Centralized debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined;
  return function debounced(...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
}

/**
 * Validates if a string is a valid hex color format
 * @param value - The value to validate
 * @returns true if the value is a valid hex color, false otherwise
 */
export function isValidHexColor(value: any): value is string {
  if (typeof value !== "string") {
    return false;
  }
  
  const trimmed = value.trim();
  
  // Must start with # or be a valid hex without #
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  
  // Valid hex patterns: #RGB, #RRGGBB, #RRGGBBAA
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
  
  return hexPattern.test(withHash);
}

export function hexToRgb(hex: string): RgbColor | null {
  if (typeof hex !== "string") {
    // Reduced logging for non-string inputs to avoid console spam
    return { r: 0, g: 0, b: 0 }; // Fallback to black
  }

  // Early validation using our hex color validator
  if (!isValidHexColor(hex)) {
    // Only warn in debug scenarios, as this is now expected to filter out non-hex values
    return { r: 0, g: 0, b: 0 }; // Fallback to black
  }

  const sanitizedHex = hex.trim();
  let processedHex = sanitizedHex.startsWith("#")
    ? sanitizedHex
    : `#${sanitizedHex}`;
  processedHex = processedHex.replace(/##+/g, "#"); // Handle cases like "##123456"

  // Expand 3-digit hex to 6-digit hex
  if (processedHex.length === 4) {
    // #RGB
    processedHex = `#${processedHex[1]}${processedHex[1]}${processedHex[2]}${processedHex[2]}${processedHex[3]}${processedHex[3]}`;
  }

  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(processedHex);

  if (result) {
    try {
      const rgb = {
        r: parseInt(result[1] || "0", 16),
        g: parseInt(result[2] || "0", 16),
        b: parseInt(result[3] || "0", 16),
      };
      return rgb;
    } catch (e) {
      // Reduced error logging since we now pre-validate inputs
      return { r: 0, g: 0, b: 0 }; // Fallback to black
    }
  } else {
    // This should rarely happen now due to pre-validation with isValidHexColor
    return { r: 0, g: 0, b: 0 }; // Fallback to black
  }
}

export function sanitizeColorMap(input: {
  [key: string]: string | undefined | null;
}): { [key: string]: string } {
  // 🎨 CRITICAL: Enhanced logging for color sanitization
  console.log("🎨 [ThemeUtilities] sanitizeColorMap input:", {
    input,
    inputKeys: input ? Object.keys(input) : [],
    inputEntries: input ? Object.entries(input) : []
  });

  // Accepts 3- or 6-digit hex strings, with or without a leading '#'.
  const validHex = /^#?[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;
  const sanitized: { [key: string]: string } = {};

  if (!input || typeof input !== "object") {
    console.warn("🎨 [ThemeUtilities] sanitizeColorMap: Invalid input type");
    return sanitized;
  }

  const droppedEntries: Array<[string, any]> = [];

  Object.entries(input).forEach(([key, value]) => {
    if (typeof value !== "string") {
      droppedEntries.push([key, value]);
      console.warn(`🎨 [ThemeUtilities] Dropped non-string color: ${key} = ${value} (type: ${typeof value})`);
      return;
    }
    const trimmed = value.trim();
    // Discard obviously invalid placeholders returned by upstream extractors
    if (!trimmed || trimmed === "undefined") {
      droppedEntries.push([key, value]);
      console.warn(`🎨 [ThemeUtilities] Dropped empty/undefined color: ${key} = "${value}"`);
      return;
    }
    if (!validHex.test(trimmed)) {
      droppedEntries.push([key, value]);
      console.warn(`🎨 [ThemeUtilities] Dropped invalid hex color: ${key} = "${value}"`);
      return;
    }

    // Normalise: ensure single leading '#'
    const normalised = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    sanitized[key] = normalised;
  });

  // 🎨 CRITICAL: Log sanitization results
  console.log("🎨 [ThemeUtilities] sanitizeColorMap output:", {
    sanitized,
    sanitizedKeys: Object.keys(sanitized),
    sanitizedEntries: Object.entries(sanitized),
    droppedCount: droppedEntries.length,
    droppedEntries
  });

  if (
    ADVANCED_SYSTEM_CONFIG?.enableDebug &&
    Object.keys(input).length !== Object.keys(sanitized).length
  ) {
    console.warn(
      `[StarryNight sanitizeColorMap] Dropped ${
        Object.keys(input).length - Object.keys(sanitized).length
      } invalid colour entries.`
    );
  }

  return sanitized;
}

export function rgbToHsl(r: number, g: number, b: number): HslColor {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): RgbColor {
  h /= 360;
  s /= 100;
  l /= 100;
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r_val, g_val, b_val;

  if (s === 0) {
    r_val = g_val = b_val = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r_val = hue2rgb(p, q, h + 1 / 3);
    g_val = hue2rgb(p, q, h);
    b_val = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r_val * 255),
    g: Math.round(g_val * 255),
    b: Math.round(b_val * 255),
  };
}

// Accepts either 0-255 integers or 0-1 floats and clamps to valid range before
// converting to hex. This prevents malformed output such as "0.c03…" which in
// turn breaks downstream `hexToRgb` parsing and forces a black fallback.
export function rgbToHex(r: number, g: number, b: number): string {
  const normalize = (c: number): number => {
    if (!Number.isFinite(c)) return 0;

    // If the channel appears to be in 0-1 range, upscale to 0-255.
    const scaled = c <= 1 ? c * 255 : c;

    // Clamp and round to nearest integer.
    return Math.min(255, Math.max(0, Math.round(scaled)));
  };

  const [nr, ng, nb] = [normalize(r), normalize(g), normalize(b)];

  return (
    "#" +
    [nr, ng, nb]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function calculateContrastRatio(color1: string, color2: string): number {
  const getLuminance = (rgb: RgbColor): number => {
    const [r_val = 0, g_val = 0, b_val = 0] = [rgb.r, rgb.g, rgb.b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r_val + 0.7152 * g_val + 0.0722 * b_val;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function lerpSmooth(
  current: number,
  target: number,
  deltaTime: number,
  halfLife: number
): number {
  const EPSILON = 0.00001;
  if (halfLife <= EPSILON || deltaTime <= 0) {
    if (ADVANCED_SYSTEM_CONFIG?.enableDebug) {
      if (halfLife <= EPSILON) {
        // console.warn(
        //   "[StarryNight lerpSmooth] halfLife is near zero or negative. Snapping to target. halfLife:",
        //   halfLife
        // );
      }
    }
    return target;
  }
  const result =
    target + (current - target) * Math.pow(2, -deltaTime / halfLife);
  return result;
}

/**
 * Musical Visual Effects LERP Smoothing - Year 3000 Enhanced Smoothing
 * 
 * Enhanced LERP function that adapts to musical characteristics, creating
 * smooth visual effects that adapt and flow with music rather than using
 * static smoothing values.
 * 
 * @param current Current value to smooth from
 * @param target Target value to smooth towards  
 * @param deltaTime Time elapsed since last frame (seconds)
 * @param musicContext Musical characteristics for visual effects calculation
 * @param animationType Type of animation for appropriate smoothing profile
 * @param baseHalfLife Optional override for base half-life value
 * @returns Smoothed value with musical visual effects
 */
export function lerpSmoothMusical(
  current: number,
  target: number,
  deltaTime: number,
  musicContext: import("./MusicalLerpOrchestrator").MusicalContext,
  animationType: import("./MusicalLerpOrchestrator").AnimationType = 'flow',
  baseHalfLife?: number
): number {
  // Import orchestrator dynamically to avoid circular dependencies
  const { musicalLerpOrchestrator } = require("./MusicalLerpOrchestrator");
  
  // Calculate music-aware LERP parameters
  const musicalParams = musicalLerpOrchestrator.calculateMusicalLerp(
    musicContext,
    animationType,
    baseHalfLife
  );
  
  // Apply musical visual effects to smoothing
  return lerpSmooth(current, target, deltaTime, musicalParams.halfLife);
}

/**
 * Performance-aware Musical LERP with full visual effects and performance optimization
 * Integrates with PerformanceAwareLerpCoordinator for device-aware smoothing
 * 
 * @param current Current value to smooth from
 * @param target Target value to smooth towards  
 * @param deltaTime Time elapsed since last frame (seconds)
 * @param musicContext Musical characteristics for visual effects calculation
 * @param performanceCoordinator Performance coordinator for optimization
 * @param animationType Type of animation for appropriate smoothing profile
 * @param baseHalfLife Optional override for base half-life value
 * @returns Performance-optimized smoothed value with musical visual effects
 */
export function lerpSmoothMusicalPerformance(
  current: number,
  target: number,
  deltaTime: number,
  musicContext: import("./MusicalLerpOrchestrator").MusicalContext,
  performanceCoordinator: any, // PerformanceAwareLerpCoordinator
  animationType: import("./MusicalLerpOrchestrator").AnimationType = 'flow',
  baseHalfLife?: number
): number {
  if (!performanceCoordinator?.calculatePerformanceAwareMusicalLerp) {
    // Fallback to standard musical LERP if coordinator not available
    return lerpSmoothMusical(current, target, deltaTime, musicContext, animationType, baseHalfLife);
  }

  // Use performance-aware coordinator for optimized calculation
  return performanceCoordinator.calculatePerformanceAwareMusicalLerp(
    current,
    target,
    deltaTime,
    musicContext,
    animationType,
    baseHalfLife
  );
}

/**
 * Simplified Musical LERP for cases where full musical context isn't available
 * Uses basic tempo and energy information for visual effects calculation
 * 
 * @param current Current value to smooth from
 * @param target Target value to smooth towards
 * @param deltaTime Time elapsed since last frame (seconds)
 * @param tempo BPM of current music (60-200+)
 * @param energy Energy level of music (0-1)
 * @param baseHalfLife Base half-life for calculation
 * @returns Smoothed value with basic musical integration
 */
export function lerpSmoothSimpleMusical(
  current: number,
  target: number,
  deltaTime: number,
  tempo: number = 120,
  energy: number = 0.5,
  baseHalfLife: number = 0.15
): number {
  // Calculate tempo-responsive half-life
  const tempoFactor = Math.pow(tempo / 120, 0.3); // Normalize to 120 BPM
  const energyFactor = 1 + (energy * 0.3); // Energy affects responsiveness
  const musicalHalfLife = (baseHalfLife / tempoFactor) * energyFactor;
  
  return lerpSmooth(current, target, deltaTime, musicalHalfLife);
}

export function bpmToInterval(bpm: number): number {
  if (!bpm || bpm <= 0) return 500; // Default to 120 BPM (500ms interval)
  return 60000 / bpm;
}

export function intervalToBpm(intervalMs: number): number {
  if (!intervalMs || intervalMs <= 0) return 120; // Default BPM
  return 60000 / intervalMs;
}

export function bpmToAnimationFrameRate(
  bpm: number,
  framesPerBeat = 4
): number {
  const beatInterval = bpmToInterval(bpm);
  return beatInterval / framesPerBeat;
}

export function isOnBeat(
  currentTime: number,
  trackStartTime: number,
  bpm: number,
  tolerance = 50
): boolean {
  const beatInterval = bpmToInterval(bpm);
  const timeSinceStart = currentTime - trackStartTime;
  const beatPosition = timeSinceStart % beatInterval;
  return beatPosition <= tolerance || beatPosition >= beatInterval - tolerance;
}

export function getBeatPhase(
  currentTime: number,
  trackStartTime: number,
  bpm: number
): number {
  const beatInterval = bpmToInterval(bpm);
  const timeSinceStart = currentTime - trackStartTime;
  const beatPosition = timeSinceStart % beatInterval;
  return beatPosition / beatInterval;
}

export function getNextBeatTime(
  currentTime: number,
  trackStartTime: number,
  bpm: number
): number {
  const beatInterval = bpmToInterval(bpm);
  const timeSinceStart = currentTime - trackStartTime;
  const beatsElapsed = Math.floor(timeSinceStart / beatInterval);
  return trackStartTime + (beatsElapsed + 1) * beatInterval;
}

export function easeBeatAnimation(
  beatPhase: number,
  easingType: "ease-out" | "ease-in" | "linear" = "ease-out"
): number {
  switch (easingType) {
    case "ease-in":
      return beatPhase * beatPhase;
    case "linear":
      return beatPhase;
    case "ease-out":
    default:
      return beatPhase * (2 - beatPhase);
  }
}

export function calculateRhythmPhase(
  currentTime: number,
  animationSpeedFactor = 1
): number {
  const speed = 0.001 * animationSpeedFactor;
  return (currentTime * speed) % (2 * Math.PI);
}

export function calculateBreathingScale(
  rhythmPhase: number,
  processedEnergy = 0.5
): number {
  const baseScale = 1.0;
  const pulseAmount = 0.02 * processedEnergy;
  const breath = Math.sin(rhythmPhase) * pulseAmount;
  return baseScale + breath;
}

export function calculateNavigationScale(
  visualIntensity = 0.5,
  moodIdentifier = "neutral"
): number {
  const baseScale = 1.0;
  const moodFactor =
    moodIdentifier === "energetic"
      ? 1.2
      : moodIdentifier === "calm"
      ? 0.8
      : 1.0;
  return baseScale + 0.05 * visualIntensity * moodFactor;
}

export function rgbToOklab(
  r_srgb: number,
  g_srgb: number,
  b_srgb: number
): OklabColor {
  const r = r_srgb / 255;
  const g = g_srgb / 255;
  const b = b_srgb / 255;

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

export function oklabToRgb(L: number, a: number, b_oklab: number): RgbColor {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b_oklab;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b_oklab;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b_oklab;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // Clamp and convert to 8-bit
  r = Math.round(Math.max(0, Math.min(1, r)) * 255);
  g = Math.round(Math.max(0, Math.min(1, g)) * 255);
  b = Math.round(Math.max(0, Math.min(1, b)) * 255);

  return { r, g, b };
}

export function processOklabColor(
  oklabColor: OklabColor,
  context: any = {}
): OklabColorLCH {
  const { L, a, b } = oklabColor;
  const C = Math.sqrt(a * a + b * b);
  let h_rad = Math.atan2(b, a);

  if (h_rad < 0) {
    h_rad += 2 * Math.PI;
  }

  const h = h_rad * (180 / Math.PI);

  // Contextual adjustments can be added here
  const {
    energy = 0.5,
    valence = 0.5,
    artisticMode = "artist-vision",
  } = context;
  const multipliers = ADVANCED_SYSTEM_CONFIG.getCurrentMultipliers();

  let adjusted_L = L * (1 + (valence - 0.5) * 0.1);
  let adjusted_C =
    C * (1 + (energy - 0.5) * 0.2) * (multipliers?.saturation || 1);

  adjusted_L = Math.max(
    0,
    Math.min(1, adjusted_L * (multipliers?.brightness || 1))
  );

  return {
    L: adjusted_L,
    C: adjusted_C,
    h: C > 0.001 ? h : null, // Hue is meaningless if chroma is near zero
  };
}

export function calculateOklabDerivedProperties(oklabColor: OklabColor) {
  const { L, C, h } = processOklabColor(oklabColor);

  const isWarm =
    h !== null ? (h >= 0 && h < 90) || (h >= 270 && h <= 360) : false;
  const isCool = h !== null ? h >= 90 && h < 270 : false;

  let mood = "neutral";
  if (L > 0.7 && C > 0.1) mood = "bright";
  else if (L < 0.4) mood = "dark";
  else if (isWarm && C > 0.1) mood = "warm";
  else if (isCool && C > 0.1) mood = "cool";

  return {
    lightness: L,
    chroma: C,
    hue: h,
    isWarm,
    isCool,
    mood,
  };
}

export function generateHarmonicOklabColors(
  baseOklabColor: OklabColor,
  rule:
    | "analogous"
    | "triadic"
    | "complementary"
    | "tetradic"
    | "split-complementary"
    | "monochromatic" = "analogous",
  angle: number = 30
): OklabColor[] {
  const baseLCH = processOklabColor(baseOklabColor);
  if (baseLCH.h === null) {
    return [baseOklabColor]; // Cannot generate harmony without a hue
  }

  const getOklabFromLCH = (
    l_val: number,
    c_val: number,
    h_deg_val: number
  ): OklabColor => {
    const h_rad = h_deg_val * (Math.PI / 180);
    const a_val = c_val * Math.cos(h_rad);
    const b_val = c_val * Math.sin(h_rad);
    return { L: l_val, a: a_val, b: b_val };
  };

  const colors: OklabColor[] = [baseOklabColor];
  const { L, C, h } = baseLCH;

  switch (rule) {
    case "complementary":
      colors.push(getOklabFromLCH(L, C, (h + 180) % 360));
      break;
    case "analogous":
      colors.push(getOklabFromLCH(L, C, (h + angle) % 360));
      colors.push(getOklabFromLCH(L, C, (h - angle + 360) % 360));
      break;
    case "triadic":
      colors.push(getOklabFromLCH(L, C, (h + 120) % 360));
      colors.push(getOklabFromLCH(L, C, (h + 240) % 360));
      break;
    case "tetradic":
      colors.push(getOklabFromLCH(L, C, (h + 90) % 360));
      colors.push(getOklabFromLCH(L, C, (h + 180) % 360));
      colors.push(getOklabFromLCH(L, C, (h + 270) % 360));
      break;
    case "split-complementary":
      colors.push(getOklabFromLCH(L, C, (h + 180 - angle) % 360));
      colors.push(getOklabFromLCH(L, C, (h + 180 + angle) % 360));
      break;
    case "monochromatic":
      colors.push({
        L: Math.max(0, L - 0.2),
        a: baseOklabColor.a,
        b: baseOklabColor.b,
      });
      colors.push({
        L: Math.min(1, L + 0.2),
        a: baseOklabColor.a,
        b: baseOklabColor.b,
      });
      break;
  }
  return colors;
}

export function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end;
}

export function colorDifference(rgb1: RgbColor, rgb2: RgbColor): number {
  const lab1 = rgbToOklab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToOklab(rgb2.r, rgb2.g, rgb2.b);

  const deltaL = lab1.L - lab2.L;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

class HealthMonitor {
  registerSystem(name: string, instance: any) {}
  updateSystemMetrics(name: string, metrics: any) {}
}

const healthMonitorInstance = new HealthMonitor();

export function getHealthMonitor(): HealthMonitor | null {
  // Placeholder for Health Monitor
  return healthMonitorInstance;
}

export function findRequiredLuminance(
  color1: RgbColor,
  color2: RgbColor,
  ratio: number
): number {
  const getLuminance = (rgb: RgbColor): number => {
    const [r_val = 0, g_val = 0, b_val = 0] = [rgb.r, rgb.g, rgb.b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r_val + 0.7152 * g_val + 0.0722 * b_val;
  };

  const lum2 = getLuminance(color2);
  let targetLuminance;
  // We want (lum1 + 0.05) / (lum2 + 0.05) = ratio
  // So lum1 = ratio * (lum2 + 0.05) - 0.05
  targetLuminance = ratio * (lum2 + 0.05) - 0.05;

  // now we need to find the lightness value in HSL that will give us this luminance
  const hsl = rgbToHsl(color1.r, color1.g, color1.b);

  // This is a simplification. A proper implementation would need to iterate
  // to find the correct lightness, as luminance depends on R, G, and B.
  // For now, we'll just adjust the lightness and hope for the best.
  const currentLuminance = getLuminance(color1);
  const luminanceRatio = targetLuminance / currentLuminance;

  // This is not a correct way to do it. A simple luminance adjustment is not possible with just HSL lightness.
  // A proper solution is way more complex.
  // For now, I will return the original lightness.
  return hsl.l;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function adjustColor(
  rgb: RgbColor,
  {
    brightness = 1,
    saturation = 1,
    hue = 0,
  }: { brightness?: number; saturation?: number; hue?: number }
): RgbColor {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + hue) % 360;
  hsl.s = Math.max(0, Math.min(100, hsl.s * saturation));
  hsl.l = Math.max(0, Math.min(100, hsl.l * brightness));
  return hslToRgb(hsl.h, hsl.s, hsl.l);
}

// ---------------------------------------------------------------------------
// 🌈  Canonical Accent Helper
// ---------------------------------------------------------------------------
/**
 * Retrieve the canonical StarryNight accent colour as exposed by
 * `--sn-accent-hex` and `--sn-accent-rgb` CSS variables. Returns both HEX and
 * RGB string forms so callers can pick the one best suited for their use case.
 */
export function getCanonicalAccent(): { hex: string; rgb: string } {
  const root = getRootStyle();
  const styles = getComputedStyle(root);

  let hex = styles.getPropertyValue("--sn-accent-hex").trim();
  let rgb = styles.getPropertyValue("--sn-accent-rgb").trim();

  // Fallback conversions where only one format is present
  if (!hex && rgb) {
    const [rStr = "0", gStr = "0", bStr = "0"] = rgb.split(/\s*,\s*/);
    const r = parseInt(rStr, 10) || 0;
    const g = parseInt(gStr, 10) || 0;
    const b = parseInt(bStr, 10) || 0;
    hex = rgbToHex(r, g, b);
  }

  if (!rgb && hex) {
    const rgbObj = hexToRgb(hex);
    if (rgbObj) {
      rgb = `${rgbObj.r},${rgbObj.g},${rgbObj.b}`;
    }
  }

  return { hex, rgb };
}
