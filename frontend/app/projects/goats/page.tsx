"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  ChevronRight,
  ArrowUpRight,
  Users,
  Globe,
  Clock,
  Shield,
  Target,
  Star,
  Check,
  ChevronDown,
  Sprout,
  Droplets,
  Sparkles,
  Quote,
  Play,
  TrendingUp,
  Award,
  Leaf,
  DollarSign,
  BookOpen,
  MapPin,
  Calendar,
  Briefcase,
  Wheat,
  Sun,
  GraduationCap,
  Heart,
  Zap,
  ShieldCheck,
  Gem,
  Trophy
} from 'lucide-react';

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
const BLUE = "#2196F3";
const SKY = "#7EC8FF";
const GOLD = "#F0B429";
const MIST = "#F6F8FA";
const INK_ON_LIGHT = "#0E2540";
const MUTE_ON_LIGHT = "#5B6B7A";
const POSITIVE = "#34D399";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// IMAGE URLs
// ============================================================
const HERO_IMAGE = "https://tse2.mm.bing.net/th/id/OIP.KRVv0Uh_OWx1uZK99-4irAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
const ABOUT_IMAGE = "https://tse2.mm.bing.net/th/id/OIP.0H4iHAABHO2U4Dz8oO6JqgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
const BREED_IMAGE = "https://tse4.mm.bing.net/th/id/OIP.-L4kmYJWWeBl8uOG-UJSoQAAAA?r=0&w=410&h=612&rs=1&pid=ImgDetMain&o=7&rm=3";

