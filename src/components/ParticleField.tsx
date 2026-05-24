"use client";
import { useEffect, useRef } from "react";

// ── Config ─────────────────────────────────────────────────────────────────────
const SPACING = 60;        // px between grid nodes
const MOUSE_R = 160;       // px radius of mouse influence
const PUSH = 10;           // max repulsion force (px/frame)
const STIFFNESS = 0.055;   // spring return strength
const DAMPING = 0.82;      // velocity damping (lower = bouncier)
const DOT_R = 1.5;         // dot draw radius
const DOT_ALPHA = 0.16;    // base dot opacity
const LINE_ALPHA = 0.07;   // base line opacity
const LINE_BOOST = 0.28;   // extra line opacity near cursor
const ACCENT: [number, number, number] = [249, 115, 22]; // orange-500

type Particle = {
  bx: number; by: number;
  x: number;  y: number;
  vx: number; vy: number;
};

export default function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let pairs: [number, number][] = [];
    let mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let running = false;

    // ── Build grid ─────────────────────────────────────────────────────────────
    function build() {
      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;
      particles = [];
      pairs = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * SPACING;
          const by = r * SPACING;
          particles.push({ bx, by, x: bx, y: by, vx: 0, vy: 0 });
          const i = r * cols + c;
          if (c + 1 < cols) pairs.push([i, i + 1]);
          if (r + 1 < rows) pairs.push([i, i + cols]);
          if (r + 1 < rows && c + 1 < cols) pairs.push([i, i + cols + 1]);
          if (r + 1 < rows && c > 0) pairs.push([i, i + cols - 1]);
        }
      }
    }

    // ── Tick ───────────────────────────────────────────────────────────────────
    function tick() {
      raf = requestAnimationFrame(tick);
      if (!running) return;

      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;
      const mx = mouse.x;
      const my = mouse.y;
      const mr2 = MOUSE_R * MOUSE_R;
      const maxLD = SPACING * Math.SQRT2 * 1.06;
      const maxLD2 = maxLD * maxLD;
      const wakeR2 = (MOUSE_R * 2) ** 2;

      ctx!.clearRect(0, 0, W, H);

      // Physics — skip particles that are sleeping and far from cursor
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dbx = p.bx - mx;
        const dby = p.by - my;
        const nearCursor = dbx * dbx + dby * dby < wakeR2;
        const moving = Math.abs(p.vx) > 0.005 || Math.abs(p.vy) > 0.005
          || Math.abs(p.x - p.bx) > 0.05 || Math.abs(p.y - p.by) > 0.05;

        if (!nearCursor && !moving) continue;

        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < mr2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / MOUSE_R) * PUSH;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }

        p.vx += (p.bx - p.x) * STIFFNESS;
        p.vy += (p.by - p.y) * STIFFNESS;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Lines — O(n) via precomputed neighbour pairs
      ctx!.lineWidth = 0.5;
      for (let k = 0; k < pairs.length; k++) {
        const a = particles[pairs[k][0]];
        const b = particles[pairs[k][1]];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > maxLD2) continue;

        const t = 1 - Math.sqrt(d2) / maxLD;
        const cmx = (a.x + b.x) * 0.5 - mx;
        const cmy = (a.y + b.y) * 0.5 - my;
        const near = Math.max(0, 1 - Math.sqrt(cmx * cmx + cmy * cmy) / MOUSE_R);
        ctx!.strokeStyle = `rgba(255,255,255,${(LINE_ALPHA * t + LINE_BOOST * near).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }

      // Dots — blend white → orange near cursor
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - mx;
        const dy = p.y - my;
        const t = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / MOUSE_R);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, DOT_R, 0, Math.PI * 2);
        if (t > 0) {
          const r = Math.round(255 + (ACCENT[0] - 255) * t);
          const g = Math.round(255 + (ACCENT[1] - 255) * t);
          const b = Math.round(255 + (ACCENT[2] - 255) * t);
          ctx!.fillStyle = `rgba(${r},${g},${b},${(DOT_ALPHA + t * 0.65).toFixed(3)})`;
        } else {
          ctx!.fillStyle = `rgba(255,255,255,${DOT_ALPHA})`;
        }
        ctx!.fill();
      }
    }

    // ── Static render (prefers-reduced-motion) ─────────────────────────────────
    function drawStatic() {
      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;
      const maxLD = SPACING * Math.SQRT2 * 1.06;
      const maxLD2 = maxLD * maxLD;
      ctx!.clearRect(0, 0, W, H);
      ctx!.lineWidth = 0.5;
      ctx!.strokeStyle = `rgba(255,255,255,${LINE_ALPHA})`;
      for (const [ai, bi] of pairs) {
        const a = particles[ai];
        const b = particles[bi];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy > maxLD2) continue;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }
      ctx!.fillStyle = `rgba(255,255,255,${DOT_ALPHA})`;
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, DOT_R, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function start() { if (!running && !reducedMotion) { running = true; } }
    function stop()  { running = false; }

    build();
    if (reducedMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const io = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? start() : stop(); },
      { threshold: 0 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      build();
      if (reducedMotion) drawStatic();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
