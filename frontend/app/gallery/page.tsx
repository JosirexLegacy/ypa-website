"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  ZoomIn, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Grid3x3,
  LayoutGrid,
  Tag,
  Calendar,
  MapPin,
  Star,
  Zap,
  Award,
  Loader2
} from 'lucide-react';

// ============================================================
// BRAND COLORS
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_LIGHT = "#33C1F5";
const GOLD = "#F0B429";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// FALLBACK IMAGES
// ============================================================
const FALLBACK_IMAGES = {
  gallery: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=900&q=80',
  default: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=900&q=80'
};

// ============================================================
// FALLBACK GALLERY DATA
// ============================================================
const FALLBACK_GALLERY = [
  {
    id: '1',
    title: 'Goats Programme - Central Region',
    description: 'Mubende × Boer × Kalahari goats thriving under YPA care',
    category: 'goats',
    image: 'https://images.unsplash.com/photo-1535268647677-300d0a4c3b7b?w=900&q=80',
    featured: true,
    location: 'Central Region, Uganda',
    date_created: '2026-07-15'
  },
  {
    id: '2',
    title: 'Maize Harvest Season',
    description: 'Farmers celebrating a successful contract farming season',
    category: 'maize',
    image: 'https://images.unsplash.com/photo-1593250481214-81611f9bca0f?w=800&q=80',
    featured: true,
    location: 'Western Region, Uganda',
    date_created: '2026-07-12'
  },
  {
    id: '3',
    title: 'YPA SACCO Members',
    description: 'Members gathering for quarterly savings review',
    category: 'sacco',
    image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&q=80',
    featured: true,
    location: 'Kampala, Uganda',
    date_created: '2026-07-10'
  },
  {
    id: '4',
    title: 'Goat Vaccination Drive',
    description: 'Veterinary team vaccinating goats across 12 branches',
    category: 'goats',
    image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&q=80',
    featured: false,
    location: 'Eastern Region, Uganda',
    date_created: '2026-07-08'
  },
  {
    id: '5',
    title: 'Contract Farming Workshop',
    description: 'Training farmers on modern maize cultivation techniques',
    category: 'maize',
    image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&q=80',
    featured: false,
    location: 'Northern Region, Uganda',
    date_created: '2026-07-05'
  },
  {
    id: '6',
    title: 'YPA Branch Opening',
    description: 'New branch opening ceremony in Masaka',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&q=80',
    featured: false,
    location: 'Masaka, Uganda',
    date_created: '2026-07-01'
  }
];

// ============================================================
// CONSTANTS
// ============================================================
const ITEMS_PER_PAGE = 20; // Reduced for better performance
const SCROLL_THRESHOLD = 300;

