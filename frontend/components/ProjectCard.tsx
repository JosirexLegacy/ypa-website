"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface ProjectCardProps {
  image: string;
  icon: ReactNode;
  title: string;
  desc: string;
  href: string;
}

export const ProjectCard = ({ image, icon, title, desc, href }: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A5C]/90 via-[#1A3A5C]/40 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative p-8 h-[320px] flex flex-col justify-end text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 border border-white/10">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-[#64B5F6] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-xs">
          {desc}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#64B5F6] hover:gap-2 transition-all duration-300"
        >
          Learn More <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};