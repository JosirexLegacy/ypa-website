"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Users, 
  Sparkles, 
  Mail, 
  Clock, 
  Star, 
  User, 
  Search,
  Grid3x3,
  LayoutGrid,
  X,
  ExternalLink,
  Award,
  Briefcase,
  BookOpen,
  ChevronRight,
  Shield,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Space_Grotesk, IBM_Plex_Mono, Inter } from 'next/font/google';

// ============================================================
// CUSTOM SVG ICONS
// ============================================================
const LinkedInIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
  </svg>
);

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
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// ============================================================
// BRAND COLORS - YPA Design System
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_LIGHT = "#33C1F5";
const GOLD = "#F0B429";
const VOID = "#0A0A0B";
const NAVY = "#0E2540";
const NAVY_SOFT = "#153455";
const LINE = "#1F3B57";
const MIST = "#F6F8FA";
const MUTE_ON_LIGHT = "#5B6B7A";

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
async function fetchTeamMembers() {
  try {
    const res = await fetch(
      `${API_URL}/items/team_members?filter[status][_eq]=published&sort[]=order&sort[]=-featured`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
}

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: isMobile ? 0.3 : 0.5, delay: isMobile ? delay * 0.5 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// MEMBER CARD IMAGE COMPONENT
// ============================================================
const MemberImage = ({ image, name, className }: { image?: string; name: string; className?: string }) => {
  const [error, setError] = useState(false);
  const imageUrl = getImageUrl(image);

  if (error || !imageUrl) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-[#00AEEF]/5 to-[#33C1F5]/5`}>
        <div className="w-16 h-16 rounded-full bg-[#00AEEF]/10 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#00AEEF]/40">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className={className}
      style={{ objectPosition: '50% 20%' }}
      onError={() => setError(true)}
    />
  );
};

// ============================================================
// MAIN TEAM PAGE
// ============================================================
export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const load = async () => {
      const data = await fetchTeamMembers();
      setMembers(data);
      setLoading(false);
    };
    load();
  }, []);

  const departments = ['all', ...new Set(members.map(m => m.department).filter(Boolean))];

  const filteredMembers = members.filter(member => {
    const matchesDepartment = activeDepartment === 'all' || member.department === activeDepartment;
    const matchesSearch = member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const leadership = filteredMembers.filter(m => m.featured === true);
  const regularMembers = filteredMembers.filter(m => m.featured !== true);

  if (loading) {
    return (
      <main className={`${display.variable} ${mono.variable} min-h-screen bg-[#0A0A0B]`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-3 border-[#00AEEF]/30 border-t-[#00AEEF] rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen bg-[#0A0A0B] overflow-x-hidden font-sans antialiased`}>

      <Navigation />

      {/* ===== HERO - VOID with Light Blue Accents ===== */}
      <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 px-5 md:px-14 overflow-hidden bg-[#0A0A0B]">
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
        
        {/* Animated Blobs - Light Blue & Gold */}
        <motion.div
          className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${YPA_BLUE_LIGHT}10` }}
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${GOLD}06` }}
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Decorative Goat Mark - Light Blue */}
        <div className="absolute right-0 bottom-0 w-[300px] h-[300px] pointer-events-none opacity-[0.04]">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 50 C180 50 160 60 150 80 C140 60 120 55 110 70 C100 85 110 100 120 110 C100 115 80 130 70 150 C60 170 55 195 60 220 C65 245 75 265 90 280 C105 295 125 305 145 310 C165 315 185 315 200 310 C215 305 235 295 250 280 C265 265 275 245 280 220 C285 195 280 170 270 150 C260 130 240 115 220 110 C230 100 240 85 230 70 C220 55 200 60 190 80 C180 60 160 50 200 50Z" fill={YPA_BLUE_LIGHT} />
          </svg>
        </div>

        <div className="relative container mx-auto max-w-6xl z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {/* Trust Badge - Glass with Gold/Blue */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-sm border mb-4"
                style={{ 
                  background: `linear-gradient(135deg, ${YPA_BLUE_LIGHT}15, ${GOLD}08)`,
                  borderColor: `${YPA_BLUE_LIGHT}25`
                }}
              >
                <Shield className="w-3.5 h-3.5 text-[#33C1F5]" />
                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#33C1F5]/70">
                  Verified Leadership
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
              >
                The People <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#33C1F5] to-[#00AEEF]">
                  Behind YPA
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-sm md:text-base mt-2 max-w-xl font-light leading-relaxed text-white/40"
              >
                Meet the dedicated professionals driving agricultural transformation across Africa — 
                <span className="text-white/60"> experts in agribusiness, finance, and community development.</span>
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 bg-white/5">
                <Users className="w-4 h-4 text-[#33C1F5]" />
                <span className="text-sm text-white/80 font-medium">{members.length}</span>
                <span className="text-xs text-white/40">members</span>
              </div>
              {leadership.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-[#F0B429]/20 bg-[#F0B429]/10">
                  <Award className="w-4 h-4 text-[#F0B429]" />
                  <span className="text-sm text-white/80 font-medium">{leadership.length}</span>
                  <span className="text-xs text-white/40">leadership</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FILTERS - VOID ===== */}
      <div className="sticky top-20 z-30 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-[#F0B429]/10 py-3 px-5 md:px-14">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDepartment(dept)}
                className={`px-3.5 md:px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  activeDepartment === dept
                    ? 'bg-[#00AEEF] text-white shadow-sm shadow-[#00AEEF]/25'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {dept === 'all' ? 'All' : dept}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-40 focus:w-full sm:focus:w-52 bg-transparent border border-white/10 rounded-full px-3 py-1.5 text-xs text-white placeholder-white/30 transition-all duration-300 outline-none focus:border-[#00AEEF]"
              />
              <Search className="w-3 h-3 text-white/30 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex items-center gap-0.5 border-l border-white/10 pl-2 ml-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'text-[#00AEEF] bg-[#00AEEF]/10' 
                    : 'text-white/30 hover:text-white'
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'text-[#00AEEF] bg-[#00AEEF]/10' 
                    : 'text-white/30 hover:text-white'
                }`}
                aria-label="List view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LEADERSHIP SPOTLIGHT ===== */}
      {leadership.length > 0 && activeDepartment === 'all' && (
        <section className="px-5 md:px-14 py-10 md:py-16 bg-[#0A0A0B]">
          <div className="container mx-auto max-w-6xl">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-[#F0B429] to-[#FFE08A] rounded-full" />
                <h2 className="text-lg md:text-xl font-bold text-white">Leadership Team</h2>
                <span className="text-xs text-white/40 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  {leadership.length}
                </span>
                <span className="text-[10px] text-white/30 font-light ml-2 hidden sm:inline">— Visionaries shaping the future</span>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {leadership.map((member, index) => (
                <ScrollReveal key={member.id} delay={index * 0.08}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMember(member)}
                    className="group relative cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0B] shadow-sm hover:shadow-xl hover:shadow-[#00AEEF]/5 transition-all duration-500"
                  >
                    <div className="relative h-72 w-full overflow-hidden bg-[#0A0A0B]">
                      <MemberImage
                        image={member.image}
                        name={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/90 via-[#0A0A0B]/40 to-transparent" />
                      
                      {/* ✅ Gold Leadership Badge - Kept as requested */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-[#F0B429] to-[#FFE08A] px-2.5 py-0.5 rounded-full text-[10px] font-medium text-[#111111] shadow-lg shadow-[#F0B429]/30 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-[#111111] text-[#111111]" />
                          Leadership
                        </span>
                      </div>

                      {/* Name & Role */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#33C1F5] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-[#33C1F5] text-sm font-medium">{member.role}</p>
                        <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {member.department || 'Team Member'}
                        </p>
                      </div>
                    </div>

                    {/* Hover Indicator - Gold/Blue */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F0B429] to-[#00AEEF] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== ALL MEMBERS ===== */}
      <section className={`px-5 md:px-14 pb-10 md:pb-16 ${leadership.length > 0 && activeDepartment === 'all' ? '' : 'pt-6'}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-5 md:mb-8">
            <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-[#00AEEF] to-[#33C1F5] rounded-full" />
            <h2 className="text-base md:text-lg font-bold text-white">
              {activeDepartment === 'all' ? 'All Members' : activeDepartment}
            </h2>
            <span className="text-xs text-white/40 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              {regularMembers.length}
            </span>
            {activeDepartment !== 'all' && (
              <button
                onClick={() => setActiveDepartment('all')}
                className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1 ml-2"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {regularMembers.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-3 opacity-30">👥</div>
              <h3 className="text-base font-medium text-white">No members found</h3>
              <p className="text-sm text-white/40 mt-0.5">Try adjusting your search or filter</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-sm text-[#00AEEF] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-fr'
              : 'space-y-3'
            }>
              {regularMembers.map((member, index) => (
                <ScrollReveal key={member.id} delay={Math.min(index * 0.02, 0.3)}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMember(member)}
                    className={`group relative cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0B] shadow-sm hover:shadow-lg hover:shadow-[#00AEEF]/5 transition-all duration-400 ${
                      viewMode === 'list' ? 'flex items-center gap-4 p-4' : ''
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative aspect-square w-full overflow-hidden bg-[#0A0A0B]">
                          <MemberImage
                            image={member.image}
                            name={member.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1.5 border border-white/10">
                              <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3 md:p-4">
                          <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#33C1F5] transition-colors">
                            {member.name}
                          </h4>
                          <p className="text-xs text-[#00AEEF] truncate font-medium">{member.role}</p>
                          <p className="text-[10px] text-white/40 mt-0.5 truncate flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5" />
                            {member.department || 'Team Member'}
                          </p>
                          {member.experience && (
                            <div className="flex items-center gap-1 mt-1.5 text-[9px] text-white/30">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{member.experience}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[#0A0A0B] border border-white/10">
                          <MemberImage
                            image={member.image}
                            name={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white group-hover:text-[#33C1F5] transition-colors">
                            {member.name}
                          </h4>
                          <p className="text-xs text-[#00AEEF] font-medium">{member.role}</p>
                          <p className="text-[10px] text-white/40">{member.department}</p>
                        </div>
                        {member.experience && (
                          <div className="text-[10px] text-white/30 flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" />
                            <span>{member.experience}</span>
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#00AEEF] group-hover:translate-x-0.5 transition-all" />
                      </>
                    )}
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== MEMBER DETAIL MODAL - VOID Theme ===== */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#0A0A0B]/90 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 z-20 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Cover Image */}
                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-[#00AEEF]/20 to-[#33C1F5]/10">
                  <MemberImage
                    image={selectedMember.image}
                    name={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/50 to-transparent" />
                  
                  {selectedMember.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-[#F0B429] to-[#FFE08A] px-3 py-1 rounded-full text-[10px] font-medium text-[#111111] shadow-lg shadow-[#F0B429]/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#111111] text-[#111111]" />
                        Leadership
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 -mt-16 relative z-10">
                  <div className="bg-[#0A0A0B] rounded-xl shadow-lg p-6 md:p-8 border border-white/10">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedMember.name}</h2>
                        <p className="text-[#00AEEF] font-medium text-base">{selectedMember.role}</p>
                        <p className="text-sm text-white/40 mt-0.5 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {selectedMember.department || 'Team Member'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedMember.linkedin && (
                          <a
                            href={selectedMember.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-full bg-white/5 hover:bg-[#00AEEF]/10 border border-white/10 hover:border-[#00AEEF]/30 transition-all hover:scale-105"
                            aria-label="LinkedIn"
                          >
                            <LinkedInIcon className="w-5 h-5 text-white/40 hover:text-[#00AEEF]" />
                          </a>
                        )}
                        {selectedMember.email && (
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="p-2.5 rounded-full bg-white/5 hover:bg-[#00AEEF]/10 border border-white/10 hover:border-[#00AEEF]/30 transition-all hover:scale-105"
                            aria-label="Email"
                          >
                            <Mail className="w-5 h-5 text-white/40 hover:text-[#00AEEF]" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {selectedMember.experience && (
                        <div className="flex items-center gap-2.5 text-sm text-white/40 bg-white/5 rounded-xl px-3 py-2.5 border border-white/10">
                          <Clock className="w-4 h-4 text-[#00AEEF]" />
                          <span className="text-xs font-medium text-white">{selectedMember.experience}</span>
                          <span className="text-[10px] text-white/30">experience</span>
                        </div>
                      )}
                      {selectedMember.department && (
                        <div className="flex items-center gap-2.5 text-sm text-white/40 bg-white/5 rounded-xl px-3 py-2.5 border border-white/10">
                          <Users className="w-4 h-4 text-[#00AEEF]" />
                          <span className="text-xs font-medium text-white">{selectedMember.department}</span>
                          <span className="text-[10px] text-white/30">department</span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {selectedMember.bio && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#00AEEF]" />
                          About
                        </h4>
                        <p className="text-white/50 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedMember.bio}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CTA - VOID with Gold/Blue ===== */}
      <section className="px-5 md:px-14 py-12 md:py-16 bg-[#0A0A0B] border-t border-[#F0B429]/10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl p-8 md:p-12 text-center overflow-hidden border border-white/10 bg-white/5"
          >
            <div className="absolute top-[-50%] right-[-20%] w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none bg-[#00AEEF]/5" />
            <div className="absolute bottom-[-50%] left-[-20%] w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none bg-[#F0B429]/5" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-[#00AEEF]/10">
                <TrendingUp className="w-6 h-6 text-[#33C1F5]" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">Join Our Team</h3>
              <p className="text-sm text-white/40 mt-2 max-w-md mx-auto font-light">
                We're always looking for passionate individuals to join the YPA family and drive agricultural transformation.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#00AEEF] text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-[#00AEEF]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  View Careers
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white px-6 py-2.5 rounded-full text-sm font-medium border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}