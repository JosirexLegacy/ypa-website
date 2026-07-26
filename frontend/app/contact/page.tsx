"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  ArrowRight,
  Clock,
  Zap,
  HelpCircle,
  Shield,
  Users,
  Headphones,
  ChevronRight,
  Building,
  Briefcase,
  CreditCard,
  MessageCircle,
} from "lucide-react";

// ============================================================
// CUSTOM SVG ICONS
// ============================================================
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TiktokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.666 7.269v3.515a8.446 8.446 0 01-4.208-1.139v5.027a6.842 6.842 0 11-6.942-6.806v3.488a3.354 3.354 0 102.323 3.193V0h3.208a5.233 5.233 0 004.607 4.743c.517.073 1.011.21 1.012.526z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
const INK = "#111111";
const NAVY = "#0E2540";
const LINE = "#1F3B57";
const BLUE = "#00AEEF";
const BLUE_DARK = "#0099D6";
const BLUE_LIGHT = "#33C1F5";
const BLUE_SOFT = "#E6F8FD";
const GOLD = "#F0B429";
const MIST = "#F6F8FA";
const INK_ON_LIGHT = "#111111";
const MUTE_ON_LIGHT = "#5B6B7A";
const POSITIVE = "#34D399";
const NEGATIVE = "#EF4444";
const WARNING = "#F59E0B";
const WHATSAPP_GREEN = "#25D366";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";
const WHATSAPP_NUMBER = "256700000000"; // Replace with YPA's WhatsApp number
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// ============================================================
// HELPERS
// ============================================================
const NeedsInfo = ({ children = "Add details" }: { children?: string }) => (
  <span
    className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full border border-dashed align-middle ml-2"
    style={{ color: GOLD, borderColor: `${GOLD}88`, background: `${GOLD}0f` }}
  >
    <Zap className="h-2.5 w-2.5" />
    {children}
  </span>
);

