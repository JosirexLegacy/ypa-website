"use client";

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Users,
  Mail,
  Clock,
  Search,
  Grid3x3,
  List,
  X,
  ArrowUpRight,
  Award,
  Briefcase,
  BookOpen,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { Space_Grotesk, IBM_Plex_Mono, Inter } from 'next/font/google';

// ============================================================
// CUSTOM SVG ICONS
// ============================================================
const LinkedInIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
// BRAND COLORS — same tokens as About / Home
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_LIGHT = "#33C1F5";
const GOLD = "#F0B429";
const VOID = "#0A0A0B";
const PANEL = "#0E1116";
const LINE_SOFT = "rgba(255,255,255,0.08)";
const FOG = "rgba(245,246,247,0.6)";

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

const getOptimizedImageUrl = (image: string | undefined, width: number = 500, quality: number = 80): string | null => {
  const url = getImageUrl(image);
  if (!url) return null;

  if (url.includes('images.unsplash.com') || url.includes('res.cloudinary.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}&auto=format,compress`;
  }

  return url;
};

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80';

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
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: isMobile ? 0.3 : 0.55, delay: isMobile ? delay * 0.5 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Small kicker — dot + mono uppercase label, matches About/Home
const Kicker = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: YPA_BLUE, boxShadow: `0 0 8px ${YPA_BLUE}` }} />
    <span className={`${mono.className} text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em]`} style={{ color: FOG }}>{children}</span>
  </div>
);

