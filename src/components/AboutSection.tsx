"use client";
import { motion } from "motion/react";
import Image from "next/image";

const HIGHLIGHT = {
  title: "AI Engineering — Independent Practice",
  subtitle: "Freelance · Since Jan 2024",
  tags: "RAG Systems, Multi-Agent Pipelines, LLM Integration",
};

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-[#0a0a0a]"
      style={{
        background:
          "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(231,142,41,0.06) 0%, transparent 65%), #0a0a0a",
      }}
    >
      {/* ── Label ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-25 pb-16 md:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-white/[0.08] pt-6 text-(--muted) font-mono text-[11px] tracking-[0.2em] uppercase"
        >
          // ABOUT
        </motion.p>
      </div>

      {/* ── Split layout ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0">
        {/* Left — photo placeholder (stays dark for contrast) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="md:w-[45%] relative min-h-110 md:min-h-160 bg-[#1a1a1a] overflow-hidden shrink-0 mx-6 md:mx-0 md:ml-16"
        >
          <Image
            src={"/about.webp"}
            alt="portrait"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 40% 35%, rgba(249,115,22,0.22) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(249,115,22,0.10) 0%, transparent 50%)",
            }}
          />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" /> */}

          {/* Caption badge */}
          <div className="absolute bottom-8 left-8">
            <span className="inline-block border border-white/15 bg-black/60 backdrop-blur-sm text-white/60 font-mono text-[10px] tracking-[0.18em] uppercase px-4 py-2">
              AI ENGINEER · FREELANCE
            </span>
          </div>
        </motion.div>

        {/* Right — content */}
        <div className="flex-1 px-6 md:px-12 lg:px-16 py-12 md:py-0 md:pb-16 flex flex-col justify-center">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-bold leading-[1.08] tracking-[-0.02em] text-white text-4xl md:text-5xl lg:text-6xl mb-8"
          >
            Building AI products
            <br />
            <span style={{ color: "var(--accent)" }}>that actually ship.</span>
          </motion.h2>

          {/* Body paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-5 text-(--muted) text-sm md:text-base leading-relaxed max-w-xl mb-10"
          >
            <p>
              I&apos;m a full-stack AI engineer who turns ambitious ideas into
              production-grade systems — from LLM integration and RAG pipelines
              to the web applications that expose them to real users.
            </p>
            <p>
              Over the past few years I&apos;ve shipped AI-powered products
              across research, e-commerce, and analytics — building multi-agent
              pipelines, vector search systems, and Next.js frontends that
              handle real traffic.
            </p>
            <p>
              I care about the full stack: clean APIs, snappy UIs, and models
              that behave reliably in production — not just in demos.
            </p>
          </motion.div>

          {/* Highlight card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="border border-white/[0.08] border-l-2 bg-white/[0.02] px-6 py-5 mb-8 max-w-xl"
            style={{ borderLeftColor: "var(--accent)" }}
          >
            <p className="text-white font-heading font-semibold text-sm md:text-base mb-1">
              {HIGHLIGHT.title}
            </p>
            <p className="text-(--muted) font-mono text-xs mb-3">
              {HIGHLIGHT.subtitle}
            </p>
            <p className="text-white/50 text-xs">{HIGHLIGHT.tags}</p>
          </motion.div>

          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2.5"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span className="text-(--muted) font-mono text-xs tracking-widest">
              Available for new projects · Remote / Worldwide
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="pb-20 md:pb-32" />
    </section>
  );
}
