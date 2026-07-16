"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

interface ZoomImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const ZoomImage = ({ src, alt, className, containerClassName }: ZoomImageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden ${containerClassName || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.02 : 1,
        transition: { duration: 0.6, ease: "easeOut" }
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: isHovered ? 1.08 : 1,
          transition: { duration: 0.8, ease: "easeOut" }
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className || ''}`}
        />
      </motion.div>
    </motion.div>
  );
};