'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, MapPin, Compass } from 'lucide-react';
import { useEffect } from 'react';
import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';
import { getAllTourPackages } from '@/services/tour.service';
import { TourPackage } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [allPackages, setAllPackages] = useState<TourPackage[]>(MOCK_TOUR_PACKAGES);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const live = await getAllTourPackages();
        if (isMounted && live && live.length > 0) {
          setAllPackages(live);
        }
      } catch (err) {
        console.error('Failed to load packages in search:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? allPackages.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.destination.toLowerCase().includes(query.toLowerCase()) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
      )
    : allPackages.slice(0, 4);

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, packages (e.g. Rajasthan, Kerala, Ladakh)..."
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-4 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold">
            <span>{query.trim() ? `Search Results (${filtered.length})` : 'Popular Experiences'}</span>
            <Link
              href="/tour-packages"
              onClick={onClose}
              className="text-black hover:underline flex items-center gap-1 lowercase"
            >
              <span>view all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No matching tour packages found for &quot;{query}&quot;. Try searching Rajasthan, Kerala, or Ladakh.
              </div>
            ) : (
              filtered.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/tour-packages/${pkg.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition group"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src={pkg.heroImage}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        {pkg.duration}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {pkg.destination}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-black truncate">
                      {pkg.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {pkg.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-gray-900 block">
                      ₹{pkg.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400">/ person</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors shrink-0">
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
