"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion, useInView, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, Target, Globe, Users, Clock, Heart, Handshake, MapPin, ShieldCheck, Plus, Quote } from "lucide-react";

// ============================================================
// FONTS
// ============================================================
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter" });

// ============================================================
// TOKENS — same brand colors, softer execution
// ============================================================
const SIGNAL = "#00AEEF";
const HARVEST = "#F0B429";
const VOID = "#07080B";
const PANEL = "#0B0E13";
const LINE_SOFT = "rgba(255,255,255,0.08)";
const GLOW_BLUE = "rgba(0,174,239,0.14)";
const GLOW_GOLD = "rgba(240,180,41,0.12)";
const FOG = "rgba(245,246,247,0.6)";
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
// PHOTOGRAPHY
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  return (
    <motion.div ref={ref} initial={reduce ? {} : { opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : reduce ? {} : { opacity: 0, y: 18 }} transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: SIGNAL, boxShadow: `0 0 8px ${SIGNAL}` }} />
      <span className={`${mono.className} text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em]`} style={{ color: FOG }}>{children}</span>
    </div>
  );
}

// Soft ambient glow field — replaces the dot-grid; reads as depth, not tech
function GlowField({ variant = "blue" }: { variant?: "blue" | "gold" | "mixed" }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {(variant === "blue" || variant === "mixed") && (
        <div className="absolute -top-1/4 left-[10%] w-[50%] h-[60%] rounded-full blur-[110px]" style={{ background: GLOW_BLUE }} />
      )}
      {(variant === "gold" || variant === "mixed") && (
        <div className="absolute -bottom-1/4 right-[8%] w-[45%] h-[55%] rounded-full blur-[110px]" style={{ background: GLOW_GOLD }} />
      )}
    </div>
  );
}

// Photo treatment — rounded, soft-bordered, gentle caption. No brackets, no scanlines.
function Frame({
  src,
  alt,
  caption,
  className = "",
  imgClassName = "w-full h-full object-cover",
  grayscale = 0.15,
  rounded = "rounded-2xl md:rounded-3xl",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  grayscale?: number;
  rounded?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`} style={{ background: PANEL, border: `1px solid ${LINE_SOFT}` }}>
      <img src={src} alt={alt} className={imgClassName} style={{ filter: `grayscale(${grayscale}) contrast(1.03)` }} loading="lazy" />
      {caption && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(180deg, transparent, rgba(5,6,8,0.75))" }} />
          <span className={`${mono.className} absolute bottom-3 left-4 right-4 text-[9px] tracking-[0.12em] uppercase truncate`} style={{ color: "rgba(245,246,247,0.8)" }}>
            {caption}
          </span>
        </>
      )}
    </div>
  );
}

function HudBadge({ label = "Youth Platform Africa · Est. 2008" }: { label?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? {} : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="inline-flex items-center gap-2.5 rounded-full pl-2.5 pr-4 py-1.5 w-fit" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${LINE_SOFT}`, backdropFilter: "blur(8px)" }}>
      <span className="relative flex h-5 w-5 items-center justify-center rounded-full shrink-0" style={{ background: SIGNAL }}>
        <motion.span className="absolute inset-0 rounded-full" style={{ background: SIGNAL }} animate={reduce ? {} : { scale: [1, 1.7], opacity: [0.5, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} />
      </span>
      <span className={`${inter.className} text-[11px] sm:text-xs tracking-wide font-medium whitespace-nowrap`} style={{ color: WHITE }}>{label}</span>
    </motion.div>
  );
}

