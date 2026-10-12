'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PackageCard } from './PackageCard';
import { TourPackage } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
import { Reveal } from '@/components/animation/Reveal';

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

  const section = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  // Changes whenever the filters or sorting produce a different list
  const signature = packages.map((p) => p.id).join('|');

  // Go back to page 1 when the list changes (otherwise you can land on an empty page)
  useEffect(() => {
    setCurrentPage(1);
  }, [signature]);

  // Header fades in once
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(head.current, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: head.current, start: 'top 90%', once: true },
        });
      });
    },
    { scope: section }
  );

  // The package count rolls up every time it changes
  useGSAP(
    () => {
      if (!count.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(count.current, { yPercent: 70, opacity: 0, duration: 0.6, ease: 'power3.out' });
      });
    },
    { scope: section, dependencies: [packages.length] }
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    section.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section ref={section} className="pt-16 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Count & Sort Header */}
        <div
          ref={head}
          className="flex items-center justify-between pb-6 border-b border-gray-200 mb-10"
        >
          <span className="text-lg font-bold text-gray-900">
            <span key={packages.length} ref={count} className="inline-block">
              {packages.length}
            </span>{' '}
            Packages
          </span>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-normal text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-gray-900 focus:outline-none cursor-pointer py-1"
            >
              <option value="popular">Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Guest Rating</option>
            </select>
          </div>
        </div>

        {/* Packages 3-Col Grid (remounts on every filter / page change so the cards animate in again) */}
        {currentPackages.length === 0 ? (
          <Reveal className="py-20 text-center space-y-3">
            <p className="text-2xl font-bold text-gray-900">No tour packages match your filters.</p>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Try adjusting your destination, duration, or travel style to discover other unforgettable journeys.
            </p>
          </Reveal>
        ) : (
          <div
            key={`${signature}-${currentPage}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {currentPackages.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {packages.length > 0 && (
          <Reveal className="mt-16">
            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold transition ${
                    currentPage === page
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <span className="text-gray-400 px-1">...</span>

              <button
                onClick={() => goToPage(10)}
                className="w-8 h-8 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                10
              </button>

              <button
                onClick={() => goToPage(Math.min(10, currentPage + 1))}
                disabled={currentPage === 10}
                className="p-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}