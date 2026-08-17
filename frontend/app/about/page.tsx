"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion, useInView, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, Target, Globe, Users, Clock, Heart, Handshake, MapPin, ShieldCheck, Plus, Radio, Satellite } from "lucide-react";

// ============================================================
// FONTS — display + mono carry the whole identity. No serif.
// ============================================================
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter" });

// ============================================================
// TOKENS — same brand identity, executed as live telemetry
// ============================================================
const SIGNAL = "#00AEEF";   // YPA blue — the "live" color
const HARVEST = "#F0B429";  // YPA gold — the "value" color
const VOID = "#050608";     // base canvas
const PANEL = "#0A0D12";    // raised panel
const PANEL_2 = "#0D1219";  // alt panel
const LINE = "rgba(0,174,239,0.16)";
const LINE_SOFT = "rgba(255,255,255,0.08)";
const FOG = "rgba(245,246,247,0.56)";
const WHITE = "#F5F6F7";
const EASE = [0.16, 1, 0.3, 1] as const;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

async function getAboutContent() {
  try {
    const res = await fetch(`${API_URL}/items/about`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()).data?.[0] || null;
  } catch { return null; }
}
async function getFAQs() {
  try {
    const res = await fetch(`${API_URL}/items/faqs?sort[]=order`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch { return []; }
}

// ============================================================
// REAL PHOTOGRAPHY
// ============================================================
const PHOTOS = {
  hero: "https://res.cloudinary.com/owwvyprb/image/upload/v1784726249/3P0D0002_tg15tl.jpg",
  community: "https://res.cloudinary.com/owwvyprb/image/upload/v1784714736/27b30d55-18ea-4197-b073-9a2c6dae3100.jpg",
  goats: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716326/acc94e42-c5d5-489c-b335-6ee5353253be.jpg",
  farm: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716480/587e2393-e360-4ac2-bae3-22b7cec94705.jpg",
  aerial: "https://res.cloudinary.com/owwvyprb/image/upload/v1786356172/DJI_0017_g53jgu.jpg",
  maize: "https://res.cloudinary.com/owwvyprb/image/upload/v1784803273/maizee_kkke6y.jpg",
  sacco: "https://res.cloudinary.com/owwvyprb/image/upload/v1784727031/54b61dc1-469f-4363-8a52-4de7e285fa1b.jpg",
  hq: "https://res.cloudinary.com/owwvyprb/image/upload/v1786356172/BZ6A9825_hkymyx.jpg",
  members: "https://res.cloudinary.com/owwvyprb/image/upload/v1786357366/3P0D7976_fkxetu.jpg",
  leader1: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716326/acc94e42-c5d5-489c-b335-6ee5353253be.jpg",
  leader2: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716480/587e2393-e360-4ac2-bae3-22b7cec94705.jpg",
  leader3: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716382/5fd55b99-ec2f-4990-b3c7-8a5b69837aad.jpg",
  leader4: "https://res.cloudinary.com/owwvyprb/image/upload/v1784726254/3P0D0022_gqfkkg.jpg",
};

// ============================================================
// Reveal
// ============================================================
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  return (
    <motion.div ref={ref} initial={reduce ? {} : { opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : reduce ? {} : { opacity: 0, y: 20 }} transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

// Section eyebrow — reads like a telemetry channel tag, not a magazine kicker
function Kicker({ tag, children }: { tag?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: SIGNAL }} />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
      </span>
      {tag && <span className={`${mono.className} text-[10px] tracking-[0.18em]`} style={{ color: SIGNAL }}>{tag}</span>}
      <span className={`${mono.className} text-[10px] md:text-[11px] font-medium uppercase tracking-[0.22em]`} style={{ color: FOG }}>{children}</span>
    </div>
  );
}

// Ambient dot-grid field for dark panels — the telemetry "map" texture
function GridField({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: `radial-gradient(${LINE} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 85%)",
      }}
    />
  );
}

// Horizontal scan sweep — the signature motion motif, used sparingly
function ScanSweep({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className={`absolute left-0 right-0 h-px pointer-events-none ${className}`}
      style={{ background: `linear-gradient(90deg, transparent, ${SIGNAL}, transparent)`, boxShadow: `0 0 12px 1px ${SIGNAL}80` }}
      initial={{ top: "0%" }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />
  );
}

// Corner-bracket frame — the signature photo treatment (drone-feed reticle)
function TelemetryFrame({
  src,
  alt,
  caption,
  className = "",
  imgClassName = "w-full h-full object-cover",
  grayscale = 0.25,
  sweep = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  grayscale?: number;
  sweep?: boolean;
}) {
  const corner = "absolute w-4 h-4 border-current";
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: PANEL }}>
      <img src={src} alt={alt} className={imgClassName} style={{ filter: `grayscale(${grayscale}) contrast(1.05) saturate(1.05)` }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(5,6,8,0) 55%, rgba(5,6,8,0.55) 100%)` }} />
      {sweep && <ScanSweep />}
      <span className={`${corner} top-2 left-2 border-t border-l`} style={{ color: SIGNAL }} />
      <span className={`${corner} top-2 right-2 border-t border-r`} style={{ color: SIGNAL }} />
      <span className={`${corner} bottom-2 left-2 border-b border-l`} style={{ color: SIGNAL }} />
      <span className={`${corner} bottom-2 right-2 border-b border-r`} style={{ color: SIGNAL }} />
      {caption && (
        <span className={`${mono.className} absolute bottom-2.5 left-3 right-3 text-[9px] tracking-[0.14em] uppercase truncate`} style={{ color: "rgba(245,246,247,0.75)" }}>
          {caption}
        </span>
      )}
    </div>
  );
}

