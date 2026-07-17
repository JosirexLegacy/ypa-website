"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
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
// FONTS (same as homepage)
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
// DESIGN TOKENS (mirror homepage)
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

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// CATEGORIES (with matching icon and colour)
// ============================================================
const CATEGORIES = [
  { value: "all", label: "All Posts", icon: BookOpen, color: "text-[#1A3A5C]" },
  { value: "goats", label: "Goats", icon: Award, color: "text-emerald-600" },
  { value: "maize", label: "Maize", icon: Wheat, color: "text-amber-600" },
  { value: "beekeeping", label: "Beekeeping", icon: Droplets, color: "text-yellow-600" },
  { value: "kids", label: "Youth", icon: Users, color: "text-blue-600" },
  { value: "events", label: "Events", icon: CalendarDays, color: "text-purple-600" },
  { value: "news", label: "News", icon: Newspaper, color: "text-rose-600" },
  { value: "general", label: "General", icon: Lightbulb, color: "text-gray-600" },
];

const POSTS_PER_PAGE = 9;

// ============================================================
// SCROLL REVEAL (copy from homepage)
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
// PAGINATION COMPONENT (redesigned with glass)
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
            : "hover:border-[#2196F3] hover:bg-[#2196F3]/5 border-gray-200"
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
              ? "bg-[#2196F3] text-white shadow-md shadow-[#2196F3]/25"
              : "text-[#1A3A5C] hover:bg-[#2196F3]/10 border border-transparent hover:border-[#2196F3]/20"
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
            : "hover:border-[#2196F3] hover:bg-[#2196F3]/5 border-gray-200"
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" style={{ color: currentPage === totalPages ? MUTE_ON_LIGHT : INK_ON_LIGHT }} />
      </Link>
    </div>
  );
};

