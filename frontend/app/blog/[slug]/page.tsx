// frontend/src/app/blog/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { format } from "date-fns";
import {
  Calendar,
  User,
  ArrowLeft,
  Play,
  Clock,
  Tag,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { ShareButtons } from "./ShareButtons";
import { SaveButton } from "./SaveButton";

// ============================================================
// FONTS – same as homepage and signal detail
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
// DESIGN TOKENS – mirror homepage & signal
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// CATEGORIES (unchanged)
// ============================================================
const CATEGORIES = [
  { value: "all", label: "All Posts", color: "bg-gray-100 text-gray-700" },
  { value: "goats", label: "Goats", color: "bg-emerald-100 text-emerald-700" },
  { value: "maize", label: "Maize", color: "bg-amber-100 text-amber-700" },
  { value: "beekeeping", label: "Beekeeping", color: "bg-yellow-100 text-yellow-700" },
  { value: "kids", label: "Youth", color: "bg-blue-100 text-blue-700" },
  { value: "events", label: "Events", color: "bg-purple-100 text-purple-700" },
  { value: "news", label: "News", color: "bg-rose-100 text-rose-700" },
  { value: "general", label: "General", color: "bg-gray-100 text-gray-700" },
];

// ============================================================
// VIDEO EMBED (unchanged)
// ============================================================
function getVideoEmbedUrl(url: string) {
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

// ============================================================
// DATA FETCHING (unchanged – server component)
// ============================================================
async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${API_URL}/items/posts?filter[slug][_eq]=${slug}&filter[status][_eq]=published`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0] || null;
  } catch (error) {
    return null;
  }
}

// ============================================================
// MAIN PAGE COMPONENT (server component – keep async)
// ============================================================
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const videoEmbedUrl = post.video_url ? getVideoEmbedUrl(post.video_url) : null;
  const readingTime = Math.ceil((post.content?.length || 500) / 1000);
  const category = CATEGORIES.find((c) => c.value === post.category);

  return (
    <main
      className={`${display.variable} ${mono.variable} ${serif.variable} min-h-screen bg-white font-sans antialiased selection:bg-[#2196F3]/30`}
    >
      <Navigation />

      {/* ===== FLOATING GLASS CHIP – same as signal detail ===== */}
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
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to blog</span>
          </Link>
          <span className={`${mono.className} text-[10px] tracking-[0.15em] uppercase text-white/50 hidden sm:block`}>
            {readingTime} min read
          </span>
        </div>
      </div>

      {/* ===== HERO – with top padding and rounded corners (mirror signal) ===== */}
      <div className="relative w-full pt-6 md:pt-8 px-6 md:px-14">
        <div className="relative w-full aspect-[21/9] max-h-[70vh] min-h-[400px] overflow-hidden rounded-3xl shadow-2xl">
          {post.featured_image ? (
            <img
              src={`${API_URL}/assets/${post.featured_image}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#0E2540] flex items-center justify-center text-white/20">
              <span className={`${display.className} text-4xl`}>📖</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-[#060B14]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060B14]/40 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10 px-8 md:px-12 pb-10 md:pb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && category && (
                <span
                  className={`${mono.className} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.08em] uppercase bg-blue-500/30 backdrop-blur-sm text-blue-200 border border-white/10`}
                >
                  <Tag className="w-3 h-3" />
                  {category.label}
                </span>
              )}
              <span className={`${mono.className} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.08em] uppercase bg-white/10 backdrop-blur-sm text-white/60 border border-white/5`}>
                <Clock className="w-3 h-3" />
                {readingTime} min read
              </span>
            </div>
            <h1
              className={`${display.className} text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white tracking-tight leading-[1.05] max-w-4xl drop-shadow-xl`}
            >
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-base shrink-0 border-2 border-white/20"
                style={{ background: `linear-gradient(135deg, ${BLUE}, ${SKY})` }}
              >
                {post.author ? post.author.charAt(0).toUpperCase() : "Y"}
              </div>
              <div>
                <div className="text-base font-medium text-white">{post.author || "YPA Team"}</div>
                <div className={`${mono.className} flex items-center gap-3 text-xs text-white/50`}>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.published_at ? format(new Date(post.published_at), "MMMM d, yyyy") : "Recent"}
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
          {/* ===== VIDEO EMBED ===== */}
          {videoEmbedUrl && (
            <div className="relative rounded-3xl overflow-hidden bg-[#0A1628] mb-12 shadow-xl">
              <div className="aspect-video">
                <iframe
                  src={videoEmbedUrl}
                  title={post.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Play className="w-3.5 h-3.5 text-white/60" />
                <span className={`${mono.className} text-white/60 text-[10px] font-medium`}>Video</span>
              </div>
            </div>
          )}

          {/* ===== GALLERY IMAGES ===== */}
          {post.gallery_images && Array.isArray(post.gallery_images) && post.gallery_images.length > 0 && (
            <div className="mb-12">
              <h3
                className={`${mono.className} text-[11px] tracking-[0.2em] uppercase mb-4 flex items-center gap-2`}
                style={{ color: MUTE_ON_LIGHT }}
              >
                <span className="w-8 h-px" style={{ background: "#E8ECF0" }} />
                Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {post.gallery_images.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-[#F5F9FF] hover:shadow-lg transition-shadow group"
                  >
                    <img
                      src={`${API_URL}/assets/${image}`}
                      alt={`${post.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CONTENT – with serif body (mirror signal) ===== */}
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
              dangerouslySetInnerHTML={{ __html: post.content }}
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

          {/* ===== SHARE & SAVE ===== */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ShareButtons slug={post.slug} title={post.title} />
            <SaveButton slug={post.slug} />
          </div>

          {/* ===== RELATED CONTENT CTA ===== */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: "#E8ECF0" }}>
            <div
              className="rounded-3xl p-8 border"
              style={{ borderColor: "#E8ECF0", background: MIST }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className={`${display.className} text-lg font-medium`} style={{ color: INK_ON_LIGHT }}>
                    Enjoyed this article?
                  </h3>
                  <p className="text-sm" style={{ color: MUTE_ON_LIGHT }}>
                    Explore more stories from Youth Platform Africa
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 flex-shrink-0"
                  style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
                >
                  Browse all posts
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* ===== MORE IN CATEGORY ===== */}
          {post.category && (
            <div className="mt-10 pt-8 border-t" style={{ borderColor: "#E8ECF0" }}>
              <div className="flex items-center justify-between">
                <h4 className={`${display.className} text-lg font-medium`} style={{ color: INK_ON_LIGHT }}>
                  More in{" "}
                  <span style={{ color: BLUE }}>{category?.label || post.category}</span>
                </h4>
                <Link
                  href={`/blog?category=${post.category}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:gap-2.5"
                  style={{ color: BLUE }}
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}