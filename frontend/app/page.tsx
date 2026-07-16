"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
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

// ============================================================
// DESIGN TOKENS
// ============================================================
const INK = "#060B14";
const NAVY = "#0E2540";
const NAVY_SOFT = "#153455";
const LINE = "#1F3B57";
const BLUE = "#2196F3";
const SKY = "#7EC8FF";
const GOLD = "#F0B429";
const MIST = "#F6F8FA";
const INK_ON_LIGHT = "#0E2540";
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

// ============================================================
// FETCH SIGNAL ARTICLES
// ============================================================
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

// Fallback articles (so the page still works if Directus is down)
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
      style={{ scaleX: scrollYProgress, background: BLUE }}
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

  // Rail sits on its own glass capsule, well clear of body copy, and
  // labels only ever render inside their own frosted chip — never as
  // bare text floating over whatever section happens to be behind it.
  return (
    <div className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div
        className="relative flex flex-col items-center gap-[14px] py-5 px-[9px] rounded-full"
        style={{
          background: "rgba(10,20,34,0.38)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.25), 0 0 24px ${BLUE}22`,
        }}
      >
        {/* progress fill glowing up the spine of the capsule */}
        <div
          className="absolute left-1/2 top-2 bottom-2 w-[2px] -translate-x-1/2 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <motion.div
            className="w-full rounded-full"
            style={{ background: `linear-gradient(180deg, ${SKY}, ${BLUE})`, boxShadow: `0 0 8px ${BLUE}` }}
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
                  background: isActive ? BLUE : "rgba(255,255,255,0.35)",
                  boxShadow: isActive ? `0 0 10px ${BLUE}` : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.3 }}
              />

              {/* detached glass label chip — has its own background, so it
                  never blends into whatever content sits behind the rail */}
              <AnimatePresence>
                {(isActive || isHovered) && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.2 }}
                    className={`${mono.className} absolute left-full ml-3 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase font-medium`}
                    style={{
                      background: "rgba(10,20,34,0.9)",
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${isActive ? `${BLUE}55` : "rgba(255,255,255,0.12)"}`,
                      boxShadow: isActive ? `0 0 16px ${BLUE}33` : "0 4px 16px rgba(0,0,0,0.3)",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
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

/// ============================================================
// SCROLL REVEAL (copy from homepage) – fixed types
// ============================================================
const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
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
// HERO
// ============================================================
const LINEUP = [
  {
    kicker: "Model 01 — Livestock",
    title: "The Goats Programme",
    line: "Mubende × Boer × Kalahari, raised for guaranteed off-take.",
    specs: [
      { label: "Under care", value: "130,000+" },
      { label: "Success rate", value: "95%" },
      { label: "Market access", value: "Guaranteed" },
    ],
    gradient: "from-[#060B14] via-[#0E2540] to-[#2196F3]/40",
    href: "/projects/goats",
    glyph: "goat" as const,
    aura: SKY,
  },
  {
    kicker: "Model 02 — Cropping",
    title: "Maize Contract Farming",
    line: "Modern inputs, guaranteed buyers, a return you can plan around.",
    specs: [
      { label: "Cultivated", value: "5,000+ acres" },
      { label: "Avg. return", value: "3.0×" },
      { label: "Off-take", value: "Contracted" },
    ],
    gradient: "from-[#0E2540] via-[#153455] to-[#060B14]",
    href: "/projects/maize",
    glyph: "maize" as const,
    aura: GOLD,
  },
  {
    kicker: "Model 03 — Finance",
    title: "YPA SACCO",
    line: "Savings and credit built around the rhythm of a harvest, not a payslip.",
    specs: [
      { label: "Members", value: "1,000+" },
      { label: "Branches", value: "12" },
      { label: "Founded", value: "2014" },
    ],
    gradient: "from-[#060B14] via-[#0E2540]/80 to-[#153455]",
    href: "/sacco",
    glyph: "money" as const,
    aura: POSITIVE,
  },
];

// GlowDefs, GoatGlyph, MaizeGlyph, MoneyGlyph, HeroVisual
const GlowDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="heroGlow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="goatGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={SKY} />
        <stop offset="100%" stopColor={BLUE} />
      </linearGradient>
      <linearGradient id="maizeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFE08A" />
        <stop offset="100%" stopColor={GOLD} />
      </linearGradient>
      <linearGradient id="moneyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor={POSITIVE} />
      </linearGradient>
      <linearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFE08A" />
        <stop offset="100%" stopColor={GOLD} />
      </linearGradient>
    </defs>
  </svg>
);

const GoatGlyph = () => {
  const reduce = useReducedMotion();
  const off = reduce ? {} : undefined;
  return (
    <svg viewBox="0 0 320 320" className="w-full h-full">
      <motion.g
        fill="none"
        stroke="url(#goatGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#heroGlow)"
        animate={off || { y: [0, -5, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* horns — a slow shimmer instead of movement, so they read as catching light */}
        <motion.path
          d="M188 92 C176 62 182 32 210 16"
          animate={off || { opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M214 94 C226 66 246 44 268 34"
          animate={off || { opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        {/* ears — a little twitch */}
        <motion.path
          d="M177 108 C168 100 155 98 148 106"
          animate={off || { x: [0, -3, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
        />
        <motion.path
          d="M222 106 C230 98 242 97 249 104"
          animate={off || { x: [0, 3, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
        />
        {/* head — a slow grazing nod */}
        <motion.ellipse
          cx="200"
          cy="122"
          rx="27"
          ry="24"
          animate={off || { y: [0, 3, 0, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* body */}
        <path d="M178 138 C150 150 118 158 98 182 C82 202 82 226 100 244 C122 262 162 266 197 258 C227 251 247 231 251 206 C254 185 246 160 226 141 C215 132 195 130 178 138 Z" />
        {/* legs — alternating walk-in-place */}
        <motion.path d="M118 244 L112 288" animate={off || { y: [0, -4, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }} />
        <motion.path d="M152 254 L149 292" animate={off || { y: [0, 4, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.32 }} />
        <motion.path d="M192 256 L194 294" animate={off || { y: [0, -4, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.16 }} />
        <motion.path d="M224 246 L232 286" animate={off || { y: [0, 4, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.48 }} />
        {/* tail — a wag */}
        <motion.path
          d="M248 198 C262 192 270 200 262 214 C256 224 244 222 240 212"
          animate={off || { x: [0, 5, 0, -3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>
      {/* eye — a blink */}
      <motion.circle
        cx="207"
        cy="118"
        r="3.5"
        fill={SKY}
        animate={off || { opacity: [1, 1, 0.15, 1, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.88, 0.91, 0.94, 1] }}
      />
    </svg>
  );
};

const KERNEL_TONES = ["#FFE08A", "#F0B429", "#E2790C"];

const MaizeGlyph = () => {
  const reduce = useReducedMotion();
  const off = reduce ? {} : undefined;
  const kernels = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 3; col++) {
      const y = 76 + row * 19;
      const stagger = row % 2 === 0 ? 0 : 9;
      const x = 132 + col * 20 + stagger;
      const tone = KERNEL_TONES[(row + col) % KERNEL_TONES.length];
      kernels.push({ x, y, tone, delay: (row + col) * 0.09, key: `${row}-${col}` });
    }
  }
  return (
    <svg viewBox="0 0 320 320" className="w-full h-full">
      <g filter="url(#heroGlow)">
        <path
          d="M160 44 C186 44 202 64 202 92 L202 226 C202 258 186 280 160 280 C134 280 118 258 118 226 L118 92 C118 64 134 44 160 44 Z"
          fill="none"
          stroke="url(#maizeGrad)"
          strokeWidth="3"
        />
        {/* kernels — a wave of light rolling down the cob, each in a different corn tone */}
        {kernels.map((k) => (
          <motion.circle
            key={k.key}
            cx={k.x}
            cy={k.y}
            r="4.4"
            fill={k.tone}
            animate={off || { opacity: [0.55, 1, 0.55], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: k.delay }}
          />
        ))}
        {/* husk leaves — a gentle sway */}
        <motion.path
          d="M138 258 C100 268 78 296 66 320"
          fill="none"
          stroke="url(#maizeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={off || { x: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M182 258 C220 268 242 296 254 320"
          fill="none"
          stroke="url(#maizeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={off || { x: [0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        {/* silk tuft — a light flutter */}
        <motion.path
          d="M150 46 C144 28 148 12 160 2"
          fill="none"
          stroke="url(#maizeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={off || { x: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M172 46 C180 28 182 12 174 2"
          fill="none"
          stroke="url(#maizeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={off || { x: [0, 2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </g>
    </svg>
  );
};

const SPARKLES = [
  { x: 92, y: 200, delay: 0 },
  { x: 236, y: 150, delay: 0.9 },
  { x: 190, y: 210, delay: 1.7 },
];

const MoneyGlyph = () => {
  const reduce = useReducedMotion();
  const off = reduce ? {} : undefined;
  return (
    <svg viewBox="0 0 320 320" className="w-full h-full">
      <g filter="url(#heroGlow)">
        {/* coin stack — gold, each settling into place with a slight stagger */}
        <g fill="none" stroke="url(#coinGrad)" strokeWidth="3">
          <motion.ellipse
            cx="146" cy="240" rx="58" ry="19"
            animate={off || { y: [0, -3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="153" cy="212" rx="58" ry="19"
            animate={off || { y: [0, -3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
          />
          <motion.ellipse
            cx="160" cy="184" rx="58" ry="19"
            animate={off || { y: [0, -3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <ellipse cx="160" cy="184" rx="40" ry="12" opacity="0.6" />
        </g>
        <circle cx="160" cy="184" r="9" fill="none" stroke="url(#coinGrad)" strokeWidth="2.5" />

        {/* growth line — draws itself, then resets, on a loop */}
        <motion.path
          d="M62 262 L104 230 L142 248 L188 168 L246 96"
          fill="none"
          stroke="url(#moneyGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={off || { pathLength: [0, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatType: "loop", repeatDelay: 1.2, ease: "easeInOut" }}
        />
        <path d="M222 96 L246 96 L246 120" fill="none" stroke="url(#moneyGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {[
          [104, 230],
          [142, 248],
          [188, 168],
        ].map(([cx, cy], idx) => (
          <motion.circle
            key={idx}
            cx={cx}
            cy={cy}
            r="3.5"
            fill={POSITIVE}
            animate={off || { opacity: [0, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.2, delay: idx * 0.5, ease: "easeInOut" }}
          />
        ))}

        {/* sparkle glints */}
        {SPARKLES.map((s, idx) => (
          <motion.g
            key={idx}
            animate={off || { opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
            style={{ transformOrigin: `${s.x}px ${s.y}px` }}
          >
            <path d={`M${s.x - 6} ${s.y} L${s.x + 6} ${s.y}`} stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
            <path d={`M${s.x} ${s.y - 6} L${s.x} ${s.y + 6}`} stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        ))}
      </g>
    </svg>
  );
};

const GLYPHS: Record<string, () => JSX.Element> = {
  goat: GoatGlyph,
  maize: MaizeGlyph,
  money: MoneyGlyph,
};

const HeroVisual = ({ glyph, aura }: { glyph: string; aura: string }) => {
  const reduce = useReducedMotion();
  const Glyph = GLYPHS[glyph] || GoatGlyph;

  return (
    <div className="relative w-full max-w-[420px] mx-auto aspect-square">
      <GlowDefs />

      <motion.div
        key={`aura-${aura}`}
        animate={reduce ? { opacity: 0.5 } : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[6%] rounded-full blur-3xl"
        style={{ background: aura }}
      />

      <motion.svg
        viewBox="0 0 320 320"
        className="absolute inset-0 w-full h-full"
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="160" cy="160" r="148" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="2 10" />
        <circle cx="160" cy="12" r="4" fill={aura} />
      </motion.svg>
      <motion.svg
        viewBox="0 0 320 320"
        className="absolute inset-0 w-full h-full"
        animate={reduce ? {} : { rotate: -360 }}
        transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="160" cy="160" r="128" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="1 6" />
      </motion.svg>

      <motion.div
        animate={reduce ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[14%]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={glyph}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, filter: "blur(14px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.12, filter: "blur(14px)" }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full h-full"
          >
            <Glyph />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

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

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#060B14]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${current.gradient}`}
        />
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={reduce ? {} : { x: [0, 90, -40, 0], y: [0, -70, 50, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[8%] right-[6%] w-[560px] h-[560px] rounded-full blur-3xl transition-colors duration-[1500ms]"
          style={{ background: `${current.aura}26` }}
        />
        <motion.div
          animate={reduce ? {} : { x: [0, -70, 40, 0], y: [0, 50, -60, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[6%] left-[4%] w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: `${SKY}14` }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          opacity: 0.1,
          WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 45%, #000 0%, transparent 78%)",
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 45%, #000 0%, transparent 78%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 md:px-14">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-4 lg:gap-16 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className={`${mono.className} flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-white/50 mb-7`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34D399]" />
                </span>
                {current.kicker}
              </div>

              <h1
                className={`${display.className} text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.03] tracking-tight max-w-xl`}
              >
                {current.title}
              </h1>

              <p className="mt-6 text-lg md:text-xl text-white/55 font-light max-w-xl leading-relaxed">
                {current.line}
              </p>

              <div className={`${mono.className} mt-10 flex flex-wrap gap-x-10 gap-y-4`}>
                {current.specs.map((s, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-white/35">
                      {s.label}
                    </span>
                    <span className="text-xl md:text-2xl text-white font-medium">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={current.href}
                  className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                  style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
                >
                  Configure this programme
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-medium text-white/75 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
                >
                  <Play className="h-4 w-4" />
                  See how YPA works
                </Link>
              </div>

              <div className="flex gap-2 mt-12">
                {LINEUP.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    aria-label={`Show ${LINEUP[idx].title}`}
                    className="h-[3px] rounded-full transition-all duration-700"
                    style={{
                      width: idx === i ? "48px" : "16px",
                      background: idx === i ? "#fff" : "rgba(255,255,255,0.25)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="hidden lg:block">
            <HeroVisual glyph={current.glyph} aura={current.aura} />
          </div>
        </div>
      </div>

      <motion.a
        href="#index"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className={`${mono.className} text-[10px] tracking-[0.3em] uppercase text-white/30`}>
          The Field Index
        </span>
        <motion.div
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-white/40" />
        </motion.div>
      </motion.a>
    </section>
  );
};

// ============================================================
// FIELD INDEX
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
    <section id="index" className="relative overflow-hidden" style={{ background: NAVY }}>
      <div className="flex items-center gap-2.5 px-6 md:px-14 pt-6">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34D399]" />
        </span>
        <span className={`${display.className} text-[13px] text-white/45`}>
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
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex flex-col">
                <span className="text-[11px] text-white/40">{m.label}</span>
                <span className={`${mono.className} text-lg text-white font-medium`}>{m.value}</span>
              </div>
              <span
                className="text-[10px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{ color: POSITIVE, background: `${POSITIVE}14` }}
              >
                {m.delta}
              </span>
            </div>
          ))}
        </motion.div>
        <div
          className="absolute inset-y-0 left-0 w-16 md:w-28 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${NAVY}, transparent)` }}
        />
        <div
          className="absolute inset-y-0 right-0 w-16 md:w-28 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${NAVY}, transparent)` }}
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
                  style={{ background: `linear-gradient(135deg, ${BLUE}22, transparent 60%)` }}
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
                      style={{ background: BLUE }}
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
  const [hover, setHover] = useState(null);

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
                              <span className="h-1 w-1 rounded-full" style={{ background: BLUE }} />
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
                    style={{ background: `${BLUE}12` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: BLUE }} />
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
// SIGNAL — with "View all stories" link
// ============================================================
const Signal = ({ signalArticles }) => {
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
            style={{ color: BLUE }}
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
                    style={{ background: BLUE }}
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
                  <span className="text-[10px] font-medium tracking-wide uppercase" style={{ color: BLUE }}>
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
const PressSignal = ({ pressItems }) => {
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
            style={{ color: BLUE }}
          >
            Open the media center
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="divide-y" style={{ borderColor: "#E8ECF0" }}>
        {press.slice(0, 3).map((item, i) => {
          const Icon = typeIcons[item.type] || Newspaper;
          return (
            <ScrollReveal key={i} delay={i * 0.06}>
              <Link href={item.link || "#"} target="_blank" className="group flex items-center gap-5 py-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${BLUE}12` }}
                >
                  <Icon className="h-4 w-4" style={{ color: BLUE }} />
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
// LIVE PANEL
// ============================================================
const LivePanel = ({ events, blogs }) => {
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
      <div
        className="rounded-3xl p-6 shadow-2xl border"
        style={{ background: "rgba(14,37,64,0.85)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="mb-6">
          <div className={`${mono.className} flex items-center gap-2 mb-4 text-[10px] tracking-[0.2em] uppercase text-white/50`}>
            <span className="w-1 h-4 rounded-full" style={{ background: BLUE }} />
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
                style={{ background: `${BLUE}22` }}
              >
                {(() => {
                  const Icon = facts[active].icon;
                  return <Icon className="w-5 h-5" style={{ color: SKY }} />;
                })()}
              </div>
              <h4 className="text-base font-medium text-white">{facts[active].title}</h4>
              <p className="mt-2 text-sm text-white/55 font-light leading-relaxed">{facts[active].description}</p>
              <div className="flex gap-1.5 mt-4">
                {facts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ width: i === active ? "22px" : "10px", background: i === active ? BLUE : "rgba(255,255,255,0.2)" }}
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
              <div className={`${mono.className} flex items-center gap-2 mb-3 text-[10px] tracking-[0.2em] uppercase text-white/50`}>
                <span className="w-1 h-4 rounded-full" style={{ background: SKY }} />
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
                          background: "rgba(255,255,255,0.05)",
                          borderColor: soon ? "rgba(240,180,41,0.4)" : "rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="text-sm font-medium text-white line-clamp-1">{event.title}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
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
              <div className={`${mono.className} flex items-center gap-2 mb-3 text-[10px] tracking-[0.2em] uppercase text-white/50`}>
                <span className="w-1 h-4 rounded-full" style={{ background: GOLD }} />
                Popular Blogs
              </div>
              <div className="space-y-2">
                {blogs.slice(0, 3).map((blog, i) => (
                  <Link key={i} href={`/blog/${blog.slug}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 p-3 rounded-xl border transition-all duration-300"
                      style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" }}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0" style={{ background: NAVY_SOFT }}>
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
                        <div className="text-[11px] text-white/35 mt-0.5">
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
// FINAL CTA
// ============================================================
const FinalCTA = () => {
  return (
    <section id="cta" className="relative px-6 py-32 overflow-hidden" style={{ background: INK }}>
      <div className="absolute inset-0">
        <div className="absolute top-[-50%] right-[-15%] w-[700px] h-[700px] rounded-full blur-3xl" style={{ background: `${BLUE}14` }} />
        <div className="absolute bottom-[-50%] left-[-15%] w-[700px] h-[700px] rounded-full blur-3xl" style={{ background: `${SKY}10` }} />
      </div>

      <ScrollReveal className="relative z-10 max-w-2xl mx-auto text-center">
        <div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
        >
          <Sparkles className="h-6 w-6" style={{ color: SKY }} />
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
            style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
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
            style={{ borderColor: "#E3F2FD", borderTopColor: BLUE }}
          />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main
      className={`${display.variable} ${mono.variable} min-h-screen bg-white font-sans antialiased selection:bg-[#2196F3]/30`}
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