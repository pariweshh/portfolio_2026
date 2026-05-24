# Pariwesh Tamrakar — Portfolio

A dark-themed, scroll-driven personal portfolio built with Next.js 16, React 19, and Motion. Every section is animated — from the venetian-blind project transitions to the canvas frame sequence hero — with a focus on craft, performance, and production polish.

<!-- Drop your screenshot into public/ and update this path -->

![Portfolio preview](./public/preview.webp)

---

## Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Framework  | Next.js 16.2.4 (App Router) |
| UI Library | React 19.2.4                |
| Animation  | Motion 12 (`motion/react`)  |
| Styling    | Tailwind CSS v4             |
| Icons      | Lucide React                |
| Language   | TypeScript 5                |
| Deployment | Vercel                      |

---

## Features

- **Animated loading screen** — word rotation + progress counter intro sequence
- **Canvas frame sequence** — 75 PNG frames driven by scroll position for a cinematic hero effect
- **Scroll-snapped project slides** — each project locks into view with a venetian-blind strip transition (12 strips, alternating reveal directions, staggered 25 ms apart)
- **SVG distortion filter** — spring-driven scanline glitch fires only at slide boundaries, zero distortion when settled
- **Particle field background** — ambient animated particles
- **Cursor spotlight** — radial gradient that follows the cursor
- **Scroll-driven progress bars** — one per project, filling in real time as you scroll
- **Project detail page** — parallax hero, meta bar, overview, stack chips, and image gallery with clip-path reveals
- **Career timeline** — role entries with metric bullets
- **Expertise & Tools sections** — technology grid
- **Testimonials marquee** — infinite horizontal scroll
- **Contact section** — links to email and social profiles
- **Dark theme** — CSS variable palette (`--bg`, `--text`, `--muted`, `--accent`, `--stroke`)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx               # Root state machine (loading → home → project detail)
│   ├── layout.tsx             # Root layout, font loading
│   └── globals.css            # CSS variables, @theme {}, global effects
├── components/
│   ├── LoadingScreen.tsx      # Animated intro
│   ├── HomePage.tsx           # Canvas hero + all sections
│   ├── ProjectsSection.tsx    # Scroll-snapped slides + venetian transitions
│   ├── ProjectPage.tsx        # Project detail overlay
│   ├── IntroSection.tsx       # Stats row
│   ├── CareerSection.tsx      # Work history
│   ├── AboutSection.tsx       # Bio + portrait
│   ├── ExpertiseSection.tsx   # Skill areas
│   ├── ToolsSection.tsx       # Technology grid
│   ├── TestimonialsSection.tsx# Marquee row
│   ├── ContactSection.tsx     # Contact links
│   ├── CursorSpotlight.tsx    # Cursor glow effect
│   └── ParticleField.tsx      # Ambient particles
└── data/
    └── projects.ts            # Single source of truth for all project data
```

---

## Routing Model

The app is a **single-page state machine** — no Next.js router navigations.

```
page.tsx
  ├── isLoading = true  →  <LoadingScreen onComplete />
  └── currentPage
        0  →  <HomePage onViewProject />
        1  →  <ProjectPage onBack />
```

`AnimatePresence` from `motion/react` handles the fade between states.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm run start

# Lint
npm run lint
```

---

## Adding a Project

All project data lives in `src/data/projects.ts`. Duplicate an existing entry, fill in the fields, and drop images into `public/images/projects/<slug>/`.

```ts
{
  index: 5,               // 0-based, controls display order
  slug: "my-project",
  hasDetailPage: false,   // true → "View Project" opens the detail overlay

  title: "My\nProject",  // \n preserved in detail hero, stripped to space in slide
  category: "Full-Stack · SaaS",
  stack: [
    { name: "Next.js", featured: true },    // featured → orange chip in detail page
    { name: "Tailwind CSS", featured: false },
  ],

  tagline: "One punchy sentence.",
  bgColor: "#001020",                        // dark tint behind the slide image
  href: "https://my-project.vercel.app",    // used when hasDetailPage is false

  year: "2025",
  role: "Full-stack Developer",
  url: "my-project.vercel.app",
  description: "Two or three sentences for the detail page overview.",
  services: ["Frontend Development", "API Design"],
  images: [
    "/images/projects/my-project/1.png",
    "/images/projects/my-project/2.png",
  ],
}
```

---

## Design Tokens

Defined in `src/app/globals.css` inside `@theme {}`:

| Token          | Value            | Usage                  |
| -------------- | ---------------- | ---------------------- |
| `--bg`         | `#0a0a0a`        | Page background        |
| `--text`       | `#f5f5f5`        | Primary text           |
| `--muted`      | `#888888`        | Secondary text, labels |
| `--accent`     | `#f97316`        | Orange highlight       |
| `--stroke`     | `#1f1f1f`        | Subtle borders         |
| `font-heading` | Orbitron         | Display headings       |
| `font-sans`    | Inter            | Body text              |
| `font-mono`    | JetBrains Mono   | Labels, tags, counters |
| `font-serif`   | Instrument Serif | Decorative             |

---

## Notes

- **Tailwind CSS v4** — uses `@import "tailwindcss"` and `@theme {}` in CSS. There is no `tailwind.config.ts`.
- **Motion** — import from `motion/react`, not `framer-motion`.
- **Canvas frames** — 75 PNGs live in `public/sequence/`. Frame count must stay in sync with the `useTransform` range in `HomePage.tsx`.
- **Scroll math** — `useScroll ["start start","end end"]` maps `0→1` over `(TOTAL_SLIDES − 1) × 100vh`. All snap-point formulas use `TOTAL_SLIDES − 1` as the divisor, not `TOTAL_SLIDES`.

---

## License

MIT
