"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Building,
  Users,
  Award,
  Globe,
  ChevronRight,
  Search,
  Navigation as NavigationIcon,
  Calendar,
  Star,
  Sparkles,
  Zap,
  ExternalLink,
  MessageCircle,
  Car,
  Coffee,
  Wifi,
  ShoppingBag,
  Heart,
  Shield,
  CheckCircle,
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
const BLUE_DARK = "#0099D6";
const BLUE_LIGHT = "#33C1F5";
const BLUE_SOFT = "#E6F8FD";
const GOLD = "#F0B429";
const NAVY = "#0E2540";
const NAVY_SOFT = "#153455";
const INK = "#111111";
const MIST = "#F6F8FA";
const MUTE = "#5B6B7A";
const POSITIVE = "#34D399";
const WHATSAPP_GREEN = "#25D366";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";
const WHATSAPP_NUMBER = "256700000000"; // Replace with YPA's WhatsApp number
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// ============================================================
// BRANCH DATA (Static - can be moved to Directus later)
// ============================================================
const BRANCHES = [
  {
    id: 1,
    name: "Kampala Headquarters",
    region: "Central",
    address: "Plot 456, Lumumba Avenue, Kampala, Uganda",
    phone: "+256 700 000 001",
    email: "kampala@ypa.org",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM",
    services: ["Goats Programme", "Maize Contract Farming", "SACCO Services", "Veterinary Support"],
    coordinates: { lat: 0.3136, lng: 32.5811 },
    featured: true,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    amenities: ["Parking", "Wheelchair Access", "Refreshments"],
  },
  {
    id: 2,
    name: "Jinja Branch",
    region: "Eastern",
    address: "Plot 89, Main Street, Jinja, Uganda",
    phone: "+256 700 000 002",
    email: "jinja@ypa.org",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 1:00 PM",
    services: ["Goats Programme", "SACCO Services"],
    coordinates: { lat: 0.4344, lng: 33.2045 },
    featured: true,
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=80",
    amenities: ["Parking", "Refreshments"],
  },
  {
    id: 3,
    name: "Mbale Branch",
    region: "Eastern",
    address: "Plot 123, Bungokho Road, Mbale, Uganda",
    phone: "+256 700 000 003",
    email: "mbale@ypa.org",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    services: ["Maize Contract Farming", "SACCO Services"],
    coordinates: { lat: 1.0784, lng: 34.1810 },
    featured: false,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    amenities: ["Parking"],
  },
  {
    id: 4,
    name: "Gulu Branch",
    region: "Northern",
    address: "Plot 45, Gulu Main Road, Gulu, Uganda",
    phone: "+256 700 000 004",
    email: "gulu@ypa.org",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 1:00 PM",
    services: ["Goats Programme", "Veterinary Support"],
    coordinates: { lat: 2.7726, lng: 32.2981 },
    featured: false,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    amenities: ["Parking", "Wheelchair Access"],
  },
  {
    id: 5,
    name: "Mbarara Branch",
    region: "Western",
    address: "Plot 234, High Street, Mbarara, Uganda",
    phone: "+256 700 000 005",
    email: "mbarara@ypa.org",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM",
    services: ["Goats Programme", "Maize Contract Farming", "SACCO Services"],
    coordinates: { lat: -0.6072, lng: 30.6545 },
    featured: true,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    amenities: ["Parking", "Refreshments", "Wheelchair Access"],
  },
  {
    id: 6,
    name: "Fort Portal Branch",
    region: "Western",
    address: "Plot 67, Rukungiri Road, Fort Portal, Uganda",
    phone: "+256 700 000 006",
    email: "fortportal@ypa.org",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    services: ["Maize Contract Farming", "SACCO Services"],
    coordinates: { lat: 0.6717, lng: 30.2750 },
    featured: false,
    image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80",
    amenities: ["Parking"],
  },
  {
    id: 7,
    name: "Masaka Branch",
    region: "Central",
    address: "Plot 89, Kampala Road, Masaka, Uganda",
    phone: "+256 700 000 007",
    email: "masaka@ypa.org",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 1:00 PM",
    services: ["Goats Programme", "SACCO Services"],
    coordinates: { lat: -0.3352, lng: 31.7359 },
    featured: false,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    amenities: ["Parking", "Refreshments"],
  },
  {
    id: 8,
    name: "Lira Branch",
    region: "Northern",
    address: "Plot 34, Obote Avenue, Lira, Uganda",
    phone: "+256 700 000 008",
    email: "lira@ypa.org",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    services: ["Maize Contract Farming", "Veterinary Support"],
    coordinates: { lat: 2.2498, lng: 32.8973 },
    featured: false,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    amenities: ["Parking"],
  },
  {
    id: 9,
    name: "Hoima Branch",
    region: "Western",
    address: "Plot 56, Main Street, Hoima, Uganda",
    phone: "+256 700 000 009",
    email: "hoima@ypa.org",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    services: ["Goats Programme", "SACCO Services"],
    coordinates: { lat: 1.4312, lng: 31.3437 },
    featured: false,
    image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80",
    amenities: ["Parking", "Wheelchair Access"],
  },
  {
    id: 10,
    name: "Tororo Branch",
    region: "Eastern",
    address: "Plot 78, Tororo-Kampala Road, Tororo, Uganda",
    phone: "+256 700 000 010",
    email: "tororo@ypa.org",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    services: ["Maize Contract Farming"],
    coordinates: { lat: 0.6929, lng: 34.1809 },
    featured: false,
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=80",
    amenities: ["Parking"],
  },
  {
    id: 11,
    name: "Entebbe Branch",
    region: "Central",
    address: "Plot 12, Airport Road, Entebbe, Uganda",
    phone: "+256 700 000 011",
    email: "entebbe@ypa.org",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM",
    services: ["SACCO Services", "Veterinary Support"],
    coordinates: { lat: 0.0512, lng: 32.4637 },
    featured: false,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    amenities: ["Parking", "Refreshments", "Wheelchair Access"],
  },
  {
    id: 12,
    name: "Arua Branch",
    region: "Northern",
    address: "Plot 45, Avenue Road, Arua, Uganda",
    phone: "+256 700 000 012",
    email: "arua@ypa.org",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    services: ["Goats Programme", "Maize Contract Farming"],
    coordinates: { lat: 3.0294, lng: 30.9097 },
    featured: false,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    amenities: ["Parking"],
  },
];

