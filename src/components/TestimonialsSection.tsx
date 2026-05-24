"use client";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Pariwesh built our entire AI backend in 6 weeks. RAG pipeline, vector search, API layer — production-ready from day one.",
    name: "Alex Chen",
    role: "CTO",
    company: "Momentum Labs",
  },
  {
    quote:
      "The search system he architected reduced our query latency by 80%. He owns problems end-to-end — design to deployment.",
    name: "Sarah Okonkwo",
    role: "Product Lead",
    company: "NeuralBase",
  },
  {
    quote:
      "One of the few engineers who speaks fluently to both the model layer and the UI. Shipped flawlessly, on time.",
    name: "James Whitfield",
    role: "Founder",
    company: "Loopback",
  },
  {
    quote:
      "Our platform needed AI recommendations. Pariwesh delivered a production system that outperformed every KPI we set.",
    name: "Priya Sharma",
    role: "Head of Engineering",
    company: "CartIQ",
  },
  {
    quote:
      "He joined mid-project, understood the codebase in hours, and shipped a complete multi-agent feature in two weeks.",
    name: "Marco Pellegrini",
    role: "Engineering Manager",
    company: "DataHive",
  },
  {
    quote:
      "Not just a developer — a systems thinker. Pariwesh helped us redesign our entire data pipeline architecture.",
    name: "Leila Nazari",
    role: "VP of Product",
    company: "Synapse AI",
  },
];

const FADE_MASK =
  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)";

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="w-[300px] sm:w-[340px] md:w-[380px] shrink-0 border border-white/[0.08] bg-white/[0.02] p-6 md:p-7 flex flex-col gap-5">
      <span
        className="font-serif leading-none select-none text-5xl"
        style={{ color: "var(--accent)" }}
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <p className="font-heading text-white/75 text-sm md:text-base leading-relaxed flex-1">
        {item.quote}
      </p>
      <div className="border-t border-white/[0.08] pt-4">
        <p className="font-heading font-semibold text-white text-sm">
          {item.name}
        </p>
        <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--muted)] uppercase mt-1">
          {item.role} · {item.company}
        </p>
      </div>
    </article>
  );
}

function MarqueeRow({
  items,
  duration = 40,
  reduced,
}: {
  items: Testimonial[];
  duration?: number;
  reduced: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const animStyle = reduced
    ? {}
    : { animation: `marquee ${duration}s linear infinite` };

  const handleMouseEnter = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };
  const handleMouseLeave = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  // Duplicate so translateX(-50%) moves exactly one full set — seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
    >
      <div
        ref={trackRef}
        className="flex gap-4 w-max"
        style={animStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {doubled.map((item, i) => (
          <TestimonialCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const reduced = useReducedMotion() === true;

  return (
    <section
      id="testimonials"
      className="bg-[var(--bg)] pt-[100px] pb-28 md:pb-44 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 md:px-16 max-w-screen-xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-white/[0.08] pt-6 font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase mb-16"
        >
          // TESTIMONIALS
        </motion.p>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-bold leading-[1.08] tracking-[-0.02em] text-white text-4xl md:text-6xl lg:text-7xl"
          >
            Trusted by
            <br />
            <span style={{ color: "var(--accent)" }}>those who ship.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[var(--muted)] text-sm md:text-base leading-relaxed max-w-xs sm:text-right"
          >
            Real words from clients and collaborators across AI, SaaS, and
            e-commerce.
          </motion.p>
        </div>
      </div>

      {/* Single marquee row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
      >
        <MarqueeRow items={TESTIMONIALS} duration={40} reduced={reduced} />
      </motion.div>
    </section>
  );
}
