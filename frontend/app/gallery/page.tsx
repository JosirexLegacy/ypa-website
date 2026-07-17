"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  ZoomIn, 
  Play, 
  Video, 
  Image as ImageIcon, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Grid3x3,
  LayoutGrid,
  Heart,
  Clock,
  Calendar,
  MapPin,
  User,
  Tag,
  ArrowUpRight,
  ExternalLink,
  Shield,
  Star,
  Eye,
  Zap
} from 'lucide-react';

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// DATA FETCHING
// ============================================================
export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_URL}/items/gallery`, {
          cache: 'no-store'
        });
        const data = await res.json();
        setImages(data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // ✅ Helpers
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const embedUrl = getVideoEmbedUrl(url);
    if (!embedUrl) return null;
    const videoId = embedUrl.split('/embed/')[1];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const isVideo = (item: any) => {
    return item.type === 'video' && item.video_url && getVideoEmbedUrl(item.video_url);
  };

  // ✅ Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') setSelectedItem(null);
      if (e.key === 'ArrowLeft') {
        const currentIndex = images.findIndex(i => i.id === selectedItem.id);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setSelectedItem(images[prevIndex]);
      }
      if (e.key === 'ArrowRight') {
        const currentIndex = images.findIndex(i => i.id === selectedItem.id);
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedItem(images[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, images]);

  // ✅ Categories
  const categories = ['all', ...new Set(images.map(item => item.category).filter(Boolean))];
  const featuredItems = images.filter((item: any) => item.featured === true);
  const regularItems = images.filter((item: any) => item.featured !== true);
  const filteredItems = activeCategory === 'all' 
    ? regularItems 
    : regularItems.filter(item => item.category === activeCategory);

  // ✅ Size helper
  const getItemSize = (index: number, total: number) => {
    if (viewMode === 'grid') return 'col-span-1 row-span-1';
    const patterns = [
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
      'col-span-2 row-span-1',
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
      'col-span-1 row-span-1',
      'col-span-2 row-span-1',
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
    ];
    if (index < 3) return index === 0 ? 'col-span-2 row-span-2' : 'col-span-2 row-span-1';
    return patterns[index % patterns.length];
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0F]">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#2196F3]/30 border-t-[#2196F3] rounded-full"
          />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] overflow-x-hidden">

      {/* ===== NAVIGATION ===== */}
      <Navigation />

      {/* ===== HERO - Futuristic with Grid ===== */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(33,150,243,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(33,150,243,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
        
        <motion.div 
          className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full blur-3xl opacity-20"
          style={{ background: '#2196F3' }}
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-3xl opacity-15"
          style={{ background: '#7EC8FF' }}
          animate={{ x: [0, -40, 30, 0], y: [0, 30, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative container mx-auto max-w-6xl z-10">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <motion.span 
                className="inline-flex items-center gap-2 text-[#2196F3] font-medium text-sm uppercase tracking-wider bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2196F3]/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Camera className="w-4 h-4" />
                Gallery
                <Zap className="w-3 h-3 text-[#64B5F6] ml-1" />
              </motion.span>
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mt-4 leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Visual <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2196F3] via-[#64B5F6] to-[#7EC8FF]">Journey</span>
              </motion.h1>
              <motion.p 
                className="text-lg text-white/40 mt-3 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Images and videos from YPA's journey across Africa
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
                <span className="text-xs font-medium text-white/50">{images.length} items</span>
              </div>
              {featuredItems.length > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3]/10 to-[#64B5F6]/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-[#2196F3]/20 shadow-lg">
                  <Sparkles className="w-4 h-4 text-[#2196F3]" />
                  <span className="text-xs font-medium text-[#2196F3]">{featuredItems.length} featured</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FILTERS & CONTROLS ===== */}
      <div className="sticky top-20 z-30 flex justify-center px-4 -mt-6">
        <div
          className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
          style={{
            background: "rgba(10,10,15,0.7)",
            backdropFilter: "blur(24px) saturate(1.4)",
            boxShadow: "0 8px 40px rgba(33,150,243,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            border: "1px solid rgba(33,150,243,0.2)",
          }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white shadow-lg shadow-[#2196F3]/30'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </motion.button>
          ))}
          <div className="w-px h-5 bg-white/10 mx-1"></div>
          <button
            onClick={() => setViewMode('masonry')}
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              viewMode === 'masonry' 
                ? 'bg-[#2196F3]/20 text-[#2196F3]' 
                : 'text-white/30 hover:text-white/60'
            }`}
            aria-label="Masonry view"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              viewMode === 'grid' 
                ? 'bg-[#2196F3]/20 text-[#2196F3]' 
                : 'text-white/30 hover:text-white/60'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===== FEATURED SECTION ===== */}
      {featuredItems.length > 0 && activeCategory === 'all' && (
        <section className="px-6 py-16">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="w-5 h-5 text-[#2196F3] fill-[#2196F3]/30" />
              </motion.div>
              <h2 className="text-xl font-bold text-white">Featured Stories</h2>
              <span className="text-sm text-white/30">({featuredItems.length})</span>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item: any, index: number) => {
                const size = index === 0 ? 'lg:col-span-2 lg:row-span-2' : 
                            index === 1 ? 'lg:col-span-1 lg:row-span-1' : 
                            'lg:col-span-1 lg:row-span-1';
                const height = index === 0 ? 'h-[500px] md:h-[600px]' : 'h-[300px] md:h-[350px]';
                const imageUrl = item.image ? `${API_URL}/assets/${item.image}` : null;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(33,150,243,0.3)] transition-all duration-500 ${size}`}
                  >
                    <div className={`relative ${height} bg-[#0A0A0F]`}>
                      {isVideo(item) ? (
                        <img
                          src={getYouTubeThumbnail(item.video_url) || ''}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0A0A0F]">
                          <ImageIcon className="w-16 h-16 text-white/10" />
                        </div>
                      )}
                      
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/80 via-[#0A0A0F]/30 to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      <motion.div 
                        className="absolute inset-0 rounded-2xl border-2 border-transparent"
                        whileHover={{ borderColor: '#2196F3', boxShadow: 'inset 0 0 30px rgba(33,150,243,0.2)' }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0F]/90 to-transparent">
                        <motion.div
                          initial={{ y: 10, opacity: 0.8 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-xl font-bold text-white">{item.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-white/50">
                            <span className="flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5" />
                              {item.category}
                            </span>
                            {item.description && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                <span className="line-clamp-1">{item.description}</span>
                              </>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 mt-2 text-sm text-[#64B5F6] font-medium">
                            {isVideo(item) ? 'Watch' : 'View'} <ZoomIn className="w-4 h-4" />
                          </span>
                        </motion.div>
                      </div>
                      
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white/80 border border-white/10">
                          {item.category}
                        </span>
                        <span className="bg-gradient-to-r from-[#2196F3] to-[#64B5F6] px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1 shadow-lg shadow-[#2196F3]/30">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      </div>
                      
                      {isVideo(item) && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white/60 flex items-center gap-1 border border-white/10">
                          <Video className="w-3 h-3" />
                          Video
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== ALL ITEMS ===== */}
      <section id="gallery-grid" className={`px-6 py-16 ${featuredItems.length > 0 && activeCategory === 'all' ? 'bg-[#0A0A0F]' : ''}`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-5 h-5 bg-gradient-to-br from-[#2196F3] to-[#64B5F6] rounded-full shadow-lg shadow-[#2196F3]/30"></div>
            <h2 className="text-xl font-bold text-white">
              {activeCategory === 'all' ? 'All Items' : activeCategory}
            </h2>
            <span className="text-sm text-white/30">({filteredItems.length})</span>
          </motion.div>

          {filteredItems.length === 0 ? (
            <motion.div 
              className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl mb-4 opacity-30">📸</div>
              <h3 className="text-xl font-medium text-white/80">No items found</h3>
              <p className="text-white/30 text-sm mt-1">Try selecting a different category</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
              {filteredItems.map((item: any, index: number) => {
                const size = getItemSize(index, filteredItems.length);
                const isVideoItem = isVideo(item);
                const thumbnail = isVideoItem 
                  ? getYouTubeThumbnail(item.video_url) 
                  : item.image ? `${API_URL}/assets/${item.image}` : null;
                
                const getHeight = () => {
                  if (viewMode === 'grid') return 'h-full';
                  const heights = ['h-full', 'h-full', 'h-[280px]', 'h-full', 'h-[260px]', 'h-full'];
                  return heights[index % heights.length];
                };

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -6, 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`group relative cursor-pointer rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(33,150,243,0.2)] transition-all duration-500 ${size} ${getHeight()}`}
                  >
                    <div className="relative w-full h-full">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0A0A0F]">
                          <ImageIcon className="w-12 h-12 text-white/10" />
                        </div>
                      )}
                      
                      {isVideoItem && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            className="w-12 h-12 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/20"
                            whileHover={{ scale: 1.1 }}
                            animate={{ 
                              scale: hoveredId === item.id ? 1.1 : 1,
                              transition: { duration: 0.3 }
                            }}
                          >
                            <Play className="w-5 h-5 text-[#2196F3] ml-0.5" />
                          </motion.div>
                        </div>
                      )}
                      
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/70 via-transparent to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0F]/80 to-transparent"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-white/50">
                          <Tag className="w-3 h-3" />
                          {item.category}
                          {item.description && (
                            <>
                              <span className="w-0.5 h-0.5 rounded-full bg-white/20"></span>
                              <span className="truncate">{item.description}</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                      
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium text-white/70 border border-white/10">
                        {item.category}
                      </div>
                      
                      {isVideoItem && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium text-white/50 flex items-center gap-1 border border-white/10">
                          <Video className="w-3 h-3" />
                          Video
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors duration-300 p-2 hover:bg-white/5 rounded-full z-10 border border-white/5"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = images.findIndex(i => i.id === selectedItem.id);
                const prevIndex = (currentIndex - 1 + images.length) % images.length;
                setSelectedItem(images[prevIndex]);
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors duration-300 p-2 hover:bg-white/5 rounded-full z-10 border border-white/5"
            >
              <ChevronLeft className="w-8 h-8" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = images.findIndex(i => i.id === selectedItem.id);
                const nextIndex = (currentIndex + 1) % images.length;
                setSelectedItem(images[nextIndex]);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors duration-300 p-2 hover:bg-white/5 rounded-full z-10 border border-white/5"
            >
              <ChevronRight className="w-8 h-8" />
            </motion.button>

            <motion.div 
              className="max-w-5xl w-full max-h-[90vh]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl">
                {isVideo(selectedItem) ? (
                  <div className="relative pt-[56.25%]">
                    <iframe
                      src={getVideoEmbedUrl(selectedItem.video_url) ?? undefined}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={`${API_URL}/assets/${selectedItem.image}`}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain max-h-[80vh]"
                  />
                )}
              </div>
              
              <motion.div 
                className="mt-6 text-white text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedItem.title}</h3>
                <p className="text-white/40 text-sm md:text-base mt-2 max-w-2xl mx-auto">
                  {selectedItem.description || 'A moment captured from YPA\'s journey'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-white/20">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {selectedItem.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/10"></span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedItem.date_created ? new Date(selectedItem.date_created).toLocaleDateString() : 'Recent'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/10"></span>
                  <span className="flex items-center gap-1.5">
                    {isVideo(selectedItem) ? (
                      <>
                        <Video className="w-3.5 h-3.5" />
                        Video
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3.5 h-3.5" />
                        Photo
                      </>
                    )}
                  </span>
                  {selectedItem.location && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/10"></span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedItem.location}
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CTA ===== */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl text-center overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2196F3]/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#64B5F6]/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block"
              >
                <Camera className="w-12 h-12 text-[#2196F3]/30 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white">Share Your YPA Story</h3>
              <p className="text-white/30 text-sm mt-2 max-w-md mx-auto">
                Have photos or videos from your YPA journey? We'd love to feature them.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white px-8 py-3.5 rounded-full text-sm font-medium shadow-lg shadow-[#2196F3]/30 hover:shadow-xl transition-all duration-300"
                >
                  Submit your story
                  <Sparkles className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}