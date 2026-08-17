"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Alegreya, Inter } from "next/font/google";
import { motion, useInView, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, Target, Globe, Users, Clock, Heart, Handshake, MapPin, FileText, ShieldCheck, Plus, Award } from "lucide-react";

// ============================================================
// FONTS — display, editorial serif for pull quotes, body, mono for data
// ============================================================
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const serif = Alegreya({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-serif" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter" });

// ============================================================
// TOKENS
// ============================================================
const YPA_BLUE = "#00AEEF";
const GOLD = "#F0B429";
const VOID = "#0A0A0B";
const PAPER = "#FFFFFF";
const CLOUD = "#F5F6F7";
const STONE = "#68707A";
const HAIRLINE = "#E7E9EC";
const INK = "#111111";
const EASE = [0.22, 1, 0.36, 1] as const;

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
// REAL PHOTOGRAPHY — reused across the page, not decoration
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
    <motion.div ref={ref} initial={reduce ? {} : { opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : reduce ? {} : { opacity: 0, y: 24 }} transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

function Kicker({ index, children, light = false }: { index?: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {index && <><span className={`${mono.className} text-[10px]`} style={{ color: GOLD }}>{index}</span><span className="h-px w-5" style={{ background: "rgba(240,180,41,0.4)" }} /></>}
      <span className={`${inter.className} text-[11px] md:text-xs font-medium uppercase tracking-[0.2em]`} style={{ color: light ? "rgba(245,246,247,0.5)" : YPA_BLUE }}>{children}</span>
    </div>
  );
}

function GrainOverlay() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay opacity-[0.3]" aria-hidden="true">
      <filter id="ypaGrain3"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.04 0" /></filter>
      <rect width="100%" height="100%" filter="url(#ypaGrain3)" />
    </svg>
  );
}

