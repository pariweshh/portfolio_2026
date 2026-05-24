// ── Single source of truth for all project data ────────────────────────────────
//
// Each entry drives two components:
//   • ProjectsSection — scroll slides  (title, tagline, bgColor, first 4 stack items)
//   • ProjectPage     — detail page    (all fields)
//
// To add a new project: duplicate one of the objects below and fill in your details.
// To enable a detail page for a project: set hasDetailPage: true.

export interface StackItem {
  name: string;
  /** true → orange-border chip in the detail page Stack section */
  featured?: boolean;
}

export interface ProjectData {
  // ── Identity ────────────────────────────────────────────────────────────
  /** 0-based order; determines the "01" display number */
  index: number;
  /** URL-friendly key — used for future routing */
  slug: string;
  /** Enables the "View Project" button to navigate to the detail page */
  hasDetailPage: boolean;

  // ── Shared ──────────────────────────────────────────────────────────────
  /**
   * Display title — use \n for a line break.
   * Scroll slide strips \n to a space; detail hero preserves it.
   */
  title: string;
  /** e.g. "Full-Stack · E-commerce" — shown in both slide and detail meta bar */
  category: string;
  /** First 4 items shown as chips on the slide; all items shown in the detail Stack section */
  stack: StackItem[];

  // ── Scroll-slide (ProjectsSection) ──────────────────────────────────────
  /** Short punchy one-liner shown on the scroll slide */
  tagline: string;
  /** Dark tint behind the slide background image — choose a hue that suits the project brand */
  bgColor: string;
  /** External URL for projects without a detail page; ignored when hasDetailPage is true */
  href: string;

