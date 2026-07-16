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
  FileText,
  Users,
  Scale,
  Gavel,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Check,
  Clock,
  Globe,
  Building,
  Award,
  Heart,
  ArrowUpRight,
  BookOpen,
  Handshake,
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

const TermsSection = ({ title, icon: Icon, children, delay = 0 }) => (
  <ScrollReveal delay={delay}>
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ borderColor: "#E8ECF0", background: "rgba(255,255,255,0.8)" }}>
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

export default function TermsPage() {
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
    { id: "acceptance", label: "Acceptance" },
    { id: "accounts", label: "User Accounts" },
    { id: "intellectual", label: "Intellectual Property" },
    { id: "conduct", label: "User Conduct" },
    { id: "disclaimers", label: "Disclaimers" },
    { id: "liability", label: "Limitation" },
    { id: "indemnification", label: "Indemnification" },
    { id: "termination", label: "Termination" },
    { id: "governing", label: "Governing Law" },
    { id: "disputes", label: "Dispute Resolution" },
    { id: "changes", label: "Changes" },
    { id: "contact", label: "Contact" },
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
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}>
              <Scale className="w-4 h-4" style={{ color: SKY }} />
              <span className={`${mono.className} text-[10px] tracking-[0.15em] uppercase text-white/70`}>
                Legal Agreement
              </span>
            </div>
            <h1 className={`${display.className} text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.05]`}>
              Terms of Service
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto mt-4 text-white/50">
              Welcome to Youth Platform Africa. By using our services, you agree to the following terms and conditions.
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
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className={`${mono.className} text-[10px] tracking-[0.08em] uppercase text-white/60`}>Trusted Platform</span>
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
              <p className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3 text-[#5B6B7A]`}>Our Agreement</p>
              <h2 className={`${display.className} text-2xl md:text-3xl font-medium tracking-tight mb-4 text-[#0E2540]`}>
                Clear, Fair, and Transparent
              </h2>
              <div className="text-[#1A2A3A] text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  These Terms of Service govern your use of the Youth Platform Africa (YPA) website, projects, and services. 
                  By accessing or using our platform, you agree to be bound by these terms. If you do not agree, please do not use our services.
                </p>
                <p>
                  YPA provides agribusiness investment opportunities, training, and community support to farmers and investors across Uganda. 
                  Our commitment is to transparency, fairness, and the empowerment of Africa's youth.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== ULTRA GLASSY FLOATING NAV ===== */}
      <div className="sticky top-24 z-30 flex justify-center px-4 -mt-6">
        <div
          className="inline-flex flex-wrap items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 overflow-x-auto"
          style={{
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(32px) saturate(1.6)",
            boxShadow: "0 8px 50px rgba(33,150,243,0.15), 0 0 0 1px rgba(255,255,255,0.2) inset",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span className={`${mono.className} text-[10px] tracking-[0.1em] uppercase text-[#5B6B7A] shrink-0`}>
            Jump to:
          </span>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`${mono.className} text-[10px] tracking-[0.05em] px-3 py-1 rounded-full transition-all whitespace-nowrap hover:bg-white/30 hover:text-[#2196F3]`}
              style={{ color: "#5B6B7A" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* ===== TERMS SECTIONS ===== */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl space-y-6">
          <TermsSection title="Acceptance of Terms" icon={FileText} delay={0}>
            <p>
              By accessing or using the YPA website, mobile applications, or any of our services (collectively, the "Services"), 
              you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            <p>
              If you are using the Services on behalf of an organisation, you represent that you have the authority to bind that 
              organisation to these terms. You must be at least 18 years old to use our Services.
            </p>
          </TermsSection>

          <TermsSection title="User Accounts" icon={Users} delay={0.05}>
            <p>To access certain features of our Services, you may be required to create an account. You agree to:</p>
            <ul className="space-y-2 mt-3">
              {[
                "Provide accurate, current, and complete information during registration",
                "Maintain the security of your password and account credentials",
                "Notify us immediately of any unauthorised access to your account",
                "Be solely responsible for all activities that occur under your account",
                "Not share your account credentials with others",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]">{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              YPA reserves the right to suspend or terminate accounts that violate these terms or are used in fraudulent or unlawful activities.
            </p>
          </TermsSection>

          <TermsSection title="Intellectual Property" icon={BookOpen} delay={0.1}>
            <p>
              All content, logos, images, text, graphics, and software on the YPA platform are the property of Youth Platform Africa 
              or our licensors and are protected by intellectual property laws.
            </p>
            <p>
              You may not copy, reproduce, distribute, modify, or create derivative works from our content without prior written consent. 
              You are granted a limited, non-exclusive, non-transferable license to access and use the Services for personal, non-commercial purposes.
            </p>
          </TermsSection>

          <TermsSection title="User Conduct" icon={Gavel} delay={0.15}>
            <p>You agree not to:</p>
            <ul className="space-y-2 mt-3">
              {[
                "Use the Services for any unlawful purpose or in violation of any applicable law",
                "Transmit any harmful, threatening, defamatory, or obscene content",
                "Interfere with the security or integrity of the platform",
                "Attempt to gain unauthorised access to any part of the Services",
                "Use automated systems or bots to access or scrape data",
                "Impersonate any person or entity or misrepresent your affiliation",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <span className="text-[#1A2A3A]">{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              We reserve the right to investigate and take appropriate legal action against any violation of these terms.
            </p>
          </TermsSection>

          <TermsSection title="Disclaimers" icon={AlertCircle} delay={0.2}>
            <p>
              YPA provides the Services on an "as is" and "as available" basis. While we strive for accuracy and reliability, we make no warranties 
              of any kind, express or implied, regarding the operation or availability of the Services, or the information, content, materials, or products 
              included therein.
            </p>
            <p>
              <strong>Investment and farming outcomes are subject to market risks and agricultural factors.</strong> Past performance does not guarantee future results. 
              We do not guarantee the success of any particular investment or agricultural activity. Always consult with professional advisors before making financial decisions.
            </p>
          </TermsSection>

          <TermsSection title="Limitation of Liability" icon={Shield} delay={0.25}>
            <p>
              To the fullest extent permitted by law, YPA, its directors, officers, employees, and affiliates shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
              or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="space-y-2 mt-3">
              {[
                "Your use or inability to use the Services",
                "Any conduct or content of any third party on the Services",
                "Unauthorised access, use, or alteration of your transmissions or content",
                "Any errors or omissions in any content or for any loss or damage incurred as a result of using any content posted",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]">{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              In no event shall YPA's total liability exceed the amount you paid us, if any, for the specific service giving rise to the claim.
            </p>
          </TermsSection>

          <TermsSection title="Indemnification" icon={Handshake} delay={0.3}>
            <p>
              You agree to defend, indemnify, and hold harmless YPA and its affiliates, directors, employees, and agents from and against any claims, 
              liabilities, damages, losses, and expenses (including legal fees) arising out of or in any way connected with:
            </p>
            <ul className="space-y-2 mt-3">
              {[
                "Your access to or use of the Services",
                "Your violation of these Terms of Service",
                "Your violation of any rights of a third party",
                "Your conduct in connection with the Services",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2196F3]" />
                  <span className="text-[#1A2A3A]">{text}</span>
                </li>
              ))}
            </ul>
          </TermsSection>

          <TermsSection title="Termination" icon={Gavel} delay={0.35}>
            <p>
              We may terminate or suspend your access to the Services immediately, without prior notice, for any reason, including without limitation 
              a breach of these Terms. Upon termination, your right to use the Services will cease immediately.
            </p>
            <p>
              If you wish to terminate your account, you may simply discontinue using the Services or contact us to request deletion of your account.
            </p>
          </TermsSection>

          <TermsSection title="Governing Law" icon={Scale} delay={0.4}>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of Uganda, without regard to its conflict of law provisions.
            </p>
            <p>
              Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Kampala, Uganda.
            </p>
          </TermsSection>

          <TermsSection title="Dispute Resolution" icon={CheckCircle} delay={0.45}>
            <p>
              In the event of a dispute, we encourage you to first contact us to seek an amicable resolution. We are committed to resolving issues fairly and promptly.
            </p>
            <p>
              If we are unable to resolve the dispute through informal negotiations, the dispute shall be resolved through binding arbitration in accordance 
              with the Arbitration and Conciliation Act of Uganda. The arbitration shall be conducted in Kampala, Uganda, in the English language.
            </p>
          </TermsSection>

          <TermsSection title="Changes to Terms" icon={Clock} delay={0.5}>
            <p>
              We reserve the right to modify or replace these Terms at any time. The "Last Updated" date at the top of this page will reflect any changes. 
              Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.
            </p>
            <p>
              We will make reasonable efforts to notify you of significant changes via email or through our website. It is your responsibility to review these Terms periodically.
            </p>
          </TermsSection>

          <TermsSection title="Contact Us" icon={Mail} delay={0.55}>
            <p>
              If you have any questions, concerns, or requests regarding these Terms of Service, please contact us:
            </p>
            <div className="mt-4 p-6 rounded-2xl border" style={{ borderColor: "#E8ECF0", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#2196F3]" />
                  <span className={`${mono.className} text-sm text-[#0E2540]`}>
                    <a href="mailto:legal@youthplatformafrica.com" className="hover:underline text-[#2196F3]">legal@youthplatformafrica.com</a>
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
          </TermsSection>
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
                <Gavel className="w-10 h-10 mx-auto mb-3 text-[#2196F3]" />
                <h4 className={`${display.className} text-sm font-medium text-[#0E2540]`}>Legally Compliant</h4>
                <p className={`${mono.className} text-[10px] tracking-[0.05em] mt-1 text-[#5B6B7A]`}>Ugandan Law &amp; Regulations</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border shadow-sm" style={{ borderColor: "#E8ECF0" }}>
                <Heart className="w-10 h-10 mx-auto mb-3 text-[#F0B429]" />
                <h4 className={`${display.className} text-sm font-medium text-[#0E2540]`}>Community Trust</h4>
                <p className={`${mono.className} text-[10px] tracking-[0.05em] mt-1 text-[#5B6B7A]`}>1,000+ Members &amp; Growing</p>
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