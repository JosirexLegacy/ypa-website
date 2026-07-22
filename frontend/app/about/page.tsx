"use client";

import Link from "next/link";
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
// PREMIUM HERO — Glass + Morphing (Same as Homepage)
// ============================================================
const AboutHero = ({ content }: { content: any }) => {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] overflow-hidden bg-white"
    >
      {/* Background gradient with subtle movement */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F0F9FE] to-[#E6F8FD]" />

      {/* ✅ MORPHING BACKGROUND BLOBS — Premium organic movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: `${YPA_BLUE}12` }}
          animate={reduce ? {} : { 
            scale: [1, 1.15, 0.9, 1],
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full blur-3xl"
          style={{ background: `${YPA_GOLD}10` }}
          animate={reduce ? {} : { 
            scale: [1, 0.85, 1.1, 1],
            x: [0, -20, 30, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `${YPA_BLUE_LIGHT}06` }}
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
          backgroundImage: `radial-gradient(${YPA_BLUE} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.04,
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 78%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 78%)",
        }}
      />

      <div className="relative z-10 flex min-h-[88vh] flex-col justify-center px-6 md:px-14">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            {/* Premium glass trust badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 mb-6 backdrop-blur-md shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_DARK})`,
                border: `1px solid ${YPA_BLUE}40`,
                boxShadow: `0 8px 32px ${YPA_BLUE}40, 0 0 60px ${YPA_BLUE}20`,
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

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Kicker with animated line */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`${inter.className} text-[11px] tracking-[0.25em] uppercase font-medium`} style={{ color: YPA_BLUE }}>
                  Our Story
                </span>
                <motion.span 
                  className="h-px flex-1" 
                  style={{ background: `${YPA_BLUE}30` }}
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
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Who we are,
                <span 
                  className="relative inline-block ml-2"
                  style={{ color: YPA_BLUE }}
                >
                  stated plainly
                  <motion.span
                    className="absolute bottom-[-4px] left-0 h-[3px] rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${YPA_BLUE}, ${YPA_BLUE_LIGHT})`,
                      boxShadow: `0 0 16px ${YPA_BLUE}`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full blur-2xl -z-10"
                    style={{ background: YPA_BLUE }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className={`${inter.className} mt-5 text-lg md:text-xl font-light max-w-xl leading-relaxed`}
                style={{ color: MUTE_ON_LIGHT }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                Youth Platform Africa started as a 21-person village group and grew into a Pan-African
                agribusiness platform. Here's the full record our story, our people, and the paperwork
                that proves it.
              </motion.p>

              {/* Premium buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link
                    href="#verify"
                    className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
                    style={{ 
                      background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_DARK})`,
                      boxShadow: `0 20px 40px -12px ${YPA_BLUE}55`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 25px 50px -12px ${YPA_BLUE}77`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 20px 40px -12px ${YPA_BLUE}55`;
                    }}
                  >
                    Verify our credentials
                    <BadgeCheck className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Link
                    href="#story"
                    className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
                    style={{ 
                      border: `2px solid ${YPA_BLUE}30`,
                      color: INK_ON_LIGHT,
                      background: "rgba(255,255,255,0.5)",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = YPA_BLUE;
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = YPA_BLUE;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                      e.currentTarget.style.color = INK_ON_LIGHT;
                      e.currentTarget.style.borderColor = `${YPA_BLUE}30`;
                    }}
                  >
                    Read our story
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#verify"
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
// VERIFY STRIP — Premium Glass with YPA Brand Colors
// ============================================================
const VERIFY_FACTS = [
  { 
    label: "LEGAL STATUS", 
    value: "Registered Organisation", 
    confirmed: true,
    icon: Shield
  },
  { 
    label: "URSB REG. NO.", 
    value: "—", 
    confirmed: false, 
    tag: "Add registration number",
    icon: FileText
  },
  { 
    label: "TAX ID (TIN)", 
    value: "—", 
    confirmed: false, 
    tag: "Add TIN",
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
    <section className="relative py-16 px-6 md:px-14 overflow-hidden" style={{ background: MIST }}>
      {/* Background with subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-50%] right-[-20%] w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: `${YPA_BLUE}10` }} />
        <div className="absolute bottom-[-50%] left-[-20%] w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: `${YPA_GOLD}08` }} />
      </div>

      <div className="relative container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md mb-4" style={{ 
            background: `rgba(255,255,255,0.5)`,
            border: `1px solid ${YPA_BLUE}20`
          }}>
            <BadgeCheck className="h-4 w-4" style={{ color: YPA_BLUE }} />
            <span className={`${mono.className} text-[10px] tracking-[0.2em] uppercase font-medium`} style={{ color: MUTE_ON_LIGHT }}>
              Verify Us
            </span>
          </div>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
            The facts a <span style={{ color: YPA_BLUE }}>due-diligence</span> check would ask for
          </h2>
          <p className="text-sm mt-2 max-w-2xl mx-auto font-light" style={{ color: MUTE_ON_LIGHT }}>
            Everything you need to know about our legal standing, registration, and operational reach.
            We believe in transparency before you even ask.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                  className={`relative rounded-2xl p-6 text-center transition-all duration-300 ${
                    fact.confirmed 
                      ? 'bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-lg' 
                      : 'bg-white/40 backdrop-blur-sm border border-dashed border-[#D8DEE4] hover:border-[#F0B429]/40'
                  }`}
                  style={{
                    background: fact.confirmed 
                      ? 'rgba(255,255,255,0.8)' 
                      : 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Confirmed checkmark */}
                  {fact.confirmed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
                      className="absolute top-2 right-2"
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: YPA_BLUE }}>
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${YPA_GOLD}20` }}>
                        <Zap className="w-3 h-3" style={{ color: YPA_GOLD }} />
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                      isHovered && fact.confirmed ? 'scale-110' : ''
                    }`}
                    style={{ 
                      background: fact.confirmed 
                        ? `${YPA_BLUE}12` 
                        : `${YPA_GOLD}10`,
                    }}
                  >
                    <Icon className={`w-5 h-5 ${fact.confirmed ? 'text-[#00AEEF]' : 'text-[#F0B429]'}`} />
                  </div>

                  {/* Label */}
                  <p className={`${mono.className} text-[10px] tracking-[0.12em] uppercase font-medium mb-1`} style={{ color: MUTE_ON_LIGHT }}>
                    {fact.label}
                  </p>

                  {/* Value */}
                  <p 
                    className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${
                      fact.confirmed 
                        ? 'text-[#111111]' 
                        : 'text-[#F0B429]'
                    }`}
                  >
                    {fact.value}
                  </p>

                  {/* Unconfirmed tag */}
                  {!fact.confirmed && fact.tag && (
                    <div className="mt-2">
                      <span className={`${mono.className} text-[9px] px-2 py-0.5 rounded-full`} style={{ 
                        background: `${YPA_GOLD}10`,
                        color: YPA_GOLD,
                        border: `1px solid ${YPA_GOLD}25`
                      }}>
                        {fact.tag}
                      </span>
                    </div>
                  )}

                  {/* Hover glow effect */}
                  {fact.confirmed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ 
                        background: `radial-gradient(circle at 50% 50%, ${YPA_BLUE}10, transparent 70%)`,
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md" style={{
            background: 'rgba(255,255,255,0.6)',
            border: `1px solid ${YPA_BLUE}15`
          }}>
            <Shield className="h-4 w-4" style={{ color: YPA_BLUE }} />
            <span className={`${mono.className} text-[11px] font-light`} style={{ color: MUTE_ON_LIGHT }}>
              All information verified and up-to-date. 
              <span className="font-medium" style={{ color: YPA_BLUE }}> View official documents</span>
            </span>
            <ArrowUpRight className="h-3.5 w-3.5" style={{ color: YPA_BLUE }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================
// NUMBER COUNTER — Clean, Classic, Premium Animation
// ============================================================
const NumberCounter = ({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) => {
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
      {/* Number */}
      <motion.div
        className={`${display.className} text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight`}
        style={{ color: INK_ON_LIGHT }}
        initial={{ scale: 0.9 }}
        animate={isInView ? { scale: 1 } : { scale: 0.9 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {count.toLocaleString()}
        {suffix}
      </motion.div>

      {/* Label with elegant underline */}
      <div className="mt-2 relative">
        <motion.div
          className={`${display.className} text-sm font-light tracking-wide`}
          style={{ color: MUTE_ON_LIGHT }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {label}
        </motion.div>
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 rounded-full"
          style={{ background: YPA_BLUE }}
          initial={{ width: 0 }}
          animate={isInView ? { width: "40px" } : { width: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

// ============================================================
// SCROLL REVEAL
// ============================================================
const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? {} : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : reduce ? {} : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// STORY SECTION
// ============================================================
const StorySection = ({ content }: { content: any }) => {
  const [activeImage, setActiveImage] = useState(0);
  const reduce = useReducedMotion();
  const images = [
    { src: "http://localhost:8055/assets/c5fc9c26-92d2-41b2-90d0-7c785f0d8011?key=system-medium-cover&modified=2026-07-08T12:40:16", label: "Community" },
    { src: "http://localhost:8055/assets/f96cc76a-53c6-4bc6-8658-801ecdf0a1c9?key=system-medium-cover&modified=2026-07-15T09:23:26", label: "Goats" },
    { src: "http://localhost:8055/assets/5fff51d7-fece-4b04-b0da-86ad019675d7?key=system-medium-cover&modified=2026-07-01T23:23:13", label: "Farm" },
  ];

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(() => setActiveImage((p) => (p + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, [reduce]);

  return (
    <section id="story" className="py-24 px-6 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.span
              variants={fadeInUp}
              className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`}
              style={{ color: YPA_BLUE }}
            >
              Our Story
            </motion.span>
            <motion.h2 variants={fadeInUp} className={`${display.className} text-3xl md:text-4xl lg:text-5xl font-medium mt-3 leading-[1.1]`} style={{ color: INK_ON_LIGHT }}>
              From a village group to a Pan-African movement
            </motion.h2>
            <motion.div variants={fadeInUp} className="mt-6 leading-relaxed space-y-4 font-light" style={{ color: "#4B5A68" }}>
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
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-6">
              <div>
                <div className={`${mono.className} text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>2008</div>
                <div className="text-sm" style={{ color: MUTE_ON_LIGHT }}>Founded</div>
              </div>
              <div>
                <div className={`${mono.className} text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>12</div>
                <div className="text-sm" style={{ color: MUTE_ON_LIGHT }}>Branches</div>
              </div>
              <div>
                <div className={`${mono.className} text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>3</div>
                <div className="text-sm" style={{ color: MUTE_ON_LIGHT }}>Countries</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="relative">
            <div className="absolute -inset-4 rounded-3xl blur-2xl" style={{ background: `linear-gradient(135deg, ${YPA_BLUE}14, ${YPA_BLUE_LIGHT}14)` }} />
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <img src={images[activeImage].src} alt={images[activeImage].label} className="w-full h-full object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 50%)" }} />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 py-3 inline-block shadow-lg">
                  <p className="text-sm font-medium" style={{ color: INK_ON_LIGHT }}>{images[activeImage].label}</p>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: i === activeImage ? "32px" : "16px", background: i === activeImage ? "#fff" : "rgba(255,255,255,0.3)" }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// LEADERSHIP — With Image Support
// ============================================================
interface Leader {
  role: string;
  name: string;
  bio: string;
  image?: string; // File ID from Directus or image URL
}

const LEADERSHIP: Leader[] = [
  { 
    role: "Executive Director", 
    name: "JB Magezi", 
    bio: "Visionary leader with over 15 years of experience in agribusiness and community development. Founded YPA to empower African youth through sustainable agriculture.", 
    image: "http://localhost:8055/assets/e7aac9fd-faed-481d-b991-cd02e893332f?key=system-medium-cover&modified=2026-07-22T11:19:37" // Add file ID or image URL here
  },
  { 
    role: "Chief Operations Officer", 
    name: "—", 
    bio: "Add role summary and years with YPA.",
    image: ""
  },
  { 
    role: "Head of SACCO & Finance", 
    name: "—", 
    bio: "Add role summary and relevant credentials.",
    image: ""
  },
  { 
    role: "Head of Agribusiness Programmes", 
    name: "—", 
    bio: "Add role summary and relevant credentials.",
    image: ""
  },
];

const getInitials = (name: string) =>
  name === "—"
    ? "?"
    : name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

const LeadershipSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="leadership" className="py-24 px-6 md:px-14" style={{ background: MIST }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-14">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
            Governance
          </span>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-3`} style={{ color: INK_ON_LIGHT }}>
            Led by real people
          </h2>
          <p className="text-sm mt-3 max-w-xl mx-auto font-light" style={{ color: MUTE_ON_LIGHT }}>
            Every organisation asking for trust should be willing to put names to it.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEADERSHIP.map((leader, index) => {
            const isHovered = hoveredIndex === index;
            const hasImage = leader.image && leader.image.length > 0;
            const imageUrl = hasImage 
              ? (leader.image?.startsWith("http") ? leader.image : `${API_URL}/assets/${leader.image}`)
              : null;

            return (
              <ScrollReveal key={index} delay={index * 0.08}>
                <motion.div
                  className="group relative bg-white rounded-2xl border overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                  style={{ borderColor: "#E8ECF0" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ y: -4 }}
                >
                  {/* Image or Initials */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#F0F9FE] to-[#E6F8FD]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={leader.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300"
                          style={{ 
                            background: `${YPA_BLUE}12`,
                            border: `2px solid ${YPA_BLUE}20`
                          }}
                        >
                          <span className={`${display.className} text-3xl font-medium`} style={{ color: YPA_BLUE }}>
                            {getInitials(leader.name)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Gradient overlay for better text contrast if image exists */}
                    {imageUrl && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    )}
                    
                    {/* Status indicator */}
                    {leader.name !== "—" ? (
                      <div className="absolute top-3 right-3">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: YPA_BLUE }}>
                      {leader.role}
                    </div>
                    <div 
                      className={`${display.className} text-lg font-medium transition-colors duration-300 ${
                        leader.name === "—" ? 'text-[#F0B429]' : 'text-[#111111] group-hover:text-[#00AEEF]'
                      }`}
                    >
                      {leader.name === "—" ? "Add name" : leader.name}
                    </div>
                    <p className="text-xs mt-2 font-light leading-relaxed line-clamp-3" style={{ color: MUTE_ON_LIGHT }}>
                      {leader.bio}
                    </p>
                    
                    {/* Learn more link */}
                    {leader.name !== "—" && (
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

                  {/* Hover glow */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ 
                      background: `radial-gradient(circle at 50% 50%, ${YPA_BLUE}06, transparent 70%)`,
                    }}
                  />
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Add note about images */}
        <ScrollReveal delay={0.2} className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm" style={{
            background: 'rgba(255,255,255,0.5)',
            border: `1px solid ${YPA_BLUE}15`
          }}>
            <span className={`${mono.className} text-[10px] font-light`} style={{ color: MUTE_ON_LIGHT }}>
              💡 Add photos to Directus → Files → copy file ID into the leader's `image` field
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

// ============================================================
// MISSION & VISION
// ============================================================
const MissionVisionSection = ({ content }: { content: any }) => {
  return (
    <section className="py-24 px-6 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-16">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
            Our Purpose
          </span>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-3`} style={{ color: INK_ON_LIGHT }}>
            Why we exist
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Target,
              label: "Our Mission",
              html: content?.mission,
              fallback:
                "To economically empower individuals through extraordinary agribusiness practices for international competitiveness.",
            },
            {
              icon: Globe,
              label: "Our Vision",
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
                className="group bg-white p-10 rounded-2xl border transition-all duration-500 hover:shadow-xl"
                style={{ borderColor: "#EEF1F3" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300"
                  style={{ background: `${YPA_BLUE}12` }}
                >
                  <Icon className="w-7 h-7" style={{ color: YPA_BLUE }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: YPA_BLUE }}>{card.label}</span>
                <div className="text-lg md:text-xl leading-relaxed mt-3 font-light" style={{ color: "#3E4C59" }}>
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
    <section className="py-24 px-6 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-5xl">
        <ScrollReveal className="text-center mb-12">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
            Core Values
          </span>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-3`} style={{ color: INK_ON_LIGHT }}>
            What we believe
          </h2>
        </ScrollReveal>

        <div className="space-y-3">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.05}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-4 p-4 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${YPA_BLUE}12` }}>
                    <Icon className="w-5 h-5" style={{ color: YPA_BLUE }} />
                  </div>
                  <div>
                    <span className={`${mono.className} text-xs font-bold`} style={{ color: YPA_BLUE }}>0{i + 1}</span>
                    <p className="leading-relaxed font-light" style={{ color: "#4B5A68" }}>{v.text}</p>
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
    <section className="py-24 px-6 md:px-14 border-t overflow-hidden" style={{ background: MIST, borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-12">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
            Timeline
          </span>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-3`} style={{ color: INK_ON_LIGHT }}>
            Our journey, year by year
          </h2>
        </ScrollReveal>

        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: "thin" }}>
          {MILESTONES.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.06} className="shrink-0">
              <div
                className="min-w-[240px] md:min-w-[280px] snap-start bg-white p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: "#EEF1F3" }}
              >
                <div className={`${mono.className} text-2xl font-medium`} style={{ color: YPA_BLUE }}>{item.year}</div>
                <div className="text-base font-medium mt-1" style={{ color: INK_ON_LIGHT }}>{item.label}</div>
                <div className="text-sm mt-1 font-light" style={{ color: MUTE_ON_LIGHT }}>{item.desc}</div>
                <div className="mt-4 h-1 w-12 rounded-full" style={{ background: `${YPA_BLUE}20` }}>
                  <div className="h-full w-4 rounded-full" style={{ background: YPA_BLUE }} />
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
// REGISTRATION & COMPLIANCE
// ============================================================
const COMPLIANCE_CARDS = [
  { icon: Landmark, title: "Legal Registration", body: "Registered entity in Uganda.", need: "Add registration type, number & registering body (URSB)" },
  { icon: FileText, title: "Tax Compliance", body: "Tax registration on file.", need: "Add TIN and compliance certificate" },
  { icon: Shield, title: "Regulatory Oversight", body: "SACCO operations are subject to oversight.", need: "Add the specific regulator(s) YPA SACCO reports to" },
  { icon: Award, title: "Independent Audit", body: "Financials reviewed annually.", need: "Add auditor name and latest audit year" },
];

