// frontend/src/app/blog/[slug]/ShareButtons.tsx
'use client';

import { Share2, Link2, Check } from 'lucide-react';
import { useState } from 'react';

// ===== CUSTOM SVG ICONS =====
const TwitterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

interface ShareButtonsProps {
  slug: string;
  title: string;
}

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Get the full URL for sharing
  const getShareUrl = () => {
    // Use window.location for the correct URL in any environment
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blog/${slug}`;
    }
    // Fallback for SSR
    return `https://youthplatformafrica.com/blog/${slug}`;
  };

  const handleShare = (type: 'twitter' | 'linkedin' | 'copy') => {
    const url = getShareUrl();
    const text = `Check out this article: ${title}`;
    
    if (type === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank', 'width=600,height=400');
    } else if (type === 'linkedin') {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedinUrl, '_blank', 'width=600,height=400');
    } else if (type === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 font-medium flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" />
        Share
      </span>
      <button 
        onClick={() => handleShare('twitter')}
        className="p-2.5 bg-[#F5F9FF] rounded-xl hover:bg-[#E3F2FD] transition-colors text-gray-500 hover:text-[#1DA1F2]"
        aria-label="Share on Twitter"
      >
        <TwitterIcon />
      </button>
      <button 
        onClick={() => handleShare('linkedin')}
        className="p-2.5 bg-[#F5F9FF] rounded-xl hover:bg-[#E3F2FD] transition-colors text-gray-500 hover:text-[#0A66C2]"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon />
      </button>
      <button 
        onClick={() => handleShare('copy')}
        className={`p-2.5 rounded-xl transition-colors flex items-center gap-1.5 ${
          copied 
            ? 'bg-green-100 text-green-600' 
            : 'bg-[#F5F9FF] text-gray-500 hover:bg-[#E3F2FD] hover:text-[#1A3A5C]'
        }`}
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span className="text-xs font-medium">Copied!</span>
          </>
        ) : (
          <Link2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}