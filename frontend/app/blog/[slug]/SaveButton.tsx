"use client";

import { useState } from 'react';
import { Bookmark } from 'lucide-react';

export function SaveButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      onClick={() => setSaved(!saved)}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
      style={{ 
        background: saved ? '#00AEEF' : '#F6F8FA', 
        color: saved ? 'white' : '#5B6B7A' 
      }}
    >
      <Bookmark className="w-3.5 h-3.5" fill={saved ? 'white' : 'none'} />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}