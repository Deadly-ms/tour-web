'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { TourPackage } from '@/types';

interface TourInclusionsSectionProps {
  pkg: TourPackage;
}

export function TourInclusionsSection({ pkg }: TourInclusionsSectionProps) {
  return (
    <section id="inclusions" className="space-y-6 pt-10 border-t border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        What&apos;s Included &amp; Excluded
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inclusions */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
              ✓
            </span>
            <span>Included in the Package</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 font-normal">
            {pkg.inclusions.map((inc, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{inc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div id="exclusions" className="p-6 rounded-2xl bg-white border border-gray-200 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
              ✕
            </span>
            <span>Not Included</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 font-normal">
            {pkg.exclusions.map((exc, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>{exc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
