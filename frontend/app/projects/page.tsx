"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion } from "framer-motion";
import { ArrowRight, Sprout, Leaf, Users, Award, ChevronRight, Sparkles, Shield, TrendingUp } from "lucide-react";

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
// BRAND COLORS
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_LIGHT = "#33C1F5";
const GOLD = "#F0B429";
const VOID = "#0A0A0B";

// ============================================================
// PROGRAMMES DATA
// ============================================================
const PROGRAMMES = [
  {
    id: "goats",
    title: "Goats Programme",
    tag: "Livestock",
    icon: Sprout,
    description: "Mubende × Boer × Kalahari, raised for guaranteed off-take. 130,000+ goats under care with 95% success rate.",
    href: "/projects/goats",
    stat: "130,000+",
    statLabel: "under care",
    accent: YPA_BLUE,
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784803485/farrrrm_jgvw4n.webp",
    features: ["95% success rate", "Guaranteed market access", "Premium breeds"],
  },
  {
    id: "maize",
    title: "Maize Contract Farming",
    tag: "Cropping",
    icon: Leaf,
    description: "Modern inputs, guaranteed buyers, and a return you can plan around. Average 3.0× return on investment.",
    href: "/projects/maize",
    stat: "5,000+",
    statLabel: "acres cultivated",
    accent: YPA_BLUE_LIGHT,
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784803273/maizee_kkke6y.jpg",
    features: ["Contracted off-take", "3.0× average return", "Modern input support"],
  },
  {
    id: "sacco",
    title: "YPA SACCO",
    tag: "Finance",
    icon: Users,
    description: "Savings and credit built around the rhythm of a harvest, not a payslip. 1,000+ members across 12 branches.",
    href: "/sacco",
    stat: "1,000+",
    statLabel: "members",
    accent: GOLD,
    image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784717198/508159ef-6c90-4578-b1fb-dff1534873f4.jpg",
    features: ["12 branches nationwide", "Member-owned since 2014", "Zero hidden fees"],
  },
];

const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function ProjectsPage() {
  return (
    <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen bg-[#0A0A0B] font-sans antialiased overflow-x-hidden`}>
      <Navigation />

      {/* ===== HERO ===== */}
      <section className="relative pt-28 md:pt-32 pb-16 px-4 md:px-6 overflow-hidden bg-[#0A0A0B]">
        {/* Gold top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F0B429] via-50% to-[#00AEEF] to-80% via-[#F0B429] to-transparent" />
        
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(${YPA_BLUE} 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, transparent 70%)",
            maskImage: "linear-gradient(180deg, #000 0%, transparent 70%)",
          }}
        />
        
        {/* Animated Blobs */}
        <motion.div
          className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${YPA_BLUE}10` }}
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${GOLD}06` }}
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal>
            <div className="text-center md:text-left">
              <div className={`${mono.className} inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase mb-3 text-[#33C1F5]/60`}>
                <Award className="w-3.5 h-3.5 text-[#33C1F5]" />
                Our Programmes
              </div>
              <h1 className={`${display.className} text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white`}>
                Transform Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#33C1F5] to-[#00AEEF]">Agribusiness</span>
              </h1>
              <p className={`${inter.className} text-sm md:text-base mt-3 max-w-xl text-white/40 font-light`}>
                Choose from three flagship programmes designed to empower African farmers and entrepreneurs.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PROGRAMMES GRID ===== */}
      <section className="px-4 md:px-6 py-10 md:py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {PROGRAMMES.map((programme, index) => {
            const Icon = programme.icon;
            return (
              <ScrollReveal key={programme.id} delay={index * 0.08}>
                <Link href={programme.href} className="group block h-full">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0B] hover:shadow-xl hover:shadow-[#00AEEF]/5 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                    
                    {/* Top accent bar */}
                    <div className="h-1 w-full bg-gradient-to-r" style={{ background: `linear-gradient(90deg, ${programme.accent}, ${programme.accent}80)` }} />
                    
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-[#0A0A0B]">
                      <img
                        src={programme.image}
                        alt={programme.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/50 to-transparent" />
                      
                      {/* Tag */}
                      <div className="absolute top-3 right-3">
                        <span className={`${mono.className} px-2.5 py-1 text-[9px] tracking-[0.1em] uppercase rounded-full border`} style={{ 
                          background: `${programme.accent}15`,
                          borderColor: `${programme.accent}30`,
                          color: programme.accent 
                        }}>
                          {programme.tag}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full flex items-center justify-center border" style={{
                        background: `${programme.accent}12`,
                        borderColor: `${programme.accent}25`
                      }}>
                        <Icon className="w-5 h-5" style={{ color: programme.accent }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                      <h3 className={`${display.className} text-lg md:text-xl font-medium text-white group-hover:text-[#33C1F5] transition-colors`}>
                        {programme.title}
                      </h3>
                      <p className={`${inter.className} text-sm text-white/40 font-light mt-1.5 flex-1`}>
                        {programme.description}
                      </p>

                      {/* Stat */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`${mono.className} text-xl md:text-2xl font-medium`} style={{ color: programme.accent }}>
                              {programme.stat}
                            </span>
                            <span className="text-xs text-white/30 ml-1.5">{programme.statLabel}</span>
                          </div>
                          <span className={`${mono.className} text-xs font-medium px-3 py-1 rounded-full border`} style={{
                            background: `${programme.accent}10`,
                            borderColor: `${programme.accent}20`,
                            color: programme.accent
                          }}>
                            {programme.features[0]}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {programme.features.slice(1).map((feature, i) => (
                          <span key={i} className="text-[9px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className={`${mono.className} text-xs font-medium text-[#00AEEF] group-hover:gap-2 transition-all flex items-center gap-1`}>
                          Learn more
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                        <span className="text-[10px] text-white/20">0{index + 1}</span>
                      </div>
                    </div>

                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      background: `radial-gradient(circle at 50% 50%, ${programme.accent}06, transparent 70%)`,
                    }} />
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="px-4 md:px-6 py-10 md:py-14 border-t border-[#F0B429]/10 bg-[#0A0A0B]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Goats Under Care", value: "130,000+", icon: Award },
            { label: "Acres Cultivated", value: "5,000+", icon: Leaf },
            { label: "SACCO Members", value: "1,000+", icon: Users },
            { label: "Years of Impact", value: "2014", icon: Shield },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={stat.label} delay={index * 0.05}>
                <div className="text-center p-4 rounded-xl border border-white/5 bg-white/5">
                  <Icon className="w-5 h-5 mx-auto text-[#33C1F5]/50 mb-2" />
                  <div className={`${mono.className} text-xl md:text-2xl font-medium text-white`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/30 mt-0.5">{stat.label}</div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-4 md:px-6 py-16 md:py-20 border-t border-[#F0B429]/10 bg-[#0A0A0B]">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="rounded-2xl md:rounded-3xl p-8 md:p-12 border border-white/10 bg-white/5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-[#00AEEF]/10">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-[#00AEEF]" />
              </div>
              <h3 className={`${display.className} text-xl md:text-2xl font-medium text-white`}>
                Ready to Transform Your Future?
              </h3>
              <p className={`${inter.className} text-sm text-white/40 mt-2 max-w-sm mx-auto font-light`}>
                Join YPA today and start your journey toward sustainable agribusiness success.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#00AEEF] text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-[#00AEEF]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white px-6 py-2.5 rounded-full text-sm font-medium border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  Learn About YPA
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}