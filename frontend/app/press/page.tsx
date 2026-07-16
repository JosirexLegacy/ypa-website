"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Newspaper, 
  Tv, 
  Radio, 
  Printer, 
  Globe, 
  ExternalLink,
  Sparkles,
  Calendar,
  ArrowRight,
  Play,
  Image as ImageIcon,
  Tag,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// ===== PAGINATION SETTINGS =====
const ITEMS_PER_PAGE = 12;

async function getPressCoverage(page: number = 1, type?: string) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    let url = `http://localhost:8055/items/press?sort[]=-date&limit=${ITEMS_PER_PAGE}&offset=${offset}`;
    let countUrl = 'http://localhost:8055/items/press?aggregate[count]=*';
    
    if (type && type !== 'all') {
      url = `http://localhost:8055/items/press?filter[type][_eq]=${type}&sort[]=-date&limit=${ITEMS_PER_PAGE}&offset=${offset}`;
      countUrl = `http://localhost:8055/items/press?filter[type][_eq]=${type}&aggregate[count]=*`;
    }
    
    const [pressRes, countRes] = await Promise.all([
      fetch(url, { cache: 'no-store' }),
      fetch(countUrl, { cache: 'no-store' })
    ]);
    
    if (!pressRes.ok) return { press: [], total: 0, page: 1, totalPages: 0 };
    
    const pressData = await pressRes.json();
    const countData = await countRes.json();
    
    const total = countData.data?.[0]?.count || 0;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    
    return {
      press: pressData.data || [],
      total,
      page,
      totalPages
    };
  } catch (error) {
    console.error('Error fetching press coverage:', error);
    return { press: [], total: 0, page: 1, totalPages: 0 };
  }
}

const typeIcons = {
  tv: Tv,
  radio: Radio,
  print: Printer,
  online: Globe,
};

const typeLabels = {
  tv: 'TV',
  radio: 'Radio',
  print: 'Print',
  online: 'Online',
};

const typeColors = {
  tv: 'from-red-500/20 to-red-600/10 border-red-200 text-red-600',
  radio: 'from-blue-500/20 to-blue-600/10 border-blue-200 text-blue-600',
  print: 'from-purple-500/20 to-purple-600/10 border-purple-200 text-purple-600',
  online: 'from-green-500/20 to-green-600/10 border-green-200 text-green-600',
};

