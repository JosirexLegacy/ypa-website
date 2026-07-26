"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
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
  Landmark,
  Zap,
  Play,
  Plus,
  Check,
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
const YPA_GOLD = "#F0B429";
const INK = "#111111";
const NAVY = "#0E2540";
const LINE = "#1F3B57";
const MIST = "#F6F8FA";
const MUTE = "#5B6B7A";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// HELPERS
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
// ANIMATION HELPERS
// ============================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : reduce ? {} : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// SECTION HEADER
// ============================================================
const SectionHeader = ({ 
  label, 
  title, 
  subtitle 
}: { 
  label: string; 
  title: React.ReactNode; 
  subtitle?: string;
}) => (
  <div className="text-center mb-10 md:mb-14">
    <span className={`${mono.className} text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
      {label}
    </span>
    <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2`} style={{ color: INK }}>
      {title}
    </h2>
    {subtitle && (
      <p className="text-xs md:text-sm mt-2 max-w-xl mx-auto font-light" style={{ color: MUTE }}>
        {subtitle}
      </p>
    )}
  </div>
);

// ============================================================
// HERO
// ============================================================
const AboutHero = ({ content }: { content: any }) => {
  const reduce = useReducedMotion();
  const heroImage = "https://res.cloudinary.com/owwvyprb/image/upload/v1784726249/3P0D0002_tg15tl.jpg";

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] overflow-hidden bg-[#0E2540]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E2540]/90 via-[#0E2540]/70 to-[#0E2540]/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2540] via-transparent to-transparent z-10" />
        <img src={heroImage} alt="YPA Community" className="w-full h-full object-cover opacity-80" loading="eager" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `${YPA_BLUE}20` }}
          animate={reduce ? {} : { scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: `${YPA_GOLD}15` }}
          animate={reduce ? {} : { scale: [1, 0.9, 1], x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 78%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 78%)",
        }}
      />

      <div className="relative z-10 flex min-h-[85vh] md:min-h-[90vh] flex-col justify-center px-5 md:px-14 py-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-5"
              style={{ background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_DARK})` }}
            >
              <Award className="h-4 w-4 text-white" />
              <span className={`${inter.className} text-[10px] sm:text-[11px] tracking-[0.1em] uppercase font-bold text-white`}>
                #1 Goat Farming Programme in Africa
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`${inter.className} text-[10px] tracking-[0.25em] uppercase font-medium text-white/50`}>
                  Our Story
                </span>
                <span className="h-px flex-1" style={{ background: `${YPA_BLUE}30` }} />
              </div>

              <h1 className={`${inter.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-white`}>
                Who we are,
                <span className="relative inline-block ml-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] to-[#33C1F5]">
                    stated plainly
                  </span>
                  <span
                    className="absolute bottom-0 left-0 h-[3px] rounded-full"
                    style={{ background: YPA_BLUE }}
                  />
                </span>
              </h1>

              <p className={`${inter.className} mt-4 text-base md:text-lg font-light max-w-xl leading-relaxed text-white/60`}>
                Youth Platform Africa started as a 21-person village group and grew into a Pan-African
                agribusiness platform. Here's the full record — our story, our people, and the paperwork
                that proves it.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#verify"
                  className="inline-flex items-center gap-2 rounded-full px-6 md:px-8 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                  style={{ background: YPA_BLUE, boxShadow: `0 12px 24px -10px ${YPA_BLUE}40` }}
                >
                  Verify our credentials
                  <BadgeCheck className="h-4 w-4" />
                </Link>
                <Link
                  href="#story"
                  className="inline-flex items-center gap-2 rounded-full px-6 md:px-8 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                  style={{ border: `1px solid rgba(255,255,255,0.2)`, background: "rgba(255,255,255,0.05)" }}
                >
                  <Play className="h-4 w-4" />
                  Watch our story
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.a
        href="#verify"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className={`${inter.className} text-[8px] tracking-[0.3em] uppercase font-medium text-white/30`}>
          Scroll
        </span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="h-4 w-4 text-white/30" />
        </motion.div>
      </motion.a>
    </section>
  );
};

// ============================================================
// VERIFY STRIP
// ============================================================
const VERIFY_FACTS = [
  { label: "LEGAL STATUS", value: "Registered Organisation", confirmed: true, icon: Shield },
  { label: "URSB REG. NO.", value: "—", confirmed: false, tag: "Add reg number", icon: FileText },
  { label: "TAX ID (TIN)", value: "—", confirmed: false, tag: "Add TIN", icon: FileText },
  { label: "ESTABLISHED", value: "2008", confirmed: true, icon: Award },
  { label: "HEADQUARTERS", value: "Kampala, Uganda", confirmed: true, icon: MapPin },
  { label: "BRANCHES", value: "12", confirmed: true, icon: Building },
];

const VerifyStrip = () => (
  <section id="verify" className="py-12 md:py-16 px-5 md:px-14" style={{ background: MIST }}>
    <div className="container mx-auto max-w-7xl">
      <SectionHeader 
        label="Verify Us"
        title="The facts a <span style='color:#00AEEF'>due-diligence</span> check would ask for"
        subtitle="Everything you need to know about our legal standing, registration, and operational reach."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {VERIFY_FACTS.map((fact, index) => {
          const Icon = fact.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 text-center border hover:shadow-sm transition-shadow"
              style={{ borderColor: fact.confirmed ? "#E8ECF0" : `${YPA_GOLD}30` }}
            >
              {fact.confirmed ? (
                <div className="w-5 h-5 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: YPA_BLUE }}>
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: `${YPA_GOLD}15` }}>
                  <Zap className="w-3 h-3" style={{ color: YPA_GOLD }} />
                </div>
              )}
              <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: fact.confirmed ? YPA_BLUE : YPA_GOLD }} />
              <p className={`${mono.className} text-[8px] tracking-[0.12em] uppercase font-medium`} style={{ color: MUTE }}>
                {fact.label}
              </p>
              <p className={`text-base font-semibold ${fact.confirmed ? 'text-[#111111]' : 'text-[#F0B429]'}`}>
                {fact.value}
              </p>
              {!fact.confirmed && fact.tag && (
                <span className={`${mono.className} text-[7px] px-2 py-0.5 rounded-full`} style={{ background: `${YPA_GOLD}10`, color: YPA_GOLD }}>
                  {fact.tag}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

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
    if (reduce) { setCount(target); return; }
    let start = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      if (current >= steps) { setCount(target); clearInterval(timer); } 
      else { setCount(Math.floor(increment * current)); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, isInView, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className={`${display.className} text-3xl md:text-4xl font-medium`} style={{ color: INK }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className={`${display.className} text-xs md:text-sm font-light mt-1`} style={{ color: MUTE }}>
        {label}
      </div>
    </motion.div>
  );
};

// ============================================================
// STORY
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
    const interval = setInterval(() => setActiveImage((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, [reduce]);

  return (
    <section id="story" className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <span className={`${mono.className} text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: YPA_BLUE }}>
              Our Story
            </span>
            <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 leading-[1.1]`} style={{ color: INK }}>
              From a village group to a Pan-African movement
            </h2>
            <div className="mt-4 space-y-3 font-light text-sm md:text-base" style={{ color: "#4B5A68" }}>
              {content?.story ? (
                <div dangerouslySetInnerHTML={{ __html: content.story }} />
              ) : (
                <>
                  <p>Youth Platform Africa started in 2008 as an ordinary village group of 21 individuals.</p>
                  <p>By 2010, it had grown into a Community Based Organisation with 60 members. Today, YPA runs agribusiness and financial-inclusion programmes across Africa.</p>
                  <p>We've expanded to 12 branches across Uganda, with international offices in Dubai and Zambia.</p>
                </>
              )}
            </div>
            <div className="mt-6 flex gap-6">
              {[
                { label: "Founded", value: "2008" },
                { label: "Branches", value: "12" },
                { label: "Countries", value: "3" },
              ].map((item, i) => (
                <div key={i}>
                  <div className={`${mono.className} text-xl font-medium`} style={{ color: INK }}>{item.value}</div>
                  <div className="text-xs" style={{ color: MUTE }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[300px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-lg">
            {images.map((img, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: activeImage === index ? 1 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
              </motion.div>
            ))}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent 50%)" }} />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
                <p className="text-xs font-medium" style={{ color: INK }}>{images[activeImage].label}</p>
              </div>
              <div className="flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="transition-all duration-500 rounded-full"
                    style={{
                      width: activeImage === i ? "20px" : "8px",
                      height: "4px",
                      background: activeImage === i ? YPA_BLUE : "rgba(255,255,255,0.4)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// LEADERSHIP
// ============================================================
const LEADERSHIP = [
  { role: "MANAGING DIRECTOR", name: "OBED BEN", bio: "Visionary leader with over 15 years of experience in agribusiness.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716326/acc94e42-c5d5-489c-b335-6ee5353253be.jpg" },
  { role: "EXECUTIVE DIRECTOR", name: "JB MAGEZI", bio: "Strategic leader driving YPA's expansion across Africa.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716480/587e2393-e360-4ac2-bae3-22b7cec94705.jpg" },
  { role: "GENERAL MANAGER", name: "CHARLES KALEMERA", bio: "Operational excellence leader overseeing 12 branches.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716382/5fd55b99-ec2f-4990-b3c7-8a5b69837aad.jpg" },
  { role: "FOUNDING MEMBER", name: "—", bio: "Add role summary and credentials.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784726254/3P0D0022_gqfkkg.jpg" },
];

const LeadershipSection = () => (
  <section id="leadership" className="py-16 md:py-24 px-5 md:px-14" style={{ background: MIST }}>
    <div className="container mx-auto max-w-7xl">
      <SectionHeader 
        label="Governance"
        title="Led by real people"
        subtitle="Every organisation asking for trust should be willing to put names to it."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {LEADERSHIP.map((leader, index) => {
          const imageUrl = leader.image ? getImageUrl(leader.image) : null;
          return (
            <ScrollReveal key={index} delay={index * 0.06}>
              <div className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: "#E8ECF0" }}>
                <div className="relative h-48 bg-[#F0F9FE]">
                  {imageUrl ? (
                    <img src={imageUrl} alt={leader.name} className="w-full h-full object-cover" style={{ objectPosition: '50% 25%' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${YPA_BLUE}12` }}>
                        <span className={`${display.className} text-2xl font-medium`} style={{ color: YPA_BLUE }}>
                          {leader.name === "—" ? "?" : leader.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>
                      {leader.role}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className={`${display.className} text-base font-medium ${leader.name === "—" ? 'text-[#F0B429]' : 'text-[#111111]'}`}>
                    {leader.name}
                  </div>
                  <p className="text-xs mt-1 font-light leading-relaxed" style={{ color: MUTE }}>{leader.bio}</p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  </section>
);

