/**
 * Organic Ripple Effect - Individual ripple effect with Year 3000 organic rendering
 * Transforms from mechanical ellipses to stardust constellation patterns
 */

import type { RippleConfig, CoordinatePoint } from './types';
import { OrganicRippleRenderer } from './OrganicRippleRenderer';

export class RippleEffect {
  private element: HTMLElement | SVGElement;
  private isActive: boolean = false;
  private animationId: number | null = null;
  private config: RippleConfig | null = null;
  private physicsUpdateId: number | null = null;
  
  // Physics state for organic movement
  private currentPosition: CoordinatePoint = { x: 0, y: 0 };
  private currentVelocity: CoordinatePoint = { x: 0, y: 0 };
  private currentRotation: number = 0;
  private startTime: number = 0;

  constructor() {
    this.element = this.createFallbackElement();
  }

  private createFallbackElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'sn-organic-ripple-effect';
    element.style.cssText = `
      position: absolute;
      pointer-events: none;
      transform-origin: center;
      will-change: transform, opacity;
      opacity: 0;
      transform: scale(0);
      transition: none;
    `;
    return element;
  }

  configure(config: RippleConfig): void {
    this.config = config;
    this.isActive = true;
    this.startTime = Date.now();
    
    // Initialize physics state
    this.currentPosition = { x: config.x, y: config.y };
    this.currentVelocity = config.velocity || { x: 0, y: 0 };
    this.currentRotation = config.rotation || 0;
    
    // Create organic element based on variant
    this.createOrganicElement();
    
    // Set initial positioning and styling
    this.updateElementTransform();
    this.element.style.zIndex = this.getZIndexForType(config.type);
  }

  private createOrganicElement(): void {
    if (!this.config) return;
    
    const variantConfig = OrganicRippleRenderer.getVariantConfig(this.config.variant);
    
    // Remove old element
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    // Create new element based on render method
    switch (variantConfig.renderMethod) {
      case 'svg':
        this.element = OrganicRippleRenderer.createSVGElement(this.config);
        break;
      case 'canvas':
        this.element = this.createCanvasElement();
        break;
      case 'css':
      default:
        this.element = this.createCSSOrganicElement();
        break;
    }
    
    // Add organic ripple class
    this.element.classList.add('sn-organic-ripple-effect');
  }

  private createCSSOrganicElement(): HTMLElement {
    const element = document.createElement('div');
    const { variant, size, color, intensity } = this.config!;
    
    element.style.cssText = `
      position: absolute;
      pointer-events: none;
      transform-origin: center;
      will-change: transform, opacity;
      opacity: 0;
      transform: scale(0);
      transition: none;
    `;
    
    // Apply variant-specific CSS styling
    switch (variant) {
      case 'wave':
        this.applyWaveCSS(element, size, color, intensity);
        break;
      case 'aurora':
        this.applyAuroraCSS(element, size, color, intensity);
        break;
      case 'classic':
        this.applyClassicCSS(element, size, color, intensity);
        break;
      default:
        this.applyStardustCSS(element, size, color, intensity);
    }
    
    return element;
  }

  private applyWaveCSS(element: HTMLElement, size: number, color: string, intensity: number): void {
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.background = `
      conic-gradient(from 0deg, 
        transparent 0deg, 
        ${color}${Math.round(intensity * 40).toString(16).padStart(2, '0')} 90deg,
        transparent 180deg,
        ${color}${Math.round(intensity * 60).toString(16).padStart(2, '0')} 270deg,
        transparent 360deg
      )
    `;
    element.style.borderRadius = '40% 60% 70% 30%';
    element.style.filter = 'blur(1px)';
  }

  private applyAuroraCSS(element: HTMLElement, size: number, color: string, intensity: number): void {
    element.style.width = `${size * 1.2}px`;
    element.style.height = `${size * 0.6}px`;
    element.style.background = `
      linear-gradient(45deg,
        transparent 0%,
        ${color}${Math.round(intensity * 50).toString(16).padStart(2, '0')} 30%,
        ${color}${Math.round(intensity * 80).toString(16).padStart(2, '0')} 50%,
        ${color}${Math.round(intensity * 50).toString(16).padStart(2, '0')} 70%,
        transparent 100%
      )
    `;
    element.style.borderRadius = '50% 20% 80% 30%';
    element.style.filter = 'blur(2px)';
  }

  private applyStardustCSS(element: HTMLElement, size: number, color: string, intensity: number): void {
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.background = `
      radial-gradient(circle at 30% 30%, ${color} 2px, transparent 2px),
      radial-gradient(circle at 70% 20%, ${color} 1px, transparent 1px),
      radial-gradient(circle at 20% 80%, ${color} 1.5px, transparent 1.5px),
      radial-gradient(circle at 80% 70%, ${color} 1px, transparent 1px),
      radial-gradient(circle at 50% 50%, ${color}40 ${size * 0.3}px, transparent ${size * 0.6}px)
    `;
    element.style.backgroundSize = `${size}px ${size}px`;
  }

  private applyClassicCSS(element: HTMLElement, size: number, color: string, intensity: number): void {
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
    element.style.borderRadius = '50%';
  }

  private createCanvasElement(): HTMLElement {
    // For canvas-based rendering (nebula variant), create a canvas element
    const canvas = document.createElement('canvas');
    const { size } = this.config!;
    
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.cssText = `
      position: absolute;
      pointer-events: none;
      transform-origin: center;
      will-change: transform, opacity;
      opacity: 0;
      transform: scale(0);
      transition: none;
    `;
    
    this.renderNebulaCanvas(canvas);
    return canvas;
  }

  private renderNebulaCanvas(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.config) return;
    
    const { size, color, intensity } = this.config;
    const clouds = OrganicRippleRenderer.generateNebulaCloud(
      size, size, size * 0.7, 20, Date.now() - this.config.timestamp
    );
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    clouds.forEach(cloud => {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.fillStyle = `${color}${Math.round(cloud.opacity * intensity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
      ctx.filter = 'blur(2px)';
    });
  }

  private updateElementTransform(): void {
    if (!this.config) return;
    
    const { size } = this.config;
    
    // Calculate transform based on current physics state
    const translateX = this.currentPosition.x - size;
    const translateY = this.currentPosition.y - size;
    const rotation = this.currentRotation;
    
    this.element.style.left = `${translateX}px`;
    this.element.style.top = `${translateY}px`;
    
    if (rotation !== 0) {
      this.element.style.transform = `scale(0) rotate(${rotation}rad)`;
    } else {
      this.element.style.transform = 'scale(0)';
    }
  }

  private getZIndexForType(type: string): string {
    switch (type) {
      case 'beat': return '10';
      case 'selection': return '11';
      case 'click': return '12';
      default: return '10';
    }
  }

  async animate(): Promise<void> {
    if (!this.config || !this.isActive) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const { duration, variant } = this.config!;
      const variantConfig = OrganicRippleRenderer.getVariantConfig(variant);
      
      // Set up animation style based on variant
      const easing = this.getEasingForVariant(variantConfig.animationStyle);
      this.element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      
      // Start physics updates if variant supports it
      if (this.hasPhysics()) {
        this.startPhysicsUpdates();
      }
      
      // Trigger animation
      requestAnimationFrame(() => {
        this.element.style.transform = this.getFinalTransform();
        this.element.style.opacity = '0';
      });

      // Cleanup after animation
      this.animationId = window.setTimeout(() => {
        this.stopPhysicsUpdates();
        this.reset();
        resolve();
      }, duration);
    });
  }

  private getEasingForVariant(animationStyle: string): string {
    switch (animationStyle) {
      case 'elastic': return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      case 'bounce': return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      case 'wave': return 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      case 'smooth':
      default: return 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
  }

  private getFinalTransform(): string {
    if (!this.config) return 'scale(1)';
    
    const scale = this.config.variant === 'constellation' ? 1.2 : 1;
    const rotation = this.currentRotation;
    
    if (rotation !== 0) {
      return `scale(${scale}) rotate(${rotation}rad)`;
    }
    
    return `scale(${scale})`;
  }

  private hasPhysics(): boolean {
    if (!this.config) return false;
    return this.config.velocity !== undefined || this.config.acceleration !== undefined;
  }

  private startPhysicsUpdates(): void {
    if (!this.config) return;
    
    const updatePhysics = () => {
      if (!this.isActive || !this.config) return;
      
      const deltaTime = 16; // Assume 60fps
      
      // Update velocity with acceleration
      if (this.config.acceleration) {
        this.currentVelocity.x += this.config.acceleration.x * deltaTime * 0.001;
        this.currentVelocity.y += this.config.acceleration.y * deltaTime * 0.001;
      }
      
      // Update position with velocity
      this.currentPosition.x += this.currentVelocity.x * deltaTime * 0.001;
      this.currentPosition.y += this.currentVelocity.y * deltaTime * 0.001;
      
      // Update rotation
      if (this.config.variant === 'aurora') {
        this.currentRotation += 0.02;
      }
      
      // Apply physics to element transform
      this.updatePhysicsTransform();
      
      this.physicsUpdateId = requestAnimationFrame(updatePhysics);
    };
    
    this.physicsUpdateId = requestAnimationFrame(updatePhysics);
  }

  private stopPhysicsUpdates(): void {
    if (this.physicsUpdateId) {
      cancelAnimationFrame(this.physicsUpdateId);
      this.physicsUpdateId = null;
    }
  }

  private updatePhysicsTransform(): void {
    if (!this.config) return;
    
    const { size } = this.config;
    const translateX = this.currentPosition.x - size;
    const translateY = this.currentPosition.y - size;
    
    // Update position without affecting the scale animation
    this.element.style.left = `${translateX}px`;
    this.element.style.top = `${translateY}px`;
  }

  reset(): void {
    this.isActive = false;
    this.config = null;
    
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
    
    this.stopPhysicsUpdates();
    
    // Reset physics state
    this.currentPosition = { x: 0, y: 0 };
    this.currentVelocity = { x: 0, y: 0 };
    this.currentRotation = 0;
    
    // Reset styles
    this.element.style.transition = 'none';
    this.element.style.transform = 'scale(0)';
    this.element.style.opacity = '0';
    this.element.style.left = '0px';
    this.element.style.top = '0px';
  }

  getElement(): HTMLElement | SVGElement {
    return this.element;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  destroy(): void {
    this.reset();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}