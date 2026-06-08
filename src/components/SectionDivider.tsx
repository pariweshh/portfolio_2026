"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface SectionDividerProps {
  /** The large word to display — e.g. "ABOUT." */
  word: string;
  /** Small mono label above the word — e.g. "// Background" */
  label?: string;
  /** Render the word in accent orange instead of white */
  accent?: boolean;
}

export default function SectionDivider({ word, label, accent = false }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle parallax: word drifts upward as you scroll through the section
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-start justify-center overflow-hidden bg-[#0a0a0a] px-6 md:px-16 py-20 md:py-28"
    >
      {/* Top rule — animates in from left */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}
        className="absolute top-0 left-0 right-0 h-px bg-white/[0.07] origin-left"
      />

      <motion.div style={{ y }} className="w-full">
        {label && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-mono text-[11px] tracking-[0.28em] text-[var(--muted)] uppercase mb-6"
          >
            {label}
          </motion.p>
        )}

        {/* Overflow hidden clips the word reveal from below */}
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 1.0, ease: EASE }}
            className="font-heading font-bold leading-none tracking-[-0.04em] select-none whitespace-nowrap"
            style={{
              fontSize: "clamp(4.5rem, 14vw, 18rem)",
              color: accent ? "var(--accent)" : "rgba(255,255,255,0.92)",
            }}
          >
            {word}
          </motion.h2>
        </div>
      </motion.div>

      {/* Bottom rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.07] origin-right"
      />
    </div>
  );
}
