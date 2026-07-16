// app/signal/page.tsx

"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

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
// DESIGN TOKENS (mirroring homepage)
// ============================================================
const BLUE = "#2196F3";
const SKY = "#7EC8FF";
const INK_ON_LIGHT = "#0E2540";
const MUTE_ON_LIGHT = "#5B6B7A";
const MIST = "#F6F8FA";
const INK = "#060B14";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

const ITEMS_PER_PAGE = 12;

// ============================================================
// DATA FETCHING (with fallback)
// ============================================================
async function fetchSignalArticles(page: number = 1) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  try {
    const [itemsRes, countRes] = await Promise.all([
      fetch(
        `${API_URL}/items/signal_articles?filter[status][_eq]=published&sort[]=-date&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
        { cache: "no-store" }
      ),
      fetch(
        `${API_URL}/items/signal_articles?filter[status][_eq]=published&aggregate[count]=*`,
        { cache: "no-store" }
      ),
    ]);
    if (!itemsRes.ok || !countRes.ok) throw new Error("Failed to fetch");
    const items = await itemsRes.json();
    const countData = await countRes.json();
    const total = countData.data?.[0]?.count || 0;
    return {
      articles: items.data || [],
      total,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    };
  } catch (_) {
    // Fallback articles
    const fallback = [
      {
        title: "How 130,000 goats get tracked without losing a single one",
        description: "Inside the logistics behind YPA's livestock operation.",
        image: "https://images.unsplash.com/photo-1535268647677-300d0a4c3b7b?w=800&q=80",
        tag: "Operations",
        readTime: "3 min",
        slug: "how-130000-goats-get-tracked",
        date: new Date().toISOString(),
      },
      {
        title: "Why contract farming changes the math for a smallholder",
        description: "Guaranteed off-take, explained plainly.",
        image: "https://images.unsplash.com/photo-1593250481214-81611f9bca0f?w=800&q=80",
        tag: "Sustainability",
        readTime: "4 min",
        slug: "why-contract-farming-changes-the-math",
        date: new Date().toISOString(),
      },
      {
        title: "Twelve branches, one ledger",
        description: "How YPA SACCO keeps every member's savings visible.",
        image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&q=80",
        tag: "Finance",
        readTime: "5 min",
        slug: "twelve-branches-one-ledger",
        date: new Date().toISOString(),
      },
    ];
    return { articles: fallback, total: fallback.length, totalPages: 1 };
  }
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function SignalListingPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { articles, total, totalPages } = await fetchSignalArticles(currentPage);
      setArticles(articles);
      setTotal(total);
      setTotalPages(totalPages);
      setLoading(false);
    };
    load();
  }, [currentPage]);

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "var(--font-display)" }}>
      <Navigation />

      {/* ===== HERO – with glass pill and glow ===== */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden" style={{ background: MIST }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: `${BLUE}08` }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: `${SKY}08` }} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className={`${mono.className} flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: MUTE_ON_LIGHT }}>
                <BookOpen className="w-3.5 h-3.5" />
                Inside YPA
              </div>
              <h1 className={`${display.className} text-4xl md:text-5xl font-medium tracking-tight`} style={{ color: INK_ON_LIGHT }}>
                All Stories from the <span style={{ color: BLUE }}>Field</span>
              </h1>
              <p className="text-sm mt-2" style={{ color: MUTE_ON_LIGHT }}>
                Insights, operations, and impact from Youth Platform Africa
              </p>
            </div>
            {/* === glass pill total count === */}
            <div
              className={`${mono.className} flex items-center gap-4 text-[11px] px-4 py-2 rounded-full border shadow-sm`}
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(8px)",
                borderColor: "rgba(255,255,255,0.8)",
                boxShadow: "0 4px 20px rgba(33,150,243,0.08)",
              }}
            >
              <span style={{ color: MUTE_ON_LIGHT }}>Total stories</span>
              <span className="font-medium" style={{ color: INK_ON_LIGHT }}>{total}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ARTICLES GRID ===== */}
      <section className="px-6 py-12">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-[3px] rounded-full animate-spin" style={{ borderColor: "#E3F2FD", borderTopColor: BLUE }} />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 border rounded-3xl" style={{ borderColor: "#E8ECF0", background: MIST }}>
              <div className="text-6xl mb-4 opacity-30">📖</div>
              <h3 className={`${display.className} text-xl font-medium`} style={{ color: INK_ON_LIGHT }}>No stories yet</h3>
              <p className="text-sm mt-1" style={{ color: MUTE_ON_LIGHT }}>Check back soon for new stories from YPA</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article: any) => {
                  const imageUrl = article.image?.startsWith("http")
                    ? article.image
                    : `${API_URL}/assets/${article.image}`;
                  const fallbackImage = "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&q=80";
                  return (
                    <Link key={article.slug} href={`/signal/${article.slug}`} className="group block">
                      <div
                        className="relative rounded-3xl overflow-hidden border bg-white transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                        style={{ borderColor: "#E8ECF0" }}
                      >
                        <div className="relative h-52 overflow-hidden bg-[#F5F9FF]">
                          <img
                            src={imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                          />
                          {/* === glass tag === */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`${mono.className} inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] uppercase rounded-full border`}
                              style={{
                                background: "rgba(255,255,255,0.75)",
                                backdropFilter: "blur(8px)",
                                borderColor: "rgba(255,255,255,0.6)",
                                color: INK_ON_LIGHT,
                                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                              }}
                            >
                              <Tag className="w-3 h-3" />
                              {article.tag}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 space-y-3">
                          <div className={`${mono.className} flex items-center gap-3 text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {article.date ? format(new Date(article.date), "MMM d, yyyy") : "Recent"}
                            </span>
                            <span className="w-1 h-1 rounded-full" style={{ background: "#D1D9E0" }} />
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {article.readTime || "3 min"}
                            </span>
                          </div>
                          <h3 className={`${display.className} text-xl font-medium group-hover:text-[#2196F3] transition-colors leading-tight line-clamp-2`} style={{ color: INK_ON_LIGHT }}>
                            {article.title}
                          </h3>
                          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: MUTE_ON_LIGHT }}>
                            {article.description || "Read the full story from YPA's journey..."}
                          </p>
                          <div className="flex items-center gap-1 pt-2">
                            <span className={`${mono.className} inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all`} style={{ color: BLUE }}>
                              Read story
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* ===== PAGINATION – glass pill style ===== */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full border transition-all ${
                      currentPage === 1
                        ? "opacity-30 pointer-events-none border-gray-200"
                        : "hover:border-[#2196F3] hover:bg-[#2196F3]/5 border-gray-200"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: currentPage === 1 ? MUTE_ON_LIGHT : INK_ON_LIGHT }} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                          p === currentPage
                            ? "bg-[#2196F3] text-white shadow-md shadow-[#2196F3]/25"
                            : "text-[#0E2540] hover:bg-[#2196F3]/10 border border-transparent hover:border-[#2196F3]/20"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-gray-400">…</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium text-[#0E2540] hover:bg-[#2196F3]/10 border border-transparent hover:border-[#2196F3]/20"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full border transition-all ${
                      currentPage === totalPages
                        ? "opacity-30 pointer-events-none border-gray-200"
                        : "hover:border-[#2196F3] hover:bg-[#2196F3]/5 border-gray-200"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" style={{ color: currentPage === totalPages ? MUTE_ON_LIGHT : INK_ON_LIGHT }} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== CTA – glass card with glow ===== */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "#E8ECF0", background: MIST }}>
        <div className="container mx-auto max-w-3xl text-center">
          <div
            className="rounded-3xl p-12 border bg-white/80 backdrop-blur-sm shadow-lg"
            style={{ borderColor: "rgba(255,255,255,0.6)", boxShadow: "0 8px 40px rgba(33,150,243,0.08)" }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${BLUE}12` }}>
              <Sparkles className="w-6 h-6" style={{ color: BLUE }} />
            </div>
            <h3 className={`${display.className} text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>
              Have a story to share?
            </h3>
            <p className="text-sm mt-2 max-w-sm mx-auto" style={{ color: MUTE_ON_LIGHT }}>
              We'd love to feature stories from our community members.
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
        </div>
      </section>

      <Footer />
    </main>
  );
}