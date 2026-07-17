"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Clock,
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

const INK = "#060B14";
const NAVY = "#0E2540";
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
// DATA — now uses production API URL
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

// ===== SVG SOCIAL ICONS =====
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

// ============================================================
// GOAT MARK
// ============================================================
const GoatMark = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full opacity-[0.08]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M200 50 C180 50 160 60 150 80 C140 60 120 55 110 70 C100 85 110 100 120 110 C100 115 80 130 70 150 C60 170 55 195 60 220 C65 245 75 265 90 280 C105 295 125 305 145 310 C165 315 185 315 200 310 C215 305 235 295 250 280 C265 265 275 245 280 220 C285 195 280 170 270 150 C260 130 240 115 220 110 C230 100 240 85 230 70 C220 55 200 60 190 80 C180 60 160 50 200 50Z"
      fill={SKY}
    />
    <path d="M160 70 C155 50 145 35 130 30 C135 45 140 55 150 65" fill={SKY} />
    <path d="M190 65 C195 45 200 30 210 25 C205 40 200 55 195 65" fill={SKY} />
    <path d="M145 80 C135 75 125 80 130 90 C135 95 140 90 145 85" fill={SKY} />
    <path d="M205 80 C215 75 225 80 220 90 C215 95 210 90 205 85" fill={SKY} />
    <circle cx="170" cy="105" r="4" fill="#fff" opacity="0.6" />
    <circle cx="210" cy="105" r="4" fill="#fff" opacity="0.6" />
    <ellipse cx="190" cy="120" rx="8" ry="5" fill="#fff" opacity="0.3" />
    <path d="M185 125 C183 140 178 155 175 165 C180 160 185 150 188 140" fill={SKY} />
    <path d="M195 125 C197 140 202 155 205 165 C200 160 195 150 192 140" fill={SKY} />
  </svg>
);

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getContactContent();
      setContent(data);
      setLoading(false);
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
        status: "new",
      };

      console.log("📤 Sending to Directus:", submissionData);

      // ✅ FIXED: using singular "contact_submission" (matches your collection)
      const res = await fetch(`${API_URL}/items/contact_submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await res.json();
      console.log("📥 Directus Response:", responseData);

      if (!res.ok) {
        const errorMsg = responseData.errors?.[0]?.message || `Error ${res.status}`;
        throw new Error(errorMsg);
      }

      setFormStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error: any) {
      console.error("❌ Form submission error:", error);
      setFormStatus("error");
      setErrorMessage(error.message || "Failed to send message");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
  ];

  const directLines = [
    { icon: Mail, label: "EMAIL", value: content?.email, need: "add support email to Directus" },
    { icon: Phone, label: "PHONE", value: content?.phone, need: "add phone number to Directus" },
    { icon: MapPin, label: "OFFICE", value: content?.address, need: "add office address to Directus" },
    { icon: Clock, label: "RESPONSE TIME", value: content?.response_time, need: "add an SLA, e.g. 'within 1 business day'" },
  ];

  return (
    <main className={`${display.variable} ${mono.variable} min-h-screen bg-white overflow-x-hidden font-sans`}>
      <Navigation />

      <section id="hero" ref={heroRef} className="relative pt-32 pb-20 px-6 md:px-14 overflow-hidden min-h-[52vh] flex items-center" style={{ background: INK }}>
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
          style={{ background: `${SKY}14` }}
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
            <div className={`${mono.className} flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-white/45`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              </span>
              <Mail className="w-3.5 h-3.5" /> Contact
            </div>
            <h1 className={`${display.className} text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.05] tracking-tight mt-5`}>
              {content?.title || "Let's talk business"}
              <span
                className="block text-transparent bg-clip-text mt-1"
                style={{ backgroundImage: `linear-gradient(90deg, ${SKY}, ${BLUE}, ${SKY})` }}
              >
                We answer, we don't auto-reply
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/50 mt-5 max-w-lg font-light leading-relaxed">
              {content?.subtitle || "Reach out to us anytime. Our team is ready to help."}
            </p>
          </motion.div>
        </div>
      </section>

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
            return (
              <div key={i} className={mono.className}>
                <div className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase text-white/35">
                  <Icon className="h-3 w-3" />
                  {d.label}
                </div>
                <div className="text-sm md:text-base mt-1.5 break-words" style={{ color: d.value ? "#fff" : GOLD }}>
                  {d.value || "—"}
                </div>
                {!d.value && <div className="text-[9px] mt-1 text-white/30 normal-case tracking-normal">{d.need}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 md:px-14 py-20" style={{ background: MIST }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: BLUE }}>
                Reach out
              </span>
              <h2 className={`${display.className} text-2xl md:text-3xl font-medium mt-2`} style={{ color: INK_ON_LIGHT }}>
                Every channel, one team
              </h2>

              <div className="space-y-3 mt-6">
                {[
                  { icon: Mail, label: "Email", value: content?.email },
                  { icon: Phone, label: "Phone", value: content?.phone },
                  { icon: MapPin, label: "Address", value: content?.address },
                ].map((row, i) => {
                  if (!row.value) return null;
                  const Icon = row.icon;
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="flex items-start gap-4 p-4 bg-white rounded-xl border transition-all duration-300 hover:shadow-md"
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
                    </motion.div>
                  );
                })}

                {!content?.email && !content?.phone && !content?.address && (
                  <div className="p-4 rounded-xl border border-dashed" style={{ borderColor: `${GOLD}66`, background: `${GOLD}0d` }}>
                    <p className="text-xs font-medium" style={{ color: GOLD }}>
                      No contact details published yet
                      <NeedsInfo>Add email, phone & address in Directus</NeedsInfo>
                    </p>
                  </div>
                )}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="mt-10">
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

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
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
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-center" style={{ color: POSITIVE }}>
                    Your message has been sent. We'll get back to you soon.
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-24 relative overflow-hidden" style={{ background: INK }}>
        <div className="absolute top-[-40%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: `${BLUE}14` }} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="relative container mx-auto max-w-2xl text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl border flex items-center justify-center" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
            <MessageCircle className="w-6 h-6" style={{ color: SKY }} />
          </div>
          <h3 className={`${display.className} text-2xl md:text-3xl font-medium text-white`}>Prefer to visit us?</h3>
          <p className="text-white/40 text-sm mt-2 max-w-md mx-auto font-light">
            Find a YPA branch in your area and start your agribusiness journey in person.
          </p>
          <Link
            href="/branches"
            className="inline-flex items-center gap-2 mt-6 px-7 py-3 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
            style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
          >
            View Branches
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}