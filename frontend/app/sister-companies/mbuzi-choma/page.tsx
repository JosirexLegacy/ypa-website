"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  MapPin, 
  Phone, 
  Clock, 
  Star,
  ArrowRight,
  Sparkles,
  Utensils,
  ChevronRight,
  Users,
  Flame,
  Award,
  Heart,
  Quote,
  Tag,
  Crown,
  Gift,
  Percent,
  CheckCircle,
  Calendar,
  ThumbsUp,
  Zap,
  Play
} from 'lucide-react';

// ============================================================
// DATA FETCHING
// ============================================================
const DIRECTUS_URL = 'http://localhost:8055';

async function getMbuziChomaContent() {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/mbuzi_choma`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching mbuzi choma content:', error);
    return null;
  }
}

async function getMenuItems() {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/menu?sort[]=order`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

// ============================================================
// HELPERS
// ============================================================
const getImageUrl = (imageId: string) => {
  if (!imageId) return '';
  if (imageId.startsWith('http')) return imageId;
  return `${DIRECTUS_URL}/assets/${imageId}`;
};

// ============================================================
// ANIMATIONS - FIXED: added "as any" to ease array
// ============================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

// ============================================================
// IMAGE PLACEHOLDERS (Replace with real images)
// ============================================================
const FOOD_IMAGES = {
  hero: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&h=900&fit=crop&crop=center",
  grill: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&crop=center",
  goat: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&h=600&fit=crop&crop=center",
  interior: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&crop=center",
  platter: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop&crop=center",
  story: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&crop=center",
  special1: "https://images.unsplash.com/photo-1558030006-45d8f7c7f0b9?w=600&h=400&fit=crop&crop=center",
  special2: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&crop=center",
  special3: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&crop=center",
};

// ============================================================
// MAIN PAGE
// ============================================================
export default function MbuziChomaPage() {
  const [content, setContent] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const [contentData, menuData] = await Promise.all([
        getMbuziChomaContent(),
        getMenuItems()
      ]);
      
      setContent(contentData);
      setMenuItems(menuData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#E3F2FD] border-t-[#2196F3] rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <Navigation />

      {/* ============================================================
        HERO - Full Screen, Cinematic
        ============================================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={FOOD_IMAGES.hero}
            alt="Mbuzi Choma - The Grill Experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        </div>

        {/* Floating Logo Badge - Top Left */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-black/50 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight">Mbuzi Choma</p>
            <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase">Since 2010</p>
          </div>
        </div>

        {/* Center Content - Minimal, Bold */}
        <div className="relative container mx-auto px-6 max-w-7xl z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-white/60 text-xs font-medium tracking-[0.2em] uppercase">Kampala's Best Nyama Choma</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05]"
            >
              Where
              <span className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-[length:200%_auto] animate-gradient-flow">
                Flavour Meets Fire
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base md:text-lg text-white/50 max-w-lg mx-auto mt-4 font-light"
            >
              Premium goat meat. Grilled to perfection. Served with love.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              <Link
                href="#menu"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-medium hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Utensils className="w-4 h-4" />
                Explore Menu
              </Link>
              <Link
                href="#story"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/10 px-8 py-3.5 rounded-full font-medium hover:bg-white/20 transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                Watch the Fire
              </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12 text-white/20 flex flex-col items-center gap-2"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
              <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center">
                <div className="w-1 h-2 bg-white/30 rounded-full mt-2 animate-bounce"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* ============================================================
        STORY - Visual First
        ============================================================ */}
      <section id="story" className="py-24 px-6 bg-black border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="order-2 lg:order-1"
            >
              <motion.span variants={fadeInUp} className="text-orange-400 text-xs font-medium tracking-[0.3em] uppercase">Our Story</motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-light text-white mt-3 leading-[1.1]">
                From a Single Stove to <span className="font-medium text-orange-400">Kampala's Favorite</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="mt-4 text-white/40 leading-relaxed font-light">
                What started as one BBQ stove at a busy junction has become a city institution. 
                Today, over 15 service points serve a diverse crowd daily.
              </motion.p>
              
              <motion.div variants={scaleIn} className="relative mt-6 p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <Quote className="w-5 h-5 text-orange-400/50 mb-2" />
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  "All the meat has a tender, juicy, fireworks-cracking, heart-lightening, memory-stamping taste."
                </p>
                <p className="text-xs text-white/20 mt-2 font-light">— Craft It, Kampala Food Review</p>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-xs text-white/30">Service Points</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                  <div className="text-2xl font-bold text-white">2010</div>
                  <div className="text-xs text-white/30">Established</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                  <div className="text-2xl font-bold text-white">4.5★</div>
                  <div className="text-xs text-white/30">Rating</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10">
                <img
                  src={FOOD_IMAGES.story}
                  alt="Mbuzi Choma Story"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
                  <Flame className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
        THE GRILL - Full Width Immersive
        ============================================================ */}
      <section className="relative py-24 px-6 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0">
          <img
            src={FOOD_IMAGES.grill}
            alt="The Grill Experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto max-w-7xl z-10">
          <div className="max-w-2xl">
            <span className="text-orange-400 text-xs font-medium tracking-[0.3em] uppercase">The Experience</span>
            <h2 className="text-3xl md:text-5xl font-light text-white mt-3 leading-[1.1]">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Fire.</span> 
              <span className="block">Meat.</span>
              <span className="block text-white/60">Tradition.</span>
            </h2>
            <p className="text-white/40 mt-4 font-light max-w-md">
              Premium goat meat grilled over open flames. It's not just food. It's an experience.
            </p>
            <Link
              href="#menu"
              className="inline-flex items-center gap-2 mt-8 bg-white text-black px-8 py-3.5 rounded-full font-medium hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Flame className="w-4 h-4" />
              Taste the Fire
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
        MENU - Visual Grid
        ============================================================ */}
      <section id="menu" className="py-24 px-6 bg-black border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-orange-400 text-xs font-medium tracking-[0.3em] uppercase">Menu</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-light text-white mt-3">
              What's <span className="font-bold text-orange-400">Grilling</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/30 text-sm mt-2 font-light">
              Premium goat meat and grilled specialties
            </motion.p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {filteredItems.map((item, idx) => {
              const isPopular = item.popular;
              const imageUrl = item.image ? getImageUrl(item.image) : FOOD_IMAGES.platter;
              
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-44 h-44 md:h-auto overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {isPopular && (
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] bg-orange-500 text-white px-2.5 py-1 rounded-full font-medium shadow-lg shadow-orange-500/30">
                            ★ Popular
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 group-hover:opacity-0 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-base font-medium text-white group-hover:text-orange-400 transition-colors">
                            {item.name}
                          </h4>
                          {item.price && (
                            <span className="text-sm font-bold text-orange-400 ml-3 shrink-0">{item.price}</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-white/30 mt-1 font-light">{item.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-white/10 text-xs">🔥</span>
                        <span className="text-white/20 text-[10px]">Grilled to order</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================
        SPECIALS - Visual Cards
        ============================================================ */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-[#0A0A0A] border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="text-orange-400 text-xs font-medium tracking-[0.3em] uppercase">Limited Time</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-light text-white mt-2">
              Daily <span className="font-bold text-orange-400">Specials</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Family Platter", desc: "2kg goat meat + sides + drinks", discount: "Save 20%", image: FOOD_IMAGES.special1 },
              { title: "Lunch Special", desc: "Grilled goat + ugali + salad", discount: "UGX 25,000", image: FOOD_IMAGES.special2 },
              { title: "Weekend Feast", desc: "Full goat + 5 sides + drinks", discount: "Save 30%", image: FOOD_IMAGES.special3 }
            ].map((special, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-500"
              >
                <div className="relative h-64">
                  <img
                    src={special.image}
                    alt={special.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 text-xs font-medium uppercase tracking-wider">Special</span>
                    </div>
                    <h4 className="text-xl font-medium text-white">{special.title}</h4>
                    <p className="text-white/40 text-sm font-light">{special.desc}</p>
                    <div className="mt-3 inline-block bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1">
                      <span className="text-orange-400 text-xs font-bold">{special.discount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
        LOCATION - Clean
        ============================================================ */}
      <section id="location" className="py-24 px-6 bg-black border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeInUp} className="text-orange-400 text-xs font-medium tracking-[0.3em] uppercase">Visit Us</motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-light text-white mt-2">
                Find <span className="font-bold text-orange-400">The Fire</span>
              </motion.h2>
              
              <motion.div variants={fadeInUp} className="space-y-4 mt-8">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-white/30 uppercase tracking-wider">Address</p>
                    <p className="text-sm text-white/70 font-light">
                      Trinity Mall, Kisenyi, Opposite Lubiri, Kampala
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <Phone className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-white/30 uppercase tracking-wider">Phone</p>
                    <p className="text-sm text-white/70 font-light">+256 774 313 551</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-white/30 uppercase tracking-wider">Hours</p>
                    <p className="text-sm text-white/70 font-light">Mon - Sun: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-6 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <p className="text-sm text-orange-400/60 flex items-center gap-2 font-light">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Follow the smell of grilled meat — you can't miss it!</span>
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl blur-2xl"></div>
              <div className="relative h-[350px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/5">
                <img
                  src={FOOD_IMAGES.interior}
                  alt="Mbuzi Choma Location"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/80 backdrop-blur-md rounded-xl px-5 py-3 inline-block border border-white/10">
                    <p className="text-white text-sm font-medium">🔥 Follow the smoke</p>
                    <p className="text-white/30 text-xs font-light">Trinity Mall, Kisenyi</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
        CTA - Full Width Flame
        ============================================================ */}
      <section className="relative py-24 px-6 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0">
          <img
            src={FOOD_IMAGES.goat}
            alt="Experience Mbuzi Choma"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40"></div>
        </div>
        
        <div className="relative container mx-auto max-w-4xl text-center z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn} className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <Flame className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-light text-white">
              Ready for the <span className="font-bold text-orange-400">Best Goat</span> in Kampala?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/40 text-sm mt-3 max-w-md mx-auto font-light">
              Experience the authentic taste of Uganda's favorite nyama choma spot.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                Book a Table
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#menu"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/10 px-10 py-4 rounded-full font-medium hover:bg-white/20 transition-all duration-300"
              >
                View Menu
                <Utensils className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}