"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Sparkles, 
  Mail, 
  Briefcase, 
  Clock, 
  Star, 
  User, 
  Award,
  ChevronDown,
  Search,
  Filter,
  Grid3x3,
  LayoutGrid,
  X,
  ExternalLink
} from 'lucide-react';

const LinkedInIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

async function fetchTeamMembers() {
  try {
    const res = await fetch(
      `${API_URL}/items/team_members?filter[status][_eq]=published&sort[]=order&sort[]=-featured`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
}

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const load = async () => {
      const data = await fetchTeamMembers();
      setMembers(data);
      setLoading(false);
    };
    load();
  }, []);

  const departments = ['all', ...new Set(members.map(m => m.department).filter(Boolean))];

  const filteredMembers = members.filter(member => {
    const matchesDepartment = activeDepartment === 'all' || member.department === activeDepartment;
    const matchesSearch = member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.department?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const leadership = filteredMembers.filter(m => m.featured === true);
  const regularMembers = filteredMembers.filter(m => m.featured !== true);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#E3F2FD] border-t-[#2196F3] rounded-full"
          />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />

      {/* ===== HERO – Light with Blue Gradient Edges ===== */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-b from-[#F0F7FE] via-white to-white">
        {/* Blue gradient orbs on edges */}
        <div className="absolute top-[-30%] right-[-15%] w-[600px] h-[600px] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #2196F3, transparent 70%)' }} />
        <div className="absolute bottom-[-30%] left-[-15%] w-[600px] h-[600px] rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #64B5F6, transparent 70%)' }} />
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(33,150,243,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(33,150,243,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative container mx-auto max-w-6xl z-10">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <motion.span 
                className="inline-flex items-center gap-2 text-[#2196F3] font-medium text-sm uppercase tracking-wider bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2196F3]/20 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Users className="w-4 h-4" />
                Our Team
              </motion.span>
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mt-4 leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                The People <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2196F3] to-[#64B5F6]">Behind YPA</span>
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-500 mt-3 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Meet the dedicated professionals driving agricultural transformation across Africa
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
                <span className="text-xs font-medium text-gray-500">{members.length} members</span>
              </div>
              {leadership.length > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3]/10 to-[#64B5F6]/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-[#2196F3]/20 shadow-sm">
                  <Star className="w-4 h-4 text-[#2196F3]" />
                  <span className="text-xs font-medium text-[#2196F3]">{leadership.length} leadership</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FILTERS & SEARCH – Glassmorphism ===== */}
      <div className="sticky top-20 z-30 flex justify-center px-4 -mt-6">
        <div
          className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 bg-white/70 backdrop-blur-xl shadow-lg border border-white/50"
          style={{
            boxShadow: "0 8px 32px rgba(33,150,243,0.08)",
          }}
        >
          {departments.map((dept) => (
            <motion.button
              key={dept}
              onClick={() => setActiveDepartment(dept)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                activeDepartment === dept
                  ? 'bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white shadow-md shadow-[#2196F3]/25'
                  : 'text-gray-500 hover:text-[#1A3A5C] hover:bg-white/50'
              }`}
            >
              {dept === 'all' ? 'All' : dept}
            </motion.button>
          ))}
          <div className="w-px h-5 bg-gray-200 mx-1"></div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-700 text-xs placeholder-gray-400 w-32 focus:w-48 transition-all duration-300 px-2 py-1"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
          
          <div className="w-px h-5 bg-gray-200 mx-1"></div>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              viewMode === 'grid' 
                ? 'bg-[#2196F3]/20 text-[#2196F3]' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Grid view"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              viewMode === 'list' 
                ? 'bg-[#2196F3]/20 text-[#2196F3]' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="List view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===== LEADERSHIP SPOTLIGHT – Glass Cards ===== */}
      {leadership.length > 0 && activeDepartment === 'all' && (
        <section className="px-6 py-16">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Star className="w-5 h-5 text-[#2196F3] fill-[#2196F3]/30" />
              <h2 className="text-xl font-bold text-[#1A3A5C]">Leadership Team</h2>
              <span className="text-sm text-gray-400">({leadership.length})</span>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setSelectedMember(member)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500"
                  style={{
                    boxShadow: "0 8px 32px rgba(33,150,243,0.06)",
                  }}
                >
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-[#F0F7FE] to-white">
                    {member.image ? (
                      <img
                        src={`${API_URL}/assets/${member.image}`}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ objectPosition: '50% 20%' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2196F3]/5 to-[#64B5F6]/5">
                        <User className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-[#1A3A5C]">{member.name}</h3>
                      <p className="text-[#2196F3] text-sm font-medium">{member.role}</p>
                      <p className="text-gray-500 text-xs mt-1">{member.department}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== ALL MEMBERS – Glass Grid ===== */}
      <section className={`px-6 py-16 ${leadership.length > 0 && activeDepartment === 'all' ? 'border-t border-gray-100' : ''}`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-5 h-5 bg-gradient-to-br from-[#2196F3] to-[#64B5F6] rounded-full shadow-md shadow-[#2196F3]/30"></div>
            <h2 className="text-xl font-bold text-[#1A3A5C]">
              {activeDepartment === 'all' ? 'All Members' : activeDepartment}
            </h2>
            <span className="text-sm text-gray-400">({regularMembers.length})</span>
            {activeDepartment !== 'all' && (
              <button
                onClick={() => setActiveDepartment('all')}
                className="text-xs text-gray-400 hover:text-[#2196F3] transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear filter
              </button>
            )}
          </motion.div>

          {regularMembers.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
              <div className="text-6xl mb-4 opacity-30">👥</div>
              <h3 className="text-xl font-medium text-gray-700">No members found</h3>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-3'
            }>
              {regularMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedMember(member)}
                  className={`group relative cursor-pointer rounded-xl overflow-hidden bg-white/60 backdrop-blur-md border border-white/50 shadow-md hover:shadow-xl transition-all duration-500 ${
                    viewMode === 'list' ? 'flex items-center gap-4 p-4' : ''
                  }`}
                  style={{
                    boxShadow: "0 4px 16px rgba(33,150,243,0.04)",
                  }}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[#F0F7FE] to-white">
                        {member.image ? (
                          <img
                            src={`${API_URL}/assets/${member.image}`}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            style={{ objectPosition: '50% 20%' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2196F3]/5 to-[#64B5F6]/5">
                            <User className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-[#1A3A5C] truncate">{member.name}</h4>
                        <p className="text-xs text-[#2196F3] truncate">{member.role}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{member.department}</p>
                        {member.experience && (
                          <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{member.experience}</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-[#F0F7FE] to-white border border-gray-200">
                        {member.image ? (
                          <img
                            src={`${API_URL}/assets/${member.image}`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#1A3A5C]">{member.name}</h4>
                        <p className="text-xs text-[#2196F3]">{member.role}</p>
                        <p className="text-[10px] text-gray-400">{member.department}</p>
                      </div>
                      {member.experience && (
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{member.experience}</span>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== MEMBER DETAIL MODAL – Glass ===== */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedMember(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-full z-10 border border-white/10"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div 
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-[#F0F7FE] to-white">
                  {selectedMember.image ? (
                    <img
                      src={`${API_URL}/assets/${selectedMember.image}`}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: '50% 20%' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-24 h-24 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                </div>

                <div className="p-8 -mt-16 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div>
                      <h2 className="text-3xl font-bold text-[#1A3A5C]">{selectedMember.name}</h2>
                      <p className="text-[#2196F3] text-lg font-medium">{selectedMember.role}</p>
                      <p className="text-gray-500 text-sm mt-1">{selectedMember.department}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      {selectedMember.linkedin && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white/5 hover:bg-[#2196F3]/10 border border-gray-200 hover:border-[#2196F3]/30 transition-colors"
                        >
                          <LinkedInIcon className="w-5 h-5 text-gray-500 hover:text-[#2196F3]" />
                        </a>
                      )}
                      {selectedMember.email && (
                        <a
                          href={`mailto:${selectedMember.email}`}
                          className="p-2 rounded-full bg-white/5 hover:bg-[#2196F3]/10 border border-gray-200 hover:border-[#2196F3]/30 transition-colors"
                        >
                          <Mail className="w-5 h-5 text-gray-500 hover:text-[#2196F3]" />
                        </a>
                      )}
                    </div>
                  </div>

                  {selectedMember.experience && (
                    <div className="mt-6 flex items-center gap-3 text-sm text-gray-600 bg-white/50 rounded-xl px-4 py-3 border border-gray-200">
                      <Clock className="w-4 h-4 text-[#2196F3]" />
                      <span>{selectedMember.experience} of experience</span>
                    </div>
                  )}

                  {selectedMember.bio && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-[#1A3A5C]/60 uppercase tracking-wider mb-2">About</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{selectedMember.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CTA – Glass ===== */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/50 shadow-xl text-center overflow-hidden"
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
                <Sparkles className="w-12 h-12 text-[#2196F3]/40 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-[#1A3A5C]">Join Our Team</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                We're always looking for passionate individuals to join the YPA family.
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
                  View Careers
                  <ExternalLink className="w-4 h-4" />
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