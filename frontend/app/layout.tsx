import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// ============================================================
// FONTS
// ============================================================
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
// METADATA
// ============================================================
export const metadata: Metadata = {
  title: {
    default: "Youth Platform Africa",
    template: "%s | Youth Platform Africa",
  },
  description:
    "Youth Platform Africa (YPA) empowers farmers through agribusiness, contract farming, and financial inclusion across Uganda and beyond.",
  keywords: [
    "Youth Platform Africa",
    "YPA",
    "Agribusiness",
    "Contract Farming",
    "Goats",
    "Maize",
    "SACCO",
    "Uganda",
    "Farmers",
    "Financial Inclusion",
  ],
  authors: [{ name: "Youth Platform Africa" }],
  creator: "Youth Platform Africa",
  publisher: "Youth Platform Africa",
  metadataBase: new URL("https://ypa-website-b3uh-ashy.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Youth Platform Africa",
    description:
      "Empowering Africa's youth through sustainable agribusiness and financial inclusion.",
    url: "https://ypa-website-b3uh-ashy.vercel.app",
    siteName: "Youth Platform Africa",
    locale: "en_UG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Youth Platform Africa",
    description:
      "Empowering Africa's youth through sustainable agribusiness and financial inclusion.",
    creator: "@ypa_africa",
    site: "@ypa_africa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ============================================================
// ROOT LAYOUT
// ============================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}