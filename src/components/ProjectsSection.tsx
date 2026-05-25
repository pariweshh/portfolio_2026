"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { ExternalLink } from "lucide-react";
import {
  PROJECTS,
  type ProjectData,
  flatTitle,
  slideTags,
} from "@/data/projects";

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL_SLIDES = PROJECTS.length + 1; // +1 for intro
const STRIP_COUNT = 12;
const STRIP_STAGGER = 0.025; // seconds between each strip
const STRIP_DURATION = 0.45; // seconds per strip animation
// Total time for all strips to finish:
const TRANSITION_MS =
  (STRIP_STAGGER * (STRIP_COUNT - 1) + STRIP_DURATION) * 1000; // ~725 ms

const EASE = [0.16, 1, 0.3, 1] as const;
const STRIP_H = 100 / STRIP_COUNT; // height of one strip in %

// ── Slide background ───────────────────────────────────────────────────────────
// The settled, fully-visible state of a slide — image + bottom vignette.

function SlideBackground({ project }: { project: ProjectData | null }) {
  if (!project) {
    // Intro slide
    return <div className="absolute inset-0 bg-(--bg)" />;
  }
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: project.images[0]
            ? `url("${project.images[0]}")`
            : undefined,
          backgroundColor: project.bgColor,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
    </div>
  );
}

// ── Venetian reveal ────────────────────────────────────────────────────────────
// 12 horizontal strips, each independently revealing their slice of the new
// slide image. Even strips open top→bottom, odd strips open bottom→top.
// Staggered 25 ms apart so you see each slat flip in sequence.

