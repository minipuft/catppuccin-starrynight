// ============================================================================
// 🌱 FLIP SPRING HELPER – Phase 2 of Drag-and-Drop Refinements
// ----------------------------------------------------------------------------
// Provides a micro spring interpolator to be used with FLIP (First, Last, Invert, Play)
// animations. It intentionally avoids external deps and ships in < 1 KB.
//
// Usage:
//   const animator = spring({stiffness: 220, damping: 20, onUpdate: (v)=>{
//     element.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
//   }});
//   animator.to({x:0, y:0, s:1});   // play
//
// TODO(Phase2): Consider replacing with browser-native `view-timeline` once
//              widely supported.
// ----------------------------------------------------------------------------

export interface SpringConfig {
  stiffness?: number; // spring constant
  damping?: number; // friction coeff
  mass?: number; // virtual mass
  onUpdate: (state: Record<string, number>) => void;
}

export function spring(config: SpringConfig) {
  const k = config.stiffness ?? 260;
  const d = config.damping ?? 24;
  const m = config.mass ?? 1;

  let current: Record<string, number> = {};
  let velocity: Record<string, number> = {};
  let target: Record<string, number> = {};
  let animId: number | null = null;

  function step() {
    let done = true;
    const dt = 1 / 60;
    for (const key in target) {
      const x = current[key] ?? 0;
      const v = velocity[key] ?? 0;
      const goal = target[key] ?? 0;
      const Fspring = -k * (x - goal);
      const Fdamp = -d * v;
      const a = (Fspring + Fdamp) / m;
      const newV = v + a * dt;
      const newX = x + newV * dt;
      velocity[key] = newV;
      current[key] = newX;
      if (Math.abs(newV) > 0.1 || Math.abs(newX - goal) > 0.1) done = false;
    }
    config.onUpdate(current);
    if (!done) animId = requestAnimationFrame(step);
  }

  return {
    to(newTarget: Record<string, number>) {
      target = newTarget;
      if (!animId) animId = requestAnimationFrame(step);
    },
  };
}

// expose global flag for sidebar capability detection
(window as any).snFlipSpringLoaded = true;
