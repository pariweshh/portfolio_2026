"use client";
import { motion } from "motion/react";

interface Tool {
  name: string;
  featured?: boolean;
}

const TOOLS: Tool[] = [
  { name: "Claude API", featured: true },
  { name: "OpenAI API", featured: true },
  { name: "LangChain", featured: true },
  { name: "Next.js" },
  { name: "React" },
  { name: "TypeScript" },
  { name: "Python" },
  { name: "Node.js" },
  { name: "PostgreSQL" },
  { name: "MongoDB" },
  { name: "Redis" },
  { name: "Pinecone" },
  { name: "Docker" },
  { name: "Vercel" },
  { name: "AWS" },
  { name: "Tailwind CSS" },
];

const LANGUAGES = [
  { name: "English", level: "Fluent" },
  { name: "Hindi", level: "Native" },
];

const AVAILABILITY = ["Remote", "Full-time", "Freelance"];

export default function ToolsSection() {
  return (
    <section
      id="tools"
      className="bg-[var(--bg)] pt-[100px] pb-28 md:pb-44 px-6 md:px-16"
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[var(--muted)] font-mono text-[11px] tracking-[0.2em] uppercase"
          >
            // TOOLSET
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-bold text-white leading-[1.1] tracking-[-0.02em] text-3xl md:text-4xl lg:text-5xl md:text-right"
          >
            The tools of the craft
          </motion.h2>
        </div>

        {/* Tool tags */}
        <div className="flex flex-wrap gap-2 mb-16">
          {TOOLS.map((tool, i) => (
            <motion.span
              key={tool.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className={`text-sm px-4 py-2.5 border transition-colors duration-200 cursor-default ${
                tool.featured
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--stroke)] text-[var(--muted)] hover:border-white/25 hover:text-white"
              }`}
            >
              {tool.name}
            </motion.span>
          ))}
        </div>

        {/* Languages + Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[var(--stroke)] pt-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[var(--muted)] font-mono text-[10px] tracking-[0.2em] uppercase mb-5">
              LANGUAGES
            </p>
            <div className="flex flex-wrap gap-3">
              {LANGUAGES.map((lang) => (
                <span key={lang.name} className="border border-[var(--stroke)] px-4 py-2 text-sm">
                  <span className="text-white font-heading font-semibold">{lang.name}</span>
                  <span className="text-[var(--muted)] ml-2 text-xs">{lang.level}</span>
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-[var(--muted)] font-mono text-[10px] tracking-[0.2em] uppercase mb-5">
              AVAILABILITY
            </p>
            <div className="flex flex-wrap gap-3">
              {AVAILABILITY.map((item) => (
                <span key={item} className="border border-[var(--stroke)] px-4 py-2 text-sm text-[var(--muted)]">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
