"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Menu,
  X
} from 'lucide-react';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Menu structure - updated with "Our Team"
  const menuItems = {
    about: {
      items: [
        { name: "Our Story", href: "/about" },
        { name: "Mission & Vision", href: "/about#mission" },
        { name: "Leadership", href: "/about#team" },
        { name: "Our Team", href: "/team" },
        { name: "Credentials", href: "/about#credentials" },
      ]
    },
    projects: {
      items: [
        { name: "Goats", href: "/projects/goats" },
        { name: "Maize", href: "/projects/maize" },
        { name: "Beekeeping", href: "/projects/beekeeping" },
        { name: "Planned Kids", href: "/projects/planned-kids" },
      ]
    },
    ecosystem: {
      items: [
        { name: "Mbuzi Choma", href: "/sister-companies/mbuzi-choma" },
        { name: "YPA SACCO", href: "/sister-companies/ypa-sacco" },
        { name: "Machinery Hub", href: "/sister-companies/machinery-hub" },
        { name: "Agribusiness School", href: "/sister-companies/agribusiness-school" },
      ]
    },
    branches: {
      items: [
        { name: "Rubaga (HQ)", href: "/branches/rubaga" },
        { name: "Nansana", href: "/branches/nansana" },
        { name: "Mbarara", href: "/branches/mbarara" },
        { name: "Masaka", href: "/branches/masaka" },
        { name: "Gomba", href: "/branches/gomba" },
        { name: "Dubai", href: "/branches/dubai" },
        { name: "Zambia", href: "/branches/zambia" },
      ]
    },
    media: {
      items: [
        { name: "Blog", href: "/blog" },
        { name: "Events", href: "/events" },
        { name: "Gallery", href: "/gallery" },
        { name: "Press", href: "/press" },
      ]
    }
  };

  const mainNav = [
    { name: "Home", href: "/" },
    { name: "About", dropdown: "about" },
    { name: "Projects", dropdown: "projects" },
    { name: "Ecosystem", dropdown: "ecosystem" },
    { name: "Branches", dropdown: "branches" },
    { name: "Media", dropdown: "media" },
    { name: "Contact", href: "/contact" },
  ];

  // Brand red (subtle, fiery)
  const RED_GLOW = "rgba(229, 57, 53, 0.25)";
  const RED_FIRE = "rgba(229, 57, 53, 0.4)";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-[#F0F0F0] shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* ===== LOGO ===== */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative">
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <Image 
                  src="/images/ypa-logo.webp" 
                  alt="YPA" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm md:text-base font-semibold text-[#1A3A5C] leading-none">
                YPA
              </span>
              <span className="block text-[9px] md:text-[10px] font-light text-[#676767] tracking-[0.15em] uppercase">
                Youth Platform Africa
              </span>
            </div>
          </Link>

          {/* ===== DESKTOP NAVIGATION ===== */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNav.map((item) => (
              <div 
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.dropdown)}
                onMouseLeave={handleMouseLeave}
              >
                {item.dropdown ? (
                  <button 
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-light transition-all duration-300 rounded-md ${
                      activeDropdown === item.dropdown 
                        ? 'text-[#1A3A5C]' 
                        : 'text-[#676767] hover:text-[#1A3A5C]'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                      activeDropdown === item.dropdown ? 'rotate-180' : ''
                    }`} />
                    {/* 🔥 Subtle red glow on hover */}
                    <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                          style={{ boxShadow: `0 0 30px ${RED_GLOW}` }} />
                  </button>
                ) : (
                  <Link 
                    href={item.href || '#'} // ✅ FIXED: fallback to '#' if href is undefined
                    className={`relative px-3 py-2 text-sm font-light transition-all duration-300 rounded-md ${
                      item.name === "Home" && !isScrolled
                        ? 'text-white hover:text-white/80'
                        : 'text-[#676767] hover:text-[#1A3A5C]'
                    }`}
                  >
                    {item.name}
                    {/* 🔥 Subtle red glow on hover */}
                    <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                          style={{ boxShadow: `0 0 30px ${RED_GLOW}` }} />
                  </Link>
                )}

                {/* Dropdown - with red accent on hover */}
                {item.dropdown && activeDropdown === item.dropdown && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-[#F0F0F0] overflow-hidden"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <div className="py-2">
                      {menuItems[item.dropdown as keyof typeof menuItems]?.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="group block px-5 py-2.5 text-sm text-[#676767] hover:text-[#1A3A5C] hover:bg-[#F5F9FF] transition-all duration-200 relative"
                        >
                          <span className="flex items-center gap-2">
                            {/* 🔥 Red accent dot that appears on hover */}
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#E53935] transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(229,57,53,0.5)]" />
                            {subItem.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ===== RIGHT SIDE ===== */}
          <div className="flex items-center gap-4 shrink-0">
            <Link 
              href="/contact"
              className={`hidden md:flex px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'bg-[#1A3A5C] text-white hover:bg-[#1A3A5C]/90 hover:shadow-[0_0_25px_rgba(229,57,53,0.2)]'
                  : 'bg-white text-[#1A3A5C] hover:bg-white/90 shadow-sm hover:shadow-[0_0_25px_rgba(229,57,53,0.15)]'
              }`}
            >
              Get Started
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                isScrolled || mobileMenuOpen
                  ? 'text-[#1A3A5C] hover:bg-[#F5F9FF]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ===== MOBILE MENU – with red accent ===== */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white rounded-xl shadow-lg border border-[#F0F0F0] mb-4"
            >
              <div className="py-2 max-h-[70vh] overflow-y-auto">
                {mainNav.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div>
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === item.dropdown ? null : item.dropdown)}
                          className="flex items-center justify-between w-full px-5 py-3 text-sm text-[#676767] hover:text-[#1A3A5C] hover:bg-[#F5F9FF] transition-all duration-200"
                        >
                          <span>{item.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                            activeDropdown === item.dropdown ? 'rotate-180' : ''
                          }`} />
                        </button>
                        {activeDropdown === item.dropdown && (
                          <div className="bg-[#FAFAFA] border-t border-[#F0F0F0]">
                            {menuItems[item.dropdown as keyof typeof menuItems]?.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-8 py-2.5 text-sm text-[#676767] hover:text-[#1A3A5C] hover:bg-[#F5F9FF] transition-all duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href || '#'} // ✅ FIXED: fallback for mobile as well
                        className="block px-5 py-3 text-sm text-[#676767] hover:text-[#1A3A5C] hover:bg-[#F5F9FF] transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="border-t border-[#F0F0F0] px-5 py-4">
                  <Link 
                    href="/contact"
                    className="w-full px-4 py-3 bg-[#1A3A5C] text-white text-sm font-medium rounded-xl flex items-center justify-center hover:bg-[#1A3A5C]/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,57,53,0.15)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;