function HudBadge({ label = "YPA // EST. 2008" }: { label?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? {} : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="relative inline-flex items-center gap-2.5 pl-3 pr-4 py-1.5 w-fit" style={{ background: "rgba(0,174,239,0.06)", border: `1px solid ${LINE}` }}>
      <span className="absolute -top-px -left-px w-2 h-2 border-t border-l" style={{ borderColor: SIGNAL }} />
      <span className="absolute -bottom-px -right-px w-2 h-2 border-b border-r" style={{ borderColor: SIGNAL }} />
      <motion.span animate={reduce ? {} : { opacity: [1, 0.35, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
        <Satellite className="h-3.5 w-3.5" style={{ color: SIGNAL }} strokeWidth={1.75} />
      </motion.span>
      <span className={`${mono.className} text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-medium whitespace-nowrap`} style={{ color: SIGNAL }}>{label}</span>
    </motion.div>
  );
}

function MorphButton({ href, idleText, revealText, variant = "solid", icon: Icon = ArrowUpRight }: { href: string; idleText: string; revealText: string; variant?: "solid" | "outline"; icon?: any }) {
  const [hover, setHover] = useState(false);
  const solid = variant === "solid";
  return (
    <Link href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      <motion.div
        className={`${mono.className} relative overflow-hidden inline-flex items-center h-12 text-xs uppercase tracking-[0.1em] font-medium cursor-pointer select-none`}
        style={solid ? { background: SIGNAL, color: VOID, clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" } : { border: `1px solid rgba(240,180,41,0.5)`, color: WHITE, clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
        animate={{ paddingLeft: 22, paddingRight: hover ? 18 : 22, boxShadow: solid && hover ? `0 0 26px ${SIGNAL}60` : "0 0 0px transparent" }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <span className="relative h-4 overflow-hidden">
          <motion.span className="block" animate={{ y: hover ? -18 : 0 }} transition={{ duration: 0.32, ease: EASE }}>{idleText}</motion.span>
          <motion.span className="block absolute top-0 left-0 whitespace-nowrap" animate={{ y: hover ? 0 : 18 }} transition={{ duration: 0.32, ease: EASE }}>{revealText}</motion.span>
        </span>
        <motion.span className="ml-2 flex items-center" animate={{ rotate: hover ? 45 : 0 }} transition={{ duration: 0.32 }}><Icon className="h-3.5 w-3.5" style={!solid ? { color: HARVEST } : {}} /></motion.span>
      </motion.div>
    </Link>
  );
}

// ============================================================
// SectionNav — HUD channel selector
// ============================================================
const SECTIONS = [
  { id: "quote", label: "Log" },
  { id: "story", label: "Origin" },
  { id: "people", label: "Crew" },
  { id: "purpose", label: "Purpose" },
  { id: "values", label: "Protocol" },
  { id: "timeline", label: "Timeline" },
  { id: "trust", label: "Records" },
  { id: "faq", label: "FAQ" },
];

function SectionNav() {
  const [active, setActive] = useState("quote");
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("hero");
    const io1 = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0 });
    if (hero) io1.observe(hero);
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      io.observe(el);
      return io;
    });
    return () => { io1.disconnect(); observers.forEach((o) => o?.disconnect()); };
  }, []);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="hidden md:flex fixed top-20 left-1/2 -translate-x-1/2 z-40 items-center gap-0.5 p-1" style={{ background: "rgba(5,6,8,0.9)", backdropFilter: "blur(14px)", border: `1px solid ${LINE}`, boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(0,174,239,0.08)` }}>
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => jump(s.id)} className={`${mono.className} relative px-3.5 py-2 text-[10px] tracking-[0.08em] uppercase font-medium transition-colors`} style={{ color: active === s.id ? VOID : "rgba(255,255,255,0.5)" }}>
              {active === s.id && <motion.span layoutId="navpill" className="absolute inset-0" style={{ background: SIGNAL, boxShadow: `0 0 16px ${SIGNAL}80` }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative z-10">{String(i + 1).padStart(2, "0")}·{s.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// HERO — live feed framing, cyan signal duotone
// ============================================================
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const reduce = useReducedMotion();
  return (
    <section id="hero" ref={ref} className="relative h-[96vh] min-h-[640px] overflow-hidden" style={{ background: VOID }}>
      <motion.div style={reduce ? {} : { y }} className="absolute inset-0">
        <img src={PHOTOS.hero} alt="" className="w-full h-full object-cover scale-110" style={{ filter: "grayscale(0.75) brightness(0.38) contrast(1.15)" }} />
      </motion.div>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 25% 35%, rgba(0,174,239,0.22), transparent 65%)`, mixBlendMode: "screen" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,6,8,0.2) 0%, rgba(5,6,8,0.92) 100%)" }} />
      <GridField opacity={0.5} />
      <ScanSweep />

      {/* frame border */}
      <div className="absolute inset-4 md:inset-6 border pointer-events-none" style={{ borderColor: LINE }} />
      <span className="absolute top-4 left-4 md:top-6 md:left-6 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: SIGNAL }} />
      <span className="absolute top-4 right-4 md:top-6 md:right-6 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: SIGNAL }} />
      <span className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: HARVEST }} />
      <span className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: HARVEST }} />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex items-start justify-between px-8 md:px-20 pt-28 md:pt-32">
          <Reveal><HudBadge /></Reveal>
          <Reveal delay={0.1} className="hidden sm:block text-right">
            <span className={`${mono.className} text-[10px] tracking-[0.25em] uppercase`} style={{ color: FOG }}>Feed 01 — Central Region, UG</span>
          </Reveal>
        </div>
        <motion.div style={reduce ? {} : { opacity }} className="px-8 md:px-20 pb-16 md:pb-24">
          <Reveal>
            <h1 className={`${display.className} text-white font-medium leading-[0.94] tracking-tight text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl`}>
              21 people.
              <br />
              <span style={{ color: SIGNAL }}>One signal that scaled.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-end gap-6">
              <MorphButton href="#story" idleText="Read the log" revealText="Scroll down" icon={ChevronDown} />
              <span className={`${mono.className} text-[11px] tracking-[0.05em] font-light max-w-xs leading-relaxed`} style={{ color: FOG }}>A Pan-African agribusiness platform — tracked from a village group to 12 branches, in real coordinates.</span>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// FOUNDING QUOTE — a transmitted log entry, not a magazine spread
