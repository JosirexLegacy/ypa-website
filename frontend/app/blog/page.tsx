"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  User,
  Tag,
  Filter,
  Clock,
  BookOpen,
  TrendingUp,
  Sparkles,
  Award,
  Wheat,
  Droplets,
  Users,
  CalendarDays,
  Newspaper,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Zap,
  Grid3x3,
  LayoutGrid,
  Search,
} from "lucide-react";
import { format } from "date-fns";

// ============================================================
// TYPES
// ============================================================
interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  author?: string;
  published_at?: string;
}

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
const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

// ============================================================
// DESIGN TOKENS
// ============================================================
const INK = "#0A1628";
const NAVY = "#0E2540";
const NAVY_SOFT = "#153455";
const LINE = "#1F3B57";
const BLUE = "#00AEEF";
const BLUE_LIGHT = "#33C1F5";
const SKY = "#7EC8FF";
const GOLD = "#F0B429";
const MIST = "#F6F8FA";
const INK_ON_LIGHT = "#111111";
const MUTE_ON_LIGHT = "#5B6B7A";
const POSITIVE = "#34D399";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// ✅ HELPER: Get image URL - handles both Cloudinary and Directus
// ============================================================
function getImageUrl(image: string | undefined): string | null {
  if (!image) return null;
  
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  if (image.length > 0 && !image.startsWith('/')) {
    return `${API_URL}/assets/${image}`;
  }
  
  return null;
}

// ============================================================
// CATEGORIES
// ============================================================
const CATEGORIES = [
  { value: "all", label: "All Posts", icon: BookOpen },
  { value: "goats", label: "Goats", icon: Award },
  { value: "maize", label: "Maize", icon: Wheat },
  { value: "beekeeping", label: "Beekeeping", icon: Droplets },
  { value: "kids", label: "Youth", icon: Users },
  { value: "events", label: "Events", icon: CalendarDays },
  { value: "news", label: "News", icon: Newspaper },
  { value: "general", label: "General", icon: Lightbulb },
];

