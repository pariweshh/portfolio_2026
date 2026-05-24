"use client";
import { motion } from "motion/react";

const STATS = [
  { value: "3+", label: "Years of production full-stack engineering" },
  { value: "10+", label: "Projects shipped end-to-end" },
  { value: "3", label: "LLM providers integrated in production" },
];

export default function IntroSection() {
  return (
    <section
      id="intro"
      className="bg-(--bg) pt-25 pb-28 md:pb-44 px-6 md:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-white/8 pt-6 text-(--muted) font-mono text-[11px] tracking-[0.2em] uppercase mb-16"
        >
          // INTRO
        </motion.p>

        <div className="mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-bold leading-[1.08] tracking-[-0.02em] text-white text-4xl sm:text-5xl md:text-[72px] lg:text-[84px]"
          >
            I&apos;m a full-stack engineer who turns{" "}
            <span style={{ color: "var(--accent)" }}>ideas</span> into{" "}
            <span style={{ color: "var(--accent)" }}>intelligent systems.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="font-heading font-bold leading-[1.08] tracking-[-0.02em] text-white text-4xl sm:text-5xl md:text-[72px] lg:text-[84px] mt-2"
          >
            <span style={{ color: "var(--accent)" }}>AI-first</span>{" "}
            architecture, built to{" "}
            <span style={{ color: "var(--accent)" }}>scale.</span>
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
              className="border-b sm:border-b-0 sm:border-r last:border-r-0 border-white/8 py-10 px-8 md:px-10"
            >
              <div
                className="font-heading font-bold leading-none text-5xl md:text-6xl"
                style={{ color: "var(--accent)" }}
              >
                {stat.value}
              </div>
              <p className="text-(--muted) text-sm mt-3 leading-relaxed max-w-50">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
