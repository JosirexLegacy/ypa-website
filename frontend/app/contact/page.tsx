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
  Sparkles,
  Award,
  Star,
  Globe,
  Heart,
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
const VOID = "#0A0A0B";
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
const WHATSAPP_GREEN = "#25D366";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";
const WHATSAPP_NUMBER = "256700000000";
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

// Ledger-style eyebrow — mono index + gold hairline + label.
// `dark` switches the label color for use on black sections.
const LedgerLabel = ({ index, label, dark = false }: { index: string; label: string; dark?: boolean }) => (
  <div className="inline-flex items-center gap-2.5">
    <span className={`${mono.className} text-[10px]`} style={{ color: GOLD }}>{index}</span>
    <span className="h-px w-5" style={{ background: "rgba(240,180,41,0.4)" }} />
    <span className={`${mono.className} text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase`} style={{ color: dark ? "rgba(245,246,247,0.5)" : BLUE }}>
      {label}
    </span>
  </div>
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

// ============================================================
// GOAT MARK
// ============================================================
const GoatMark = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full opacity-[0.06] sm:opacity-[0.08]" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        const contactData = await getContactContent();
        setContent(contactData);
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
    <main className={`${display.variable} ${mono.variable} ${inter.variable} min-h-screen bg-white overflow-x-hidden font-sans antialiased`}>
      <Navigation />

      {/* ============================================================
          HERO SECTION — The Ledger, Contact-page variant
      ============================================================ */}
      <section id="hero" ref={heroRef} className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 md:px-14 overflow-hidden min-h-[80vh] sm:min-h-[70vh] md:min-h-[60vh] flex items-center" style={{ background: VOID }}>
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, transparent 65%)",
            maskImage: "linear-gradient(180deg, #000 0%, transparent 65%)",
          }}
        />

        {/* gold hairline frame, matching the site-wide hero language */}
        <div className="absolute inset-x-4 md:inset-x-8 top-16 md:top-20 bottom-8 md:bottom-10 border pointer-events-none hidden sm:block" style={{ borderColor: "rgba(240,180,41,0.14)" }} />
        
        {/* Animated gradient blobs */}
        <motion.div
          className="absolute top-[-20%] right-[-20%] w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${BLUE}10` }}
          animate={reduce ? {} : { x: [0, 40, -30, 0], y: [0, -30, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[-20%] w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `${GOLD}08` }}
          animate={reduce ? {} : { x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Goat mark - hidden on small mobile */}
        <div className="absolute right-0 bottom-0 w-[200px] sm:w-[300px] md:w-[420px] h-[200px] sm:h-[300px] md:h-[420px] pointer-events-none hidden sm:block">
          <div className="absolute inset-0 flex items-end justify-end">
            <GoatMark />
          </div>
        </div>

        {/* Decorative floating elements - hidden on mobile */}
        <motion.div
          className="absolute top-[15%] left-[5%] pointer-events-none hidden lg:block"
          animate={reduce ? {} : { y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8" style={{ color: BLUE_LIGHT, opacity: 0.3 }} />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] right-[15%] pointer-events-none hidden lg:block"
          animate={reduce ? {} : { y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Award className="w-10 h-10" style={{ color: GOLD, opacity: 0.2 }} />
        </motion.div>

        <div className="relative container mx-auto max-w-6xl z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {/* manifest stamp — live status */}
            <motion.div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: POSITIVE }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: POSITIVE }} />
              </span>
              <span className={`${mono.className} text-[10px] sm:text-[11px] tracking-[0.25em] uppercase`} style={{ color: BLUE_LIGHT }}>
                Live Support — 24/7
              </span>
              <span className="h-px flex-1 max-w-[64px]" style={{ background: "rgba(240,180,41,0.35)" }} />
            </motion.div>
            
            <motion.h1 
              className={`${display.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.08] sm:leading-[1.05] tracking-tight`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {content?.title || "We're here to help"}
              <motion.span
                className="block mt-1 italic"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ color: BLUE_LIGHT }}
              >
                Every question answered
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-sm sm:text-base md:text-lg mt-3 sm:mt-5 max-w-lg font-light leading-relaxed"
              style={{ color: "rgba(245,246,247,0.55)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {content?.subtitle || "Reach out to us anytime. Our team is ready to help with anything you need."}
            </motion.p>
            
            {/* ledger row — trust indicators as ruled columns */}
            <motion.div
              className="mt-6 sm:mt-8 flex items-stretch gap-0 max-w-md border-t border-b"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {[
                { label: "Members", value: "1,000+", icon: Heart, accent: BLUE_LIGHT },
                { label: "Rating", value: "4.9/5", icon: Star, accent: GOLD },
                { label: "Branches", value: "12", icon: Globe, accent: BLUE_LIGHT },
              ].map((s, idx) => (
                <div key={idx} className="flex-1 py-3 px-3 sm:px-4" style={{ borderLeft: idx > 0 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <s.icon className="w-3 h-3" style={{ color: s.accent }} />
                    <span className={`${mono.className} text-[8px] sm:text-[9px] tracking-[0.1em] uppercase`} style={{ color: "rgba(245,246,247,0.4)" }}>{s.label}</span>
                  </div>
                  <div className={`${display.className} text-sm sm:text-base font-medium`} style={{ color: "#F5F6F7" }}>{s.value}</div>
                </div>
              ))}
            </motion.div>
            
            {/* Buttons */}
            <motion.div 
              className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium text-white transition-all shadow-lg flex-1 sm:flex-none justify-center"
                style={{ 
                  background: WHATSAPP_GREEN,
                  boxShadow: `0 12px 24px -10px ${WHATSAPP_GREEN}55`
                }}
              >
                <WhatsAppIcon />
                <span className="hidden xs:inline">Chat on WhatsApp</span>
                <span className="xs:hidden">WhatsApp</span>
              </motion.a>
              <motion.a
                href="#contact-form"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all border flex-1 sm:flex-none justify-center"
                style={{ borderColor: "rgba(240,180,41,0.35)", color: "#fff" }}
              >
                <Mail className="w-4 h-4" style={{ color: GOLD }} />
                <span className="hidden xs:inline">Send Email</span>
                <span className="xs:hidden">Email</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          DIRECT LINES — black ledger row
      ============================================================ */}
      <section className="relative border-y" style={{ background: VOID, borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-14 pt-3 sm:pt-4">
          <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: GOLD }} />
          <span className={`${mono.className} text-[9px] sm:text-[10px] tracking-[0.2em] uppercase`} style={{ color: "rgba(245,246,247,0.4)" }}>
            Direct lines — no contact form required
          </span>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 py-4 sm:py-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {directLines.map((d, i) => {
            const Icon = d.icon;
            const isClickable = d.href && d.value;
            const content = (
              <div key={i} className={mono.className}>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] tracking-[0.12em] uppercase" style={{ color: "rgba(245,246,247,0.35)" }}>
                  <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: BLUE_LIGHT }} />
                  {d.label}
                </div>
                <div className="text-xs sm:text-sm md:text-base mt-1 break-words" style={{ color: d.value ? "#fff" : GOLD }}>
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
          FAQ SECTION - Mobile Optimized
      ============================================================ */}
      <section className="px-4 sm:px-6 md:px-14 py-12 sm:py-20" style={{ background: MIST }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex justify-center mb-2">
              <LedgerLabel index="01" label="Help Center" />
            </div>
            <h2 className={`${display.className} text-2xl sm:text-3xl md:text-4xl font-medium mt-2`} style={{ color: INK_ON_LIGHT }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-[#5B6B7A] mt-2 sm:mt-3 max-w-2xl mx-auto">
              Quick answers to common questions about YPA programmes and services.
            </p>
          </motion.div>

          {/* WhatsApp Floating Card - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-8 sm:mb-12"
          >
            <div 
              className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden border"
              style={{ 
                background: `linear-gradient(135deg, ${WHATSAPP_GREEN}12, #128C7E12)`,
                borderColor: `${WHATSAPP_GREEN}33`
              }}
            >
              <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 rounded-full blur-3xl" style={{ background: `${WHATSAPP_GREEN}18` }} />
              <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: WHATSAPP_GREEN }}>
                  <WhatsAppIcon />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className={`${display.className} text-base sm:text-xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                    Get instant help on WhatsApp
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5B6B7A] mt-0.5 sm:mt-1">
                    Chat directly with our support team. We usually respond within 5 minutes.
                  </p>
                </div>
                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium text-white transition-all shrink-0 w-full sm:w-auto justify-center"
                  style={{ 
                    background: WHATSAPP_GREEN,
                    boxShadow: `0 8px 20px -8px ${WHATSAPP_GREEN}55`
                  }}
                >
                  <WhatsAppIcon />
                  Start Chat
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* FAQ Accordion - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-6 md:p-8"
            style={{ borderColor: "#E8ECF0" }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div>
                <h3 className={`${display.className} text-lg sm:text-xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                  Popular Questions
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6B7A] mt-0.5">Click to expand and find answers</p>
              </div>
              
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {faqCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-xs font-medium transition-all touch-manipulation ${
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
                  className="border rounded-xl overflow-hidden transition-all"
                  style={{ borderColor: expandedFaq === index ? "rgba(240,180,41,0.45)" : "#E8ECF0" }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between text-left transition-colors hover:bg-[#F6F8FA] touch-manipulation"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`${mono.className} text-[9px]`} style={{ color: "rgba(91,107,122,0.45)" }}>0{index + 1}</span>
                      <span className="text-xs sm:text-sm font-medium" style={{ color: INK_ON_LIGHT }}>
                        {faq.question}
                      </span>
                    </span>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 ml-2 sm:ml-4"
                      style={{ color: expandedFaq === index ? GOLD : BLUE }}
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: expandedFaq === index ? "auto" : 0,
                      opacity: expandedFaq === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 sm:px-5 pb-3 sm:pb-4">
                      <p className="text-xs sm:text-sm text-[#5B6B7A] leading-relaxed">
                        {faq.answer}
                      </p>
                      <span className="inline-block mt-1.5 sm:mt-2 text-[8px] sm:text-[10px] font-medium tracking-wide uppercase px-1.5 sm:px-2 py-0.5 rounded-full" style={{ background: `${BLUE}12`, color: BLUE }}>
                        {faq.category}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm text-[#5B6B7A]">No FAQs found in this category.</p>
              </div>
            )}

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t text-center" style={{ borderColor: "#E8ECF0" }}>
              <p className="text-xs sm:text-sm text-[#5B6B7A]">
                Can't find what you're looking for?{" "}
                <a href="#contact-form" className="font-medium" style={{ color: BLUE }}>
                  Contact our support team
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          CONTACT FORM - Mobile Optimized
      ============================================================ */}
      <section id="contact-form" className="px-4 sm:px-6 md:px-14 py-12 sm:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <LedgerLabel index="02" label="Reach out" />
              <h2 className={`${display.className} text-xl sm:text-2xl md:text-3xl font-medium mt-2`} style={{ color: INK_ON_LIGHT }}>
                Every channel, one team
              </h2>
              <p className="text-sm text-[#5B6B7A] mt-2 sm:mt-3 max-w-sm">
                Choose the channel that works best for you. We're here to help.
              </p>

              <div className="space-y-3 mt-4 sm:mt-6">
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
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer"
                      style={{ borderColor: "#E8ECF0" }}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${BLUE}12` }}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: BLUE }} />
                      </div>
                      <div>
                        <p className={`${mono.className} text-[9px] sm:text-[10px] tracking-[0.1em] uppercase`} style={{ color: MUTE_ON_LIGHT }}>
                          {row.label}
                        </p>
                        <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: INK_ON_LIGHT }}>{row.value}</p>
                      </div>
                    </motion.a>
                  );
                })}

                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: `${WHATSAPP_GREEN}44` }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${WHATSAPP_GREEN}18` }}>
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <p className={`${mono.className} text-[9px] sm:text-[10px] tracking-[0.1em] uppercase`} style={{ color: WHATSAPP_GREEN }}>
                      WhatsApp
                    </p>
                    <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: INK_ON_LIGHT }}>
                      Chat with us instantly
                    </p>
                  </div>
                </motion.a>

                {!content?.email && !content?.phone && !content?.address && (
                  <div className="p-3 sm:p-4 rounded-xl border border-dashed" style={{ borderColor: `${GOLD}66`, background: `${GOLD}0d` }}>
                    <p className="text-xs font-medium" style={{ color: GOLD }}>
                      No contact details published yet
                      <NeedsInfo>Add email, phone & address in Directus</NeedsInfo>
                    </p>
                  </div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                className="mt-8 sm:mt-10"
              >
                <h3 className={`${mono.className} text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase mb-3 sm:mb-4`} style={{ color: MUTE_ON_LIGHT }}>
                  Follow us
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{ background: "#fff", border: "1px solid #E8ECF0", color: MUTE_ON_LIGHT }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = VOID;
                          e.currentTarget.style.borderColor = "rgba(240,180,41,0.4)";
                          e.currentTarget.style.color = BLUE_LIGHT;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.borderColor = "#E8ECF0";
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
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <LedgerLabel index="03" label="Send a message" />
              <h2 className={`${display.className} text-xl sm:text-2xl md:text-3xl font-medium mt-2`} style={{ color: INK_ON_LIGHT }}>
                Tell us what you need
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-6" style={{ borderColor: "#E8ECF0" }}>
                <div>
                  <label htmlFor="name" className={`${mono.className} block text-[9px] sm:text-[10px] font-semibold tracking-[0.1em] uppercase mb-1`} style={{ color: MUTE_ON_LIGHT }}>
                    Full Name <span style={{ color: GOLD }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`${mono.className} block text-[9px] sm:text-[10px] font-semibold tracking-[0.1em] uppercase mb-1`} style={{ color: MUTE_ON_LIGHT }}>
                    Email Address <span style={{ color: GOLD }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={`${mono.className} block text-[9px] sm:text-[10px] font-semibold tracking-[0.1em] uppercase mb-1`} style={{ color: MUTE_ON_LIGHT }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+256 700 000 000"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                <div>
                  <label htmlFor="category" className={`${mono.className} block text-[9px] sm:text-[10px] font-semibold tracking-[0.1em] uppercase mb-1`} style={{ color: MUTE_ON_LIGHT }}>
                    Inquiry Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition bg-white"
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
                  <label htmlFor="subject" className={`${mono.className} block text-[9px] sm:text-[10px] font-semibold tracking-[0.1em] uppercase mb-1`} style={{ color: MUTE_ON_LIGHT }}>
                    Subject <span style={{ color: GOLD }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`${mono.className} block text-[9px] sm:text-[10px] font-semibold tracking-[0.1em] uppercase mb-1`} style={{ color: MUTE_ON_LIGHT }}>
                    Message <span style={{ color: GOLD }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us how we can help..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition resize-none"
                    style={{ borderColor: "#E3E7EB" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E3E7EB")}
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
                    {errorMessage}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={formStatus === "sending"}
                  whileHover={formStatus === "sending" ? {} : { scale: 1.01 }}
                  whileTap={formStatus === "sending" ? {} : { scale: 0.98 }}
                  className="w-full py-3 sm:py-3.5 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  style={{
                    background: formStatus === "sending" ? "#9CA3AF" : VOID,
                    cursor: formStatus === "sending" ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (formStatus !== "sending") e.currentTarget.style.background = BLUE;
                  }}
                  onMouseLeave={(e) => {
                    if (formStatus !== "sending") e.currentTarget.style.background = VOID;
                  }}
                >
                  {formStatus === "sending" ? (
                    <>
                      <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : formStatus === "success" ? (
                    <>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs sm:text-sm text-center"
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
          BRANCHES CTA — black ledger close
      ============================================================ */}
      <section className="px-4 sm:px-6 md:px-14 py-16 sm:py-20 md:py-24 relative overflow-hidden" style={{ background: VOID }}>
        <div className="absolute top-[-40%] right-[-10%] w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: `${BLUE}10` }} />
        <div className="absolute bottom-[-30%] left-[-10%] w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: `${GOLD}0a` }} />
        <div className="absolute inset-x-4 md:inset-x-10 top-8 bottom-8 border pointer-events-none hidden sm:block" style={{ borderColor: "rgba(240,180,41,0.12)" }} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
          className="relative container mx-auto max-w-2xl text-center"
        >
          <div className="flex justify-center mb-4 sm:mb-5">
            <LedgerLabel index="04" label="Visit Us" dark />
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-5 rounded-2xl border flex items-center justify-center" style={{ borderColor: "rgba(240,180,41,0.25)", background: "rgba(255,255,255,0.03)" }}>
            <Building className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: BLUE_LIGHT }} />
          </div>
          <h3 className={`${display.className} text-xl sm:text-2xl md:text-3xl font-medium text-white`}>Prefer to visit us in person?</h3>
          <p className="text-xs sm:text-sm mt-2 max-w-md mx-auto font-light" style={{ color: "rgba(245,246,247,0.45)" }}>
            Find a YPA branch near you and start your agribusiness journey face-to-face.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-5 sm:mt-6">
            <Link
              href="/branches"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{ background: BLUE, color: VOID }}
            >
              <MapPin className="w-4 h-4" />
              View Branches
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all hover:-translate-y-0.5 border"
              style={{ borderColor: "rgba(240,180,41,0.35)", color: "#fff" }}
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