// ============================================================
function FoundingQuote() {
  return (
    <section id="quote" className="relative py-24 md:py-32 px-6 md:px-16 overflow-hidden scroll-mt-24" style={{ background: PANEL }}>
      <GridField opacity={0.4} />
      <div className="relative max-w-4xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <Radio className="h-4 w-4" style={{ color: HARVEST }} strokeWidth={1.75} />
            <span className={`${mono.className} text-[10px] tracking-[0.2em] uppercase`} style={{ color: HARVEST }}>Transmission log — 2008</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className={`${display.className} text-white text-2xl sm:text-3xl md:text-5xl leading-[1.2] tracking-tight max-w-3xl`}>
            "We didn't set out to build a company. We set out to solve a problem for the people around us."
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-8" style={{ background: LINE }} />
            <span className={`${mono.className} text-[10px] tracking-[0.18em] uppercase`} style={{ color: FOG }}>YPA — founding group</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// STORY — telemetry-framed photo, stat readouts
// ============================================================
function Story({ content }: { content: any }) {
  return (
    <section id="story" className="py-24 md:py-36 px-6 md:px-16 scroll-mt-24 relative" style={{ background: VOID }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-16 items-start">
        <div>
          <Reveal><Kicker tag="00.01">Origin — founded 2008</Kicker></Reveal>
          <Reveal delay={0.05}>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium leading-[1.05] tracking-tight mt-5`} style={{ color: WHITE }}>
              From a village group to a Pan-African platform.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={`${inter.className} mt-6 text-base md:text-lg font-light leading-relaxed`} style={{ color: FOG }}>
              {content?.story ? (
                <div dangerouslySetInnerHTML={{ __html: content.story }} />
              ) : (
                <>
                  <p>Youth Platform Africa began in 2008 as a village group of 21 people. By 2010 it had grown into a Community Based Organisation with 60 members, who formed the Board of Governors and management that still guide the organisation today.</p>
                  <p className="mt-4">As the work grew into international trade, we registered formally as BREC Youth Empowerment Africa Limited. Today YPA runs agribusiness and financial-inclusion programmes across 12 branches in Uganda, with international offices in Dubai and Zambia.</p>
                </>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8" style={{ borderTop: `1px solid ${LINE_SOFT}` }}>
              {[["2008", "Founded"], ["12", "Branches"], ["03", "Countries"]].map(([v, l]) => (
                <div key={l}>
                  <div className={`${mono.className} text-2xl md:text-3xl font-medium`} style={{ color: SIGNAL }}>{v}</div>
                  <div className={`${mono.className} text-[10px] mt-1.5 uppercase tracking-[0.14em]`} style={{ color: FOG }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <TelemetryFrame src={PHOTOS.farm} alt="A YPA farm in Uganda" caption="Feed 02 — Farm Ops, Central Region" className="aspect-[3/4]" grayscale={0.35} />
          <div className="absolute -bottom-6 -left-6 md:-left-10 w-32 md:w-40">
            <TelemetryFrame src={PHOTOS.goats} alt="Goats under YPA's care" className="aspect-square shadow-2xl" grayscale={0.35} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// PHOTO INTERLUDE — the actual aerial/drone shot, full HUD treatment
// ============================================================
function PhotoInterlude() {
  return (
    <section className="relative h-[46vh] min-h-[300px] overflow-hidden" style={{ background: VOID }}>
      <img src={PHOTOS.aerial} alt="Aerial view of a YPA goat farm" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "grayscale(0.2) contrast(1.05)" }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, rgba(5,6,8,0.75) 0%, rgba(5,6,8,0.1) 45%, rgba(5,6,8,0.35) 100%)` }} />
      <GridField opacity={0.35} />
      <ScanSweep />
      <span className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: SIGNAL }} />
      <span className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: SIGNAL }} />
      <span className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: SIGNAL }} />
      <span className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: SIGNAL }} />
      <div className="absolute bottom-6 left-8 md:left-16 flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping" style={{ background: HARVEST }} /><span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: HARVEST }} /></span>
        <span className={`${mono.className} text-[10px] tracking-[0.16em] uppercase`} style={{ color: WHITE }}>Aerial — Mubende District · Goats Programme</span>
      </div>
      <span className={`${mono.className} absolute top-6 right-8 md:right-16 text-[9px] tracking-[0.16em] uppercase hidden sm:block`} style={{ color: "rgba(245,246,247,0.55)" }}>ALT 120M · DRONE-04</span>
    </section>
  );
}