// ============================================================
// MEMBER CARD IMAGE COMPONENT
// ============================================================
const MemberImage = ({ image, name, className }: { image?: string; name: string; className?: string }) => {
  const [error, setError] = useState(false);
  const imageUrl = getImageUrl(image);

  if (error || !imageUrl) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ background: PANEL }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ border: `1px solid ${LINE_SOFT}` }}>
          <span className={`${display.className} text-lg font-medium`} style={{ color: FOG }}>
            {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={getOptimizedImageUrl(image, 500, 80) || FALLBACK_AVATAR}
      alt={name}
      className={className}
      width={500}
      height={500}
      sizes="(max-width: 768px) 100vw, 240px"
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

  const departments: string[] = [
    'all',
    ...Array.from(
      new Set(
        members
          .map((member: any) => member.department)
          .filter((department): department is string => Boolean(department))
      )
    )
  ];

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
      <main className={`${display.variable} ${mono.variable} min-h-screen`} style={{ background: VOID }}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: LINE_SOFT, borderTopColor: YPA_BLUE }} />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen overflow-x-hidden font-sans antialiased`} style={{ background: VOID }}>

      <Navigation />

      {/* ===== HERO ===== */}
      <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 px-5 md:px-14 overflow-hidden" style={{ background: VOID }}>
        <div className="absolute -top-1/3 left-[15%] w-[45%] h-[55%] rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(0,174,239,0.1)" }} />

        <div className="relative container mx-auto max-w-6xl z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Kicker>Verified leadership</Kicker>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className={`${display.className} text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.08] tracking-tight text-white mt-4`}
              >
                The people <span style={{ color: YPA_BLUE }}>behind YPA</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`${inter.className} text-sm md:text-base mt-3 max-w-xl font-light leading-relaxed`}
                style={{ color: FOG }}
              >
                The professionals driving agricultural transformation across Africa — in agribusiness, finance, and community development.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ border: `1px solid ${LINE_SOFT}` }}>
                <Users className="w-3.5 h-3.5" style={{ color: YPA_BLUE_LIGHT }} />
                <span className="text-sm text-white font-medium">{members.length}</span>
                <span className="text-xs" style={{ color: FOG }}>members</span>
              </div>
              {leadership.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ border: `1px solid ${LINE_SOFT}` }}>
                  <Award className="w-3.5 h-3.5" style={{ color: GOLD }} />
                  <span className="text-sm text-white font-medium">{leadership.length}</span>
                  <span className="text-xs" style={{ color: FOG }}>leadership</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FILTERS ===== */}
      <div className="sticky top-20 z-30 backdrop-blur-md py-3 px-5 md:px-14" style={{ background: "rgba(10,10,11,0.9)", borderBottom: `1px solid ${LINE_SOFT}` }}>
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDepartment(dept)}
                className={`px-3.5 md:px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeDepartment === dept
                    ? 'text-[#0A0A0B]'
                    : 'hover:text-white'
                }`}
                style={{
                  background: activeDepartment === dept ? YPA_BLUE : "transparent",
                  color: activeDepartment === dept ? VOID : "rgba(245,246,247,0.55)",
                }}
              >
                {dept === 'all' ? 'All' : dept}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(245,246,247,0.3)" }} />
              <input
                type="text"
                placeholder="Search members"
                aria-label="Search members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-colors"
                style={{ border: `1px solid ${LINE_SOFT}` }}
                onFocus={(e) => (e.currentTarget.style.borderColor = YPA_BLUE)}
                onBlur={(e) => (e.currentTarget.style.borderColor = LINE_SOFT)}
              />
            </div>
            <div className="flex items-center gap-0.5 pl-2 ml-1" style={{ borderLeft: `1px solid ${LINE_SOFT}` }}>
              <button
                onClick={() => setViewMode('grid')}
                className="p-1.5 rounded-lg transition-colors duration-200"
                style={{ color: viewMode === 'grid' ? YPA_BLUE : "rgba(245,246,247,0.35)", background: viewMode === 'grid' ? "rgba(0,174,239,0.1)" : "transparent" }}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="p-1.5 rounded-lg transition-colors duration-200"
                style={{ color: viewMode === 'list' ? YPA_BLUE : "rgba(245,246,247,0.35)", background: viewMode === 'list' ? "rgba(0,174,239,0.1)" : "transparent" }}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LEADERSHIP SPOTLIGHT ===== */}
      {leadership.length > 0 && activeDepartment === 'all' && (
        <section className="px-5 md:px-14 py-10 md:py-16" style={{ background: VOID }}>
          <div className="container mx-auto max-w-6xl">
            <ScrollReveal>
              <div className="mb-6 md:mb-8">
                <Kicker>Leadership team</Kicker>
                <h2 className={`${display.className} text-xl md:text-2xl font-medium text-white mt-2`}>Setting the direction</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {leadership.map((member, index) => (
                <ScrollReveal key={member.id} delay={index * 0.06}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedMember(member)}
                    className="group relative cursor-pointer rounded-2xl overflow-hidden transition-shadow duration-300"
                    style={{ border: `1px solid ${LINE_SOFT}`, background: PANEL }}
                  >
                    <div className="relative h-72 w-full overflow-hidden" style={{ background: PANEL }}>
                      <MemberImage
                        image={member.image}
                        name={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.05) 40%, rgba(10,10,11,0.9) 100%)" }} />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ border: `1px solid rgba(240,180,41,0.35)`, background: "rgba(240,180,41,0.1)" }}>
                        <Award className="w-3 h-3" style={{ color: GOLD }} />
                        <span className={`${mono.className} text-[9px] uppercase tracking-[0.12em]`} style={{ color: GOLD }}>Leadership</span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#33C1F5] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-sm font-medium" style={{ color: YPA_BLUE_LIGHT }}>{member.role}</p>
                        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: FOG }}>
                          <Briefcase className="w-3 h-3" />
                          {member.department || 'Team Member'}
                        </p>
                      </div>
                    </div>
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
            <h2 className={`${display.className} text-base md:text-lg font-medium text-white`}>
              {activeDepartment === 'all' ? 'All members' : activeDepartment}
            </h2>
            <span className={`${mono.className} text-[10px] px-2.5 py-0.5 rounded-full`} style={{ color: FOG, border: `1px solid ${LINE_SOFT}` }}>
              {regularMembers.length}
            </span>
            {activeDepartment !== 'all' && (
              <button
                onClick={() => setActiveDepartment('all')}
                className="text-xs transition-colors flex items-center gap-1 ml-2"
                style={{ color: FOG }}
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {regularMembers.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: PANEL, border: `1px solid ${LINE_SOFT}` }}>
              <Users className="w-8 h-8 mx-auto mb-3" style={{ color: FOG }} strokeWidth={1.5} />
              <h3 className="text-base font-medium text-white">No members found</h3>
              <p className="text-sm mt-0.5" style={{ color: FOG }}>Try adjusting your search or filter</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-sm hover:underline"
                  style={{ color: YPA_BLUE }}
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
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedMember(member)}
                    className={`group relative cursor-pointer rounded-xl overflow-hidden transition-shadow duration-300 ${
                      viewMode === 'list' ? 'flex items-center gap-4 p-4' : ''
                    }`}
                    style={{ border: `1px solid ${LINE_SOFT}`, background: PANEL }}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative aspect-square w-full overflow-hidden" style={{ background: PANEL }}>
                          <MemberImage
                            image={member.image}
                            name={member.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="rounded-full p-1.5" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${LINE_SOFT}` }}>
                              <ChevronRight className="w-3.5 h-3.5" style={{ color: YPA_BLUE }} />
                            </div>
                          </div>
                        </div>
                        <div className="p-3 md:p-4">
                          <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#33C1F5] transition-colors">
                            {member.name}
                          </h4>
                          <p className="text-xs truncate font-medium" style={{ color: YPA_BLUE }}>{member.role}</p>
                          <p className="text-[10px] mt-0.5 truncate flex items-center gap-1" style={{ color: FOG }}>
                            <Briefcase className="w-2.5 h-2.5" />
                            {member.department || 'Team Member'}
                          </p>
                          {member.experience && (
                            <div className="flex items-center gap-1 mt-1.5 text-[9px]" style={{ color: "rgba(245,246,247,0.35)" }}>
                              <Clock className="w-2.5 h-2.5" />
                              <span>{member.experience}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0" style={{ background: PANEL, border: `1px solid ${LINE_SOFT}` }}>
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
                          <p className="text-xs font-medium" style={{ color: YPA_BLUE }}>{member.role}</p>
                          <p className="text-[10px]" style={{ color: FOG }}>{member.department}</p>
                        </div>
                        {member.experience && (
                          <div className="text-[10px] flex items-center gap-1 shrink-0" style={{ color: "rgba(245,246,247,0.35)" }}>
                            <Clock className="w-3 h-3" />
                            <span>{member.experience}</span>
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" style={{ color: "rgba(245,246,247,0.25)" }} />
                      </>
                    )}
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== MEMBER DETAIL MODAL ===== */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(10,10,11,0.9)", backdropFilter: "blur(16px)" }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: VOID, border: `1px solid ${LINE_SOFT}` }}>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full transition-colors"
                  style={{ color: FOG, background: "rgba(255,255,255,0.05)" }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative h-64 w-full overflow-hidden" style={{ background: PANEL }}>
                  <MemberImage
                    image={selectedMember.image}
                    name={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.1) 40%, rgba(10,10,11,0.95) 100%)" }} />

                  {selectedMember.featured && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ border: `1px solid rgba(240,180,41,0.35)`, background: "rgba(240,180,41,0.1)" }}>
                      <Award className="w-3 h-3" style={{ color: GOLD }} />
                      <span className={`${mono.className} text-[9px] uppercase tracking-[0.12em]`} style={{ color: GOLD }}>Leadership</span>
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8 -mt-16 relative z-10">
                  <div className="rounded-xl p-6 md:p-8" style={{ background: VOID, border: `1px solid ${LINE_SOFT}` }}>
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white">{selectedMember.name}</h2>
                        <p className="font-medium text-base" style={{ color: YPA_BLUE }}>{selectedMember.role}</p>
                        <p className="text-sm mt-0.5 flex items-center gap-1" style={{ color: FOG }}>
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
                            className="p-2.5 rounded-full transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE_SOFT}` }}
                            aria-label="LinkedIn"
                          >
                            <LinkedInIcon className="w-5 h-5" style={{ color: FOG }} />
                          </a>
                        )}
                        {selectedMember.email && (
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="p-2.5 rounded-full transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE_SOFT}` }}
                            aria-label="Email"
                          >
                            <Mail className="w-5 h-5" style={{ color: FOG }} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {selectedMember.experience && (
                        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${LINE_SOFT}` }}>
                          <Clock className="w-4 h-4" style={{ color: YPA_BLUE }} />
                          <span className="text-xs font-medium text-white">{selectedMember.experience}</span>
                          <span className="text-[10px]" style={{ color: FOG }}>experience</span>
                        </div>
                      )}
                      {selectedMember.department && (
                        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${LINE_SOFT}` }}>
                          <Users className="w-4 h-4" style={{ color: YPA_BLUE }} />
                          <span className="text-xs font-medium text-white">{selectedMember.department}</span>
                          <span className="text-[10px]" style={{ color: FOG }}>department</span>
                        </div>
                      )}
                    </div>

                    {selectedMember.bio && (
                      <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${LINE_SOFT}` }}>
                        <h4 className={`${mono.className} text-[10px] uppercase tracking-[0.15em] mb-3 flex items-center gap-2`} style={{ color: FOG }}>
                          <BookOpen className="w-3.5 h-3.5" style={{ color: YPA_BLUE }} />
                          About
                        </h4>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-light" style={{ color: "rgba(245,246,247,0.7)" }}>
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

      {/* ===== CTA ===== */}
      <section className="px-5 md:px-14 py-16 md:py-24" style={{ background: PANEL, borderTop: `1px solid ${LINE_SOFT}` }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl p-8 md:p-12 text-center overflow-hidden"
            style={{ border: `1px solid ${LINE_SOFT}`, background: VOID }}
          >
            <div className="absolute -top-1/3 right-[10%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(0,174,239,0.1)" }} />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(0,174,239,0.08)", border: `1px solid ${LINE_SOFT}` }}>
                <Shield className="w-5 h-5" style={{ color: YPA_BLUE_LIGHT }} />
              </div>
              <h3 className={`${display.className} text-xl md:text-2xl font-medium text-white`}>Join our team</h3>
              <p className="text-sm mt-2 max-w-md mx-auto font-light" style={{ color: FOG }}>
                We're always looking for people who want to help build a more accountable agribusiness sector in Africa.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: YPA_BLUE, color: VOID }}
                >
                  View careers
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-300"
                  style={{ color: FOG, border: `1px solid ${LINE_SOFT}` }}
                >
                  Learn more
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