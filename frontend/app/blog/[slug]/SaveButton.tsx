// frontend/src/app/blog/[slug]/SaveButton.tsx
'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SaveButtonProps {
  slug?: string;
}

export function SaveButton({ slug }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Check if already saved on mount
  useEffect(() => {
    if (slug && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`saved_${slug}`);
      setIsSaved(saved === 'true');
    }
  }, [slug]);

  const handleSave = () => {
    if (slug && typeof window !== 'undefined') {
      const newState = !isSaved;
      setIsSaved(newState);
      localStorage.setItem(`saved_${slug}`, String(newState));
      
      // You could also dispatch an event or make an API call here
      // For example: fetch('/api/save', { method: 'POST', body: JSON.stringify({ slug, saved: newState }) })
    }
  };

  return (
    <button 
      onClick={handleSave}
      className={`flex items-center gap-2 text-sm transition-colors group ${
        isSaved 
          ? 'text-[#2196F3]' 
          : 'text-gray-400 hover:text-[#1A3A5C]'
      }`}
      aria-label={isSaved ? 'Unsave article' : 'Save article'}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Save</span>
        </>
      )}
    </button>
  );
}