// ============================================================
// SCALE — HUD readouts against the maize field
// ============================================================
function useCountUp(target: number, active: boolean, duration = 1600) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!active) return;
    if (reduce) { setN(target); return; }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduce]);
  return n;
}

function ScaleNumber({ target, suffix, label, code }: { target: number; suffix: string; label: string; code: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const n = useCountUp(target, inView);
  return (
    <div ref={ref} className="relative text-center px-6 py-8" style={{ border: `1px solid ${LINE_SOFT}` }}>
      <span className={`${mono.className} absolute top-3 left-4 text-[9px] tracking-[0.12em]`} style={{ color: "rgba(245,246,247,0.35)" }}>{code}</span>
      <div className={`${display.className} font-medium tracking-tight text-white text-[14vw] sm:text-6xl md:text-7xl`}>
        {n.toLocaleString()}<span style={{ color: HARVEST }}>{suffix}</span>
      </div>
      <div className={`${mono.className} mt-3 text-[11px] uppercase tracking-[0.16em]`} style={{ color: FOG }}>{label}</div>
    </div>
  );
}

function Scale() {
  return (
    <section className="relative py-28 md:py-40 px-6 md:px-16 overflow-hidden" style={{ background: PANEL }}>
      <img src={PHOTOS.maize} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "grayscale(0.85) brightness(0.16) contrast(1.1)" }} />
      <GridField opacity={0.6} />
      <div className="relative max-w-5xl mx-auto text-center mb-16 md:mb-24">
        <Reveal className="flex justify-center"><Kicker tag="00.02">What we've built</Kicker></Reveal>
        <Reveal delay={0.08}><h2 className={`${display.className} text-white text-3xl md:text-5xl font-medium tracking-tight mt-4`}>The numbers, live.</h2></Reveal>
      </div>
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3">
        <ScaleNumber target={130000} suffix="+" label="Goats under care" code="TAG-A1" />
        <ScaleNumber target={12} suffix="" label="Branches, nationwide" code="TAG-B2" />
        <ScaleNumber target={1000} suffix="+" label="Members empowered" code="TAG-C3" />
      </div>
    </section>
  );
}

