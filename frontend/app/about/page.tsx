"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
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
    style={{ color: GOLD, borderColor: `${GOLD}88`, background: `${GOLD}0f` }}
  >
    <Zap className="h-2.5 w-2.5" />
    {children}
  </span>
);

// ============================================================
// PARALLAX HERO
// ============================================================
const ParallaxHero = ({ content }: { content: any }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);

  return (
    <section id="hero" ref={ref} className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ background: INK }}>
      <motion.div className="absolute inset-0" style={reduce ? {} : { y, opacity }}>
        {content?.hero_image ? (
          <img src={`${API_URL}/assets/${content.hero_image}`} alt="Youth Platform Africa" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${INK}, ${NAVY})` }} />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${INK}D9, ${INK}99, transparent)` }} />
      </motion.div>

      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative container mx-auto px-6 md:px-14 max-w-7xl z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="max-w-3xl">
          <div className={`${mono.className} flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-white/45`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34D399]" />
            </span>
            Est. 2008 · Registered · Uganda
          </div>

          <h1 className={`${display.className} text-4xl md:text-5xl lg:text-7xl font-medium text-white leading-[1.05] tracking-tight mt-5`}>
            Who we are,
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(90deg, ${SKY}, ${BLUE}, ${SKY})` }}
            >
              stated plainly
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/50 max-w-lg leading-relaxed mt-5 font-light">
            Youth Platform Africa started as a 21-person village group and grew into a Pan-African
            agribusiness platform. Here's the full record — our story, our people, and the paperwork
            that proves it.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-9">
            <Link
              href="#verify"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
            >
              Verify our credentials
              <BadgeCheck className="w-4 h-4" />
            </Link>
            <Link
              href="#story"
              className="inline-flex items-center gap-2 text-white/55 text-sm font-medium hover:text-white transition-colors border border-white/15 px-6 py-3.5 rounded-full hover:bg-white/5"
            >
              Read our story
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
};

// ============================================================
// VERIFY STRIP
// ============================================================
const VERIFY_FACTS = [
  { label: "LEGAL STATUS", value: "Registered organisation", confirmed: false, tag: "confirm exact registration type (NGO / CBO / Ltd.)" },
  { label: "URSB REG. NO.", value: "—", confirmed: false, tag: "add URSB registration number" },
  { label: "TAX ID (TIN)", value: "—", confirmed: false, tag: "add TIN" },
  { label: "ESTABLISHED", value: "2008", confirmed: true },
  { label: "HEADQUARTERS", value: "—", confirmed: false, tag: "add physical HQ address" },
  { label: "BRANCHES", value: "12, Uganda", confirmed: true },
];

const VerifyStrip = () => {
  return (
    <section id="verify" className="border-y" style={{ background: NAVY, borderColor: LINE }}>
      <div className="flex items-center gap-3 px-6 md:px-14 pt-4">
        <ScrollText className="h-3.5 w-3.5" style={{ color: GOLD }} />
        <span className={`${mono.className} text-[10px] tracking-[0.22em] uppercase text-white/40`}>
          Verify us — the facts a due-diligence check would ask for
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {VERIFY_FACTS.map((f, i) => (
          <div key={i} className={mono.className}>
            <div className="text-[10px] tracking-[0.12em] uppercase text-white/35">{f.label}</div>
            <div className="text-base mt-1" style={{ color: f.confirmed ? "#fff" : GOLD }}>
              {f.value}
            </div>
            {!f.confirmed && (
              <div className="text-[9px] mt-1 text-white/30 normal-case tracking-normal">{f.tag}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================================
// NUMBER COUNTER
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
    const step = Math.max(1, Math.floor(target / 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 2000 / 60);
    return () => clearInterval(interval);
  }, [target, isInView, reduce]);

  return (
    <div ref={ref} className="text-center">
      <div className={`${mono.className} text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm font-light mt-2" style={{ color: MUTE_ON_LIGHT }}>
        {label}
      </div>
    </div>
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
    { src: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=900&q=80", label: "Community" },
    { src: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=900&q=80", label: "Goats" },
    { src: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&q=80", label: "Farm" },
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
              style={{ color: BLUE }}
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
            <div className="absolute -inset-4 rounded-3xl blur-2xl" style={{ background: `linear-gradient(135deg, ${BLUE}14, ${SKY}14)` }} />
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
// LEADERSHIP
// ============================================================
const LEADERSHIP = [
  { role: "Founder & CEO", name: "—", bio: "Add a short bio — background, and why YPA was started." },
  { role: "Chief Operations Officer", name: "—", bio: "Add role summary and years with YPA." },
  { role: "Head of SACCO & Finance", name: "—", bio: "Add role summary and relevant credentials." },
  { role: "Head of Agribusiness Programmes", name: "—", bio: "Add role summary and relevant credentials." },
];

const initials = (name: string) =>
  name === "—"
    ? "?"
    : name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

const LeadershipSection = () => {
  return (
    <section id="leadership" className="py-24 px-6 md:px-14" style={{ background: MIST }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-14">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
            Governance
          </span>
          <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-3`} style={{ color: INK_ON_LIGHT }}>
            Led by real people
          </h2>
          <p className="text-sm mt-3 max-w-xl mx-auto font-light" style={{ color: MUTE_ON_LIGHT }}>
            Every organisation asking for trust should be willing to put names to it.
            <NeedsInfo>Add leadership names, photos & bios</NeedsInfo>
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LEADERSHIP.map((p, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="bg-white rounded-2xl border p-6 h-full" style={{ borderColor: "#E8ECF0" }}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-dashed"
                  style={{ background: `${BLUE}0d`, borderColor: `${BLUE}55` }}
                >
                  <span className={`${mono.className} text-sm font-medium`} style={{ color: BLUE }}>
                    {initials(p.name)}
                  </span>
                </div>
                <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: BLUE }}>{p.role}</div>
                <div className="text-lg font-medium mt-1" style={{ color: p.name === "—" ? GOLD : INK_ON_LIGHT }}>
                  {p.name === "—" ? "Add name" : p.name}
                </div>
                <p className="text-xs mt-2 font-light leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>{p.bio}</p>
              </div>
            </ScrollReveal>
          ))}
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
    <section className="py-24 px-6 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-16">
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
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
                  style={{ background: `${BLUE}12` }}
                >
                  <Icon className="w-7 h-7" style={{ color: BLUE }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: BLUE }}>{card.label}</span>
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
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${BLUE}12` }}>
                    <Icon className="w-5 h-5" style={{ color: BLUE }} />
                  </div>
                  <div>
                    <span className={`${mono.className} text-xs font-bold`} style={{ color: BLUE }}>0{i + 1}</span>
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
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
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
                <div className={`${mono.className} text-2xl font-medium`} style={{ color: BLUE }}>{item.year}</div>
                <div className="text-base font-medium mt-1" style={{ color: INK_ON_LIGHT }}>{item.label}</div>
                <div className="text-sm mt-1 font-light" style={{ color: MUTE_ON_LIGHT }}>{item.desc}</div>
                <div className="mt-4 h-1 w-12 rounded-full" style={{ background: `${BLUE}20` }}>
                  <div className="h-full w-4 rounded-full" style={{ background: BLUE }} />
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
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${BLUE}12` }}>
                    <Icon className="h-5 w-5" style={{ color: BLUE }} />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: INK_ON_LIGHT }}>{c.title}</div>
                  <p className="text-xs mt-2 font-light leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>{c.body}</p>
                  <div
                    className="mt-3 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-dashed leading-snug"
                    style={{ color: GOLD, borderColor: `${GOLD}66`, background: `${GOLD}0d` }}
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
                  style={{ color: GOLD, borderColor: `${GOLD}66` }}
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${SKY}18` }}>
                  <MapPin className="h-5 w-5" style={{ color: SKY }} />
                </div>
                <div className="text-base font-medium text-white">{o.region}</div>
                <p className="text-xs mt-2 font-light text-white/50">{o.detail}</p>
                <div
                  className="mt-4 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-dashed inline-block"
                  style={{ color: GOLD, borderColor: `${GOLD}66`, background: `${GOLD}0d` }}
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
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
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
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
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
                          background: openFaqIndex === index ? BLUE : "#EEF1F3",
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
                      style={{ color: openFaqIndex === index ? BLUE : MUTE_ON_LIGHT, transform: openFaqIndex === index ? "rotate(180deg)" : "none" }}
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: SKY }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[200px]" style={{ background: BLUE }} />
      </div>
      <div className="relative container mx-auto max-w-5xl text-center">
        <ScrollReveal>
          <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: SKY }}>
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
            style={{ borderColor: "#E3F2FD", borderTopColor: BLUE }}
          />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`${display.variable} ${mono.variable} min-h-screen bg-white overflow-x-hidden font-sans`}>
      <Navigation />

      <ParallaxHero content={content} />
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
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: `${BLUE}12` }}>
              <Sparkles className="w-8 h-8" style={{ color: BLUE }} />
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
                style={{ background: INK_ON_LIGHT }}
              >
                Get in touch
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sacco"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium border transition-all duration-300"
                style={{ color: INK_ON_LIGHT, borderColor: "#E8ECF0" }}
              >
                See YPA SACCO
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}