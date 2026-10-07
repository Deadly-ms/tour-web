'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, MapPin, Compass } from 'lucide-react';
import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? MOCK_TOUR_PACKAGES.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.destination.toLowerCase().includes(query.toLowerCase()) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
      )
    : MOCK_TOUR_PACKAGES.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#fcfbfa] border border-[#e8e4dc] rounded-3xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#e8e4dc] pb-4">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, packages (e.g. Rajasthan, Kerala, Ladakh)..."
            className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-4 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-wider font-semibold">
            <span>{query.trim() ? `Search Results (${filtered.length})` : 'Popular Experiences'}</span>
            <Link
              href="/tour-packages"
              onClick={onClose}
              className="text-[#18281d] hover:underline flex items-center gap-1 lowercase"
            >
              <span>view all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-stone-500">
                No matching tour packages found for &quot;{query}&quot;. Try searching Rajasthan, Kerala, or Ladakh.
              </div>
            ) : (
              filtered.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/tour-packages/${pkg.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white border border-[#f0ede6] hover:border-[#d9d4c9] hover:shadow-sm transition group"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                    <Image
                      src={pkg.heroImage}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-[#c58b59] uppercase tracking-wider">
                        {pkg.duration}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs text-stone-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {pkg.destination}
                      </span>
                    </div>
                    <h4 className="font-serif text-sm font-medium text-stone-900 group-hover:text-[#18281d] truncate">
                      {pkg.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {pkg.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-stone-900 block">
                      ₹{pkg.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-400">/ person</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-stone-50 group-hover:bg-[#18281d] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
