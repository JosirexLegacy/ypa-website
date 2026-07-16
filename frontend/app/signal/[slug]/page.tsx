"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { format } from "date-fns";
import { Calendar, ArrowLeft, Clock, Tag, ArrowUpRight, Share2, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect, use } from "react";

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
const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

// ============================================================
// DESIGN TOKENS
// ============================================================
const INK = "#060B14";
const BLUE = "#2196F3";
const SKY = "#7EC8FF";
const MUTE_ON_LIGHT = "#5B6B7A";
const MIST = "#F6F8FA";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// FALLBACK ARTICLES
// ============================================================
function getFallbackArticles() {
  return [
    {
      title: "How 130,000 goats get tracked without losing a single one",
      description: "Inside the logistics behind YPA's livestock operation.",
      image: "https://images.unsplash.com/photo-1535268647677-300d0a4c3b7b?w=1600&q=80",
      tag: "Operations",
      readTime: "3 min",
      slug: "how-130000-goats-get-tracked",
      big: true,
      content: "<p>This is a detailed article about how YPA tracks 130,000 goats using a combination of ear tags, mobile tracking, and a centralised ledger. Every goat is monitored from birth to market, ensuring 95% success rate.</p><p>The system has been refined over a decade of fieldwork in the Mubende region.</p>",
      date: new Date().toISOString(),
      author: "YPA Team",
    },
    {
      title: "Why contract farming changes the math for a smallholder",
      description: "Guaranteed off-take, explained plainly.",
      image: "https://images.unsplash.com/photo-1593250481214-81611f9bca0f?w=1600&q=80",
      tag: "Sustainability",
      readTime: "4 min",
      slug: "why-contract-farming-changes-the-math",
      big: false,
      content: "<p>Contract farming removes the uncertainty of market prices. Farmers know exactly what they'll earn before they plant, allowing them to invest in better inputs and plan for the future.</p><p>YPA's maize programme offers guaranteed off-take at a fixed price, with average returns of 3.0×.</p>",
      date: new Date().toISOString(),
      author: "YPA Team",
    },
    {
      title: "Twelve branches, one ledger",
      description: "How YPA SACCO keeps every member's savings visible.",
      image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=1600&q=80",
      tag: "Finance",
      readTime: "5 min",
      slug: "twelve-branches-one-ledger",
      big: false,
      content: "<p>YPA SACCO operates 12 branches across Uganda, all connected to a single digital ledger. Members can access their savings from any branch, and loans are tailored to the agricultural cycle.</p><p>Since 2014, the SACCO has grown to over 1,000 members with a policy of zero hidden fees.</p>",
      date: new Date().toISOString(),
      author: "YPA Team",
    },
  ];
}

