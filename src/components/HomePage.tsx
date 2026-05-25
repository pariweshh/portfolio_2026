"use client";
import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { Scan, Target, Zap } from "lucide-react";
import IntroSection from "./IntroSection";
import AboutSection from "./AboutSection";
import ExpertiseSection from "./ExpertiseSection";
import ToolsSection from "./ToolsSection";
import CareerSection from "./CareerSection";
import ProjectsSection from "./ProjectsSection";
import TestimonialsSection from "./TestimonialsSection";
import ContactSection from "./ContactSection";

interface HomePageProps {
  onNextPage: () => void;
}

function Separator() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  );
}

const FRAME_COUNT = 48;

export default function HomePage({ onNextPage }: HomePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const noMotion = useReducedMotion() === true;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Hero fades out as user starts scrolling
  const heroOpacity = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.15, 0.25], [0, 0, -60]);

  // Three scroll text panels
  const text1Opacity = useTransform(
    smoothProgress,
    [0.2, 0.3, 0.4, 0.5],
    [0, 1, 1, 0],
  );
  const text1Y = useTransform(
    smoothProgress,
    [0.2, 0.3, 0.4, 0.5],
    [80, 0, 0, -80],
  );

  const text2Opacity = useTransform(
    smoothProgress,
    [0.5, 0.6, 0.7, 0.8],
    [0, 1, 1, 0],
  );
  const text2Y = useTransform(
    smoothProgress,
    [0.5, 0.6, 0.7, 0.8],
    [80, 0, 0, -80],
  );

  const text3Opacity = useTransform(smoothProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const text3Y = useTransform(smoothProgress, [0.8, 0.9, 1], [80, 0, 0]);

  // ── Frame rendering ────────────────────────────────────────────────────────

  const renderCurrentFrame = () => {
    const target = Math.round(frameIndex.get());
    const images = imagesRef.current;
    let img = images[target];

    if (!img) {
      let best = Infinity;
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (images[i]) {
          const d = Math.abs(i - target);
          if (d < best) {
            best = d;
            img = images[i];
          }
        }
      }
    }

    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cr = canvas.width / canvas.height;
    const ir = img.width / img.height;
    let dw = canvas.width,
      dh = canvas.height,
      ox = 0,
      oy = 0;
    if (cr > ir) {
      dh = canvas.width / ir;
      oy = (canvas.height - dh) / 2;
    } else {
      dw = canvas.height * ir;
      ox = (canvas.width - dw) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, ox, oy, dw, dh);
  };

  // ── Frame loading ──────────────────────────────────────────────────────────

  useEffect(() => {
    imagesRef.current = new Array(FRAME_COUNT).fill(null);

    const load = (i: number) => {
      const img = new Image();
      img.src = `/sequence/frame_${(i + 1).toString().padStart(4, "0")}.png`;
      img.onload = () => {
        imagesRef.current[i] = img;
        if (i === 0 || Math.round(frameIndex.get()) === i) renderCurrentFrame();
      };
    };

    load(0); // first frame immediately
    for (let i = 1; i < FRAME_COUNT; i++) load(i);
  }, []);

  useMotionValueEvent(frameIndex, "change", () => {
    if (noMotion) return;
    renderCurrentFrame();
  });

  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = window.innerWidth * dpr;
      canvasRef.current.height = window.innerHeight * dpr;
      renderCurrentFrame();
    };
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    resize();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <motion.main
      key="home"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full bg-black text-white font-sans"
    >
      {/* Scroll container — 500vh provides scroll distance for frame playback */}
      <div ref={containerRef} className="relative h-[500vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Canvas — replaces video, driven by scroll */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Visual Overlays */}
          <div className="scanline opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/10 to-transparent pointer-events-none hidden md:block" />

          {/* Hero content — fades out as scroll begins */}
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 mx-auto w-full max-w-screen-2xl h-full flex flex-col justify-between p-6 md:p-12"
          >
            {/* Top Header */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8 mt-[5vh] md:mt-0">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
                  },
                }}
                className="space-y-2"
              >
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="text-4xl sm:text-5xl md:text-[80px] font-display font-bold tracking-wide leading-[1.1] text-[#e2e2e2] uppercase"
                >
                  PARIWESH-T // <br />
                  AI ENGINEER
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="max-w-md text-sm md:text-base text-zinc-200 md:text-zinc-400 font-light leading-relaxed mt-6 md:mt-8"
                >
                  Architecting intelligent web applications and scalable AI
                  solutions for those who don't just watch the future—they drive
                  it.
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="flex gap-4 mt-8 md:mt-10"
                >
                  {[Scan, Target, Zap].map((Icon, i) => (
                    <motion.div
                      key={i}
                      whileHover={{
                        scale: 1.1,
                        borderColor: "#fff",
                        color: "#fff",
                      }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-zinc-200 md:text-zinc-400 transition-colors cursor-pointer"
                    >
                      <Icon size={18} className="md:w-5 md:h-5 stroke-[1.5]" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 text-[10px] font-mono tracking-widest text-zinc-200 md:text-zinc-400 uppercase mt-4 md:mt-0"
              >
                <span>01 / 05</span>
                <div className="w-16 h-px bg-zinc-400 md:bg-zinc-600" />
                <button
                  onClick={() =>
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-white transition-colors tracking-widest cursor-pointer"
                >
                  VIEW PROJECTS
                </button>
              </motion.div>
            </div>

            {/* Spacer */}
            <div className="grow pointer-events-none" />

            {/* Right Side Specs Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:block lg:absolute lg:right-12 lg:top-1/2 lg:-translate-y-1/2 z-10"
            >
              <div className="space-y-6">
                <h3 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase mb-6">
                  Technical Specs
                </h3>
                <div className="space-y-4 w-full md:w-72">
                  {[
                    {
                      label: "Frontend",
                      value: "Next.js, React, Tailwind, Vue",
                    },
                    { label: "Backend", value: "Node.js, Python" },
                    { label: "Database", value: "MongoDB, PostgreSQL" },
                    { label: "AI/ML", value: " Claude Code , OpenAI" },
                  ].map((spec, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-white/10 pb-4"
                    >
                      <span className="text-[11px] text-zinc-300 font-sans uppercase tracking-wider font-medium">
                        {spec.label}
                      </span>
                      <span className="text-[11px] font-sans text-white">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bottom Section */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 pb-2 md:pb-4">
              {/* Specs — mobile only */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="md:hidden w-full space-y-3"
              >
                <h3 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase">
                  Technical Specs
                </h3>
                {[
                  { label: "Frontend", value: "Next.js, React, Tailwind" },
                  { label: "Backend", value: "Node.js, TypeScript" },
                  { label: "Database", value: "MongoDB, PostgreSQL" },
                  { label: "AI/ML", value: "OpenAI, LangChain" },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-white/10 pb-3"
                  >
                    <span className="text-[11px] text-zinc-300 font-sans uppercase tracking-wider font-medium">
                      {spec.label}
                    </span>
                    <span className="text-[11px] font-sans text-white">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Project Card — md and up */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="hidden md:block bg-white/5 backdrop-blur-2xl border border-white/10 p-5 rounded-4xl w-full md:max-w-105 shadow-2xl"
              >
                <div className="flex gap-5">
                  <div className="w-24 h-24 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent mix-blend-overlay" />
                    <div className="w-12 h-6 bg-orange-500/40 rounded-full blur-md" />
                    <div className="w-10 h-4 bg-orange-400/60 rounded-full blur-sm absolute" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[9px] font-mono tracking-[0.18em] text-orange-400/80 uppercase mb-1.5">
                      Latest Project
                    </p>
                    <h4 className="text-[13px] font-display font-bold tracking-widest text-zinc-200 uppercase mb-1.5">
                      ResumeForge
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-light mb-4 pr-4">
                      7-stage AI pipeline — ATS scoring, resume parsing &amp;
                      cover letter generation. GPT-4 + Claude Sonnet.
                    </p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 border border-white/10 rounded-full text-[10px] font-mono text-zinc-400">
                        GPT-4
                      </span>
                      <span className="px-3 py-1 border border-white/10 rounded-full text-[10px] font-mono text-zinc-400">
                        Claude Sonnet
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center sm:justify-start md:justify-end gap-2 md:gap-3 w-full md:w-auto max-w-md"
              >
                {["TYPESCRIPT", "NEXT.JS", "MONGODB", "AI-DRIVEN"].map(
                  (tag) => (
                    <div
                      key={tag}
                      className="text-[10px] font-mono tracking-widest text-zinc-200 md:text-zinc-400 border border-white/30 md:border-white/20 px-4 py-1.5 rounded-full hover:text-zinc-200 hover:border-white/40 transition-colors cursor-default"
                    >
                      {tag}
                    </div>
                  ),
                )}
              </motion.div>
            </div>

            {/* Background Grid */}
            {/* <div
              className="absolute inset-0 pointer-events-none opacity-[0.02]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            /> */}
          </motion.div>

          {/* Scroll Text Panel 1 — Scalable (top left) */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute inset-0 flex flex-col justify-start items-start text-left p-6 md:p-12 pt-20 md:pt-24 pointer-events-none z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/4 mb-6">
              <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-200 md:text-zinc-400 uppercase">
                Architecture
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-8xl font-display font-bold uppercase tracking-tight text-white">
              Scalable
            </h2>
            <p className="max-w-md text-sm md:text-base text-zinc-200 md:text-zinc-400 font-light mt-5 leading-relaxed">
              Architecting solutions that grow with your ambitions. Precision
              and resilience built into every layer.
            </p>
          </motion.div>

          {/* Scroll Text Panel 2 — Intelligent (bottom right) */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute inset-0 flex flex-col justify-end items-end text-right p-6 md:p-12 pb-20 md:pb-24 pointer-events-none z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/4 mb-6">
              <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-200 md:text-zinc-400 uppercase">
                AI-First
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-8xl font-display font-bold uppercase tracking-tight text-white">
              Intelligent
            </h2>
            <p className="max-w-md text-sm md:text-base text-zinc-200 md:text-zinc-400 font-light mt-5 leading-relaxed">
              Empowering applications with AI. From predictive models to
              real-time analytics, unlocking the next dimension.
            </p>
          </motion.div>

          {/* Scroll Text Panel 3 — Future-Ready */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 pointer-events-none z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/4 mb-6">
              <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-200 md:text-zinc-400 uppercase">
                The Proving Ground
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-8xl font-display font-bold uppercase tracking-tight text-[#fb923c]">
              Future-Ready
            </h2>
            <p className="max-w-md text-sm md:text-base text-zinc-200 md:text-zinc-400 font-light mt-5 leading-relaxed">
              Ready to break the boundaries of what is possible. No compromises.
            </p>
          </motion.div>

          {/* Scroll Progress — bottom center */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-20">
            <div className="w-px h-16 bg-white/6 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute top-0 left-0 w-full bg-white/40 origin-top rounded-full"
                style={{ scaleY: smoothProgress, height: "100%" }}
              />
            </div>
            <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 md:text-zinc-600 uppercase [writing-mode:vertical-rl] rotate-180">
              Scroll
            </span>
          </div>
        </div>
      </div>

      <IntroSection />
      <Separator />
      <ExpertiseSection />
      <Separator />
      <AboutSection />
      <Separator />
      <CareerSection />
      <ProjectsSection onViewProject={onNextPage} />
      <Separator />
      <ToolsSection />
      <Separator />
      <TestimonialsSection />
      <Separator />
      <ContactSection />
    </motion.main>
  );
}
