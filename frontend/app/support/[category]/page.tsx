"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Clock,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Users,
  Briefcase,
  CreditCard,
  Shield,
  Headphones,
  Mail,
  MessageCircle,
} from "lucide-react";

// ============================================================
// FONTS + TOKENS
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
const BLUE = "#00AEEF";
const BLUE_LIGHT = "#33C1F5";
const GOLD = "#F0B429";
const NAVY = "#0E2540";
const INK = "#111111";
const MIST = "#F6F8FA";
const MUTE = "#5B6B7A";
const POSITIVE = "#34D399";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// CATEGORY CONFIG
// ============================================================
const CATEGORY_CONFIG: Record<string, { icon: any; color: string; label: string; description: string }> = {
  "general": {
    icon: HelpCircle,
    color: BLUE,
    label: "General Help",
    description: "Common questions and answers about YPA",
  },
  "membership": {
    icon: Users,
    color: BLUE_LIGHT,
    label: "Membership",
    description: "Join, renew, or manage your membership",
  },
  "programmes": {
    icon: Briefcase,
    color: GOLD,
    label: "Programmes",
    description: "Goats, Maize, SACCO & more",
  },
  "payments": {
    icon: CreditCard,
    color: POSITIVE,
    label: "Payments & Fees",
    description: "Billing, payments, and refunds",
  },
  "security": {
    icon: Shield,
    color: "#F59E0B",
    label: "Security & Privacy",
    description: "Account security and data privacy",
  },
  "technical": {
    icon: Headphones,
    color: "#EF4444",
    label: "Technical Support",
    description: "Website, app, and technical issues",
  },
};

// ============================================================
// DATA FETCHING
// ============================================================
async function getCategoryArticles(category: string) {
  // ✅ FIX: Return empty array if category is undefined or empty
  if (!category || category === 'undefined') {
    console.warn('Category is undefined or empty, returning empty array');
    return [];
  }
  
  try {
    const encodedCategory = encodeURIComponent(category);
    const res = await fetch(
      `${API_URL}/items/support_articles?filter[category][_eq]=${encodedCategory}&filter[status][_eq]=published&sort[]=-featured&sort[]=-created_at`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      console.error(`Failed to fetch articles for category: ${category}`, res.status);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return [];
  }
}

// ============================================================
// CUSTOM ICONS
// ============================================================
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ FIX: Check if category exists, redirect if not
  useEffect(() => {
    if (!categorySlug || categorySlug === 'undefined') {
      router.push('/support');
      return;
    }
  }, [categorySlug, router]);

  // ✅ FIX: Get config, show error if category not found
  const config = CATEGORY_CONFIG[categorySlug];
  
  if (!config || !categorySlug || categorySlug === 'undefined') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8FA]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "#111111" }}>Category Not Found</h1>
          <p className="text-gray-600 mb-6">The support category you're looking for doesn't exist.</p>
          <Link href="/support" className="text-[#00AEEF] hover:underline font-medium">← Back to Support</Link>
        </div>
      </div>
    );
  }

  const Icon = config.icon;
  const color = config.color;
  const label = config.label;
  const description = config.description;

  // ✅ FIX: Only fetch if we have a valid label
  useEffect(() => {
    const fetchData = async () => {
      if (!label || label === 'undefined') {
        setLoading(false);
        return;
      }
      const data = await getCategoryArticles(label);
      setArticles(data);
      setLoading(false);
    };
    fetchData();
  }, [label]);

  const filteredArticles = articles.filter((article) =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen bg-white overflow-x-hidden font-sans`}>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-14 overflow-hidden" style={{ background: NAVY }}>
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <motion.div
          className="absolute top-[-25%] right-[-8%] w-[560px] h-[560px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${BLUE}1c` }}
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative container mx-auto max-w-4xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/support"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Support
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `${color}25` }}
              >
                <Icon className="w-7 h-7" style={{ color }} />
              </div>
              <div>
                <h1 className={`${display.className} text-3xl md:text-4xl font-medium text-white`}>
                  {label}
                </h1>
                <p className="text-white/50 text-sm mt-1">{description}</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl mt-6">
              <input
                type="text"
                placeholder={`Search in ${label}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-2xl text-white bg-white/10 backdrop-blur-sm border border-white/20 focus:border-white/40 focus:outline-none transition-all placeholder:text-white/30"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>

            <div className="mt-4 text-sm text-white/30">
              {articles.length} articles available
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles List */}
      <section className="px-6 md:px-14 py-12">
        <div className="container mx-auto max-w-4xl">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-[#F6F8FA] rounded-2xl">
              <Search className="w-12 h-12 mx-auto text-[#5B6B7A] opacity-30" />
              <p className="text-[#5B6B7A] mt-4">No articles found in this category.</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-sm font-medium"
                  style={{ color: BLUE }}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <Link href={`/support/${article.slug}`}>
                    <div
                      className="group p-5 bg-white rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                      style={{ borderColor: "#E8ECF0" }}
                    >
                      <div className="flex items-start gap-4">
                        {article.featured && (
                          <div
                            className="w-1 h-12 rounded-full shrink-0"
                            style={{ background: GOLD }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-medium text-[#111111] group-hover:text-[#00AEEF] transition-colors">
                              {article.title}
                            </h3>
                            {article.featured && (
                              <span
                                className="text-[9px] font-medium px-2 py-0.5 rounded-full shrink-0"
                                style={{ background: `${GOLD}15`, color: GOLD }}
                              >
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#5B6B7A] mt-1 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-[#5B6B7A]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.read_time || "3 min read"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#5B6B7A]" />
                            <span>
                              {article.created_at ? new Date(article.created_at).toLocaleDateString() : "Recent"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#5B6B7A] group-hover:text-[#00AEEF] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-14 py-16" style={{ background: MIST }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-3xl text-center"
        >
          <h3 className={`${display.className} text-xl font-medium`} style={{ color: INK }}>
            Can't find what you're looking for?
          </h3>
          <p className="text-[#5B6B7A] text-sm mt-2">
            Our support team is ready to help with any questions you may have.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
              style={{ background: BLUE }}
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </Link>
            <a
              href={`https://wa.me/256700000000`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}