"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Alegreya, Inter } from "next/font/google";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ChevronRight,
  ArrowUpRight,
  Target,
  Globe,
  Users,
  Clock,
  ChevronDown,
  Sparkles,
  Shield,
  Heart,
  Handshake,
  Award,
  Leaf,
  Building,
  MapPin,
  FileText,
  BadgeCheck,
  ScrollText,
  Landmark,
  Zap,
  Play,
  Quote,
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
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

// ============================================================
// YPA BRAND COLORS
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_DARK = "#0099D6";
const YPA_BLUE_LIGHT = "#33C1F5";
const YPA_BLUE_SOFT = "#E6F8FD";
const YPA_GOLD = "#F0B429";
const YPA_GOLD_LIGHT = "#FFE08A";
const INK = "#111111";
const VOID = "#0A0A0B";
const NAVY = "#0E2540";
const NAVY_SOFT = "#153455";
const LINE = "#1F3B57";
const MIST = "#F6F8FA";
const INK_ON_LIGHT = "#111111";
const MUTE_ON_LIGHT = "#5B6B7A";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// IMAGE HELPER
// ============================================================
const getImageUrl = (image: string | undefined): string | null => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${API_URL}/assets/${image}`;
};

// ============================================================
// DATA FETCHING
// ============================================================
async function getAboutContent() {
  try {
    const res = await fetch(`${API_URL}/items/about`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

async function getFAQs() {
  try {
    const res = await fetch(`${API_URL}/items/faqs?sort[]=order`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// ============================================================
// ANIMATION PRESETS
// ============================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

// ============================================================
// PLACEHOLDER FLAG
// ============================================================
const NeedsInfo = ({ children = "Add details" }: { children?: string }) => (
  <span
    className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full border border-dashed align-middle ml-2"
    style={{ color: YPA_GOLD, borderColor: `${YPA_GOLD}88`, background: `${YPA_GOLD}0f` }}
  >
    <Zap className="h-2.5 w-2.5" />
    {children}
  </span>
);

// ============================================================
// SCROLL REVEAL
// ============================================================
const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? {} : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : reduce ? {} : { opacity: 0, y: 30 }}
      transition={{ duration: reduce ? 0 : (isMobile ? 0.3 : 0.6), delay: reduce ? 0 : (isMobile ? delay * 0.5 : delay) }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// SECTION LABEL — shared ledger-style eyebrow (mono index + hairline + label)
// used across light sections to keep the numbering language consistent
// with the homepage hero / footer without darkening the section itself.
// ============================================================
const LedgerLabel = ({ index, label, dark = false }: { index: string; label: string; dark?: boolean }) => (
  <div className="flex items-center gap-2.5 justify-center md:justify-start">
    <span className={`${mono.className} text-[10px]`} style={{ color: YPA_GOLD }}>{index}</span>
    <span className="h-px w-5" style={{ background: "rgba(240,180,41,0.4)" }} />
    <span className={`${mono.className} text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: dark ? "rgba(245,246,247,0.5)" : YPA_BLUE }}>
      {label}
    </span>
  </div>
);

// ============================================================
// GRAIN OVERLAY — quiet texture for dark, image-backed sections
// ============================================================
const GrainOverlay = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay opacity-[0.3]" aria-hidden="true">
    <filter id="ypaGrainAbout">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.04 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#ypaGrainAbout)" />
  </svg>
);

