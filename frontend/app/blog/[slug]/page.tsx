// frontend/app/blog/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter, Source_Sans_3 } from "next/font/google";
import { format } from "date-fns";
import {
  Calendar,
  User,
  ArrowLeft,
  Play,
  Clock,
  Tag,
  ChevronRight,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Eye,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  X,
  Send,
  Mail,
  Award,
  Sparkles
} from "lucide-react";
import { ShareButtons } from "./ShareButtons";
import { SaveButton } from "./SaveButton";
import { Comments } from "./Comments";
import { Metadata } from "next";

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
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-source-sans",
});

// ============================================================
// YPA BRAND COLORS
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_LIGHT = "#33C1F5";
const YPA_BLUE_SOFT = "#E6F8FD";
const YPA_GOLD = "#F0B429";
const NAVY = "#0E2540";
const NAVY_SOFT = "#153455";
const INK = "#0A1628";
const MIST = "#F6F8FA";
const INK_ON_LIGHT = "#111111";
const MUTE_ON_LIGHT = "#5B6B7A";
const TEXT_PRIMARY = "#0A1628";
const TEXT_SECONDARY = "#2D3748";
const BORDER_LIGHT = "#E8ECF0";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// TYPES
// ============================================================
interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
  role?: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  author?: string;
  author_id?: number;
  published_at?: string;
  featured?: boolean;
  tags?: string[] | null;
  video_url?: string;
  gallery_images?: any[];
}