function VenetianReveal({ project }: { project: ProjectData | null }) {
  const bgColor = project?.bgColor ?? "var(--bg)";
  const imageSrc = project?.images[0];

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {Array.from({ length: STRIP_COUNT }).map((_, i) => {
        const fromTop = i % 2 === 0;
        // clipPath inset values:
        //   fromTop  → start fully clipped from bottom, reveal downward
        //   fromBottom → start fully clipped from top, reveal upward
        const initialClip = fromTop ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)";

        return (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              top: `${i * STRIP_H}%`,
              left: 0,
              right: 0,
              height: `${STRIP_H}%`,
            }}
            initial={{ clipPath: initialClip }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{
              duration: STRIP_DURATION,
              delay: i * STRIP_STAGGER,
              ease: EASE,
            }}
          >
            {/* Image — full viewport height, offset so this strip shows its
                correct horizontal slice. top: -i*100% shifts the full-height
                div up by i × strip_height so slice i is centred in view. */}
            <div
              style={{
                position: "absolute",
                top: `-${i * 100}%`,
                left: 0,
                right: 0,
                height: `${STRIP_COUNT * 100}%`,
                backgroundImage: imageSrc ? `url("${imageSrc}")` : undefined,
                backgroundColor: bgColor,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            />
            {/* Gradient — same full-height offset so vignette is continuous */}
            <div
              style={{
                position: "absolute",
                top: `-${i * 100}%`,
                left: 0,
                right: 0,
                height: `${STRIP_COUNT * 100}%`,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Intro text ─────────────────────────────────────────────────────────────────

function IntroText({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-20 md:pb-28 z-10 pointer-events-none"
    >
      <div className="max-w-3xl">
        <p className="text-(--muted) font-mono text-[11px] tracking-[0.2em] uppercase mb-8">
          // PROJECTS
        </p>
        <h2 className="font-heading font-bold text-white leading-[1.08] tracking-[-0.02em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8">
          Built to ship.
          <br />
          From idea to production.
        </h2>
        <p className="text-(--muted) text-base md:text-lg leading-relaxed max-w-lg mb-10">
          Each project is a proof of execution — designed from first principles
          and shipped end-to-end.
        </p>
        <p className="text-(--muted) font-mono text-[11px] tracking-[0.2em] uppercase flex items-center gap-3">
          SCROLL TO EXPLORE — {PROJECTS.length} PROJECTS{" "}
          <span className="text-base">↓</span>
        </p>
      </div>
    </motion.div>
  );
}

// ── Project text ───────────────────────────────────────────────────────────────

function ProjectText({
  project,
  visible,
  onViewProject,
}: {
  project: ProjectData;
  visible: boolean;
  onViewProject?: () => void;
}) {
  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, ease: EASE }}
      className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-20 md:pb-28 z-10"
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="max-w-3xl">
        <p className="text-white/50 font-mono text-[11px] tracking-[0.2em] uppercase mb-6">
          {project.category}
        </p>
        <h2 className="font-heading font-bold text-white leading-[1.05] tracking-[-0.02em] text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6">
          {flatTitle(project.title)}
        </h2>
        <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl mb-8">
          {project.tagline}
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          {slideTags(project.stack).map((tag) => (
            <span
              key={tag}
              className="border border-white/20 text-white/70 font-mono text-xs px-4 py-2 tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
        {project.hasDetailPage && onViewProject ? (
          <button
            onClick={onViewProject}
            className="inline-flex items-center gap-2 text-white font-mono text-xs tracking-[0.15em] uppercase px-8 py-4 hover:opacity-90 active:scale-[0.97]"
            style={{
              backgroundColor: "var(--accent)",
              transition: "opacity 160ms ease-out, transform 160ms ease-out",
            }}
          >
            View Project
            <ExternalLink size={14} />
          </button>
        ) : (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-mono text-xs tracking-[0.15em] uppercase px-8 py-4 hover:opacity-90 active:scale-[0.97]"
            style={{
              backgroundColor: "var(--accent)",
              transition: "opacity 160ms ease-out, transform 160ms ease-out",
            }}
          >
            View Project
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── Counter ────────────────────────────────────────────────────────────────────

function ProjectCounter({ index }: { index: number }) {
  return (
    <div className="absolute top-8 right-8 md:top-12 md:right-16 z-30 font-mono text-sm text-(--muted)">
      <span>{String(index + 1).padStart(2, "0")}</span>
      <span className="mx-1.5">/</span>
      <span>{String(TOTAL_SLIDES).padStart(2, "0")}</span>
    </div>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────────

function SegmentBar({
  scrollYProgress,
  segStart,
  segEnd,
}: {
  scrollYProgress: MotionValue<number>;
  segStart: number;
  segEnd: number;
}) {
  const fill = useTransform(
    scrollYProgress,
    [segStart, segEnd],
    ["0%", "100%"],
  );
  return (
    <div className="flex-1 h-full bg-white/20 relative overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 bg-white"
        style={{ width: fill }}
      />
    </div>
  );
}

// ── Section root ───────────────────────────────────────────────────────────────

export default function ProjectsSection({
  onViewProject,
}: {
  onViewProject?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0); // tracks the latest desired index

  // displayedIndex: the slide currently shown in full (stable, settled)
  // incomingIndex: the slide currently animating in via venetian strips (null = idle)
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [textVisible, setTextVisible] = useState(true);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Derive active slide index from raw scroll (zero lag).
  // useScroll ["start start","end end"] maps 0→1 over (TOTAL_SLIDES-1)×100vh,
  // so snap point n sits at v = n/(TOTAL_SLIDES-1). Math.round is correct here.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      Math.max(Math.round(v * (TOTAL_SLIDES - 1)), 0),
      TOTAL_SLIDES - 1,
    );
    if (idx === targetRef.current) return;
    targetRef.current = idx;

    // Start venetian transition
    clearTimeout(timerRef.current);
    setTextVisible(false);
    setIncomingIndex(idx);

    // After all strips have landed, swap the stable background and show text
    timerRef.current = setTimeout(() => {
      setDisplayedIndex(targetRef.current);
      setIncomingIndex(null);
      setTextVisible(true);
    }, TRANSITION_MS + 80);
  });

  // Scroll snap: lock to nearest slide boundary after scroll stops
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;
    let snapTimer: ReturnType<typeof setTimeout>;

    const snap = () => {
      const slideH = window.innerHeight;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset = window.scrollY - sectionTop;
      if (offset < 0 || offset >= section.offsetHeight - slideH) return;
      const nearest = Math.round(offset / slideH);
      const target = sectionTop + nearest * slideH;
      if (Math.abs(target - window.scrollY) > 2) {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    };

    const onScroll = () => {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snap, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(snapTimer);
    };
  }, []);

  // Resolve displayed/incoming slides to project data (null = intro)
  const displayedProject =
    displayedIndex === 0 ? null : (PROJECTS[displayedIndex - 1] ?? null);
  const incomingProject =
    incomingIndex === null
      ? null
      : incomingIndex === 0
        ? null
        : (PROJECTS[incomingIndex - 1] ?? null);

  return (
    <section
      id="projects"
      ref={containerRef}
      style={{ height: `${TOTAL_SLIDES * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        <ProjectCounter index={displayedIndex} />

        {/* ── Settled background (the slide currently in stable view) ── */}
        <SlideBackground project={displayedProject} />

        {/* ── Venetian strips for the incoming slide ── */}
        {incomingIndex !== null && (
          <VenetianReveal key={incomingIndex} project={incomingProject} />
        )}

        {/* ── Text overlay (separate from strips so it enters cleanly) ── */}
        {displayedIndex === 0 ? (
          <IntroText visible={textVisible} />
        ) : displayedProject ? (
          <ProjectText
            project={displayedProject}
            visible={textVisible}
            onViewProject={onViewProject}
          />
        ) : null}

        {/* ── Progress bars (one per project, raw scroll driven) ── */}
        <div className="absolute bottom-6 left-0 right-0 flex gap-1 h-0.75 z-30 px-8 md:px-16 lg:px-24">
          {PROJECTS.map((_, i) => (
            <SegmentBar
              key={i}
              scrollYProgress={scrollYProgress}
              segStart={i / (TOTAL_SLIDES - 1)}
              segEnd={(i + 1) / (TOTAL_SLIDES - 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