// ============================================================
// DATA FETCHING (unchanged)
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
// MAIN BLOG PAGE (Client Component – logic unchanged)
// ============================================================
export default function BlogPage() {
  const [searchParams, setSearchParams] = useState({ category: "all", page: 1 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Read query params from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category") || "all";
    const page = parseInt(params.get("page") || "1", 10);
    setSearchParams({ category, page });
  }, []);

  // Fetch posts when category/page changes
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

  // Update URL when category or page changes (client-side navigation)
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

  // Loading state
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
      <Navigation />

      {/* ===== HERO – spacious, with floating pill ===== */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden" style={{ background: MIST }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: `${BLUE}08` }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: `${SKY}08` }} />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1
                  className={`${display.className} text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight`}
                  style={{ color: INK_ON_LIGHT }}
                >
                  Stories & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2196F3] to-[#64B5F6]">Updates</span>
                </h1>
                <p
                  className={`${mono.className} text-sm mt-2`}
                  style={{ color: MUTE_ON_LIGHT }}
                >
                  Insights from Youth Platform Africa's agribusiness journey
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Floating pill for count */}
                <div
                  className={`${mono.className} flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-sm bg-white/70 backdrop-blur-sm`}
                  style={{ borderColor: "#E8ECF0" }}
                >
                  <BookOpen className="w-4 h-4" style={{ color: BLUE }} />
                  <span style={{ color: MUTE_ON_LIGHT }}>Total posts</span>
                  <span className="font-medium" style={{ color: INK_ON_LIGHT }}>
                    {total}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== CATEGORY FILTER – floating glass, full width ===== */}
      <div className="sticky top-20 z-30 flex justify-center px-4 -mt-4">
        <div
          className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px) saturate(1.3)",
            boxShadow: "0 8px 40px rgba(33,150,243,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <Filter className="w-3.5 h-3.5" style={{ color: MUTE_ON_LIGHT }} />
          <span className={`${mono.className} text-[10px] tracking-[0.1em] uppercase text-[#5B6B7A] mr-1`}>
            Filter:
          </span>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = searchParams.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateParams(cat.value, 1)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-[#2196F3] text-white shadow-md shadow-[#2196F3]/25"
                    : "hover:bg-[#F5F9FF] border border-transparent hover:border-[#E8ECF0]"
                }`}
                style={isActive ? {} : { color: INK_ON_LIGHT }}
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {searchParams.category !== "all" && (
        <div className="flex justify-center mt-4 px-4">
          <div
            className={`${mono.className} flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-full border`}
            style={{ background: MIST, borderColor: "#E8ECF0", color: MUTE_ON_LIGHT }}
          >
            <span>Showing</span>
            <span className="font-medium" style={{ color: INK_ON_LIGHT }}>
              {CATEGORIES.find((c) => c.value === searchParams.category)?.label}
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: "#D1D9E0" }} />
            <span>
              {total} {total === 1 ? "post" : "posts"}
            </span>
            {totalPages > 1 && (
              <>
                <span className="w-1 h-1 rounded-full" style={{ background: "#D1D9E0" }} />
                <span>
                  Page {searchParams.page} of {totalPages}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== FEATURED POST – full-width, spacious ===== */}
      {featuredPost && searchParams.page === 1 && (
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <ScrollReveal>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div
                className="relative rounded-3xl overflow-hidden border bg-white transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                style={{ borderColor: "#E8ECF0" }}
              >
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="relative h-[320px] md:h-[380px] md:col-span-2 overflow-hidden bg-[#F5F9FF]">
                    {featuredPost.featured_image ? (
                      <img
                        src={`${API_URL}/assets/${featuredPost.featured_image}`}
                        alt={featuredPost.title}
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                    <div className={`absolute inset-0 flex items-center justify-center ${featuredPost.featured_image ? 'hidden' : ''}`}>
                      <BookOpen className="w-20 h-20" style={{ color: `${BLUE}15` }} />
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span
                        className={`${mono.className} px-3 py-1 text-[10px] tracking-[0.1em] uppercase text-white rounded-full flex items-center gap-1`}
                        style={{ background: BLUE, boxShadow: `0 4px 12px ${BLUE}44` }}
                      >
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                    {featuredPost.category && (
                      <div className="absolute bottom-4 left-4">
                        {(() => {
                          const cat = CATEGORIES.find((c) => c.value === featuredPost.category);
                          const CatIcon = cat?.icon || Tag;
                          return (
                            <span
                              className={`${mono.className} px-3 py-1 text-[10px] tracking-[0.1em] uppercase backdrop-blur-md bg-black/40 text-white rounded-full flex items-center gap-1.5 border border-white/10`}
                            >
                              <CatIcon className="w-3 h-3" />
                              {cat?.label || featuredPost.category}
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="p-8 md:p-10 md:col-span-3 flex flex-col justify-center">
                    <div
                      className={`${mono.className} flex flex-wrap items-center gap-4 text-[11px] mb-3`}
                      style={{ color: MUTE_ON_LIGHT }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredPost.published_at
                          ? format(new Date(featuredPost.published_at), "MMMM d, yyyy")
                          : "Recent"}
                      </span>
                      <span className="w-1 h-1 rounded-full" style={{ background: "#D1D9E0" }} />
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {featuredPost.author || "YPA Team"}
                      </span>
                      <span className="w-1 h-1 rounded-full" style={{ background: "#D1D9E0" }} />
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.ceil((featuredPost.content?.length || 500) / 1000)} min read
                      </span>
                    </div>
                    <h2
                      className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight group-hover:text-[#2196F3] transition-colors leading-tight`}
                      style={{ color: INK_ON_LIGHT }}
                    >
                      {featuredPost.title}
                    </h2>
                    <p className="text-sm leading-relaxed mt-3" style={{ color: MUTE_ON_LIGHT }}>
                      {featuredPost.excerpt ||
                        "Read the full story to discover insights from YPA's agribusiness journey..."}
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <span
                        className={`${mono.className} inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all`}
                        style={{ color: BLUE }}
                      >
                        Read full article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </section>
      )}

      {/* ===== POSTS GRID – 3 columns, full width, consistent heights ===== */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-20 border rounded-3xl" style={{ borderColor: "#E8ECF0", background: MIST }}>
            <div className="flex justify-center mb-4">
              <BookOpen className="w-16 h-16" style={{ color: MUTE_ON_LIGHT, opacity: 0.3 }} />
            </div>
            <h3 className={`${display.className} text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>
              No posts found
            </h3>
            <p className="text-sm mt-2 max-w-sm mx-auto" style={{ color: MUTE_ON_LIGHT }}>
              {searchParams.category !== "all"
                ? `No posts in "${CATEGORIES.find((c) => c.value === searchParams.category)?.label}" category yet`
                : "Check back soon for updates from YPA"}
            </p>
            {searchParams.category !== "all" && (
              <button
                onClick={() => updateParams("all", 1)}
                className="inline-flex items-center gap-2 mt-6 font-medium text-sm px-6 py-2.5 rounded-full border bg-white hover:shadow-md transition-all"
                style={{ color: BLUE, borderColor: "#E8ECF0" }}
              >
                View all posts
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Modern grid with consistent 3‑col layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchParams.page === 1 ? remainingPosts : posts).map((post, index) => (
                <ScrollReveal key={post.id} delay={(index % 6) * 0.05}>
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <div
                      className="relative rounded-2xl border bg-white overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col"
                      style={{ borderColor: "#E8ECF0" }}
                    >
                      <div className="relative w-full h-52 min-h-[208px] overflow-hidden bg-[#F5F9FF] flex-shrink-0">
                        {post.featured_image ? (
                          <img
                            src={`${API_URL}/assets/${post.featured_image}`}
                            alt={post.title}
                            crossOrigin="anonymous"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : null}
                        <div className={`absolute inset-0 flex items-center justify-center ${post.featured_image ? 'hidden' : ''}`}>
                          <BookOpen className="w-12 h-12" style={{ color: `${BLUE}15` }} />
                        </div>
                        {/* Category badge – top left */}
                        {post.category && (
                          <div className="absolute top-3 left-3">
                            {(() => {
                              const cat = CATEGORIES.find((c) => c.value === post.category);
                              const CatIcon = cat?.icon || Tag;
                              return (
                                <span
                                  className={`${mono.className} px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase rounded-full flex items-center gap-1 bg-white/90 backdrop-blur-sm border`}
                                  style={{ color: INK_ON_LIGHT, borderColor: "#E8ECF0" }}
                                >
                                  <CatIcon className="w-3 h-3" />
                                  {cat?.label || post.category}
                                </span>
                              );
                            })()}
                          </div>
                        )}
                        {/* Read time – top right */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`${mono.className} px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase rounded-full bg-white/90 backdrop-blur-sm border`}
                            style={{ color: MUTE_ON_LIGHT, borderColor: "#E8ECF0" }}
                          >
                            {Math.ceil((post.content?.length || 300) / 1000)} min
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div
                            className={`${mono.className} flex flex-wrap items-center gap-3 text-[10px] text-[#5B6B7A] mb-2`}
                          >
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.published_at
                                ? format(new Date(post.published_at), "MMM d, yyyy")
                                : "Recent"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {post.author || "YPA Team"}
                            </span>
                          </div>
                          <h3
                            className={`${display.className} text-lg font-medium group-hover:text-[#2196F3] transition-colors leading-tight line-clamp-2`}
                            style={{ color: INK_ON_LIGHT }}
                          >
                            {post.title}
                          </h3>
                          <p
                            className="text-sm text-[#5B6B7A] leading-relaxed mt-1 line-clamp-2"
                          >
                            {post.excerpt || "Read more about this update from YPA..."}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <span
                            className={`${mono.className} inline-flex items-center gap-1 text-sm font-medium text-[#2196F3] group-hover:gap-2 transition-all`}
                          >
                            Read more
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            {/* ===== PAGINATION ===== */}
            <Pagination
              currentPage={searchParams.page}
              totalPages={totalPages}
              category={searchParams.category}
            />
          </>
        )}
      </section>

      {/* ===== CTA – glass card ===== */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "#E8ECF0", background: MIST }}>
        <div className="container mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <div
              className="rounded-3xl p-12 md:p-16 border bg-white/80 backdrop-blur-sm shadow-sm"
              style={{ borderColor: "#E8ECF0" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${BLUE}10` }}
              >
                <TrendingUp className="w-6 h-6" style={{ color: BLUE }} />
              </div>
              <h3 className={`${display.className} text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                Share Your Story
              </h3>
              <p className="text-sm mt-2 max-w-sm mx-auto" style={{ color: MUTE_ON_LIGHT }}>
                Have an inspiring experience from your YPA journey? We'd love to feature it.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-6 text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}