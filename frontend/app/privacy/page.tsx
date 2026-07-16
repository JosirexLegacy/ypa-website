"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Users,
  Database,
  Cookie,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Sparkles,
  Check,
  ShieldCheck,
  Clock,
  Globe,
  Building,
  Award,
  Heart,
  ArrowUpRight,
} from "lucide-react";

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

// ===== DESIGN TOKENS =====
const INK = "#060B14";
const BLUE = "#2196F3";
const SKY = "#7EC8FF";
const GOLD = "#F0B429";
const MIST = "#F6F8FA";
const INK_ON_LIGHT = "#0E2540";
const MUTE_ON_LIGHT = "#5B6B7A";
const POSITIVE = "#34D399";
const DARK_BODY = "#1A2A3A";       // Dark, crisp body text
const DARK_MUTED = "#2D3D4D";      // For secondary text

const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const PolicySection = ({ title, icon: Icon, children, delay = 0 }) => (
  <ScrollReveal delay={delay}>
    <div className="bg-white rounded-3xl border p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300" style={{ borderColor: "#E8ECF0" }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${BLUE}12` }}>
          <Icon className="w-5 h-5" style={{ color: BLUE }} />
        </div>
        <div className="flex-1">
          <h3 className={`${display.className} text-xl md:text-2xl font-medium mb-3 text-[#0E2540]`}>
            {title}
          </h3>
          <div className="text-[#1A2A3A] text-sm md:text-base leading-relaxed space-y-3 [&_p]:text-[#1A2A3A] [&_li]:text-[#1A2A3A] [&_strong]:text-[#0E2540] [&_strong]:font-semibold">
            {children}
          </div>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

export default function PrivacyPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = [
    { id: "collect", label: "Information We Collect" },
    { id: "use", label: "How We Use Information" },
    { id: "share", label: "Data Sharing" },
    { id: "security", label: "Data Security" },
    { id: "rights", label: "Your Rights" },
    { id: "cookies", label: "Cookies" },
    { id: "children", label: "Children's Privacy" },
    { id: "retention", label: "Data Retention" },
    { id: "international", label: "International Transfers" },
    { id: "contact", label: "Contact Us" },
  ];

  return (
    <main className={`${display.variable} ${mono.variable} min-h-screen bg-white antialiased`}>
      <Navigation />

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden" style={{ background: INK }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: BLUE }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: SKY }} />
        </div>
        <div className="relative container mx-auto max-w-4xl text-center z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6" style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <Shield className="w-4 h-4" style={{ color: SKY }} />
              <span className={`${mono.className} text-[10px] tracking-[0.15em] uppercase text-white/60`}>
                Your Privacy Matters
              </span>
            </div>
            <h1 className={`${display.className} text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.05]`}>
              Privacy Policy
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto mt-4 text-white/50">
              Youth Platform Africa is committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-white/40">
                <Clock className="w-4 h-4" />
                <span className={`${mono.className} text-[11px] tracking-[0.05em]`}>
                  Last Updated: {lastUpdated}
                </span>
              </div>
              <span className="w-px h-6 bg-white/10" />
              <div className="flex items-center gap-2 text-white/40">
                <Building className="w-4 h-4" />
                <span className={`${mono.className} text-[11px] tracking-[0.05em]`}>
                  Kampala, Uganda
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <Check className="w-3.5 h-3.5 text-sky-400" />
                <span className={`${mono.className} text-[10px] tracking-[0.08em] uppercase text-white/60`}>URSB Registered</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className={`${mono.className} text-[10px] tracking-[0.08em] uppercase text-white/60`}>Since 2014</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className={`${mono.className} text-[10px] tracking-[0.08em] uppercase text-white/60`}>Data Protection Compliant</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className={`${mono.className} text-[10px] tracking-[0.3em] uppercase`}>Read On</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-2 bg-white/30 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* ===== INTRODUCTION ===== */}
      <section className="py-16 px-6 border-b" style={{ borderColor: "#E8ECF0", background: MIST }}>
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="text-center">
              <p className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3 text-[#5B6B7A]`}>Our Commitment</p>
              <h2 className={`${display.className} text-2xl md:text-3xl font-medium tracking-tight mb-4 text-[#0E2540]`}>
                Your Trust is Our Foundation
              </h2>
              <div className="text-[#1A2A3A] text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  Youth Platform Africa (YPA) is a <strong className="text-[#0E2540] font-semibold">URSB-registered organisation</strong> operating since 2014. 
                  We are committed to protecting your privacy and ensuring that your personal data is handled 
                  securely, transparently, and in accordance with applicable data protection laws. 
                  This Privacy Policy explains how we collect, use, share, and protect your personal information.
                </p>
                <p>
                  Whether you are a <strong className="text-[#0E2540] font-semibold">YPA member, investor, partner, researcher, or visitor</strong> to our website, 
                  we take your privacy seriously. We believe that data protection is not just a legal obligation 
                  but a fundamental trust relationship between us and the communities we serve.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FLOATING GLASS NAV – centered, pill shape, with glow ===== */}
      <div className="sticky top-24 z-30 flex justify-center px-4 -mt-6">
        <nav
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 overflow-x-auto"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px) saturate(1.3)",
            boxShadow: "0 8px 40px rgba(33,150,243,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <span className={`${mono.className} text-[10px] tracking-[0.1em] uppercase text-[#5B6B7A] shrink-0`}>
            Jump to:
          </span>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`${mono.className} text-[10px] tracking-[0.05em] px-3 py-1 rounded-full transition-all whitespace-nowrap hover:bg-[#2196F3]/10 hover:text-[#2196F3]`}
              style={{ color: "#5B6B7A" }}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      {/* ===== POLICY SECTIONS ===== */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl space-y-6">
          <PolicySection title="Information We Collect" icon={Database} delay={0}>
            <p>We collect information that you voluntarily provide when you:</p>
            <ul className="space-y-2 mt-3">
              {[
                "Register as a YPA member or farmer",
                "Invest in our projects (Goats, Maize, Beekeeping, SACCO)",
                "Contact us through our website, email, or phone",
                "Subscribe to our newsletters or updates",
                "Apply for employment or partnership opportunities",
                "Participate in our events, training, or field days",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]">{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[#1A2A3A]">
              The information we collect may include your name, contact details, identification documents, 
              financial information, farming data, and any other information relevant to your engagement with YPA.
            </p>
          </PolicySection>

          <PolicySection title="How We Use Your Information" icon={Eye} delay={0.05}>
            <p>We use your personal information to:</p>
            <ul className="space-y-2 mt-3">
              {[
                "<strong>Administer your YPA membership</strong> and provide our services",
                "<strong>Process investments and returns</strong> for our agribusiness projects",
                "<strong>Communicate with you</strong> about your investments, account updates, and project developments",
                "<strong>Improve our services</strong> and develop new agribusiness solutions",
                "<strong>Comply with legal and regulatory obligations</strong> including URSB reporting",
                "<strong>Protect against fraud</strong> and ensure the security of our systems",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]" dangerouslySetInnerHTML={{ __html: text }} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[#1A2A3A]">
              We process your data based on legitimate interests, contractual necessity, and legal obligations. 
              We never sell your personal information to third parties.
            </p>
          </PolicySection>

          <PolicySection title="Data Sharing & Disclosure" icon={Users} delay={0.1}>
            <p>We may share your information with:</p>
            <ul className="space-y-2 mt-3">
              {[
                "<strong>Service providers</strong> who assist with our operations (e.g., payment processors, IT services)",
                "<strong>Regulatory authorities</strong> as required by law (URSB, URA, etc.)",
                "<strong>Partner organisations</strong> with your explicit consent",
                "<strong>Professional advisors</strong> (lawyers, auditors) who need access to perform their services",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]" dangerouslySetInnerHTML={{ __html: text }} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[#1A2A3A]">
              All third parties with whom we share data are contractually obligated to protect your information 
              and use it only for the specified purposes. We conduct due diligence on our service providers to ensure compliance with data protection standards.
            </p>
          </PolicySection>

          <PolicySection title="Data Security" icon={Lock} delay={0.15}>
            <p>We implement <strong>robust security measures</strong> to protect your personal information:</p>
            <ul className="space-y-2 mt-3">
              {[
                "<strong>Encryption</strong> of sensitive data in transit and at rest",
                "<strong>Access controls</strong> – only authorised personnel have access to personal data",
                "<strong>Regular security audits</strong> and vulnerability assessments",
                "<strong>Employee training</strong> on data protection and privacy best practices",
                "<strong>Incident response protocols</strong> to address any data breaches promptly",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]" dangerouslySetInnerHTML={{ __html: text }} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[#1A2A3A]">
              While no system is 100% secure, we continuously invest in security technologies and practices 
              to safeguard your data. In the event of a data breach, we will notify affected parties and regulatory 
              authorities as required by law.
            </p>
          </PolicySection>

          <PolicySection title="Your Data Rights" icon={FileText} delay={0.2}>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="space-y-2 mt-3">
              {[
                "<strong>Right to Access</strong> – Request a copy of the data we hold about you",
                "<strong>Right to Rectification</strong> – Correct inaccurate or incomplete data",
                "<strong>Right to Erasure</strong> – Request deletion of your data (\"right to be forgotten\")",
                "<strong>Right to Restriction</strong> – Limit how we process your data",
                "<strong>Right to Data Portability</strong> – Receive your data in a transferable format",
                "<strong>Right to Object</strong> – Object to certain processing activities",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]" dangerouslySetInnerHTML={{ __html: text }} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[#1A2A3A]">
              To exercise any of these rights, please contact our <strong>Data Protection Officer</strong> at <a href="mailto:dpo@youthplatformafrica.com" className="underline text-[#2196F3] hover:text-[#1976D2]">dpo@youthplatformafrica.com</a>. 
              We will respond to your request within 30 days, as required by applicable law.
            </p>
          </PolicySection>

          <PolicySection title="Cookies & Tracking" icon={Cookie} delay={0.25}>
            <p>Our website uses cookies and similar technologies to enhance your experience, analyse site traffic, and deliver personalised content. We use:</p>
            <ul className="space-y-2 mt-3">
              {[
                "<strong>Essential Cookies</strong> – Necessary for the website to function properly",
                "<strong>Analytics Cookies</strong> – To understand how visitors interact with our site",
                "<strong>Preference Cookies</strong> – To remember your settings and preferences",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]" dangerouslySetInnerHTML={{ __html: text }} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[#1A2A3A]">
              You can control cookie preferences through your browser settings. However, disabling certain cookies 
              may affect site functionality. We respect your privacy and provide clear options for cookie management.
            </p>
          </PolicySection>

          <PolicySection title="Children's Privacy" icon={Heart} delay={0.3}>
            <p className="text-[#1A2A3A]">
              YPA is committed to protecting the privacy of young people. Our services are not directed at children under 16, 
              and we do not knowingly collect personal data from minors. If we become aware that we have collected data from 
              a child without parental consent, we will delete it promptly.
            </p>
            <p className="text-[#1A2A3A]">
              Parents and guardians who believe their child has provided us with personal information should contact us immediately.
            </p>
          </PolicySection>

          <PolicySection title="Data Retention" icon={Clock} delay={0.35}>
            <p>We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, including satisfying legal, accounting, or reporting requirements.</p>
            <ul className="space-y-2 mt-3">
              {[
                "<strong>Member Data:</strong> Retained for the duration of your membership plus 7 years for legal compliance",
                "<strong>Financial Records:</strong> Retained for 7 years as required by Ugandan law",
                "<strong>Inquiry Data:</strong> Retained for 2 years for customer service purposes",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]" dangerouslySetInnerHTML={{ __html: text }} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[#1A2A3A]">When data is no longer needed, we securely delete or anonymise it.</p>
          </PolicySection>

          <PolicySection title="International Data Transfers" icon={Globe} delay={0.4}>
            <p className="text-[#1A2A3A]">
              As a Ugandan organisation, YPA primarily stores data within Uganda. However, we may transfer data to 
              service providers located in other countries for the purposes of IT services, payment processing, or communications.
            </p>
            <p className="text-[#1A2A3A]">When we transfer data internationally, we ensure appropriate safeguards are in place, such as:</p>
            <ul className="space-y-2 mt-3">
              {[
                "Data processing agreements that include standard contractual clauses",
                "Vetting of service providers for data protection compliance",
                "Limiting data transfers to countries with adequate data protection laws",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]">{text}</span>
                </li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection title="Contact Us" icon={Mail} delay={0.45}>
            <p className="text-[#1A2A3A]">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact our Data Protection Officer:
            </p>
            <div className="mt-4 p-6 rounded-2xl border" style={{ borderColor: "#E8ECF0", background: MIST }}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#2196F3]" />
                  <span className={`${mono.className} text-sm text-[#0E2540]`}>
                    <a href="mailto:dpo@youthplatformafrica.com" className="hover:underline text-[#2196F3]">dpo@youthplatformafrica.com</a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#2196F3]" />
                  <span className={`${mono.className} text-sm text-[#0E2540]`}>+256 774 313 551</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#2196F3]" />
                  <span className={`${mono.className} text-sm text-[#0E2540]`}>Kampala, Uganda</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-[#2196F3]" />
                  <span className={`${mono.className} text-sm text-[#0E2540]`}>URSB Registration: Since 2014</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[#1A2A3A]">
              We are committed to addressing your concerns promptly and transparently. You also have the right to 
              lodge a complaint with the relevant data protection authority if you are unsatisfied with our response.
            </p>
          </PolicySection>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="py-16 px-6 border-t" style={{ borderColor: "#E8ECF0", background: MIST }}>
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border shadow-sm" style={{ borderColor: "#E8ECF0" }}>
                <Shield className="w-10 h-10 mx-auto mb-3 text-[#2196F3]" />
                <h4 className={`${display.className} text-sm font-medium text-[#0E2540]`}>URSB Registered</h4>
                <p className={`${mono.className} text-[10px] tracking-[0.05em] mt-1 text-[#5B6B7A]`}>Operating since 2014</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border shadow-sm" style={{ borderColor: "#E8ECF0" }}>
                <Lock className="w-10 h-10 mx-auto mb-3 text-[#2196F3]" />
                <h4 className={`${display.className} text-sm font-medium text-[#0E2540]`}>Data Protection</h4>
                <p className={`${mono.className} text-[10px] tracking-[0.05em] mt-1 text-[#5B6B7A]`}>Compliant with applicable laws</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border shadow-sm" style={{ borderColor: "#E8ECF0" }}>
                <Heart className="w-10 h-10 mx-auto mb-3 text-[#F0B429]" />
                <h4 className={`${display.className} text-sm font-medium text-[#0E2540]`}>Community Trust</h4>
                <p className={`${mono.className} text-[10px] tracking-[0.05em] mt-1 text-[#5B6B7A]`}>1,000+ Members & Growing</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== BACK TO TOP ===== */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.8,
          pointerEvents: showBackToTop ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        style={{ background: BLUE, boxShadow: `0 8px 30px ${BLUE}66` }}
        aria-label="Back to top"
      >
        <ChevronDown className="w-5 h-5 rotate-180" />
      </motion.button>

      <Footer />
    </main>
  );
}