// ============================================================
// PREMIUM HERO — The Ledger, About-page variant
// Black backdrop, duotoned image, gold hairline frame, blue serif accent.
// ============================================================
const AboutHero = ({ content }: { content: any }) => {
  const reduce = useReducedMotion();

  const heroImage = "https://res.cloudinary.com/owwvyprb/image/upload/v1784726249/3P0D0002_tg15tl.jpg";

  return (
    <section id="hero" className="relative min-h-[85vh] md:min-h-[90vh] overflow-hidden" style={{ background: VOID }}>
      {/* Backdrop — duotoned image as atmosphere, not a photo card */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ filter: "grayscale(0.5) brightness(0.5) contrast(1.05)" }}
          loading="eager"
        />
        <div className="absolute inset-0" style={{ background: YPA_BLUE, mixBlendMode: "color", opacity: 0.2 }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${VOID} 0%, rgba(10,10,11,0.55) 30%, rgba(10,10,11,0.75) 65%, ${VOID} 100%)` }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${VOID} 0%, rgba(10,10,11,0.15) 45%, rgba(10,10,11,0.35) 100%)` }} />
        <GrainOverlay />
      </div>

      {/* dot grid, upper field only */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${YPA_BLUE} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          opacity: 0.06,
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, transparent 55%)",
          maskImage: "linear-gradient(180deg, #000 0%, transparent 55%)",
        }}
      />

      {/* gold hairline frame */}
      <div className="absolute inset-x-4 md:inset-x-8 top-20 md:top-24 bottom-24 md:bottom-28 border pointer-events-none hidden sm:block" style={{ borderColor: "rgba(240,180,41,0.16)" }} />

      <div className="relative z-10 flex min-h-[85vh] md:min-h-[90vh] flex-col justify-center px-5 md:px-14 py-16">
        <div className="max-w-3xl">
          {/* manifest stamp */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: YPA_BLUE }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: YPA_BLUE }} />
            </span>
            <span className={`${mono.className} text-[10px] tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE_LIGHT }}>
              Entry 01 — Our Story
            </span>
            <span className="h-px flex-1 max-w-[64px]" style={{ background: "rgba(240,180,41,0.35)" }} />
            <span className={`${mono.className} text-[10px] tracking-[0.2em] uppercase text-white/30 hidden sm:inline-flex items-center gap-1.5`}>
              <BadgeCheck className="h-3 w-3" style={{ color: YPA_GOLD }} />
              #1 in Africa
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${display.className} text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-medium leading-[0.98] tracking-tight max-w-2xl`}
            style={{ color: "#F5F6F7" }}
          >
            Who we are,{" "}
            <span className="italic" style={{ fontFamily: "var(--font-serif, serif)", color: YPA_BLUE_LIGHT }}>
              stated plainly
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${inter.className} mt-5 text-base md:text-lg font-light max-w-xl leading-relaxed`}
            style={{ color: "rgba(245,246,247,0.55)" }}
          >
            Youth Platform Africa started as a 21-person village group and grew into a Pan-African
            agribusiness platform. Here&rsquo;s the full record — our story, our people, and the paperwork
            that proves it.
          </motion.p>

          {/* ledger row echoing the homepage hero's stat treatment */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-stretch gap-0 max-w-md border-t border-b"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {[
              { label: "Founded", value: "2008" },
              { label: "Branches", value: "12" },
              { label: "Countries", value: "3" },
            ].map((s, idx) => (
              <div key={idx} className="flex-1 py-3.5 px-4" style={{ borderLeft: idx > 0 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div className={`${mono.className} text-[9px] tracking-[0.15em] uppercase mb-1`} style={{ color: "rgba(245,246,247,0.4)" }}>
                  {s.label}
                </div>
                <div className={`${display.className} text-lg md:text-xl font-medium`} style={{ color: idx === 0 ? YPA_GOLD : "#F5F6F7" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              href="#verify"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: YPA_BLUE, color: VOID }}
            >
              Verify our credentials
              <BadgeCheck className="h-4 w-4" />
            </Link>
            <Link
              href="#story"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 border"
              style={{ borderColor: "rgba(240,180,41,0.35)", color: "#F5F6F7" }}
            >
              <Play className="h-4 w-4" style={{ color: YPA_GOLD }} />
              Watch our story
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-8 right-8 z-10 items-center gap-2">
        <span className={`${mono.className} text-[9px] tracking-[0.2em] uppercase text-white/30`}>
          Est. 2008 — Kampala, UG
        </span>
      </div>

      <motion.a
        href="#verify"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-5 md:left-14 z-10 flex items-center gap-2 group"
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" style={{ color: "rgba(245,246,247,0.4)" }} />
        </motion.div>
        <span className={`${inter.className} text-[9px] tracking-[0.3em] uppercase`} style={{ color: "rgba(245,246,247,0.4)" }}>
          Explore
        </span>
      </motion.a>
    </section>
  );
};

// ============================================================
// VERIFY STRIP — crisp white ledger cards, blue confirmed / gold pending
// ============================================================
const VERIFY_FACTS = [
  { 
    label: "REGISTERED NAME", 
    value: "BREC Youth Empowerment Africa Limited", 
    confirmed: true,
    icon: Landmark
  },
  { 
    label: "LEGAL STATUS", 
    value: "Registered Organisation", 
    confirmed: true,
    icon: Shield
  },
  { 
    label: "URSB REG. NO.", 
    value: "80034597452632", 
    confirmed: true,
    icon: FileText
  },
  { 
    label: "TAX ID (TIN)", 
    value: "1036998856", 
    confirmed: true,
    icon: FileText
  },
  { 
    label: "ESTABLISHED", 
    value: "2008", 
    confirmed: true,
    icon: Award
  },
  { 
    label: "HEADQUARTERS", 
    value: "Kampala, Uganda", 
    confirmed: true,
    icon: MapPin
  },
  { 
    label: "BRANCHES", 
    value: "12", 
    confirmed: true,
    icon: Building
  },
];

const VerifyStrip = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="verify" className="relative py-14 md:py-20 px-5 md:px-14 bg-white border-t border-b" style={{ borderColor: "#EEF1F3" }}>
      <div className="relative container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex justify-center mb-3 md:mb-4">
            <LedgerLabel index="02" label="Verify Us" />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
            The facts a <span className="italic" style={{ color: YPA_BLUE }}>due-diligence</span> check would ask for
          </h2>
          <p className="text-xs md:text-sm mt-2 max-w-2xl mx-auto font-light" style={{ color: MUTE_ON_LIGHT }}>
            Everything you need to know about our legal standing, registration, and operational reach.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
          {VERIFY_FACTS.map((fact, index) => {
            const Icon = fact.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group"
              >
                <div
                  className="relative rounded-xl p-4 md:p-5 text-center transition-all duration-300 border"
                  style={{
                    borderColor: fact.confirmed ? "#E8ECF0" : "rgba(240,180,41,0.35)",
                    borderStyle: fact.confirmed ? "solid" : "dashed",
                    background: fact.confirmed ? "#fff" : "rgba(240,180,41,0.03)",
                    boxShadow: isHovered ? "0 12px 28px -12px rgba(17,17,17,0.12)" : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${mono.className} text-[9px]`} style={{ color: "rgba(91,107,122,0.5)" }}>
                      0{index + 1}
                    </span>
                    {fact.confirmed ? (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: YPA_BLUE }}>
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `${YPA_GOLD}20` }}>
                        <Zap className="w-2.5 h-2.5" style={{ color: YPA_GOLD }} />
                      </div>
                    )}
                  </div>

                  <div
                    className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3 transition-all duration-300"
                    style={{ background: fact.confirmed ? `${YPA_BLUE}0f` : `${YPA_GOLD}10` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: fact.confirmed ? YPA_BLUE : YPA_GOLD }} />
                  </div>

                  <p className={`${mono.className} text-[8px] md:text-[9px] tracking-[0.12em] uppercase font-medium mb-0.5 md:mb-1`} style={{ color: MUTE_ON_LIGHT }}>
                    {fact.label}
                  </p>
                  <p className="text-[13px] md:text-sm lg:text-base font-semibold leading-snug break-words" style={{ color: fact.confirmed ? INK_ON_LIGHT : YPA_GOLD }}>
                    {fact.value}
                  </p>
                  {!fact.confirmed && fact.tag && (
                    <div className="mt-1.5 md:mt-2">
                      <span className={`${mono.className} text-[7px] md:text-[9px] px-1.5 md:px-2 py-0.5 rounded-full`} style={{ background: `${YPA_GOLD}10`, color: YPA_GOLD, border: `1px solid ${YPA_GOLD}25` }}>
                        {fact.tag}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 md:mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full border" style={{ borderColor: "#E8ECF0" }}>
            <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" style={{ color: YPA_BLUE }} />
            <span className={`${mono.className} text-[10px] md:text-[11px] font-light`} style={{ color: MUTE_ON_LIGHT }}>
              All information verified and up-to-date.
              <span className="font-medium" style={{ color: YPA_GOLD }}> View official documents</span>
            </span>
            <ArrowUpRight className="h-3 w-3 md:h-3.5 md:w-3.5" style={{ color: YPA_GOLD }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================
// NUMBER COUNTER — Clean, Classic, Premium Animation
// ============================================================
const NumberCounter = ({ target, label, suffix = "", accent = YPA_BLUE }: { target: number; label: string; suffix?: string; accent?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      setCount(target);
      return;
    }
    let start = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      if (current >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, isInView, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative text-center"
    >
      <motion.div
        className={`${display.className} text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight`}
        style={{ color: INK_ON_LIGHT }}
        initial={{ scale: 0.9 }}
        animate={isInView ? { scale: 1 } : { scale: 0.9 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {count.toLocaleString()}
        {suffix}
      </motion.div>
      <div className="mt-1 md:mt-2 relative">
        <motion.div
          className={`${display.className} text-xs md:text-sm font-light tracking-wide`}
          style={{ color: MUTE_ON_LIGHT }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {label}
        </motion.div>
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 rounded-full"
          style={{ background: accent }}
          initial={{ width: 0 }}
          animate={isInView ? { width: "30px" } : { width: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

// ============================================================
// STORY SECTION — Smooth, Modern Slideshow
// ============================================================
const StorySection = ({ content }: { content: any }) => {
  const [activeImage, setActiveImage] = useState(0);
  const reduce = useReducedMotion();

  const images = [
    { src: "https://res.cloudinary.com/owwvyprb/image/upload/v1784714736/27b30d55-18ea-4197-b073-9a2c6dae3100.jpg", label: "Community" },
    { src: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716326/acc94e42-c5d5-489c-b335-6ee5353253be.jpg", label: "Goats" },
    { src: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716480/587e2393-e360-4ac2-bae3-22b7cec94705.jpg", label: "Farm" },
  ];

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reduce]);

  const goToImage = (index: number) => setActiveImage(index);
  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section id="story" className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeInUp}>
              <LedgerLabel index="03" label="Our Story" />
            </motion.div>
            <motion.h2 
              variants={fadeInUp} 
              className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-3 md:mt-4 leading-[1.1]`} 
              style={{ color: INK_ON_LIGHT }}
            >
              From a village group to a Pan-African movement
            </motion.h2>
            <motion.div 
              variants={fadeInUp} 
              className="mt-4 md:mt-6 leading-relaxed space-y-3 md:space-y-4 font-light text-sm md:text-base" 
              style={{ color: "#4B5A68" }}
            >
              {content?.story ? (
                <div dangerouslySetInnerHTML={{ __html: content.story }} />
              ) : (
                <>
                  <p>
                    Youth Platform Africa started in 2008 as an ordinary village group of 21
                    individuals. What began as a small community initiative has grown into a
                    Pan-African movement.
                  </p>
                  <p>
                    By 2010, it had grown into a Community Based Organisation with 60 members.
                    Today, YPA runs agribusiness and financial-inclusion programmes across Africa,
                    reinvesting income from its services back into its charitable work.
                  </p>
                  <p>
                    We've since expanded to 12 branches across Uganda, with international offices
                    in Dubai and Zambia.
                  </p>
                </>
              )}
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-6 md:mt-8 flex items-stretch gap-0 max-w-md border-t border-b" style={{ borderColor: "#EEF1F3" }}>
              {[
                { label: "Founded", value: "2008", accent: YPA_GOLD },
                { label: "Branches", value: "12", accent: INK_ON_LIGHT },
                { label: "Countries", value: "3", accent: INK_ON_LIGHT },
              ].map((s, idx) => (
                <div key={idx} className="flex-1 py-3.5 px-4" style={{ borderLeft: idx > 0 ? "1px solid #EEF1F3" : "none" }}>
                  <div className={`${mono.className} text-[9px] tracking-[0.1em] uppercase mb-1`} style={{ color: MUTE_ON_LIGHT }}>{s.label}</div>
                  <div className={`${mono.className} text-xl md:text-2xl font-medium`} style={{ color: s.accent }}>{s.value}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={scaleIn} 
            className="relative group"
          >
            <div className="absolute -inset-4 rounded-3xl blur-2xl" style={{ background: `linear-gradient(135deg, ${YPA_BLUE}14, ${YPA_GOLD}0f)` }} />
            
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: "rgba(240,180,41,0.2)" }}>
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: activeImage === index ? 1 : 0, scale: activeImage === index ? 1 : 1.05 }}
                  transition={{ opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" loading={index === 0 ? "eager" : "lazy"} />
                </motion.div>
              ))}

              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,11,0.5), transparent 50%)" }} />
              
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 flex items-end justify-between">
                <div className="rounded-xl px-3 md:px-5 py-2 md:py-3 border" style={{ background: "rgba(10,10,11,0.7)", backdropFilter: "blur(10px)", borderColor: "rgba(240,180,41,0.25)" }}>
                  <p className={`${mono.className} text-[10px] md:text-xs tracking-wide uppercase`} style={{ color: "#F5F6F7" }}>
                    {images[activeImage].label}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 md:gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToImage(i)}
                        className="transition-all duration-500 rounded-full"
                        style={{
                          width: activeImage === i ? "20px" : "8px",
                          height: "6px",
                          background: activeImage === i ? YPA_GOLD : "rgba(255,255,255,0.3)",
                        }}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={prevImage}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-white/10 border border-white/15 hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-white/10 border border-white/15 hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
                <motion.div
                  className="h-full"
                  style={{ background: `linear-gradient(90deg, ${YPA_BLUE}, ${YPA_GOLD})` }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                  key={activeImage}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// LEADERSHIP — Enhanced with Better Image Cropping
// ============================================================
interface Leader {
  role: string;
  name: string;
  bio: string;
  image?: string;
}

const LEADERSHIP: Leader[] = [
  { 
    role: "MANAGING DIRECTOR", 
    name: "OBED BEN", 
    bio: "Visionary leader with over 15 years of experience in agribusiness and community development. Founded YPA to empower African youth through sustainable agriculture.", 
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716326/acc94e42-c5d5-489c-b335-6ee5353253be.jpg"
  },
  { 
    role: "EXECUTIVE DIRECTOR", 
    name: "JB MAGEZI", 
    bio: "Strategic leader driving YPA's expansion across Africa with a focus on financial inclusion and youth empowerment.",
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716480/587e2393-e360-4ac2-bae3-22b7cec94705.jpg"
  },
  { 
    role: "GENERAL MANAGER", 
    name: "CHARLES KALEMERA", 
    bio: "Operational excellence leader overseeing YPA's 12 branches and ensuring seamless delivery of agribusiness services.",
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716382/5fd55b99-ec2f-4990-b3c7-8a5b69837aad.jpg"
  },
  { 
    role: "FOUNDING MEMBER", 
    name: "—", 
    bio: "Add role summary and relevant credentials.",
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784726254/3P0D0022_gqfkkg.jpg"
  },
];

const LeadershipSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="leadership" className="py-16 md:py-24 px-5 md:px-14" style={{ background: MIST }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="flex justify-center mb-2 md:mb-3">
            <LedgerLabel index="04" label="Governance" />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 md:mt-3`} style={{ color: INK_ON_LIGHT }}>
            Led by real people
          </h2>
          <p className="text-xs md:text-sm mt-2 max-w-xl mx-auto font-light" style={{ color: MUTE_ON_LIGHT }}>
            Every organisation asking for trust should be willing to put names to it.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {LEADERSHIP.map((leader, index) => {
            const isHovered = hoveredIndex === index;
            const imageUrl = leader.image ? getImageUrl(leader.image) : null;
            const isPlaceholder = leader.name === "—";

            return (
              <ScrollReveal key={index} delay={index * 0.08}>
                <motion.div
                  className="group relative bg-white rounded-2xl border overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                  style={{ borderColor: isPlaceholder ? "rgba(240,180,41,0.35)" : "#E8ECF0", borderStyle: isPlaceholder ? "dashed" : "solid" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-[#F0F9FE] to-[#E6F8FD]">
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={leader.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          style={{ objectPosition: '50% 25%' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/65 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center" style={{ background: `${YPA_BLUE}12`, border: `2px solid ${YPA_BLUE}20` }}>
                          <span className={`${display.className} text-2xl md:text-3xl font-medium`} style={{ color: YPA_BLUE }}>
                            {isPlaceholder ? "?" : leader.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className={`${mono.className} text-[9px] px-1.5 py-0.5 rounded`} style={{ color: "#F5F6F7", background: "rgba(10,10,11,0.5)" }}>
                        0{index + 1}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`relative flex h-2.5 w-2.5 ${isPlaceholder ? "opacity-60" : ""}`}>
                        <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: isPlaceholder ? YPA_GOLD : YPA_BLUE, opacity: isPlaceholder ? 0.5 : 0.75, animation: isPlaceholder ? "none" : undefined }} />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: isPlaceholder ? YPA_GOLD : YPA_BLUE }} />
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span
                        className="inline-block text-[10px] md:text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm"
                        style={{ background: 'rgba(10,10,11,0.55)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {leader.role || "Team Member"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className={`${display.className} text-base md:text-lg font-medium transition-colors duration-300`} style={{ color: isPlaceholder ? YPA_GOLD : INK_ON_LIGHT }}>
                      {isPlaceholder ? "Add name" : leader.name}
                    </div>
                    <p className="text-xs mt-1.5 md:mt-2 font-light leading-relaxed line-clamp-2 md:line-clamp-3" style={{ color: MUTE_ON_LIGHT }}>
                      {leader.bio}
                    </p>
                    
                    {!isPlaceholder && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3"
                      >
                        <button className="text-xs font-medium flex items-center gap-1 transition-all hover:gap-2" style={{ color: YPA_BLUE }}>
                          View profile
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// MISSION & VISION
// ============================================================
const MissionVisionSection = ({ content }: { content: any }) => {
  return (
    <section className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-10 md:mb-16">
          <div className="flex justify-center mb-2 md:mb-3">
            <LedgerLabel index="05" label="Our Purpose" />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 md:mt-3`} style={{ color: INK_ON_LIGHT }}>
            Why we exist
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {[
            {
              icon: Target,
              label: "Our Mission",
              accent: YPA_BLUE,
              html: content?.mission,
              fallback: "To economically empower individuals through extraordinary agribusiness practices for international competitiveness.",
            },
            {
              icon: Globe,
              label: "Our Vision",
              accent: YPA_GOLD,
              html: content?.vision,
              fallback: "To be the greatest empowerment platform in Africa — and to push back poverty with it.",
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="group bg-white p-6 md:p-10 rounded-2xl border transition-all duration-500 hover:shadow-xl"
                style={{ borderColor: "#EEF1F3" }}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-5" style={{ background: `${card.accent}12` }}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: card.accent }} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider" style={{ color: card.accent }}>{card.label}</span>
                  <span className="h-px flex-1" style={{ background: `${card.accent}25` }} />
                </div>
                <div className="text-base md:text-lg lg:text-xl leading-relaxed mt-2 md:mt-3 font-light" style={{ color: "#3E4C59" }}>
                  {card.html ? <div dangerouslySetInnerHTML={{ __html: card.html }} /> : card.fallback}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// VALUES
// ============================================================
const ValuesSection = () => {
  const values = [
    { text: "We walk in faith, guided by kindness, compassion, and service.", icon: Heart },
    { text: "We believe in honesty and transparency in everything we do.", icon: Shield },
    { text: "We respect time and ensure punctuality and efficiency.", icon: Clock },
    { text: "We believe collaboration is key. Together, we achieve more.", icon: Handshake },
    { text: "We build lasting connections between young Africans and communities.", icon: Users },
  ];

  return (
    <section className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-5xl">
        <ScrollReveal className="text-center mb-8 md:mb-12">
          <div className="flex justify-center mb-2 md:mb-3">
            <LedgerLabel index="06" label="Core Values" />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 md:mt-3`} style={{ color: INK_ON_LIGHT }}>
            What we believe
          </h2>
        </ScrollReveal>

        <div className="space-y-2 md:space-y-3">
          {values.map((v, i) => {
            const Icon = v.icon;
            const isGold = i % 2 === 1;
            return (
              <ScrollReveal key={i} delay={i * 0.05}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-colors group border"
                  style={{ borderColor: "transparent" }}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: isGold ? `${YPA_GOLD}12` : `${YPA_BLUE}12` }}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: isGold ? YPA_GOLD : YPA_BLUE }} />
                  </div>
                  <div>
                    <span className={`${mono.className} text-[10px] md:text-xs font-bold`} style={{ color: isGold ? YPA_GOLD : YPA_BLUE }}>0{i + 1}</span>
                    <p className="text-sm md:text-base leading-relaxed font-light" style={{ color: "#4B5A68" }}>{v.text}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// TIMELINE
// ============================================================
const MILESTONES = [
  { year: "2008", label: "Founded as a village group", desc: "21 members started the journey" },
  { year: "2010", label: "Registered as a CBO", desc: "60 members, formal structure" },
  { year: "2015", label: "Expanded to 5 branches", desc: "Growth across Uganda" },
  { year: "2020", label: "Launched YPA SACCO", desc: "Financial services for members" },
  { year: "2023", label: "Reached 100,000 goats", desc: "Major milestone achieved" },
  { year: "2025", label: "Expanded to Dubai & Zambia", desc: "Pan-African presence" },
];

const TimelineSection = () => {
  return (
    <section className="py-16 md:py-24 px-5 md:px-14 border-t overflow-hidden" style={{ background: MIST, borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-8 md:mb-12">
          <div className="flex justify-center mb-2 md:mb-3">
            <LedgerLabel index="07" label="Timeline" />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 md:mt-3`} style={{ color: INK_ON_LIGHT }}>
            Our journey, year by year
          </h2>
        </ScrollReveal>

        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: "thin" }}>
          {MILESTONES.map((item, i) => {
            const isGold = i % 2 === 1;
            return (
              <ScrollReveal key={i} delay={i * 0.06} className="shrink-0">
                <div
                  className="min-w-[200px] md:min-w-[260px] snap-start bg-white p-4 md:p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg"
                  style={{ borderColor: "#EEF1F3" }}
                >
                  <div className={`${mono.className} text-xl md:text-2xl font-medium`} style={{ color: isGold ? YPA_GOLD : YPA_BLUE }}>{item.year}</div>
                  <div className="text-sm md:text-base font-medium mt-1" style={{ color: INK_ON_LIGHT }}>{item.label}</div>
                  <div className="text-xs md:text-sm mt-1 font-light" style={{ color: MUTE_ON_LIGHT }}>{item.desc}</div>
                  <div className="mt-3 md:mt-4 h-1 w-10 md:w-12 rounded-full" style={{ background: isGold ? `${YPA_GOLD}20` : `${YPA_BLUE}20` }}>
                    <div className="h-full w-4 rounded-full" style={{ background: isGold ? YPA_GOLD : YPA_BLUE }} />
                  </div>
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
// REGISTRATION & COMPLIANCE
// ============================================================
const COMPLIANCE_CARDS = [
  { icon: Landmark, title: "Legal Registration", body: "Registered with URSB as BREC Youth Empowerment Africa Limited, Reg. No. 80034597452632.", need: null },
  { icon: FileText, title: "Tax Compliance", body: "Registered taxpayer with Uganda Revenue Authority, TIN 1036998856.", need: "Add latest compliance certificate" },
  { icon: Shield, title: "Regulatory Oversight", body: "SACCO operations are subject to oversight.", need: "Add the specific regulator(s) YPA SACCO reports to" },
  { icon: Award, title: "Independent Audit", body: "Financials reviewed annually.", need: "Add auditor name and latest audit year" },
];

const ComplianceSection = () => {
  return (
    <section className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="mb-8 md:mb-12">
          <LedgerLabel index="08" label="Due Diligence" />
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 md:mt-3 max-w-xl`} style={{ color: INK_ON_LIGHT }}>
            The paperwork behind the story
          </h2>
          <p className="text-xs md:text-sm mt-2 max-w-xl font-light" style={{ color: MUTE_ON_LIGHT }}>
            Checking us out before you commit is reasonable — here's what we have on record.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {COMPLIANCE_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="rounded-2xl border p-4 md:p-6 h-full" style={{ borderColor: "#EEF1F3", background: MIST }}>
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center" style={{ background: `${YPA_BLUE}12` }}>
                      <Icon className="h-4 w-4 md:h-5 md:w-5" style={{ color: YPA_BLUE }} />
                    </div>
                    <span className={`${mono.className} text-[9px]`} style={{ color: "rgba(91,107,122,0.5)" }}>0{i + 1}</span>
                  </div>
                  <div className="text-sm md:text-base font-semibold" style={{ color: INK_ON_LIGHT }}>{c.title}</div>
                  <p className="text-xs md:text-sm mt-1 md:mt-2 font-light leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>{c.body}</p>
                  {c.need ? (
                    <div
                      className="mt-2 md:mt-3 text-[9px] md:text-[10px] font-medium px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg border border-dashed leading-snug"
                      style={{ color: YPA_GOLD, borderColor: `${YPA_GOLD}66`, background: `${YPA_GOLD}0d` }}
                    >
                      {c.need}
                    </div>
                  ) : (
                    <div className="mt-2 md:mt-3 inline-flex items-center gap-1.5 text-[9px] md:text-[10px] font-medium px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg" style={{ color: YPA_BLUE, background: `${YPA_BLUE}0f` }}>
                      <BadgeCheck className="h-3 w-3" />
                      On record
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.2} className="mt-4 md:mt-6">
          <div className="rounded-2xl border p-4 md:p-6 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-3 md:gap-4" style={{ borderColor: "#EEF1F3" }}>
            <div>
              <div className="text-sm md:text-base font-semibold" style={{ color: INK_ON_LIGHT }}>Published documents</div>
              <p className="text-xs md:text-sm mt-1 font-light" style={{ color: MUTE_ON_LIGHT }}>
                Annual report, audited financials, and our strategic plan.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Annual Report", "Audited Financials", "Strategic Plan"].map((doc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-dashed"
                  style={{ color: YPA_GOLD, borderColor: `${YPA_GOLD}66` }}
                >
                  <FileText className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  {doc} — add PDF link
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

// ============================================================
// PHYSICAL PRESENCE
// ============================================================
const OFFICES = [
  { region: "Uganda — Headquarters", detail: "12 branches nationwide", need: "Add HQ street address & branch list" },
  { region: "Dubai, UAE — International Office", detail: "Regional / investment liaison office", need: "Add office address & contact" },
  { region: "Zambia — International Office", detail: "Regional agribusiness office", need: "Add office address & contact" },
];

const OfficesSection = () => {
  return (
    <section className="relative py-16 md:py-24 px-5 md:px-14 overflow-hidden" style={{ background: VOID }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${YPA_BLUE} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          opacity: 0.04,
        }}
      />
      <div className="relative container mx-auto max-w-7xl">
        <ScrollReveal className="mb-8 md:mb-12">
          <LedgerLabel index="09" label="Physical Presence" dark />
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 md:mt-3`} style={{ color: "#F5F6F7" }}>
            Find us in person
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {OFFICES.map((o, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="rounded-2xl border p-4 md:p-6 h-full" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center" style={{ background: `${YPA_BLUE}18` }}>
                    <MapPin className="h-4 w-4 md:h-5 md:w-5" style={{ color: YPA_BLUE_LIGHT }} />
                  </div>
                  <span className={`${mono.className} text-[9px]`} style={{ color: "rgba(240,180,41,0.5)" }}>0{i + 1}</span>
                </div>
                <div className="text-sm md:text-base font-medium text-white">{o.region}</div>
                <p className="text-xs md:text-sm mt-1 md:mt-2 font-light" style={{ color: "rgba(245,246,247,0.5)" }}>{o.detail}</p>
                <div
                  className="mt-3 md:mt-4 text-[9px] md:text-[10px] font-medium px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg border border-dashed inline-block"
                  style={{ color: YPA_GOLD, borderColor: `${YPA_GOLD}66`, background: `${YPA_GOLD}0d` }}
                >
                  {o.need}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// PARTNERS & RECOGNITION
// ============================================================
const PartnersSection = () => {
  const slots = new Array(6).fill(null);
  return (
    <section className="py-16 md:py-20 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-8 md:mb-10">
          <div className="flex justify-center mb-2 md:mb-3">
            <LedgerLabel index="10" label="Recognition" />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl font-medium mt-2 md:mt-3`} style={{ color: INK_ON_LIGHT }}>
            Partners & certifications
          </h2>
          <p className="text-xs md:text-sm mt-1 md:mt-2 font-light" style={{ color: MUTE_ON_LIGHT }}>
            <NeedsInfo>Add real partner / certifying-body logos here</NeedsInfo>
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {slots.map((_, i) => (
            <div
              key={i}
              className="aspect-[3/2] rounded-xl border border-dashed flex items-center justify-center"
              style={{ borderColor: "rgba(240,180,41,0.35)", background: MIST }}
            >
              <span className="text-[9px] md:text-[10px] font-medium text-center px-2" style={{ color: MUTE_ON_LIGHT }}>
                Add logo
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// FAQ SECTION
// ============================================================
const FAQSection = ({ faqs }: { faqs: any[] }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="flex justify-center mb-2 md:mb-3">
            <LedgerLabel index="11" label="FAQ" />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 md:mt-3`} style={{ color: INK_ON_LIGHT }}>
            Frequently asked questions
          </h2>
          <p className="text-xs md:text-sm mt-1 md:mt-2 font-light" style={{ color: MUTE_ON_LIGHT }}>
            Quick answers to common questions about YPA
          </p>
        </ScrollReveal>

        {faqs.length === 0 ? (
          <div className="text-center py-10 md:py-12 rounded-2xl border" style={{ background: MIST, borderColor: "#EEF1F3" }}>
            <p className="font-light text-sm md:text-base" style={{ color: MUTE_ON_LIGHT }}>No FAQs yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.id} delay={index * 0.04}>
                <div
                  className="group bg-white border rounded-xl transition-all duration-300 overflow-hidden"
                  style={{ borderColor: openFaqIndex === index ? "rgba(240,180,41,0.4)" : "#EEF1F3" }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span
                        className={`${mono.className} w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-colors`}
                        style={{
                          background: openFaqIndex === index ? YPA_BLUE : "#EEF1F3",
                          color: openFaqIndex === index ? "#fff" : MUTE_ON_LIGHT,
                        }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm md:text-base font-medium transition-colors" style={{ color: INK_ON_LIGHT }}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 shrink-0 ml-2"
                      style={{ color: openFaqIndex === index ? YPA_GOLD : MUTE_ON_LIGHT, transform: openFaqIndex === index ? "rotate(180deg)" : "none" }}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="px-4 md:px-6 pb-4 md:pb-5">
                      <div className="border-t pt-3 md:pt-4" style={{ borderColor: "rgba(240,180,41,0.2)" }}>
                        <div
                          className="text-sm md:text-base leading-relaxed font-light"
                          style={{ color: "#4B5A68" }}
                          dangerouslySetInnerHTML={{
                            __html: faq.answer
                              .replace(/<pre>/g, '<div class="faq-answer">')
                              .replace(/<\/pre>/g, "</div>")
                              .replace(/<p>/g, '<p class="mb-2">')
                              .replace(/<ul>/g, '<ul class="list-disc pl-5 space-y-1 my-2">')
                              .replace(/<li>/g, '<li>')
                              .replace(/<strong>/g, `<strong style="color:${INK_ON_LIGHT}; font-weight:600;">`)
                              .replace(/<h3>/g, `<h3 style="color:${INK_ON_LIGHT}; font-weight:600; margin-top:0.75rem;">`)
                              .replace(/<h4>/g, `<h4 style="color:${INK_ON_LIGHT}; font-weight:600; margin-top:0.5rem;">`),
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ============================================================
// VISION 2030
// ============================================================
const Vision2030 = () => {
  const items = [
    { label: "YPA Tower", icon: Building },
    { label: "Regional Offices", icon: MapPin },
    { label: "1M Members", icon: Users },
    { label: "10M Goats", icon: Leaf },
    { label: "YPA Factory", icon: Award },
    { label: "East African Offices", icon: Globe },
  ];

  return (
    <section className="py-16 md:py-24 px-5 md:px-14 relative overflow-hidden" style={{ background: VOID }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-[200px]" style={{ background: YPA_BLUE_LIGHT }} />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] rounded-full blur-[200px]" style={{ background: YPA_GOLD }} />
      </div>
      <div className="relative container mx-auto max-w-5xl text-center">
        <ScrollReveal>
          <div className="flex justify-center mb-2 md:mb-3">
            <LedgerLabel index="12" label="Ambition" dark />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 md:mt-3 text-white`}>YPA Vision 2030</h2>
          <p className="text-xs md:text-sm mt-1 md:mt-2 font-light text-white/40">Our roadmap to becoming the greatest empowerment platform in Africa</p>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-10">
          {items.map((item, i) => {
            const Icon = item.icon;
            const isGold = i % 2 === 1;
            return (
              <ScrollReveal key={i} delay={i * 0.06}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="border rounded-xl p-3 md:p-5 transition-all duration-300"
                  style={{ borderColor: isGold ? "rgba(240,180,41,0.2)" : "rgba(255,255,255,0.1)" }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" style={{ color: isGold ? "rgba(240,180,41,0.55)" : "rgba(0,174,239,0.55)" }} />
                  <div className="text-xs md:text-sm font-medium text-white/80">{item.label}</div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================
export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [aboutData, faqData] = await Promise.all([getAboutContent(), getFAQs()]);
      setContent(aboutData);
      setFaqs(faqData);
      setLoading(false);
    };
    fetchData();
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
    <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen bg-white overflow-x-hidden font-sans`}>
      <Navigation />

      <AboutHero content={content} />
      <VerifyStrip />

      <section className="py-10 md:py-16 px-5 md:px-14 bg-white border-b" style={{ borderColor: "#EEF1F3" }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <NumberCounter target={130000} label="Goats Under Care" suffix="+" accent={YPA_BLUE} />
            <NumberCounter target={12} label="Branches" suffix="" accent={YPA_GOLD} />
            <NumberCounter target={1000} label="Members" suffix="+" accent={YPA_BLUE} />
            <NumberCounter target={2008} label="Founded" suffix="" accent={YPA_GOLD} />
          </div>
        </div>
      </section>

      <StorySection content={content} />
      <LeadershipSection />
      <MissionVisionSection content={content} />
      <ValuesSection />
      <TimelineSection />
      <ComplianceSection />
      <OfficesSection />
      <PartnersSection />
      <FAQSection faqs={faqs} />
      <Vision2030 />

      <section className="py-14 md:py-20 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-2xl flex items-center justify-center border" style={{ background: `${YPA_BLUE}0f`, borderColor: "rgba(240,180,41,0.3)" }}>
              <Sparkles className="w-6 h-6 md:w-8 md:h-8" style={{ color: YPA_BLUE }} />
            </div>
            <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium`} style={{ color: INK_ON_LIGHT }}>
              Now that you know who we are
            </h2>
            <p className="text-xs md:text-sm mt-2 font-light" style={{ color: MUTE_ON_LIGHT }}>
              Become part of Africa's leading agribusiness platform, or just ask us anything else you need to know.
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-full text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: YPA_BLUE, boxShadow: `0 20px 40px -12px ${YPA_BLUE}66` }}
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sacco"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-full text-sm font-medium border transition-all duration-300"
                style={{ color: INK_ON_LIGHT, borderColor: "rgba(240,180,41,0.4)" }}
              >
                See YPA SACCO
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}