// ============================================================
// REGIONS FOR FILTERING
// ============================================================
const REGIONS = ["All", "Central", "Eastern", "Western", "Northern"];

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
export default function BranchesPage() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<typeof BRANCHES[0] | null>(null);

  // Filter branches
  const filteredBranches = BRANCHES.filter((branch) => {
    const matchesRegion = selectedRegion === "All" || branch.region === selectedRegion;
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  // Featured branches
  const featuredBranches = BRANCHES.filter((b) => b.featured);

  // Get unique regions from branches
  const regions = ["All", ...new Set(BRANCHES.map((b) => b.region))];

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
              <MapPin className="w-4 h-4" style={{ color: BLUE_LIGHT }} />
              Our Locations
            </span>
            <h1 className={`${display.className} text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.05] tracking-tight`}>
              Find a YPA Branch
              <span
                className="block text-transparent bg-clip-text mt-1"
                style={{ backgroundImage: `linear-gradient(90deg, ${BLUE_LIGHT}, ${BLUE}, ${GOLD})` }}
              >
                Near You
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/50 mt-5 max-w-xl mx-auto font-light leading-relaxed">
              Visit any of our 12 branches across Uganda to start your agribusiness journey with YPA.
            </p>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by branch, address, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 rounded-2xl text-white bg-white/10 backdrop-blur-sm border border-white/20 focus:border-white/40 focus:outline-none transition-all placeholder:text-white/30"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-6 py-4 rounded-2xl text-white bg-white/10 backdrop-blur-sm border border-white/20 focus:border-white/40 focus:outline-none transition-all appearance-none cursor-pointer min-w-[150px]"
              >
                {regions.map((region) => (
                  <option key={region} value={region} className="text-black">
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8 text-white/60">
              <div className="text-center">
                <div className={`${display.className} text-2xl font-medium text-white`}>{BRANCHES.length}</div>
                <div className="text-xs tracking-wide uppercase">Branches</div>
              </div>
              <div className="text-center">
                <div className={`${display.className} text-2xl font-medium text-white`}>12</div>
                <div className="text-xs tracking-wide uppercase">Regions</div>
              </div>
              <div className="text-center">
                <div className={`${display.className} text-2xl font-medium text-white`}>24/7</div>
                <div className="text-xs tracking-wide uppercase">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          FEATURED BRANCHES
      ============================================================ */}
      {featuredBranches.length > 0 && searchTerm === "" && selectedRegion === "All" && (
        <section className="px-6 md:px-14 py-16" style={{ background: MIST }}>
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-6"
            >
              <Star className="w-5 h-5" style={{ color: GOLD }} />
              <span className={`${mono.className} text-[11px] font-medium tracking-[0.25em] uppercase`} style={{ color: GOLD }}>
                Featured Branches
              </span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBranches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="group bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                    style={{ borderColor: "#E8ECF0" }}
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={branch.image}
                        alt={branch.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80";
                        }}
                      />
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase"
                        style={{ background: `${GOLD}ee`, color: "#fff" }}
                      >
                        Featured
                      </div>
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1/2"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
                      />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white">
                          {branch.region}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className={`${display.className} text-lg font-medium text-[#111111]`}>{branch.name}</h3>
                      <p className="text-sm text-[#5B6B7A] mt-1 line-clamp-2">{branch.address}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {branch.services.slice(0, 2).map((service, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: `${BLUE}12`, color: BLUE }}
                          >
                            {service}
                          </span>
                        ))}
                        {branch.services.length > 2 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-[#5B6B7A] bg-[#F6F8FA]">
                            +{branch.services.length - 2} more
                          </span>
                        )}
                      </div>
                      <button
                        className="mt-4 text-sm font-medium flex items-center gap-1 transition-colors hover:gap-2"
                        style={{ color: BLUE }}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          ALL BRANCHES LIST
      ============================================================ */}
      <section className="px-6 md:px-14 py-16">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className={`${display.className} text-xl font-medium`} style={{ color: INK }}>
              {filteredBranches.length} Branches {selectedRegion !== "All" && `in ${selectedRegion}`}
            </h2>
            <span className="text-sm text-[#5B6B7A]">
              {searchTerm ? `Search: "${searchTerm}"` : "All locations"}
            </span>
          </motion.div>

          {filteredBranches.length === 0 ? (
            <div className="text-center py-16 bg-[#F6F8FA] rounded-2xl">
              <MapPin className="w-12 h-12 mx-auto text-[#5B6B7A] opacity-30" />
              <p className="text-[#5B6B7A] mt-4">No branches found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRegion("All");
                }}
                className="mt-2 text-sm font-medium"
                style={{ color: BLUE }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBranches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <div
                    className="group p-5 bg-white rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                    style={{ borderColor: "#E8ECF0" }}
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className={`${display.className} text-base font-medium text-[#111111]`}>
                            {branch.name}
                          </h3>
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: `${BLUE}12`, color: BLUE }}
                          >
                            {branch.region}
                          </span>
                          {branch.featured && (
                            <Star className="w-4 h-4" style={{ color: GOLD }} />
                          )}
                        </div>
                        <p className="text-sm text-[#5B6B7A] mt-1">{branch.address}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#5B6B7A]">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {branch.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {branch.hours.split(",")[0]}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {branch.services.map((service, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                              style={{ background: `${BLUE}08`, color: MUTE }}
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${branch.phone}`}
                          className="p-2 rounded-xl hover:bg-[#F6F8FA] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-4 h-4 text-[#5B6B7A] hover:text-[#00AEEF]" />
                        </a>
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl hover:bg-[#F6F8FA] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <WhatsAppIcon />
                        </a>
                        <button
                          className="p-2 rounded-xl hover:bg-[#F6F8FA] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBranch(branch);
                          }}
                        >
                          <ChevronRight className="w-5 h-5 text-[#5B6B7A] group-hover:text-[#00AEEF] transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          MAP / CTA SECTION
      ============================================================ */}
      <section className="px-6 md:px-14 py-20" style={{ background: NAVY }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-4xl text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl border flex items-center justify-center" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
            <Globe className="w-7 h-7" style={{ color: BLUE_LIGHT }} />
          </div>
          <h2 className={`${display.className} text-2xl md:text-3xl font-medium text-white`}>
            Can't find a branch near you?
          </h2>
          <p className="text-white/40 text-sm mt-2 max-w-md mx-auto font-light">
            We're expanding across Uganda. Contact us to find out when we'll be in your area.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
              style={{ background: BLUE, boxShadow: `0 20px 40px -12px ${BLUE}66` }}
            >
              <Mail className="w-4 h-4" />
              Contact Us
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
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>

      {/* ============================================================
          BRANCH DETAIL MODAL
      ============================================================ */}
      {selectedBranch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setSelectedBranch(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedBranch(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-[#F6F8FA] hover:bg-[#E8ECF0] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative h-56 rounded-2xl overflow-hidden mb-6">
              <img
                src={selectedBranch.image}
                alt={selectedBranch.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80";
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-4"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
              >
                <h3 className={`${display.className} text-xl font-medium text-white`}>{selectedBranch.name}</h3>
                <span className="text-sm text-white/70">{selectedBranch.region}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F6F8FA]">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: BLUE }} />
                  <div>
                    <p className="text-[10px] font-medium tracking-wide uppercase text-[#5B6B7A]">Address</p>
                    <p className="text-sm text-[#111111]">{selectedBranch.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F6F8FA]">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: BLUE }} />
                  <div>
                    <p className="text-[10px] font-medium tracking-wide uppercase text-[#5B6B7A]">Phone</p>
                    <a href={`tel:${selectedBranch.phone}`} className="text-sm text-[#111111] hover:text-[#00AEEF] transition-colors">
                      {selectedBranch.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F6F8FA]">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: BLUE }} />
                  <div>
                    <p className="text-[10px] font-medium tracking-wide uppercase text-[#5B6B7A]">Hours</p>
                    <p className="text-sm text-[#111111]">{selectedBranch.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F6F8FA]">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: BLUE }} />
                  <div>
                    <p className="text-[10px] font-medium tracking-wide uppercase text-[#5B6B7A]">Email</p>
                    <a href={`mailto:${selectedBranch.email}`} className="text-sm text-[#111111] hover:text-[#00AEEF] transition-colors">
                      {selectedBranch.email}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <p className={`${mono.className} text-[10px] font-medium tracking-wide uppercase text-[#5B6B7A] mb-2`}>
                  Services Offered
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedBranch.services.map((service, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ background: `${BLUE}12`, color: BLUE }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {selectedBranch.amenities && (
                <div>
                  <p className={`${mono.className} text-[10px] font-medium tracking-wide uppercase text-[#5B6B7A] mb-2`}>
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBranch.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-sm"
                        style={{ background: "#F6F8FA", color: MUTE }}
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "#E8ECF0" }}>
                <a
                  href={`tel:${selectedBranch.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                  style={{ background: BLUE }}
                >
                  <Phone className="w-4 h-4" />
                  Call Branch
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
                  style={{
                    background: WHATSAPP_GREEN,
                    color: "#fff",
                  }}
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </main>
  );
}