function MorphButton({ href, idleText, revealText, variant = "solid", icon: Icon = ArrowUpRight }: { href: string; idleText: string; revealText: string; variant?: "solid" | "outline"; icon?: any }) {
  const [hover, setHover] = useState(false);
  const solid = variant === "solid";
  return (
    <Link href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      <motion.div
        className={`${inter.className} relative overflow-hidden inline-flex items-center h-12 rounded-full text-sm font-medium cursor-pointer select-none`}
        style={solid ? { background: SIGNAL, color: VOID } : { border: `1px solid rgba(240,180,41,0.45)`, color: WHITE }}
        animate={{ paddingLeft: 24, paddingRight: hover ? 20 : 24, boxShadow: solid && hover ? `0 0 28px ${SIGNAL}55` : "0 0 0px transparent" }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <span className="relative h-5 overflow-hidden">
          <motion.span className="block" animate={{ y: hover ? -20 : 0 }} transition={{ duration: 0.35, ease: EASE }}>{idleText}</motion.span>
          <motion.span className="block absolute top-0 left-0 whitespace-nowrap" animate={{ y: hover ? 0 : 20 }} transition={{ duration: 0.35, ease: EASE }}>{revealText}</motion.span>
        </span>
        <motion.span className="ml-2 flex items-center" animate={{ rotate: hover ? 45 : 0 }} transition={{ duration: 0.35 }}><Icon className="h-4 w-4" style={!solid ? { color: HARVEST } : {}} /></motion.span>
      </motion.div>
    </Link>
  );
}

// ============================================================
// SectionNav
// ============================================================
const SECTIONS = [
  { id: "story", label: "Story" },
  { id: "welcome", label: "Welcome" },
  { id: "people", label: "People" },
  { id: "purpose", label: "Purpose" },
  { id: "values", label: "Values" },
  { id: "timeline", label: "Timeline" },
  { id: "voices", label: "Voices" },
  { id: "trust", label: "Trust" },
  { id: "faq", label: "FAQ" },
];

function SectionNav() {
  const [active, setActive] = useState("story");
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
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="hidden lg:flex fixed top-20 left-1/2 -translate-x-1/2 z-40 items-center gap-0.5 p-1 rounded-full" style={{ background: "rgba(7,8,11,0.85)", backdropFilter: "blur(16px)", border: `1px solid ${LINE_SOFT}`, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => jump(s.id)} className={`${inter.className} relative px-3.5 py-2 text-[11px] font-medium rounded-full transition-colors`} style={{ color: active === s.id ? VOID : "rgba(255,255,255,0.55)" }}>
              {active === s.id && <motion.span layoutId="navpill" className="absolute inset-0 rounded-full" style={{ background: SIGNAL }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative z-10">{s.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const reduce = useReducedMotion();
  return (
    <section id="hero" ref={ref} className="relative h-[92vh] min-h-[560px] overflow-hidden" style={{ background: VOID }}>
      <motion.div style={reduce ? {} : { y }} className="absolute inset-0">
        <img src={PHOTOS.hero} alt="" className="w-full h-full object-cover scale-110" style={{ filter: "brightness(0.5) contrast(1.05)" }} />
      </motion.div>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 25% 30%, rgba(0,174,239,0.16), transparent 60%)` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,8,11,0.25) 0%, rgba(7,8,11,0.92) 100%)" }} />

      <div className="relative z-10 h-full flex flex-col">
        <div className="pt-24 md:pt-32 px-5 sm:px-8 md:px-16">
          <Reveal><HudBadge /></Reveal>
        </div>
        <motion.div style={reduce ? {} : { opacity }} className="flex-1 flex flex-col justify-end px-5 sm:px-8 md:px-16 pb-14 md:pb-24">
          <Reveal>
            <h1 className={`${display.className} text-white font-medium leading-[0.98] tracking-tight text-[12vw] sm:text-6xl md:text-7xl lg:text-[5.5rem] max-w-4xl`}>
              21 people.
              <br />
              <span style={{ color: SIGNAL }}>One idea that grew.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-7 md:mt-8 flex flex-wrap items-end gap-5 md:gap-6">
              <MorphButton href="#story" idleText="Read our story" revealText="Scroll down" icon={ChevronDown} />
              <span className={`${inter.className} text-sm font-light max-w-xs leading-relaxed`} style={{ color: FOG }}>A Pan-African agribusiness platform, from a village group to 12 branches and counting.</span>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// STORY
// ============================================================
function Story({ content }: { content: any }) {
  return (
    <section id="story" className="py-16 md:py-28 px-5 sm:px-8 md:px-16 scroll-mt-24 relative" style={{ background: VOID }}>
      <GlowField variant="blue" />
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1fr_0.85fr] gap-10 lg:gap-16 items-center">
        <div>
          <Reveal><Kicker>Founded 2008</Kicker></Reveal>
          <Reveal delay={0.05}>
            <h2 className={`${display.className} text-2xl sm:text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight mt-4`} style={{ color: WHITE }}>
              From a village group to a Pan-African platform.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={`${inter.className} mt-5 text-[15px] md:text-lg font-light leading-relaxed`} style={{ color: FOG }}>
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
          <Reveal delay={0.16}>
            <div className="mt-8 grid grid-cols-3 gap-4 md:gap-6 pt-6" style={{ borderTop: `1px solid ${LINE_SOFT}` }}>
              {[["2008", "Founded"], ["12", "Branches"], ["3", "Countries"]].map(([v, l]) => (
                <div key={l}>
                  <div className={`${display.className} text-xl md:text-3xl font-medium`} style={{ color: WHITE }}>{v}</div>
                  <div className={`${inter.className} text-xs mt-1 font-medium`} style={{ color: FOG }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <Frame src={PHOTOS.farm} alt="A YPA farm in Uganda" className="aspect-[4/5] md:aspect-[3/4]" grayscale={0.1} />
          <div className="absolute -bottom-5 -left-5 md:-left-8 w-28 md:w-36">
            <Frame src={PHOTOS.goats} alt="Goats under YPA's care" className="aspect-square shadow-2xl" grayscale={0.1} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// WELCOME — a personal note, the human "about us" moment
// ============================================================
function Welcome() {
  return (
    <section id="welcome" className="py-16 md:py-28 px-5 sm:px-8 md:px-16 scroll-mt-24" style={{ background: PANEL }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-8 md:gap-14 items-center">
        <Reveal>
          <div className="relative max-w-xs mx-auto md:mx-0">
            <Frame src={PHOTOS.leader1} alt="Obed Ben, Managing Director" className="aspect-[4/5]" grayscale={0.1} />
            <div className="absolute -bottom-4 -right-4 rounded-full px-4 py-2" style={{ background: SIGNAL }}>
              <span className={`${inter.className} text-xs font-semibold`} style={{ color: VOID }}>Managing Director</span>
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal><Kicker>A note from our founders</Kicker></Reveal>
          <Reveal delay={0.06}>
            <Quote className="h-7 w-7 mt-4 mb-3" style={{ color: HARVEST }} strokeWidth={1.5} />
            <p className={`${display.className} text-xl sm:text-2xl md:text-3xl font-medium leading-[1.35] tracking-tight`} style={{ color: WHITE }}>
              "We've watched twenty-one people become a movement. Every branch we open, every member who joins, carries the same reason we started — dignity, through honest work."
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-6">
              <div className={`${inter.className} text-sm font-semibold`} style={{ color: WHITE }}>Obed Ben</div>
              <div className={`${inter.className} text-xs mt-0.5`} style={{ color: FOG }}>Managing Director, Youth Platform Africa</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SCALE
// ============================================================
function useCountUp(target: number, active: boolean, duration = 1500) {
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

function ScaleNumber({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const n = useCountUp(target, inView);
  return (
    <div ref={ref} className="text-center px-4 py-6">
      <div className={`${display.className} font-medium tracking-tight text-white text-[13vw] sm:text-6xl md:text-7xl`}>
        {n.toLocaleString()}<span style={{ color: HARVEST }}>{suffix}</span>
      </div>
      <div className={`${inter.className} mt-2.5 text-sm md:text-base font-light`} style={{ color: FOG }}>{label}</div>
    </div>
  );
}

function Scale() {
  return (
    <section className="relative py-20 md:py-32 px-5 sm:px-8 md:px-16 overflow-hidden" style={{ background: VOID }}>
      <img src={PHOTOS.maize} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.2) contrast(1.05)" }} />
      <GlowField variant="mixed" />
      <div className="relative max-w-5xl mx-auto text-center mb-10 md:mb-16">
        <Reveal className="flex justify-center"><Kicker>What we've built</Kicker></Reveal>
        <Reveal delay={0.08}><h2 className={`${display.className} text-white text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight mt-3`}>The numbers, plainly.</h2></Reveal>
      </div>
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: LINE_SOFT }}>
        <ScaleNumber target={130000} suffix="+" label="Goats under care" />
        <ScaleNumber target={12} suffix="" label="Branches, nationwide" />
        <ScaleNumber target={1000} suffix="+" label="Members empowered" />
      </div>
    </section>
  );
}

// ============================================================
// LEADERSHIP
// ============================================================
interface Leader { role: string; name: string; bio: string; image: string }
const LEADERSHIP_PREVIEW: Leader[] = [
  { role: "Managing Director", name: "Obed Ben", bio: "Leads YPA's agribusiness strategy and community development work, shaping how the organisation grows branch by branch.", image: PHOTOS.leader1 },
  { role: "Executive Director", name: "JB Magezi", bio: "Drives YPA's expansion across Africa and its financial-inclusion programmes, including the SACCO's growth to 12 branches.", image: PHOTOS.leader2 },
  { role: "General Manager", name: "Charles Kalemera", bio: "Oversees day-to-day operations across all branches, keeping the goats, maize, and SACCO programmes running in sync.", image: PHOTOS.leader3 },
  { role: "Founding Member", name: "Name pending", bio: "Role summary and credentials to be added.", image: PHOTOS.leader4 },
];

function Leadership() {
  return (
    <section id="people" className="py-16 md:py-28 px-5 sm:px-8 md:px-16 scroll-mt-24" style={{ background: PANEL }}>
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <Kicker>Governance</Kicker>
            <h2 className={`${display.className} text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: WHITE }}>Led by real people.</h2>
          </div>
          <MorphButton href="/team" idleText="Meet the full team" revealText="View all →" variant="outline" />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {LEADERSHIP_PREVIEW.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.06}>
              <div className="group">
                <Frame src={l.image} alt={l.name} className="aspect-[4/5]" grayscale={l.name === "Name pending" ? 0.8 : 0.1} />
                <h3 className={`${inter.className} text-sm md:text-base font-semibold mt-3`} style={{ color: l.name === "Name pending" ? FOG : WHITE }}>{l.name}</h3>
                <div className={`${inter.className} text-xs mt-0.5`} style={{ color: SIGNAL }}>{l.role}</div>
                <p className={`${inter.className} text-xs md:text-sm mt-2 font-light leading-relaxed hidden sm:block`} style={{ color: FOG }}>{l.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PURPOSE
// ============================================================
function PurposeCard({ image, icon: Icon, label, front, back }: { image: string; icon: any; label: string; front: string; back: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative aspect-[5/4] sm:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group" onClick={() => setOpen((o) => !o)} style={{ border: `1px solid ${LINE_SOFT}` }}>
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: "brightness(0.45) contrast(1.05)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,8,11,0.1) 0%, rgba(7,8,11,0.88) 100%)" }} />
      <div className="relative h-full flex flex-col justify-end p-5 md:p-8">
        <Icon className="h-6 w-6 mb-3 md:mb-4" style={{ color: HARVEST }} strokeWidth={1.5} />
        <span className={`${mono.className} text-[10px] tracking-[0.2em] uppercase`} style={{ color: FOG }}>{label}</span>
        <p className={`${display.className} text-white text-lg md:text-2xl font-medium leading-[1.25] mt-2`}>{front}</p>
        <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
          <p className={`${inter.className} text-sm font-light text-white/75 leading-relaxed pt-4`} dangerouslySetInnerHTML={{ __html: back }} />
        </motion.div>
        <span className={`${inter.className} inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-white/55`}>
          {open ? "Show less" : "Read more"} <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown className="h-3.5 w-3.5" /></motion.span>
        </span>
      </div>
    </div>
  );
}

function Purpose({ content }: { content: any }) {
  return (
    <section id="purpose" className="py-16 md:py-28 px-5 sm:px-8 md:px-16 scroll-mt-24" style={{ background: VOID }}>
      <Reveal className="max-w-5xl mx-auto mb-8 md:mb-14">
        <Kicker>Why we exist</Kicker>
        <h2 className={`${display.className} text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: WHITE }}>Mission and vision, plainly stated.</h2>
      </Reveal>
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-4 md:gap-6">
        <Reveal><PurposeCard image={PHOTOS.goats} icon={Target} label="Mission" front="Economic empowerment, through agribusiness." back={content?.mission || "To economically empower individuals through agribusiness that competes internationally."} /></Reveal>
        <Reveal delay={0.08}><PurposeCard image={PHOTOS.hq} icon={Globe} label="Vision" front="The greatest empowerment platform in Africa." back={content?.vision || "To be the greatest empowerment platform in Africa, and push back poverty with it."} /></Reveal>
      </div>
    </section>
  );
}

// ============================================================
// VALUES
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
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left flex items-start gap-4 md:gap-6 py-6 md:py-8" style={{ borderTop: i === 0 ? `1px solid ${LINE_SOFT}` : "none", borderBottom: `1px solid ${LINE_SOFT}` }}>
        <div className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,174,239,0.08)" }}>
          <Icon className="h-4.5 w-4.5 md:h-5 md:w-5" style={{ color: SIGNAL }} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className={`${display.className} text-base sm:text-lg md:text-2xl font-medium leading-snug`} style={{ color: WHITE }}>{v.text}</p>
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
    <section id="values" className="py-16 md:py-28 px-5 sm:px-8 md:px-16 scroll-mt-24" style={{ background: PANEL }}>
      <div className="max-w-4xl mx-auto">
        <Reveal className="mb-4">
          <Kicker>What we believe</Kicker>
          <h2 className={`${display.className} text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: WHITE }}>Five things we don't compromise on.</h2>
        </Reveal>
        <div>{VALUES.map((v, i) => <ValueRow key={i} v={v} i={i} />)}</div>
      </div>
    </section>
  );
}

// ============================================================
// TIMELINE
// ============================================================
const MILESTONES = [
  { year: "2008", label: "Founded as a village group", desc: "21 members started the journey that would become YPA." },
  { year: "2010", label: "Registered as a CBO", desc: "60 members formed the Board of Governors and management structure." },
  { year: "2015", label: "Expanded to 5 branches", desc: "Growth from a single office into a regional presence across Uganda." },
  { year: "2020", label: "Launched YPA SACCO", desc: "Formal savings and credit services became available to members." },
  { year: "2023", label: "Reached 100,000 goats", desc: "A major milestone for the organisation's agribusiness projects." },
  { year: "2025", label: "Opened Dubai & Zambia offices", desc: "The first step toward a genuinely Pan-African footprint." },
];

function Timeline() {
  return (
    <section id="timeline" className="py-16 md:py-28 px-5 sm:px-8 md:px-16 scroll-mt-24" style={{ background: VOID }}>
      <Reveal className="max-w-4xl mx-auto mb-10 md:mb-14">
        <Kicker>Timeline</Kicker>
        <h2 className={`${display.className} text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: WHITE }}>Year by year.</h2>
      </Reveal>
      <div className="max-w-4xl mx-auto">
        {MILESTONES.map((m, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <div className="relative pl-8 md:pl-12 pb-10 md:pb-12 last:pb-0">
              {i < MILESTONES.length - 1 && <span className="absolute left-[5px] md:left-[7px] top-4 bottom-0 w-px" style={{ background: LINE_SOFT }} />}
              <span className="absolute left-0 top-1.5 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full" style={{ background: SIGNAL, boxShadow: `0 0 10px ${SIGNAL}` }} />
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className={`${display.className} text-xl md:text-2xl font-medium`} style={{ color: HARVEST }}>{m.year}</span>
                <p className={`${display.className} text-base sm:text-lg md:text-xl font-medium leading-snug`} style={{ color: WHITE }}>{m.label}</p>
              </div>
              <p className={`${inter.className} text-sm md:text-base font-light mt-2 max-w-lg`} style={{ color: FOG }}>{m.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// VOICES — testimonials, the trust-building "why believe us" layer
// ============================================================
const VOICES = [
  { quote: "YPA didn't just lend me goats, they walked with me until I understood the business. Three years later I run my own herd.", name: "A YPA member", role: "Goat Rearing Programme, Central Region", image: PHOTOS.community },
  { quote: "The SACCO gave my savings group a place to grow money safely for the first time. That trust is everything out here.", name: "A YPA member", role: "SACCO Savings Group", image: PHOTOS.members },
  { quote: "What struck me was how organised the branch was — records, receipts, real accountability. It didn't feel like charity.", name: "A community partner", role: "Central Region", image: PHOTOS.sacco },
];

function VoiceCard({ v, i }: { v: (typeof VOICES)[number]; i: number }) {
  return (
    <Reveal delay={i * 0.08}>
      <div className="rounded-2xl md:rounded-3xl p-6 md:p-8 h-full flex flex-col" style={{ background: PANEL, border: `1px solid ${LINE_SOFT}` }}>
        <Quote className="h-6 w-6 mb-4" style={{ color: HARVEST }} strokeWidth={1.5} />
        <p className={`${inter.className} text-sm md:text-base font-light leading-relaxed flex-1`} style={{ color: "rgba(245,246,247,0.85)" }}>"{v.quote}"</p>
        <div className="flex items-center gap-3 mt-6">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ border: `1px solid ${LINE_SOFT}` }}>
            <img src={v.image} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className={`${inter.className} text-xs font-semibold`} style={{ color: WHITE }}>{v.name}</div>
            <div className={`${inter.className} text-[11px] mt-0.5`} style={{ color: FOG }}>{v.role}</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Voices() {
  return (
    <section id="voices" className="py-16 md:py-28 px-5 sm:px-8 md:px-16 scroll-mt-24" style={{ background: PANEL }}>
      <Reveal className="max-w-5xl mx-auto mb-8 md:mb-14 text-center">
        <div className="flex justify-center"><Kicker>In their words</Kicker></div>
        <h2 className={`${display.className} text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: WHITE }}>Voices from our community.</h2>
      </Reveal>
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {VOICES.map((v, i) => <VoiceCard key={i} v={v} i={i} />)}
      </div>
    </section>
  );
}