// ============================================================
// LEADERSHIP — crew manifest
// ============================================================
interface Leader { role: string; name: string; bio: string; image: string }
const LEADERSHIP_PREVIEW: Leader[] = [
  { role: "Managing Director", name: "Obed Ben", bio: "Leads YPA's agribusiness strategy and community development work, shaping how the organisation grows branch by branch.", image: PHOTOS.leader1 },
  { role: "Executive Director", name: "JB Magezi", bio: "Drives YPA's expansion across Africa and its financial-inclusion programmes, including the SACCO's growth to 12 branches.", image: PHOTOS.leader2 },
  { role: "General Manager", name: "Charles Kalemera", bio: "Oversees day-to-day operations across all branches, keeping the goats, maize, and SACCO programmes running in sync.", image: PHOTOS.leader3 },
  { role: "Founding Member", name: "Name pending", bio: "Role summary and credentials to be added.", image: PHOTOS.leader4 },
];

function LeaderRow({ leader, index }: { leader: Leader; index: number }) {
  const flip = index % 2 === 1;
  const pending = leader.name === "Name pending";
  return (
    <Reveal delay={index * 0.06}>
      <div className={`grid md:grid-cols-[0.7fr_1fr] gap-6 md:gap-10 items-center py-10 md:py-14 ${flip ? "md:[direction:rtl]" : ""}`} style={{ borderTop: index === 0 ? `1px solid ${LINE_SOFT}` : "none", borderBottom: `1px solid ${LINE_SOFT}` }}>
        <div style={{ direction: "ltr" }}>
          <TelemetryFrame src={leader.image} alt={leader.name} className="aspect-[4/5]" imgClassName="w-full h-full object-cover" grayscale={pending ? 0.9 : 0.4} caption={`Crew ${String(index + 1).padStart(2, "0")}`} />
        </div>
        <div style={{ direction: "ltr" }}>
          <span className={`${mono.className} text-[10px] tracking-[0.14em]`} style={{ color: HARVEST }}>OP-{String(index + 1).padStart(2, "0")}</span>
          <h3 className={`${display.className} text-2xl md:text-3xl font-medium mt-2`} style={{ color: pending ? FOG : WHITE }}>{leader.name}</h3>
          <div className={`${mono.className} text-[11px] mt-1.5 uppercase tracking-[0.1em]`} style={{ color: SIGNAL }}>{leader.role}</div>
          <p className={`${inter.className} mt-4 text-base font-light leading-relaxed max-w-md`} style={{ color: FOG }}>{leader.bio}</p>
        </div>
      </div>
    </Reveal>
  );
}

