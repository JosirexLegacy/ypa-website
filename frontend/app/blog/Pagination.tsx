// frontend/src/app/blog/Pagination.tsx
'use client';

import Link from "next/link";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  category: string;
}

export function Pagination({ currentPage, totalPages, category }: PaginationProps) {
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (page > 1) params.set('page', String(page));
    return `/blog${params.toString() ? `?${params.toString()}` : ''}`;
  };

  // Don't show pagination if only 1 page
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-2 rounded-xl border border-gray-200 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
      
      {/* Page numbers */}
      {getPageNumbers().map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
            currentPage === page
              ? 'bg-[#2196F3] text-white shadow-md shadow-[#2196F3]/25'
              : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A3A5C]'
          }`}
        >
          {page}
        </Link>
      ))}
      
      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-2 rounded-xl border border-gray-200 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}