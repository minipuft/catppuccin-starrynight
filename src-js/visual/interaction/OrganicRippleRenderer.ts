/**
 * Organic Ripple Renderer - SVG/Canvas-based organic shape generation
 * Transforms mechanical ellipses into organic, Year 3000-aligned visual effects
 */

import type { RippleVariant, RippleConfig, CoordinatePoint, RippleVariantConfig } from './types';

export class OrganicRippleRenderer {
  private static readonly VARIANT_CONFIGS: Record<RippleVariant, RippleVariantConfig> = {
    stardust: {
      shapeComplexity: 8,
      particleCount: 12,
      trailLength: 0.3,
      organicness: 0.9,
      animationStyle: 'elastic',
      renderMethod: 'svg'
    },
    constellation: {
      shapeComplexity: 6,
      particleCount: 8,
      trailLength: 0.8,
      organicness: 0.7,
      animationStyle: 'smooth',
      renderMethod: 'svg'
    },
    wave: {
      shapeComplexity: 4,
      particleCount: 1,
      trailLength: 1.2,
      organicness: 0.8,
      animationStyle: 'wave',
      renderMethod: 'css'
    },
    nebula: {
      shapeComplexity: 10,
      particleCount: 20,
      trailLength: 0.5,
      organicness: 1.0,
      animationStyle: 'smooth',
      renderMethod: 'canvas'
    },
    aurora: {
      shapeComplexity: 7,
      particleCount: 15,
      trailLength: 1.5,
      organicness: 0.9,
      animationStyle: 'wave',
      renderMethod: 'css'
    },
    classic: {
      shapeComplexity: 1,
      particleCount: 1,
      trailLength: 0,
      organicness: 0,
      animationStyle: 'smooth',
      renderMethod: 'css'
    }
  };

  /**
   * Generate organic shape path for SVG rendering
   */
  static generateOrganicPath(
    centerX: number,
    centerY: number,
    baseRadius: number,
    variant: RippleVariant,
    time: number = 0
  ): string {
    const config = this.VARIANT_CONFIGS[variant];
    const complexity = config.shapeComplexity;
    const organicness = config.organicness;
    
    if (variant === 'classic') {
      // Fallback to circle for classic variant
      return `M ${centerX + baseRadius},${centerY} A ${baseRadius},${baseRadius} 0 1,1 ${centerX - baseRadius},${centerY} A ${baseRadius},${baseRadius} 0 1,1 ${centerX + baseRadius},${centerY}`;
    }

    const points: CoordinatePoint[] = [];
    const angleStep = (Math.PI * 2) / complexity;
    
    for (let i = 0; i < complexity; i++) {
      const angle = i * angleStep + time * 0.001; // Subtle rotation over time
      
      // Add organic variation using multiple sine waves
      const radiusVariation = 1 + 
        Math.sin(angle * 3 + time * 0.002) * organicness * 0.3 +
        Math.sin(angle * 5 + time * 0.001) * organicness * 0.15 +
        Math.sin(angle * 7 + time * 0.003) * organicness * 0.1;
      
      const radius = baseRadius * radiusVariation;
      
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    }

    // Generate smooth path using bezier curves
    return this.generateSmoothPath(points, true);
  }

  /**
   * Generate stardust particle positions
   */
  static generateStardustParticles(
    centerX: number,
    centerY: number,
    radius: number,
    count: number,
    time: number = 0
  ): CoordinatePoint[] {
    const particles: CoordinatePoint[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + time * 0.0005;
      const distance = radius * (0.3 + Math.random() * 0.7);
      
      // Add subtle spiral motion
      const spiralOffset = Math.sin(time * 0.001 + i) * 20;
      
      particles.push({
        x: centerX + Math.cos(angle) * (distance + spiralOffset),
        y: centerY + Math.sin(angle) * (distance + spiralOffset)
      });
    }
    
    return particles;
  }

