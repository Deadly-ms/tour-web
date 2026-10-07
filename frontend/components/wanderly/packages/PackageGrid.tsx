'use client';

import React, { useState } from 'react';
import { PackageCard } from './PackageCard';
import { TourPackage } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PackageGridProps {
  packages: TourPackage[];
  sortBy: string;
  setSortBy: (val: string) => void;
}

export function PackageGrid({ packages, sortBy, setSortBy }: PackageGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(packages.length / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPackages = packages.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="pt-16 pb-24 bg-[#fcfbfa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Count & Sort Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#e8e4dc] mb-10">
          <span className="font-serif text-lg text-stone-700">
            {packages.length} Packages
          </span>

          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span className="font-light">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer py-1"
            >
              <option value="popular">Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Guest Rating</option>
            </select>
          </div>
        </div>

        {/* Packages 3-Col Grid */}
        {currentPackages.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="font-serif text-2xl text-stone-800">No tour packages match your filters.</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your destination, duration, or travel style to discover other unforgettable journeys.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {currentPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {packages.length > 0 && (
          <div className="mt-16 flex items-center justify-center gap-2 text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition ${
                  currentPage === page
                    ? 'bg-[#18281d] text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {page}
              </button>
            ))}

            <span className="text-stone-400 px-1">...</span>

            <button
              onClick={() => setCurrentPage(10)}
              className="w-8 h-8 rounded-full text-xs font-medium text-stone-700 hover:bg-stone-100 transition"
            >
              10
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
              disabled={currentPage === 10}
              className="p-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