const typeBadgeColors = {
  tv: 'bg-red-100 text-red-700',
  radio: 'bg-blue-100 text-blue-700',
  print: 'bg-purple-100 text-purple-700',
  online: 'bg-green-100 text-green-700',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

// ===== PAGINATION COMPONENT =====
function Pagination({ 
  currentPage, 
  totalPages, 
  type 
}: { 
  currentPage: number; 
  totalPages: number; 
  type: string;
}) {
  const router = useRouter();
  
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (type !== 'all') params.set('type', type);
    if (page > 1) params.set('page', String(page));
    return `/press${params.toString() ? `?${params.toString()}` : ''}`;
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/50 hover:border-[#2196F3] hover:text-[#2196F3] transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
      
      {getPageNumbers().map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
            currentPage === page
              ? 'bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white shadow-md shadow-[#2196F3]/30'
              : 'bg-white/50 backdrop-blur-sm text-gray-500 hover:text-[#1A3A5C] hover:bg-white/80 border border-white/50'
          }`}
        >
          {page}
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/50 hover:border-[#2196F3] hover:text-[#2196F3] transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

export default function PressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const type = searchParams?.get('type') || 'all';
  const page = parseInt(searchParams?.get('page') || '1', 10);
  
  const [pressData, setPressData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPress = async () => {
      setLoading(true);
      const result = await getPressCoverage(page, type === 'all' ? undefined : type);
      setPressData(result.press);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setLoading(false);
    };
    fetchPress();
  }, [page, type]);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const getImageUrl = (imageId: string) => {
    if (!imageId) return '';
    return `http://localhost:8055/assets/${imageId}`;
  };

  const [allPressCount, setAllPressCount] = useState(0);
  
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('http://localhost:8055/items/press?aggregate[count]=*', { cache: 'no-store' });
        const data = await res.json();
        setAllPressCount(data.data?.[0]?.count || 0);
      } catch (e) {
        console.error('Error fetching count:', e);
      }
    };
    fetchCount();
  }, []);

  const categories = ['all', 'tv', 'radio', 'print', 'online'];
  
  const featuredPress = pressData.filter((item: any) => item.featured === true);
  const regularPress = pressData.filter((item: any) => item.featured !== true);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FBFF]">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#E3F2FD] border-t-[#2196F3] rounded-full mx-auto"
            />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FBFF] overflow-x-hidden">
      <Navigation />

      {/* ===== HERO - Compact ===== */}
      <section className="relative pt-24 pb-8 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0F7FE] via-white to-[#E8F4FD]"></div>
        <motion.div 
          className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] bg-[#E3F2FD] rounded-full blur-3xl opacity-60"
          animate={{ x: [0, 20, -10, 0], y: [0, -10, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#BBDEFB] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, -20, 10, 0], y: [0, 10, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative container mx-auto max-w-6xl">
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <motion.span 
                className="inline-flex items-center gap-2 text-[#2196F3] font-medium text-xs uppercase tracking-wider"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Newspaper className="w-4 h-4" />
                Press Coverage
              </motion.span>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-[#1A3A5C] tracking-tight mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                In the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2196F3] to-[#64B5F6]">News</span>
              </motion.h1>
              <motion.p 
                className="text-sm text-gray-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Media mentions and features about Youth Platform Africa
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="flex items-center gap-2 bg-white/80 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/50 shadow-sm"
                whileHover={{ scale: 1.03 }}
              >
                <span className="text-xs font-medium text-gray-400">{allPressCount || total} mentions</span>
              </motion.div>
              {featuredPress.length > 0 && page === 1 && (
                <motion.div 
                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#2196F3]/10 to-[#64B5F6]/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-[#2196F3]/20 shadow-sm"
                  whileHover={{ scale: 1.03 }}
                >
                  <Sparkles className="w-3 h-3 text-[#2196F3]" />
                  <span className="text-[10px] font-medium text-[#2196F3]">{featuredPress.length} featured</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS - Compact ===== */}
      <motion.section 
        ref={statsRef}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="px-6 py-4 border-b border-white/50 bg-white/30 backdrop-blur-sm"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: allPressCount || total, icon: Newspaper },
              { label: 'TV', value: pressData.filter((p: any) => p.type === 'tv').length, icon: Tv },
              { label: 'Online', value: pressData.filter((p: any) => p.type === 'online').length, icon: Globe },
              { label: 'Print/Radio', value: pressData.filter((p: any) => p.type === 'print' || p.type === 'radio').length, icon: Printer },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={i} 
                  variants={fadeInUp} 
                  transition={{ duration: 0.4, delay: i * 0.06 }} 
                  className="text-center bg-white/50 backdrop-blur-sm rounded-xl py-3 px-2 border border-white/50 shadow-sm"
                >
                  <Icon className="w-4 h-4 text-[#2196F3] mx-auto mb-0.5" />
                  <div className="text-lg font-bold text-[#1A3A5C]">{stat.value}</div>
                  <div className="text-[10px] text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ===== FILTERS - Compact ===== */}
      <section className="sticky top-20 z-30 bg-white/70 backdrop-blur-xl border-b border-white/50 px-6 py-2.5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/press${cat !== 'all' ? `?type=${cat}` : ''}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  type === cat
                    ? 'bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white shadow-md shadow-[#2196F3]/30'
                    : 'bg-white/50 backdrop-blur-sm text-gray-500 hover:text-[#1A3A5C] hover:bg-white/80 border border-white/50'
                }`}
              >
                {cat === 'all' ? 'All' : typeLabels[cat as keyof typeof typeLabels] || cat}
              </Link>
            ))}
          </div>
          
          {type !== 'all' && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 flex items-center gap-2 text-xs text-gray-400 bg-white/50 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit border border-white/50"
            >
              <span>Showing</span>
              <span className="font-semibold text-[#1A3A5C]">{typeLabels[type as keyof typeof typeLabels] || type}</span>
              <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
              <span>{total}</span>
              {totalPages > 1 && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                  <span>Page {page} of {totalPages}</span>
                </>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== FEATURED PRESS - Compact ===== */}
      {featuredPress.length > 0 && page === 1 && (
        <section className="px-6 py-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-4 h-4 text-[#2196F3]" />
              <h2 className="text-base font-bold text-[#1A3A5C]">Featured</h2>
              <span className="text-xs text-gray-400">({featuredPress.length})</span>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {featuredPress.map((item: any) => {
                const Icon = typeIcons[item.type as keyof typeof typeIcons] || Newspaper;
                const badgeColor = typeBadgeColors[item.type as keyof typeof typeBadgeColors] || 'bg-gray-100 text-gray-700';
                const imageUrl = item.image ? getImageUrl(item.image) : null;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -4 }}
                    className="group bg-white rounded-xl border border-white/50 shadow-md hover:shadow-xl transition-all duration-400 overflow-hidden"
                  >
                    <div className="relative">
                      {imageUrl && (
                        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm ${badgeColor}`}>
                              {typeLabels[item.type as keyof typeof typeLabels]}
                            </span>
                          </div>
                          {item.featured && (
                            <div className="absolute top-2 right-2">
                              <span className="bg-gradient-to-r from-[#2196F3] to-[#64B5F6] px-2 py-0.5 rounded-full text-white text-[9px] font-medium flex items-center gap-0.5 shadow-md shadow-[#2196F3]/30">
                                <Sparkles className="w-2.5 h-2.5" />
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          {!imageUrl && (
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${typeColors[item.type as keyof typeof typeColors]}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-medium text-gray-400">{typeLabels[item.type as keyof typeof typeLabels]}</span>
                            </div>
                          )}
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#1A3A5C] mt-2 group-hover:text-[#2196F3] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Award className="w-3 h-3 text-gray-300" />
                          {item.outlet}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{item.description}</p>
                        )}
                        <div className="mt-3">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-xs text-[#2196F3] font-medium hover:gap-1.5 transition-all"
                            >
                              Read Article <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <span className="text-xs text-gray-400">Coming soon</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== ALL PRESS - Compact ===== */}
      <section className={`px-6 py-6 ${featuredPress.length > 0 && page === 1 ? 'bg-[#F0F7FE]' : ''}`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Newspaper className="w-4 h-4 text-[#2196F3]" />
            <h2 className="text-base font-bold text-[#1A3A5C]">
              {type === 'all' ? 'All Mentions' : typeLabels[type as keyof typeof typeLabels] || type}
            </h2>
            <span className="text-xs text-gray-400">({total})</span>
          </motion.div>

          {regularPress.length === 0 && featuredPress.length === 0 ? (
            <motion.div 
              className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-3 opacity-30">📰</div>
              <h3 className="text-base font-medium text-[#1A3A5C]">No press coverage yet</h3>
              <p className="text-xs text-gray-400 mt-1">Check back soon for updates</p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {regularPress.map((item: any) => {
                  const Icon = typeIcons[item.type as keyof typeof typeIcons] || Newspaper;
                  const badgeColor = typeBadgeColors[item.type as keyof typeof typeBadgeColors] || 'bg-gray-100 text-gray-700';
                  const imageUrl = item.image ? getImageUrl(item.image) : null;
                  return (
                    <motion.div
                      key={item.id}
                      variants={fadeInUp}
                      transition={{ duration: 0.35 }}
                      whileHover={{ y: -3 }}
                      className="group bg-white rounded-lg border border-white/50 hover:shadow-lg transition-all duration-400 overflow-hidden"
                    >
                      {imageUrl && (
                        <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium shadow-sm ${badgeColor}`}>
                              {typeLabels[item.type as keyof typeof typeLabels]}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-3.5">
                        <div className="flex items-center justify-between">
                          {!imageUrl && (
                            <div className="flex items-center gap-1.5">
                              <div className={`p-1 rounded-lg bg-gradient-to-br ${typeColors[item.type as keyof typeof typeColors]}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[10px] font-medium text-gray-400">{typeLabels[item.type as keyof typeof typeLabels]}</span>
                            </div>
                          )}
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#1A3A5C] mt-1.5 group-hover:text-[#2196F3] transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.outlet}</p>
                        {item.description && (
                          <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                        )}
                        {item.link ? (
                          <Link
                            href={item.link}
                            target="_blank"
                            className="inline-flex items-center gap-1 mt-2 text-[10px] text-[#2196F3] font-medium hover:gap-1.5 transition-all"
                          >
                            Read <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        ) : (
                          <span className="inline-block mt-2 text-[10px] text-gray-400">Coming soon</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                type={type} 
              />
            </>
          )}
        </div>
      </section>

      {/* ===== CTA - Compact ===== */}
      <section className="px-6 py-12 bg-white border-t border-white/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="bg-white/50 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-md text-center"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Newspaper className="w-10 h-10 text-[#2196F3]/30 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#1A3A5C]">Media Inquiries?</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
              For press inquiries, interviews, or media partnerships
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-md shadow-[#2196F3]/30 hover:shadow-lg transition-all"
              >
                Contact our team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 