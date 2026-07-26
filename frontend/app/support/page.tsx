"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Users,
  Briefcase,
  CreditCard,
  Shield,
  Headphones,
  ArrowRight,
  Search,
  Clock,
  ChevronRight,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Building,
  Sparkles,
  Zap,
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
const NAVY_SOFT = "#153455";
const INK = "#111111";
const MIST = "#F6F8FA";
const MUTE = "#5B6B7A";
const POSITIVE = "#34D399";
const NEGATIVE = "#EF4444";
const WARNING = "#F59E0B";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// SUPPORT CATEGORIES
// ============================================================
const SUPPORT_CATEGORIES = [
  {
    icon: HelpCircle,
    label: "General Help",
    description: "Common questions and answers about YPA",
    color: BLUE,
    href: "/support/general",
    count: 12,
  },
  {
    icon: Users,
    label: "Membership",
    description: "Join, renew, or manage your membership",
    color: BLUE_LIGHT,
    href: "/support/membership",
    count: 8,
  },
  {
    icon: Briefcase,
    label: "Programmes",
    description: "Goats, Maize, SACCO & more",
    color: GOLD,
    href: "/support/programmes",
    count: 15,
  },
  {
    icon: CreditCard,
    label: "Payments & Fees",
    description: "Billing, payments, and refunds",
    color: POSITIVE,
    href: "/support/payments",
    count: 6,
  },
  {
    icon: Shield,
    label: "Security & Privacy",
    description: "Account security and data privacy",
    color: WARNING,
    href: "/support/security",
    count: 4,
  },
  {
    icon: Headphones,
    label: "Technical Support",
    description: "Website, app, and technical issues",
    color: NEGATIVE,
    href: "/support/technical",
    count: 9,
  },
];

