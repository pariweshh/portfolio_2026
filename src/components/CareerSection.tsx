"use client";
import { motion } from "motion/react";

interface Role {
  index: number;
  title: string;
  company: string;
  location: string;
  dateRange: string;
  duration: string;
  description: string;
  bullets: string[];
  tags: string[];
}

const ROLES: Role[] = [
  {
    index: 1,
    title: "Independent Developer",
    company: "Freelance / Self-employed",
    location: "Sydney, NSW",
    dateRange: "Feb 2025 — Present",
    duration: "1+ year",
    description:
      "Designing and shipping full-stack AI products independently — from architecture to App Store. Building across e-commerce, AI SaaS, and developer tooling with full ownership of every layer.",
    bullets: [
      "Launched Darshan Delights — a full-stack e-commerce platform (Next.js, Strapi, Stripe) serving a live Australian food business, plus a cross-platform React Native/Expo mobile app",
      "Built ResumeForge, a 7-stage AI pipeline orchestrating GPT-4 and Claude Sonnet for ATS scoring, resume parsing, and cover letter generation with a zero-hallucination validation layer",
      "Shipped Accessibility Auditor — supporting 500+ monthly WCAG scans at near-zero cost via efficient serverless architecture and Puppeteer/axe-core",
      "Built Domain Ranking App, ranking any domain against the top 1 million global sites with constant-time in-memory lookups",
    ],
    tags: ["Next.js", "React Native", "OpenAI", "Claude"],
  },
  {
    index: 2,
    title: "AI & Automation Developer",
    company: "CyberAgency",
    location: "Sydney, NSW",
    dateRange: "Sep 2025 — Nov 2025",
    duration: "3 months",
    description:
      "Embedded AI into the agency's outreach and lead generation workflows — replacing manual processes with autonomous pipelines and enabling non-technical staff to run campaigns independently.",
    bullets: [
      "Engineered end-to-end AI outreach automation pipelines using Prosp AI, Zapmail, Instantly, and Apollo — eliminating 35% of manual operational tasks across the team",
      "Automated LinkedIn lead generation and personalised follow-up sequences, driving a 25% improvement in prospect response rates",
    ],
    tags: ["AI Automation", "LLM", "Apollo", "Zapmail"],
  },
  {
    index: 3,
    title: "Full Stack Developer",
    company: "Rebb Tech Pty Ltd",
    location: "Sydney, NSW",
    dateRange: "Mar 2022 — Feb 2025",
    duration: "3 years",
    description:
      "Delivered full-stack features across a production CRM platform — owning frontend performance, API design, payments integration, and CI/CD from day one.",
    bullets: [
      "Architected a scalable CRM platform using React, Redux, Node.js, Express, and MongoDB — reducing administrative workload by 30% across the business",
      "Cut average API response times by 25% through asynchronous request handling and optimised data pipeline design",
      "Drove a 23% increase in daily active users by shipping targeted React, TypeScript, and Tailwind CSS frontend improvements informed by usage data",
      "Established Git branching strategies and CI/CD pipelines — reducing deployment friction by 20% and improving team release velocity",
    ],
    tags: ["React", "Node.js", "MongoDB", "TypeScript"],
  },
];

export default function CareerSection() {
  return (
    <section
      id="career"
      className="bg-[var(--bg)] pt-[100px] pb-28 md:pb-44 px-6 md:px-16"
    >
      <div className="max-w-screen-xl mx-auto">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-white/[0.08] pt-6 text-[var(--muted)] font-mono text-[11px] tracking-[0.2em] uppercase mb-14"
        >
          // CAREER
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <h2 className="font-heading font-bold leading-[1.08] tracking-[-0.02em] text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Ideas to infrastructure.
          </h2>
          <h2
            className="font-heading font-bold leading-[1.08] tracking-[-0.02em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ color: "var(--accent)" }}
          >
            Shipped at every step.
          </h2>
        </motion.div>

        {/* ── Role entries ─────────────────────────────────────────────────── */}
        <div className="border-t border-white/[0.08]">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              className="border-b border-white/[0.08] py-12 md:py-16"
            >
              {/* Top row: index left — date + duration right */}
              <div className="flex items-start justify-between mb-5">
                <span className="text-[var(--muted)] font-mono text-sm tabular-nums">
                  {String(role.index).padStart(2, "0")}
                </span>
                <div className="text-right">
                  <p className="font-mono text-sm" style={{ color: "var(--accent)" }}>
                    {role.dateRange}
                  </p>
                  <p className="text-[var(--muted)] font-mono text-xs mt-0.5">
                    {role.duration}
                  </p>
                </div>
              </div>

              {/* Title row + tags */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                <h3 className="font-heading font-bold text-white text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em]">
                  {role.title}
                </h3>
                <div className="flex flex-wrap gap-2 md:justify-end md:max-w-xs shrink-0">
                  {role.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-white/[0.08] text-[var(--muted)] font-mono text-xs px-3 py-1.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Company + location */}
              <p className="text-[var(--muted)] text-sm mb-6">
                {role.company}
                <span className="mx-2 opacity-40">·</span>
                {role.location}
              </p>

              {/* Description */}
              <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-6 text-sm md:text-base">
                {role.description}
              </p>

              {/* Bullet metrics */}
              <ul className="space-y-3">
                {role.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span
                      className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                    <span className="text-[var(--muted)] text-sm md:text-base leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
