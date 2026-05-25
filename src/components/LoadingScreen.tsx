"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

// ── Constants ──────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!";
const TOTAL_MS = 2700;

// ── Scramble hook ──────────────────────────────────────────────────────────────

const rndChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

/**
 * Scrambles `target` with random chars, resolving left-to-right over
 * `durationMs` after an initial `delayMs` of pure noise.
 */
function useScramble(target: string, delayMs = 0, durationMs = 1400) {
  const [text, setText] = useState(() => target.replace(/./g, rndChar));

  useEffect(() => {
    let raf: number;
    let startTs: number | null = null;

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs;

      if (elapsed < delayMs) {
        setText(target.replace(/./g, rndChar));
        raf = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((elapsed - delayMs) / durationMs, 1);
      const resolved = Math.floor(progress * target.length);
      setText(
        target
          .split("")
          .map((c, i) => (i < resolved ? c : rndChar()))
          .join(""),
      );

      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delayMs, durationMs]);

  return text;
}

// ── Orbit rings ────────────────────────────────────────────────────────────────

function OrbitRings() {
  return (
    <div
      aria-hidden
      className="relative w-36 h-36 md:w-48 md:h-48"
      style={{ perspective: "600px" }}
    >
      {/* Outer ring — slow CW */}
      <motion.div
        initial={{ rotateX: 72, rotateZ: 0 }}
        animate={{ rotateX: 72, rotateZ: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-white/[0.06]"
      />

      {/* Middle ring — medium CCW; accent dot rides as absolute child */}
      <motion.div
        initial={{ rotateX: 65, rotateZ: 0 }}
        animate={{ rotateX: 65, rotateZ: -360 }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        className="absolute inset-3 md:inset-4 rounded-full border border-white/[0.11]"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
          style={{ boxShadow: "0 0 10px 4px rgba(231,142,41,0.6)" }}
        />
      </motion.div>

      {/* Inner accent ring — fast CW */}
      <motion.div
        initial={{ rotateX: 78, rotateZ: 60 }}
        animate={{ rotateX: 78, rotateZ: 420 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        className="absolute inset-8 md:inset-11 rounded-full border border-[var(--accent)]/[0.20]"
      />

      {/* Centre glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-1 h-1 rounded-full bg-white/30"
          style={{ boxShadow: "0 0 8px 4px rgba(255,255,255,0.10)" }}
        />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const scrambled = useScramble("2026", 150, 1500);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let raf: number;
    let startTs = 0;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min(((ts - startTs) / TOTAL_MS) * 100, 100);
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => onCompleteRef.current(), 400);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--bg)" }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* Scanline overlay */}
      <div
        className="scanline opacity-10 pointer-events-none absolute inset-0"
        aria-hidden
      />

      {/* ── Top row ─────────────────────────────────────────────── */}
      <div className="flex justify-between items-start px-8 md:px-14 pt-8 md:pt-12">
        {/* SYSTEM INIT label — rotateX flip entrance */}
        <div style={{ perspective: 500 }}>
          <motion.p
            initial={{ opacity: 0, rotateX: 80 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] uppercase"
            style={{ transformOrigin: "bottom center" }}
          >
            SYSTEM INIT ──
          </motion.p>
        </div>

        {/* Character scramble — resolves to "2026" */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="font-mono text-[11px] tracking-[0.3em] text-[var(--muted)] tabular-nums select-none"
        >
          {scrambled}
        </motion.p>
      </div>

      {/* ── Body — name left, orbit rings right ─────────────────── */}
      <div className="flex-1 flex items-center px-8 md:px-14 gap-8 md:gap-16">
        {/* Identity block */}
        <div className="flex-1 space-y-4 md:space-y-5">
          {/* Name — clip-path wipe from left */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
              className="font-display font-bold leading-[0.92] tracking-tight text-white uppercase whitespace-nowrap"
              style={{ fontSize: "clamp(40px, 8.5vw, 116px)" }}
            >
              PARIWESH T
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.85 }}
            className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-[var(--accent)] uppercase"
          >
            // AI ENGINEER · FULL-STACK
          </motion.p>
        </div>

        {/* Orbit rings — hidden on xs screens */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
          className="hidden sm:flex items-center justify-center shrink-0"
        >
          <OrbitRings />
        </motion.div>
      </div>

      {/* ── Bottom row — faded progress counter ─────────────────── */}
      <div className="px-8 md:px-14 pb-6 md:pb-10 flex justify-end">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-[90px] tabular-nums text-white/[0.10] select-none leading-none"
        >
          {Math.round(progress).toString().padStart(3, "0")}
        </motion.span>
      </div>

      {/* ── Progress bar — orange, GPU via scaleX ───────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--stroke)]">
        <div
          className="h-full origin-left"
          style={{
            transform: `scaleX(${progress / 100})`,
            background:
              "linear-gradient(90deg, var(--accent) 0%, rgba(231,142,41,0.5) 100%)",
            boxShadow: "0 0 14px rgba(231,142,41,0.45)",
          }}
        />
      </div>
    </motion.div>
  );
}
