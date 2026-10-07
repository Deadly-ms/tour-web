'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { TourPackage } from '@/types';

interface PackageCardProps {
  pkg: TourPackage;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <Link
      href={`/tour-packages/${pkg.slug}`}
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#e8e4dc] hover:border-[#cfc9bc] transition-all duration-300 hover:shadow-lg flex flex-col"
    >
      {/* Image with Duration Badge */}
      <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-stone-100">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Top Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide">
          {pkg.duration}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
            <MapPin className="w-3 h-3 text-[#c58b59]" />
            <span className="truncate">{pkg.destination}</span>
          </div>
          <h3 className="font-serif text-xl font-normal text-[#18281d] group-hover:text-[#c58b59] transition-colors">
            {pkg.title}
          </h3>
          <p className="text-xs text-stone-400 mt-1 font-light tracking-wide">
            {pkg.tags && pkg.tags.length > 0 ? pkg.tags.join(' • ') : pkg.category}
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
  );
}