  // ── Detail page (ProjectPage) ────────────────────────────────────────────
  year: string;
  role: string;
  /** Live site URL — without https://, rendered as a clickable link */
  url: string;
  /** 2-3 sentence paragraph shown large in the Overview section */
  description: string;
  /** Bullet list in the Overview right column */
  services: string[];
  /** Gallery images — first image spans full width, rest are half-width pairs */
  images: string[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const PROJECTS: ProjectData[] = [
  {
    index: 0,
    slug: "darshan-delights",
    hasDetailPage: true,

    title: "Darshan\nDelights",
    category: "Full-Stack · E-commerce",
    stack: [
      { name: "Next.js", featured: true },
      { name: "TypeScript", featured: true },
      { name: "Tailwind CSS", featured: true },
      { name: "PostgreSQL", featured: true },
      { name: "Strapi CMS", featured: false },
      { name: "Stripe", featured: false },
      { name: "Vercel", featured: false },
      { name: "Figma", featured: false },
    ],

    tagline: "Premium e-commerce for authentic Nepali & Indian groceries.",
    bgColor: "#1a0800",
    href: "https://darshandelights.com.au",

    year: "2024",
    role: "Full-stack & Design",
    url: "darshandelights.com.au",
    description:
      "We built a comprehensive e-commerce platform for Darshan Delights, " +
      "balancing a premium visual identity with fast, conversion-focused UX. " +
      "From product catalogue to checkout, every interaction was crafted to make " +
      "authentic Nepali & Indian sweets feel as special as they taste. Powered by " +
      "Next.js and Strapi CMS, the platform handles real-time inventory, Stripe " +
      "payments, and a full admin dashboard.",
    services: [
      "E-commerce Development",
      "UI/UX Design",
      "Brand Identity",
      "SEO & Performance",
    ],
    images: [
      "/images/projects/darshan/1.png",
      "/images/projects/darshan/2.png",
      "/images/projects/darshan/3.png",
      "/images/projects/darshan/4.png",
      "/images/projects/darshan/5.png",
    ],
  },

  {
    index: 1,
    slug: "taskverse",
    hasDetailPage: false,

    title: "Task\nVerse",
    category: "Full-Stack · Productivity",
    stack: [
      { name: "Next.js", featured: true },
      { name: "TypeScript", featured: true },
      { name: "Clerk", featured: true },
      { name: "Prisma", featured: true },
      { name: "PostgreSQL", featured: false },
      { name: "Tailwind CSS", featured: false },
      { name: "Vercel", featured: false },
    ],

    tagline: "Collaborative task management with real-time sync.",
    bgColor: "#00111a",
    href: "https://task-verse-app.vercel.app",

    year: "2023",
    role: "Full-stack Developer",
    url: "task-verse-app.vercel.app",
    description:
      "TaskVerse is a full-stack productivity platform built to replace scattered " +
      "tools with a single, intelligent workspace. Clerk authentication, real-time " +
      "updates, and a Prisma-backed PostgreSQL database keep every team in sync. " +
      "The result is a clean, fast task manager that removes friction from start to ship.",
    services: [
      "Full-Stack Development",
      "Authentication",
      "Database Design",
      "Cloud Deployment",
    ],
    images: [
      "/images/projects/task-verse/1.png",
      "/images/projects/task-verse/2.png",
      "/images/projects/task-verse/3.png",
      "/images/projects/task-verse/4.png",
      "/images/projects/task-verse/5.png",
    ],
  },

  {
    index: 2,
    slug: "accessibility-auditor",
    hasDetailPage: false,

    title: "Accessibility\nAuditor",
    category: "Full-Stack · Dev Tools",
    stack: [
      { name: "Next.js", featured: true },
      { name: "TypeScript", featured: true },
      { name: "Puppeteer", featured: true },
      { name: "axe-core", featured: true },
      { name: "Tailwind CSS", featured: false },
      { name: "Vercel", featured: false },
    ],

    tagline: "Scan any URL for WCAG violations and get AI-powered fixes.",
    bgColor: "#090018",
    href: "https://accessibility-auditor.vercel.app",

    year: "2025",
    role: "Full-stack Developer",
    url: "accessibility-auditor.vercel.app",
    description:
      "Accessibility Auditor combines Puppeteer-core and axe-core to run full WCAG " +
      "audits on any live URL, then surfaces results in a structured, developer-friendly " +
      "report. An AI layer generates targeted code fixes for each violation — " +
      "audits that used to take hours now take seconds.",
    services: [
      "Web Scraping",
      "Accessibility Testing",
      "AI Fix Generation",
      "API Design",
    ],
    images: [
      "/images/projects/accessibility-auditor/home.webp",
      "/images/projects/accessibility-auditor/results.webp",
      "/images/projects/accessibility-auditor/ai-fix.webp",
    ],
  },

  {
    index: 3,
    slug: "domain-ranking",
    hasDetailPage: false,

    title: "Domain\nRanking",
    category: "Full-Stack · SEO Tools",
    stack: [
      { name: "Vue.js", featured: true },
      { name: "Nuxt.js", featured: true },
      { name: "NestJS", featured: true },
      { name: "TypeScript", featured: true },
      { name: "PostgreSQL", featured: false },
      { name: "Vercel", featured: false },
    ],

    tagline: "Track domain authority and SEO signals at scale.",
    bgColor: "#001209",
    href: "https://domain-ranking-frontend.vercel.app",

    year: "2025",
    role: "Full-stack Developer",
    url: "domain-ranking-frontend.vercel.app",
    description:
      "A dual-service platform for tracking domain authority metrics — a Nuxt.js SPA " +
      "on the frontend and a NestJS REST API for data processing and storage. Users can " +
      "batch-analyse domains, compare authority scores, and export rankings. Built for " +
      "SEO agencies and power users who need more than a spreadsheet.",
    services: [
      "Frontend Development",
      "API Development",
      "Data Visualisation",
      "Deployment",
    ],
    images: [
      "/images/projects/domain/1.png",
      "/images/projects/domain/2.png",
      "/images/projects/domain/3.png",
    ],
  },

  {
    index: 4,
    slug: "darshan-delights-app",
    hasDetailPage: false,

    title: "Darshan\nDelights App",
    category: "Mobile · E-commerce",
    stack: [
      { name: "React Native", featured: true },
      { name: "Expo", featured: true },
      { name: "TypeScript", featured: true },
      { name: "Zustand", featured: true },
      { name: "iOS", featured: false },
    ],

    tagline: "Native iOS shopping for Darshan Delights — live on the App Store.",
    bgColor: "#160a00",
    href: "#",

    year: "2025",
    role: "Mobile Developer",
    url: "apps.apple.com",
    description:
      "The Darshan Delights mobile app brings the full e-commerce experience to iOS, " +
      "built with React Native and Expo for a truly native feel. Zustand powers a fast, " +
      "predictable cart and wishlist state layer — shipped and live on the Apple App Store.",
    services: [
      "React Native Development",
      "iOS App",
      "State Management",
      "App Store Deployment",
    ],
    images: [
      "/images/projects/darshan-app/app_1.png",
      "/images/projects/darshan-app/2.png",
      "/images/projects/darshan-app/3.png",
      "/images/projects/darshan-app/4.png",
      "/images/projects/darshan-app/5.png",
      "/images/projects/darshan-app/6.png",
      "/images/projects/darshan-app/7.png",
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** 0 → "01", 1 → "02" etc. */
export const displayNumber = (index: number): string =>
  String(index + 1).padStart(2, "0");

/** Strips \n for contexts that can't render a line break (alt text, slide title) */
export const flatTitle = (title: string): string => title.replace("\n", " ");

/** The 4 stack names shown as chips on the scroll slide */
export const slideTags = (stack: StackItem[]): string[] =>
  stack.slice(0, 4).map((s) => s.name);
