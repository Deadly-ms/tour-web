'use client';

import React from 'react';
import { PhoneCall, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { TourPackage } from '@/types';

interface TourBookingSidebarProps {
  pkg: TourPackage;
  onPlanClick: () => void;
}

export function TourBookingSidebar({ pkg, onPlanClick }: TourBookingSidebarProps) {
  return (
    <aside className="sticky top-28 space-y-6">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            {pkg.destination}
          </span>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {pkg.title}
          </h3>
          <p className="text-xs text-gray-400 font-normal mt-0.5">
            {pkg.duration}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-baseline justify-between">
          <span className="text-xs text-gray-500 font-normal">Starting from</span>
          <div>
            <span className="text-3xl font-bold text-gray-900">
              ₹ {pkg.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 font-normal"> / person</span>
          </div>
        </div>

        <button
          onClick={onPlanClick}
          className="w-full py-3.5 rounded-full bg-black text-white text-xs sm:text-sm font-semibold hover:bg-gray-800 transition-all duration-300 shadow-md flex items-center justify-center gap-2 group hover:scale-[1.02]"
        >
          <span>Plan This Journey</span>
          <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
        </button>

        {/* Helpline Callout */}
        <div className="pt-4 border-t border-gray-100 text-center space-y-1">
          <p className="text-[11px] text-gray-500 font-normal">
            Need Help? Talk to our travel expert
          </p>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:text-gray-700 transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-black" />
            <span>+91 98765 43210</span>
          </a>
        </div>

        {/* Confidence Guarantees */}
        <div className="pt-4 border-t border-gray-100 space-y-2.5 text-[11px] text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% Customizable Private Itinerary</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Sanitized Private Fleet &amp; Chauffeur</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Best Curated Heritage &amp; Boutique Stays</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