const ComplianceSection = () => {
  return (
    <section className="py-24 px-6 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="mb-12">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
            Due Diligence
          </span>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-3 max-w-xl`} style={{ color: INK_ON_LIGHT }}>
            The paperwork behind the story
          </h2>
          <p className="text-sm mt-3 max-w-xl font-light" style={{ color: MUTE_ON_LIGHT }}>
            Checking us out before you commit is reasonable — here's what we have on record, and
            what we still need to publish.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPLIANCE_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="rounded-2xl border p-6 h-full" style={{ borderColor: "#EEF1F3", background: MIST }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${YPA_BLUE}12` }}>
                    <Icon className="h-5 w-5" style={{ color: YPA_BLUE }} />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: INK_ON_LIGHT }}>{c.title}</div>
                  <p className="text-xs mt-2 font-light leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>{c.body}</p>
                  <div
                    className="mt-3 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-dashed leading-snug"
                    style={{ color: YPA_GOLD, borderColor: `${YPA_GOLD}66`, background: `${YPA_GOLD}0d` }}
                  >
                    {c.need}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.2} className="mt-6">
          <div className="rounded-2xl border p-6 flex flex-wrap items-center justify-between gap-4" style={{ borderColor: "#EEF1F3" }}>
            <div>
              <div className="text-sm font-semibold" style={{ color: INK_ON_LIGHT }}>Published documents</div>
              <p className="text-xs mt-1 font-light" style={{ color: MUTE_ON_LIGHT }}>
                Annual report, audited financials, and our strategic plan — for anyone who wants the source documents, not just the summary.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Annual Report", "Audited Financials", "Strategic Plan"].map((doc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border border-dashed"
                  style={{ color: YPA_GOLD, borderColor: `${YPA_GOLD}66` }}
                >
                  <FileText className="h-3.5 w-3.5" />
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
    <section className="py-24 px-6 md:px-14" style={{ background: INK }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="mb-12">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase text-white/40`}>
            Physical Presence
          </span>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-3 text-white`}>
            Find us in person
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-4">
          {OFFICES.map((o, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="rounded-2xl border p-6 h-full" style={{ borderColor: LINE, background: NAVY }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${YPA_BLUE_LIGHT}18` }}>
                  <MapPin className="h-5 w-5" style={{ color: YPA_BLUE_LIGHT }} />
                </div>
                <div className="text-base font-medium text-white">{o.region}</div>
                <p className="text-xs mt-2 font-light text-white/50">{o.detail}</p>
                <div
                  className="mt-4 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-dashed inline-block"
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
    <section className="py-20 px-6 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-10">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
            Recognition
          </span>
          <h2 className={`${display.className} text-2xl md:text-3xl font-medium mt-3`} style={{ color: INK_ON_LIGHT }}>
            Partners & certifications
          </h2>
          <p className="text-xs mt-2 font-light" style={{ color: MUTE_ON_LIGHT }}>
            <NeedsInfo>Add real partner / certifying-body logos here</NeedsInfo>
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {slots.map((_, i) => (
            <div
              key={i}
              className="aspect-[3/2] rounded-xl border border-dashed flex items-center justify-center"
              style={{ borderColor: "#D8DEE4", background: MIST }}
            >
              <span className="text-[10px] font-medium text-center px-2" style={{ color: MUTE_ON_LIGHT }}>
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
    <section id="faq" className="py-24 px-6 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal className="text-center mb-14">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
            FAQ
          </span>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-3`} style={{ color: INK_ON_LIGHT }}>
            Frequently asked questions
          </h2>
          <p className="text-sm mt-2 font-light" style={{ color: MUTE_ON_LIGHT }}>
            Quick answers to common questions about YPA
          </p>
        </ScrollReveal>

        {faqs.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border" style={{ background: MIST, borderColor: "#EEF1F3" }}>
            <p className="font-light" style={{ color: MUTE_ON_LIGHT }}>No FAQs yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.id} delay={index * 0.04}>
                <div className="group bg-white border rounded-xl transition-all duration-300 overflow-hidden" style={{ borderColor: "#EEF1F3" }}>
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`${mono.className} w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors`}
                        style={{
                          background: openFaqIndex === index ? YPA_BLUE : "#EEF1F3",
                          color: openFaqIndex === index ? "#fff" : MUTE_ON_LIGHT,
                        }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium transition-colors" style={{ color: INK_ON_LIGHT }}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className="w-5 h-5 transition-transform duration-300"
                      style={{ color: openFaqIndex === index ? YPA_BLUE : MUTE_ON_LIGHT, transform: openFaqIndex === index ? "rotate(180deg)" : "none" }}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="px-6 pb-5">
                      <div className="border-t pt-4" style={{ borderColor: "#EEF1F3" }}>
                        <div
                          className="text-sm leading-relaxed font-light"
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
    <section className="py-24 px-6 md:px-14 relative overflow-hidden" style={{ background: INK }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: YPA_BLUE_LIGHT }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[200px]" style={{ background: YPA_BLUE }} />
      </div>
      <div className="relative container mx-auto max-w-5xl text-center">
        <ScrollReveal>
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE_LIGHT }}>
            Ambition
          </span>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-3 text-white`}>YPA Vision 2030</h2>
          <p className="text-sm mt-2 font-light text-white/40">Our roadmap to becoming the greatest empowerment platform in Africa</p>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.06}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="border rounded-xl p-5 transition-all duration-300"
                  style={{ borderColor: LINE }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-white/30" />
                  <div className="text-sm font-medium text-white/80">{item.label}</div>
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

      <section className="py-16 px-6 md:px-14 bg-white border-b" style={{ borderColor: "#EEF1F3" }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <NumberCounter target={130000} label="Goats Under Care" suffix="+" />
            <NumberCounter target={12} label="Branches" suffix="" />
            <NumberCounter target={1000} label="Members" suffix="+" />
            <NumberCounter target={2008} label="Founded" suffix="" />
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

      <section className="py-20 px-6 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: `${YPA_BLUE}12` }}>
              <Sparkles className="w-8 h-8" style={{ color: YPA_BLUE }} />
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium`} style={{ color: INK_ON_LIGHT }}>
              Now that you know who we are
            </h2>
            <p className="text-sm mt-2 font-light" style={{ color: MUTE_ON_LIGHT }}>
              Become part of Africa's leading agribusiness platform, or just ask us anything else you need to know.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: YPA_BLUE, boxShadow: `0 20px 40px -12px ${YPA_BLUE}66` }}
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sacco"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium border transition-all duration-300"
                style={{ color: INK_ON_LIGHT, borderColor: "#EEF1F3" }}
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