// ============================================================
// CATEGORIES
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
// VIDEO EMBED
// ============================================================
function getVideoEmbedUrl(url: string) {
  if (!url) return null;
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
// HELPERS
// ============================================================
function getImageUrl(image: string | undefined): string | null {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${API_URL}/assets/${image}`;
}

// ============================================================
// DATA FETCHING
// ============================================================
async function getPost(slug: string): Promise<Post | null> {
  try {
    // Fetch post
    const res = await fetch(
      `${API_URL}/items/posts?filter[slug][_eq]=${slug}&filter[status][_eq]=published`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getAuthor(authorId: number): Promise<Author | null> {
  if (!authorId) return null;
  try {
    const res = await fetch(
      `${API_URL}/items/authors/${authorId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
}

async function getRelatedPosts(category: string | undefined, currentId: number) {
  if (!category) return [];
  try {
    const res = await fetch(
      `${API_URL}/items/posts?filter[status][_eq]=published&filter[category][_eq]=${category}&filter[id][_neq]=${currentId}&sort[]=-published_at&limit=3`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// ============================================================
// METADATA FOR SEO
// ============================================================
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const imageUrl = getImageUrl(post.featured_image) || `${API_URL}/assets/default-og-image.jpg`;
  const authorName = post.author || "YPA Team";
  const tags = Array.isArray(post.tags) ? post.tags.join(", ") : post.category || "YPA, Youth Platform Africa, agribusiness";

  return {
    title: post.title,
    description: post.excerpt || post.title,
    keywords: tags,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: `https://ypa-website-b3uh-ashy.vercel.app/blog/${slug}`,
      siteName: "Youth Platform Africa",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.published_at,
      authors: [authorName],
      tags: Array.isArray(post.tags) ? post.tags : [post.category || "YPA"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.title,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://ypa-website-b3uh-ashy.vercel.app/blog/${slug}`,
    },
  };
}

// ============================================================
// MAIN PAGE COMPONENT
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
  const relatedPosts = await getRelatedPosts(post.category, post.id);

  // ✅ Fetch author separately using author_id
  const author = post.author_id ? await getAuthor(post.author_id) : null;
  const authorName = author?.name || post.author || "YPA Team";
  const authorInitial = authorName.charAt(0).toUpperCase();

  // ✅ Get featured image URL
  const featuredImageUrl = getImageUrl(post.featured_image);

  return (
    <main
      className={`${display.variable} ${mono.variable} ${inter.variable} ${sourceSans.variable} min-h-screen bg-white font-sans antialiased selection:bg-[#00AEEF]/30`}
    >
      <Navigation />

      {/* ===== FLOATING GLASS NAV ===== */}
      <div className="sticky top-20 z-30 flex justify-center px-4 py-3">
        <div
          className="inline-flex items-center justify-between w-full max-w-3xl px-4 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-300"
          style={{
            background: "rgba(14,37,64,0.85)",
            backdropFilter: "blur(20px) saturate(1.3)",
            boxShadow: "0 8px 40px rgba(0,174,239,0.25), inset 0 1px 0 rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-white/80 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
            <span className={`${inter.className} font-light`}>Back to blog</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <span className={`${mono.className} text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-white/50 hidden sm:block`}>
              {readingTime} min read
            </span>
            <SaveButton slug={post.slug} />
          </div>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <div className="relative w-full px-5 md:px-14">
        <div className="relative w-full aspect-[21/9] max-h-[70vh] min-h-[300px] md:min-h-[400px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
          {featuredImageUrl ? (
            <img
              src={featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('❌ Image failed to load:', featuredImageUrl);
                e.currentTarget.src = 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=1200&q=80';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0E2540] to-[#153455] flex items-center justify-center text-white/20">
              <span className={`${display.className} text-4xl`}>📖</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-[#060B14]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060B14]/40 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10 px-5 md:px-10 pb-6 md:pb-10">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
              {post.category && category && (
                <span
                  className={`${mono.className} inline-flex items-center gap-1 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-semibold tracking-[0.08em] uppercase bg-[#00AEEF]/30 backdrop-blur-sm text-[#33C1F5] border border-white/10`}
                >
                  <Tag className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  {category.label}
                </span>
              )}
              <span className={`${mono.className} inline-flex items-center gap-1 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-semibold tracking-[0.08em] uppercase bg-white/10 backdrop-blur-sm text-white/60 border border-white/5`}>
                <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                {readingTime} min read
              </span>
              {post.featured && (
                <span className={`${mono.className} inline-flex items-center gap-1 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-semibold tracking-[0.08em] uppercase bg-[#F0B429]/30 backdrop-blur-sm text-[#F0B429] border border-white/10`}>
                  <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  Featured
                </span>
              )}
            </div>
            <h1
              className={`${display.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white tracking-tight leading-[1.05] max-w-4xl drop-shadow-xl`}
            >
              {post.title}
            </h1>
            <div className="flex items-center gap-3 md:gap-4 mt-3 md:mt-6">
              <div
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-medium text-xs md:text-sm shrink-0 border-2 border-white/20"
                style={{ background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_LIGHT})` }}
              >
                {authorInitial}
              </div>
              <div>
                <div className={`${inter.className} text-sm md:text-base font-medium text-white`}>
                  {authorName}
                  {author?.role && (
                    <span className="ml-2 text-xs font-light text-white/50">· {author.role}</span>
                  )}
                </div>
                <div className={`${mono.className} flex items-center gap-2 text-[10px] md:text-xs text-white/50`}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "Recent"}
                  </span>
                  <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ARTICLE CONTENT ===== */}
      <article className="px-5 md:px-14 py-10 md:py-16">
        <div className="container mx-auto max-w-3xl">
          {/* ===== VIDEO EMBED ===== */}
          {videoEmbedUrl && (
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-[#0A1628] mb-8 md:mb-12 shadow-xl">
              <div className="aspect-video">
                <iframe
                  src={videoEmbedUrl}
                  title={post.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 md:px-3 py-1 md:py-1.5 rounded-full">
                <Play className="w-3 h-3 md:w-3.5 md:h-3.5 text-white/60" />
                <span className={`${mono.className} text-white/60 text-[8px] md:text-[10px] font-medium`}>Video</span>
              </div>
            </div>
          )}

          {/* ===== GALLERY IMAGES ===== */}
          {post.gallery_images && Array.isArray(post.gallery_images) && post.gallery_images.length > 0 && (
            <div className="mb-8 md:mb-12">
              <h3
                className={`${mono.className} text-[10px] md:text-[11px] tracking-[0.2em] uppercase mb-3 md:mb-4 flex items-center gap-2`}
                style={{ color: MUTE_ON_LIGHT }}
              >
                <span className="w-8 h-px" style={{ background: "#E8ECF0" }} />
                Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {post.gallery_images.map((image: any, index: number) => {
                  const imageUrl = typeof image === 'string' ? getImageUrl(image) : null;
                  return (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-[#F5F9FF] hover:shadow-lg transition-shadow group"
                    >
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={`${post.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=400&q=80';
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== CONTENT ===== */}
          <div
            className={`${sourceSans.className} prose prose-base md:prose-lg max-w-none
              prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#0A1628]
              prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mt-12 prose-h1:mb-6
              prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-100
              prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-8 prose-h3:mb-4
              prose-h4:text-xl md:prose-h4:text-2xl prose-h4:mt-6 prose-h4:mb-3
              prose-p:text-[17px] md:prose-p:text-[19px] prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-[#1E2A3A] prose-p:font-light
              prose-strong:font-semibold prose-strong:text-[#0A1628]
              prose-a:text-[#00AEEF] hover:prose-a:underline prose-a:font-medium
              prose-ul:text-[17px] md:prose-ul:text-[19px] prose-ul:leading-[1.8] prose-ul:mb-6 prose-ul:pl-6 prose-ul:text-[#1E2A3A]
              prose-li:text-[17px] md:prose-li:text-[19px] prose-li:leading-[1.8] prose-li:text-[#1E2A3A] prose-li:marker:text-[#00AEEF]
              prose-blockquote:border-l-4 prose-blockquote:border-l-[#00AEEF] prose-blockquote:bg-[#E6F8FD] prose-blockquote:px-5 md:prose-blockquote:px-8 prose-blockquote:py-4 md:prose-blockquote:py-6 prose-blockquote:rounded-2xl prose-blockquote:text-[18px] md:prose-blockquote:text-[20px] prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:text-[#0A1628] prose-blockquote:shadow-sm
              prose-blockquote:mx-0 prose-blockquote:my-8
              prose-blockquote:before:content-none prose-blockquote:after:content-none
              prose-img:rounded-2xl md:prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-8
              prose-hr:my-12 prose-hr:border-gray-200
              [&_*]:text-[#1E2A3A]
              [&_h1]:!text-[#0A1628] [&_h2]:!text-[#0A1628] [&_h3]:!text-[#0A1628] [&_h4]:!text-[#0A1628]
              [&_strong]:!text-[#0A1628]
              [&_p]:!text-[#1E2A3A]
              [&_li]:!text-[#1E2A3A]
              [&_blockquote]:!text-[#0A1628]`}
            style={
              {
                "--tw-prose-body": "#1E2A3A",
                "--tw-prose-bold": "#0A1628",
                "--tw-prose-headings": "#0A1628",
                "--tw-prose-links": YPA_BLUE,
                "--tw-prose-bullets": YPA_BLUE,
                "--tw-prose-quotes": "#0A1628",
                "--tw-prose-quote-borders": YPA_BLUE,
              } as React.CSSProperties
            }
          >
            <div
              className="[&_blockquote]:bg-[#E6F8FD] [&_p]:text-[#1E2A3A] [&_span]:text-[#1E2A3A] [&_li]:text-[#1E2A3A]"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>

          {/* ===== TAGS ===== */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-2 border-t pt-6 md:pt-8" style={{ borderColor: "#E8ECF0" }}>
              <span className={`${mono.className} text-[10px] tracking-[0.15em] uppercase text-[#5B6B7A] mr-2`}>
                Tags:
              </span>
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className={`${inter.className} px-3 py-1 rounded-full text-xs font-medium transition-all hover:bg-[#00AEEF]/10 hover:text-[#00AEEF]`}
                  style={{ background: "#F6F8FA", color: "#5B6B7A" }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* ===== SHARE & SAVE ===== */}
          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4 mt-8 md:mt-10 pt-6 md:pt-8 border-t" style={{ borderColor: "#E8ECF0" }}>
            <ShareButtons slug={post.slug} title={post.title} />
            <SaveButton slug={post.slug} />
          </div>

          {/* ===== AUTHOR BIO ===== */}
          {author && (
            <div className="mt-10 overflow-hidden rounded-2xl border" style={{ borderColor: "#E8ECF0" }}>
              <div className="relative">
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${YPA_BLUE}, ${YPA_BLUE_LIGHT}, ${YPA_GOLD})` }} />
                
                <div className="p-6 md:p-8" style={{ background: MIST }}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-medium shrink-0"
                      style={{ background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_LIGHT})` }}
                    >
                      {authorInitial}
                    </div>
                    <div>
                      <div className={`${inter.className} text-base md:text-lg font-semibold`} style={{ color: TEXT_PRIMARY }}>
                        Written by {author.name}
                      </div>
                      {author.bio && (
                        <p className={`${sourceSans.className} text-sm font-light leading-relaxed`} style={{ color: MUTE_ON_LIGHT }}>
                          {author.bio}
                        </p>
                      )}
                      {author.role && (
                        <p className={`${mono.className} text-xs font-medium mt-1`} style={{ color: YPA_BLUE }}>
                          {author.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== RELATED POSTS ===== */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t" style={{ borderColor: "#E8ECF0" }}>
              <h3 className={`${display.className} text-xl md:text-2xl font-medium mb-4 md:mb-6`} style={{ color: INK_ON_LIGHT }}>
                Related Posts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {relatedPosts.map((related: any) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group block rounded-xl md:rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ borderColor: "#E8ECF0", background: "white" }}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#F6F8FA]">
                      {related.featured_image ? (
                        <img
                          src={getImageUrl(related.featured_image) || ''}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=400&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#5B6B7A]/30">
                          <span className="text-3xl">📄</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h4 className={`${inter.className} text-sm md:text-base font-medium line-clamp-2 group-hover:text-[#00AEEF] transition-colors`} style={{ color: INK_ON_LIGHT }}>
                        {related.title}
                      </h4>
                      <p className={`${inter.className} text-xs text-[#5B6B7A] mt-1 line-clamp-1 font-light`}>
                        {related.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ===== COMMENTS SECTION ===== */}
          <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t" style={{ borderColor: "#E8ECF0" }}>
            <Comments postId={post.id} postSlug={post.slug} />
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}