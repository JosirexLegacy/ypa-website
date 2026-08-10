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
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Pause,
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
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Camera,
  Film,
  GraduationCap,
  Tractor,
  Utensils,
  Layers,
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
const VOID = "#0A0A0B";

// ============================================================
// API BASE
// ============================================================
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

async function getBlogPosts() {
  try {
    const res = await fetch(
      `${API_URL}/items/posts?filter[status][_eq]=published&sort[]=-featured&sort[]=-published_at&limit=4`,
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
// EASE & SPRING
// ============================================================
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 300, damping: 32, mass: 0.8 } as const;

// ============================================================
// HERO LINEUP
// ============================================================
const LINEUP = [
  {
    kicker: "Programme 01 — Goats & Livestock",
    tag: "Goats",
    line: "Africa's leading goat farmers, managing over 130,000 goats with professional herders, vets, and insurance so members farm without the guesswork.",
    specs: [
      { label: "Goats managed", value: "130,000+" },
      { label: "Member success", value: "95%" },
      { label: "Market access", value: "Ready buyers" },
    ],
    href: "/projects/goats",
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784717058/45fe9ef5-891c-40ff-87b1-d0eda8eb6a73.jpg",
  },
  {
    kicker: "Programme 02 — Maize & Cropping",
    tag: "Maize",
    line: "Thousands of acres farmed under structured agreements quality inputs, trained agronomists, and buyers lined up before planting even starts.",
    specs: [
      { label: "Land farmed", value: "5,000+ acres" },
      { label: "Support", value: "Agronomist-led" },
      { label: "Buyers", value: "Contracted" },
    ],
    href: "/projects/maize",
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784803273/maizee_kkke6y.jpg",
  },
  {
    kicker: "Programme 03 — YPA SACCO",
    tag: "SACCO",
    line: "Savings and credit built around the farming calendar, so members' money moves with their harvest, not against it.",
    specs: [
      { label: "Branches", value: "12" },
      { label: "Members served", value: "18,000+" },
      { label: "Running since", value: "2014" },
    ],
    href: "/sacco",
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784717198/508159ef-6c90-4578-b1fb-dff1534873f4.jpg",
  },
];

// ============================================================
// DRONE FOOTAGE — Easy to add more videos
// ============================================================
const DRONE_FOOTAGE = [
  {
    id: 1,
    videoId: "ULOKzJezKc8",
    title: "The Herd in Motion",
    subtitle: "Aerial view — the Goats Programme",
    tag: "LIVESTOCK",
    color: YPA_BLUE,
    location: "Mubende District, Uganda",
    stat: "130,000+ under care",
  },
  {
    id: 2,
    videoId: "lKkeDNTbtho",
    title: "Fields Under Contract",
    subtitle: "Aerial view — Maize & Contract Farming",
    tag: "CROPPING",
    color: GOLD,
    location: "Central Region, Uganda",
    stat: "5,000+ acres cultivated",
  },
  {
    id: 3,
    videoId: "_iT3kN3sEgk",
    title: "Twelve Branches, One Ledger",
    subtitle: "Aerial view — YPA SACCO",
    tag: "FINANCE",
    color: YPA_BLUE_LIGHT,
    location: "Kampala, Uganda",
    stat: "12 branches nationwide",
  },
];

// ============================================================
// HERO STAGGER
// ============================================================
const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.35, ease: EASE } },
};

// ============================================================
// GRAIN OVERLAY
// ============================================================
const GrainOverlay = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay opacity-[0.35]" aria-hidden="true">
    <filter id="ypaGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.04 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#ypaGrain)" />
  </svg>
);

