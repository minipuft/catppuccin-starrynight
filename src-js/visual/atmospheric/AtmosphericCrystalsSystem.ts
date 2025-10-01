/**
 * AtmosphericCrystalsSystem
 *
 * Year 3000 atmospheric depth effect - renders floating translucent crystals
 * that create subtle 3D space perception in the interface.
 *
 * Performance:
 * - 3 static div elements with SVG backgrounds
 * - GPU-accelerated CSS transforms only
 * - Zero per-frame JavaScript cost
 * - Respects prefers-reduced-motion
 */

import type { IManagedSystem, HealthCheckResult } from "@/types/systems";

export class AtmosphericCrystalsSystem implements IManagedSystem {
  initialized = false;
  private overlayContainer: HTMLDivElement | null = null;
  private crystalElements: HTMLDivElement[] = [];
  private reducedMotion = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Check for reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create overlay container
    this.overlayContainer = document.createElement('div');
    this.overlayContainer.className = 'sn-crystalline-overlay';

    // Create three floating crystals
    const crystalVariants = ['a', 'b', 'c'] as const;

    for (const variant of crystalVariants) {
      const crystal = document.createElement('div');
      crystal.className = `sn-atmospheric-crystal sn-atmospheric-crystal--${variant}`;

      // Apply static position if reduced motion
      if (this.reducedMotion) {
        crystal.style.animation = 'none';
      }

      this.overlayContainer.appendChild(crystal);
      this.crystalElements.push(crystal);
    }

    // Inject into DOM
    document.body.appendChild(this.overlayContainer);

    this.initialized = true;
  }

  updateAnimation(_deltaTime: number): void {
    // Crystals are CSS-animated - no per-frame updates needed
  }

  async healthCheck(): Promise<HealthCheckResult> {
    if (!this.initialized) {
      return {
        healthy: false,
        details: "AtmosphericCrystalsSystem not initialized",
      };
    }

    const overlayInDOM = document.body.contains(this.overlayContainer);
    const crystalsIntact = this.crystalElements.length === 3 &&
      this.crystalElements.every(el => this.overlayContainer?.contains(el));

    if (!overlayInDOM || !crystalsIntact) {
      return {
        healthy: false,
        details: `Crystal elements missing (overlay: ${overlayInDOM}, crystals: ${crystalsIntact})`,
      };
    }

    return {
      healthy: true,
      details: "AtmosphericCrystalsSystem operational - 3 crystals rendering",
    };
  }

  destroy(): void {
    if (this.overlayContainer && document.body.contains(this.overlayContainer)) {
      document.body.removeChild(this.overlayContainer);
    }

    this.crystalElements = [];
    this.overlayContainer = null;
    this.initialized = false;
  }

  forceRepaint(): void {
    // Crystals are static CSS animations - no repaint needed
  }
}
