"use client";
import { motion, type Variants } from "motion/react";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = (delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: delay,
    },
  },
});

const wordVariants: Variants = {
  hidden: { y: "105%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE },
  },
};

export default function AnimatedHeading({
  text,
  className = "",
  delay = 0,
  as = "h2",
}: AnimatedHeadingProps) {
  const Tag = motion[as];
  const words = text.split(" ");

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants(delay)}
      className={className}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="overflow-hidden inline-block align-bottom"
        >
          <motion.span
            variants={wordVariants}
            className="inline-block"
            style={{ willChange: "transform" }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
