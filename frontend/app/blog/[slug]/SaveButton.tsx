"use client";

import { useState } from 'react';
import { Bookmark } from 'lucide-react';

export function SaveButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      onClick={() => setSaved(!saved)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
      style={{ 
        background: saved ? '#00AEEF' : 'rgba(255,255,255,0.12)',
        color: saved ? 'white' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <Bookmark className="w-3.5 h-3.5" fill={saved ? 'white' : 'none'} />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}