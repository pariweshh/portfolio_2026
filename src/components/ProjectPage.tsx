"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PROJECTS, displayNumber, flatTitle, type ProjectData } from "@/data/projects";

const DETAIL_PROJECTS: ProjectData[] = PROJECTS.filter((p) => p.hasDetailPage);
const DETAIL_COUNT = String(DETAIL_PROJECTS.length).padStart(2, "0");

interface ProjectPageProps {
  onBack: () => void;
  /** Index of the project to display — defaults to the first project with hasDetailPage */
  projectIndex?: number;
}

const DEFAULT_PROJECT =
  PROJECTS.find((p) => p.hasDetailPage) ?? PROJECTS[0];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectPage({ onBack, projectIndex }: ProjectPageProps) {
  const project =
    projectIndex !== undefined
      ? (PROJECTS.find((p) => p.index === projectIndex) ?? DEFAULT_PROJECT)
      : DEFAULT_PROJECT;

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroImageY = useTransform(scrollYProgress, [0, 0.35], ["0%", "18%"]);
  const heroImageScale = useTransform(scrollYProgress, [0, 0.35], [1.08, 1.18]);

  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ position: "fixed" }}
      className="inset-0 z-50 overflow-y-auto bg-[var(--bg)] text-white font-sans"
    >
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col justify-end overflow-hidden">
        {/* Parallax background — first project image, fallback to placeholder */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${project.images[0] ?? "/project-bg.jpg"}")`,
            y: heroImageY,
            scale: heroImageScale,
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/30 via-transparent to-transparent" />

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start px-6 md:px-16 pt-8 z-10">
          <motion.button
            onClick={onBack}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Work
          </motion.button>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)]"
          >
            {displayNumber(project.index)}
          </motion.span>
        </div>

        {/* Title — word-by-word mask reveal */}
        <div className="relative z-10 px-6 md:px-16 pb-16 space-y-6">
          <h1
            className="font-heading font-bold text-white leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: "clamp(56px, 11vw, 148px)" }}
          >
            {(() => {
              const tokens: string[] = [];
              project.title.split("\n").forEach((line, lineIdx, lines) => {
                line.split(" ").forEach((w) => {
                  if (w.length > 0) tokens.push(w);
                });
                if (lineIdx < lines.length - 1) tokens.push("\n");
              });
              let wordCounter = 0;
              return tokens.map((tok, i) => {
                if (tok === "\n") {
                  return <br key={`br-${i}`} />;
                }
                const wordIdx = wordCounter++;
                return (
                  <span
                    key={`w-${i}`}
                    className="overflow-hidden inline-block align-bottom mr-[0.25em]"
                  >
                    <motion.span
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        duration: 1,
                        ease: EASE,
                        delay: 0.3 + wordIdx * 0.06,
                      }}
                      className="inline-block"
                    >
                      {tok}
                    </motion.span>
                  </span>
                );
              });
            })()}
          </h1>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
              className="text-[var(--muted)] text-base md:text-lg font-sans max-w-lg leading-relaxed"
            >
              {project.tagline}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── META BAR ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 border-t border-white/[0.08]">
        <div className="max-w-screen-xl mx-auto grid grid-cols-3">
          {[
            { label: "Year", value: project.year },
            { label: "Category", value: project.category },
            { label: "Role", value: project.role },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
              className={`py-6 md:py-8 ${i > 0 ? "pl-4 md:pl-8 border-l border-white/[0.08]" : ""}`}
            >
              <p className="font-mono text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] text-[var(--muted)] uppercase mb-1.5 md:mb-2">
                {label}
              </p>
              <p className="font-heading font-semibold text-white text-xs md:text-base leading-snug">
                {value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 pt-24 pb-24">
        <div className="max-w-screen-xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-t border-white/[0.08] pt-6 font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase mb-16"
          >
            // OVERVIEW
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7 overflow-hidden">
              <motion.p
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: EASE }}
                className="font-heading font-semibold text-white text-2xl md:text-[28px] leading-[1.45] tracking-[-0.01em]"
              >
                {project.description}
              </motion.p>
            </div>

            <div className="lg:col-span-5 space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase mb-5">
                  Services
                </p>
                <ul className="space-y-3">
                  {project.services.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="text-white/60 text-sm font-sans flex items-center gap-3"
                    >
                      <span className="w-1 h-1 rounded-full bg-[var(--accent)] shrink-0" />
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase mb-4">
                  Live at
                </p>
                <a
                  href={`https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm text-[var(--accent)] hover:opacity-70 transition-opacity duration-200"
                >
                  {project.url}
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STACK ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 pb-24">
        <div className="max-w-screen-xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-t border-white/[0.08] pt-6 font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase mb-10"
          >
            // STACK
          </motion.p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tool, i) => (
              <motion.span
                key={tool.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.045 }}
                className={`text-sm px-4 py-2.5 border cursor-default transition-colors duration-200 ${
                  tool.featured
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[var(--stroke)] text-[var(--muted)] hover:border-white/25 hover:text-white"
                }`}
              >
                {tool.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 pb-32">
        <div className="max-w-screen-xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-t border-white/[0.08] pt-6 font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase mb-10"
          >
            // GALLERY
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.images.map((src, i) => (
              <motion.div
                key={i}
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 1,
                  ease: EASE,
                  delay: (i % 2) * 0.14,
                }}
                className={`overflow-hidden bg-[var(--stroke)] ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <motion.img
                  src={src}
                  alt={`${flatTitle(project.title)} — view ${i + 1}`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className={`w-full object-cover ${
                    i === 0 ? "h-[480px] md:h-[560px]" : "h-64 md:h-80"
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BACK CTA ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 pb-24 border-t border-white/[0.08]">
        <div className="max-w-screen-xl mx-auto pt-14 flex justify-between items-end">
          <motion.button
            onClick={onBack}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group flex items-center gap-3 text-[var(--muted)] hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
              Back to work
            </span>
          </motion.button>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] tracking-[0.2em] text-[var(--muted)]"
          >
            {displayNumber(DETAIL_PROJECTS.indexOf(project))} / {DETAIL_COUNT}
          </motion.span>
        </div>
      </section>
    </motion.div>
  );
}
