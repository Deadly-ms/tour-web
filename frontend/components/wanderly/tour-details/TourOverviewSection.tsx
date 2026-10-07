'use client';

import React from 'react';
import { Compass, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { TourPackage } from '@/types';

interface TourOverviewSectionProps {
  pkg: TourPackage;
}

export function TourOverviewSection({ pkg }: TourOverviewSectionProps) {
  const specs = [
    {
      icon: Compass,
      label: 'Trip Type',
      value: pkg.tripType || 'Private Tour',
    },
    {
      icon: Calendar,
      label: 'Best Time',
      value: pkg.bestTime || 'Oct - Mar',
    },
    {
      icon: Clock,
      label: 'Duration',
      value: pkg.duration,
    },
    {
      icon: MapPin,
      label: 'Start - End',
      value: pkg.startEnd || pkg.destination,
    },
    {
      icon: Tag,
      label: 'Starting From',
      value: `₹ ${pkg.price.toLocaleString()} / person`,
    },
  ];

  return (
    <section id="overview" className="space-y-6 pt-4">
      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#18281d]">
        Overview
      </h2>
      <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
        {pkg.overview}
      </p>

      {/* 5 Quick Specs Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        {specs.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border border-[#e8e4dc] space-y-1 shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                <IconComp className="w-3.5 h-3.5 text-[#c58b59]" />
                <span>{item.label}</span>
              </div>
              <p className="font-serif text-xs sm:text-sm font-medium text-stone-900 truncate">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
