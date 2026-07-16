"use client";

import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

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

// ============================================================
// DESIGN TOKENS
// ============================================================
const INK = "#060B14";
const BLUE = "#2196F3";
const SKY = "#7EC8FF";
const MUTE_ON_LIGHT = "#5B6B7A";

// ============================================================
// CUSTOM SVG ICONS (no external dependencies)
// ============================================================
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
  </svg>
);

const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YouTubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// ===== TIKTOK CUSTOM ICON =====
const TikTokIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.223-.043 2.438.05 3.65.26v3.55c-.59-.086-1.18-.126-1.77-.116-1.16.02-2.31.25-3.39.68v9.44c0 1.44-.78 2.69-1.96 3.38-1.18.69-2.64.77-3.89.22-1.25-.55-2.1-1.75-2.17-3.11-.07-1.36.67-2.65 1.87-3.27 1.2-.62 2.69-.56 3.84.17v-3.83c-1.41-.22-2.85.02-4.12.74-1.27.72-2.24 1.86-2.68 3.21-.44 1.35-.31 2.82.37 4.07.68 1.25 1.85 2.16 3.24 2.54 1.39.38 2.89.25 4.18-.38 1.29-.63 2.22-1.75 2.58-3.08.11-.39.18-.79.21-1.2V0h.01z" />
  </svg>
);

const MailIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const SparklesIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export const Footer = () => {
  const socialLinks = [
    { icon: FacebookIcon, href: "#", label: "Facebook" },
    { icon: TwitterIcon, href: "#", label: "Twitter" },
    { icon: InstagramIcon, href: "#", label: "Instagram" },
    { icon: LinkedInIcon, href: "#", label: "LinkedIn" },
    { icon: YouTubeIcon, href: "#", label: "YouTube" },
    { icon: TikTokIcon, href: "#", label: "TikTok" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Sister Companies", href: "/sister-companies" },
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
    { name: "FAQ", href: "/about#faq" },
    { name: "Contact", href: "/contact" },
  ];

  const projectLinks = [
    { name: "Goats Project", href: "/projects/goats" },
    { name: "Maize Project", href: "/projects/maize" },
    { name: "Beekeeping", href: "/projects/beekeeping" },
    { name: "Planned Kids", href: "/projects/planned-kids" },
  ];

  const resourceLinks = [
    { name: "YPA SACCO", href: "/sacco" },
    { name: "Media", href: "/media" },
    { name: "FAQ", href: "/about#faq" },
    { name: "Careers", href: "/careers" },
  ];

  return (
    <footer
      className={`${display.variable} ${mono.variable} relative bg-[#0A1628] text-white overflow-hidden font-sans antialiased`}
      style={{ background: INK }}
    >
      {/* Decorative gradient blobs */}
      <div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: `${BLUE}30` }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: `${SKY}20` }}
      />

      <div className="relative container mx-auto px-6 max-w-7xl pt-20 pb-8">
        {/* ===== MAIN FOOTER CONTENT ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/ypa-logo.webp"
                  alt="YPA Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <span className={`${display.className} text-xl font-medium tracking-tight text-white`}>
                  YPA
                </span>
                <span
                  className={`${mono.className} block text-[10px] tracking-[0.15em] uppercase`}
                  style={{ color: SKY }}
                >
                  Youth Platform Africa
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#90CAF9" }}>
              Empowering Africa's youth through sustainable agribusiness practices and community development.
            </p>

            {/* Social Links – glass pill style */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 group"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#90CAF9",
                    }}
                  >
                    <Icon className="w-4 h-4 transition-colors duration-300 group-hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className={`${mono.className} text-[11px] tracking-[0.2em] uppercase font-semibold mb-5`}
              style={{ color: `${MUTE_ON_LIGHT}cc` }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${mono.className} text-sm transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 group`}
                    style={{ color: "#90CAF9" }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:ml-0">
                      <ArrowRightIcon className="w-3 h-3" />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h4
              className={`${mono.className} text-[11px] tracking-[0.2em] uppercase font-semibold mb-5`}
              style={{ color: `${MUTE_ON_LIGHT}cc` }}
            >
              Projects
            </h4>
            <ul className="space-y-3">
              {projectLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${mono.className} text-sm transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 group`}
                    style={{ color: "#90CAF9" }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:ml-0">
                      <ArrowRightIcon className="w-3 h-3" />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Contact */}
          <div>
            <h4
              className={`${mono.className} text-[11px] tracking-[0.2em] uppercase font-semibold mb-5`}
              style={{ color: `${MUTE_ON_LIGHT}cc` }}
            >
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${mono.className} text-sm transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 group`}
                    style={{ color: "#90CAF9" }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:ml-0">
                      <ArrowRightIcon className="w-3 h-3" />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact info – glass chip style */}
            <div className="mt-6 space-y-2">
              <a
                href="mailto:info@youthplatformafrica.com"
                className={`${mono.className} flex items-center gap-3 text-sm transition-all duration-300 hover:text-white group`}
                style={{ color: "#90CAF9" }}
              >
                <MailIcon className="w-4 h-4" />
                <span>info@youthplatformafrica.com</span>
              </a>
              <a
                href="tel:+256774313551"
                className={`${mono.className} flex items-center gap-3 text-sm transition-all duration-300 hover:text-white group`}
                style={{ color: "#90CAF9" }}
              >
                <PhoneIcon className="w-4 h-4" />
                <span>+256 774 313 551</span>
              </a>
            </div>
          </div>
        </div>

        {/* ===== DIVIDER WITH GLOW ===== */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 rounded-full" style={{ background: INK }}>
              <SparklesIcon className="w-5 h-5" style={{ color: `${BLUE}60` }} />
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR – updated with JLX logo ===== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <p className={`${mono.className} text-[11px] tracking-[0.05em]`} style={{ color: "#90CAF9" }}>
            © {new Date().getFullYear()} Youth Platform Africa. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs flex-wrap justify-center">
            <Link
              href="/privacy"
              className={`${mono.className} text-[11px] tracking-[0.05em] transition-colors duration-300`}
              style={{ color: "#90CAF9" }}
            >
              Privacy Policy
            </Link>
            <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.1)" }} />
            <Link
              href="/terms"
              className={`${mono.className} text-[11px] tracking-[0.05em] transition-colors duration-300`}
              style={{ color: "#90CAF9" }}
            >
              Terms of Service
            </Link>
            <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.1)" }} />
            <Link
              href="https://your-agency-website.com" // ← replace with your JLX website URL
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className={`${mono.className} text-[11px] tracking-[0.05em]`} style={{ color: "#90CAF9" }}>
                Crafted by
              </span>
              <Image
                src="/images/jlx-logo.png"
                alt="JLX Branding Agency"
                width={60}
                height={24}
                className="object-contain"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};