'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, Landmark, Sparkles, Crown } from 'lucide-react';
import { TourPackage } from '@/types';

interface TourDetailsHeroProps {
  pkg: TourPackage;
  onPlanClick: () => void;
}

export function TourDetailsHero({ pkg, onPlanClick }: TourDetailsHeroProps) {
  return (
    <section className="relative w-full h-[62vh] min-h-[460px] max-h-[640px] flex items-end overflow-hidden bg-stone-900 select-none pb-12 sm:pb-16">
      {/* Cinematic Destination Image */}
      <div className="absolute inset-0">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-8">
        <div className="max-w-3xl space-y-4 sm:space-y-5 text-white">
          {/* Destination Uppercase Tag */}
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#e8cbb0] uppercase">
              {pkg.destination.split(',')[0]}
            </span>
          </div>

          {/* Large Serif Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight drop-shadow-md">
            {pkg.title}
          </h1>

          {/* Meta Tags Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white/90 font-light">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <Clock className="w-3.5 h-3.5 text-[#e8cbb0]" />
              <span>{pkg.duration}</span>
            </span>

            {pkg.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20"
              >
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Price & Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-medium text-white">
                ₹ {pkg.price.toLocaleString()}
              </span>
              <span className="text-xs text-white/70 font-light"> / person</span>
            </div>

            <button
              onClick={onPlanClick}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-[#18281d] text-xs sm:text-sm font-semibold hover:bg-stone-100 transition-all duration-300 shadow-lg group hover:scale-105"
            >
              <span>Plan This Journey</span>
              <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
