/**
 * ColorFieldManager
 * Coordinates gradient colors across containers to create unified color fields
 * where adjacent containers have harmonious edge colors for seamless visual flow.
 */

import type { MusicSyncService } from "@/audio/MusicSyncService";
import type {
  FrameContext,
  IVisualSystem,
} from "@/core/animation/EnhancedMasterAnimationCoordinator";
import type { Year3000System } from "@/core/lifecycle/AdvancedThemeSystem";
import type { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
// NOTE: SettingsManager import removed - was dead code, never used
import type * as Utils from "@/utils/core/ThemeUtilities";

export interface ColorZone {
  id: string;
  element: HTMLElement;
  bounds: DOMRect;
  currentColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  edges: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  neighbors: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

export interface ColorFieldCoordination {
  globalBaseHue: number;
  harmonySpread: number;
  edgeBlendRadius: number;
  transitionSpeed: number;
}

export class ColorFieldManager implements IVisualSystem {
  public readonly systemName = "ColorFieldManager";

  private config: AdvancedSystemConfig | Year3000Config;
  private utils: typeof Utils;
  private performanceAnalyzer: SimplePerformanceCoordinator;
  private musicSyncService: MusicSyncService | null;
  // NOTE: settingsManager field removed - was dead code, never used
  private year3000System: Year3000System;

  public initialized: boolean = false;
  private colorZones: Map<string, ColorZone> = new Map();
  private updateQueue: Set<string> = new Set();
  private isUpdating: boolean = false;
  private coordination: ColorFieldCoordination;
  private domObserver: MutationObserver | null = null;

  // Spotify UI zone selectors
  private readonly UI_ZONES = {
    sidebar: 'nav[data-testid="Root__nav-bar"]',
    mainContent: 'main[data-testid="Root__main-view"]',
    playerBar: 'footer[data-testid="now-playing-bar"]',
    topBar: 'header[data-testid="topbar"]',
    nowPlaying: '[data-testid="now-playing-widget"]',
    playlistContent: '[data-testid="playlist-tracklist"]',
    searchResults: '[data-testid="search-results"]',
  };

  constructor(
    config: AdvancedSystemConfig | Year3000Config,
    utils: typeof Utils,
    performanceAnalyzer: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null,
    // NOTE: settingsManager parameter removed - was dead code, never used
    year3000System: Year3000System
  ) {
    this.config = config;
    this.utils = utils;
    this.performanceAnalyzer = performanceAnalyzer;
    this.musicSyncService = musicSyncService;
    // NOTE: settingsManager assignment removed - was dead code, never used
    this.year3000System = year3000System;

    // Initialize coordination parameters
    this.coordination = {
      globalBaseHue: 0,
      harmonySpread: 30, // degrees
      edgeBlendRadius: 20, // pixels
      transitionSpeed: 0.8, // 0-1 smoothing factor
    };
  }
  onAnimate(deltaMs: number, context: FrameContext): void {
    this.updateAnimation(deltaMs);
  }

  onPerformanceModeChange?(mode: "performance" | "quality"): void {
    // Adjust update frequency based on performance mode
    if (mode === "performance") {
      this.coordination.transitionSpeed = 0.5; // Faster, less smooth transitions
      this.coordination.edgeBlendRadius = 10; // Smaller blend radius
    } else {
      this.coordination.transitionSpeed = 0.8; // Smoother transitions
      this.coordination.edgeBlendRadius = 20; // Full blend radius
    }

    if (this.config.enableDebug) {
      console.log(
        `🎨 [ColorFieldManager] Performance mode changed to: ${mode}`
      );
    }
  }

  public async initialize(): Promise<void> {
    try {
      // Register main UI zones
      this.registerDefaultZones();

      // Set up DOM observers for dynamic content
      this.setupDOMObserver();

      // Initialize color coordination
      this.updateGlobalColorCoordination();

      this.initialized = true;

      if (this.config.enableDebug) {
        console.log(
          "🎨 [ColorFieldManager] Initialized with zone coordination"
        );
        console.log(
          `🎨 [ColorFieldManager] Registered ${this.colorZones.size} color zones`
        );
      }
    } catch (error) {
      console.error("[ColorFieldManager] Initialization failed:", error);
      this.initialized = false;
    }
  }

  private registerDefaultZones(): void {
    Object.entries(this.UI_ZONES).forEach(([zoneId, selector]) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        this.registerColorZone(zoneId, element);
      }
    });

    // Set up neighbor relationships for seamless transitions
    this.establishZoneNeighborships();
  }

  private registerColorZone(id: string, element: HTMLElement): void {
    const bounds = element.getBoundingClientRect();
    const zone: ColorZone = {
      id,
      element,
      bounds,
      currentColors: this.extractCurrentColors(element),
      edges: this.calculateEdgeColors(element, bounds),
      neighbors: {},
    };

    this.colorZones.set(id, zone);

    if (this.config.enableDebug) {
      console.log(`🎨 [ColorFieldManager] Registered zone: ${id}`, {
        width: bounds.width,
        height: bounds.height,
        position: { x: bounds.x, y: bounds.y },
      });
    }
  }

  private establishZoneNeighborships(): void {
    const zones = Array.from(this.colorZones.values());

    zones.forEach((zone) => {
      // Find adjacent zones based on spatial relationships
      const adjacent = this.findAdjacentZones(zone, zones);
      zone.neighbors = adjacent;
    });
  }

  private findAdjacentZones(
    zone: ColorZone,
    allZones: ColorZone[]
  ): ColorZone["neighbors"] {
    const neighbors: ColorZone["neighbors"] = {};
    const threshold = 10; // pixels tolerance for adjacency detection

    allZones.forEach((otherZone) => {
      if (otherZone.id === zone.id) return;

      const zb = zone.bounds;
      const ob = otherZone.bounds;

      // Check for spatial adjacency
      if (
        Math.abs(zb.bottom - ob.top) < threshold &&
        this.hasHorizontalOverlap(zb, ob)
      ) {
        neighbors.bottom = otherZone.id;
      }

      if (
        Math.abs(ob.bottom - zb.top) < threshold &&
        this.hasHorizontalOverlap(zb, ob)
      ) {
        neighbors.top = otherZone.id;
      }

      if (
        Math.abs(zb.right - ob.left) < threshold &&
        this.hasVerticalOverlap(zb, ob)
      ) {
        neighbors.right = otherZone.id;
      }

      if (
        Math.abs(ob.right - zb.left) < threshold &&
        this.hasVerticalOverlap(zb, ob)
      ) {
        neighbors.left = otherZone.id;
      }
    });

    return neighbors;
  }

  private hasHorizontalOverlap(a: DOMRect, b: DOMRect): boolean {
    return !(a.right < b.left || b.right < a.left);
  }

  private hasVerticalOverlap(a: DOMRect, b: DOMRect): boolean {
    return !(a.bottom < b.top || b.bottom < a.top);
  }

  private extractCurrentColors(
    element: HTMLElement
  ): ColorZone["currentColors"] {
    const computedStyle = getComputedStyle(element);

    // Try to extract colors from CSS variables or computed values
    const primary =
      computedStyle.getPropertyValue("--sn-accent-hex") ||
      computedStyle.getPropertyValue("--spice-accent") ||
      "#a6adc8";

    const secondary =
      computedStyle.getPropertyValue("--sn-secondary-hex") ||
      computedStyle.getPropertyValue("--spice-player") ||
      primary;

    const accent = computedStyle.getPropertyValue("--spice-button") || primary;

    return { primary, secondary, accent };
  }

  private calculateEdgeColors(
    element: HTMLElement,
    bounds: DOMRect
  ): ColorZone["edges"] {
    const colors = this.extractCurrentColors(element);

    // For now, use the primary color for all edges
    // TODO: Implement sophisticated edge color calculation
    return {
      top: colors.primary,
      right: colors.primary,
      bottom: colors.primary,
      left: colors.primary,
    };
  }

  private setupDOMObserver(): void {
    this.domObserver = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList" || mutation.type === "attributes") {
          // Check if any of our tracked zones were affected
          const target = mutation.target as HTMLElement;
          if (this.isZoneOrChild(target)) {
            shouldUpdate = true;
          }
        }
      });

      if (shouldUpdate) {
        this.queueZoneUpdate("*"); // Update all zones
      }
    });

    this.domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }

  private isZoneOrChild(element: HTMLElement): boolean {
    for (const zone of this.colorZones.values()) {
      if (zone.element === element || zone.element.contains(element)) {
        return true;
      }
    }
    return false;
  }

  private updateGlobalColorCoordination(): void {
    // Extract global base hue from current theme
    try {
      const rootStyle = getComputedStyle(document.documentElement);
      const accentColor =
        rootStyle.getPropertyValue("--sn-accent-hex") ||
        rootStyle.getPropertyValue("--spice-accent");

      if (accentColor) {
        const rgb = this.utils.hexToRgb(accentColor);
        if (rgb) {
          const hsl = this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
          this.coordination.globalBaseHue = hsl.h;
        }
      }
    } catch (error) {
      console.warn(
        "[ColorFieldManager] Failed to extract global base hue:",
        error
      );
    }
  }

  public getHarmoniousColorForZone(
    zoneId: string,
    targetEdge: "top" | "right" | "bottom" | "left"
  ): string | null {
    const zone = this.colorZones.get(zoneId);
    if (!zone) return null;

    const neighborId = zone.neighbors[targetEdge];
    if (!neighborId) return zone.currentColors.primary;

    const neighbor = this.colorZones.get(neighborId);
    if (!neighbor) return zone.currentColors.primary;

    // Calculate harmonious color based on neighbor's edge color
    const oppositeEdge = this.getOppositeEdge(targetEdge);
    const neighborEdgeColor = neighbor.edges[oppositeEdge];

    // Blend current zone color with neighbor's edge color
    return this.blendColors(zone.currentColors.primary, neighborEdgeColor, 0.3);
  }

  private getOppositeEdge(
    edge: "top" | "right" | "bottom" | "left"
  ): "top" | "right" | "bottom" | "left" {
    const opposites = {
      top: "bottom" as const,
      bottom: "top" as const,
      left: "right" as const,
      right: "left" as const,
    };
    return opposites[edge];
  }

  private blendColors(color1: string, color2: string, ratio: number): string {
    try {
      const rgb1 = this.utils.hexToRgb(color1);
      const rgb2 = this.utils.hexToRgb(color2);

      if (!rgb1 || !rgb2) return color1;

      const blended = {
        r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
        g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
        b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio),
      };

      return this.utils.rgbToHex(blended.r, blended.g, blended.b);
    } catch (error) {
      console.warn("[ColorFieldManager] Color blending failed:", error);
      return color1;
    }
  }

  public setGradientVariablesForZone(zoneId: string): void {
    const zone = this.colorZones.get(zoneId);
    if (!zone) return;

    // Calculate harmonious colors for each edge
    const harmoniousColors = {
      top: this.getHarmoniousColorForZone(zoneId, "top"),
      right: this.getHarmoniousColorForZone(zoneId, "right"),
      bottom: this.getHarmoniousColorForZone(zoneId, "bottom"),
      left: this.getHarmoniousColorForZone(zoneId, "left"),
    };

    // Set CSS variables for the zone
    const prefix = `--sn-zone-${zoneId}`;
    Object.entries(harmoniousColors).forEach(([edge, color]) => {
      if (color && typeof color === "string") {
        this.year3000System.cssVariableController?.queueCSSVariableUpdate(
          `${prefix}-${edge}-color`,
          color,
          zone.element
        );
      }
    });

    if (this.config.enableDebug) {
      console.log(
        `🎨 [ColorFieldManager] Updated gradient variables for zone: ${zoneId}`,
        harmoniousColors
      );
    }
  }

  public queueZoneUpdate(zoneId: string): void {
    this.updateQueue.add(zoneId);
  }

  private processColorFieldUpdates(): void {
    if (this.isUpdating) return;
    this.isUpdating = true;

    try {
      const zonesToUpdate = Array.from(this.updateQueue);
      this.updateQueue.clear();

      zonesToUpdate.forEach((zoneId) => {
        if (zoneId === "*") {
          // Update all zones
          this.colorZones.forEach((_, id) => {
            this.updateZoneColors(id);
          });
        } else {
          this.updateZoneColors(zoneId);
        }
      });
    } finally {
      this.isUpdating = false;
    }
  }

  private updateZoneColors(zoneId: string): void {
    const zone = this.colorZones.get(zoneId);
    if (!zone) return;

    // Update zone bounds in case layout changed
    zone.bounds = zone.element.getBoundingClientRect();

    // Extract current colors
    zone.currentColors = this.extractCurrentColors(zone.element);

    // Calculate new edge colors based on neighbors
    zone.edges = this.calculateHarmoniousEdgeColors(zone);

    // Apply gradient variables
    this.setGradientVariablesForZone(zoneId);
  }

  private calculateHarmoniousEdgeColors(zone: ColorZone): ColorZone["edges"] {
    const edges: ColorZone["edges"] = {
      top: zone.currentColors.primary,
      right: zone.currentColors.primary,
      bottom: zone.currentColors.primary,
      left: zone.currentColors.primary,
    };

    // Calculate edge colors based on harmonic relationships
    Object.keys(edges).forEach((edge) => {
      const edgeKey = edge as keyof ColorZone["edges"];
      const harmoniousColor = this.getHarmoniousColorForZone(zone.id, edgeKey);
      if (harmoniousColor) {
        edges[edgeKey] = harmoniousColor;
      }
    });

    return edges;
  }

  public updateColorsFromHarmonyEngine(colors: {
    [key: string]: string;
  }): void {
    // Update global coordination based on new colors
    if (colors.VIBRANT || colors.PRIMARY) {
      const primaryColor = colors.VIBRANT || colors.PRIMARY;
      const rgb = this.utils.hexToRgb(primaryColor || "");
      if (rgb) {
        const hsl = this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this.coordination.globalBaseHue = hsl.h;
      }
    }

    // Queue updates for all zones
    this.queueZoneUpdate("*");
  }

  public async destroy(): Promise<void> {
    if (this.domObserver) {
      this.domObserver.disconnect();
      this.domObserver = null;
    }

    this.colorZones.clear();
    this.updateQueue.clear();
    this.initialized = false;
  }

  public updateAnimation(deltaTime: number): void {
    if (!this.initialized || this.isUpdating) return;

    // Process queued updates
    if (this.updateQueue.size > 0) {
      this.processColorFieldUpdates();
    }
  }

  public async healthCheck(): Promise<any> {
    return {
      status: this.initialized ? "healthy" : "failed",
      zones: this.colorZones.size,
      queuedUpdates: this.updateQueue.size,
      coordination: this.coordination,
      observers: !!this.domObserver,
    };
  }

  public forceRepaint?(reason?: string): void {
    if (this.config.enableDebug && reason) {
      console.log(`🎨 [ColorFieldManager] Force repaint: ${reason}`);
    }
    this.queueZoneUpdate("*");
  }

  // Public API for SCSS integration
  public generateZoneGradientCSS(zoneId: string): string {
    const zone = this.colorZones.get(zoneId);
    if (!zone) return "";

    const { edges } = zone;
    return `
      --sn-zone-${zoneId}-gradient: radial-gradient(
        ellipse at center,
        ${edges.top} 0%,
        ${edges.right} 25%,
        ${edges.bottom} 50%,
        ${edges.left} 75%,
        ${zone.currentColors.primary} 100%
      );
    `;
  }

  // Public API for external systems to register containers
  public registerContainer(
    containerId: string,
    element: HTMLElement,
    options: {
      priority?: number;
      colorRole?: "primary" | "secondary" | "accent" | "background";
    } = {}
  ): void {
    this.registerColorZone(containerId, element);

    if (this.config.enableDebug) {
      console.log(
        `🎨 [ColorFieldManager] Externally registered container: ${containerId}`,
        options
      );
    }
  }

  public unregisterContainer(containerId: string): void {
    const removed = this.colorZones.delete(containerId);
    if (removed && this.config.enableDebug) {
      console.log(
        `🎨 [ColorFieldManager] Unregistered container: ${containerId}`
      );
    }
  }

  // Get zone information for SCSS/CSS integration
  public getZoneEdgeColors(zoneId: string): ColorZone["edges"] | null {
    const zone = this.colorZones.get(zoneId);
    return zone ? zone.edges : null;
  }

  public getZoneInfo(zoneId: string): ColorZone | null {
    return this.colorZones.get(zoneId) || null;
  }

  // Create a seamless gradient that spans multiple zones
  public createSeamlessGradient(
    zoneIds: string[],
    direction: "horizontal" | "vertical" = "horizontal"
  ): string {
    const zones = zoneIds
      .map((id) => this.colorZones.get(id))
      .filter(Boolean) as ColorZone[];
    if (zones.length === 0) return "";

    const gradientStops = zones.map((zone, index) => {
      const position = (index / (zones.length - 1)) * 100;
      return `${zone.currentColors.primary} ${position}%`;
    });

    const gradientDirection =
      direction === "horizontal" ? "to right" : "to bottom";
    return `linear-gradient(${gradientDirection}, ${gradientStops.join(", ")})`;
  }
}