function Leadership() {
  return (
    <section id="people" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: VOID }}>
      <div className="max-w-5xl mx-auto">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <Kicker tag="00.03">Governance</Kicker>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-4`} style={{ color: WHITE }}>The crew, on record.</h2>
          </div>
          <MorphButton href="/team" idleText="Full manifest" revealText="View all →" variant="outline" />
        </Reveal>
        <div>{LEADERSHIP_PREVIEW.map((l, i) => <LeaderRow key={l.name} leader={l} index={i} />)}</div>
      </div>
    </section>
  );
}

// ============================================================
// PURPOSE — two glass telemetry cards
// ============================================================
function PurposeCard({ image, icon: Icon, tag, front, back }: { image: string; icon: any; tag: string; front: string; back: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative aspect-[4/5] overflow-hidden cursor-pointer group" onClick={() => setOpen((o) => !o)} style={{ border: `1px solid ${LINE_SOFT}` }}>
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: "grayscale(0.55) brightness(0.35) contrast(1.1)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,6,8,0.25) 0%, rgba(5,6,8,0.92) 100%)" }} />
      <span className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: SIGNAL }} />
      <span className="absolute top-3 right-3 w-4 h-4 border-t border-r" style={{ borderColor: SIGNAL }} />
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <Icon className="h-6 w-6 mb-4" style={{ color: HARVEST }} strokeWidth={1.5} />
        <span className={`${mono.className} text-[10px] tracking-[0.2em] uppercase`} style={{ color: FOG }}>{tag}</span>
        <p className={`${display.className} text-white text-xl md:text-2xl font-medium leading-[1.2] mt-2`}>{front}</p>
        <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
          <p className={`${inter.className} text-sm font-light text-white/75 leading-relaxed pt-4`} dangerouslySetInnerHTML={{ __html: back }} />
        </motion.div>
        <span className={`${mono.className} inline-flex items-center gap-1.5 mt-4 text-[10px] uppercase tracking-[0.1em]`} style={{ color: FOG }}>
          {open ? "Collapse" : "Expand"} <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown className="h-3 w-3" /></motion.span>
        </span>
      </div>
    </div>
  );
}

function Purpose({ content }: { content: any }) {
  return (
    <section id="purpose" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24 relative" style={{ background: PANEL }}>
      <GridField opacity={0.35} />
      <Reveal className="relative max-w-5xl mx-auto mb-12 md:mb-16">
        <Kicker tag="00.04">Why we exist</Kicker>
        <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-4`} style={{ color: WHITE }}>Mission and vision, plainly stated.</h2>
      </Reveal>
      <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
        <Reveal><PurposeCard image={PHOTOS.goats} icon={Target} tag="Mission" front="Economic empowerment, through agribusiness." back={content?.mission || "To economically empower individuals through agribusiness that competes internationally."} /></Reveal>
        <Reveal delay={0.08}><PurposeCard image={PHOTOS.hq} icon={Globe} tag="Vision" front="The greatest empowerment platform in Africa." back={content?.vision || "To be the greatest empowerment platform in Africa, and push back poverty with it."} /></Reveal>
      </div>
    </section>
  );
}

// ============================================================
// VALUES — protocol list
// ============================================================
const VALUES = [
  { text: "We walk in faith, guided by kindness, compassion and service.", detail: "Every branch decision starts from how it treats the people it touches, not just the numbers behind it.", icon: Heart },
  { text: "We are honest and transparent in everything we do.", detail: "Our registration, tax status and financials are published, not just claimed.", icon: ShieldCheck },
  { text: "We respect time — punctuality and efficiency matter.", detail: "Members and partners can expect commitments to be kept on the date they're made.", icon: Clock },
  { text: "We believe collaboration is key. Together, we achieve more.", detail: "From the original 21-person group to today's 12 branches, growth has always come through shared effort.", icon: Handshake },
  { text: "We build lasting connections between young Africans and their communities.", detail: "Our programmes are designed to stay rooted in the communities they start in, not extract from them.", icon: Users },
];

