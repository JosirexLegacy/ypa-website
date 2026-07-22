"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Alegreya, Inter } from "next/font/google";
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
  useReducedMotion,
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
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});
const serif = Alegreya({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

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
      `${API_URL}/items/posts?filter[status][_eq]=published&sort[]=-featured&sort[]=-published_at&limit=3`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      const fallbackRes = await fetch(
        `${API_URL}/items/posts?filter[status][_eq]=published&sort[]=-published_at&limit=3`,
        { cache: "no-store" }
      );
      if (!fallbackRes.ok) return [];
      const data = await fallbackRes.json();
      return data.data || [];
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
      return getFallbackArticles();
    }
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      return data.data;
    }
    return getFallbackArticles();
  } catch (error) {
    console.error("Error fetching signal articles:", error);
    return getFallbackArticles();
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
// SECTION RAIL (GLASS)
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
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduce ? {} : { opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : reduce ? {} : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// HERO — #1 Premium with Morphing Background
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
    aura: YPA_BLUE,
    glowColor: YPA_BLUE,
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
    aura: YPA_BLUE,
    glowColor: YPA_BLUE,
  },
];

// ============================================================
// HERO VISUAL — Premium with Morphing Background
// ============================================================
const HeroVisual = ({ item }: { item: (typeof LINEUP)[number] }) => {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[440px] mx-auto aspect-[4/3] lg:aspect-[4/5]">
      {/* ✅ Morphing glow blobs behind the image */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full blur-3xl"
          style={{ background: `${item.aura}20` }}
          animate={reduce ? {} : { 
            scale: [1, 1.2, 0.9, 1],
            x: [0, 20, -15, 0],
            y: [0, -15, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full blur-3xl"
          style={{ background: `${item.aura}15` }}
          animate={reduce ? {} : { 
            scale: [1, 0.8, 1.1, 1],
            x: [0, -15, 20, 0],
            y: [0, 20, -15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full blur-3xl"
          style={{ background: `${item.aura}08` }}
          animate={reduce ? {} : { 
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      {/* Glass ring with rotation */}
      <motion.div
        className="absolute inset-[-14px] rounded-[2.4rem] border pointer-events-none"
        style={{ borderColor: `${item.aura}30` }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="relative w-full h-full rounded-[2rem] overflow-hidden border"
        style={{ 
          borderColor: `${item.aura}20`,
          boxShadow: `0 30px 60px -20px ${item.aura}30, 0 0 0 1px ${item.aura}10 inset`
        }}
      >
        <AnimatePresence>
          <motion.img
            key={item.image}
            src={item.image}
            alt={item.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: reduce ? 1 : 1.05 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{
              opacity: { duration: 0.8, ease: "easeOut" },
              scale: { duration: 10, ease: "linear" },
            }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.95) contrast(1.05)" }}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=900&q=80";
            }}
          />
        </AnimatePresence>

        {/* Glass overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(to top, rgba(6,11,20,0.6) 0%, transparent 50%, ${item.aura}05 100%)`,
        }} />

        {/* Corner accents */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g stroke={item.aura} strokeWidth="0.8" fill="none" opacity="0.4">
            <path d="M6 18 V8 H16" />
            <path d="M84 8 H94 V18" />
            <path d="M94 82 V92 H84" />
            <path d="M16 92 H6 V82" />
          </g>
        </svg>
      </div>
    </div>
  );
};

// ============================================================
// HERO — #1 Premium with Morphing Background
// ============================================================
const EASE = [0.22, 1, 0.36, 1] as const;

const Hero = () => {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setI((p) => (p + 1) % LINEUP.length), 6500);
    return () => clearInterval(t);
  }, [paused, reduce]);

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
      {/* Background gradient with subtle movement */}
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className={`absolute inset-0 bg-gradient-to-br ${current.gradient}`}
        />
      </AnimatePresence>

      {/* ✅ MORPHING BACKGROUND BLOBS — Premium organic movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: `${current.aura}12` }}
          animate={reduce ? {} : { 
            scale: [1, 1.15, 0.9, 1],
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full blur-3xl"
          style={{ background: `${current.aura}08` }}
          animate={reduce ? {} : { 
            scale: [1, 0.85, 1.1, 1],
            x: [0, -20, 30, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `${current.aura}05` }}
          animate={reduce ? {} : { 
            scale: [1, 1.2, 0.85, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${current.aura} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.04,
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 78%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 78%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 md:px-14">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-4 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            {/* ✅ BOLD #1 RANKED BADGE — Stands out! */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 mb-6 backdrop-blur-md shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${current.aura}, ${current.aura}dd)`,
                border: `1px solid ${current.aura}40`,
                boxShadow: `0 8px 32px ${current.aura}40, 0 0 60px ${current.aura}20`,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Award className="h-5 w-5 text-white" />
              </motion.div>
              <span className={`${inter.className} text-[11px] sm:text-[13px] tracking-[0.1em] uppercase font-bold text-white`}>
                Ranked #1 Goat Farming Programme in Africa
              </span>
              <motion.span
                className="relative flex h-2 w-2"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </motion.span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {/* Kicker with animated line */}
                <div className="flex items-center gap-3 mb-5">
                  <span className={`${inter.className} text-[11px] tracking-[0.25em] uppercase font-medium`} style={{ color: current.aura }}>
                    {current.kicker}
                  </span>
                  <motion.span 
                    className="h-px flex-1" 
                    style={{ background: `${current.aura}30` }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>

                {/* ✅ Premium title with glowing highlight */}
                <motion.h1
                  className={`${inter.className} text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight max-w-xl`}
                  style={{ color: INK_ON_LIGHT }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {beforeHighlight}
                  <span 
                    className="relative inline-block"
                    style={{ color: current.aura }}
                  >
                    {current.titleHighlight}
                    {/* ✅ Glowing underline */}
                    <motion.span
                      className="absolute bottom-[-4px] left-0 h-[3px] rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${current.aura}, ${current.aura}80)`,
                        boxShadow: `0 0 16px ${current.aura}`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
                    />
                    {/* ✅ Soft glow behind the word */}
                    <motion.span
                      className="absolute inset-0 rounded-full blur-2xl -z-10"
                      style={{ background: current.aura }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </span>
                  {afterHighlight}
                </motion.h1>

                <motion.p
                  className={`${inter.className} mt-5 text-lg md:text-xl font-light max-w-xl leading-relaxed`}
                  style={{ color: MUTE_ON_LIGHT }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  {current.line}
                </motion.p>

                {/* Premium specs */}
                <div className={`${inter.className} mt-8 flex flex-wrap gap-x-10 gap-y-3`}>
                  {current.specs.map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                      className="flex flex-col group cursor-default"
                    >
                      <span className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: MUTE_ON_LIGHT }}>
                        {s.label}
                      </span>
                      <span 
                        className="text-2xl md:text-3xl font-semibold transition-colors duration-300 group-hover:text-[#00AEEF]"
                        style={{ color: INK_ON_LIGHT }}
                      >
                        {s.value}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Premium buttons */}
                <div className="mt-10 flex flex-wrap gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Link
                      href={current.href}
                      className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
                      style={{ 
                        background: `linear-gradient(135deg, ${current.aura}, ${current.aura}cc)`,
                        boxShadow: `0 20px 40px -12px ${current.aura}55`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 25px 50px -12px ${current.aura}77`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 20px 40px -12px ${current.aura}55`;
                      }}
                    >
                      Configure this programme
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Link
                      href="/about"
                      className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
                      style={{ 
                        border: `2px solid ${current.aura}30`,
                        color: INK_ON_LIGHT,
                        background: "rgba(255,255,255,0.5)",
                        backdropFilter: "blur(10px)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = current.aura;
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.borderColor = current.aura;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                        e.currentTarget.style.color = INK_ON_LIGHT;
                        e.currentTarget.style.borderColor = `${current.aura}30`;
                      }}
                    >
                      <Play className="h-4 w-4" />
                      See how YPA works
                    </Link>
                  </motion.div>
                </div>

                {/* Slide indicators */}
                <div className="flex gap-2 mt-12">
                  {LINEUP.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setI(idx)}
                      aria-label={`Show ${LINEUP[idx].title}`}
                      className="rounded-full transition-all duration-700 relative group"
                      style={{
                        width: idx === i ? "48px" : "14px",
                        height: "3px",
                        background: idx === i ? current.aura : "rgba(6,11,20,0.12)",
                      }}
                    >
                      {idx === i && (
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          style={{ background: current.aura }}
                          layoutId="activePill"
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                      )}
                    </button>
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

      {/* Scroll indicator */}
      <motion.a
        href="#index"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 group"
      >
        <span className={`${inter.className} text-[9px] tracking-[0.3em] uppercase font-medium transition-colors duration-300`} style={{ color: MUTE_ON_LIGHT }}>
          Explore
        </span>
        <motion.div
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="transition-colors duration-300 group-hover:text-[#00AEEF]"
          style={{ color: MUTE_ON_LIGHT }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.a>
    </section>
  );
};
// ============================================================
// FIELD INDEX — REMOVED GREEN, USING YPA BLUE
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
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const track = [...FIELD_INDEX, ...FIELD_INDEX];

  return (
    <section id="index" className="relative overflow-hidden" style={{ background: YPA_BLUE }}>
      <div className="flex items-center gap-2.5 px-6 md:px-14 pt-6">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        <span className={`${display.className} text-[13px] text-white/90`}>
          The Field Index — a live read across all 12 branches
        </span>
      </div>

      <div className="relative py-6" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <motion.div
          className="flex gap-3 px-6 md:px-14"
          animate={reduce || paused ? {} : { x: ["0%", "-50%"] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        >
          {track.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 shrink-0 rounded-2xl pl-5 pr-4 py-3 border transition-colors duration-300 hover:border-white/20"
              style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex flex-col">
                <span className="text-[11px] text-white/70">{m.label}</span>
                <span className={`${mono.className} text-lg text-white font-medium`}>{m.value}</span>
              </div>
              <span
                className="text-[10px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{ color: YPA_BLUE_LIGHT, background: `${YPA_BLUE}25` }}
              >
                {m.delta}
              </span>
            </div>
          ))}
        </motion.div>
        <div
          className="absolute inset-y-0 left-0 w-16 md:w-28 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${YPA_BLUE}, transparent)` }}
        />
        <div
          className="absolute inset-y-0 right-0 w-16 md:w-28 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${YPA_BLUE}, transparent)` }}
        />
      </div>
    </section>
  );
};

// ============================================================
// EXPLORE RAIL
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
    <section id="explore" className="px-6 md:px-14 py-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
            Start wherever the question is
          </h2>
          <span className={`${display.className} text-[13px]`} style={{ color: MUTE_ON_LIGHT }}>
            Six ways in
          </span>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXPLORE.map((item, i) => (
          <ScrollReveal key={i} delay={i * 0.06} className={item.tall ? "md:row-span-2" : ""}>
            <Link href={item.href} className="group block h-full">
              <div
                className={`relative h-full rounded-3xl overflow-hidden transition-all duration-500 ${
                  item.tall ? "min-h-[280px]" : "min-h-[210px]"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=900&q=80";
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, #060B14 18%, rgba(6,11,20,0.45) 55%, rgba(6,11,20,0.2))" }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${YPA_BLUE}22, transparent 60%)` }}
                />

                <div className="relative h-full flex flex-col justify-end p-6">
                  <p className={`${display.className} text-lg md:text-xl font-medium leading-snug text-white`}>
                    {item.q}
                  </p>
                  <div className="flex items-center justify-between mt-5">
                    <span className={`${mono.className} text-[10px] tracking-[0.12em] uppercase text-white/60`}>
                      {item.label}
                    </span>
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0"
                      style={{ background: YPA_BLUE }}
                    >
                      <ArrowUpRight className="h-4 w-4 text-white" />
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
// THE LINEUP
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
    <section id="lineup" className="px-6 md:px-14 py-24" style={{ background: INK }}>
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className={`${display.className} text-[13px] text-white/40 mb-3`}>
            Three programmes, one platform
          </div>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight text-white max-w-2xl`}>
            The Lineup
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {CONFIG_CARDS.map((c, i) => {
            const Icon = c.icon;
            const isHover = hover === i;
            return (
              <ScrollReveal key={i} delay={i * 0.1}>
                <Link
                  href={c.href}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="group block relative rounded-3xl overflow-hidden border h-[420px]"
                  style={{ borderColor: LINE }}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=1200&q=80";
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, #060B14 15%, rgba(6,11,20,0.35) 55%, rgba(6,11,20,0.55))" }}
                  />

                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <span
                        className={`${mono.className} inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] tracking-[0.1em] uppercase text-white/80`}
                        style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
                      >
                        <Icon className="h-3 w-3" />
                        {c.tag}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-white/60 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    <div>
                      <div className={`${mono.className} text-3xl text-white font-medium`}>
                        {c.stat}
                        <span className="text-sm text-white/50 ml-2 font-normal">{c.statLabel}</span>
                      </div>
                      <h3 className={`${display.className} text-2xl text-white font-medium mt-1`}>{c.name}</h3>

                      <motion.div
                        initial={false}
                        animate={{ height: isHover ? "auto" : 0, opacity: isHover ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-4 space-y-1.5 pt-4 border-t border-white/10">
                          {c.specs.map((s, si) => (
                            <li key={si} className="flex items-center gap-2 text-xs text-white/65">
                              <span className="h-1 w-1 rounded-full" style={{ background: YPA_BLUE }} />
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
// TRUST BAR
// ============================================================
const TRUST_POINTS = [
  { icon: Award, label: "Founded", value: "2014", note: "over a decade in the field" },
  { icon: Shield, label: "Registered", value: "URSB", note: "licensed to operate in Uganda" },
  { icon: Handshake, label: "Transparency", value: "No hidden fees", note: "the rate you're quoted is the rate you pay" },
  { icon: Building, label: "Reach", value: "12 branches", note: "across Uganda's growing regions" },
];

const TrustBar = () => {
  return (
    <section id="trust" className="px-6 md:px-14 py-20" style={{ background: MIST }}>
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className={`${display.className} text-2xl md:text-3xl font-medium tracking-tight mb-10`} style={{ color: INK_ON_LIGHT }}>
            Why farmers put their savings with us
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_POINTS.map((t, i) => {
            const Icon = t.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="rounded-2xl border p-6 bg-white h-full" style={{ borderColor: "#E8ECF0" }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${YPA_BLUE}12` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: YPA_BLUE }} />
                  </div>
                  <div className={`${mono.className} text-[10px] tracking-[0.15em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                    {t.label}
                  </div>
                  <div className="text-xl font-medium mt-1" style={{ color: INK_ON_LIGHT }}>
                    {t.value}
                  </div>
                  <p className="text-xs mt-2 font-light leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
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
// SIGNAL
// ============================================================
const Signal = ({ signalArticles }: { signalArticles: any[] }) => {
  if (!signalArticles || signalArticles.length === 0) return null;

  const featured = signalArticles.find((a) => a.big === true) || signalArticles[0] || null;
  const rest = signalArticles.filter((a) => a.slug !== featured?.slug) || [];

  return (
    <section id="signal" className="px-6 md:px-14 py-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className={`${display.className} text-[13px] mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              Field notes
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Inside YPA
            </h2>
          </div>
          <Link
            href="/signal"
            className="inline-flex items-center gap-2 text-sm font-medium group transition-all hover:gap-3"
            style={{ color: YPA_BLUE }}
          >
            View all stories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-6">
        {featured && (
          <ScrollReveal className="md:row-span-2">
            <Link href={`/signal/${featured.slug}`} className="group block h-full">
              <div className="relative rounded-3xl overflow-hidden h-full min-h-[420px]">
                <img
                  src={featured.image?.startsWith("http") ? featured.image : `${API_URL}/assets/${featured.image}`}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=900&q=80";
                  }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060B14 10%, transparent 55%)" }} />
                <div className="absolute bottom-0 p-7">
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[10px] font-medium text-white mb-4"
                    style={{ background: YPA_BLUE }}
                  >
                    {featured.tag}
                  </span>
                  <h3 className={`${display.className} text-2xl md:text-3xl text-white font-medium leading-snug`}>
                    {featured.title}
                  </h3>
                  <p className="text-white/55 text-sm font-light mt-2">{featured.description}</p>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        )}

        <div className="grid gap-6">
          {rest.slice(0, 2).map((item, i) => (
            <ScrollReveal key={i} delay={0.1 + i * 0.08}>
              <Link href={`/signal/${item.slug}`} className="group flex gap-5 items-center">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={item.image?.startsWith("http") ? item.image : `${API_URL}/assets/${item.image}`}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=400&q=80";
                    }}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-medium tracking-wide uppercase" style={{ color: YPA_BLUE }}>
                    {item.tag}
                  </span>
                  <h4 className={`${display.className} text-lg font-medium leading-snug mt-1`} style={{ color: INK_ON_LIGHT }}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: MUTE_ON_LIGHT }}>
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
  const reduce = useReducedMotion();
  const track = [...VOICES, ...VOICES];

  return (
    <section id="voices" className="py-20 overflow-hidden border-y" style={{ background: NAVY, borderColor: LINE }}>
      <ScrollReveal className="px-6 md:px-14 max-w-7xl mx-auto mb-10">
        <div className={`${display.className} text-[13px] text-white/40 mb-3`}>
          In their own words
        </div>
        <h2 className={`${display.className} text-2xl md:text-3xl font-medium tracking-tight text-white`}>
          Member Voices
        </h2>
      </ScrollReveal>

      <motion.div
        className="flex gap-6 px-6"
        animate={reduce ? {} : { x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {track.map((v, i) => (
          <div
            key={i}
            className="shrink-0 w-[340px] rounded-2xl border p-6"
            style={{ borderColor: LINE, background: NAVY_SOFT }}
          >
            <p className={`${display.className} text-white/90 text-lg leading-snug`}>&ldquo;{v.quote}&rdquo;</p>
            <p className={`${mono.className} text-[11px] text-white/40 mt-4 tracking-wide`}>{v.role}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

// ============================================================
// PRESS SIGNAL
// ============================================================
const PressSignal = ({ pressItems }: { pressItems: any[] }) => {
  const press = pressItems || [];
  if (press.length === 0) return null;

  return (
    <section id="press" className="px-6 md:px-14 py-24 max-w-5xl mx-auto">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className={`${display.className} text-[13px] mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              As covered by
            </div>
            <h2 className={`${display.className} text-3xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Press Signal
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium group"
            style={{ color: YPA_BLUE }}
          >
            Open the media center
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="divide-y" style={{ borderColor: "#E8ECF0" }}>
        {press.slice(0, 3).map((item, i) => {
          const Icon = typeIcons[item.type as keyof typeof typeIcons] || Newspaper;
          return (
            <ScrollReveal key={i} delay={i * 0.06}>
              <Link href={item.link || "#"} target="_blank" className="group flex items-center gap-5 py-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${YPA_BLUE}12` }}
                >
                  <Icon className="h-4 w-4" style={{ color: YPA_BLUE }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-base font-medium truncate group-hover:underline"
                    style={{ color: INK_ON_LIGHT }}
                  >
                    {item.title}
                  </h4>
                  <p className={`${mono.className} text-[11px] mt-1`} style={{ color: MUTE_ON_LIGHT }}>
                    {item.outlet} · {item.date ? new Date(item.date).toLocaleDateString() : ""}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: INK_ON_LIGHT }} />
              </Link>
            </ScrollReveal>
          );
        })}
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
    <section className="px-6 py-10 max-w-7xl mx-auto text-center border-t" style={{ borderColor: "#E8ECF0" }}>
      <ScrollReveal>
        <div className="flex justify-center gap-8">
          {socials.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="transition-colors"
                style={{ color: MUTE_ON_LIGHT }}
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
    <section id="cta" className="relative px-6 py-32 overflow-hidden" style={{ background: INK }}>
      <div className="absolute inset-0">
        <div className="absolute top-[-50%] right-[-15%] w-[700px] h-[700px] rounded-full blur-3xl" style={{ background: `${YPA_BLUE}14` }} />
        <div className="absolute bottom-[-50%] left-[-15%] w-[700px] h-[700px] rounded-full blur-3xl" style={{ background: `${YPA_BLUE_LIGHT}10` }} />
      </div>

      <ScrollReveal className="relative z-10 max-w-2xl mx-auto text-center">
        <div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
        >
          <Sparkles className="h-6 w-6" style={{ color: YPA_BLUE }} />
        </div>
        <h2 className={`${display.className} text-4xl md:text-5xl font-medium tracking-tight text-white mb-4`}>
          What would a decade in agribusiness do for your income?
        </h2>
        <p className="text-white/40 font-light mb-10 max-w-md mx-auto text-sm">
          Over 1,000 members are already finding out. Registered with URSB, built on transparency, running since 2014.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/projects"
            className="group rounded-full px-8 py-3.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
            style={{ background: YPA_BLUE, boxShadow: `0 20px 40px -12px ${YPA_BLUE}66` }}
          >
            Explore the Lineup
            <ArrowRight className="inline-block h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="rounded-full border px-8 py-3.5 text-sm font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
            style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}
          >
            Ask us a question
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
};

// ============================================================
// LIVE PANEL — Glass with YPA Blue & Gold Accents
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed right-6 top-24 z-40 hidden xl:block w-80 max-h-[78vh] overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* ✅ Glass with YPA Blue background and Gold accents */}
      <div
        className="rounded-3xl p-6 shadow-2xl border"
        style={{ 
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.15)",
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
            <div className="border-t my-4" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
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
            <div className="border-t my-4" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
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
                          <img
                            src={`${API_URL}/assets/${blog.featured_image}`}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=100&q=80";
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
            className="w-10 h-10 border-[3px] rounded-full"
            style={{ borderColor: "#E3F2FD", borderTopColor: YPA_BLUE }}
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