// ============================================================
// DATA FETCHING
// ============================================================
async function getContactContent() {
  try {
    const res = await fetch(`${API_URL}/items/contact`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching contact content:", error);
    return null;
  }
}

async function getSupportArticles() {
  try {
    const res = await fetch(`${API_URL}/items/support_articles?filter[status][_eq]=published&sort[]=-featured&sort[]=-created_at&limit=6`, { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching support articles:", error);
    return [];
  }
}

// ============================================================
// GOAT MARK
// ============================================================
const GoatMark = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full opacity-[0.08]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M200 50 C180 50 160 60 150 80 C140 60 120 55 110 70 C100 85 110 100 120 110 C100 115 80 130 70 150 C60 170 55 195 60 220 C65 245 75 265 90 280 C105 295 125 305 145 310 C165 315 185 315 200 310 C215 305 235 295 250 280 C265 265 275 245 280 220 C285 195 280 170 270 150 C260 130 240 115 220 110 C230 100 240 85 230 70 C220 55 200 60 190 80 C180 60 160 50 200 50Z"
      fill={BLUE}
    />
    <path d="M160 70 C155 50 145 35 130 30 C135 45 140 55 150 65" fill={BLUE} />
    <path d="M190 65 C195 45 200 30 210 25 C205 40 200 55 195 65" fill={BLUE} />
    <path d="M145 80 C135 75 125 80 130 90 C135 95 140 90 145 85" fill={BLUE} />
    <path d="M205 80 C215 75 225 80 220 90 C215 95 210 90 205 85" fill={BLUE} />
    <circle cx="170" cy="105" r="4" fill="#fff" opacity="0.6" />
    <circle cx="210" cy="105" r="4" fill="#fff" opacity="0.6" />
    <ellipse cx="190" cy="120" rx="8" ry="5" fill="#fff" opacity="0.3" />
    <path d="M185 125 C183 140 178 155 175 165 C180 160 185 150 188 140" fill={BLUE} />
    <path d="M195 125 C197 140 202 155 205 165 C200 160 195 150 192 140" fill={BLUE} />
  </svg>
);

// ============================================================
// SUPPORT CATEGORIES
// ============================================================
const SUPPORT_CATEGORIES = [
  { 
    icon: HelpCircle, 
    label: "General Help", 
    description: "Common questions and answers",
    color: BLUE,
    href: "/support/general"
  },
  { 
    icon: Users, 
    label: "Membership", 
    description: "Join, renew, or manage your membership",
    color: BLUE_LIGHT,
    href: "/support/membership"
  },
  { 
    icon: Briefcase, 
    label: "Programmes", 
    description: "Goats, Maize, SACCO & more",
    color: GOLD,
    href: "/support/programmes"
  },
  { 
    icon: CreditCard, 
    label: "Payments & Fees", 
    description: "Billing, payments, and refunds",
    color: POSITIVE,
    href: "/support/payments"
  },
  { 
    icon: Shield, 
    label: "Security & Privacy", 
    description: "Account security and data privacy",
    color: WARNING,
    href: "/support/security"
  },
  { 
    icon: Headphones, 
    label: "Technical Support", 
    description: "Website, app, and technical issues",
    color: NEGATIVE,
    href: "/support/technical"
  },
];

// ============================================================
// FAQ ITEMS
// ============================================================
const FAQ_ITEMS = [
  {
    question: "How do I join the Goats Programme?",
    answer: "To join the Goats Programme, contact your nearest YPA branch or fill out the membership form on our website. A YPA representative will guide you through the process, from selecting your goats to signing the contract.",
    category: "Programmes"
  },
  {
    question: "What are the requirements for SACCO membership?",
    answer: "To join YPA SACCO, you need to be a registered member of YPA, have a valid ID, and make an initial deposit of at least UGX 50,000. You'll also need to attend a brief orientation session at your nearest branch.",
    category: "Membership"
  },
  {
    question: "How do I check my SACCO balance?",
    answer: "You can check your SACCO balance through our mobile app, by visiting any YPA branch, or by sending a USSD code *290# from your registered phone number. You'll receive an SMS with your current balance and transaction history.",
    category: "Payments & Fees"
  },
  {
    question: "What happens if my goats get sick?",
    answer: "YPA provides veterinary support for all goats in our programme. Contact your local YPA veterinary officer immediately, and we'll arrange for treatment. All health services are covered under your programme contract.",
    category: "Programmes"
  },
  {
    question: "How do I reset my account password?",
    answer: "To reset your password, click 'Forgot Password' on the login page. You'll receive a password reset link via email. If you don't receive it, check your spam folder or contact our technical support team.",
    category: "Technical Support"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept mobile money (MTN, Airtel, Africell), bank transfers, and cash at our branches. For international payments, we accept wire transfers and major credit cards. All payments are processed securely.",
    category: "Payments & Fees"
  },
];

// ============================================================
// TYPE
// ============================================================
type FormStatus = "idle" | "sending" | "success" | "error";

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ContactPage() {
  const [content, setContent] = useState<any>(null);
  const [supportArticles, setSupportArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "",
  });

  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [contactData, supportData] = await Promise.all([
          getContactContent(),
          getSupportArticles(),
        ]);
        setContent(contactData);
        setSupportArticles(supportData);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setErrorMessage("");

    try {
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || "",
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        category: formData.category || "general",
        status: "new",
      };

      const res = await fetch(`${API_URL}/items/contact_submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        const errorMsg = responseData.errors?.[0]?.message || `Error ${res.status}`;
        throw new Error(errorMsg);
      }

      setFormStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", category: "" });

      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error: any) {
      console.error("Form submission error:", error);
      setFormStatus("error");
      setErrorMessage(error.message || "Failed to send message");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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

  const socialLinks = [
    { icon: FacebookIcon, href: content?.social_facebook || "#", label: "Facebook" },
    { icon: TwitterIcon, href: content?.social_twitter || "#", label: "Twitter" },
    { icon: InstagramIcon, href: content?.social_instagram || "#", label: "Instagram" },
    { icon: LinkedinIcon, href: content?.social_linkedin || "#", label: "LinkedIn" },
    { icon: TiktokIcon, href: content?.social_tiktok || "#", label: "TikTok" },
    { icon: YoutubeIcon, href: content?.social_youtube || "#", label: "YouTube" },
  ];

  const directLines = [
    { icon: Mail, label: "EMAIL", value: content?.email, href: `mailto:${content?.email || ""}` },
    { icon: Phone, label: "PHONE", value: content?.phone, href: `tel:${content?.phone || ""}` },
    { icon: MapPin, label: "OFFICE", value: content?.address, href: content?.google_maps || "#" },
    { icon: Clock, label: "RESPONSE TIME", value: content?.response_time || "Within 24 hours" },
  ];

  const filteredFaqs = activeCategory === "All" 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(item => item.category === activeCategory);

  const faqCategories = ["All", ...new Set(FAQ_ITEMS.map(item => item.category))];

  return (
    <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen bg-white overflow-x-hidden font-sans`}>
      <Navigation />

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section id="hero" ref={heroRef} className="relative pt-32 pb-20 px-6 md:px-14 overflow-hidden min-h-[52vh] flex items-center" style={{ background: NAVY }}>
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
          animate={reduce ? {} : { x: [0, 50, -30, 0], y: [0, -30, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-25%] left-[-8%] w-[440px] h-[440px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${BLUE_LIGHT}14` }}
          animate={reduce ? {} : { x: [0, -40, 30, 0], y: [0, 30, -40, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute right-0 bottom-0 w-[420px] h-[420px] pointer-events-none">
          <div className="absolute inset-0 flex items-end justify-end">
            <GoatMark />
          </div>
        </div>

        <div className="relative container mx-auto max-w-6xl z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="max-w-2xl">
            <div className={`${mono.className} inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-white/45 mb-4`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              </span>
              Live Support — 24/7
            </div>
            
            <h1 className={`${display.className} text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.05] tracking-tight`}>
              {content?.title || "We're here to help"}
              <span
                className="block text-transparent bg-clip-text mt-1"
                style={{ backgroundImage: `linear-gradient(90deg, ${BLUE_LIGHT}, ${BLUE}, ${GOLD})` }}
              >
                Every question answered
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/50 mt-5 max-w-lg font-light leading-relaxed">
              {content?.subtitle || "Reach out to us anytime. Our team is ready to help with anything you need."}
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8">
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all"
                style={{ 
                  background: WHATSAPP_GREEN,
                  boxShadow: `0 20px 40px -12px ${WHATSAPP_GREEN}66`
                }}
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </motion.a>
              <motion.a
                href="#contact-form"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          DIRECT LINES
      ============================================================ */}
      <section className="border-y" style={{ background: NAVY, borderColor: LINE }}>
        <div className="flex items-center gap-3 px-6 md:px-14 pt-4">
          <Zap className="h-3.5 w-3.5" style={{ color: GOLD }} />
          <span className={`${mono.className} text-[10px] tracking-[0.22em] uppercase text-white/40`}>
            Direct lines — no contact form required
          </span>
        </div>
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {directLines.map((d, i) => {
            const Icon = d.icon;
            const isClickable = d.href && d.value;
            const content = (
              <div key={i} className={mono.className}>
                <div className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase text-white/35">
                  <Icon className="h-3 w-3" />
                  {d.label}
                </div>
                <div className="text-sm md:text-base mt-1.5 break-words" style={{ color: d.value ? "#fff" : GOLD }}>
                  {d.value || "—"}
                </div>
              </div>
            );

            if (isClickable) {
              return (
                <motion.a
                  key={i}
                  href={d.href}
                  target={d.label === "OFFICE" ? "_blank" : undefined}
                  rel={d.label === "OFFICE" ? "noopener noreferrer" : undefined}
                  whileHover={{ x: 4 }}
                  className="block cursor-pointer"
                >
                  {content}
                </motion.a>
              );
            }

            return content;
          })}
        </div>
      </section>

      {/* ============================================================
          SUPPORT SECTION
      ============================================================ */}
      <section id="support" className="px-6 md:px-14 py-20" style={{ background: MIST }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
              Help Center
            </span>
            <h2 className={`${display.className} text-3xl md:text-4xl font-medium mt-2`} style={{ color: INK_ON_LIGHT }}>
              How can we support you?
            </h2>
            <p className="text-base text-[#5B6B7A] mt-3 max-w-2xl mx-auto">
              Find answers to common questions, browse support articles, or get in touch with our team.
            </p>
          </motion.div>

          {/* WhatsApp Floating Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div 
              className="relative rounded-2xl p-6 md:p-8 overflow-hidden border"
              style={{ 
                background: `linear-gradient(135deg, ${WHATSAPP_GREEN}12, #128C7E12)`,
                borderColor: `${WHATSAPP_GREEN}33`
              }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl" style={{ background: `${WHATSAPP_GREEN}18` }} />
              <div className="relative flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: WHATSAPP_GREEN }}>
                  <WhatsAppIcon />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className={`${display.className} text-xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                    Get instant help on WhatsApp
                  </h3>
                  <p className="text-sm text-[#5B6B7A] mt-1">
                    Chat directly with our support team. We usually respond within 5 minutes.
                  </p>
                </div>
                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all shrink-0"
                  style={{ 
                    background: WHATSAPP_GREEN,
                    boxShadow: `0 8px 24px -8px ${WHATSAPP_GREEN}66`
                  }}
                >
                  <WhatsAppIcon />
                  Start Chat
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Support Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
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
                      <h3 className="text-base font-medium" style={{ color: INK_ON_LIGHT }}>
                        {category.label}
                      </h3>
                      <p className="text-sm text-[#5B6B7A] mt-1">{category.description}</p>
                      <div className="flex items-center gap-1 mt-3 text-sm font-medium" style={{ color: BLUE }}>
                        Learn more
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border p-6 md:p-8"
            style={{ borderColor: "#E8ECF0" }}
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h3 className={`${display.className} text-xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                  Frequently Asked Questions
                </h3>
                <p className="text-sm text-[#5B6B7A] mt-1">Quick answers to common questions</p>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {faqCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? "text-white"
                        : "text-[#5B6B7A] hover:text-[#111111]"
                    }`}
                    style={{
                      background: activeCategory === cat ? BLUE : "#F6F8FA",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="border rounded-xl overflow-hidden transition-all"
                  style={{ borderColor: expandedFaq === index ? BLUE : "#E8ECF0" }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-[#F6F8FA]"
                  >
                    <span className={`text-sm font-medium ${expandedFaq === index ? '' : ''}`} style={{ color: INK_ON_LIGHT }}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 ml-4"
                      style={{ color: BLUE }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: expandedFaq === index ? "auto" : 0,
                      opacity: expandedFaq === index ? 1 : 0,
                      marginTop: expandedFaq === index ? 0 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4">
                      <p className="text-sm text-[#5B6B7A] leading-relaxed">
                        {faq.answer}
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full" style={{ background: `${BLUE}12`, color: BLUE }}>
                        {faq.category}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#5B6B7A]">No FAQs found in this category.</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: "#E8ECF0" }}>
              <p className="text-sm text-[#5B6B7A]">
                Can't find what you're looking for?{" "}
                <a href="#contact-form" className="font-medium" style={{ color: BLUE }}>
                  Contact our support team
                </a>
              </p>
            </div>
          </motion.div>

          {/* Support Articles Preview */}
          {supportArticles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`${display.className} text-lg font-medium`} style={{ color: INK_ON_LIGHT }}>
                  Latest Support Articles
                </h3>
                <Link href="/support" className="text-sm font-medium" style={{ color: BLUE }}>
                  View all
                  <ArrowRight className="inline-block w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {supportArticles.slice(0, 3).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href={`/support/${article.slug}`}>
                      <div className="p-4 bg-white rounded-xl border hover:shadow-md transition-all hover:-translate-y-1" style={{ borderColor: "#E8ECF0" }}>
                        <h4 className="text-sm font-medium text-[#111111] line-clamp-2">{article.title}</h4>
                        <p className="text-xs text-[#5B6B7A] mt-1 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center gap-2 mt-3 text-[10px] text-[#5B6B7A]">
                          <Clock className="w-3 h-3" />
                          <span>{article.read_time || "3 min read"}</span>
                          <span className="w-1 h-1 rounded-full bg-[#5B6B7A]" />
                          <span style={{ color: BLUE }}>{article.category || "General"}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ============================================================
          CONTACT FORM
      ============================================================ */}
      <section id="contact-form" className="px-6 md:px-14 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
                Reach out
              </span>
              <h2 className={`${display.className} text-2xl md:text-3xl font-medium mt-2`} style={{ color: INK_ON_LIGHT }}>
                Every channel, one team
              </h2>
              <p className="text-sm text-[#5B6B7A] mt-3 max-w-sm">
                Choose the channel that works best for you. We're here to help.
              </p>

              <div className="space-y-3 mt-6">
                {[
                  { icon: Mail, label: "Email", value: content?.email, href: `mailto:${content?.email || ""}` },
                  { icon: Phone, label: "Phone", value: content?.phone, href: `tel:${content?.phone || ""}` },
                  { icon: MapPin, label: "Address", value: content?.address, href: content?.google_maps || "#" },
                ].map((row, i) => {
                  if (!row.value) return null;
                  const Icon = row.icon;
                  return (
                    <motion.a
                      key={i}
                      href={row.href || "#"}
                      target={row.label === "Address" ? "_blank" : undefined}
                      rel={row.label === "Address" ? "noopener noreferrer" : undefined}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="flex items-start gap-4 p-4 bg-white rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer"
                      style={{ borderColor: "#E8ECF0" }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${BLUE}12` }}>
                        <Icon className="w-5 h-5" style={{ color: BLUE }} />
                      </div>
                      <div>
                        <p className={`${mono.className} text-[10px] tracking-[0.1em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                          {row.label}
                        </p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: INK_ON_LIGHT }}>{row.value}</p>
                      </div>
                    </motion.a>
                  );
                })}

                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: `${WHATSAPP_GREEN}44` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${WHATSAPP_GREEN}18` }}>
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <p className={`${mono.className} text-[10px] tracking-[0.1em] uppercase`} style={{ color: WHATSAPP_GREEN }}>
                      WhatsApp
                    </p>
                    <p className="text-sm font-medium mt-0.5" style={{ color: INK_ON_LIGHT }}>
                      Chat with us instantly
                    </p>
                  </div>
                </motion.a>

                {!content?.email && !content?.phone && !content?.address && (
                  <div className="p-4 rounded-xl border border-dashed" style={{ borderColor: `${GOLD}66`, background: `${GOLD}0d` }}>
                    <p className="text-xs font-medium" style={{ color: GOLD }}>
                      No contact details published yet
                      <NeedsInfo>Add email, phone & address in Directus</NeedsInfo>
                    </p>
                  </div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-10"
              >
                <h3 className={`${mono.className} text-[10px] font-semibold tracking-[0.15em] uppercase mb-4`} style={{ color: MUTE_ON_LIGHT }}>
                  Follow us
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -4, scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{ background: "#fff", border: "1px solid #E8ECF0", color: MUTE_ON_LIGHT }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = BLUE;
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.color = MUTE_ON_LIGHT;
                        }}
                      >
                        <Icon />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
                Send a message
              </span>
              <h2 className={`${display.className} text-2xl md:text-3xl font-medium mt-2`} style={{ color: INK_ON_LIGHT }}>
                Tell us what you need
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 mt-6 bg-white rounded-2xl border p-6" style={{ borderColor: "#E8ECF0" }}>
                <div>
                  <label htmlFor="name" className={`${mono.className} block text-[10px] font-semibold tracking-[0.1em] uppercase mb-1.5`} style={{ color: MUTE_ON_LIGHT }}>
                    Full Name <span style={{ color: BLUE }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`${mono.className} block text-[10px] font-semibold tracking-[0.1em] uppercase mb-1.5`} style={{ color: MUTE_ON_LIGHT }}>
                    Email Address <span style={{ color: BLUE }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={`${mono.className} block text-[10px] font-semibold tracking-[0.1em] uppercase mb-1.5`} style={{ color: MUTE_ON_LIGHT }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+256 700 000 000"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                <div>
                  <label htmlFor="category" className={`${mono.className} block text-[10px] font-semibold tracking-[0.1em] uppercase mb-1.5`} style={{ color: MUTE_ON_LIGHT }}>
                    Inquiry Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition bg-white"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  >
                    <option value="">Select a category...</option>
                    <option value="general">General Inquiry</option>
                    <option value="membership">Membership</option>
                    <option value="programmes">Programmes</option>
                    <option value="payments">Payments & Fees</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className={`${mono.className} block text-[10px] font-semibold tracking-[0.1em] uppercase mb-1.5`} style={{ color: MUTE_ON_LIGHT }}>
                    Subject <span style={{ color: BLUE }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`${mono.className} block text-[10px] font-semibold tracking-[0.1em] uppercase mb-1.5`} style={{ color: MUTE_ON_LIGHT }}>
                    Message <span style={{ color: BLUE }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition resize-none"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
                    {errorMessage}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={formStatus === "sending"}
                  whileHover={formStatus === "sending" ? {} : { scale: 1.01 }}
                  whileTap={formStatus === "sending" ? {} : { scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: formStatus === "sending" ? "#9CA3AF" : INK_ON_LIGHT,
                    cursor: formStatus === "sending" ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (formStatus !== "sending") e.currentTarget.style.background = BLUE;
                  }}
                  onMouseLeave={(e) => {
                    if (formStatus !== "sending") e.currentTarget.style.background = INK_ON_LIGHT;
                  }}
                >
                  {formStatus === "sending" ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : formStatus === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {formStatus === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-center"
                    style={{ color: POSITIVE }}
                  >
                    Your message has been sent. We'll get back to you soon.
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BRANCHES CTA
      ============================================================ */}
      <section className="px-6 md:px-14 py-24 relative overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute top-[-40%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: `${BLUE}14` }} />
        <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: `${GOLD}10` }} />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative container mx-auto max-w-2xl text-center"
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl border flex items-center justify-center" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
            <Building className="w-6 h-6" style={{ color: BLUE_LIGHT }} />
          </div>
          <h3 className={`${display.className} text-2xl md:text-3xl font-medium text-white`}>Prefer to visit us in person?</h3>
          <p className="text-white/40 text-sm mt-2 max-w-md mx-auto font-light">
            Find a YPA branch near you and start your agribusiness journey face-to-face.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Link
              href="/branches"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
              style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
            >
              <MapPin className="w-4 h-4" />
              View Branches
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{ 
                background: "rgba(255,255,255,0.08)", 
                backdropFilter: "blur(10px)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)"
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