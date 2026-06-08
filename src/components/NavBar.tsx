"use client";
import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

// ── Constants ──────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAGNET_SPRING = { stiffness: 200, damping: 18, mass: 0.4 };
const MAGNET_MAX = 6;

const NAV_LINKS = [
  { num: "01", label: "Intro", id: "intro" },
  { num: "02", label: "Expertise", id: "expertise" },
  { num: "03", label: "About", id: "about" },
  { num: "04", label: "Career", id: "career" },
  { num: "05", label: "Projects", id: "projects" },
  { num: "06", label: "Tools", id: "tools" },
  { num: "07", label: "Testimonials", id: "testimonials" },
  { num: "08", label: "Contact", id: "contact" },
] as const;

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/pariwesh" },
  { label: "LinkedIn", href: "https://linkedin.com/in/pariwesh" },
  { label: "Email", href: "mailto:hello@pariwesh.dev" },
] as const;

// ── Types ──────────────────────────────────────────────────────────────────────

interface NavBarProps {
  /** Passed through for future use — navigate to the project detail page */
  onNavigateToProjects: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function NavBar({ onNavigateToProjects: _ }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Track which section the viewport midpoint is inside
  useEffect(() => {
    let rafId: number;

    const update = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let found: string | null = null;

      for (const { id } of NAV_LINKS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bottom = top + el.offsetHeight;
        if (mid >= top && mid < bottom) {
          found = id;
          break;
        }
      }

      setActiveSection(found);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Magnetic spring for the burger button
  const btnRef = useRef<HTMLButtonElement>(null);
  const bx = useMotionValue(0);
  const by = useMotionValue(0);
  const sbx = useSpring(bx, MAGNET_SPRING);
  const sby = useSpring(by, MAGNET_SPRING);

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleBtnMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ox = e.clientX - (rect.left + rect.width / 2);
    const oy = e.clientY - (rect.top + rect.height / 2);
    bx.set(Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, ox * 0.4)));
    by.set(Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, oy * 0.4)));
  };

  const handleBtnLeave = () => {
    bx.set(0);
    by.set(0);
  };

  const close = () => setIsOpen(false);

  const scrollTo = (id: string) => {
    close();
    // Wait for overlay exit animation before scrolling
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <>
      {/* ── Fixed corner bar — always visible ─────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-90 pointer-events-none">
        <div className="flex justify-between items-center px-6 md:px-10 py-6 md:py-7">
          {/* Left slot intentionally empty */}
          <div />

          {/* Hamburger — 2 lines morph to × on open */}
          <motion.button
            ref={btnRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            style={{ x: sbx, y: sby }}
            onMouseMove={handleBtnMove}
            onMouseLeave={handleBtnLeave}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="pointer-events-auto w-10 h-10 flex items-center justify-center"
          >
            {/* 13px container keeps both lines equidistant from centre */}
            <div className="relative w-6 h-3.25">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute top-0 left-0 w-full h-px bg-white origin-center"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute bottom-0 left-0 w-full h-px bg-white origin-center"
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* ── Section scroll indicator — left side, desktop only ─────── */}
      <motion.div
        animate={{ opacity: activeSection ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed left-6 md:left-8 top-1/2 -translate-y-1/2 z-89 hidden md:flex flex-col gap-3.5 pointer-events-none"
        aria-hidden="true"
      >
        {NAV_LINKS.map(({ id, label, num }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="pointer-events-auto group relative flex items-center gap-3 cursor-pointer"
              aria-label={`Go to ${label}`}
            >
              {/* Tick line — short/muted inactive, long/orange active */}
              <motion.div
                animate={{
                  width: isActive ? 22 : 5,
                  backgroundColor: isActive
                    ? "var(--accent)"
                    : "rgba(255,255,255,0.22)",
                  height: isActive ? 2 : 1,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-full origin-left"
              />

              {/* Section label — slides in when active */}
              <motion.span
                animate={{
                  opacity: isActive ? 0.65 : 0,
                  x: isActive ? 0 : -6,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-[9px] tracking-[0.22em] text-(--accent) uppercase whitespace-nowrap"
              >
                {num}
              </motion.span>
            </button>
          );
        })}
      </motion.div>

      {/* ── Full-screen overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="nav-overlay"
            initial={{ clipPath: "inset(0 0 100% 0)", opacity: 1 }}
            animate={{
              clipPath: "inset(0 0 0% 0)",
              opacity: 1,
              transition: { duration: 0.65, ease: EASE },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
            }}
            className="fixed inset-0 z-80 flex flex-col"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 90% 100%, rgba(231,142,41,0.09) 0%, transparent 55%), #0a0a0a",
            }}
          >
            {/* Section label */}
            <div className="px-6 md:px-10 pt-24 md:pt-28 pb-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="font-mono text-[11px] tracking-[0.2em] text-(--muted) uppercase border-t border-white/[0.07] pt-5"
              >
                // NAVIGATION
              </motion.p>
            </div>

            {/* Nav links */}
            <nav
              aria-label="Site navigation"
              className="flex-1 flex flex-col justify-center px-6 md:px-10 overflow-hidden"
            >
              <ul>
                {NAV_LINKS.map(({ num, label, id }, i) => (
                  <li
                    key={id}
                    className="overflow-hidden border-b border-white/5"
                  >
                    <motion.div
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "105%" }}
                      transition={{
                        duration: 0.7,
                        ease: EASE,
                        delay: 0.12 + i * 0.065,
                      }}
                    >
                      <button
                        onClick={() => scrollTo(id)}
                        className="group flex items-center justify-between w-full py-3.5 md:py-4 text-left"
                      >
                        <div className="flex items-baseline gap-4 md:gap-6">
                          <span className="font-mono text-[10px] tracking-[0.2em] text-(--accent) opacity-40 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                            {num}
                          </span>
                          <span className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-none tracking-[-0.02em] text-white group-hover:text-(--accent) transition-colors duration-300">
                            {label}
                          </span>
                        </div>
                        <span className="font-mono text-lg text-(--muted) group-hover:text-(--accent) group-hover:translate-x-1.5 transition-all duration-300 shrink-0 ml-4">
                          →
                        </span>
                      </button>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer — socials row */}
            <div className="px-6 md:px-10 pb-8 md:pb-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
                className="flex flex-wrap items-center gap-6 md:gap-10 border-t border-white/[0.07] pt-6"
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase">
                  Find me
                </span>
                {SOCIALS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={close}
                    className="font-mono text-[11px] tracking-[0.15em] text-(--muted) uppercase hover:text-(--accent) transition-colors duration-200"
                  >
                    {label}
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