  /**
   * Generate constellation connection lines
   */
  static generateConstellationConnections(
    particles: CoordinatePoint[],
    maxDistance: number
  ): Array<[number, number]> {
    const connections: Array<[number, number]> = [];
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = Math.sqrt(
          Math.pow(particles[i].x - particles[j].x, 2) +
          Math.pow(particles[i].y - particles[j].y, 2)
        );
        
        if (distance < maxDistance) {
          connections.push([i, j]);
        }
      }
    }
    
    return connections;
  }

  /**
   * Generate wave ripple path
   */
  static generateWavePath(
    centerX: number,
    centerY: number,
    radius: number,
    waveCount: number = 3,
    time: number = 0
  ): string {
    const points: CoordinatePoint[] = [];
    const pointCount = 64; // High resolution for smooth waves
    
    for (let i = 0; i <= pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      
      // Create wave pattern with multiple frequencies
      const waveIntensity = 
        Math.sin(angle * waveCount + time * 0.002) * 0.2 +
        Math.sin(angle * waveCount * 2 + time * 0.003) * 0.1;
      
      const currentRadius = radius * (1 + waveIntensity);
      
      points.push({
        x: centerX + Math.cos(angle) * currentRadius,
        y: centerY + Math.sin(angle) * currentRadius
      });
    }
    
    return this.generateSmoothPath(points, true);
  }

  /**
   * Generate aurora-style gradient stops
   */
  static generateAuroraGradient(
    baseColor: string,
    intensity: number
  ): Array<{ offset: string; color: string; opacity: number }> {
    const { r, g, b } = this.hexToRgb(baseColor);
    
    return [
      { offset: '0%', color: `rgb(${r}, ${g}, ${b})`, opacity: intensity * 0.8 },
      { offset: '30%', color: `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 60)})`, opacity: intensity * 0.6 },
      { offset: '60%', color: `rgb(${Math.min(255, r + 20)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 80)})`, opacity: intensity * 0.4 },
      { offset: '100%', color: `rgb(${r}, ${g}, ${b})`, opacity: 0 }
    ];
  }

  /**
   * Generate nebula cloud points
   */
  static generateNebulaCloud(
    centerX: number,
    centerY: number,
    radius: number,
    cloudCount: number,
    time: number = 0
  ): Array<{ x: number; y: number; size: number; opacity: number }> {
    const clouds: Array<{ x: number; y: number; size: number; opacity: number }> = [];
    
    for (let i = 0; i < cloudCount; i++) {
      const angle = (i / cloudCount) * Math.PI * 2 + time * 0.0002;
      const distance = radius * (0.2 + Math.random() * 0.8);
      
      // Add organic movement
      const organicX = Math.sin(time * 0.0003 + i) * 15;
      const organicY = Math.cos(time * 0.0004 + i) * 10;
      
      clouds.push({
        x: centerX + Math.cos(angle) * distance + organicX,
        y: centerY + Math.sin(angle) * distance + organicY,
        size: radius * (0.1 + Math.random() * 0.3),
        opacity: 0.3 + Math.random() * 0.4
      });
    }
    
    return clouds;
  }

  /**
   * Create SVG element for organic ripple
   */
  static createSVGElement(config: RippleConfig): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const variantConfig = this.VARIANT_CONFIGS[config.variant];
    
    svg.setAttribute('width', (config.size * 2).toString());
    svg.setAttribute('height', (config.size * 2).toString());
    svg.style.position = 'absolute';
    svg.style.left = `${config.x - config.size}px`;
    svg.style.top = `${config.y - config.size}px`;
    svg.style.pointerEvents = 'none';
    svg.style.overflow = 'visible';
    
    switch (config.variant) {
      case 'stardust':
        this.createStardustSVG(svg, config);
        break;
      case 'constellation':
        this.createConstellationSVG(svg, config);
        break;
      case 'aurora':
        this.createAuroraSVG(svg, config);
        break;
      case 'nebula':
        this.createNebulaSVG(svg, config);
        break;
      default:
        this.createWaveSVG(svg, config);
    }
    
    return svg;
  }

  /**
   * Helper methods for specific variant SVG creation
   */
  private static createStardustSVG(svg: SVGElement, config: RippleConfig): void {
    const particles = this.generateStardustParticles(
      config.size, config.size, config.size * 0.8,
      this.VARIANT_CONFIGS.stardust.particleCount,
      Date.now() - config.timestamp
    );
    
    particles.forEach((particle, index) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', particle.x.toString());
      circle.setAttribute('cy', particle.y.toString());
      circle.setAttribute('r', (2 + Math.random() * 3).toString());
      circle.setAttribute('fill', config.color);
      circle.setAttribute('opacity', (config.intensity * 0.7).toString());
      
      // Add twinkling animation
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'opacity');
      animate.setAttribute('values', `${config.intensity * 0.3};${config.intensity * 0.7};${config.intensity * 0.3}`);
      animate.setAttribute('dur', `${1 + Math.random() * 2}s`);
      animate.setAttribute('repeatCount', 'indefinite');
      animate.setAttribute('begin', `${Math.random() * 1}s`);
      
      circle.appendChild(animate);
      svg.appendChild(circle);
    });
  }

  private static createConstellationSVG(svg: SVGElement, config: RippleConfig): void {
    const particles = this.generateStardustParticles(
      config.size, config.size, config.size * 0.6,
      this.VARIANT_CONFIGS.constellation.particleCount,
      Date.now() - config.timestamp
    );
    
    const connections = this.generateConstellationConnections(particles, config.size * 0.5);
    
    // Draw connection lines first
    connections.forEach(([i, j]) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', particles[i].x.toString());
      line.setAttribute('y1', particles[i].y.toString());
      line.setAttribute('x2', particles[j].x.toString());
      line.setAttribute('y2', particles[j].y.toString());
      line.setAttribute('stroke', config.color);
      line.setAttribute('stroke-width', '1');
      line.setAttribute('opacity', (config.intensity * 0.4).toString());
      svg.appendChild(line);
    });
    
    // Draw stars
    particles.forEach(particle => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', particle.x.toString());
      circle.setAttribute('cy', particle.y.toString());
      circle.setAttribute('r', (1.5 + Math.random() * 2).toString());
      circle.setAttribute('fill', config.color);
      circle.setAttribute('opacity', (config.intensity * 0.8).toString());
      svg.appendChild(circle);
    });
  }

  private static createAuroraSVG(svg: SVGElement, config: RippleConfig): void {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    const gradientId = `aurora-gradient-${config.timestamp}`;
    
    gradient.setAttribute('id', gradientId);
    
    const stops = this.generateAuroraGradient(config.color, config.intensity);
    stops.forEach(stop => {
      const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stopElement.setAttribute('offset', stop.offset);
      stopElement.setAttribute('stop-color', stop.color);
      stopElement.setAttribute('stop-opacity', stop.opacity.toString());
      gradient.appendChild(stopElement);
    });
    
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const organicPath = this.generateOrganicPath(
      config.size, config.size, config.size * 0.8,
      'aurora', Date.now() - config.timestamp
    );
    
    path.setAttribute('d', organicPath);
    path.setAttribute('fill', `url(#${gradientId})`);
    svg.appendChild(path);
  }

  private static createNebulaSVG(svg: SVGElement, config: RippleConfig): void {
    const clouds = this.generateNebulaCloud(
      config.size, config.size, config.size * 0.7,
      this.VARIANT_CONFIGS.nebula.particleCount,
      Date.now() - config.timestamp
    );
    
    clouds.forEach(cloud => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cloud.x.toString());
      circle.setAttribute('cy', cloud.y.toString());
      circle.setAttribute('r', cloud.size.toString());
      circle.setAttribute('fill', config.color);
      circle.setAttribute('opacity', (cloud.opacity * config.intensity).toString());
      circle.setAttribute('filter', 'blur(2px)');
      svg.appendChild(circle);
    });
  }

  private static createWaveSVG(svg: SVGElement, config: RippleConfig): void {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const wavePath = this.generateWavePath(
      config.size, config.size, config.size * 0.8,
      3, Date.now() - config.timestamp
    );
    
    path.setAttribute('d', wavePath);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', config.color);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('opacity', (config.intensity * 0.6).toString());
    svg.appendChild(path);
  }

  /**
   * Utility methods
   */
  private static generateSmoothPath(points: CoordinatePoint[], closed: boolean = false): string {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[(i + 1) % points.length];
      
      // Calculate control points for smooth curve
      const cp1x = prev.x + (curr.x - (i > 1 ? points[i - 2].x : prev.x)) * 0.15;
      const cp1y = prev.y + (curr.y - (i > 1 ? points[i - 2].y : prev.y)) * 0.15;
      const cp2x = curr.x - (next.x - prev.x) * 0.15;
      const cp2y = curr.y - (next.y - prev.y) * 0.15;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
    }
    
    if (closed) {
      path += ' Z';
    }
    
    return path;
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 203, g: 166, b: 247 }; // Catppuccin mauve fallback
  }

  /**
   * Get variant configuration
   */
  static getVariantConfig(variant: RippleVariant): RippleVariantConfig {
    return this.VARIANT_CONFIGS[variant];
  }
}