"use client";

import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion } from "framer-motion";

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

// ============================================================
// YPA BRAND COLORS
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_LIGHT = "#33C1F5";
const GOLD = "#F0B429";
const VOID = "#0A0A0B";

// ============================================================
// SVG ICONS
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

  const columnLabel = "text-[11px] tracking-[0.14em] uppercase font-medium mb-4";
  const linkClass = "text-[13px] font-normal transition-colors duration-200";

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`${display.variable} ${mono.variable} ${inter.variable} relative font-sans antialiased overflow-hidden`}
      style={{ 
        background: `linear-gradient(180deg, ${VOID} 0%, #0F0F10 60%, ${VOID} 100%)`,
        borderTop: `1px solid ${GOLD}15`
      }}
    >
      {/* Ambient Glow - Blue & Gold */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] right-[-20%] w-[300px] h-[300px] rounded-full blur-3xl" style={{ background: `${YPA_BLUE}06` }} />
        <div className="absolute bottom-[-30%] left-[-20%] w-[300px] h-[300px] rounded-full blur-3xl" style={{ background: `${GOLD}04` }} />
      </div>

      <div className="relative container mx-auto px-5 sm:px-6 md:px-10 lg:px-14 max-w-6xl pt-14 sm:pt-18 pb-8 sm:pb-10 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12 pb-10 sm:pb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white shadow-sm">
                <Image
                  src="/images/ypa-logo.webp"
                  alt="YPA"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <span className={`${display.className} text-xl font-medium tracking-tight text-white block`}>
                  Youth Platform Africa
                </span>
                <span className="text-[10px] tracking-[0.15em] uppercase font-light" style={{ color: `${YPA_BLUE_LIGHT}50` }}>
                  discovering the genius in you
                </span>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed max-w-[19rem] font-light" style={{ color: "rgba(245,246,247,0.4)" }}>
              Empowering Africa&rsquo;s youth through sustainable agribusiness and financial inclusion.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border"
                    style={{ 
                      color: "rgba(255,255,255,0.3)",
                      borderColor: "rgba(255,255,255,0.06)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = YPA_BLUE_LIGHT;
                      e.currentTarget.style.borderColor = YPA_BLUE_LIGHT;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <h4 className={`${columnLabel} flex items-center gap-2`} style={{ color: "rgba(245,246,247,0.35)" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
              Explore
            </h4>
            <ul className="flex flex-col gap-1.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${linkClass} inline-block hover:text-white transition-colors`}
                    style={{ color: "rgba(245,246,247,0.5)" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <h4 className={`${columnLabel} flex items-center gap-2`} style={{ color: "rgba(245,246,247,0.35)" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: YPA_BLUE }} />
              Programmes
            </h4>
            <ul className="flex flex-col gap-1.5">
              {projectLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${linkClass} inline-block hover:text-white transition-colors`}
                    style={{ color: "rgba(245,246,247,0.5)" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources + Contact */}
          <div className="col-span-2 md:col-span-2 lg:col-span-3">
            <h4 className={`${columnLabel} flex items-center gap-2`} style={{ color: "rgba(245,246,247,0.35)" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: `${GOLD}50` }} />
              Resources
            </h4>
            <ul className="flex flex-col gap-1.5 mb-5">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${linkClass} inline-block hover:text-white transition-colors`}
                    style={{ color: "rgba(245,246,247,0.5)" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5 text-white/50">
              <a
                href="mailto:info@youthplatformafrica.com"
                className="flex items-center gap-3 text-sm font-light transition-colors duration-200 hover:text-[#33C1F5]"
              >
                <MailIcon className="w-4 h-4 text-white/20" />
                info@youthplatformafrica.com
              </a>
              <a
                href="tel:+256774313551"
                className="flex items-center gap-3 text-sm font-light transition-colors duration-200 hover:text-[#33C1F5]"
              >
                <PhoneIcon className="w-4 h-4 text-white/20" />
                +256 774 313 551
              </a>
              <div className="flex items-center gap-3 text-sm font-light">
                <MapPinIcon className="w-4 h-4 text-white/20" />
                Kampala, Uganda
              </div>
            </div>
          </div>
        </div>

        {/* Gold + Blue Gradient Divider */}
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}25, ${YPA_BLUE}25, transparent)` }} />

        {/* Bottom Bar */}
        <div className="flex flex-col gap-5 pt-6 md:flex-row md:items-center md:justify-between md:gap-4">
          <p className="text-[12px] text-center md:text-left" style={{ color: "rgba(245,246,247,0.3)" }}>
            &copy; {new Date().getFullYear()} Youth Platform Africa. All rights reserved.
            <span className="hidden sm:inline ml-2 text-[10px]" style={{ color: `${GOLD}30` }}>·</span>
            <span className="block sm:inline text-[10px] mt-1 sm:mt-0" style={{ color: `${YPA_BLUE}30` }}>
              Est. 2014
            </span>
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-[12px] transition-colors duration-200 hover:text-white/70"
                style={{ color: "rgba(245,246,247,0.3)" }}
              >
                Privacy Policy
              </Link>
              <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.06)" }} />
              <Link
                href="/terms"
                className="text-[12px] transition-colors duration-200 hover:text-white/70"
                style={{ color: "rgba(245,246,247,0.3)" }}
              >
                Terms of Service
              </Link>
            </div>

            <span className="hidden sm:block w-px h-3" style={{ background: "rgba(255,255,255,0.06)" }} />

            <Link
              href="https://jlx-branding.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-300"
            >
              <span className="text-[12px]" style={{ color: "rgba(245,246,247,0.35)" }}>
                Crafted by
              </span>
              <Image
                src="/images/jlx-logo.png"
                alt="JLX Branding Agency"
                width={52}
                height={20}
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.6 }}
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};