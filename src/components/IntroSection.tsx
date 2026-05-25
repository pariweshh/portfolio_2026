"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "motion/react";
import AnimatedHeading from "./AnimatedHeading";

const STATS = [
  { value: "3+", label: "Years of production full-stack engineering" },
  { value: "10+", label: "Projects shipped end-to-end" },
  { value: "3", label: "LLM providers integrated in production" },
];

interface StatCounterProps {
  value: string;
}

function StatCounter({ value }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(inViewRef, { once: true, margin: "-60px" });
  const hasRunRef = useRef(false);

  const match = value.match(/^(\d+)(.*)$/);
  const numericValue = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (!inView || hasRunRef.current) return;
    hasRunRef.current = true;

    const controls = animate(0, numericValue, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = Math.round(v) + suffix;
        }
      },
    });

    return () => controls.stop();
  }, [inView, numericValue, suffix]);

  return (
    <span ref={inViewRef}>
      <span ref={ref}>0{suffix}</span>
    </span>
  );
}

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
          <AnimatedHeading
            as="h2"
            text="I'm a full-stack engineer who turns ideas into intelligent systems."
            className="font-heading font-bold leading-[1.08] tracking-[-0.02em] text-white text-4xl sm:text-5xl md:text-[72px] lg:text-[84px]"
          />
          <AnimatedHeading
            as="p"
            delay={0.18}
            text="AI-first architecture, built to scale."
            className="font-heading text-(--accent) font-bold leading-[1.08] tracking-[-0.02em] text-4xl sm:text-5xl md:text-[72px] lg:text-[84px] mt-2"
          />
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
                <StatCounter value={stat.value} />
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
