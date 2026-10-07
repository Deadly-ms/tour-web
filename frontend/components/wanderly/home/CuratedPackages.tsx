'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';
import { TourPackage } from '@/types';
import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';

interface CuratedPackagesProps {
  title?: string;
  tag?: string;
  description?: string;
  packages?: TourPackage[];
}

export function CuratedPackages({
  title = 'Curated Tour Packages',
  tag = 'FEATURED JOURNEYS',
  description = 'Thoughtfully designed itineraries for every kind of traveller — from solo explorers to family getaways.',
  packages,
}: CuratedPackagesProps) {
  // Grab the first 3 prominent packages
  const displayPackages = packages || MOCK_TOUR_PACKAGES.slice(0, 3);

  return (
    <section className="py-20 sm:py-24 bg-[#faf8f5] border-y border-[#e8e4dc]/70">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
              {tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18281d] tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-lg pt-1">
              {description}
            </p>
          </div>
          <div>
            <Link
              href="/tour-packages"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-300 text-stone-800 text-xs sm:text-sm font-medium hover:bg-[#18281d] hover:text-white hover:border-[#18281d] transition-all duration-300 shadow-sm"
            >
              <span>View All Packages</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* 3 Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayPackages.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/tour-packages/${pkg.slug}`}
              className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#e8e4dc] hover:border-[#cfc9bc] transition-all duration-300 hover:shadow-lg flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
                <Image
                  src={pkg.heroImage}
                  alt={pkg.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Duration Badge */}
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide">
                  {pkg.duration}
                </div>
              </div>

              {/* Card Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-normal text-[#18281d] group-hover:text-[#c58b59] transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 font-light tracking-wide">
                    {pkg.tags ? pkg.tags.join(' • ') : pkg.category}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f0ede6] flex items-center justify-between">
                  <div>
                    <span className="font-serif text-lg font-medium text-[#18281d]">
                      ₹ {pkg.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-400 font-light"> / person</span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#faf8f5] group-hover:bg-[#18281d] group-hover:text-white flex items-center justify-center text-stone-600 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