const POSTS_PER_PAGE = 9;

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
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// PAGINATION COMPONENT
// ============================================================
const Pagination = ({ currentPage, totalPages, category }: { currentPage: number; totalPages: number; category: string }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPages = pages.slice(
    Math.max(0, currentPage - 2),
    Math.min(totalPages, currentPage + 1)
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Link
        href={`/blog?category=${category}&page=${currentPage - 1}`}
        className={`p-2 rounded-full border transition-all ${
          currentPage === 1
            ? "opacity-30 pointer-events-none border-gray-200"
            : "hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 border-gray-200"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" style={{ color: currentPage === 1 ? MUTE_ON_LIGHT : INK_ON_LIGHT }} />
      </Link>

      {showPages.map((p) => (
        <Link
          key={p}
          href={`/blog?category=${category}&page=${p}`}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
            p === currentPage
              ? "bg-[#00AEEF] text-white shadow-md shadow-[#00AEEF]/25"
              : "text-[#0A1628] hover:bg-[#00AEEF]/10 border border-transparent hover:border-[#00AEEF]/20"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={`/blog?category=${category}&page=${currentPage + 1}`}
        className={`p-2 rounded-full border transition-all ${
          currentPage === totalPages
            ? "opacity-30 pointer-events-none border-gray-200"
            : "hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 border-gray-200"
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" style={{ color: currentPage === totalPages ? MUTE_ON_LIGHT : INK_ON_LIGHT }} />
      </Link>
    </div>
  );
};

// ============================================================
// DATA FETCHING
// ============================================================
async function fetchPosts(category?: string, page: number = 1) {
  const offset = (page - 1) * POSTS_PER_PAGE;
  let url = `${API_URL}/items/posts?filter[status][_eq]=published&sort[]=-published_at&limit=${POSTS_PER_PAGE}&offset=${offset}`;
  if (category && category !== "all") {
    url = `${API_URL}/items/posts?filter[status][_eq]=published&filter[category][_eq]=${category}&sort[]=-published_at&limit=${POSTS_PER_PAGE}&offset=${offset}`;
  }
  let countUrl = `${API_URL}/items/posts?filter[status][_eq]=published&aggregate[count]=*`;
  if (category && category !== "all") {
    countUrl = `${API_URL}/items/posts?filter[status][_eq]=published&filter[category][_eq]=${category}&aggregate[count]=*`;
  }

  try {
    const [postsRes, countRes] = await Promise.all([
      fetch(url, { cache: "no-store" }),
      fetch(countUrl, { cache: "no-store" }),
    ]);
    if (!postsRes.ok) return { posts: [], total: 0, page: 1, totalPages: 0 };
    const postsData = await postsRes.json();
    const countData = await countRes.json();
    const total = countData.data?.[0]?.count || 0;
    const totalPages = Math.ceil(total / POSTS_PER_PAGE);
    return {
      posts: postsData.data || [],
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], total: 0, page: 1, totalPages: 0 };
  }
}

// ============================================================
// MAIN BLOG PAGE
// ============================================================
export default function BlogPage() {
  const [searchParams, setSearchParams] = useState({ category: "all", page: 1 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category") || "all";
    const page = parseInt(params.get("page") || "1", 10);
    setSearchParams({ category, page });
  }, []);

  useEffect(() => {
    if (!searchParams.category) return;
    const load = async () => {
      setLoading(true);
      const result = await fetchPosts(
        searchParams.category === "all" ? undefined : searchParams.category,
        searchParams.page
      );
      setPosts(result.posts);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setLoading(false);
    };
    load();
  }, [searchParams]);

  const updateParams = (newCategory?: string, newPage?: number) => {
    const cat = newCategory ?? searchParams.category;
    const page = newPage ?? searchParams.page;
    const params = new URLSearchParams();
    if (cat && cat !== "all") params.set("category", cat);
    if (page && page > 1) params.set("page", String(page));
    const url = `/blog${params.toString() ? "?" + params.toString() : ""}`;
    window.history.pushState({}, "", url);
    setSearchParams({ category: cat, page });
  };

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const remainingPosts = posts.slice(1);

  if (loading) {
    return (
      <main className={`${display.variable} ${mono.variable} ${inter.variable} ${serif.variable} min-h-screen bg-white`}>
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
      className={`${display.variable} ${mono.variable} ${inter.variable} ${serif.variable} min-h-screen bg-white font-sans antialiased`}
    >
      <Navigation />

      {/* ===== HERO ===== */}
      <section className="relative pt-28 md:pt-32 pb-16 px-4 md:px-6 overflow-hidden" style={{ background: NAVY }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }} />
        </div>
        
        {/* Animated Blobs */}
        <motion.div
          className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${BLUE}15` }}
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${BLUE_LIGHT}10` }}
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-[20%] left-[30%] w-[200px] h-[200px] rounded-full blur-3xl pointer-events-none hidden md:block"
          style={{ background: `${GOLD}08` }}
          animate={{ scale: [1, 1.2, 1], x: [0, 20, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
              <div>
                <div className={`${mono.className} inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase mb-3`} style={{ color: `${BLUE_LIGHT}60` }}>
                  <BookOpen className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
                  Stories & Insights
                </div>
                <h1
                  className={`${display.className} text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white`}
                >
                  The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] to-[#33C1F5]">YPA</span> Blog
                </h1>
                <p
                  className={`${inter.className} text-sm md:text-base mt-2 max-w-xl text-white/50 font-light`}
                >
                  Insights, stories, and updates from Youth Platform Africa's agribusiness journey
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`${mono.className} flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border`}
                  style={{ 
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" style={{ color: BLUE_LIGHT }} />
                  <span className="text-xs text-white/50">Total posts</span>
                  <span className="font-medium text-sm text-white">
                    {total}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== CATEGORY FILTER ===== */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8ECF0] py-3 px-4 md:px-6 shadow-sm">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
            <Filter className="w-3.5 h-3.5 text-[#5B6B7A] shrink-0" />
            <span className={`${mono.className} text-[9px] tracking-[0.1em] uppercase text-[#5B6B7A] mr-1 hidden sm:inline shrink-0`}>
              Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = searchParams.category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => updateParams(cat.value, 1)}
                  className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-[#00AEEF] text-white shadow-sm shadow-[#00AEEF]/25"
                      : "text-[#5B6B7A] hover:text-[#0A1628] hover:bg-[#F6F8FA]"
                  }`}
                >
                  <Icon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className="hidden xs:inline">{cat.label}</span>
                  <span className="inline xs:hidden">{cat.value === "all" ? "All" : cat.value.substring(0, 3)}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5 border-l border-[#E8ECF0] pl-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'text-[#00AEEF] bg-[#00AEEF]/10' 
                  : 'text-[#5B6B7A] hover:text-[#0A1628]'
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
                  : 'text-[#5B6B7A] hover:text-[#0A1628]'
              }`}
              aria-label="List view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {searchParams.category !== "all" && (
        <div className="flex justify-center mt-4 px-4">
          <div
            className={`${mono.className} flex items-center gap-2 text-[9px] md:text-[10px] px-3 py-1 rounded-full border`}
            style={{ background: MIST, borderColor: "#E8ECF0", color: MUTE_ON_LIGHT }}
          >
            <span>Showing</span>
            <span className="font-medium" style={{ color: INK_ON_LIGHT }}>
              {CATEGORIES.find((c) => c.value === searchParams.category)?.label}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D1D9E0]" />
            <span>
              {total} {total === 1 ? "post" : "posts"}
            </span>
            {totalPages > 1 && (
              <>
                <span className="w-1 h-1 rounded-full bg-[#D1D9E0]" />
                <span>
                  Page {searchParams.page} of {totalPages}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== FEATURED POST ===== */}
      {featuredPost && searchParams.page === 1 && (
        <section className="px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
          <ScrollReveal>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div
                className="relative rounded-2xl md:rounded-3xl overflow-hidden border bg-white transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                style={{ borderColor: "#E8ECF0" }}
              >
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="relative h-[250px] md:h-[380px] md:col-span-2 overflow-hidden bg-[#F5F9FF]">
                    {featuredPost.featured_image ? (
                      <img
                        src={getImageUrl(featuredPost.featured_image) || ''}
                        alt={featuredPost.title}
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                    <div className={`absolute inset-0 flex items-center justify-center ${featuredPost.featured_image ? 'hidden' : ''}`}>
                      <BookOpen className="w-20 h-20" style={{ color: `${BLUE}15` }} />
                    </div>
                    <div className="absolute top-3 md:top-4 left-3 md:left-4 flex gap-2">
                      <span
                        className={`${mono.className} px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[10px] tracking-[0.1em] uppercase text-white rounded-full flex items-center gap-1`}
                        style={{ background: BLUE, boxShadow: `0 4px 12px ${BLUE}44` }}
                      >
                        <Sparkles className="w-2 h-2 md:w-3 md:h-3" />
                        Featured
                      </span>
                    </div>
                    {featuredPost.category && (
                      <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
                        {(() => {
                          const cat = CATEGORIES.find((c) => c.value === featuredPost.category);
                          const CatIcon = cat?.icon || Tag;
                          return (
                            <span
                              className={`${mono.className} px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[10px] tracking-[0.1em] uppercase backdrop-blur-md bg-black/40 text-white rounded-full flex items-center gap-1.5 border border-white/10`}
                            >
                              <CatIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              {cat?.label || featuredPost.category}
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="p-5 md:p-10 md:col-span-3 flex flex-col justify-center">
                    <div
                      className={`${mono.className} flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-[11px] mb-2 md:mb-3`}
                      style={{ color: MUTE_ON_LIGHT }}
                    >
                      <span className="flex items-center gap-1 md:gap-1.5">
                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {featuredPost.published_at
                          ? format(new Date(featuredPost.published_at), "MMMM d, yyyy")
                          : "Recent"}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#D1D9E0]" />
                      <span className="flex items-center gap-1 md:gap-1.5">
                        <User className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {featuredPost.author || "YPA Team"}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#D1D9E0]" />
                      <span className="flex items-center gap-1 md:gap-1.5">
                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {Math.ceil((featuredPost.content?.length || 500) / 1000)} min read
                      </span>
                    </div>
                    <h2
                      className={`${display.className} text-xl md:text-3xl lg:text-4xl font-medium tracking-tight group-hover:text-[#00AEEF] transition-colors leading-tight`}
                      style={{ color: INK_ON_LIGHT }}
                    >
                      {featuredPost.title}
                    </h2>
                    <p className={`${inter.className} text-xs md:text-sm leading-relaxed mt-2 md:mt-3 font-light`} style={{ color: MUTE_ON_LIGHT }}>
                      {featuredPost.excerpt ||
                        "Read the full story to discover insights from YPA's agribusiness journey..."}
                    </p>
                    <div className="mt-3 md:mt-5 flex items-center gap-2 md:gap-3">
                      <span
                        className={`${mono.className} inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium group-hover:gap-2 md:group-hover:gap-3 transition-all`}
                        style={{ color: BLUE }}
                      >
                        Read full article
                        <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </section>
      )}

      {/* ===== POSTS GRID ===== */}
      <section className="px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-16 md:py-20 border rounded-2xl md:rounded-3xl" style={{ borderColor: "#E8ECF0", background: MIST }}>
            <div className="flex justify-center mb-4">
              <BookOpen className="w-12 h-12 md:w-16 md:h-16" style={{ color: MUTE_ON_LIGHT, opacity: 0.3 }} />
            </div>
            <h3 className={`${display.className} text-xl md:text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>
              No posts found
            </h3>
            <p className={`${inter.className} text-xs md:text-sm mt-2 max-w-sm mx-auto font-light`} style={{ color: MUTE_ON_LIGHT }}>
              {searchParams.category !== "all"
                ? `No posts in "${CATEGORIES.find((c) => c.value === searchParams.category)?.label}" category yet`
                : "Check back soon for updates from YPA"}
            </p>
            {searchParams.category !== "all" && (
              <button
                onClick={() => updateParams("all", 1)}
                className="inline-flex items-center gap-2 mt-4 md:mt-6 font-medium text-xs md:text-sm px-5 md:px-6 py-2 md:py-2.5 rounded-full border bg-white hover:shadow-md transition-all"
                style={{ color: BLUE, borderColor: "#E8ECF0" }}
              >
                View all posts
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {(searchParams.page === 1 ? remainingPosts : posts).map((post, index) => (
                <ScrollReveal key={post.id} delay={(index % 6) * 0.04}>
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    {viewMode === 'grid' ? (
                      <div
                        className="relative rounded-xl md:rounded-2xl border bg-white overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col"
                        style={{ borderColor: "#E8ECF0" }}
                      >
                        <div className="relative w-full h-44 md:h-52 min-h-[176px] md:min-h-[208px] overflow-hidden bg-[#F5F9FF] flex-shrink-0">
                          {post.featured_image ? (
                            <img
                              src={getImageUrl(post.featured_image) || ''}
                              alt={post.title}
                              crossOrigin="anonymous"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : null}
                          <div className={`absolute inset-0 flex items-center justify-center ${post.featured_image ? 'hidden' : ''}`}>
                            <BookOpen className="w-10 h-10 md:w-12 md:h-12" style={{ color: `${BLUE}15` }} />
                          </div>
                          {post.category && (
                            <div className="absolute top-2 md:top-3 left-2 md:left-3">
                              {(() => {
                                const cat = CATEGORIES.find((c) => c.value === post.category);
                                const CatIcon = cat?.icon || Tag;
                                return (
                                  <span
                                    className={`${mono.className} px-1.5 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[10px] tracking-[0.1em] uppercase rounded-full flex items-center gap-1 bg-white/90 backdrop-blur-sm border`}
                                    style={{ color: INK_ON_LIGHT, borderColor: "#E8ECF0" }}
                                  >
                                    <CatIcon className="w-2 h-2 md:w-3 md:h-3" />
                                    {cat?.label || post.category}
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                          <div className="absolute top-2 md:top-3 right-2 md:right-3">
                            <span
                              className={`${mono.className} px-1.5 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[10px] tracking-[0.1em] uppercase rounded-full bg-white/90 backdrop-blur-sm border`}
                              style={{ color: MUTE_ON_LIGHT, borderColor: "#E8ECF0" }}
                            >
                              {Math.ceil((post.content?.length || 300) / 1000)} min
                            </span>
                          </div>
                        </div>

                        <div className="p-3 md:p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div
                              className={`${mono.className} flex flex-wrap items-center gap-2 md:gap-3 text-[9px] md:text-[10px] text-[#5B6B7A] mb-1 md:mb-2`}
                            >
                              <span className="flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                {post.published_at
                                  ? format(new Date(post.published_at), "MMM d, yyyy")
                                  : "Recent"}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span className="flex items-center gap-1">
                                <User className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                {post.author || "YPA Team"}
                              </span>
                            </div>
                            <h3
                              className={`${display.className} text-base md:text-lg font-medium group-hover:text-[#00AEEF] transition-colors leading-tight line-clamp-2`}
                              style={{ color: INK_ON_LIGHT }}
                            >
                              {post.title}
                            </h3>
                            <p
                              className={`${inter.className} text-xs md:text-sm text-[#5B6B7A] leading-relaxed mt-1 line-clamp-2 font-light`}
                            >
                              {post.excerpt || "Read more about this update from YPA..."}
                            </p>
                          </div>
                          <div className="mt-3 md:mt-4 flex items-center gap-1.5 md:gap-2">
                            <span
                              className={`${mono.className} inline-flex items-center gap-1 text-xs md:text-sm font-medium text-[#00AEEF] group-hover:gap-1.5 md:group-hover:gap-2 transition-all`}
                            >
                              Read more
                              <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col sm:flex-row gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        style={{ borderColor: "#E8ECF0" }}
                      >
                        <div className="relative w-full sm:w-48 h-32 sm:h-40 rounded-lg overflow-hidden bg-[#F5F9FF] flex-shrink-0">
                          {post.featured_image ? (
                            <img
                              src={getImageUrl(post.featured_image) || ''}
                              alt={post.title}
                              crossOrigin="anonymous"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-8 h-8" style={{ color: `${BLUE}15` }} />
                            </div>
                          )}
                          {post.category && (
                            <div className="absolute top-2 left-2">
                              {(() => {
                                const cat = CATEGORIES.find((c) => c.value === post.category);
                                const CatIcon = cat?.icon || Tag;
                                return (
                                  <span
                                    className={`${mono.className} px-2 py-0.5 text-[8px] text-[10px] tracking-[0.1em] uppercase rounded-full flex items-center gap-1 bg-white/90 backdrop-blur-sm border`}
                                    style={{ color: INK_ON_LIGHT, borderColor: "#E8ECF0" }}
                                  >
                                    <CatIcon className="w-2 h-2" />
                                    {cat?.label || post.category}
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className={`${mono.className} flex flex-wrap items-center gap-2 text-[9px] md:text-[10px] text-[#5B6B7A] mb-1`}>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "Recent"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1">
                              <User className="w-2.5 h-2.5" />
                              {post.author || "YPA Team"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {Math.ceil((post.content?.length || 300) / 1000)} min
                            </span>
                          </div>
                          <h3
                            className={`${display.className} text-base md:text-lg font-medium group-hover:text-[#00AEEF] transition-colors leading-tight line-clamp-2`}
                            style={{ color: INK_ON_LIGHT }}
                          >
                            {post.title}
                          </h3>
                          <p className={`${inter.className} text-xs md:text-sm text-[#5B6B7A] leading-relaxed mt-1 line-clamp-1 font-light`}>
                            {post.excerpt || "Read more about this update from YPA..."}
                          </p>
                          <div className="mt-2 flex items-center gap-1.5">
                            <span
                              className={`${mono.className} inline-flex items-center gap-1 text-xs font-medium text-[#00AEEF] group-hover:gap-1.5 transition-all`}
                            >
                              Read more
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <Pagination
              currentPage={searchParams.page}
              totalPages={totalPages}
              category={searchParams.category}
            />
          </>
        )}
      </section>

      {/* ===== CTA ===== */}
      <section className="px-4 md:px-6 py-16 md:py-20 border-t" style={{ borderColor: "#E8ECF0", background: MIST }}>
        <div className="container mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <div
              className="rounded-2xl md:rounded-3xl p-8 md:p-12 border bg-white/80 backdrop-blur-sm shadow-sm"
              style={{ borderColor: "#E8ECF0" }}
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
                style={{ background: `${BLUE}10` }}
              >
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6" style={{ color: BLUE }} />
              </div>
              <h3 className={`${display.className} text-xl md:text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                Share Your Story
              </h3>
              <p className={`${inter.className} text-xs md:text-sm mt-2 max-w-sm mx-auto font-light`} style={{ color: MUTE_ON_LIGHT }}>
                Have an inspiring experience from your YPA journey? We'd love to feature it.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-4 md:mt-6 text-white px-6 md:px-8 py-2.5 md:py-3.5 rounded-full text-xs md:text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
              >
                Get in touch
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}