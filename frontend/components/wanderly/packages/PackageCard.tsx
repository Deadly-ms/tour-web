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
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg flex flex-col"
    >
      {/* Image with Duration Badge */}
      <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-gray-100">
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
          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span className="truncate">{pkg.destination}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
            {pkg.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 font-normal tracking-wide">
            {pkg.tags && pkg.tags.length > 0 ? pkg.tags.join(' • ') : pkg.category}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ₹ {pkg.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 font-normal"> / person</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-gray-700 transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
