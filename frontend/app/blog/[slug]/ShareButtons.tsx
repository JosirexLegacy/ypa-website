"use client";

import { Share2 } from 'lucide-react';

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const url = `https://ypa-website-b3uh-ashy.vercel.app/blog/${slug}`;
  
  const shareLinks = [
    { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${title}&url=${url}` },
    { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#5B6B7A]">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-[#F6F8FA] hover:bg-[#00AEEF]/10 transition-all hover:scale-110"
        >
          <Share2 className="w-4 h-4 text-[#5B6B7A]" />
        </a>
      ))}
    </div>
  );
}