function GlowSeal({ label = "Youth Platform Africa · Est. 2008" }: { label?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? {} : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="inline-flex items-center gap-2.5 rounded-full pl-2 pr-4 py-1.5 w-fit" style={{ background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.32)" }}>
      <motion.span className="flex h-6 w-6 items-center justify-center rounded-full shrink-0" style={{ background: GOLD }} animate={reduce ? {} : { boxShadow: [`0 0 0px ${GOLD}00`, `0 0 14px ${GOLD}90, 0 0 28px ${GOLD}40`, `0 0 0px ${GOLD}00`] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
        <Award className="h-3.5 w-3.5" style={{ color: VOID }} />
      </motion.span>
      <span className={`${mono.className} text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-medium whitespace-nowrap`} style={{ color: GOLD }}>{label}</span>
    </motion.div>
  );
}

function MorphButton({ href, idleText, revealText, variant = "solid", icon: Icon = ArrowUpRight }: { href: string; idleText: string; revealText: string; variant?: "solid" | "outline"; icon?: any }) {
  const [hover, setHover] = useState(false);
  const solid = variant === "solid";
  return (
    <Link href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      <motion.div className={`${inter.className} relative overflow-hidden inline-flex items-center h-12 rounded-full text-sm font-medium cursor-pointer select-none`} style={solid ? { background: YPA_BLUE, color: VOID } : { border: "1px solid rgba(240,180,41,0.45)", color: "inherit" }} animate={{ paddingLeft: 24, paddingRight: hover ? 20 : 24, boxShadow: solid && hover ? `0 0 24px ${YPA_BLUE}55` : "0 0 0px transparent" }} transition={{ duration: 0.4, ease: EASE }}>
        <span className="relative h-5 overflow-hidden">
          <motion.span className="block" animate={{ y: hover ? -20 : 0 }} transition={{ duration: 0.35, ease: EASE }}>{idleText}</motion.span>
          <motion.span className="block absolute top-0 left-0 whitespace-nowrap" animate={{ y: hover ? 0 : 20 }} transition={{ duration: 0.35, ease: EASE }}>{revealText}</motion.span>
        </span>
        <motion.span className="ml-2 flex items-center" animate={{ rotate: hover ? 45 : 0 }} transition={{ duration: 0.35 }}><Icon className="h-4 w-4" style={!solid ? { color: GOLD } : {}} /></motion.span>
      </motion.div>
    </Link>
  );
}

// ============================================================
// SectionNav
// ============================================================
const SECTIONS = [
  { id: "quote", label: "Founding" },
  { id: "story", label: "Story" },
  { id: "people", label: "People" },
  { id: "purpose", label: "Purpose" },
  { id: "values", label: "Values" },
  { id: "timeline", label: "Timeline" },
  { id: "trust", label: "Trust" },
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
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="hidden md:flex fixed top-20 left-1/2 -translate-x-1/2 z-40 items-center gap-0.5 p-1 rounded-full" style={{ background: "rgba(10,10,11,0.85)", backdropFilter: "blur(14px)", border: "1px solid rgba(240,180,41,0.18)", boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 24px ${YPA_BLUE}12` }}>
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => jump(s.id)} className={`${mono.className} relative px-3.5 py-2 text-[10px] tracking-[0.1em] uppercase font-medium rounded-full transition-colors`} style={{ color: active === s.id ? VOID : "rgba(255,255,255,0.55)" }}>
              {active === s.id && <motion.span layoutId="navpill2" className="absolute inset-0 rounded-full" style={{ background: YPA_BLUE, boxShadow: `0 0 16px ${YPA_BLUE}70` }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative z-10">{s.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// HERO — cinematic, magazine cover-line
// ============================================================
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const reduce = useReducedMotion();
  return (
    <section id="hero" ref={ref} className="relative h-[96vh] min-h-[600px] overflow-hidden" style={{ background: VOID }}>
      <motion.div style={reduce ? {} : { y }} className="absolute inset-0">
        <img src={PHOTOS.hero} alt="" className="w-full h-full object-cover scale-110" style={{ filter: "grayscale(0.4) brightness(0.42) contrast(1.08)" }} />
      </motion.div>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 40%, ${YPA_BLUE}18, transparent 70%)`, mixBlendMode: "color" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.1) 0%, rgba(10,10,11,0.85) 100%)" }} />
      <GrainOverlay />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex items-start justify-between px-6 md:px-16 pt-28 md:pt-32">
          <Reveal><GlowSeal /></Reveal>
          <Reveal delay={0.1} className="hidden sm:block text-right">
            <span className={`${mono.className} text-[10px] tracking-[0.25em] uppercase text-white/40`}>Vol. 01 — The Origin Story</span>
          </Reveal>
        </div>
        <motion.div style={reduce ? {} : { opacity }} className="px-6 md:px-16 pb-16 md:pb-24">
          <Reveal>
            <h1 className={`${display.className} text-white font-medium leading-[0.92] tracking-tight text-[14vw] sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl`}>
              21 people.
              <br />
              <span className={`${serif.className} italic`} style={{ color: "#F5F6F7" }}>One idea that grew.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-end gap-6">
              <MorphButton href="#story" idleText="Read the story" revealText="Scroll down" icon={ChevronDown} />
              <span className={`${inter.className} text-sm font-light text-white/50 max-w-xs`}>A Pan-African agribusiness platform, told the way it happened — not as a pitch deck.</span>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// FOUNDING QUOTE — full-bleed pull quote, magazine chapter-opener
// ============================================================
function FoundingQuote() {
  return (
    <section id="quote" className="relative h-[70vh] min-h-[440px] overflow-hidden scroll-mt-24" style={{ background: VOID }}>
      <img src={PHOTOS.community} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "grayscale(0.55) brightness(0.4)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.5) 0%, rgba(10,10,11,0.75) 100%)" }} />
      <div className="relative z-10 h-full flex items-center justify-center px-6 md:px-16 text-center">
        <Reveal className="max-w-3xl">
          <p className={`${serif.className} italic text-white text-2xl sm:text-3xl md:text-5xl leading-[1.25] tracking-tight`}>
            &ldquo;We didn't set out to build a company. We set out to solve a problem for the people around us.&rdquo;
          </p>
          <span className={`${mono.className} block mt-6 text-[10px] tracking-[0.2em] uppercase text-white/40`}>YPA, founding group — 2008</span>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// STORY — magazine two-column, drop cap, asymmetric photo grid
// ============================================================
function Story({ content }: { content: any }) {
  return (
    <section id="story" className="py-24 md:py-36 px-6 md:px-16 scroll-mt-24" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-16 items-start">
        <div>
          <Reveal><Kicker index="01">Founded 2008</Kicker></Reveal>
          <Reveal delay={0.05}>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium leading-[1.05] tracking-tight mt-4`} style={{ color: INK }}>
              From a village group to a Pan-African platform.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={`${inter.className} mt-6 text-base md:text-lg font-light leading-relaxed`} style={{ color: "#3C4650" }}>
              {content?.story ? (
                <div dangerouslySetInnerHTML={{ __html: content.story }} />
              ) : (
                <>
                  <p>
                    <span className={`${serif.className} float-left text-6xl md:text-7xl leading-[0.8] pr-3 pt-1`} style={{ color: INK }}>Y</span>
                    outh Platform Africa began in 2008 as a village group of 21 people. By 2010 it had grown into a Community Based Organisation with 60 members, who formed the Board of Governors and management that still guide the organisation today.
                  </p>
                  <p className="mt-4">
                    As the work grew into international trade, we registered formally as BREC Youth Empowerment Africa Limited. Today YPA runs agribusiness and financial-inclusion programmes across 12 branches in Uganda, with international offices in Dubai and Zambia.
                  </p>
                </>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
              {[["2008", "Founded"], ["12", "Branches"], ["3", "Countries"]].map(([v, l]) => (
                <div key={l}>
                  <div className={`${mono.className} text-2xl md:text-3xl font-medium`} style={{ color: INK }}>{v}</div>
                  <div className={`${inter.className} text-xs mt-1 font-medium`} style={{ color: STONE }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* asymmetric photo grid — tall hero image + offset caption card */}
        <Reveal delay={0.1} className="relative">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden">
            <img src={PHOTOS.farm} alt="A YPA farm in Uganda" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 md:-left-10 w-32 md:w-40 aspect-square rounded-xl overflow-hidden border-4 border-white shadow-xl">
            <img src={PHOTOS.goats} alt="Goats under YPA's care" className="w-full h-full object-cover" />
          </div>
          <span className={`${mono.className} absolute -top-6 right-0 text-[9px] tracking-[0.15em] uppercase`} style={{ color: STONE }}>Fig. 01 — Central Region</span>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// PHOTO INTERLUDE — full-width strip, breaks the rhythm before Scale
// ============================================================
function PhotoInterlude() {
  return (
    <section className="relative h-[42vh] min-h-[280px] overflow-hidden">
      <img src={PHOTOS.aerial} alt="Aerial view of a YPA goat farm" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "grayscale(0.15)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(10,10,11,0.55) 0%, transparent 40%)" }} />
      <div className="absolute bottom-4 left-6 md:left-16">
        <span className={`${mono.className} text-[9px] tracking-[0.18em] uppercase text-white/70`}>Aerial — Mubende District, the Goats Programme</span>
      </div>
    </section>
  );
}

// ============================================================
// SCALE — count-up set against a duotone photo, not flat void
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

function ScaleNumber({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const n = useCountUp(target, inView);
  return (
    <div ref={ref} className="text-center">
      <div className={`${display.className} font-medium tracking-tight text-white text-[15vw] sm:text-7xl md:text-8xl`}>{n.toLocaleString()}{suffix}</div>
      <div className={`${inter.className} mt-3 text-sm md:text-base font-light text-white/60`}>{label}</div>
    </div>
  );
}

function Scale() {
  return (
    <section className="relative py-28 md:py-40 px-6 md:px-16 overflow-hidden">
      <img src={PHOTOS.maize} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "grayscale(0.6) brightness(0.28)" }} />
      <div className="absolute inset-0" style={{ background: "rgba(10,10,11,0.55)" }} />
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none" style={{ background: YPA_BLUE, opacity: 0.12 }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" style={{ background: GOLD, opacity: 0.1 }} />
      <div className="relative max-w-5xl mx-auto text-center mb-16 md:mb-24">
        <Reveal className="flex justify-center"><Kicker index="02" light>What we've built</Kicker></Reveal>
        <Reveal delay={0.08}><h2 className={`${display.className} text-white text-3xl md:text-5xl font-medium tracking-tight mt-3`}>The numbers, plainly.</h2></Reveal>
      </div>
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
        <ScaleNumber target={130000} suffix="+" label="Goats under care" />
        <ScaleNumber target={12} suffix="" label="Branches, nationwide" />
        <ScaleNumber target={1000} suffix="+" label="Members empowered" />
      </div>
    </section>
  );
}

// ============================================================
// LEADERSHIP — editorial portrait spread, alternating sides
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
  return (
    <Reveal delay={index * 0.06}>
      <div className={`grid md:grid-cols-[0.7fr_1fr] gap-6 md:gap-10 items-center py-10 md:py-14 ${flip ? "md:[direction:rtl]" : ""}`} style={{ borderTop: index === 0 ? `1px solid ${HAIRLINE}` : "none", borderBottom: `1px solid ${HAIRLINE}` }}>
        <div className="aspect-[4/5] rounded-2xl overflow-hidden" style={{ direction: "ltr" }}>
          <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" style={{ objectPosition: "50% 20%" }} />
        </div>
        <div style={{ direction: "ltr" }}>
          <span className={`${mono.className} text-[10px]`} style={{ color: GOLD }}>0{index + 1}</span>
          <h3 className={`${display.className} text-2xl md:text-3xl font-medium mt-2`} style={{ color: leader.name === "Name pending" ? STONE : INK }}>{leader.name}</h3>
          <div className={`${inter.className} text-sm mt-1 font-medium`} style={{ color: YPA_BLUE }}>{leader.role}</div>
          <p className={`${inter.className} mt-4 text-base font-light leading-relaxed max-w-md`} style={{ color: "#3C4650" }}>{leader.bio}</p>
        </div>
      </div>
    </Reveal>
  );
}

function Leadership() {
  return (
    <section id="people" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: PAPER }}>
      <div className="max-w-5xl mx-auto">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <Kicker index="03">Governance</Kicker>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>Led by real people.</h2>
          </div>
          <MorphButton href="/team" idleText="Meet the full team" revealText="View all →" variant="outline" />
        </Reveal>
        <div>{LEADERSHIP_PREVIEW.map((l, i) => <LeaderRow key={l.name} leader={l} index={i} />)}</div>
      </div>
    </section>
  );
}

// ============================================================
// PURPOSE — image-backed statements, click to expand the full text
// ============================================================
function PurposeCard({ image, icon: Icon, label, front, back }: { image: string; icon: any; label: string; front: string; back: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group" onClick={() => setOpen((o) => !o)}>
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: "grayscale(0.35) brightness(0.55)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.15) 0%, rgba(10,10,11,0.85) 100%)" }} />
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <Icon className="h-6 w-6 mb-4" style={{ color: GOLD }} strokeWidth={1.5} />
        <span className={`${mono.className} text-[10px] tracking-[0.2em] uppercase text-white/50`}>{label}</span>
        <p className={`${display.className} text-white text-xl md:text-2xl font-medium leading-[1.2] mt-2`}>{front}</p>
        <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
          <p className={`${inter.className} text-sm font-light text-white/75 leading-relaxed pt-4`} dangerouslySetInnerHTML={{ __html: back }} />
        </motion.div>
        <span className={`${inter.className} inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-white/50`}>
          {open ? "Show less" : "Read the full statement"} <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown className="h-3.5 w-3.5" /></motion.span>
        </span>
      </div>
    </div>
  );
}

function Purpose({ content }: { content: any }) {
  return (
    <section id="purpose" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: CLOUD }}>
      <Reveal className="max-w-5xl mx-auto mb-12 md:mb-16">
        <Kicker index="04">Why we exist</Kicker>
        <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>Mission and vision, plainly stated.</h2>
      </Reveal>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
        <Reveal><PurposeCard image={PHOTOS.goats} icon={Target} label="Mission" front="Economic empowerment, through agribusiness." back={content?.mission || "To economically empower individuals through agribusiness that competes internationally."} /></Reveal>
        <Reveal delay={0.08}><PurposeCard image={PHOTOS.hq} icon={Globe} label="Vision" front="The greatest empowerment platform in Africa." back={content?.vision || "To be the greatest empowerment platform in Africa, and push back poverty with it."} /></Reveal>
      </div>
    </section>
  );
}

// ============================================================
// VALUES — alternating photo/text editorial rows
// ============================================================
const VALUES = [
  { text: "We walk in faith, guided by kindness, compassion and service.", detail: "Every branch decision starts from how it treats the people it touches, not just the numbers behind it.", icon: Heart, image: PHOTOS.community },
  { text: "We are honest and transparent in everything we do.", detail: "Our registration, tax status and financials are published, not just claimed.", icon: ShieldCheck, image: PHOTOS.hq },
  { text: "We respect time — punctuality and efficiency matter.", detail: "Members and partners can expect commitments to be kept on the date they're made.", icon: Clock, image: PHOTOS.maize },
  { text: "We believe collaboration is key. Together, we achieve more.", detail: "From the original 21-person group to today's 12 branches, growth has always come through shared effort.", icon: Handshake, image: PHOTOS.members },
  { text: "We build lasting connections between young Africans and their communities.", detail: "Our programmes are designed to stay rooted in the communities they start in, not extract from them.", icon: Users, image: PHOTOS.farm },
];

function ValueRow({ v, i }: { v: (typeof VALUES)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  const Icon = v.icon;
  const flip = i % 2 === 1;
  return (
    <Reveal delay={i * 0.05}>
      <div className={`grid md:grid-cols-[1fr_1.3fr] gap-6 md:gap-10 items-center py-10 md:py-14 ${flip ? "md:[direction:rtl]" : ""}`} style={{ borderTop: i === 0 ? `1px solid ${HAIRLINE}` : "none", borderBottom: `1px solid ${HAIRLINE}` }}>
        <div className="aspect-[16/10] rounded-2xl overflow-hidden" style={{ direction: "ltr" }}>
          <img src={v.image} alt="" className="w-full h-full object-cover" />
        </div>
        <button onClick={() => setOpen((o) => !o)} className="text-left" style={{ direction: "ltr" }}>
          <Icon className="h-6 w-6 mb-3" style={{ color: YPA_BLUE }} strokeWidth={1.5} />
          <p className={`${display.className} text-xl md:text-2xl font-medium leading-snug`} style={{ color: INK }}>{v.text}</p>
          <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
            <p className={`${inter.className} text-sm md:text-base font-light pt-3`} style={{ color: STONE }}>{v.detail}</p>
          </motion.div>
          <span className={`${inter.className} inline-flex items-center gap-1.5 mt-3 text-xs font-medium`} style={{ color: STONE }}>
            {open ? "Show less" : "Read more"} <motion.span animate={{ rotate: open ? 45 : 0 }}><Plus className="h-3.5 w-3.5" style={{ color: open ? GOLD : STONE }} /></motion.span>
          </span>
        </button>
      </div>
    </Reveal>
  );
}

function Values() {
  return (
    <section id="values" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: PAPER }}>
      <div className="max-w-5xl mx-auto">
        <Reveal className="mb-4">
          <Kicker index="05">What we believe</Kicker>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>Five things we don't compromise on.</h2>
        </Reveal>
        <div>{VALUES.map((v, i) => <ValueRow key={i} v={v} i={i} />)}</div>
      </div>
    </section>
  );
}

// ============================================================
// TIMELINE — vertical editorial, alternating photos
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
  const flip = i % 2 === 1;
  return (
    <Reveal delay={i * 0.05}>
      <div className={`grid md:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-10 items-center py-10 md:py-14 ${flip ? "md:[direction:rtl]" : ""}`} style={{ borderTop: i === 0 ? `1px solid ${HAIRLINE}` : "none", borderBottom: `1px solid ${HAIRLINE}` }}>
        <div className="aspect-[4/3] rounded-2xl overflow-hidden" style={{ direction: "ltr" }}>
          <img src={m.image} alt="" className="w-full h-full object-cover" />
        </div>
        <button onClick={() => setOpen((o) => !o)} className="text-left" style={{ direction: "ltr" }}>
          <div className={`${mono.className} text-4xl md:text-5xl font-medium`} style={{ color: i % 2 ? GOLD : YPA_BLUE }}>{m.year}</div>
          <p className={`${display.className} text-xl md:text-2xl font-medium leading-snug mt-2`} style={{ color: INK }}>{m.label}</p>
          <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className={`${inter.className} text-sm md:text-base font-light pt-3`} style={{ color: STONE }}>{m.desc}</p>
          </motion.div>
        </button>
      </div>
    </Reveal>
  );
}

function Timeline() {
  return (
    <section id="timeline" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: CLOUD }}>
      <Reveal className="max-w-5xl mx-auto mb-4">
        <Kicker index="06">Timeline</Kicker>
        <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>Year by year.</h2>
      </Reveal>
      <div className="max-w-5xl mx-auto">{MILESTONES.map((m, i) => <TimelineRow key={i} m={m} i={i} />)}</div>
    </section>
  );
}

// ============================================================
// TRUST — split screen, real photo instead of naked text rows
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
    <section id="trust" className="py-24 md:py-32 scroll-mt-24" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 lg:gap-16 px-6 md:px-16">
        <Reveal className="aspect-[4/5] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden mb-8 lg:mb-0">
          <img src={PHOTOS.hq} alt="YPA headquarters" className="w-full h-full object-cover" />
        </Reveal>
        <div>
          <Reveal>
            <Kicker index="07">Due diligence</Kicker>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>The paperwork, on record.</h2>
          </Reveal>
          <div className="mt-8">
            {facts.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-baseline justify-between gap-4 py-4" style={{ borderTop: i === 0 ? `1px solid ${HAIRLINE}` : "none", borderBottom: `1px solid ${HAIRLINE}` }}>
                  <span className={`${inter.className} text-sm`} style={{ color: STONE }}>{f.k}</span>
                  <span className={`${mono.className} text-sm md:text-base font-medium text-right`} style={{ color: INK }}>{f.v}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="mt-8">
            <span className={`${inter.className} text-xs font-medium uppercase tracking-[0.18em]`} style={{ color: STONE }}>Find us</span>
            <div className="mt-4 space-y-4">
              {offices.map((o, i) => (
                <div key={i} className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: YPA_BLUE }} strokeWidth={1.5} />
                  <div>
                    <div className={`${inter.className} text-sm font-medium`} style={{ color: INK }}>{o.region}</div>
                    <div className={`${inter.className} text-xs mt-0.5`} style={{ color: STONE }}>{o.detail}</div>
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
    <section id="faq" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: CLOUD }}>
      <div className="max-w-3xl mx-auto">
        <Reveal className="mb-12 md:mb-16 text-center flex flex-col items-center">
          <Kicker index="08">FAQ</Kicker>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>Common questions.</h2>
        </Reveal>
        {faqs.length === 0 ? (
          <p className={`${inter.className} text-center text-sm`} style={{ color: STONE }}>No FAQs published yet.</p>
        ) : (
          <div>
            {faqs.map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.04}>
                <div style={{ borderTop: i === 0 ? `1px solid ${HAIRLINE}` : "none", borderBottom: `1px solid ${HAIRLINE}` }}>
                  <button onClick={() => setOpen(open === i ? null : i)} className="w-full py-5 md:py-6 flex items-center justify-between gap-4 text-left">
                    <span className={`${inter.className} text-base md:text-lg font-medium`} style={{ color: INK }}>{faq.question}</span>
                    <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3 }}><Plus className="h-5 w-5" style={{ color: open === i ? GOLD : STONE }} /></motion.span>
                  </button>
                  {open === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.25 }} className="pb-6 md:pb-7">
                      <div className={`${inter.className} text-sm md:text-base font-light leading-relaxed`} style={{ color: "#3C4650" }} dangerouslySetInnerHTML={{ __html: faq.answer }} />
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
// CLOSE — full-bleed pull quote, bookends the hero
// ============================================================
function Close() {
  return (
    <section className="relative h-[70vh] min-h-[440px] overflow-hidden">
      <img src={PHOTOS.aerial} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "grayscale(0.3) brightness(0.35)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.4) 0%, rgba(10,10,11,0.85) 100%)" }} />
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-16 text-center">
        <Reveal>
          <div className="h-px w-10 mx-auto mb-8" style={{ background: GOLD }} />
          <h2 className={`${display.className} text-white text-3xl md:text-5xl font-medium tracking-tight max-w-2xl mx-auto`}>Now you know who we are.</h2>
          <p className={`${inter.className} mt-4 text-white/50 font-light max-w-md mx-auto`}>Join Africa's leading youth agribusiness platform, or ask us anything else.</p>
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
      <main className={`${display.variable} ${mono.variable} ${serif.variable} ${inter.variable} min-h-screen bg-white`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 rounded-full" style={{ borderColor: HAIRLINE, borderTopColor: YPA_BLUE }} />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`${display.variable} ${mono.variable} ${serif.variable} ${inter.variable} min-h-screen bg-white overflow-x-hidden font-sans`}>
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