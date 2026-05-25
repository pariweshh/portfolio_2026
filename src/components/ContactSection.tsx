"use client";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Mail, Code2, Link2, MapPin } from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@pariwesh.dev",
    href: "mailto:hello@pariwesh.dev",
  },
  {
    icon: Code2,
    label: "GitHub",
    value: "github.com/pariwesh",
    href: "https://github.com",
  },
  {
    icon: Link2,
    label: "LinkedIn",
    value: "linkedin.com/in/pariwesh",
    href: "https://linkedin.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Available Remotely",
    href: "#",
  },
];

const MAGNET_SPRING = { stiffness: 220, damping: 20, mass: 0.4 };
const MAGNET_MAX = 8;

interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "a" | "button";
  href?: string;
  onClick?: () => void;
}

function MagneticElement({
  children,
  className = "",
  as = "div",
  href,
  onClick,
}: MagneticElementProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, MAGNET_SPRING);
  const sy = useSpring(y, MAGNET_SPRING);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    const clampedX = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, offsetX * 0.35));
    const clampedY = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, offsetY * 0.35));
    x.set(clampedX);
    y.set(clampedY);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const commonProps = {
    ref: ref as React.Ref<never>,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    style: { x: sx, y: sy },
    className,
  };

  if (as === "a") {
    return (
      <motion.a {...commonProps} href={href}>
        {children}
      </motion.a>
    );
  }
  if (as === "button") {
    return (
      <motion.button {...commonProps} onClick={onClick}>
        {children}
      </motion.button>
    );
  }
  return <motion.div {...commonProps}>{children}</motion.div>;
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-[#0a0a0a]"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 30% 100%, rgba(231,142,41,0.08) 0%, transparent 60%), #0a0a0a",
      }}
    >
      {/* Heading block */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 pt-[100px] pb-20 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-white/[0.08] pt-6 text-[var(--muted)] font-mono text-[11px] tracking-[0.2em] uppercase mb-16"
        >
          // CONTACT
        </motion.p>

        <div className="mb-8 max-w-4xl">
          <AnimatedHeading
            as="h2"
            text="Let's build something"
            className="font-heading font-bold text-white leading-[1.08] tracking-[-0.02em] text-4xl sm:text-5xl md:text-[72px] lg:text-[84px]"
          />
          <AnimatedHeading
            as="h2"
            delay={0.15}
            text="worth shipping."
            className="font-heading font-bold leading-[1.08] tracking-[-0.02em] text-4xl sm:text-5xl md:text-[72px] lg:text-[84px] text-[var(--accent)]"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="text-[var(--muted)] text-base md:text-lg leading-relaxed max-w-2xl"
        >
          I&apos;m open to full-time roles and freelance collaborations — particularly at teams
          building AI-driven products or scaling complex web platforms.
        </motion.p>
      </div>

      {/* Split layout */}
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row border-t border-white/[0.08]">
        {/* Left: photo placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:w-[45%] relative min-h-[220px] md:min-h-[560px] bg-[#0e0e0e] overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at 30% 60%, var(--accent) 0%, transparent 65%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10">
            <MagneticElement
              as="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-mono tracking-[0.15em] uppercase px-6 py-3 hover:border-white/40 hover:bg-white/5 transition-colors cursor-pointer"
            >
              ↑ BACK TO TOP
            </MagneticElement>
          </div>
        </motion.div>

        {/* Right: direct channels */}
        <div className="md:flex-1 px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <p className="text-[var(--muted)] font-mono text-[11px] tracking-[0.2em] uppercase mb-8">
            DIRECT CHANNELS
          </p>

          <div className="border-t border-white/[0.08]">
            {CHANNELS.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <motion.div
                  key={ch.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <MagneticElement
                    as="a"
                    href={ch.href}
                    className="flex items-center gap-5 border-b border-white/[0.08] py-6 group hover:bg-white/[0.02] transition-colors -mx-2 px-2"
                  >
                    <div className="w-10 h-10 border border-white/[0.08] flex items-center justify-center shrink-0 transition-colors group-hover:border-[var(--accent)]">
                      <Icon
                        size={16}
                        className="text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <p className="text-[var(--muted)] font-mono text-[10px] tracking-[0.15em] uppercase mb-1">
                        {ch.label}
                      </p>
                      <p className="text-white font-heading text-sm md:text-base transition-colors group-hover:text-[var(--accent)]">
                        {ch.value}
                      </p>
                    </div>
                    <span className="ml-auto text-[var(--muted)] text-lg transition-colors group-hover:text-[var(--accent)]">
                      →
                    </span>
                  </MagneticElement>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