// ============================================================
// MISSION & VISION
// ============================================================
const MissionVisionSection = ({ content }: { content: any }) => (
  <section className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
    <div className="container mx-auto max-w-7xl">
      <SectionHeader label="Our Purpose" title="Why we exist" />

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {[
          { icon: Target, label: "Our Mission", html: content?.mission, fallback: "To economically empower individuals through extraordinary agribusiness practices." },
          { icon: Globe, label: "Our Vision", html: content?.vision, fallback: "To be the greatest empowerment platform in Africa — and push back poverty with it." },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="bg-white p-6 md:p-8 rounded-xl border hover:shadow-md transition-shadow" style={{ borderColor: "#EEF1F3" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${YPA_BLUE}10` }}>
                  <Icon className="w-6 h-6" style={{ color: YPA_BLUE }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: YPA_BLUE }}>{card.label}</span>
                <div className="text-base leading-relaxed mt-2 font-light" style={{ color: "#3E4C59" }}>
                  {card.html ? <div dangerouslySetInnerHTML={{ __html: card.html }} /> : card.fallback}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  </section>
);

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
      <div className="container mx-auto max-w-4xl">
        <SectionHeader label="Core Values" title="What we believe" />

        <div className="space-y-2">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.04}>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F6F8FA] transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${YPA_BLUE}10` }}>
                    <Icon className="w-4 h-4" style={{ color: YPA_BLUE }} />
                  </div>
                  <div>
                    <span className={`${mono.className} text-[10px] font-bold`} style={{ color: YPA_BLUE }}>0{i + 1}</span>
                    <p className="text-sm leading-relaxed font-light" style={{ color: "#4B5A68" }}>{v.text}</p>
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
// TIMELINE
// ============================================================
const MILESTONES = [
  { year: "2008", label: "Founded as a village group", desc: "21 members" },
  { year: "2010", label: "Registered as a CBO", desc: "60 members" },
  { year: "2015", label: "Expanded to 5 branches", desc: "Growth across Uganda" },
  { year: "2020", label: "Launched YPA SACCO", desc: "Financial services" },
  { year: "2023", label: "Reached 100,000 goats", desc: "Major milestone" },
  { year: "2025", label: "Expanded to Dubai & Zambia", desc: "Pan-African" },
];

const TimelineSection = () => (
  <section className="py-16 md:py-24 px-5 md:px-14 border-t" style={{ background: MIST, borderColor: "#EEF1F3" }}>
    <div className="container mx-auto max-w-7xl">
      <SectionHeader label="Timeline" title="Our journey, year by year" />

      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
        {MILESTONES.map((item, i) => (
          <ScrollReveal key={i} delay={i * 0.05} className="shrink-0">
            <div className="min-w-[180px] md:min-w-[220px] bg-white p-4 md:p-5 rounded-xl border hover:shadow-md transition-shadow" style={{ borderColor: "#EEF1F3" }}>
              <div className={`${mono.className} text-xl font-medium`} style={{ color: YPA_BLUE }}>{item.year}</div>
              <div className="text-sm font-medium mt-1" style={{ color: INK }}>{item.label}</div>
              <div className="text-xs mt-0.5 font-light" style={{ color: MUTE }}>{item.desc}</div>
              <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: YPA_BLUE }} />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================
// COMPLIANCE
// ============================================================
const COMPLIANCE_CARDS = [
  { icon: Landmark, title: "Legal Registration", body: "Registered entity in Uganda.", need: "Add registration type & number" },
  { icon: FileText, title: "Tax Compliance", body: "Tax registration on file.", need: "Add TIN" },
  { icon: Shield, title: "Regulatory Oversight", body: "SACCO operations are regulated.", need: "Add regulator" },
  { icon: Award, title: "Independent Audit", body: "Financials reviewed annually.", need: "Add auditor" },
];

const ComplianceSection = () => (
  <section className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
    <div className="container mx-auto max-w-7xl">
      <SectionHeader 
        label="Due Diligence"
        title="The paperwork behind the story"
        subtitle="Checking us out before you commit is reasonable — here's what we have on record."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {COMPLIANCE_CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <ScrollReveal key={i} delay={i * 0.06}>
              <div className="rounded-xl border p-4 h-full" style={{ borderColor: "#EEF1F3", background: MIST }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${YPA_BLUE}10` }}>
                  <Icon className="h-4 w-4" style={{ color: YPA_BLUE }} />
                </div>
                <div className="text-sm font-semibold" style={{ color: INK }}>{c.title}</div>
                <p className="text-xs mt-1 font-light" style={{ color: MUTE }}>{c.body}</p>
                <div className="mt-2 text-[9px] font-medium px-2 py-0.5 rounded-lg border border-dashed inline-block" style={{ color: YPA_GOLD, borderColor: `${YPA_GOLD}50`, background: `${YPA_GOLD}08` }}>
                  {c.need}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  </section>
);

// ============================================================
// OFFICES
// ============================================================
const OFFICES = [
  { region: "Uganda — Headquarters", detail: "12 branches nationwide", need: "Add HQ address" },
  { region: "Dubai, UAE", detail: "International liaison office", need: "Add office address" },
  { region: "Zambia", detail: "Regional agribusiness office", need: "Add office address" },
];

const OfficesSection = () => (
  <section className="py-16 md:py-24 px-5 md:px-14" style={{ background: INK }}>
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8 md:mb-12">
        <span className={`${mono.className} text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase text-white/40`}>
          Physical Presence
        </span>
        <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 text-white`}>
          Find us in person
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-3 md:gap-4">
        {OFFICES.map((o, i) => (
          <ScrollReveal key={i} delay={i * 0.06}>
            <div className="rounded-xl border p-4 md:p-5" style={{ borderColor: LINE, background: NAVY }}>
              <MapPin className="h-5 w-5 mb-3" style={{ color: YPA_BLUE_LIGHT }} />
              <div className="text-sm font-medium text-white">{o.region}</div>
              <p className="text-xs mt-1 font-light text-white/40">{o.detail}</p>
              <div className="mt-2 text-[9px] font-medium px-2 py-0.5 rounded-lg border border-dashed inline-block" style={{ color: YPA_GOLD, borderColor: `${YPA_GOLD}50`, background: `${YPA_GOLD}08` }}>
                {o.need}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================
// PARTNERS
// ============================================================
const PartnersSection = () => {
  // 👇 Add your partner logos here
  const partners = [
    {
      name: "Centenary Bank",
      logo: "https://seeklogo.com/images/C/centenary-bank-logo-0C51C54CFE-seeklogo.com.png",
      website: "https://www.centenarybank.co.ug",
    },
  ];

  const totalSlots = 6;
  const displayPartners: (typeof partners[0] | null)[] = [...partners];
while (displayPartners.length < totalSlots) {
  displayPartners.push(null);
}

  return (
    <section className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-7xl">
        <SectionHeader 
          label="Recognition"
          title="Partners & certifications"
          subtitle="Backed by leading institutions across Africa"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {displayPartners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="aspect-[3/2] rounded-xl border flex items-center justify-center p-3 bg-white hover:shadow-md transition-shadow"
              style={{ borderColor: "#E8ECF0" }}
            >
              {partner ? (
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full w-auto object-contain"
                    style={{ maxHeight: '50px' }}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('span');
                        fallback.className = 'text-xs font-medium text-center text-[#5B6B7A]';
                        fallback.textContent = partner.name;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </a>
              ) : (
                <span className="text-[9px] font-medium text-[#5B6B7A]">Add logo</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// FAQ
// ============================================================
const FAQSection = ({ faqs }: { faqs: any[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-24 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
      <div className="container mx-auto max-w-3xl">
        <SectionHeader label="FAQ" title="Frequently asked questions" />

        {faqs.length === 0 ? (
          <div className="text-center py-10 rounded-xl border" style={{ background: MIST, borderColor: "#EEF1F3" }}>
            <p className="font-light text-sm" style={{ color: MUTE }}>No FAQs yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.id} delay={index * 0.03}>
                <div className="border rounded-xl overflow-hidden transition-shadow hover:shadow-sm" style={{ borderColor: "#EEF1F3" }}>
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-4 md:px-5 py-3 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium" style={{ color: INK }}>{faq.question}</span>
                    <ChevronDown
                      className="w-4 h-4 transition-transform duration-300 shrink-0 ml-3"
                      style={{ color: MUTE, transform: openIndex === index ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>
                  {openIndex === index && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.25 }} className="px-4 md:px-5 pb-4">
                      <div className="border-t pt-3" style={{ borderColor: "#EEF1F3" }}>
                        <div className="text-sm leading-relaxed font-light" style={{ color: "#4B5A68" }} dangerouslySetInnerHTML={{ __html: faq.answer }} />
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
    <section className="py-16 md:py-24 px-5 md:px-14 relative overflow-hidden" style={{ background: INK }}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[150px]" style={{ background: YPA_BLUE }} />
      </div>
      <div className="relative container mx-auto max-w-4xl text-center">
        <span className={`${mono.className} text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase text-white/30`}>
          Ambition
        </span>
        <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium mt-2 text-white`}>YPA Vision 2030</h2>
        <p className="text-xs md:text-sm mt-1 font-light text-white/30">Our roadmap to becoming Africa's greatest empowerment platform</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="border rounded-lg p-3 md:p-4 transition-colors hover:border-[#00AEEF]/30" style={{ borderColor: LINE }}>
                  <Icon className="w-5 h-5 mx-auto mb-1 text-white/20" />
                  <div className="text-xs md:text-sm font-medium text-white/60">{item.label}</div>
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
    <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen bg-white overflow-x-hidden font-sans antialiased`}>
      <Navigation />

      <AboutHero content={content} />
      <VerifyStrip />

      <section className="py-10 md:py-14 px-5 md:px-14 bg-white border-b" style={{ borderColor: "#EEF1F3" }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
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

      <section className="py-14 md:py-20 px-5 md:px-14 bg-white border-t" style={{ borderColor: "#EEF1F3" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: `${YPA_BLUE}10` }}>
              <Sparkles className="w-6 h-6" style={{ color: YPA_BLUE }} />
            </div>
            <h2 className={`${display.className} text-2xl md:text-3xl font-medium`} style={{ color: INK }}>
              Now that you know who we are
            </h2>
            <p className="text-sm mt-2 font-light" style={{ color: MUTE }}>
              Become part of Africa's leading agribusiness platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5" style={{ background: YPA_BLUE }}>
                Get in touch
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/sacco" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-all hover:-translate-y-0.5" style={{ color: INK, borderColor: "#EEF1F3" }}>
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