// ============================================================
// GLOW SEAL — shared signature element
// ============================================================
const GlowSeal = ({ label = "Youth Platform Africa · Est. 2008" }: { label?: string }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? {} : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="inline-flex items-center gap-2.5 rounded-full pl-2 pr-4 py-1.5 w-fit"
      style={{ background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.32)" }}
    >
      <motion.span
        className="flex h-6 w-6 items-center justify-center rounded-full shrink-0"
        style={{ background: GOLD }}
        animate={
          reduceMotion
            ? {}
            : {
                boxShadow: [
                  `0 0 0px ${GOLD}00`,
                  `0 0 14px ${GOLD}90, 0 0 28px ${GOLD}40`,
                  `0 0 0px ${GOLD}00`,
                ],
              }
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Award className="h-3.5 w-3.5" style={{ color: VOID }} />
      </motion.span>
      <span
        className={`${mono.className} text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-medium whitespace-nowrap`}
        style={{ color: GOLD }}
      >
        {label}
      </span>
    </motion.div>
  );
};

// ============================================================
// SCROLL PROGRESS
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
// SECTION RAIL
// ============================================================
const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "index", label: "Field Index" },
  { id: "explore", label: "Ecosystem" },
  { id: "lineup", label: "The Agribusiness Projects" },
  { id: "trust", label: "Why Trust Us" },
  { id: "signal", label: "Inside YPA" },
  { id: "voices", label: "Member Voices" },
  { id: "blog", label: "Blog" },
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
// SCROLL REVEAL
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
// HERO — Polished with better geometry and mobile responsiveness
// ============================================================
const Hero = () => {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setInterval(() => setI((p) => (p + 1) % LINEUP.length), 6800);
    return () => clearInterval(t);
  }, [paused, reduceMotion]);

  const current = LINEUP[i];

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: VOID }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image + treatment */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={current.image}
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{
              opacity: { duration: 1.6, ease: EASE },
              scale: { duration: 7, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <img
              src={current.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "grayscale(0.55) brightness(0.55) contrast(1.05)" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Multiple gradient layers for depth */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `radial-gradient(ellipse at 30% 40%, ${YPA_BLUE}15, transparent 70%)`,
            mixBlendMode: "color",
          }} 
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${VOID} 0%, rgba(10,10,11,0.55) 28%, rgba(10,10,11,0.72) 62%, ${VOID} 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${VOID} 0%, rgba(10,10,11,0.32) 40%, rgba(10,10,11,0.25) 62%, ${VOID} 100%)`,
          }}
        />
        <GrainOverlay />
      </div>

      {/* Geometric grid pattern for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(180deg, #000 0%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, transparent 70%)",
        }}
      />

      {/* Ambient glow — the signature breathing light */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 w-[520px] h-[520px] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${YPA_BLUE}30 0%, ${GOLD}14 45%, transparent 70%)` }}
        animate={reduceMotion ? {} : { opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary ambient glow for symmetry */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-1/3 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, ${GOLD}20 0%, transparent 70%)` }}
        animate={reduceMotion ? {} : { opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Corner accents for geometry */}
      <div className="absolute top-8 right-8 w-12 h-12 pointer-events-none hidden md:block">
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M48 0V48H0" stroke="rgba(240,180,41,0.15)" strokeWidth="1" />
          <path d="M48 8V48H8" stroke="rgba(240,180,41,0.08)" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-8 left-8 w-12 h-12 pointer-events-none hidden md:block">
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M0 48V0H48" stroke="rgba(240,180,41,0.15)" strokeWidth="1" />
          <path d="M0 40V0H40" stroke="rgba(240,180,41,0.08)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Desktop lineup selector, right rail - Symmetrical positioning */}
      <div className="hidden lg:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-20">
        {LINEUP.map((item, idx) => {
          const isActive = idx === i;
          return (
            <button
              key={item.tag}
              onClick={() => setI(idx)}
              className="group flex items-center gap-3 justify-end"
              aria-label={`Show ${item.tag}`}
            >
              <span
                className={`${inter.className} text-[11px] tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap`}
                style={{
                  color: isActive ? "#F5F6F7" : "rgba(245,246,247,0.35)",
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateX(0)" : "translateX(6px)",
                }}
              >
                {item.tag}
              </span>
              <motion.span
                className="relative flex items-center justify-center rounded-full"
                animate={{
                  width: isActive ? 34 : 22,
                  backgroundColor: isActive ? GOLD : "rgba(255,255,255,0.25)",
                  boxShadow: isActive ? `0 0 10px ${GOLD}80` : "0 0 0px transparent",
                }}
                transition={SPRING}
                style={{ height: "2px" }}
              />
              <span
                className={`${mono.className} text-[10px] w-4 text-right transition-colors duration-300`}
                style={{ color: isActive ? GOLD : "rgba(255,255,255,0.3)" }}
              >
                0{idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main content - Improved spacing and symmetry */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center px-5 md:px-14 py-24">
        <div className="max-w-4xl">
          <GlowSeal />

          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-3 mt-5 mb-6"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                style={{ background: YPA_BLUE }}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: YPA_BLUE }} />
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={current.kicker}
                initial={reduceMotion ? {} : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? {} : { opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={`${mono.className} text-[10px] tracking-[0.25em] uppercase`}
                style={{ color: YPA_BLUE_LIGHT }}
              >
                {current.kicker}
              </motion.span>
            </AnimatePresence>
            <span className="h-px flex-1 max-w-[64px]" style={{ background: "rgba(240,180,41,0.35)" }} />
            <span
              className={`${mono.className} text-[10px] tracking-[0.2em] uppercase text-white/30 hidden sm:inline`}
            >
              Registered with URSB
            </span>
          </motion.div>

          {/* Brand headline - Refined typography */}
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
            className="relative"
          >
            <h1
              className={`${display.className} text-4xl sm:text-5xl md:text-6xl lg:text-[5.25rem] font-medium leading-[0.98] tracking-tight max-w-3xl`}
              style={{ color: "#F5F6F7" }}
            >
              Africa's {"GREATEST"}
              <span
                className={`${serif.className} italic relative inline-block`}
                style={{
                  color: YPA_BLUE_LIGHT,
                  textShadow: `0 0 24px ${YPA_BLUE}70, 0 0 54px ${YPA_BLUE}35`,
                }}
              >
                Farm Management
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${YPA_BLUE}80, ${YPA_BLUE_LIGHT}40, transparent)`,
                    width: "80%",
                  }}
                />
              </span>{" "}
              Company.
            </h1>

            <p
              className={`${inter.className} mt-5 text-sm sm:text-base md:text-lg font-light max-w-lg leading-relaxed`}
              style={{ color: "rgba(245,246,247,0.62)" }}
            >
              We manage farms, build profitable agricultural projects, and empower individuals and communities through modern agribusiness real land, real livestock, real people, run with operational discipline.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={i} variants={heroStagger} initial="hidden" animate="show" exit="exit">
              <motion.p
                variants={heroItem}
                className={`${inter.className} mt-6 text-sm md:text-[15px] font-light max-w-lg leading-relaxed border-l-2 pl-4`}
                style={{ color: "rgba(245,246,247,0.5)", borderColor: "rgba(0,174,239,0.4)" }}
              >
                {current.line}
              </motion.p>

              <motion.div
                variants={heroItem}
                className="mt-8 flex items-stretch gap-0 max-w-xl border-t border-b relative"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <span
                  className="absolute -top-px left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, ${GOLD}60, transparent 60%)` }}
                />
                {current.specs.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex-1 py-4 px-4 sm:px-5"
                    style={{ borderLeft: idx > 0 ? "1px solid rgba(255,255,255,0.1)" : "none" }}
                  >
                    <div
                      className={`${mono.className} text-[9px] tracking-[0.15em] uppercase mb-1`}
                      style={{ color: "rgba(245,246,247,0.4)" }}
                    >
                      {s.label}
                    </div>
                    <div
                      className={`${display.className} text-lg sm:text-xl md:text-2xl font-medium`}
                      style={{ color: idx === 0 ? GOLD : "#F5F6F7" }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons - Improved styling */}
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              href="/projects"
              className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 overflow-hidden"
              style={{ background: YPA_BLUE, color: VOID }}
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Explore Our Projects
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 border hover:bg-white/5"
              style={{ borderColor: "rgba(240,180,41,0.35)", color: "#F5F6F7" }}
            >
              <span className="relative flex items-center gap-2">
                <Play className="h-4 w-4" style={{ color: GOLD }} />
                See How YPA Works
              </span>
            </Link>
          </motion.div>

          {/* Mobile lineup selector - Improved touch targets */}
          <div className="flex lg:hidden gap-2 mt-10 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
            {LINEUP.map((item, idx) => {
              const isActive = idx === i;
              return (
                <motion.button
                  key={item.tag}
                  onClick={() => setI(idx)}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    borderColor: isActive ? GOLD : "rgba(255,255,255,0.15)",
                    color: isActive ? GOLD : "rgba(245,246,247,0.4)",
                    backgroundColor: isActive ? "rgba(240,180,41,0.08)" : "rgba(255,255,255,0)",
                    boxShadow: isActive ? `0 0 20px rgba(240,180,41,0.15)` : "0 0 0px transparent",
                  }}
                  transition={SPRING}
                  className={`${mono.className} flex-1 min-w-[80px] rounded-full py-2.5 text-[10px] tracking-[0.12em] uppercase border transition-all duration-300`}
                >
                  {item.tag}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom-right locale tag - Refined */}
      <div className="hidden md:flex absolute bottom-8 right-8 z-10 items-center gap-2">
        <span className="relative flex h-1 w-1">
          <span className="relative inline-flex h-1 w-1 rounded-full" style={{ background: GOLD }} />
        </span>
        <span className={`${mono.className} text-[9px] tracking-[0.2em] uppercase text-white/30`}>
          Kampala, Uganda
        </span>
      </div>

      {/* Scroll cue - Better animation */}
      <div className="absolute bottom-8 left-5 md:left-14 z-10">
        <a href="#index" className="flex items-center gap-2 group">
          <motion.div
            animate={reduceMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <ChevronDown className="h-4 w-4" style={{ color: "rgba(245,246,247,0.4)" }} />
            <span
              className={`${inter.className} text-[9px] tracking-[0.3em] uppercase group-hover:text-white/60 transition-colors`}
              style={{ color: "rgba(245,246,247,0.4)" }}
            >
              Explore
            </span>
          </motion.div>
        </a>
      </div>
    </section>
  );
};

// ============================================================
// FIELD INDEX
// ============================================================
const FIELD_INDEX = [
  { label: "Goats under care", value: "130,000+", delta: "95% success" },
  { label: "Active members", value: "18,000+", delta: "across all programmes" },
  { label: "Acres cultivated", value: "5,000+", delta: "maize programme" },
  { label: "Avg. yield uplift", value: "3.0×", delta: "vs. traditional farming", featured: true },
  { label: "Operating since", value: "2008", delta: "URSB registered" },
  { label: "Hidden fees", value: "0", delta: "by policy" },
];

const FieldIndex = () => {
  const reduceMotion = useReducedMotion();
  const track = [...FIELD_INDEX, ...FIELD_INDEX];

  return (
    <section id="index" className="relative overflow-hidden py-3" style={{ background: VOID, borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 px-5 md:px-14 pb-2.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: YPA_BLUE }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: YPA_BLUE }} />
        </span>
        <span className={`${mono.className} text-[10px] sm:text-[11px] tracking-[0.15em] uppercase`} style={{ color: "rgba(245,246,247,0.45)" }}>
          Field Index
        </span>
        <span className="text-white/15">—</span>
        <span className={`${mono.className} text-[10px] sm:text-[11px]`} style={{ color: YPA_BLUE_LIGHT }}>
          live across 12 branches
        </span>
      </div>

      <div className="relative py-1">
        <motion.div
          className="flex items-center gap-0 px-5 md:px-14"
          animate={reduceMotion ? {} : { x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {track.map((m, idx) => (
            <div key={idx} className="flex items-center shrink-0">
              <div className="flex items-baseline gap-2 pr-6">
                <span className={`${mono.className} text-lg sm:text-xl font-medium`} style={{ color: m.featured ? GOLD : "#F5F6F7" }}>
                  {m.value}
                </span>
                <span className={`${inter.className} text-[10px] sm:text-[11px]`} style={{ color: "rgba(245,246,247,0.4)" }}>
                  {m.label}
                </span>
                <span className={`${mono.className} text-[9px] uppercase tracking-wide`} style={{ color: "rgba(0,174,239,0.6)" }}>
                  {m.delta}
                </span>
              </div>
              <span className="pr-6 select-none" style={{ color: "rgba(240,180,41,0.4)" }} aria-hidden="true">
                ·
              </span>
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-12 md:w-28 pointer-events-none" style={{ background: `linear-gradient(90deg, ${VOID}, transparent)` }} />
        <div className="absolute inset-y-0 right-0 w-12 md:w-28 pointer-events-none" style={{ background: `linear-gradient(270deg, ${VOID}, transparent)` }} />
      </div>
    </section>
  );
};

// ============================================================
// AERIAL SHOWCASE — manual, lightweight, one video mounted at a time
// ============================================================
const AerialShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const thumbRailRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    const total = DRONE_FOOTAGE.length;
    setActiveIndex(((index % total) + total) % total);
    setPlaying(false);
  }, []);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const rail = thumbRailRef.current;
    const activeThumb = rail?.children[activeIndex] as HTMLElement | undefined;
    if (rail && activeThumb) {
      const railRect = rail.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      if (thumbRect.left < railRect.left || thumbRect.right > railRect.right) {
        activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [activeIndex]);

  const totalVideos = DRONE_FOOTAGE.length;
  const footage = DRONE_FOOTAGE[activeIndex];

  return (
    <section className="relative overflow-hidden py-16 md:py-24" style={{ background: VOID }}>
      {/* Ambient glow — same language as the hero, static (no animated blur = no jank) */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[110px] pointer-events-none"
        style={{ background: footage.color, opacity: 0.08 }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[110px] pointer-events-none"
        style={{ background: GOLD, opacity: 0.05 }}
      />

      {/* Header */}
      <div className="relative z-10 px-5 md:px-14 mb-8 md:mb-12">
        <GlowSeal label="Field-Verified Aerial Footage" />

        <div className="flex items-end justify-between gap-4 mt-5 flex-wrap">
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-tight`}>
            The operation,{" "}
            <span
              className={`${serif.className} italic`}
              style={{ color: YPA_BLUE_LIGHT, textShadow: `0 0 24px ${YPA_BLUE}60` }}
            >
              from above
            </span>
          </h2>
          <span className={`${mono.className} text-[11px] text-white/35 tracking-[0.15em]`}>
            {String(activeIndex + 1).padStart(2, "0")} / {String(totalVideos).padStart(2, "0")}
          </span>
        </div>
        <p className="text-white/40 text-sm mt-3 max-w-2xl font-light">
          {totalVideos} field-verified locations across YPA's programmes. Tap a thumbnail or use the arrows — nothing moves until you tell it to.
        </p>
      </div>

      {/* Stage — one video mounted at a time, click-to-play (no forced autoplay on scroll) */}
      <div className="relative z-10 px-4 sm:px-5 md:px-14">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-[#0A0A0B]"
            style={{
              border: `1px solid ${footage.color}40`,
              boxShadow: `0 24px 64px -20px ${footage.color}30, 0 0 0 1px ${footage.color}10 inset`,
            }}
          >
            <AnimatePresence mode="wait">
              {playing ? (
                <motion.iframe
                  key={`playing-${footage.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${footage.videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`}
                  title={footage.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  frameBorder={0}
                />
              ) : (
                <motion.button
                  key={`poster-${footage.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 w-full h-full group"
                  aria-label={`Play ${footage.title}`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${footage.videoId}/hqdefault.jpg`}
                    alt={footage.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ filter: "brightness(0.5) saturate(0.65)" }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full backdrop-blur-sm border transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${footage.color}22`, borderColor: `${footage.color}55` }}
                    >
                      <Play className="h-5 w-5 md:h-6 md:w-6 text-white ml-1" />
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <span
                      className={`${mono.className} text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border backdrop-blur-sm`}
                      style={{ background: `${footage.color}22`, borderColor: `${footage.color}45`, color: footage.color }}
                    >
                      {footage.tag}
                    </span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Caption — crossfades with the active clip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={footage.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="pt-4 md:pt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`${mono.className} text-[9px] tracking-[0.18em] uppercase`} style={{ color: footage.color }}>
                    {footage.subtitle}
                  </span>
                  <span className="w-px h-3 hidden sm:inline-block" style={{ background: `${footage.color}30` }} />
                  <span className={`${mono.className} text-[9px] text-white/35 hidden sm:inline`}>{footage.location}</span>
                </div>
                <h3 className={`${display.className} text-base sm:text-lg md:text-xl font-medium text-white mt-1`}>
                  {footage.title}
                </h3>
              </div>
              <span className={`${mono.className} text-[10px] text-white/40 shrink-0`}>{footage.stat}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Manual controls */}
      <div className="relative z-10 flex items-center justify-center gap-3 md:gap-4 mt-8 md:mt-10 px-4">
        <button
          onClick={prev}
          aria-label="Previous footage"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border shrink-0 transition-colors duration-200 active:scale-95 hover:bg-white/5"
          style={{ borderColor: "rgba(240,180,41,0.3)", color: "#F5F6F7" }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Thumbnail rail — native scroll, no JS drag physics, fully manual */}
        <div
          ref={thumbRailRef}
          className="flex gap-2.5 md:gap-3 overflow-x-auto max-w-[68vw] sm:max-w-[420px] md:max-w-[560px] px-1 py-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {DRONE_FOOTAGE.map((f, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={f.id}
                onClick={() => goTo(index)}
                aria-label={`Show ${f.title}`}
                className="relative shrink-0 rounded-lg overflow-hidden transition-all duration-200"
                style={{
                  width: isActive ? "76px" : "60px",
                  height: isActive ? "48px" : "40px",
                  border: `2px solid ${isActive ? f.color : "rgba(255,255,255,0.12)"}`,
                  opacity: isActive ? 1 : 0.55,
                  scrollSnapAlign: "center",
                }}
              >
                <img
                  src={`https://img.youtube.com/vi/${f.videoId}/default.jpg`}
                  alt={f.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ filter: isActive ? "none" : "grayscale(0.4) brightness(0.7)" }}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={next}
          aria-label="Next footage"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border shrink-0 transition-colors duration-200 active:scale-95 hover:bg-white/5"
          style={{ borderColor: "rgba(240,180,41,0.3)", color: "#F5F6F7" }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* CTAs */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-9 md:mt-14 px-5">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 rounded-full px-6 md:px-8 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(0,174,239,0.5)]"
          style={{ background: YPA_BLUE, color: VOID }}
        >
          Explore Our Projects
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 rounded-full px-6 md:px-8 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 border hover:bg-white/5"
          style={{ borderColor: "rgba(240,180,41,0.25)", color: "#F5F6F7" }}
        >
          Become a Member
          <Users className="h-4 w-4" style={{ color: GOLD }} />
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: `linear-gradient(to top, ${VOID}, transparent)` }} />
    </section>
  );
};

// ============================================================
// EXPLORE ECOSYSTEM - Updated with full ecosystem navigation
// ============================================================
const ECOSYSTEM = [
  {
    q: "The complete YPA ecosystem — how everything connects",
    label: "The YPA Ecosystem",
    href: "/ecosystem",
    tall: true,
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1786356172/BZ6A9825_hkymyx.jpg",
    color: YPA_BLUE,
    tag: "Overview",
    icon: Layers,
  },
  {
    q: "From farm to market — our core agricultural projects",
    label: "YPA Projects",
    href: "/projects",
    tall: false,
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784803273/maizee_kkke6y.jpg",
    color: GOLD,
    tag: "Projects",
    icon: Sprout,
  },
  {
    q: "Save, invest, and grow with YPA Wealth Depot",
    label: "YPA Wealth Depot",
    href: "/sacco",
    tall: false,
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784727031/54b61dc1-469f-4363-8a52-4de7e285fa1b.jpg",
    color: YPA_BLUE_LIGHT,
    tag: "Finance",
    icon: Building,
  },
  {
    q: "Learn modern agribusiness at YPA Agribusiness School",
    label: "Agribusiness School",
    href: "/agribusiness-school",
    tall: true,
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784726249/3P0D0002_tg15tl.jpg",
    color: "#34D399",
    tag: "Education",
    icon: GraduationCap,
  },
  {
    q: "Access quality machinery and equipment for your farm",
    label: "YPA Machinery Hub",
    href: "/machinery-hub",
    tall: false,
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784803864/1233_kcholp.jpg",
    color: "#F59E0B",
    tag: "Equipment",
    icon: Tractor,
  },
  {
    q: "Experience farm-to-table at Mbuzi Choma Restaurant",
    label: "Mbuzi Choma Restaurant",
    href: "/mbuzi-choma",
    tall: false,
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784726488/2d86272b-4d19-41b6-b35e-7431ca4d7b7f.jpg",
    color: "#EF4444",
    tag: "Dining",
    icon: Utensils,
  },
];

const ExploreRail = () => {
  return (
    <section id="explore" className="px-5 md:px-14 py-16 md:py-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`${mono.className} text-[10px]`} style={{ color: GOLD }}>06</span>
              <span className="h-px w-5" style={{ background: "rgba(240,180,41,0.4)" }} />
              <span className={`${mono.className} text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
                Explore
              </span>
            </div>
            <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-[#111111]`}>
              The YPA <span style={{ color: YPA_BLUE }}>Ecosystem</span>
            </h2>
            <p className="text-[#5B6B7A] text-sm mt-2 max-w-lg">
              Six interconnected pillars driving agricultural transformation in Africa
            </p>
          </div>
          <span className={`${display.className} text-[11px] md:text-[13px] text-[#5B6B7A] flex items-center gap-2`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: YPA_BLUE }} />
            {ECOSYSTEM.length} pillars
          </span>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {ECOSYSTEM.map((item, i) => {
          const Icon = item.icon;
          return (
            <ScrollReveal key={i} delay={i * 0.04} className={item.tall ? "sm:row-span-2" : ""}>
              <Link href={item.href} className="group block h-full">
                <div
                  className={`relative h-full rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                    item.tall ? "min-h-[280px] sm:min-h-[320px]" : "min-h-[200px] sm:min-h-[220px]"
                  }`}
                  style={{ boxShadow: `0 4px 20px ${item.color}15` }}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGES.default;
                    }}
                  />
                  
                  {/* Gradient overlay with subtle color tint */}
                  <div
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(to top, #060B14 18%, rgba(6,11,20,0.45) 55%, rgba(6,11,20,0.2))`,
                    }}
                  />
                  
                  {/* Color accent overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${item.color}33, transparent 70%)` }}
                  />

                  {/* Category tag */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
                    <span
                      className={`${mono.className} text-[8px] md:text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm border flex items-center gap-1.5`}
                      style={{ 
                        background: `${item.color}22`, 
                        borderColor: `${item.color}40`,
                        color: item.color 
                      }}
                    >
                      <Icon className="h-3 w-3" />
                      {item.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-4 md:p-6">
                    <p className={`${display.className} text-base md:text-lg font-medium leading-snug text-white line-clamp-2`}>
                      {item.q}
                    </p>
                    <div className="flex items-center justify-between mt-3 md:mt-5">
                      <span className={`${mono.className} text-[9px] md:text-[10px] tracking-[0.12em] uppercase text-white/70 group-hover:text-white transition-colors`}>
                        {item.label}
                      </span>
                      <motion.span
                        className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full transition-all duration-300 shrink-0"
                        style={{ background: item.color }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-white" />
                      </motion.span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

// ============================================================
// THE LINEUP
// ============================================================
const CONFIG_CARDS = [
  {
    icon: Sprout,
    name: "The Goats Project",
    tag: "Livestock",
    stat: "130K+",
    statLabel: "under care",
    specs: ["Mubende × Boer × Kalahari", "95% member success rate", "Guaranteed market access"],
    href: "/projects/goats",
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1786356172/DJI_0017_g53jgu.jpg",
  },
  {
    icon: Leaf,
    name: "Maize",
    tag: "Cropping",
    stat: "5K+",
    statLabel: "acres cultivated",
    specs: ["Contracted buyers before harvest", "Agronomist-led yield gains", "Modern input support"],
    href: "/projects/maize",
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784803273/maizee_kkke6y.jpg",
  },
  {
    icon: Users,
    name: "CDC",
    tag: "",
    stat: "",
    statLabel: "members",
    specs: ["12 branches nationwide", "Loans built for farmers", "Member-owned since 2014"],
    href: "",
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1786357366/3P0D7976_fkxetu.jpg",
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
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
// WHY CHOOSE YPA
// ============================================================
const WHY_STATS = [
  { label: "Goats Managed", value: "130,000+", icon: Sprout, accent: GOLD },
  { label: "Active Members", value: "18,000+", icon: Users, accent: YPA_BLUE },
  { label: "Branches", value: "12", note: "Local & international", icon: Building, accent: YPA_BLUE },
  { label: "Countries", value: "3", note: "Uganda · Dubai · Zambia", icon: Globe, accent: GOLD },
];

const WHY_POINTS = [
  "Founded since 2008 — over a decade in the field",
  "Registered with URSB & the Uganda Investment Authority",
  "Local and international branch network",
  "Full transparency — the rate you're quoted is the rate you pay",
];

const TrustBar = () => {
  return (
    <section id="trust" className="px-5 md:px-14 py-16 md:py-24 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="mb-8 md:mb-12">
          <div className="flex items-center gap-2.5">
            <span className={`${mono.className} text-[10px]`} style={{ color: GOLD }}>05</span>
            <span className="h-px w-5" style={{ background: "rgba(240,180,41,0.4)" }} />
            <span className={`${mono.className} text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
              Why Trust Us
            </span>
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight mt-3 max-w-xl text-[#111111]`}>
            Why thousands are choosing YPA
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 border rounded-2xl overflow-hidden" style={{ borderColor: "#E8ECF0" }}>
            {WHY_STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="p-4 md:p-6"
                  style={{
                    borderLeft: i % 2 !== 0 ? "1px solid #E8ECF0" : undefined,
                    borderTop: i >= 2 ? "1px solid #E8ECF0" : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.accent}12` }}>
                      <Icon className="h-4 w-4" style={{ color: s.accent }} />
                    </div>
                    <span className={`${mono.className} text-[9px]`} style={{ color: "rgba(91,107,122,0.5)" }}>0{i + 1}</span>
                  </div>
                  <div className={`${display.className} text-xl md:text-2xl lg:text-3xl font-medium`} style={{ color: "#111111" }}>{s.value}</div>
                  <div className={`${mono.className} text-[9px] md:text-[10px] tracking-[0.1em] uppercase mt-1`} style={{ color: "#5B6B7A" }}>{s.label}</div>
                  {s.note && <div className="text-[10px] md:text-[11px] font-light mt-1" style={{ color: "#5B6B7A" }}>{s.note}</div>}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-6 md:mt-8">
          <div className="grid sm:grid-cols-2 gap-2 md:gap-3">
            {WHY_POINTS.map((point, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border p-3.5 md:p-4"
                style={{ borderColor: "#EEF1F3", background: "#F6F8FA" }}
              >
                <span className={`${mono.className} text-sm shrink-0`} style={{ color: GOLD }}>➔</span>
                <span className="text-xs md:text-sm font-light" style={{ color: "#3E4C59" }}>{point}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

// ============================================================
// SIGNAL
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
// MEMBER VOICES
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
// RECENT BLOG SECTION
// ============================================================
const RecentBlogs = ({ blogs }: { blogs: any[] }) => {
  if (!blogs || blogs.length === 0) return null;

  const featured = blogs[0];
  const rest = blogs.slice(1, 4);

  return (
    <section id="blog" className="px-5 md:px-14 py-16 md:py-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <span className={`${mono.className} text-[11px] md:text-[13px] text-[#5B6B7A] mb-2 block`}>
              Latest Stories
            </span>
            <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-[#111111]`}>
              From the <span style={{ color: YPA_BLUE }}>Blog</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium group transition-all hover:gap-3 text-[#00AEEF]"
          >
            View all posts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <ScrollReveal className="lg:col-span-2" delay={0.05}>
          <Link href={`/blog/${featured.slug}`} className="group block h-full">
            <div className="relative rounded-2xl overflow-hidden h-full min-h-[320px] md:min-h-[400px] bg-[#F6F8FA] border border-[#E8ECF0] hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              {featured.featured_image ? (
                <img
                  src={getImageUrl(featured.featured_image, FALLBACK_IMAGES.default)}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00AEEF]/10 to-[#33C1F5]/10">
                  <BookOpen className="w-16 h-16 text-[#00AEEF]/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/30 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="bg-[#00AEEF] text-white text-[10px] font-medium px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <div className="flex items-center gap-3 text-xs text-white/60 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {featured.published_at ? new Date(featured.published_at).toLocaleDateString() : "Recent"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.ceil((featured.content?.length || 500) / 1000)} min read
                  </span>
                </div>
                <h3 className={`${display.className} text-xl md:text-2xl lg:text-3xl font-medium text-white leading-snug group-hover:text-[#33C1F5] transition-colors`}>
                  {featured.title}
                </h3>
                <p className="text-white/60 text-sm mt-2 line-clamp-2">{featured.excerpt}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-white/80 group-hover:text-[#33C1F5] transition-colors text-sm font-medium">
                  Read more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        <div className="space-y-4 md:space-y-6">
          {rest.map((blog, index) => (
            <ScrollReveal key={blog.id} delay={0.08 + index * 0.06}>
              <Link href={`/blog/${blog.slug}`} className="group block">
                <div className="flex gap-3 md:gap-4 items-start bg-white rounded-xl border border-[#E8ECF0] p-3 md:p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shrink-0 bg-[#F6F8FA]">
                    {blog.featured_image ? (
                      <img
                        src={getImageUrl(blog.featured_image, FALLBACK_IMAGES.default)}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#00AEEF]/5">
                        <BookOpen className="w-6 h-6 text-[#00AEEF]/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-[#5B6B7A]">
                      <Calendar className="w-3 h-3" />
                      {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "Recent"}
                    </div>
                    <h4 className={`${display.className} text-sm md:text-base font-medium text-[#111111] group-hover:text-[#00AEEF] transition-colors line-clamp-2 mt-0.5`}>
                      {blog.title}
                    </h4>
                    <p className="text-xs text-[#5B6B7A] line-clamp-1 mt-0.5">{blog.excerpt}</p>
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
// EVENTS BANNER
// ============================================================
const EventsBanner = ({ events }: { events: any[] }) => {
  if (!events || events.length === 0) return null;

  const upcomingEvents = events.slice(0, 3);

  return (
    <section className="px-4 sm:px-5 md:px-14 py-12 md:py-20 bg-[#0E2540] overflow-hidden border-y border-[#1F3B57]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#33C1F5] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#33C1F5]" />
                </span>
                <span className={`${mono.className} text-[10px] md:text-[11px] text-[#33C1F5]/60 tracking-[0.2em] uppercase`}>
                  Stay Connected
                </span>
              </div>
              <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-white`}>
                Upcoming <span style={{ color: YPA_BLUE_LIGHT }}>Events</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-medium group transition-all hover:gap-3 text-[#33C1F5] bg-[#33C1F5]/10 px-4 py-2 rounded-full border border-[#33C1F5]/20 hover:bg-[#33C1F5]/20"
            >
              View all events
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {upcomingEvents.map((event, index) => {
            const isSoon = new Date(event.date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleString('default', { month: 'short' });
            const year = eventDate.getFullYear();
            
            return (
              <ScrollReveal key={event.id} delay={index * 0.06}>
                <Link 
                  href="/events"
                  className="group block h-full"
                >
                  <div className="relative bg-gradient-to-br from-[#153455] to-[#1a3d5e] border border-[#1F3B57] rounded-2xl p-4 md:p-6 hover:border-[#33C1F5]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#33C1F5]/5 h-full flex flex-col">
                    
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[#33C1F5]/10 to-transparent rotate-45 transform origin-top-right" />
                    </div>

                    {isSoon && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#F0B429] blur-md opacity-50 rounded-full" />
                          <span className="relative bg-gradient-to-r from-[#F0B429] to-[#FFD700] text-[#111111] text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-[#F0B429]/30">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#111111] opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#111111]" />
                            </span>
                            🔥 Soon
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 md:gap-4 flex-1">
                      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#00AEEF]/20 to-[#33C1F5]/10 rounded-xl px-3 py-2 min-w-[60px] border border-[#00AEEF]/20 group-hover:border-[#00AEEF]/40 transition-all duration-300">
                        <span className="text-2xl md:text-3xl font-bold text-[#00AEEF] group-hover:scale-110 transition-transform duration-300">
                          {String(day).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] md:text-[10px] font-medium text-[#33C1F5]/70 uppercase tracking-wider">
                          {month}
                        </span>
                        <span className="text-[7px] md:text-[8px] font-light text-white/30 mt-0.5">
                          {year}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`${display.className} text-sm md:text-base font-medium text-white group-hover:text-[#33C1F5] transition-colors line-clamp-2`}>
                          {event.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-white/50">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#33C1F5]/60" />
                            {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {event.location && (
                            <>
                              <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-[#33C1F5]/60 shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </span>
                            </>
                          )}
                        </div>

                        <div className="mt-3">
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full rounded-full bg-gradient-to-r from-[#00AEEF] to-[#33C1F5]"
                              initial={{ width: 0 }}
                              whileInView={{ width: isSoon ? '75%' : '30%' }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      background: `radial-gradient(circle at 50% 50%, ${YPA_BLUE}06, transparent 70%)`,
                    }} />

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-6 h-6 rounded-full bg-[#00AEEF]/20 flex items-center justify-center border border-[#00AEEF]/30">
                        <ArrowRight className="w-3 h-3 text-[#00AEEF]" />
                      </div>
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
// SOCIAL MEDIA
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
// FINAL CTA
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
          Ready to farm with a team that manages it properly?
        </h2>
        <p className="text-white/40 font-light mb-6 md:mb-10 max-w-md mx-auto text-xs md:text-sm">
          Over 18,000 members already farm with YPA. Registered with URSB, built on transparency, running since 2008.
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
// LIVE PANEL
// ============================================================
const LivePanel = ({ events, blogs }: { events: any[]; blogs: any[] }) => {
  const GOLD = "#F0B429";
  
  const facts = [
    { icon: Target, title: "Our Mission", description: "Empowering Africa's youth through sustainable agribusiness and financial inclusion." },
    { icon: Heart, title: "Our Impact", description: "130,000+ goats under care. 18,000+ active members. 12 branches across Uganda." },
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed right-6 top-24 z-40 hidden xl:block w-80 max-h-[78vh] overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "rgba(10,10,11,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(240,180,41,0.18)",
          boxShadow: `0 24px 48px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 32px ${YPA_BLUE}0a`,
        }}
      >
        <div className="mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: YPA_BLUE }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: YPA_BLUE }} />
            </span>
            <span className={`${mono.className} text-[10px] tracking-[0.2em] uppercase`} style={{ color: "rgba(245,246,247,0.5)" }}>
              About YPA
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 border"
                style={{ borderColor: "rgba(0,174,239,0.3)", background: "rgba(0,174,239,0.08)" }}
              >
                {(() => {
                  const Icon = facts[active].icon;
                  return <Icon className="w-4 h-4" style={{ color: YPA_BLUE_LIGHT }} />;
                })()}
              </div>
              <h4 className={`${display.className} text-[15px] font-medium text-white`}>{facts[active].title}</h4>
              <p className="mt-2 text-[13px] font-light leading-relaxed" style={{ color: "rgba(245,246,247,0.55)" }}>
                {facts[active].description}
              </p>
              <div className="flex gap-1.5 mt-4">
                {facts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Show fact ${i + 1}`}
                    className="h-[2px] rounded-full transition-all duration-500"
                    style={{
                      width: i === active ? "20px" : "8px",
                      background: i === active ? GOLD : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {events?.length > 0 && (
          <div className="mb-5 pb-5" style={{ borderBottom: blogs?.length > 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
            <div className="flex items-center justify-between mb-3">
              <span className={`${mono.className} text-[10px] tracking-[0.2em] uppercase`} style={{ color: "rgba(245,246,247,0.4)" }}>
                Upcoming Events
              </span>
              <span className="h-px flex-1 ml-3" style={{ background: "rgba(240,180,41,0.25)" }} />
            </div>
            <div className="space-y-1.5">
              {events.slice(0, 3).map((event, i) => {
                const soon = isEventSoon(event.date);
                return (
                  <Link key={i} href="/events">
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="relative p-3 rounded-lg border transition-all duration-300 cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderColor: soon ? "rgba(240,180,41,0.4)" : "rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-[13px] font-medium text-white/90 line-clamp-1">{event.title}</div>
                        {soon && (
                          <span
                            className={`${mono.className} shrink-0 text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded`}
                            style={{ color: GOLD, background: "rgba(240,180,41,0.12)" }}
                          >
                            Soon
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px]" style={{ color: "rgba(245,246,247,0.4)" }}>
                        <Calendar className="h-3 w-3 shrink-0" style={{ color: YPA_BLUE }} />
                        <span>{event.date ? new Date(event.date).toLocaleDateString() : "TBD"}</span>
                        <span className="w-0.5 h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                        <MapPin className="h-3 w-3 shrink-0" style={{ color: YPA_BLUE }} />
                        <span className="truncate">{event.location || "Uganda"}</span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {blogs?.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`${mono.className} text-[10px] tracking-[0.2em] uppercase`} style={{ color: "rgba(245,246,247,0.4)" }}>
                Popular Blogs
              </span>
              <span className="h-px flex-1 ml-3" style={{ background: "rgba(0,174,239,0.25)" }} />
            </div>
            <div className="space-y-1.5">
              {blogs.slice(0, 3).map((blog, i) => (
                <Link key={i} href={`/blog/${blog.slug}`}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="flex items-start gap-3 p-3 rounded-lg border transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-md overflow-hidden shrink-0 border"
                      style={{ borderColor: "rgba(255,255,255,0.08)" }}
                    >
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
                        <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(0,174,239,0.08)" }}>
                          <BookOpen className="h-4 w-4" style={{ color: "rgba(0,174,239,0.4)" }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-white/90 line-clamp-2">{blog.title}</div>
                      <div className={`${mono.className} text-[10px] mt-1`} style={{ color: "rgba(245,246,247,0.35)" }}>
                        {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "Recent"}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
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
      <AerialShowcase />
      <Signal signalArticles={signalArticles} />
      <MemberVoices />
      <RecentBlogs blogs={blogs} />
      <EventsBanner events={events} />
      <SocialMedia />
      <FinalCTA />
      <LivePanel events={events} blogs={blogs} />
      <Footer />
    </main>
  );
}