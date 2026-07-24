"use client";

import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// ============================================================
// FONTS - Modern & Formal
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
// YPA BRAND COLORS
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_DARK = "#0099D6";
const YPA_BLUE_LIGHT = "#33C1F5";
const YPA_BLUE_SOFT = "#E6F8FD";
const YPA_GOLD = "#F0B429";
const NAVY = "#0E2540";
const NAVY_SOFT = "#153455";

// ============================================================
// CUSTOM SVG ICONS
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
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
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

const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

export const Footer = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { name: "Contact", href: "/contact" },
  ];

  const projectLinks = [
    { name: "Goats Programme", href: "/projects/goats" },
    { name: "Maize Programme", href: "/projects/maize" },
    { name: "YPA SACCO", href: "/sacco" },
  ];

  const resourceLinks = [
    { name: "Gallery", href: "/gallery" },
    { name: "Team", href: "/team" },
    { name: "Press", href: "/press" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer
      className={`${display.variable} ${mono.variable} ${inter.variable} relative overflow-hidden font-sans antialiased`}
      style={{
        background: "rgba(14,37,64,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -20px 60px rgba(0,0,0,0.3)",
      }}
    >
      {/* ===== GLASSY BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Diagonal gradient stripes */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent 0%,
                transparent 20%,
                ${YPA_BLUE}04 20%,
                ${YPA_BLUE}08 22%,
                ${YPA_BLUE}04 24%,
                transparent 24%,
                transparent 40%
              )
            `,
          }}
          animate={mounted ? {
            backgroundPosition: ["0% 0%", "100% 100%"],
          } : {}}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Glowing orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: `${YPA_BLUE}15` }}
          animate={mounted ? {
            scale: [1, 1.2, 0.8, 1],
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
          } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: `${YPA_GOLD}10` }}
          animate={mounted ? {
            scale: [1, 0.7, 1.2, 1],
            x: [0, -40, 30, 0],
            y: [0, 40, -30, 0],
          } : {}}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `${YPA_BLUE_LIGHT}06` }}
          animate={mounted ? {
            scale: [1, 1.3, 0.9, 1],
          } : {}}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, ${YPA_BLUE}05 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            opacity: 0.3,
          }}
        />
      </div>

      <div className="relative container mx-auto px-6 max-w-7xl pt-16 pb-8">
        {/* ===== MAIN FOOTER CONTENT ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-14">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 space-y-4">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_DARK})`,
                  boxShadow: `0 8px 32px ${YPA_BLUE}40`,
                }}
              >
                <Image
                  src="/images/ypa-logo.webp"
                  alt="YPA Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <div className="flex flex-col">
                <span className={`${display.className} text-2xl font-medium tracking-tight text-white leading-none`}>
                  YPA
                </span>
                <span
                  className={`${mono.className} text-[9px] tracking-[0.15em] uppercase font-medium`}
                  style={{ color: YPA_BLUE_LIGHT }}
                >
                  Youth Platform Africa
                </span>
              </div>
            </motion.div>

            <motion.p
              className="text-sm leading-relaxed max-w-xs font-light"
              style={{ color: "rgba(255,255,255,0.6)" }}
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Empowering Africa's youth through sustainable agribusiness and financial inclusion.
            </motion.p>

            {/* Social Links */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 group"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                    whileHover={{
                      background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_LIGHT})`,
                      color: "#FFFFFF",
                      boxShadow: `0 8px 24px ${YPA_BLUE}30`,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-3.5 h-3.5 transition-colors duration-300" />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4
              className={`${mono.className} text-[10px] tracking-[0.2em] uppercase font-semibold mb-5`}
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${inter.className} text-sm font-light transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 group`}
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:ml-0 text-[#00AEEF]">
                      <ArrowRightIcon className="w-3 h-3" />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4
              className={`${mono.className} text-[10px] tracking-[0.2em] uppercase font-semibold mb-5`}
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Programmes
            </h4>
            <ul className="space-y-2.5">
              {projectLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${inter.className} text-sm font-light transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 group`}
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:ml-0 text-[#00AEEF]">
                      <ArrowRightIcon className="w-3 h-3" />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4
              className={`${mono.className} text-[10px] tracking-[0.2em] uppercase font-semibold mb-5`}
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Resources
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${inter.className} text-sm font-light transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 group`}
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:ml-0 text-[#00AEEF]">
                      <ArrowRightIcon className="w-3 h-3" />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-2.5">
              <a
                href="mailto:info@youthplatformafrica.com"
                className={`${inter.className} flex items-center gap-3 text-sm font-light transition-all duration-300 hover:text-[#00AEEF] group`}
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/5">
                  <MailIcon className="w-3.5 h-3.5" />
                </div>
                <span>info@youthplatformafrica.com</span>
              </a>
              <a
                href="tel:+256774313551"
                className={`${inter.className} flex items-center gap-3 text-sm font-light transition-all duration-300 hover:text-[#00AEEF] group`}
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/5">
                  <PhoneIcon className="w-3.5 h-3.5" />
                </div>
                <span>+256 774 313 551</span>
              </a>
              <div
                className={`${inter.className} flex items-center gap-3 text-sm font-light`}
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/5">
                  <MapPinIcon className="w-3.5 h-3.5" />
                </div>
                <span>Kampala, Uganda</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== DIVIDER ===== */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="relative flex justify-center">
            <div
              className="px-4 rounded-full"
              style={{
                background: "rgba(14,37,64,0.6)",
                backdropFilter: "blur(10px)",
              }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: YPA_BLUE }}
                animate={mounted ? {
                  scale: [1, 2, 1],
                  boxShadow: [
                    `0 0 0 0 ${YPA_BLUE}00`,
                    `0 0 30px ${YPA_BLUE}40`,
                    `0 0 0 0 ${YPA_BLUE}00`,
                  ],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <p className={`${mono.className} text-[10px] tracking-[0.05em]`} style={{ color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} Youth Platform Africa. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
            <Link
              href="/privacy"
              className={`${mono.className} text-[10px] tracking-[0.05em] transition-colors duration-300 hover:text-[#00AEEF]`}
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Privacy Policy
            </Link>
            <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.06)" }} />
            <Link
              href="/terms"
              className={`${mono.className} text-[10px] tracking-[0.05em] transition-colors duration-300 hover:text-[#00AEEF]`}
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Terms of Service
            </Link>
            <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.06)" }} />
            <Link
              href="https://jlx-branding.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className={`${mono.className} text-[10px] tracking-[0.05em]`} style={{ color: "rgba(255,255,255,0.3)" }}>
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