// ============================================================
// DATA FETCHING
// ============================================================
async function getSupportArticles() {
  try {
    const res = await fetch(
      `${API_URL}/items/support_articles?filter[status][_eq]=published&sort[]=-featured&sort[]=-created_at&limit=12`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching support articles:", error);
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
export default function SupportPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await getSupportArticles();
      setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  // Filter articles based on search
  const filteredArticles = articles.filter((article) =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get featured articles
  const featuredArticles = articles.filter((a) => a.featured === true).slice(0, 3);

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

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section className="relative pt-32 pb-20 px-6 md:px-14 overflow-hidden" style={{ background: NAVY }}>
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
        <motion.div
          className="absolute bottom-[-25%] left-[-8%] w-[440px] h-[440px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${BLUE_LIGHT}14` }}
          animate={{ x: [0, -40, 30, 0], y: [0, 30, -40, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative container mx-auto max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className={`${mono.className} inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-white/45 mb-4`}>
              <Sparkles className="w-4 h-4" style={{ color: BLUE_LIGHT }} />
              Help Center
            </span>
            <h1 className={`${display.className} text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.05] tracking-tight`}>
              How can we help you?
            </h1>
            <p className="text-base md:text-lg text-white/50 mt-5 max-w-xl mx-auto font-light leading-relaxed">
              Find answers to your questions, browse our support articles, or get in touch with our team.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mt-8">
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-2xl text-white bg-white/10 backdrop-blur-sm border border-white/20 focus:border-white/40 focus:outline-none transition-all placeholder:text-white/30"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          QUICK CONTACT
      ============================================================ */}
      <section className="px-6 md:px-14 -mt-8 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.a
              href={`https://wa.me/256700000000`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ borderColor: "#25D36644" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#25D36618" }}>
                <WhatsAppIcon />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "#25D366" }}>Chat on WhatsApp</p>
                <p className="text-xs text-[#5B6B7A]">Response within 5 minutes</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-[#5B6B7A]" />
            </motion.a>

            <motion.a
              href="/contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ borderColor: "#E8ECF0" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${BLUE}12` }}>
                <Mail className="w-5 h-5" style={{ color: BLUE }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: INK }}>Send an Email</p>
                <p className="text-xs text-[#5B6B7A]">We reply within 24 hours</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-[#5B6B7A]" />
            </motion.a>

            <motion.a
              href="/branches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ borderColor: "#E8ECF0" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${GOLD}12` }}>
                <Building className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: INK }}>Visit a Branch</p>
                <p className="text-xs text-[#5B6B7A]">12 locations across Uganda</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-[#5B6B7A]" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* ============================================================
          SUPPORT CATEGORIES
      ============================================================ */}
      <section className="px-6 md:px-14 py-20" style={{ background: MIST }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`${display.className} text-2xl md:text-3xl font-medium`} style={{ color: INK }}>
              Browse by Category
            </h2>
            <p className="text-base text-[#5B6B7A] mt-2">Select a category to find relevant articles</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUPPORT_CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={category.href}>
                    <div
                      className="group p-6 rounded-2xl bg-white border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      style={{ borderColor: "#E8ECF0" }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                        style={{ background: `${category.color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium" style={{ color: INK }}>
                          {category.label}
                        </h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${category.color}12`, color: category.color }}>
                          {category.count}
                        </span>
                      </div>
                      <p className="text-sm text-[#5B6B7A] mt-1">{category.description}</p>
                      <div className="flex items-center gap-1 mt-3 text-sm font-medium" style={{ color: BLUE }}>
                        Browse articles
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED ARTICLES
      ============================================================ */}
      {featuredArticles.length > 0 && (
        <section className="px-6 md:px-14 py-20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
                    Featured
                  </span>
                  <h2 className={`${display.className} text-2xl md:text-3xl font-medium mt-1`} style={{ color: INK }}>
                    Popular Support Articles
                  </h2>
                </div>
                <Link href="/support/articles" className="text-sm font-medium" style={{ color: BLUE }}>
                  View all
                  <ArrowRight className="inline-block w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/support/${article.slug}`}>
                    <div
                      className="group p-6 rounded-2xl bg-white border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      style={{ borderColor: "#E8ECF0" }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase"
                          style={{ background: `${BLUE}12`, color: BLUE }}
                        >
                          {article.category || "General"}
                        </div>
                        <Clock className="w-4 h-4 text-[#5B6B7A]" />
                      </div>
                      <h3 className="text-base font-medium text-[#111111] group-hover:text-[#00AEEF] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-[#5B6B7A] mt-2 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center gap-2 mt-4 text-xs text-[#5B6B7A]">
                        <span>{article.read_time || "3 min read"}</span>
                        <span className="w-1 h-1 rounded-full bg-[#5B6B7A]" />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          RECENT ARTICLES
      ============================================================ */}
      {filteredArticles.length > 0 && (
        <section className="px-6 md:px-14 pb-20" style={{ background: MIST }}>
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="pt-12 border-t"
              style={{ borderColor: "#E8ECF0" }}
            >
              <h2 className={`${display.className} text-xl font-medium mb-6`} style={{ color: INK }}>
                {searchTerm ? `Search Results (${filteredArticles.length})` : "Recent Articles"}
              </h2>

              <div className="space-y-3">
                {filteredArticles.slice(0, 8).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <Link href={`/support/${article.slug}`}>
                      <div
                        className="group flex items-center gap-4 p-4 bg-white rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                        style={{ borderColor: "#E8ECF0" }}
                      >
                        <div
                          className="w-2 h-12 rounded-full shrink-0"
                          style={{ background: `linear-gradient(to bottom, ${BLUE}, ${BLUE_LIGHT})` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[#111111] group-hover:text-[#00AEEF] transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#5B6B7A]">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium" style={{ background: `${BLUE}12`, color: BLUE }}>
                              {article.category || "General"}
                            </span>
                            <span>{article.read_time || "3 min read"}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#5B6B7A] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#5B6B7A]">No articles found matching your search.</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-sm font-medium"
                    style={{ color: BLUE }}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ============================================================
          CTA - Still Need Help?
      ============================================================ */}
      <section className="px-6 md:px-14 py-20" style={{ background: NAVY }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-2xl text-center"
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl border flex items-center justify-center" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
            <MessageCircle className="w-6 h-6" style={{ color: BLUE_LIGHT }} />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl font-medium text-white`}>
            Still need help?
          </h2>
          <p className="text-white/40 text-sm mt-2 max-w-md mx-auto font-light">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
              style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
            >
              <Mail className="w-4 h-4" />
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/256700000000`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
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