// ============================================================
// TRUST
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
    <section id="trust" className="py-16 md:py-28 px-5 sm:px-8 md:px-16 scroll-mt-24" style={{ background: VOID }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <Reveal>
          <Frame src={PHOTOS.hq} alt="YPA headquarters" className="aspect-[16/10] lg:aspect-[4/5]" grayscale={0.1} />
        </Reveal>
        <div>
          <Reveal>
            <Kicker>Due diligence</Kicker>
            <h2 className={`${display.className} text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: WHITE }}>The paperwork, on record.</h2>
          </Reveal>
          <div className="mt-6 md:mt-8">
            {facts.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-baseline justify-between gap-4 py-3.5" style={{ borderTop: i === 0 ? `1px solid ${LINE_SOFT}` : "none", borderBottom: `1px solid ${LINE_SOFT}` }}>
                  <span className={`${inter.className} text-sm`} style={{ color: FOG }}>{f.k}</span>
                  <span className={`${inter.className} text-sm md:text-base font-medium text-right`} style={{ color: WHITE }}>{f.v}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="mt-8">
            <span className={`${inter.className} text-xs font-medium uppercase tracking-[0.18em]`} style={{ color: FOG }}>Find us</span>
            <div className="mt-4 space-y-4">
              {offices.map((o, i) => (
                <div key={i} className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: HARVEST }} strokeWidth={1.5} />
                  <div>
                    <div className={`${inter.className} text-sm font-medium`} style={{ color: WHITE }}>{o.region}</div>
                    <div className={`${inter.className} text-xs mt-0.5`} style={{ color: FOG }}>{o.detail}</div>
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
// FAQ
// ============================================================
function FAQ({ faqs }: { faqs: any[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-16 md:py-28 px-5 sm:px-8 md:px-16 scroll-mt-24" style={{ background: PANEL }}>
      <div className="max-w-3xl mx-auto">
        <Reveal className="mb-8 md:mb-14 text-center flex flex-col items-center">
          <Kicker>FAQ</Kicker>
          <h2 className={`${display.className} text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: WHITE }}>Common questions.</h2>
        </Reveal>
        {faqs.length === 0 ? (
          <p className={`${inter.className} text-center text-sm`} style={{ color: FOG }}>No FAQs published yet.</p>
        ) : (
          <div>
            {faqs.map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.04}>
                <div style={{ borderTop: i === 0 ? `1px solid ${LINE_SOFT}` : "none", borderBottom: `1px solid ${LINE_SOFT}` }}>
                  <button onClick={() => setOpen(open === i ? null : i)} className="w-full py-4 md:py-6 flex items-center justify-between gap-4 text-left">
                    <span className={`${inter.className} text-[15px] md:text-lg font-medium`} style={{ color: WHITE }}>{faq.question}</span>
                    <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3 }}><Plus className="h-5 w-5 shrink-0" style={{ color: open === i ? HARVEST : FOG }} /></motion.span>
                  </button>
                  {open === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.25 }} className="pb-5 md:pb-7">
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
// CLOSE
// ============================================================
function Close() {
  return (
    <section className="relative py-24 md:py-36 px-5 sm:px-8 md:px-16 overflow-hidden" style={{ background: VOID }}>
      <img src={PHOTOS.aerial} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.28) contrast(1.05)" }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, rgba(0,174,239,0.12), transparent 65%)` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,8,11,0.55) 0%, rgba(7,8,11,0.9) 100%)" }} />
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <Reveal>
          <div className="h-px w-10 mx-auto mb-7" style={{ background: HARVEST }} />
          <h2 className={`${display.className} text-white text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight max-w-2xl mx-auto`}>Now you know who we are.</h2>
          <p className={`${inter.className} mt-4 font-light max-w-md mx-auto text-sm md:text-base`} style={{ color: FOG }}>Join Africa's leading youth agribusiness platform, or ask us anything else.</p>
          <div className="mt-9 flex flex-wrap gap-3 justify-center">
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
      <Story content={content} />
      <Welcome />
      <Scale />
      <Leadership />
      <Purpose content={content} />
      <Values />
      <Timeline />
      <Voices />
      <Trust />
      <FAQ faqs={faqs} />
      <Close />
      <Footer />
    </main>
  );
}