// ============================================================
// CLIENT COMPONENT: Image with fade-in & onError fallback
// ============================================================
function ArticleImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0E2540]">
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-1000 ${
          loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setImgSrc(fallback)}
      />
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function SignalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(
          `${API_URL}/items/signal_articles?filter[slug][_eq]=${slug}&filter[status][_eq]=published`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setArticle(data.data[0]);
        } else {
          const fallback = getFallbackArticles().find(a => a.slug === slug);
          if (fallback) setArticle(fallback);
          else notFound();
        }
      } catch (_) {
        const fallback = getFallbackArticles().find(a => a.slug === slug);
        if (fallback) setArticle(fallback);
        else notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <main className={`${display.variable} ${mono.variable} ${serif.variable} min-h-screen bg-white`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-[3px] rounded-full animate-spin" style={{ borderColor: "#E3F2FD", borderTopColor: BLUE }} />
        </div>
        <Footer />
      </main>
    );
  }

  if (!article) {
    notFound();
  }

  const readingTime = Math.ceil((article.content?.length || 500) / 1000);
  const imageUrl = article.image?.startsWith("http")
    ? article.image
    : `${API_URL}/assets/${article.image}`;
  const fallbackImage = "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=1600&q=80";

  return (
    <main
      className={`${display.variable} ${mono.variable} ${serif.variable} min-h-screen bg-white antialiased`}
    >
      <Navigation />

      {/* ===== FLOATING GLASS CHIP – centered, pill shape, with glow ===== */}
      <div className="sticky top-24 z-30 flex justify-center px-4">
        <div
          className="inline-flex items-center justify-between w-full max-w-3xl px-6 py-3 rounded-full transition-all duration-300"
          style={{
            background: "rgba(14,37,64,0.65)",
            backdropFilter: "blur(20px) saturate(1.3)",
            boxShadow: "0 8px 40px rgba(33,150,243,0.30), inset 0 1px 0 rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Link
            href="/#signal"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Inside YPA</span>
          </Link>
          <span className={`${mono.className} text-[10px] tracking-[0.15em] uppercase text-white/50 hidden sm:block`}>
            {readingTime} min read
          </span>
        </div>
      </div>

      {/* ===== HERO – with top padding and rounded corners ===== */}
      <div className="relative w-full pt-6 md:pt-8 px-6 md:px-14">
        <div className="relative w-full aspect-[21/9] max-h-[70vh] min-h-[400px] overflow-hidden rounded-3xl shadow-2xl">
          <ArticleImage src={imageUrl} alt={article.title} fallback={fallbackImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-[#060B14]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060B14]/40 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10 px-8 md:px-12 pb-10 md:pb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`${mono.className} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.08em] uppercase bg-blue-500/30 backdrop-blur-sm text-blue-200 border border-white/10`}>
                <Tag className="w-3 h-3" />
                {article.tag}
              </span>
              <span className={`${mono.className} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.08em] uppercase bg-white/10 backdrop-blur-sm text-white/60 border border-white/5`}>
                <Clock className="w-3 h-3" />
                {article.readTime || `${readingTime} min read`}
              </span>
            </div>
            <h1 className={`${display.className} text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white tracking-tight leading-[1.05] max-w-4xl drop-shadow-xl`}>
              {article.title}
            </h1>
            <div className="flex items-center gap-4 mt-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-base shrink-0 border-2 border-white/20"
                style={{ background: `linear-gradient(135deg, ${BLUE}, ${SKY})` }}
              >
                {article.author ? article.author.charAt(0).toUpperCase() : "Y"}
              </div>
              <div>
                <div className="text-base font-medium text-white">{article.author || "YPA Team"}</div>
                <div className={`${mono.className} flex items-center gap-3 text-xs text-white/50`}>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date ? format(new Date(article.date), "MMMM d, yyyy") : "Recent"}
                  </span>
                  <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ARTICLE CONTENT ===== */}
      <article className="px-6 md:px-14 py-16 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <div
            className={`${serif.className} prose prose-lg max-w-none
              prose-headings:font-sans prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#0E2540]
              prose-h1:text-5xl prose-h1:mt-14 prose-h1:mb-8
              prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-100
              prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-5
              prose-h4:text-2xl prose-h4:mt-8 prose-h4:mb-4
              prose-p:text-[19px] prose-p:leading-[1.9] prose-p:mb-7 prose-p:text-[#1E2A3A] prose-p:font-light
              prose-strong:font-semibold prose-strong:text-[#0E2540]
              prose-a:text-[#2196F3] hover:prose-a:underline
              prose-ul:text-[19px] prose-ul:leading-[1.9] prose-ul:mb-7 prose-ul:pl-7 prose-ul:text-[#1E2A3A]
              prose-li:text-[19px] prose-li:leading-[1.9] prose-li:text-[#1E2A3A] prose-li:marker:text-[#2196F3]
              prose-blockquote:border-l-4 prose-blockquote:border-l-[#2196F3] prose-blockquote:bg-[#F5F9FF] prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:rounded-2xl prose-blockquote:text-[20px] prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:text-[#0E2540] prose-blockquote:shadow-sm
              prose-blockquote:mx-0 prose-blockquote:my-10
              prose-blockquote:before:content-none prose-blockquote:after:content-none
              prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-10
              prose-hr:my-16 prose-hr:border-gray-200
              [&_*]:text-[#1E2A3A]
              [&_h1]:!text-[#0E2540] [&_h2]:!text-[#0E2540] [&_h3]:!text-[#0E2540] [&_h4]:!text-[#0E2540]
              [&_strong]:!text-[#0E2540]
              [&_p]:!text-[#1E2A3A]
              [&_li]:!text-[#1E2A3A]
              [&_blockquote]:!text-[#0E2540]`}
            style={
              {
                "--tw-prose-body": "#1E2A3A",
                "--tw-prose-bold": "#0E2540",
                "--tw-prose-headings": "#0E2540",
                "--tw-prose-links": BLUE,
                "--tw-prose-bullets": BLUE,
                "--tw-prose-quotes": "#0E2540",
                "--tw-prose-quote-borders": BLUE,
              } as React.CSSProperties
            }
          >
            <div
              className="[&_blockquote]:bg-[#F5F9FF] [&_p]:text-[#1E2A3A] [&_span]:text-[#1E2A3A] [&_li]:text-[#1E2A3A]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* ===== DIVIDER ===== */}
          <div className="relative my-20">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "#E8ECF0" }} />
            </div>
            <div className="relative flex justify-center">
              <span className={`${mono.className} px-6 bg-white text-sm tracking-[0.4em]`} style={{ color: `${BLUE}40` }}>
                ✦ ✦ ✦
              </span>
            </div>
          </div>

          {/* ===== SHARE & NAVIGATION (with better buttons) ===== */}
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className={`${mono.className} text-xs tracking-[0.15em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                Share
              </span>
              <button
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.share) {
                    navigator.share({ title: article.title, url });
                  } else {
                    navigator.clipboard.writeText(url);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="p-3 rounded-full border transition-all hover:shadow-md hover:scale-105 active:scale-95"
                style={{ borderColor: "#E8ECF0" }}
                aria-label="Share article"
              >
                <Share2 className="w-5 h-5" style={{ color: MUTE_ON_LIGHT }} />
              </button>
            </div>
            {/* ✅ "Browse all stories" now points to /signal */}
            <Link
              href="/signal"
              className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3 group"
              style={{ color: BLUE }}
            >
              <span>Browse all stories</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* ===== BACK TO TOP ===== */}
          <div className="mt-16 pt-10 border-t" style={{ borderColor: "#E8ECF0" }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-sm transition-all hover:gap-3 group"
              style={{ color: MUTE_ON_LIGHT }}
            >
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}