// ============================================================
// FETCH FUNCTION
// ============================================================
async function getGoatsContent() {
  try {
    const res = await fetch(`${API_URL}/items/goats`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching goats content:', error);
    return null;
  }
}

// ============================================================
// SCROLL REVEAL
// ============================================================
const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// ANIMATED COUNTER
// ============================================================
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <span ref={ref} className={`${display.className} text-4xl md:text-5xl font-medium`} style={{ color: BLUE }}>
      {count}{suffix}
    </span>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function GoatsPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getGoatsContent();
      setContent(data);
      setLoading(false);
    };
    fetchContent();
  }, []);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  // Parse stats from JSON
  let parsedStats: any = null;
  if (content?.stats) {
    try {
      parsedStats = typeof content.stats === 'string'
        ? JSON.parse(content.stats)
        : content.stats;
    } catch (e) {
      console.error('Error parsing stats:', e);
    }
  }

  const getStatNumber = (stat: string) => {
    const num = stat.replace(/[^0-9]/g, '');
    return parseInt(num) || 1000;
  };

  const stats = [
    { number: parsedStats?.goats || '130,000+', label: 'Goats Under Care', icon: Users },
    { number: parsedStats?.members || '1,000+', label: 'Active Members', icon: Users },
    { number: parsedStats?.years || '10+', label: 'Years of Excellence', icon: Trophy },
    { number: parsedStats?.breeds || '3', label: 'Premium Breeds', icon: Gem },
  ];

  const pricing = [
    { name: '1 Year Doe', price: 'UGX 750,000', age: '1 Year', description: 'Experienced female approaching full maturity. Potential for continued breeding for several years.' },
    { name: 'Pregnant Nanny', price: 'UGX 950,000', age: 'Adult', description: 'Older females expecting offspring, valuable for their experience raising young.' },
    { name: 'Mature Buck (1 Year)', price: 'UGX 1.5M', age: '1 Year', description: 'Fully developed males with strong bodies and horns. Proven breeding sires.' },
    { name: '2 Year Buck', price: 'UGX 2.5M', age: '2 Years', description: 'Proven breeding sire for consistent herd performance. Can be raised for meat production.' },
  ];

  const returns = [
    { year: 1, kids: 10, amount: 'UGX 3,000,000' },
    { year: 2, kids: 10, amount: 'UGX 3,000,000' },
    { year: 3, kids: 10, amount: 'UGX 3,000,000' },
  ];

  const breedFeatures = [
    { icon: Shield, title: 'Unwavering Resistance', desc: 'Thrives in various environments, minimizing health concerns and maximizing success.' },
    { icon: Target, title: 'Fast Growth', desc: 'Achieves impressive weight (up to 120 Kgs), translating to substantial returns.' },
    { icon: Star, title: 'Premium Meat Quality', desc: 'Experience unparalleled softness and flavor, a true culinary delight.' },
    { icon: Award, title: 'Expert Touch', desc: 'Every YPA goat receives meticulous care from Uganda\'s #1 goat farming experts.' },
    { icon: TrendingUp, title: 'Unmatched Demand', desc: 'Bred to satisfy a booming market for exceptional goat meat.' },
    { icon: Leaf, title: 'Sustainable Beauty', desc: 'YPA goats are stunning animals with captivating aesthetics and sustainable farming practices.' },
  ];

  const benefits = [
    { icon: TrendingUp, title: 'Guaranteed Returns', desc: '100% profit potential annually with our proven system and market network.' },
    { icon: Shield, title: 'Risk Management', desc: 'Full insurance and professional care for your investment, minimizing farming risks.' },
    { icon: Award, title: 'Expert Support', desc: 'Access to Uganda\'s #1 goat farming experts with over 10 years of experience.' },
    { icon: Leaf, title: 'Sustainable Farming', desc: 'Environmentally friendly practices for long-term success and community impact.' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <main className={`${display.variable} ${mono.variable} min-h-screen bg-white`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-[3px] rounded-full animate-spin" style={{ borderColor: "#E3F2FD", borderTopColor: BLUE }} />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`${display.variable} ${mono.variable} min-h-screen bg-white font-sans antialiased`}>
      <Navigation />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ background: INK }}>
        <div className="absolute inset-0">
          <img
            src={content?.hero_image
              ? `${API_URL}/assets/${content.hero_image}`
              : HERO_IMAGE
            }
            alt="YPA Goats Project"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060B14]/90 via-[#060B14]/70 to-[#060B14]/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#060B14]/80"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-32 h-32 border border-white/5 rounded-full blur-sm"
          />
          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1, ease: "easeInOut" }}
            className="absolute bottom-40 left-20 w-48 h-48 rounded-full blur-3xl"
            style={{ background: `${GOLD}15` }}
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full blur-2xl"
            style={{ background: `${BLUE}10` }}
          />
        </div>

        <div className="relative container mx-auto px-6 max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${mono.className} inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase px-4 py-2 rounded-full`}
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                color: `${GOLD}aa`,
                border: "1px solid rgba(255,255,255,0.06)"
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: GOLD }} />
              Flagship Project
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`${display.className} text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.05] tracking-tight mt-4`}
            >
              {content?.title || 'The Mighty YPA Goats Project'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed mt-4"
            >
              With a focus on breeding, we empower farmers to improve livestock productivity and profitability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <button
                onClick={() => scrollToSection('models')}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: BLUE,
                  boxShadow: `0 20px 40px -12px ${BLUE}66`
                }}
              >
                Explore Models
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className={`${mono.className} inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors border border-white/10 px-8 py-4 rounded-full hover:bg-white/5 backdrop-blur-sm`}
              >
                View Pricing
                <ChevronDown className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        >
          <span className={`${mono.className} text-[10px] tracking-[0.3em] uppercase`}>Scroll to explore</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white/40 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={statsRef} className="py-20 px-6 border-b" style={{ borderColor: "#E8ECF0", background: MIST }}>
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              const numValue = getStatNumber(stat.number);
              const suffix = stat.number.includes('+') ? '+' : '';

              return (
                <ScrollReveal key={i} delay={i * 0.08} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${BLUE}12` }}>
                      <Icon className="w-5 h-5" style={{ color: BLUE }} />
                    </div>
                  </div>
                  <div>
                    <AnimatedCounter target={numValue} suffix={suffix} />
                  </div>
                  <div className={`${mono.className} text-[11px] tracking-[0.1em] uppercase text-[#5B6B7A] mt-1 font-medium`}>
                    {stat.label}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
        ABOUT THE PROJECT – COMPLETELY REDESIGNED
        ============================================================ */}
      <section className="py-24 px-6" style={{ background: "white" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: Image + Stats Card */}
            <ScrollReveal className="sticky top-28">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={content?.about_image
                    ? `${API_URL}/assets/${content.about_image}`
                    : ABOUT_IMAGE
                  }
                  alt="YPA Goats Farming"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/70 via-[#060B14]/20 to-transparent"></div>

                {/* Floating stat card on image */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl" style={{
                  background: "rgba(6,11,20,0.75)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${GOLD}30` }}>
                      <Trophy className="w-6 h-6" style={{ color: GOLD }} />
                    </div>
                    <div>
                      <div className={`${display.className} text-white font-medium text-sm`}>Uganda's #1 Goat Farmers</div>
                      <div className={`${mono.className} text-white/40 text-[10px] tracking-[0.1em] uppercase`}>130,000+ goats under care</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick nav pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                <button
                  onClick={() => scrollToSection('models')}
                  className={`${mono.className} text-[10px] tracking-[0.1em] uppercase px-4 py-2 rounded-full border transition-all hover:bg-[#2196F3]/5`}
                  style={{ borderColor: "#E8ECF0", color: MUTE_ON_LIGHT }}
                >
                  Investment Models
                </button>
                <button
                  onClick={() => scrollToSection('breed')}
                  className={`${mono.className} text-[10px] tracking-[0.1em] uppercase px-4 py-2 rounded-full border transition-all hover:bg-[#2196F3]/5`}
                  style={{ borderColor: "#E8ECF0", color: MUTE_ON_LIGHT }}
                >
                  The Breed
                </button>
                <button
                  onClick={() => scrollToSection('returns')}
                  className={`${mono.className} text-[10px] tracking-[0.1em] uppercase px-4 py-2 rounded-full border transition-all hover:bg-[#2196F3]/5`}
                  style={{ borderColor: "#E8ECF0", color: MUTE_ON_LIGHT }}
                >
                  Returns
                </button>
              </div>
            </ScrollReveal>

            {/* Right: Rich Content */}
            <ScrollReveal delay={0.1}>
              <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-4`} style={{ color: BLUE }}>
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="w-3 h-3" />
                  About the Project
                </span>
              </div>

              <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 leading-tight`} style={{ color: INK_ON_LIGHT }}>
                Africa's Leading Goat Farming Initiative
              </h2>

              <div className="prose prose-sm max-w-none prose-p:text-[#4A5A6A] prose-p:leading-relaxed prose-p:mb-4">
                {content?.description ? (
                  <div dangerouslySetInnerHTML={{ __html: content.description }} />
                ) : (
                  <>
                    <p className="text-sm leading-relaxed">
                      The Goats Agribusiness Project stands as our <strong className="text-[#0E2540]">flagship project</strong> and a key pillar in our mission to economically empower individuals through agribusiness. Managed by the <strong className="text-[#0E2540]">number one goat farmers in Uganda</strong>, this initiative is designed to provide individuals, groups, and companies with a <strong className="text-[#0E2540]">complete, end-to-end solution</strong> for launching and managing successful goat farming ventures.
                    </p>

                    <p className="text-sm leading-relaxed">
                      Through this program, clients can purchase high-quality goats directly from YPA, carefully selected for health, resilience, and productivity. We ensure access to a wide range of improved pasture species, offering the best varieties of nutritious grass essential for optimal animal growth.
                    </p>

                    <p className="text-sm leading-relaxed">
                      In addition to inputs, members receive <strong className="text-[#0E2540]">practical, hands-on training</strong> in modern goat rearing techniques, pasture management, and overall agribusiness operations.
                    </p>
                  </>
                )}
              </div>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl border" style={{ borderColor: "#E8ECF0", background: MIST }}>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: BLUE }} />
                    <span className={`${mono.className} text-[10px] tracking-[0.08em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>Current Portfolio</span>
                  </div>
                  <div className={`${display.className} text-xl font-medium mt-1`} style={{ color: INK_ON_LIGHT }}>
                    110,000+ Goats
                  </div>
                </div>
                <div className="p-4 rounded-2xl border" style={{ borderColor: "#E8ECF0", background: MIST }}>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" style={{ color: BLUE }} />
                    <span className={`${mono.className} text-[10px] tracking-[0.08em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>Market Access</span>
                  </div>
                  <div className={`${display.className} text-xl font-medium mt-1`} style={{ color: INK_ON_LIGHT }}>
                    Domestic & International
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-6 p-6 rounded-2xl border" style={{ borderColor: "#E8ECF0", background: MIST }}>
                <h4 className={`${display.className} text-sm font-medium mb-3`} style={{ color: INK_ON_LIGHT }}>
                  What's Included:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'High-quality selected goats',
                    'Improved pasture species',
                    'Hands-on training',
                    'Veterinary care & insurance',
                    'Professional farm management',
                    'Market linkage & support',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" style={{ color: BLUE }} />
                      <span className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* End-to-End Solution Badge */}
              <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-full border" style={{ borderColor: `${BLUE}20`, background: `${BLUE}08` }}>
                <Zap className="w-4 h-4" style={{ color: GOLD }} />
                <span className={`${mono.className} text-[11px] tracking-[0.08em] uppercase`} style={{ color: INK_ON_LIGHT }}>
                  Complete End-to-End Solution
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
        HOW IT WORKS
        ============================================================ */}
      <section id="how-it-works" className="py-24 px-6" style={{ background: MIST }}>
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-16">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <Clock className="w-3 h-3" />
                How It Works
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              The YPA Goats Experience
            </h2>
            <p className="text-sm mt-2 max-w-2xl mx-auto" style={{ color: MUTE_ON_LIGHT }}>
              A complete journey from selection to returns
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Select Your Goats', desc: 'Choose from our premium breeds including 1 Year Doe, Pregnant Nanny, Mature Buck, or 2 Year Buck.' },
              { step: '02', title: 'Choose Your Model', desc: 'Select Passive (YPA manages everything) or Active (you manage with expert support).' },
              { step: '03', title: 'Earn Returns', desc: 'Receive annual returns from kids, with the option to sell mother stock at the end of the 3-year cycle.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="bg-white p-8 rounded-3xl border shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: "#E8ECF0" }}>
                  <div className={`${display.className} text-4xl font-medium`} style={{ color: `${BLUE}30` }}>
                    {item.step}
                  </div>
                  <h3 className={`${display.className} text-xl font-medium mt-2`} style={{ color: INK_ON_LIGHT }}>
                    {item.title}
                  </h3>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
        THE BREED
        ============================================================ */}
      <section id="breed" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-16">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <Gem className="w-3 h-3" />
                The Breed
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Mubende × Boer × Kalahari
            </h2>
            <p className="text-sm mt-2 max-w-2xl mx-auto" style={{ color: MUTE_ON_LIGHT }}>
              A custom-made crossbreed combining the best traits of three distinct and highly valued breeds
            </p>
          </ScrollReveal>

          <div className="relative overflow-hidden rounded-3xl mb-16">
            <img
              src={BREED_IMAGE}
              alt="YPA Goats Breed"
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 p-4 rounded-2xl" style={{
              background: "rgba(6,11,20,0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div className={`${mono.className} text-[10px] tracking-[0.1em] uppercase text-white/60`}>
                The YPA Goat Breed
              </div>
              <div className={`${display.className} text-white font-medium text-sm`}>
                Hardy • Fast Growth • Premium Meat
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { name: 'Mubende', origin: 'Local Breed', desc: 'Known for adaptability to local environmental conditions', icon: ShieldCheck },
              { name: 'Boer', origin: 'South Africa', desc: 'Renowned for rapid growth and excellent meat production', icon: Target },
              { name: 'Kalahari', origin: 'Asia', desc: 'High fertility rates and resilience to disease', icon: Heart },
            ].map((breed, i) => {
              const Icon = breed.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="bg-white p-6 rounded-2xl border shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: "#E8ECF0" }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${BLUE}12` }}>
                      <Icon className="w-5 h-5" style={{ color: BLUE }} />
                    </div>
                    <h4 className={`${display.className} text-lg font-medium`} style={{ color: INK_ON_LIGHT }}>
                      {breed.name}
                    </h4>
                    <div className={`${mono.className} text-[10px] tracking-[0.1em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                      {breed.origin}
                    </div>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                      {breed.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {breedFeatures.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.06}>
                  <div
                    className="group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl"
                    style={{ borderColor: "#E8ECF0", background: "white" }}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300" style={{ background: `${BLUE}12` }}>
                        <Icon className="w-5 h-5" style={{ color: BLUE }} />
                      </div>
                      <h4 className={`${display.className} text-base font-medium`} style={{ color: INK_ON_LIGHT }}>
                        {item.title}
                      </h4>
                      <p className="text-sm mt-1 leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                        {item.desc}
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === i ? 1 : 0 }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${BLUE}08, transparent 60%)` }}
                    />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
        PULL QUOTE
        ============================================================ */}
      <section className="py-20 px-6 overflow-hidden" style={{ background: INK }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: BLUE }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: SKY }} />
        </div>
        <div className="relative container mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <Quote className="w-12 h-12 mx-auto mb-6" style={{ color: `${BLUE}40` }} />
            <p className={`${display.className} text-2xl md:text-3xl font-medium leading-relaxed text-white`}>
              "YPA has transformed my life. I started with 5 goats and now have 65. The support and systems are incredible."
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${BLUE}, ${SKY})` }}>
                JM
              </div>
              <div>
                <p className={`${display.className} font-medium text-white`}>John Muwonge</p>
                <p className={`${mono.className} text-[11px] text-white/40`}>YPA Member, Goats Project Beneficiary</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
        MODELS
        ============================================================ */}
      <section id="models" className="py-24 px-6" style={{ background: MIST }}>
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-16">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <Users className="w-3 h-3" />
                Investment Models
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Choose Your Path
            </h2>
            <p className="text-sm mt-2 max-w-2xl mx-auto" style={{ color: MUTE_ON_LIGHT }}>
              Two tailored models designed for different needs and levels of involvement
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Passive Model */}
            <ScrollReveal>
              <div className="bg-white p-8 rounded-3xl border shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden" style={{ borderColor: "#E8ECF0" }}>
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl" style={{ background: `${BLUE}10` }} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${BLUE}12` }}>
                    <Users className="w-5 h-5" style={{ color: BLUE }} />
                  </div>
                  <span className={`${mono.className} text-[10px] tracking-[0.15em] uppercase font-semibold`} style={{ color: BLUE }}>
                    Model
                  </span>
                  <h3 className={`${display.className} text-2xl font-medium mt-1 mb-3`} style={{ color: INK_ON_LIGHT }}>
                    Passive
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                    Ideal for individuals who may not have land, time, or the technical know-how to manage a farm. YPA takes full responsibility for managing the farm — including land, goat care, staffing, and marketing — while you receive regular reports and returns.[reference:0]
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4" style={{ color: BLUE }} />
                      <p className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>YPA manages everything</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4" style={{ color: BLUE }} />
                      <p className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>Regular reports and returns</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4" style={{ color: BLUE }} />
                      <p className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>Stress-free investment</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Active Model */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white p-8 rounded-3xl border shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden" style={{ borderColor: "#E8ECF0" }}>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl" style={{ background: `${GOLD}10` }} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${GOLD}12` }}>
                    <Target className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <span className={`${mono.className} text-[10px] tracking-[0.15em] uppercase font-semibold`} style={{ color: GOLD }}>
                    Model
                  </span>
                  <h3 className={`${display.className} text-2xl font-medium mt-1 mb-3`} style={{ color: INK_ON_LIGHT }}>
                    Active
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                    Designed for farmers who already have their own land and want to actively participate in rearing goats while still receiving professional support.[reference:1]
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4" style={{ color: GOLD }} />
                      <p className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>You manage day-to-day operations</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4" style={{ color: GOLD }} />
                      <p className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>Expert guidance and support</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4" style={{ color: GOLD }} />
                      <p className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>Higher profit potential</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
        PRICING
        ============================================================ */}
      <section id="pricing" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-16">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <DollarSign className="w-3 h-3" />
                Pricing
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Goat Prices
            </h2>
            <p className="text-sm mt-2" style={{ color: MUTE_ON_LIGHT }}>
              Carefully selected goats for optimal performance and returns
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="bg-white p-6 rounded-2xl border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ borderColor: "#E8ECF0" }}>
                  <div className={`${mono.className} text-[10px] tracking-[0.15em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                    {item.age}
                  </div>
                  <div className={`${display.className} text-lg font-medium mt-1`} style={{ color: INK_ON_LIGHT }}>
                    {item.name}
                  </div>
                  <div className={`${display.className} text-2xl font-medium mt-2`} style={{ color: BLUE }}>
                    {item.price}
                  </div>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
        RETURNS + WHY YPA
        ============================================================ */}
      <section id="returns" className="py-24 px-6" style={{ background: MIST }}>
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <ScrollReveal>
              <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
                <span className="inline-flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  Returns Example
                </span>
              </div>
              <h2 className={`${display.className} text-2xl md:text-3xl font-medium tracking-tight mb-2`} style={{ color: INK_ON_LIGHT }}>
                10 Goats × UGX 750,000
              </h2>
              <p className="text-sm mb-6" style={{ color: MUTE_ON_LIGHT }}>
                Annual returns from kids over the 3-year project cycle
              </p>
              <div className="space-y-4">
                {returns.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border" style={{ background: MIST, borderColor: "#E8ECF0" }}>
                    <div>
                      <div className={`${display.className} text-sm font-medium`} style={{ color: BLUE }}>
                        Year {item.year}
                      </div>
                      <div className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>
                        {item.kids} Kids
                      </div>
                    </div>
                    <div className={`${display.className} text-lg font-medium`} style={{ color: INK_ON_LIGHT }}>
                      {item.amount}
                    </div>
                  </div>
                ))}
                <div className="p-4 rounded-xl border" style={{ background: `${BLUE}08`, borderColor: `${BLUE}20` }}>
                  <div className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>
                    Mother Stock Value (if sold)
                  </div>
                  <div className={`${display.className} text-lg font-medium`} style={{ color: INK_ON_LIGHT }}>
                    UGX 7,500,000
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-white p-8 rounded-3xl border shadow-lg" style={{ borderColor: "#E8ECF0" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: BLUE }}>
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <span className={`${mono.className} text-[11px] tracking-[0.15em] uppercase font-semibold`} style={{ color: BLUE }}>
                    Why YPA Goats?
                  </span>
                </div>
                <ul className="space-y-4">
                  {[
                    { icon: Shield, text: '130,000+ goats under professional care[reference:2]' },
                    { icon: Sprout, text: 'Mubende × Boer × Kalahari crossbreed[reference:3]' },
                    { icon: TrendingUp, text: '100% annual profit potential' },
                    { icon: Award, text: 'Full insurance and veterinary support[reference:4]' },
                    { icon: Users, text: 'Access to premium meat markets[reference:5]' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <Icon className="w-4 h-4" style={{ color: BLUE }} />
                        <span className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>
                          {item.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
        BENEFITS
        ============================================================ */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-16">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <Award className="w-3 h-3" />
                Why Choose YPA
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Premium Goat Farming Solutions
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.06}>
                  <div
                    className="group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl"
                    style={{ borderColor: "#E8ECF0", background: "white" }}
                    onMouseEnter={() => setHoveredCard(i + 10)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: `${BLUE}12` }}>
                        <Icon className="w-5 h-5" style={{ color: BLUE }} />
                      </div>
                      <h3 className={`${display.className} text-lg font-medium`} style={{ color: INK_ON_LIGHT }}>
                        {item.title}
                      </h3>
                      <p className="text-sm mt-2 leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                        {item.desc}
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === i + 10 ? 1 : 0 }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${BLUE}08, transparent 60%)` }}
                    />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
        CTA
        ============================================================ */}
      <section className="py-24 px-6" style={{ background: "white" }}>
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${INK}, ${NAVY})` }}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: SKY }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: BLUE }} />
              </div>

              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <Sparkles className="w-8 h-8" style={{ color: GOLD }} />
                </motion.div>
                <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight text-white mb-3`}>
                  Ready to get started?
                </h2>
                <p className="text-sm max-w-2xl mx-auto" style={{ color: `${MUTE_ON_LIGHT}cc` }}>
                  Join the Goats Project and start your agribusiness journey
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                    style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
                  >
                    Contact Us Now
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className={`${mono.className} inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors border border-white/10 px-8 py-4 rounded-full hover:bg-white/5 backdrop-blur-sm`}
                  >
                    View Pricing
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== BACK TO TOP ===== */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.8,
          pointerEvents: showBackToTop ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        style={{ background: BLUE, boxShadow: `0 8px 30px ${BLUE}66` }}
        aria-label="Back to top"
      >
        <ChevronDown className="w-5 h-5 rotate-180" />
      </motion.button>

      <Footer />
    </main>
  );
}