function ValueRow({ v, i }: { v: (typeof VALUES)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  const Icon = v.icon;
  return (
    <Reveal delay={i * 0.05}>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left flex items-start gap-5 md:gap-8 py-7 md:py-9" style={{ borderTop: i === 0 ? `1px solid ${LINE_SOFT}` : "none", borderBottom: `1px solid ${LINE_SOFT}` }}>
        <span className={`${mono.className} text-[10px] pt-1.5 shrink-0 w-10`} style={{ color: HARVEST }}>{String(i + 1).padStart(2, "0")}</span>
        <div className="shrink-0 w-10 h-10 flex items-center justify-center" style={{ border: `1px solid ${LINE}`, background: "rgba(0,174,239,0.05)" }}>
          <Icon className="h-4.5 w-4.5" style={{ color: SIGNAL }} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className={`${display.className} text-lg md:text-2xl font-medium leading-snug`} style={{ color: WHITE }}>{v.text}</p>
          <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
            <p className={`${inter.className} text-sm md:text-base font-light pt-3`} style={{ color: FOG }}>{v.detail}</p>
          </motion.div>
        </div>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="shrink-0 mt-1.5"><Plus className="h-4 w-4" style={{ color: open ? HARVEST : FOG }} /></motion.span>
      </button>
    </Reveal>
  );
}

function Values() {
  return (
    <section id="values" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: VOID }}>
      <div className="max-w-4xl mx-auto">
        <Reveal className="mb-4">
          <Kicker tag="00.05">What we believe</Kicker>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-4`} style={{ color: WHITE }}>Five protocols we don't break.</h2>
        </Reveal>
        <div>{VALUES.map((v, i) => <ValueRow key={i} v={v} i={i} />)}</div>
      </div>
    </section>
  );
}

// ============================================================
// TIMELINE — vertical signal trace
// ============================================================
const MILESTONES = [
  { year: "2008", label: "Founded as a village group", desc: "21 members started the journey that would become YPA.", image: PHOTOS.community },
  { year: "2010", label: "Registered as a CBO", desc: "60 members formed the Board of Governors and management structure.", image: PHOTOS.members },
  { year: "2015", label: "Expanded to 5 branches", desc: "Growth from a single office into a regional presence across Uganda.", image: PHOTOS.hq },
  { year: "2020", label: "Launched YPA SACCO", desc: "Formal savings and credit services became available to members.", image: PHOTOS.sacco },
  { year: "2023", label: "Reached 100,000 goats", desc: "A major milestone for the organisation's agribusiness projects.", image: PHOTOS.goats },
  { year: "2025", label: "Opened Dubai & Zambia offices", desc: "The first step toward a genuinely Pan-African footprint.", image: PHOTOS.aerial },
];

function TimelineRow({ m, i }: { m: (typeof MILESTONES)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={i * 0.05}>
      <div className="relative pl-10 md:pl-14 pb-14 md:pb-16 last:pb-0">
        {i < MILESTONES.length - 1 && <span className="absolute left-[7px] md:left-[9px] top-4 bottom-0 w-px" style={{ background: LINE_SOFT }} />}
        <span className="absolute left-0 top-1.5 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center" style={{ border: `1px solid ${SIGNAL}`, background: VOID }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: SIGNAL, boxShadow: `0 0 8px ${SIGNAL}` }} />
        </span>
        <button onClick={() => setOpen((o) => !o)} className="text-left w-full grid md:grid-cols-[0.9fr_1.3fr] gap-5 md:gap-10 items-start">
          <div>
            <div className={`${mono.className} text-3xl md:text-4xl font-medium`} style={{ color: HARVEST }}>{m.year}</div>
            <p className={`${display.className} text-lg md:text-2xl font-medium leading-snug mt-2`} style={{ color: WHITE }}>{m.label}</p>
            <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <p className={`${inter.className} text-sm md:text-base font-light pt-3`} style={{ color: FOG }}>{m.desc}</p>
            </motion.div>
          </div>
          <TelemetryFrame src={m.image} alt="" className="aspect-[16/9] md:aspect-[4/3]" grayscale={0.5} />
        </button>
      </div>
    </Reveal>
  );
}

function Timeline() {
  return (
    <section id="timeline" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24 relative" style={{ background: PANEL }}>
      <GridField opacity={0.3} />
      <Reveal className="relative max-w-5xl mx-auto mb-14">
        <Kicker tag="00.06">Timeline</Kicker>
        <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-4`} style={{ color: WHITE }}>Year by year.</h2>
      </Reveal>
      <div className="relative max-w-5xl mx-auto">{MILESTONES.map((m, i) => <TimelineRow key={i} m={m} i={i} />)}</div>
    </section>
  );
}

