// Paint Worklet: sn-aura
// Draws a circular glow whose intensity is controlled by CSS custom property
// --sn-glow-level (0..1). This file is registered by QuickAddRadialMenu when
// CSS.paintWorklet is available.

registerPaint(
  "sn-aura",
  class {
    static get inputProperties() {
      return ["--sn-glow-level"];
    }

    paint(ctx, geom, props) {
      const w = geom.width;
      const h = geom.height;
      const level = parseFloat(props.get("--sn-glow-level").toString()) || 0;
      if (level === 0) return;

      const radius = Math.min(w, h) / 2;
      const grd = ctx.createRadialGradient(
        w / 2,
        h / 2,
        radius * 0.1,
        w / 2,
        h / 2,
        radius
      );
      grd.addColorStop(0, `rgba(255,255,255,${0.4 * level})`);
      grd.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    }
  }
);
