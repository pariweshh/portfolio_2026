"use client";
import { motion } from "motion/react";
import ParticleField from "./ParticleField";

const SKILLS = [
  "AI Agent Engineering",
  "LLM Integration & Prompting",
  "RAG Pipeline Design",
  "Full-Stack Development",
  "Next.js & React",
  "TypeScript Architecture",
  "Vector Search Systems",
  "Node.js & Python APIs",
  "Database Engineering",
  "Cloud & CI/CD",
  "Real-time Applications",
  "Motion & Creative Coding",
];

export default function ExpertiseSection() {
  return (
    <section id="expertise" className="relative bg-(--bg)">
      {/* <VectorField /> */}
      <ParticleField />

      <div className="relative z-10 px-6 md:px-16 pt-25 pb-28 md:pb-44">
        {/* Header */}
        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-(--muted) font-mono text-[11px] tracking-[0.2em] uppercase self-start"
          >
            // EXPERTISE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-bold leading-[1.08] tracking-[-0.02em] text-white text-4xl md:text-6xl lg:text-7xl"
          >
            Areas of
            <br />
            Expertise.
          </motion.h2>
        </div>

        {/* Numbered grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {SKILLS.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: (i % 4) * 0.06,
                }}
                className={`grid grid-cols-[1fr_auto] items-center gap-8 border-b border-white/8 py-5 group cursor-default ${
                  i % 2 === 0 ? "md:pr-16" : "md:pl-16"
                }`}
              >
                <span className="font-heading font-semibold text-white text-lg md:text-xl group-hover:text-(--accent) transition-colors duration-300">
                  {skill}
                </span>
                <span className="text-(--muted) font-mono text-sm tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