// ============================================================
// TRUST — terminal-style records readout
// ============================================================
function Trust() {
  const facts = [
    { k: "Registered name", v: "BREC Youth Empowerment Africa Limited" },
    { k: "URSB registration no.", v: "80034597452632" },
    { k: "Tax ID (TIN)", v: "1036998856" },
    { k: "Established", v: "2008" },
  ];
  const offices = [
    { region: "Uganda — Headquarters", detail: "12 branches nationwide" },
    { region: "Dubai, UAE", detail: "International office" },
    { region: "Zambia", detail: "International office" },
  ];
  return (
    <section id="trust" className="py-24 md:py-32 scroll-mt-24" style={{ background: VOID }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 px-6 md:px-16">
        <Reveal>
          <TelemetryFrame src={PHOTOS.hq} alt="YPA headquarters" className="aspect-[4/5] lg:aspect-auto lg:h-full" caption="HQ — Uganda" grayscale={0.4} />
        </Reveal>
        <div>
          <Reveal>
            <Kicker tag="00.07">Due diligence</Kicker>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-4`} style={{ color: WHITE }}>The paperwork, on record.</h2>
          </Reveal>
          <div className="mt-8" style={{ border: `1px solid ${LINE_SOFT}`, background: "rgba(255,255,255,0.02)" }}>
            {facts.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-baseline justify-between gap-4 px-4 py-4" style={{ borderTop: i === 0 ? "none" : `1px solid ${LINE_SOFT}` }}>
                  <span className={`${mono.className} text-[11px] uppercase tracking-[0.06em]`} style={{ color: FOG }}>{f.k}</span>
                  <span className={`${mono.className} text-sm md:text-base font-medium text-right`} style={{ color: SIGNAL }}>{f.v}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="mt-8">
            <span className={`${mono.className} text-[10px] font-medium uppercase tracking-[0.18em]`} style={{ color: FOG }}>Find us</span>
            <div className="mt-4 space-y-4">
              {offices.map((o, i) => (
                <div key={i} className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: HARVEST }} strokeWidth={1.5} />
                  <div>
                    <div className={`${inter.className} text-sm font-medium`} style={{ color: WHITE }}>{o.region}</div>
                    <div className={`${mono.className} text-[10px] mt-0.5 uppercase tracking-[0.08em]`} style={{ color: FOG }}>{o.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FAQ — console log
// ============================================================
function FAQ({ faqs }: { faqs: any[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24 relative" style={{ background: PANEL }}>
      <GridField opacity={0.3} />
      <div className="relative max-w-3xl mx-auto">
        <Reveal className="mb-12 md:mb-16 text-center flex flex-col items-center">
          <Kicker tag="00.08">FAQ</Kicker>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-4`} style={{ color: WHITE }}>Common queries.</h2>
        </Reveal>
        {faqs.length === 0 ? (
          <p className={`${mono.className} text-center text-xs uppercase tracking-[0.1em]`} style={{ color: FOG }}>No FAQs published yet.</p>
        ) : (
          <div>
            {faqs.map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.04}>
                <div style={{ borderTop: i === 0 ? `1px solid ${LINE_SOFT}` : "none", borderBottom: `1px solid ${LINE_SOFT}` }}>
                  <button onClick={() => setOpen(open === i ? null : i)} className="w-full py-5 md:py-6 flex items-center justify-between gap-4 text-left">
                    <span className="flex items-center gap-3">
                      <span className={`${mono.className} text-[10px]`} style={{ color: open === i ? SIGNAL : FOG }}>Q{String(i + 1).padStart(2, "0")}</span>
                      <span className={`${inter.className} text-base md:text-lg font-medium`} style={{ color: WHITE }}>{faq.question}</span>
                    </span>
                    <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3 }}><Plus className="h-5 w-5 shrink-0" style={{ color: open === i ? HARVEST : FOG }} /></motion.span>
                  </button>
                  {open === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.25 }} className="pb-6 md:pb-7 pl-9">
                      <div className={`${inter.className} text-sm md:text-base font-light leading-relaxed`} style={{ color: FOG }} dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </motion.div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// CLOSE — signal sign-off
// ============================================================
function Close() {
  return (
    <section className="relative h-[70vh] min-h-[440px] overflow-hidden" style={{ background: VOID }}>
      <img src={PHOTOS.aerial} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "grayscale(0.6) brightness(0.22) contrast(1.1)" }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,174,239,0.14), transparent 65%)`, mixBlendMode: "screen" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,6,8,0.55) 0%, rgba(5,6,8,0.92) 100%)" }} />
      <GridField opacity={0.4} />
      <ScanSweep />
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-16 text-center">
        <Reveal>
          <div className={`${mono.className} text-[10px] tracking-[0.2em] uppercase mb-6`} style={{ color: SIGNAL }}>End of transmission</div>
          <h2 className={`${display.className} text-white text-3xl md:text-5xl font-medium tracking-tight max-w-2xl mx-auto`}>Now you know who we are.</h2>
          <p className={`${inter.className} mt-4 font-light max-w-md mx-auto`} style={{ color: FOG }}>Join Africa's leading youth agribusiness platform, or ask us anything else.</p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <MorphButton href="/contact" idleText="Get in touch" revealText="Let's talk" />
            <MorphButton href="/sacco" idleText="See YPA SACCO" revealText="Explore →" variant="outline" icon={ChevronRight} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// PAGE
// ============================================================
export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, f] = await Promise.all([getAboutContent(), getFAQs()]);
      setContent(a);
      setFaqs(f);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen`} style={{ background: VOID }}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 rounded-full" style={{ borderColor: LINE_SOFT, borderTopColor: SIGNAL }} />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen overflow-x-hidden font-sans`} style={{ background: VOID }}>
      <Navigation />
      <SectionNav />
      <Hero />
      <FoundingQuote />
      <Story content={content} />
      <PhotoInterlude />
      <Scale />
      <Leadership />
      <Purpose content={content} />
      <Values />
      <Timeline />
      <Trust />
      <FAQ faqs={faqs} />
      <Close />
      <Footer />
    </main>
  );
}