// ============================================================
// MAIN GALLERY PAGE
// ============================================================
export default function GalleryPage() {
  const [allImages, setAllImages] = useState<any[]>([]);
  const [displayedImages, setDisplayedImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // FETCH IMAGES
  // ============================================================
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_URL}/items/gallery`, {
          cache: 'no-store'
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.data && data.data.length > 0) {
          setAllImages(data.data);
          const initialBatch = data.data.slice(0, ITEMS_PER_PAGE);
          setDisplayedImages(initialBatch);
          setHasMore(data.data.length > ITEMS_PER_PAGE);
        } else {
          setAllImages(FALLBACK_GALLERY);
          setDisplayedImages(FALLBACK_GALLERY.slice(0, ITEMS_PER_PAGE));
          setHasMore(FALLBACK_GALLERY.length > ITEMS_PER_PAGE);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setAllImages(FALLBACK_GALLERY);
        setDisplayedImages(FALLBACK_GALLERY.slice(0, ITEMS_PER_PAGE));
        setHasMore(FALLBACK_GALLERY.length > ITEMS_PER_PAGE);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);

  // ============================================================
  // INFINITE SCROLL - Optimized with Intersection Observer
  // ============================================================
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loadingMore, page, allImages]);

  const loadMoreImages = useCallback(() => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    
    // Use requestAnimationFrame for smooth loading
    requestAnimationFrame(() => {
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newBatch = allImages.slice(startIndex, endIndex);
      
      if (newBatch.length > 0) {
        setDisplayedImages(prev => [...prev, ...newBatch]);
        setPage(prev => prev + 1);
        setHasMore(endIndex < allImages.length);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    });
  }, [hasMore, loadingMore, page, allImages]);

  // ============================================================
  // FILTER IMAGES BY CATEGORY
  // ============================================================
  const filteredImages = useMemo(() => {
    let filtered = displayedImages;
    if (activeCategory !== 'all') {
      filtered = filtered.filter((item: any) => item.category === activeCategory);
    }
    return filtered;
  }, [displayedImages, activeCategory]);

  // ============================================================
  // HELPERS
  // ============================================================
  const getImageUrl = (image: string | undefined) => {
    if (!image) return FALLBACK_IMAGES.gallery;
    if (image.startsWith('http')) return image;
    return `${API_URL}/assets/${image}`;
  };

  // ============================================================
  // KEYBOARD NAVIGATION
  // ============================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') setSelectedItem(null);
      if (e.key === 'ArrowLeft') {
        const currentIndex = filteredImages.findIndex(i => i.id === selectedItem.id);
        const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        setSelectedItem(filteredImages[prevIndex]);
      }
      if (e.key === 'ArrowRight') {
        const currentIndex = filteredImages.findIndex(i => i.id === selectedItem.id);
        const nextIndex = (currentIndex + 1) % filteredImages.length;
        setSelectedItem(filteredImages[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, filteredImages]);

  // ============================================================
  // CATEGORIES
  // ============================================================
  const categories = useMemo(() => {
    return ['all', ...new Set(allImages.map(item => item.category).filter(Boolean))];
  }, [allImages]);

  const featuredItems = useMemo(() => {
    return allImages.filter((item: any) => item.featured === true);
  }, [allImages]);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-3 border-[#00AEEF]/30 border-t-[#00AEEF] rounded-full"
          />
        </div>
        <Footer />
      </main>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      <Navigation />

      {/* ===== HERO ===== */}
      <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 px-5 md:px-14 bg-gradient-to-b from-[#E6F8FD] to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-[#00AEEF] text-xs font-medium uppercase tracking-wider bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#00AEEF]/20 shadow-sm">
                <Camera className="w-3.5 h-3.5" />
                Gallery
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] mt-3 leading-tight">
                Visual <br className="block md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] to-[#33C1F5]">Journey</span>
              </h1>
              <p className="text-sm text-[#5B6B7A] mt-1.5 max-w-xl">
                {allImages.length.toLocaleString()} images from YPA's journey across Africa
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#E8ECF0] text-xs text-[#5B6B7A] shadow-sm">
                <span>{allImages.length} items</span>
              </div>
              {featuredItems.length > 0 && (
                <div className="flex items-center gap-1.5 bg-[#F0B429]/10 px-3.5 py-1.5 rounded-full border border-[#F0B429]/20 text-xs text-[#F0B429]">
                  <Award className="w-3.5 h-3.5" />
                  <span>{featuredItems.length} featured</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTERS ===== */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8ECF0] py-3 px-5 md:px-14">
        <div className="container mx-auto max-w-6xl flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1.5 md:gap-2 flex-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 md:px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#00AEEF] text-white shadow-sm shadow-[#00AEEF]/20'
                    : 'text-[#5B6B7A] hover:text-[#111111] hover:bg-[#F6F8FA]'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 ml-4 pl-4 border-l border-[#E8ECF0]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'text-[#00AEEF] bg-[#00AEEF]/10' 
                  : 'text-[#5B6B7A] hover:text-[#111111]'
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                viewMode === 'masonry' 
                  ? 'text-[#00AEEF] bg-[#00AEEF]/10' 
                  : 'text-[#5B6B7A] hover:text-[#111111]'
              }`}
              aria-label="Masonry view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== FEATURED SECTION ===== */}
      {featuredItems.length > 0 && activeCategory === 'all' && (
        <section className="px-5 md:px-14 py-10 md:py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-2.5 mb-5 md:mb-8">
              <Star className="w-4 h-4 text-[#F0B429] fill-[#F0B429]/30" />
              <h2 className="text-base md:text-lg font-bold text-[#111111]">Featured Stories</h2>
              <span className="text-xs text-[#5B6B7A]">({featuredItems.length})</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 auto-rows-fr">
              {featuredItems.slice(0, 6).map((item: any, index: number) => {
                const isLarge = index === 0;
                const imageUrl = getImageUrl(item.image);
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative cursor-pointer overflow-hidden bg-[#F6F8FA] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${
                      isLarge 
                        ? 'md:col-span-2 row-span-2 aspect-[4/3] md:aspect-[16/9]' 
                        : 'aspect-[4/3] md:aspect-[3/4]'
                    }`}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGES.gallery;
                        }}
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/20 to-transparent group-hover:from-[#111111]/90 transition-all duration-500" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-[#00AEEF] px-2.5 py-0.5 rounded-full text-[10px] font-medium text-white shadow-sm shadow-[#00AEEF]/30">
                          {item.category}
                        </span>
                        {isLarge && (
                          <span className="bg-[#F0B429] px-2.5 py-0.5 rounded-full text-[10px] font-medium text-white shadow-sm shadow-[#F0B429]/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-sm md:text-base lg:text-lg leading-snug line-clamp-2">{item.title}</h3>
                      {isLarge && item.description && (
                        <p className="text-white/60 text-xs md:text-sm mt-1 line-clamp-2 hidden md:block">{item.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {item.category}
                        </span>
                        {item.location && (
                          <>
                            <span className="w-0.5 h-0.5 rounded-full bg-white/20"></span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== ALL ITEMS - Optimized Rendering ===== */}
      <section className={`px-5 md:px-14 pb-10 md:pb-16 ${featuredItems.length > 0 && activeCategory === 'all' ? 'bg-[#F6F8FA]' : 'bg-white'}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 mb-5 md:mb-8">
            <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-[#00AEEF] to-[#33C1F5] rounded-full shadow-sm shadow-[#00AEEF]/20"></div>
            <h2 className="text-base md:text-lg font-bold text-[#111111]">
              {activeCategory === 'all' ? `All Items (${allImages.length})` : activeCategory}
            </h2>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8ECF0] shadow-sm">
              <div className="text-4xl mb-3 opacity-30">📸</div>
              <h3 className="text-base font-medium text-[#111111]">No items found</h3>
              <p className="text-sm text-[#5B6B7A] mt-0.5">Try selecting a different category</p>
            </div>
          ) : (
            <>
              <div 
                ref={containerRef}
                className={`grid gap-3 md:gap-4 auto-rows-fr will-change-transform ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                    : 'grid-cols-2 md:grid-cols-3'
                }`}
              >
                {filteredImages.map((item: any, index: number) => {
                  const imageUrl = getImageUrl(item.image);
                  const isTall = viewMode === 'masonry' && index % 4 === 0;
                  const isWide = viewMode === 'masonry' && index % 3 === 0 && index > 0;
                  
                  let aspectClass = 'aspect-square';
                  if (viewMode === 'masonry') {
                    if (isTall) aspectClass = 'aspect-[3/4] md:aspect-[2/3]';
                    else if (isWide) aspectClass = 'aspect-[4/3] md:aspect-[16/9]';
                    else aspectClass = 'aspect-square';
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`group relative cursor-pointer overflow-hidden bg-[#F6F8FA] rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 ${aspectClass} ${viewMode === 'masonry' && isWide ? 'md:col-span-2' : ''}`}
                    >
                      <div className="absolute inset-0">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGES.gallery;
                          }}
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-2 left-2 bg-[#111111]/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium text-white/80 border border-white/10">
                        {item.category}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#111111]/80 to-transparent translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-white text-xs md:text-sm font-medium truncate">{item.title}</p>
                        {item.location && (
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-white/50">
                            <MapPin className="w-2.5 h-2.5" />
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ===== LOADING SENTINEL ===== */}
              {hasMore && activeCategory === 'all' && (
                <div id="scroll-sentinel" className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-sm text-[#5B6B7A]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#00AEEF]" />
                    <span>Loading more...</span>
                  </div>
                </div>
              )}

              {/* ===== END OF CONTENT ===== */}
              {!hasMore && displayedImages.length > 0 && activeCategory === 'all' && (
                <div className="text-center py-8 text-sm text-[#5B6B7A]">
                  🎉 You've reached the end of the gallery
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors p-2 z-10 hover:bg-white/5 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredImages.findIndex(i => i.id === selectedItem.id);
                const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
                setSelectedItem(filteredImages[prevIndex]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-2 z-10 hover:bg-white/5 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredImages.findIndex(i => i.id === selectedItem.id);
                const nextIndex = (currentIndex + 1) % filteredImages.length;
                setSelectedItem(filteredImages[nextIndex]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-2 z-10 hover:bg-white/5 rounded-full"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <motion.div 
              className="max-w-5xl w-full max-h-[90vh]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-2xl overflow-hidden bg-[#111111] shadow-2xl">
                <img
                  src={getImageUrl(selectedItem.image)}
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[75vh] object-contain"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGES.gallery;
                  }}
                />
              </div>
              
              <div className="mt-5 text-white text-center">
                <h3 className="text-lg md:text-xl font-bold">{selectedItem.title}</h3>
                {selectedItem.description && (
                  <p className="text-white/50 text-sm mt-1 max-w-xl mx-auto">{selectedItem.description}</p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs text-white/30">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {selectedItem.category}
                  </span>
                  {selectedItem.date_created && (
                    <>
                      <span className="w-0.5 h-0.5 rounded-full bg-white/10"></span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(selectedItem.date_created).toLocaleDateString()}
                      </span>
                    </>
                  )}
                  {selectedItem.location && (
                    <>
                      <span className="w-0.5 h-0.5 rounded-full bg-white/10"></span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedItem.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CTA ===== */}
      <section className="px-5 md:px-14 py-12 md:py-16 bg-[#F6F8FA]">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#E8ECF0] text-center shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00AEEF]/20 to-[#33C1F5]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Camera className="w-5 h-5 text-[#00AEEF]" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#111111]">Share Your YPA Story</h3>
            <p className="text-sm text-[#5B6B7A] mt-1 max-w-md mx-auto">
              Have photos from your YPA journey? We'd love to feature them.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-[#00AEEF] to-[#33C1F5] text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-sm shadow-[#00AEEF]/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              Submit your story
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}