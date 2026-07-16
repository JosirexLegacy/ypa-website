// frontend/src/app/projects/maize/page.tsx

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
  Shield,
  Target,
  Star,
  Check,
  ChevronDown,
  Sprout,
  Quote,
  TrendingUp,
  Award,
  Leaf,
  DollarSign,
  LandPlot,
  Recycle,
  BarChart3,
  Clock,
  Sparkles,
  Wheat,
  Sun,
  ChevronUp
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
// NEW IMAGE URLs
// ============================================================
const HERO_IMAGE = "https://media.istockphoto.com/id/151659170/photo/beautiful-ear-of-corn-maturity.jpg?s=612x612&w=0&k=20&c=4teDfhgUxv_evac_bmKpa_Zt0Vqt5od96Gih8VJM7Fg=";
const ABOUT_IMAGE = "https://media.istockphoto.com/id/976764324/photo/young-green-corn-field-under-cloudy-sky.jpg?s=1024x1024&w=is&k=20&c=T-3bjI7Kq_SXsI-P9L5D7E7tL-GbmdkqBsybIslmEMg=";

// ============================================================
// FETCH FUNCTION
// ============================================================
async function getMaizeContent() {
  try {
    const res = await fetch(`${API_URL}/items/maize`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching maize content:', error);
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
export default function MaizePage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Calculator states
  const [acres, setAcres] = useState(1);
  const [investment, setInvestment] = useState(3750000);
  const [payout, setPayout] = useState(7200000);
  const [profit, setProfit] = useState(3450000);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getMaizeContent();
      setContent(data);
      setLoading(false);
    };
    fetchContent();
  }, []);

  // Update calculator when acres changes
  useEffect(() => {
    const pricePerAcre = 3750000;
    const payoutPerAcre = 7200000;
    const profitPerAcre = payoutPerAcre - pricePerAcre;
    
    setInvestment(pricePerAcre * acres);
    setPayout(payoutPerAcre * acres);
    setProfit(profitPerAcre * acres);
  }, [acres]);

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

  // Parse stats
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
    return parseInt(num) || 500;
  };

  const stats = [
    { number: parsedStats?.acres || '500+', label: 'Acres Under Cultivation', icon: LandPlot },
    { number: parsedStats?.farmers || '300+', label: 'Active Farmers', icon: Users },
    { number: parsedStats?.yield || '2,500+', label: 'Tons Per Season', icon: Wheat },
    { number: parsedStats?.years || '5+', label: 'Years of Excellence', icon: Star },
  ];

  const pricing = [
    { 
      name: 'Starter Plot', 
      price: 'UGX 3.75M', 
      fullPrice: 'UGX 3,750,000',
      acres: 1, 
      duration: '3 Years', 
      seasons: 6,
      returns: 'UGX 7.2M',
      profit: 'UGX 3.45M',
      description: 'Perfect for first-time investors wanting to test the waters.',
      popular: false
    },
    { 
      name: 'Growth Plot', 
      price: 'UGX 7.0M', 
      fullPrice: 'UGX 7,000,000',
      acres: 2, 
      duration: '3 Years', 
      seasons: 6,
      returns: 'UGX 14.4M',
      profit: 'UGX 7.4M',
      description: 'Double your investment with two acres of maize cultivation.',
      popular: true
    },
    { 
      name: 'Commercial Plot', 
      price: 'UGX 17.5M', 
      fullPrice: 'UGX 17,500,000',
      acres: 5, 
      duration: '3 Years', 
      seasons: 6,
      returns: 'UGX 36M',
      profit: 'UGX 18.5M',
      description: 'Maximum returns for serious agribusiness investors.',
      popular: false
    },
  ];

  const steps = [
    { 
      number: '01', 
      title: 'Secure Your Plot', 
      desc: 'Pay the one-time land fee and let YPA handle everything from planting to harvest.',
      icon: LandPlot,
      color: BLUE
    },
    { 
      number: '02', 
      title: 'Harvest & Earn', 
      desc: 'Receive UGX 1,200,000 after each of 6 harvest seasons across 3 years.',
      icon: DollarSign,
      color: POSITIVE
    },
    { 
      number: '03', 
      title: 'Renew or Scale', 
      desc: 'After 3 years, renew your contract or expand to multiple acres.',
      icon: TrendingUp,
      color: GOLD
    },
  ];

  const benefits = [
    { 
      icon: Shield, 
      title: 'Reduced Risk', 
      desc: 'Expert management minimizes farming risks.',
    },
    { 
      icon: TrendingUp, 
      title: 'Guaranteed Income', 
      desc: 'Consistent payouts every harvest season.',
    },
    { 
      icon: Sprout, 
      title: 'Expert Support', 
      desc: 'Professional agronomic guidance and inputs.',
    },
    { 
      icon: Recycle, 
      title: 'Sustainable Farming', 
      desc: 'Environmentally responsible practices.',
    },
    { 
      icon: Users, 
      title: 'Community Impact', 
      desc: 'Support food security and rural development.',
    },
    { 
      icon: Award, 
      title: 'Proven Track Record', 
      desc: '5+ years of successful maize farming.',
    },
  ];

  const testimonials = [
    {
      quote: "The YPA Maize Project gave me financial security I never thought possible. I've gone from one acre to five in just two years.",
      name: "Grace Akello",
      location: "Lira, Uganda",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      quote: "I was skeptical at first, but after the first harvest season, I was convinced. The returns are real and the support is incredible.",
      name: "John Okello",
      location: "Gulu, Uganda",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
  ];

  const faqs = [
    {
      question: "What is the total investment required for one acre?",
      answer: "The one-time land fee for a one-acre maize plot is UGX 3,750,000. This covers all planting and management costs for the entire 3-year contract."
    },
    {
      question: "How much will I earn from the project?",
      answer: "You will receive a payout of UGX 1,200,000 after each of the 6 harvest seasons, totaling UGX 7,200,000 over the 3-year contract. Your net profit would be UGX 3,450,000 per acre."
    },
    {
      question: "What does YPA manage?",
      answer: "YPA manages all aspects of planting, cultivation, and harvesting, ensuring best practices and maximizing yields for the entire 3-year contract."
    },
    {
      question: "Can I renew my contract after 3 years?",
      answer: "Yes, farmers have the option to renew into a new three-year contract, continuing to benefit from the project."
    },
    {
      question: "Is this a guaranteed return?",
      answer: "The payouts are historically achieved returns based on YPA's operational model. While we strive to meet all projections, farming carries inherent risks and returns are not guaranteed."
    },
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
            alt="YPA Maize Project"
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
              {content?.title || 'The Mighty YPA Maize Project'}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed mt-4"
            >
              A structured three-year contract farming initiative delivering guaranteed returns, expert support, and financial security.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <button
                onClick={() => scrollToSection('pricing')}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                style={{ 
                  background: BLUE, 
                  boxShadow: `0 20px 40px -12px ${BLUE}66` 
                }}
              >
                Secure Your Acre
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className={`${mono.className} inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors border border-white/10 px-8 py-4 rounded-full hover:bg-white/5 backdrop-blur-sm`}
              >
                How It Works
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

      {/* ===== ABOUT + IMAGE ===== */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal className="order-2 md:order-1">
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={ABOUT_IMAGE}
                  alt="YPA Maize Farming"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 p-4 rounded-2xl" style={{ 
                  background: "rgba(255,255,255,0.06)", 
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${GOLD}30` }}>
                      <Wheat className="w-5 h-5" style={{ color: GOLD }} />
                    </div>
                    <div>
                      <div className={`${display.className} text-white font-medium text-sm`}>Premium Quality</div>
                      <div className={`${mono.className} text-white/40 text-[10px] tracking-[0.1em] uppercase`}>YPA Certified Seeds</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="order-1 md:order-2">
              <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
                <span className="inline-flex items-center gap-2">
                  <Sun className="w-3 h-3" />
                  About the Project
                </span>
              </div>
              <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 leading-tight`} style={{ color: INK_ON_LIGHT }}>
                Africa's Leading Maize Contract Farming Initiative
              </h2>
              <div className="prose prose-sm max-w-none prose-p:text-[#5B6B7A] prose-p:leading-relaxed">
                {content?.description ? (
                  <div dangerouslySetInnerHTML={{ __html: content.description }} />
                ) : (
                  <>
                    <p className="text-sm leading-relaxed">
                      The YPA Maize Project operates on a three-year contract basis, encompassing six distinct planting seasons. 
                      This initiative empowers farmers by providing the resources and support needed to cultivate maize successfully 
                      and achieve significant financial gains.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <div className={`${mono.className} flex items-center gap-2 px-4 py-2 rounded-xl border text-[11px] tracking-[0.08em] uppercase`} style={{ borderColor: "#E8ECF0", background: MIST, color: INK_ON_LIGHT }}>
                        <Check className="w-4 h-4" style={{ color: BLUE }} />
                        3-Year Contract
                      </div>
                      <div className={`${mono.className} flex items-center gap-2 px-4 py-2 rounded-xl border text-[11px] tracking-[0.08em] uppercase`} style={{ borderColor: "#E8ECF0", background: MIST, color: INK_ON_LIGHT }}>
                        <Check className="w-4 h-4" style={{ color: BLUE }} />
                        6 Harvest Seasons
                      </div>
                      <div className={`${mono.className} flex items-center gap-2 px-4 py-2 rounded-xl border text-[11px] tracking-[0.08em] uppercase`} style={{ borderColor: "#E8ECF0", background: MIST, color: INK_ON_LIGHT }}>
                        <Check className="w-4 h-4" style={{ color: BLUE }} />
                        Guaranteed Payouts
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
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
              Your Journey to Success
            </h2>
            <p className="text-sm mt-2 max-w-2xl mx-auto" style={{ color: MUTE_ON_LIGHT }}>
              A simple three-step process from investment to returns
            </p>
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-0.5 hidden md:block" style={{ background: `linear-gradient(to bottom, ${BLUE}, ${POSITIVE}, ${GOLD})` }}></div>

            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <ScrollReveal key={index} delay={index * 0.08} className="relative flex flex-col md:flex-row items-center gap-8" style={{ flexDirection: isEven ? 'row' : 'row-reverse' }}>
                    <div className="hidden md:flex w-16 justify-center flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm relative z-10"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.number}
                      </div>
                    </div>

                    <div className={`flex-1 w-full md:w-auto ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white p-8 rounded-3xl border shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: "#E8ECF0" }}>
                        <div className="flex items-start gap-4 md:gap-0">
                          <div className={`flex md:hidden w-10 h-10 rounded-full flex-shrink-0 items-center justify-center text-white font-bold text-sm`} style={{ backgroundColor: step.color }}>
                            {step.number}
                          </div>
                          <div className="flex-1 md:flex-none">
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="w-5 h-5" style={{ color: step.color }} />
                              <h3 className={`${display.className} text-xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                                {step.title}
                              </h3>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-16">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <Star className="w-3 h-3" />
                Amazing Benefits
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Why Choose YPA Maize
            </h2>
            <p className="text-sm mt-2 max-w-2xl mx-auto" style={{ color: MUTE_ON_LIGHT }}>
              Transforming agriculture through structured contract farming
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.06}>
                  <div
                    className="group relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl"
                    style={{ borderColor: "#E8ECF0", background: "white" }}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: `${BLUE}12` }}>
                        <Icon className="w-6 h-6" style={{ color: BLUE }} />
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

      {/* ===== PULL QUOTE ===== */}
      <section className="py-20 px-6 overflow-hidden" style={{ background: INK }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: BLUE }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: SKY }} />
        </div>
        <div className="relative container mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <Quote className="w-12 h-12 mx-auto mb-6" style={{ color: `${BLUE}40` }} />
            <p className={`${display.className} text-2xl md:text-3xl font-medium leading-relaxed text-white`}>
              "The YPA Maize Project gave me financial security I never thought possible. I've gone from one acre to five in just two years."
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${BLUE}, ${SKY})` }}>
                GA
              </div>
              <div>
                <p className={`${display.className} font-medium text-white`}>Grace Akello</p>
                <p className={`${mono.className} text-[11px] text-white/40`}>YPA Member, Maize Project Beneficiary</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 px-6" style={{ background: MIST }}>
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-16">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <DollarSign className="w-3 h-3" />
                Investment Plans
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Choose Your Plot
            </h2>
            <p className="text-sm mt-2 max-w-2xl mx-auto" style={{ color: MUTE_ON_LIGHT }}>
              Flexible investment options designed for different goals
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div
                  className={`relative bg-white p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    item.popular 
                      ? 'border-[#2196F3] shadow-xl shadow-[#2196F3]/10' 
                      : 'border-[#E8ECF0] shadow-md'
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-medium text-white tracking-[0.1em] uppercase" style={{ background: `linear-gradient(to right, ${BLUE}, ${SKY})` }}>
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`${mono.className} text-[11px] tracking-[0.15em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                    {item.duration}
                  </div>
                  <h3 className={`${display.className} text-xl font-medium mt-1`} style={{ color: INK_ON_LIGHT }}>
                    {item.name}
                  </h3>
                  <div className="mt-4">
                    <span className={`${display.className} text-3xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                      {item.price}
                    </span>
                    <span className={`${mono.className} text-[11px] ml-1`} style={{ color: MUTE_ON_LIGHT }}>
                      / {item.acres} acre{item.acres > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                    {item.description}
                  </p>
                  
                  <div className="mt-6 space-y-2 border-t pt-4" style={{ borderColor: "#E8ECF0" }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: MUTE_ON_LIGHT }}>Total Payout</span>
                      <span className="font-medium" style={{ color: INK_ON_LIGHT }}>{item.returns}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: MUTE_ON_LIGHT }}>Net Profit</span>
                      <span className="font-medium" style={{ color: POSITIVE }}>{item.profit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: MUTE_ON_LIGHT }}>Seasons</span>
                      <span className="font-medium" style={{ color: INK_ON_LIGHT }}>{item.seasons}</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/contact?plan=${encodeURIComponent(item.name)}&acres=${item.acres}`}
                    className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      item.popular
                        ? 'text-white hover:shadow-xl hover:-translate-y-0.5'
                        : 'border hover:border-[#2196F3] hover:bg-[#2196F3]/5'
                    }`}
                    style={item.popular ? { background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` } : { borderColor: "#E8ECF0", color: INK_ON_LIGHT }}
                  >
                    Choose {item.name}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RETURNS CALCULATOR ===== */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal className="text-center mb-12">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                Returns Calculator
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Calculate Your Returns
            </h2>
            <p className="text-sm mt-2" style={{ color: MUTE_ON_LIGHT }}>
              Adjust the slider to see your potential earnings
            </p>
          </ScrollReveal>

          <div className="bg-white p-8 rounded-3xl border shadow-xl" style={{ borderColor: "#E8ECF0" }}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className={`${mono.className} text-[11px] tracking-[0.1em] uppercase font-medium`} style={{ color: INK_ON_LIGHT }}>
                  Number of Acres
                </span>
                <span className={`${display.className} text-2xl font-medium`} style={{ color: BLUE }}>
                  {acres}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={acres}
                onChange={(e) => setAcres(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: "#E8ECF0", accentColor: BLUE }}
              />
              <div className={`${mono.className} flex justify-between text-[10px] mt-1`} style={{ color: MUTE_ON_LIGHT }}>
                <span>1 acre</span>
                <span>10 acres</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-2xl" style={{ background: MIST, border: "1px solid #E8ECF0" }}>
                <p className={`${mono.className} text-[10px] tracking-[0.1em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                  Total Investment
                </p>
                <p className={`${display.className} text-xl md:text-2xl font-medium mt-1`} style={{ color: INK_ON_LIGHT }}>
                  UGX {investment.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 rounded-2xl" style={{ background: MIST, border: "1px solid #E8ECF0" }}>
                <p className={`${mono.className} text-[10px] tracking-[0.1em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                  Total Payout (6 Seasons)
                </p>
                <p className={`${display.className} text-xl md:text-2xl font-medium mt-1`} style={{ color: POSITIVE }}>
                  UGX {payout.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 rounded-2xl" style={{ background: MIST, border: "1px solid #E8ECF0" }}>
                <p className={`${mono.className} text-[10px] tracking-[0.1em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                  Net Profit
                </p>
                <p className={`${display.className} text-xl md:text-2xl font-medium mt-1`} style={{ color: profit > 0 ? GOLD : "red" }}>
                  UGX {profit.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-2xl" style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}20` }}>
              <p className={`${mono.className} text-[11px] tracking-[0.08em] uppercase text-center`} style={{ color: GOLD }}>
                <span className="font-semibold">💡 Note:</span> Based on 3-year contract (6 seasons × UGX 1.2M per season).
                <span className={`${mono.className} block text-[10px] opacity-60 mt-1`}>* Historical projection. Actual returns may vary.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-24 px-6" style={{ background: MIST }}>
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal className="text-center mb-12">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <ChevronDown className="w-3 h-3" />
                FAQ
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm mt-2" style={{ color: MUTE_ON_LIGHT }}>
              Everything you need to know about the YPA Maize Project
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.06}>
                <div className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: "#E8ECF0" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                    aria-expanded={openFaq === index}
                  >
                    <span className={`${display.className} text-sm font-medium`} style={{ color: INK_ON_LIGHT }}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: `${BLUE}10` }}
                    >
                      <ChevronDown className="w-4 h-4" style={{ color: BLUE }} />
                    </motion.div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === index ? "auto" : 0,
                      opacity: openFaq === index ? 1 : 0,
                      marginBottom: openFaq === index ? 16 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: MUTE_ON_LIGHT }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-6 border-y" style={{ borderColor: "#E8ECF0", background: "white" }}>
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-12">
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
              <span className="inline-flex items-center gap-2">
                <Users className="w-3 h-3" />
                Testimonials
              </span>
            </div>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
              Real Stories, Real Impact
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: "#E8ECF0", background: MIST }}>
                  <Quote className="w-8 h-8 mb-3" style={{ color: `${BLUE}20` }} />
                  <p className="text-sm leading-relaxed" style={{ color: INK_ON_LIGHT }}>
                    {testimonial.quote}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className={`${display.className} text-sm font-medium`} style={{ color: INK_ON_LIGHT }}>
                        {testimonial.name}
                      </p>
                      <p className={`${mono.className} text-[10px] tracking-[0.1em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
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
                  Ready to Secure Your Acre?
                </h2>
                <p className="text-sm max-w-2xl mx-auto" style={{ color: `${MUTE_ON_LIGHT}cc` }}>
                  Take the first step towards financial freedom through agriculture. Join hundreds of successful farmers today.
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
                    onClick={() => scrollToSection('faq')}
                    className={`${mono.className} inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors border border-white/10 px-8 py-4 rounded-full hover:bg-white/5 backdrop-blur-sm`}
                  >
                    Read FAQs
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
        <ChevronUp className="w-5 h-5" />
      </motion.button>

      <Footer />
    </main>
  );
}