"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { PROJECTS, flatTitle, displayNumber, type ProjectData } from "@/data/projects";

// ── Constants ─────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

// ── GLSL ──────────────────────────────────────────────────────────────────────

const VERT_SRC = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;
uniform sampler2D u_tex;
uniform vec2 u_mouse;
uniform float u_hover;
uniform float u_time;
uniform vec2 u_res;
uniform float u_img;
varying vec2 v_uv;
void main(){
  vec2 delta = v_uv - u_mouse;
  delta.x *= u_res.x / u_res.y;
  float dist = length(delta);
  float wave = sin(dist * 28.0 - u_time * 3.8) * 0.014 * u_hover;
  wave *= 1.0 - smoothstep(0.0, 0.52, dist);
  vec2 displaced = v_uv + normalize(delta + 0.0001) * wave;
  float ca = u_res.x / u_res.y;
  vec2 uv = displaced;
  if(ca > u_img){
    float s = u_img / ca;
    uv.y = (uv.y - 0.5) * s + 0.5;
  } else {
    float s = ca / u_img;
    uv.x = (uv.x - 0.5) * s + 0.5;
  }
  uv = clamp(uv, 0.001, 0.999);
  vec4 c = texture2D(u_tex, uv);
  float dark = smoothstep(0.42, 0.0, v_uv.y);
  c.rgb *= 1.0 - dark * 0.88;
  gl_FragColor = c;
}
`;

// ── WebGL helpers ─────────────────────────────────────────────────────────────

function makeShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("createShader failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

function makeProgram(gl: WebGLRenderingContext): {
  prog: WebGLProgram;
  vert: WebGLShader;
  frag: WebGLShader;
} {
  const vert = makeShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const frag = makeShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  const prog = gl.createProgram();
  if (!prog) throw new Error("createProgram failed");
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  return { prog, vert, frag };
}

// ── useRippleGL ───────────────────────────────────────────────────────────────

interface RippleHandlers {
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function useRippleGL(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  imageSrc: string
): RippleHandlers {
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const hoverRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);
  const imgRatioRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    let prog: WebGLProgram;
    let vert: WebGLShader;
    let frag: WebGLShader;
    try {
      ({ prog, vert, frag } = makeProgram(gl));
    } catch {
      return;
    }

    gl.useProgram(prog);

    // Full-screen quad buffer
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTex = gl.getUniformLocation(prog, "u_tex");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uHover = gl.getUniformLocation(prog, "u_hover");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uImg = gl.getUniformLocation(prog, "u_img");

    // Texture — dark placeholder pixel while image loads
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([10, 10, 10, 255])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Load image and upload to GPU
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        imgRatioRef.current = img.naturalWidth / img.naturalHeight;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      };
      img.src = imageSrc;
    }

    // Canvas resize
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Render loop
    const startTime = performance.now();
    const loop = () => {
      hoverRef.current += (targetRef.current - hoverRef.current) * 0.055;

      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uHover, hoverRef.current);
      gl.uniform1f(uTime, (performance.now() - startTime) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uImg, imgRatioRef.current);
      gl.uniform1i(uTex, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteProgram(prog);
    };
  }, [canvasRef, imageSrc]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1 - (e.clientY - rect.top) / rect.height,
    };
  }, []);

  const onMouseEnter = useCallback(() => {
    targetRef.current = 1;
  }, []);

  const onMouseLeave = useCallback(() => {
    targetRef.current = 0;
  }, []);

  return { onMouseMove, onMouseEnter, onMouseLeave };
}

// ── ProjectPanel ──────────────────────────────────────────────────────────────

interface ProjectPanelProps {
  project: ProjectData;
  isActive: boolean;
}

function ProjectPanel({ project, isActive }: ProjectPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { onMouseMove, onMouseEnter, onMouseLeave } = useRippleGL(
    canvasRef,
    project.images[0] ?? ""
  );

  return (
    <div className="relative w-full h-screen shrink-0" style={{ scrollSnapAlign: "start" }}>
      {/* WebGL canvas — covers the full panel */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      {/* Fallback background */}
      <div className="absolute inset-0 bg-[#0a0a0a] -z-10" />

      {/* Animated info overlay — slides up when active */}
      <motion.div
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="absolute bottom-0 left-0 right-0 px-8 md:px-14 pb-12 md:pb-20 pointer-events-none"
      >
        {/* Meta row */}
        <div className="flex items-center gap-4 mb-5">
          <span className="font-mono text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
            {displayNumber(project.index)}
          </span>
          <span className="w-8 h-px bg-white/20 shrink-0" />
          <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--muted)] uppercase">
            {project.category}
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--muted)] uppercase ml-auto">
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-heading font-bold text-white leading-[1.04] tracking-[-0.03em] text-5xl md:text-7xl lg:text-[88px] mb-7 max-w-5xl">
          {flatTitle(project.title)}
        </h2>

        {/* Stack chips + CTA */}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((s) => (
              <span
                key={s.name}
                className="border border-white/[0.14] text-white/45 font-mono text-[9px] px-3 py-1.5 tracking-wider"
              >
                {s.name}
              </span>
            ))}
          </div>

          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-3 border border-white/20 text-white font-mono text-[11px] tracking-[0.18em] uppercase px-6 py-3 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            View Project →
          </a>
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientHeight === 0) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setActiveIndex(Math.min(idx, PROJECTS.length - 1));
  }, []);

  const scrollToPanel = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: i * el.clientHeight, behavior: "smooth" });
  }, []);

  const activeProject = PROJECTS[activeIndex];

  return (
    <main className="bg-[#0a0a0a] text-white font-sans">

      {/* ── Fixed header ──────────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between px-8 md:px-14 pt-8 pb-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.92) 0%, transparent 100%)",
        }}
      >
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={12} />
          Back
        </Link>

        <div className="text-right">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="font-heading font-bold text-white text-sm tracking-[-0.01em]"
            >
              {activeProject ? flatTitle(activeProject.title) : ""}
            </motion.p>
          </AnimatePresence>
          <p className="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase mt-1">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(PROJECTS.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* ── Fixed right-side scroll indicator (desktop) ───────────────────── */}
      <div className="fixed right-7 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2.5">
        {PROJECTS.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => scrollToPanel(i)}
            className="group flex items-center gap-2 cursor-pointer"
            title={flatTitle(p.title)}
          >
            <motion.div
              animate={{
                height: i === activeIndex ? 30 : 5,
                backgroundColor:
                  i === activeIndex
                    ? "var(--accent)"
                    : "rgba(255,255,255,0.18)",
              }}
              transition={{ duration: 0.38, ease: EASE }}
              className="w-[2px] rounded-full"
            />
          </button>
        ))}
      </div>

      {/* ── Desktop: scroll-snap WebGL panels ────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="hidden md:block h-screen overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {PROJECTS.map((project, i) => (
          <ProjectPanel key={project.slug} project={project} isActive={i === activeIndex} />
        ))}
      </div>

      {/* ── Mobile: simple card stack ─────────────────────────────────────── */}
      <div className="md:hidden pt-24 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-10"
        >
          <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase mb-3 border-t border-white/[0.08] pt-5">
            // ALL WORK
          </p>
          <h1 className="font-heading font-bold text-white text-4xl sm:text-5xl leading-[1.06] tracking-[-0.02em] mb-3">
            All Projects.
          </h1>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            {PROJECTS.length} projects — AI systems, web applications, and mobile apps.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
            >
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-white/[0.08] overflow-hidden"
              >
                <div
                  className="aspect-[16/9] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{
                    backgroundImage: project.images[0]
                      ? `url("${project.images[0]}")`
                      : undefined,
                    backgroundColor: project.bgColor,
                  }}
                />
                <div className="bg-[#0e0e0e] px-5 py-5">
                  <p className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted)] uppercase mb-1.5">
                    {project.category} · {project.year}
                  </p>
                  <h2 className="font-heading font-bold text-white text-xl leading-[1.08] tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors duration-300 mb-1.5">
                    {flatTitle(project.title)}
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed">{project.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.stack.slice(0, 3).map((s) => (
                      <span
                        key={s.name}
                        className="border border-white/[0.10] text-white/40 font-mono text-[9px] px-2.5 py-1 tracking-wider"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
