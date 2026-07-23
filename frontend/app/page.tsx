"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Alegreya, Inter } from "next/font/google";
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Sparkles,
  Shield,
  Users,
  Building,
  Sprout,
  Leaf,
  Award,
  Handshake,
  Calendar,
  Clock,
  MapPin,
  Newspaper,
  Tv,
  Radio,
  Printer,
  Globe,
  ExternalLink,
  Lightbulb,
  Target,
  Heart,
  BookOpen,
  ChevronDown,
} from "lucide-react";

// ============================================================
// FONTS
// ============================================================
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
const serif = Alegreya({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// ============================================================
// OFFICIAL YPA BRAND COLORS
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_DARK = "#0099D6";
const YPA_BLUE_LIGHT = "#33C1F5";
const YPA_BLUE_SOFT = "#E6F8FD";
const INK = "#111111";
const NAVY = "#0E2540";
const NAVY_SOFT = "#153455";
const LINE = "#1F3B57";
const GOLD = "#F0B429";
const MIST = "#F6F8FA";
const INK_ON_LIGHT = "#111111";
const MUTE_ON_LIGHT = "#5B6B7A";
const POSITIVE = "#34D399";

// ✅ CORRECT: Define API_URL first
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// HELPER: Get correct image URL
// ============================================================
const getImageUrl = (image: string | undefined, fallback: string) => {
  if (!image) return fallback;
  if (image.startsWith('http')) return image;
  return `${API_URL}/assets/${image}`;
};

// ============================================================
// FALLBACK IMAGES
// ============================================================
const FALLBACK_IMAGES = {
  goats: 'https://images.unsplash.com/photo-1535268647677-300d0a4c3b7b?w=900&q=80',
  maize: 'https://images.unsplash.com/photo-1593250481214-81611f9bca0f?w=800&q=80',
  sacco: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=900&q=80'
};

// ============================================================
// CUSTOM HOOK: Smart Reduced Motion for Mobile
// ============================================================
function useReducedMotion() {
  const [shouldReduce, setShouldReduce] = useState(false);
  
  useEffect(() => {
    const checkMotion = () => {
      const isMobile = window.innerWidth < 768;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Only reduce for very old phones or if user prefers reduced motion
      const isVeryOldPhone = isMobile && window.innerWidth < 320;
      setShouldReduce(prefersReduced || isVeryOldPhone);
    };
    
    checkMotion();
    window.addEventListener('resize', checkMotion);
    return () => window.removeEventListener('resize', checkMotion);
  }, []);
  
  return shouldReduce;
}

// ============================================================
// DATA FETCHING
// ============================================================
async function getPressCoverage() {
  try {
    const res = await fetch(`${API_URL}/items/press?sort[]=-date&limit=3`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching press:", error);
    return [];
  }
}

async function getEvents() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(
      `${API_URL}/items/events?filter[status][_eq]=upcoming&filter[date][_gte]=${today}&sort[]=date&limit=5`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// ✅ FIXED: Removed sort[]=-featured to prevent 500 error
async function getBlogPosts() {
  try {
    const res = await fetch(
      `${API_URL}/items/posts?filter[status][_eq]=published&sort[]=-published_at&limit=3`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      console.error("Failed to fetch blog posts:", res.status);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

async function getSignalArticles() {
  try {
    const res = await fetch(
      `${API_URL}/items/signal_articles?filter[status][_eq]=published&sort[]=-date&limit=3`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      console.error("Failed to fetch signal articles:", res.status);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching signal articles:", error);
    return [];
  }
}

function getFallbackArticles() {
  return [
    {
      title: "How 130,000 goats get tracked without losing a single one",
      description: "Inside the logistics behind YPA's livestock operation.",
      image: "https://images.unsplash.com/photo-1535268647677-300d0a4c3b7b?w=900&q=80",
      tag: "Operations",
      readTime: "3 min",
      slug: "how-130000-goats-get-tracked",
      big: true,
    },
    {
      title: "Why contract farming changes the math for a smallholder",
      description: "Guaranteed off-take, explained plainly.",
      image: "https://images.unsplash.com/photo-1593250481214-81611f9bca0f?w=800&q=80",
      tag: "Sustainability",
      readTime: "4 min",
      slug: "why-contract-farming-changes-the-math",
      big: false,
    },
    {
      title: "Twelve branches, one ledger",
      description: "How YPA SACCO keeps every member's savings visible.",
      image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&q=80",
      tag: "Finance",
      readTime: "5 min",
      slug: "twelve-branches-one-ledger",
      big: false,
    },
  ];
}

const typeIcons = { tv: Tv, radio: Radio, print: Printer, online: Globe };

// ============================================================
// SCROLL PROGRESS - Optimized for Mobile
// ============================================================
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, background: YPA_BLUE }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60]"
    />
  );
};

// ============================================================
// SECTION RAIL - Hidden on Mobile
// ============================================================
const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "index", label: "Field Index" },
  { id: "explore", label: "Explore" },
  { id: "lineup", label: "The Lineup" },
  { id: "trust", label: "Why Trust Us" },
  { id: "signal", label: "Inside YPA" },
  { id: "voices", label: "Member Voices" },
  { id: "press", label: "Press" },
  { id: "cta", label: "Join" },
];

const SectionRail = () => {
  const [active, setActive] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid) current = s.id;
      }
      setActive(current);

      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? doc.scrollTop / scrollable : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide on mobile for better performance
  return (
    <div className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div
        className="relative flex flex-col items-center gap-[14px] py-5 px-[9px] rounded-full"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: `0 8px 32px rgba(0,0,0,0.08), 0 0 24px ${YPA_BLUE}15`,
        }}
      >
        <div
          className="absolute left-1/2 top-2 bottom-2 w-[2px] -translate-x-1/2 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <motion.div
            className="w-full rounded-full"
            style={{ background: `linear-gradient(180deg, ${YPA_BLUE_LIGHT}, ${YPA_BLUE})` }}
            animate={{ height: `${progress * 100}%` }}
            transition={{ duration: 0.2, ease: "linear" }}
          />
        </div>

        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          const isHovered = hovered === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="relative z-10 flex items-center justify-center"
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={s.label}
            >
              <motion.span
                className="block rounded-full"
                animate={{
                  width: isActive ? 9 : 6,
                  height: isActive ? 9 : 6,
                  background: isActive ? YPA_BLUE : "rgba(255,255,255,0.5)",
                  boxShadow: isActive ? `0 0 10px ${YPA_BLUE}` : "none",
                }}
                transition={{ duration: 0.3 }}
              />

              <AnimatePresence>
                {(isActive || isHovered) && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.2 }}
                    className={`${mono.className} absolute left-full ml-3 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase font-medium`}
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${isActive ? YPA_BLUE : "rgba(255,255,255,0.3)"}`,
                      boxShadow: isActive ? `0 0 16px ${YPA_BLUE}33` : "0 4px 16px rgba(0,0,0,0.05)",
                      color: isActive ? YPA_BLUE : "#111111",
                    }}
                  >
                    {s.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// SCROLL REVEAL - Mobile Optimized
// ============================================================
const ScrollReveal = ({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : reduceMotion ? {} : { opacity: 0, y: 20 }}
      transition={{ 
        duration: reduceMotion ? 0 : (isMobile ? 0.3 : 0.5), 
        delay: reduceMotion ? 0 : (isMobile ? delay * 0.5 : delay) 
      }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// HERO — Mobile Optimized
// ============================================================
const LINEUP = [
  {
    kicker: "Model 01 — Livestock",
    title: "The Goats Programme",
    titleHighlight: "Goats",
    line: "Mubende × Boer × Kalahari, raised for guaranteed off-take.",
    specs: [
      { label: "Under care", value: "130,000+" },
      { label: "Success rate", value: "95%" },
      { label: "Market access", value: "Guaranteed" },
    ],
    gradient: "from-white via-[#F0F9FE] to-[#E6F8FD]",
    href: "/projects/goats",
    image: "https://cdn.vetverified.com/articles/06831ffc7fdc72391ae6f8f170b03427c588c33bf9e52fba10e22133c49e1e56.webp",
    aura: YPA_BLUE,
    glowColor: YPA_BLUE,
  },
  {
    kicker: "Model 02 — Cropping",
    title: "Maize Contract Farming",
    titleHighlight: "Maize",
    line: "Modern inputs, guaranteed buyers, a return you can plan around.",
    specs: [
      { label: "Cultivated", value: "5,000+ acres" },
      { label: "Avg. return", value: "3.0×" },
      { label: "Off-take", value: "Contracted" },
    ],
    gradient: "from-white via-[#F0F9FE] to-[#E6F8FD]",
    href: "/projects/maize",
    image: "https://thumbs.dreamstime.com/b/corn-harvesting-21773394.jpg",
    aura: YPA_BLUE_DARK,
    glowColor: YPA_BLUE_DARK,
  },
  {
    kicker: "Model 03 — Finance",
    title: "YPA SACCO",
    titleHighlight: "SACCO",
    line: "Savings and credit built around the rhythm of a harvest, not a payslip.",
    specs: [
      { label: "Members", value: "1,000+" },
      { label: "Branches", value: "12" },
      { label: "Founded", value: "2014" },
    ],
    gradient: "from-white via-[#F0F9FE] to-[#E6F8FD]",
    href: "/sacco",
    image: "https://farm6.staticflickr.com/5603/15475865161_634b055363.jpg",
    aura: YPA_BLUE_LIGHT,
    glowColor: YPA_BLUE_LIGHT,
  },
];

// ============================================================
// HERO VISUAL — restored motion and framing, still just two
// cheap transforms plus a couple of static/CSS-only touches.
// Uses next/image (already imported) and existing brand tokens.
// ============================================================
const HeroVisual = ({ item }: { item: (typeof LINEUP)[number] }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[440px] mx-auto aspect-[4/3] lg:aspect-[4/5]">
      {/* animated ambient glow — brand blue only, gentle drift */}
      <div className="absolute inset-0 -z-10 overflow-visible">
        <motion.div
          animate={reduceMotion ? {} : { x: [0, 14, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-18%] right-[-18%] w-[70%] h-[70%] rounded-full blur-3xl"
          style={{ background: `${item.aura}22` }}
        />
        <motion.div
          animate={reduceMotion ? {} : { x: [0, -12, 0], y: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-18%] left-[-18%] w-[60%] h-[60%] rounded-full blur-3xl"
          style={{ background: `${YPA_BLUE_LIGHT}18` }}
        />
      </div>

      {/* slow rotating ring for texture — one transform, no filter */}
      <motion.div
        className="absolute inset-[-10px] rounded-2xl lg:rounded-[2.2rem] border pointer-events-none"
        style={{ borderColor: `${item.aura}28` }}
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="relative w-full h-full rounded-2xl lg:rounded-[2rem] overflow-hidden border"
        style={{ 
          borderColor: `${item.aura}25`,
          boxShadow: `0 25px 50px -20px ${item.aura}35, 0 0 0 1px ${item.aura}10 inset`
        }}
      >
        <Image
          src={getImageUrl(item.image, FALLBACK_IMAGES.default)}
          alt={item.title}
          width={600}
          height={800}
          className="w-full h-full object-cover"
          quality={80}
          priority
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGES.default;
          }}
        />

        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(to top, rgba(6,11,20,0.65) 0%, transparent 46%)`,
        }} />

        {/* viewfinder corners — static SVG, sits on the photo, zero animation cost */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" fill="none">
            <path d="M6 18 V8 H16" />
            <path d="M84 8 H94 V18" />
            <path d="M94 82 V92 H84" />
            <path d="M16 92 H6 V82" />
          </g>
        </svg>

        {/* award chip — white / brand-blue / ink, static */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-white shadow-sm">
          <Award className="h-3 w-3" style={{ color: item.aura }} />
          <span className={`${mono.className} text-[9px] tracking-[0.1em] uppercase font-medium`} style={{ color: INK }}>
            #1 in Africa
          </span>
        </div>

        {/* kicker + live status dot */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className={`${mono.className} text-[10px] tracking-[0.12em] uppercase text-white/80`}>
            {item.kicker}
          </span>
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span
              className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-70"
              style={{ background: item.aura }}
            />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: item.aura }} />
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// HERO — Mobile Optimized
// ============================================================
const EASE = [0.22, 1, 0.36, 1] as const;

const Hero = () => {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setInterval(() => setI((p) => (p + 1) % LINEUP.length), 6500);
    return () => clearInterval(t);
  }, [paused, reduceMotion]);

  const current = LINEUP[i];

  const titleParts = current.title.split(current.titleHighlight);
  const beforeHighlight = titleParts[0] || "";
  const afterHighlight = titleParts.slice(1).join("");

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F0F9FE] to-[#E6F8FD]" />

      {/* animated ambient light — brand blue family only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={reduceMotion ? {} : { x: [0, 60, -30, 0], y: [0, -50, 30, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[6%] right-[4%] w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: `${current.aura}14` }}
        />
        <motion.div
          animate={reduceMotion ? {} : { x: [0, -50, 30, 0], y: [0, 40, -40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="hidden sm:block absolute bottom-[4%] left-[2%] w-[340px] h-[340px] rounded-full blur-3xl"
          style={{ background: `${YPA_BLUE_LIGHT}10` }}
        />
      </div>

      {/* faint brand-blue dot texture, masked to a soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${YPA_BLUE} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.05,
          WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 40%, #000 0%, transparent 78%)",
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 40%, #000 0%, transparent 78%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-5 md:px-14 py-8">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-4 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            {/* Badge — permanent, doesn't rotate with the slides */}
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 bg-[#00AEEF] text-white shadow-lg"
            >
              <motion.span
                animate={reduceMotion ? {} : { scale: [1, 1.15, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="flex"
              >
                <Award className="h-4 w-4" />
              </motion.span>
              <span className={`${inter.className} text-[10px] sm:text-[12px] tracking-[0.1em] uppercase font-bold`}>
                Ranked #1 Goat Farming Programme
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
                exit={reduceMotion ? {} : { opacity: 0, y: -20 }}
                transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
              >
                {/* Kicker with live status dot */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ background: current.aura }}
                    />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: current.aura }} />
                  </span>
                  <span className={`${inter.className} text-[10px] tracking-[0.25em] uppercase font-medium`} style={{ color: current.aura }}>
                    {current.kicker}
                  </span>
                </div>

                {/* Title — an Alegreya-serif accent word against the Inter sans headline */}
                <h1
                  className={`${inter.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight max-w-xl`}
                  style={{ color: INK_ON_LIGHT }}
                >
                  {beforeHighlight}
                  <span className={`${serif.className} relative inline-block italic`} style={{ color: current.aura }}>
                    {current.titleHighlight}
                    <motion.span
                      key={`underline-${i}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
                      className="absolute bottom-0 left-0 h-[3px] w-full rounded-full origin-left"
                      style={{ background: `linear-gradient(90deg, ${current.aura}, ${current.aura}80)` }}
                    />
                  </span>
                  {afterHighlight}
                </h1>

                <p className={`${inter.className} mt-3 text-base md:text-lg font-light max-w-xl leading-relaxed text-[#5B6B7A]`}>
                  {current.line}
                </p>

                {/* Specs - responsive grid */}
                <div className={`${inter.className} mt-6 flex flex-wrap gap-x-6 gap-y-2`}>
                  {current.specs.map((s, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[9px] tracking-[0.15em] uppercase font-medium text-[#5B6B7A]">
                        {s.label}
                      </span>
                      <span className="text-xl md:text-2xl font-semibold text-[#111111]">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Buttons - stacked on mobile */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={current.href}
                    className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] bg-[#00AEEF] shadow-lg"
                  >
                    Configure this programme
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/about"
                    className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] border-2 border-[#00AEEF]/30 text-[#111111] bg-white/50 backdrop-blur-sm"
                  >
                    <Play className="h-4 w-4" />
                    See how YPA works
                  </Link>
                </div>

                {/* Slide indicators */}
                <div className="flex gap-1.5 mt-8">
                  {LINEUP.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setI(idx)}
                      aria-label={`Show ${LINEUP[idx].title}`}
                      className="rounded-full transition-all duration-500"
                      style={{
                        width: idx === i ? "32px" : "12px",
                        height: "3px",
                        background: idx === i ? current.aura : "rgba(6,11,20,0.12)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-1 lg:order-2 mb-2 lg:mb-0">
            <HeroVisual item={current} />
          </div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile, now with a gentle bounce */}
      <div className="hidden md:block absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <a href="#index" className="flex flex-col items-center gap-1 group">
          <span className={`${inter.className} text-[9px] tracking-[0.3em] uppercase font-medium text-[#5B6B7A]`}>
            Explore
          </span>
          <motion.div
            animate={reduceMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-[#5B6B7A]" />
          </motion.div>
        </a>
      </div>
    </section>
  );
};

// ============================================================
// FIELD INDEX — Mobile Optimized
// ============================================================
const FIELD_INDEX = [
  { label: "Goats under care", value: "130,000+", delta: "95% success" },
  { label: "Acres cultivated", value: "5,000+", delta: "maize programme" },
  { label: "SACCO members", value: "1,000+", delta: "12 branches" },
  { label: "Avg. farmer return", value: "3.0×", delta: "contract farming" },
  { label: "Operating since", value: "2014", delta: "URSB registered" },
  { label: "Hidden fees", value: "0", delta: "by policy" },
];

const FieldIndex = () => {
  const reduceMotion = useReducedMotion();
  const track = [...FIELD_INDEX, ...FIELD_INDEX];

  return (
    <section id="index" className="relative overflow-hidden bg-[#00AEEF] py-4">
      <div className="flex items-center gap-2 px-5 pt-3">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        <span className={`${display.className} text-[11px] sm:text-[13px] text-white/90`}>
          Field Index — live across 12 branches
        </span>
      </div>

      <div className="relative py-3">
        <motion.div
          className="flex gap-3 px-5"
          animate={reduceMotion ? {} : { x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {track.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 shrink-0 rounded-xl px-3 py-2 border border-white/15 bg-white/10"
            >
              <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] text-white/70">{m.label}</span>
                <span className={`${mono.className} text-base sm:text-lg text-white font-medium`}>{m.value}</span>
              </div>
              <span
                className="text-[8px] sm:text-[9px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap bg-[#33C1F5] text-white"
              >
                {m.delta}
              </span>
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-12 md:w-28 pointer-events-none bg-gradient-to-r from-[#00AEEF] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-28 pointer-events-none bg-gradient-to-l from-[#00AEEF] to-transparent" />
      </div>
    </section>
  );
};

// ============================================================
// EXPLORE RAIL — Mobile Optimized with Symmetrical Layout
// ============================================================
const EXPLORE = [
  {
    q: "What does it actually take to raise 130,000 goats?",
    label: "The Goats Programme",
    href: "/projects/goats",
    tall: true,
    image: `${API_URL}/assets/3012af2e-1cc2-404b-9e46-956c56cc1912`,
  },
  {
    q: "Could your acre be outperforming the regional average?",
    label: "Maize & Contract Farming",
    href: "/projects/maize",
    tall: false,
    image: "https://tse2.mm.bing.net/th/id/OIP.WJJALakxa5_OhQvljSbsKwHaE8?r=0&w=600&h=400&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    q: "What if your savings account understood harvest season?",
    label: "YPA SACCO",
    href: "/sacco",
    tall: false,
    image: "https://farm6.staticflickr.com/5603/15475865161_634b055363.jpg",
  },
  {
    q: "Who's actually behind the numbers?",
    label: "Our Story",
    href: "/about",
    tall: true,
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=900&q=80",
  },
  {
    q: "What does a decade of fieldwork look like?",
    label: "Gallery",
    href: "/gallery",
    tall: false,
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
  },
  {
    q: "Ready to ask us directly?",
    label: "Talk to Us",
    href: "/contact",
    tall: false,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
  },
];

const ExploreRail = () => {
  return (
    <section id="explore" className="px-5 md:px-14 py-16 md:py-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-[#111111]`}>
            Start wherever the question is
          </h2>
          <span className={`${display.className} text-[11px] md:text-[13px] text-[#5B6B7A]`}>
            Six ways in
          </span>
        </div>
      </ScrollReveal>

      {/* Symmetrical grid with fixed heights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {EXPLORE.map((item, i) => (
          <ScrollReveal key={i} delay={i * 0.04} className={item.tall ? "sm:row-span-2" : ""}>
            <Link href={item.href} className="group block h-full">
              <div
                className={`relative h-full rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                  item.tall ? "min-h-[280px] sm:min-h-[320px]" : "min-h-[200px] sm:min-h-[220px]"
                }`}
              >
                <Image
                  src={getImageUrl(item.image, FALLBACK_IMAGES.default)}
                  alt={item.label}
                  width={item.tall ? 800 : 600}
                  height={item.tall ? 600 : 400}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={i < 3 ? "eager" : "lazy"}
                  quality={75}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGES.default;
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, #060B14 18%, rgba(6,11,20,0.45) 55%, rgba(6,11,20,0.2))" }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${YPA_BLUE}22, transparent 60%)` }}
                />

                <div className="relative h-full flex flex-col justify-end p-4 md:p-6">
                  <p className={`${display.className} text-base md:text-lg font-medium leading-snug text-white line-clamp-2`}>
                    {item.q}
                  </p>
                  <div className="flex items-center justify-between mt-3 md:mt-5">
                    <span className={`${mono.className} text-[9px] md:text-[10px] tracking-[0.12em] uppercase text-white/60`}>
                      {item.label}
                    </span>
                    <span
                      className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 bg-[#00AEEF]"
                    >
                      <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-white" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

// ============================================================
// THE LINEUP — Mobile Optimized with Symmetrical Heights
// ============================================================
const CONFIG_CARDS = [
  {
    icon: Sprout,
    name: "Goats",
    tag: "Livestock",
    stat: "130K+",
    statLabel: "under care",
    specs: ["Mubende × Boer × Kalahari", "95% member success rate", "Guaranteed market access"],
    href: "/projects/goats",
    image: `${API_URL}/assets/3012af2e-1cc2-404b-9e46-956c56cc1912`,
  },
  {
    icon: Leaf,
    name: "Maize",
    tag: "Cropping",
    stat: "5K+",
    statLabel: "acres cultivated",
    specs: ["Contracted off-take", "Average 3.0× return", "Modern input support"],
    href: "/projects/maize",
    image: "https://tse2.mm.bing.net/th/id/OIP.WJJALakxa5_OhQvljSbsKwHaE8?r=0&w=600&h=400&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    icon: Users,
    name: "SACCO",
    tag: "Finance",
    stat: "1K+",
    statLabel: "members",
    specs: ["12 branches nationwide", "Loans built for farmers", "Member-owned since 2014"],
    href: "/sacco",
    image: "https://farm6.staticflickr.com/5603/15475865161_634b055363.jpg",
  },
];

const TheLineup = () => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="lineup" className="px-5 md:px-14 py-16 md:py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className={`${display.className} text-[11px] md:text-[13px] text-white/40 mb-2`}>
            Three programmes, one platform
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-5xl font-medium tracking-tight text-white max-w-2xl`}>
            The Lineup
          </h2>
        </ScrollReveal>

        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CONFIG_CARDS.map((c, i) => {
            const Icon = c.icon;
            const isHover = hover === i;
            return (
              <ScrollReveal key={i} delay={i * 0.08}>
                <Link
                  href={c.href}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="group block relative rounded-2xl overflow-hidden border border-[#1F3B57] h-[340px] sm:h-[380px] lg:h-[420px]"
                >
                  <Image
                    src={getImageUrl(c.image, FALLBACK_IMAGES.goats)}
                    alt={c.name}
                    width={600}
                    height={400}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading={i < 2 ? "eager" : "lazy"}
                    quality={75}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGES.goats;
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, #060B14 15%, rgba(6,11,20,0.35) 55%, rgba(6,11,20,0.55))" }}
                  />

                  <div className="relative h-full flex flex-col justify-between p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <span
                        className={`${mono.className} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] md:text-[10px] tracking-[0.1em] uppercase text-white/80 bg-white/10 backdrop-blur-sm`}
                      >
                        <Icon className="h-3 w-3" />
                        {c.tag}
                      </span>
                      <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-white/60 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    <div>
                      <div className={`${mono.className} text-2xl md:text-3xl text-white font-medium`}>
                        {c.stat}
                        <span className="text-xs md:text-sm text-white/50 ml-1 md:ml-2 font-normal">{c.statLabel}</span>
                      </div>
                      <h3 className={`${display.className} text-xl md:text-2xl text-white font-medium mt-0.5`}>{c.name}</h3>

                      <motion.div
                        initial={false}
                        animate={{ height: isHover ? "auto" : 0, opacity: isHover ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-3 space-y-1 pt-3 border-t border-white/10">
                          {c.specs.map((s, si) => (
                            <li key={si} className="flex items-center gap-2 text-xs text-white/65">
                              <span className="h-1 w-1 rounded-full bg-[#00AEEF]" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// TRUST BAR — Mobile Optimized
// ============================================================
const TRUST_POINTS = [
  { icon: Award, label: "Founded", value: "2014", note: "over a decade in the field" },
  { icon: Shield, label: "Registered", value: "URSB", note: "licensed to operate in Uganda" },
  { icon: Handshake, label: "Transparency", value: "No hidden fees", note: "the rate you're quoted is the rate you pay" },
  { icon: Building, label: "Reach", value: "12 branches", note: "across Uganda's growing regions" },
];

const TrustBar = () => {
  return (
    <section id="trust" className="px-5 md:px-14 py-12 md:py-20 bg-[#F6F8FA]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className={`${display.className} text-xl md:text-2xl lg:text-3xl font-medium tracking-tight mb-6 md:mb-10 text-[#111111]`}>
            Why farmers put their savings with us
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {TRUST_POINTS.map((t, i) => {
            const Icon = t.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="rounded-xl md:rounded-2xl border border-[#E8ECF0] p-4 md:p-6 bg-white h-full">
                  <div
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-3 md:mb-4"
                    style={{ background: `${YPA_BLUE}12` }}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5" style={{ color: YPA_BLUE }} />
                  </div>
                  <div className={`${mono.className} text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-[#5B6B7A]`}>
                    {t.label}
                  </div>
                  <div className="text-lg md:text-xl font-medium mt-0.5 text-[#111111]">
                    {t.value}
                  </div>
                  <p className="text-xs md:text-sm mt-1 md:mt-2 font-light leading-relaxed text-[#5B6B7A]">
                    {t.note}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// SIGNAL — Mobile Optimized
// ============================================================
const Signal = ({ signalArticles }: { signalArticles: any[] }) => {
  if (!signalArticles || signalArticles.length === 0) return null;

  const featured = signalArticles.find((a) => a.big === true) || signalArticles[0] || null;
  const rest = signalArticles.filter((a) => a.slug !== featured?.slug) || [];

  return (
    <section id="signal" className="px-5 md:px-14 py-16 md:py-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className={`${display.className} text-[11px] md:text-[13px] mb-2 text-[#5B6B7A]`}>
              Field notes
            </div>
            <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-[#111111]`}>
              Inside YPA
            </h2>
          </div>
          <Link
            href="/signal"
            className="inline-flex items-center gap-2 text-sm font-medium group transition-all hover:gap-3 text-[#00AEEF]"
          >
            View all stories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {featured && (
          <ScrollReveal className="md:row-span-2">
            <Link href={`/signal/${featured.slug}`} className="group block h-full">
              <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px] md:min-h-[420px]">
                <Image
                  src={
                    featured.image?.startsWith("http") 
                      ? featured.image 
                      : featured.image 
                        ? `${API_URL}/assets/${featured.image}` 
                        : FALLBACK_IMAGES.default
                  }
                  alt={featured.title}
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  quality={75}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGES.default;
                  }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060B14 10%, transparent 55%)" }} />
                <div className="absolute bottom-0 p-4 md:p-7">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-medium text-white mb-2 md:mb-4 bg-[#00AEEF]"
                  >
                    {featured.tag}
                  </span>
                  <h3 className={`${display.className} text-lg md:text-2xl lg:text-3xl text-white font-medium leading-snug`}>
                    {featured.title}
                  </h3>
                  <p className="text-white/55 text-xs md:text-sm font-light mt-1 md:mt-2">{featured.description}</p>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        )}

        <div className="grid gap-4 md:gap-6">
          {rest.slice(0, 2).map((item, i) => (
            <ScrollReveal key={i} delay={0.08 + i * 0.06}>
              <Link href={`/signal/${item.slug}`} className="group flex gap-3 md:gap-5 items-center">
                <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-xl md:rounded-2xl overflow-hidden shrink-0">
                  <Image
                    src={item.image?.startsWith("http") ? item.image : `${API_URL}/assets/${item.image}`}
                    alt={item.title}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    quality={70}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGES.default;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] md:text-[10px] font-medium tracking-wide uppercase text-[#00AEEF]">
                    {item.tag}
                  </span>
                  <h4 className={`${display.className} text-base md:text-lg font-medium leading-snug mt-0.5 text-[#111111] line-clamp-2`}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] md:text-xs text-[#5B6B7A]">
                    <Clock className="h-3 w-3" />
                    {item.readTime} read
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// MEMBER VOICES — Mobile Optimized
// ============================================================
const VOICES = [
  { quote: "I know exactly what my goats are worth before I ever sell one.", role: "Goats Programme member, Central Region" },
  { quote: "The SACCO pays out on my schedule, not a bank's.", role: "SACCO member, 4 years" },
  { quote: "Contract farming took the guessing out of maize season.", role: "Maize Programme member, Western Region" },
  { quote: "Every fee was explained before I signed anything.", role: "SACCO member, 2 years" },
];

const MemberVoices = () => {
  const reduceMotion = useReducedMotion();
  const track = [...VOICES, ...VOICES];

  return (
    <section id="voices" className="py-12 md:py-20 overflow-hidden border-y border-[#1F3B57] bg-[#0E2540]">
      <ScrollReveal className="px-5 md:px-14 max-w-7xl mx-auto mb-6 md:mb-10">
        <div className={`${display.className} text-[11px] md:text-[13px] text-white/40 mb-2`}>
          In their own words
        </div>
        <h2 className={`${display.className} text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-white`}>
          Member Voices
        </h2>
      </ScrollReveal>

      <motion.div
        className="flex gap-4 md:gap-6 px-5"
        animate={reduceMotion ? {} : { x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {track.map((v, i) => (
          <div
            key={i}
            className="shrink-0 w-[280px] md:w-[340px] rounded-xl md:rounded-2xl border border-[#1F3B57] p-4 md:p-6 bg-[#153455]"
          >
            <p className={`${display.className} text-white/90 text-base md:text-lg leading-snug`}>&ldquo;{v.quote}&rdquo;</p>
            <p className={`${mono.className} text-[10px] md:text-[11px] text-white/40 mt-3 md:mt-4 tracking-wide`}>{v.role}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

// ============================================================
// PRESS SIGNAL — Mobile Optimized
// ============================================================
const PressSignal = ({ pressItems }: { pressItems: any[] }) => {
  const press = pressItems || [];
  if (press.length === 0) return null;

  return (
    <section id="press" className="px-5 md:px-14 py-16 md:py-24 max-w-5xl mx-auto">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className={`${display.className} text-[11px] md:text-[13px] mb-2 text-[#5B6B7A]`}>
              As covered by
            </div>
            <h2 className={`${display.className} text-2xl md:text-3xl font-medium tracking-tight text-[#111111]`}>
              Press Signal
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium group text-[#00AEEF]"
          >
            Open the media center
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="divide-y divide-[#E8ECF0]">
        {press.slice(0, 3).map((item, i) => {
          const Icon = typeIcons[item.type as keyof typeof typeIcons] || Newspaper;
          return (
            <ScrollReveal key={i} delay={i * 0.05}>
              <Link href={item.link || "#"} target="_blank" className="group flex items-center gap-3 md:gap-5 py-4 md:py-6">
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${YPA_BLUE}12` }}
                >
                  <Icon className="h-3 w-3 md:h-4 md:w-4" style={{ color: YPA_BLUE }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm md:text-base font-medium truncate group-hover:underline text-[#111111]"
                  >
                    {item.title}
                  </h4>
                  <p className={`${mono.className} text-[10px] md:text-[11px] mt-0.5 text-[#5B6B7A]`}>
                    {item.outlet} · {item.date ? new Date(item.date).toLocaleDateString() : ""}
                  </p>
                </div>
                <ExternalLink className="h-3 w-3 md:h-4 md:w-4 shrink-0 opacity-30 group-hover:opacity-100 transition-opacity text-[#111111]" />
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

// ============================================================
// SOCIAL MEDIA — Mobile Optimized
// ============================================================
const LinkedinIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const YoutubeIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const InstagramIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);
const FacebookIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const SocialMedia = () => {
  const socials = [
    { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
    { icon: YoutubeIcon, href: "#", label: "YouTube" },
    { icon: InstagramIcon, href: "#", label: "Instagram" },
    { icon: FacebookIcon, href: "#", label: "Facebook" },
  ];
  return (
    <section className="px-5 py-8 md:px-14 md:py-10 max-w-7xl mx-auto text-center border-t border-[#E8ECF0]">
      <ScrollReveal>
        <div className="flex justify-center gap-6 md:gap-8">
          {socials.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="transition-colors text-[#5B6B7A] hover:text-[#00AEEF]"
                aria-label={s.label}
              >
                <Icon />
              </motion.a>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
};

// ============================================================
// FINAL CTA — Mobile Optimized
// ============================================================
const FinalCTA = () => {
  return (
    <section id="cta" className="relative px-5 py-20 md:py-32 overflow-hidden bg-[#111111]">
      <div className="absolute inset-0">
        <div className="absolute top-[-50%] right-[-15%] w-[300px] md:w-[700px] h-[300px] md:h-[700px] rounded-full blur-3xl bg-[#00AEEF]/10" />
        <div className="absolute bottom-[-50%] left-[-15%] w-[300px] md:w-[700px] h-[300px] md:h-[700px] rounded-full blur-3xl bg-[#33C1F5]/10" />
      </div>

      <ScrollReveal className="relative z-10 max-w-2xl mx-auto text-center">
        <div
          className="mx-auto mb-4 md:mb-6 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl border border-white/10 bg-white/5"
        >
          <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-[#00AEEF]" />
        </div>
        <h2 className={`${display.className} text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white mb-3 md:mb-4`}>
          What would a decade in agribusiness do for your income?
        </h2>
        <p className="text-white/40 font-light mb-6 md:mb-10 max-w-md mx-auto text-xs md:text-sm">
          Over 1,000 members are already finding out. Registered with URSB, built on transparency, running since 2014.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link
            href="/projects"
            className="group rounded-full px-6 md:px-8 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 bg-[#00AEEF] shadow-lg"
          >
            Explore the Lineup
            <ArrowRight className="inline-block h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/15 px-6 md:px-8 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
          >
            Ask us a question
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
};

// ============================================================
// LIVE PANEL — Hidden on Mobile, Visible on Large Screens
// ============================================================
const LivePanel = ({ events, blogs }: { events: any[]; blogs: any[] }) => {
  const GOLD = "#F0B429";
  
  const facts = [
    { icon: Target, title: "Our Mission", description: "Empowering Africa's youth through sustainable agribusiness and financial inclusion." },
    { icon: Heart, title: "Our Impact", description: "130,000+ goats under care. 1,000+ SACCO members. 12 branches across Uganda." },
    { icon: Lightbulb, title: "Our Vision", description: "A prosperous Africa where every young farmer has the tools to succeed." },
    { icon: Shield, title: "Our Promise", description: "100% transparency. No hidden fees. Registered with URSB." },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % facts.length), 4500);
    return () => clearInterval(t);
  }, [facts.length]);

  const isEventSoon = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  };

  // Hidden on mobile, visible on xl screens
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed right-6 top-24 z-40 hidden xl:block w-80 max-h-[78vh] overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div
        className="rounded-3xl p-6 shadow-2xl border border-white/15"
        style={{ 
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: `0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px ${YPA_BLUE}15 inset, 0 0 40px ${YPA_BLUE}08, 0 0 20px ${GOLD}05`,
        }}
      >
        <div className="mb-6">
          <div className={`${mono.className} flex items-center gap-2 mb-4 text-[10px] tracking-[0.2em] uppercase text-white/80`}>
            <span className="w-1 h-4 rounded-full" style={{ background: `linear-gradient(to bottom, ${YPA_BLUE}, ${GOLD})` }} />
            About YPA
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: `linear-gradient(135deg, ${YPA_BLUE}30, ${GOLD}20)` }}
              >
                {(() => {
                  const Icon = facts[active].icon;
                  return <Icon className="w-5 h-5" style={{ color: YPA_BLUE }} />;
                })()}
              </div>
              <h4 className="text-base font-medium text-white">{facts[active].title}</h4>
              <p className="mt-2 text-sm text-white/70 font-light leading-relaxed">{facts[active].description}</p>
              <div className="flex gap-1.5 mt-4">
                {facts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ 
                      width: i === active ? "22px" : "10px", 
                      background: i === active ? `linear-gradient(90deg, ${YPA_BLUE}, ${GOLD})` : "rgba(255,255,255,0.2)" 
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {events?.length > 0 && (
          <>
            <div className="border-t my-4 border-white/10" />
            <div className="mb-6">
              <div className={`${mono.className} flex items-center gap-2 mb-3 text-[10px] tracking-[0.2em] uppercase text-white/70`}>
                <span className="w-1 h-4 rounded-full" style={{ background: GOLD }} />
                Upcoming Events
              </div>
              <div className="space-y-2">
                {events.slice(0, 3).map((event, i) => {
                  const soon = isEventSoon(event.date);
                  return (
                    <Link key={i} href={`/events/${event.slug}`}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          soon ? "ring-2 ring-[#F0B429] ring-opacity-60 animate-pulse" : ""
                        }`}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          borderColor: soon ? "rgba(240,180,41,0.5)" : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <div className="text-sm font-medium text-white line-clamp-1">{event.title}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{event.date ? new Date(event.date).toLocaleDateString() : "TBD"}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{event.location || "Uganda"}</span>
                          {soon && <span className="ml-auto text-[10px] font-medium text-[#F0B429]">Soon</span>}
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {blogs?.length > 0 && (
          <>
            <div className="border-t my-4 border-white/10" />
            <div>
              <div className={`${mono.className} flex items-center gap-2 mb-3 text-[10px] tracking-[0.2em] uppercase text-white/70`}>
                <span className="w-1 h-4 rounded-full" style={{ background: YPA_BLUE }} />
                Popular Blogs
              </div>
              <div className="space-y-2">
                {blogs.slice(0, 3).map((blog, i) => (
                  <Link key={i} href={`/blog/${blog.slug}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 p-3 rounded-xl border transition-all duration-300"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0" style={{ 
                        background: `linear-gradient(135deg, ${YPA_BLUE}40, ${GOLD}20)` 
                      }}>
                        {blog.featured_image ? (
                          <Image
                            src={`${API_URL}/assets/${blog.featured_image}`}
                            alt={blog.title}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            quality={60}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_IMAGES.default;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <BookOpen className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white line-clamp-2">{blog.title}</div>
                        <div className="text-[11px] text-white/50 mt-0.5">
                          {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "Recent"}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================
export default function Home() {
  const [press, setPress] = useState([]);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [signalArticles, setSignalArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [p, e, b, s] = await Promise.all([
          getPressCoverage(),
          getEvents(),
          getBlogPosts(),
          getSignalArticles(),
        ]);
        setPress(p);
        setEvents(e);
        setBlogs(b);
        setSignalArticles(s);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <main className={`${display.variable} ${mono.variable} min-h-screen bg-white`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-[3px] rounded-full border-[#E3F2FD] border-t-[#00AEEF]"
          />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main
      className={`${display.variable} ${mono.variable} min-h-screen bg-white font-sans antialiased selection:bg-[#00AEEF]/30`}
    >
      <ScrollProgress />
      <Navigation />
      <SectionRail />
      <Hero />
      <FieldIndex />
      <ExploreRail />
      <TheLineup />
      <TrustBar />
      <Signal signalArticles={signalArticles} />
      <MemberVoices />
      <PressSignal pressItems={press} />
      <SocialMedia />
      <FinalCTA />
      <LivePanel events={events} blogs={blogs} />
      <Footer />
    </main>
  );
}