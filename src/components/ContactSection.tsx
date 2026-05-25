"use client";
import { motion } from "motion/react";
import { Mail, Code2, Link2, MapPin } from "lucide-react";

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

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold text-white leading-[1.08] tracking-[-0.02em] text-4xl sm:text-5xl md:text-[72px] lg:text-[84px] max-w-4xl mb-8"
        >
          Let&apos;s build something
          <br />
          <span style={{ color: "var(--accent)" }}>worth shipping.</span>
        </motion.h2>

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
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-mono tracking-[0.15em] uppercase px-6 py-3 hover:border-white/40 hover:bg-white/5 transition-colors cursor-pointer"
            >
              ↑ BACK TO TOP
            </button>
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
                <motion.a
                  key={ch.label}
                  href={ch.href}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
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
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
