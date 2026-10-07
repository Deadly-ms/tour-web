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
      <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#c58b59]">
            {pkg.destination}
          </span>
          <h3 className="font-serif text-2xl font-normal text-[#18281d] mt-1">
            {pkg.title}
          </h3>
          <p className="text-xs text-stone-400 font-light mt-0.5">
            {pkg.duration}
          </p>
        </div>

        <div className="pt-4 border-t border-[#f0ede6] flex items-baseline justify-between">
          <span className="text-xs text-stone-500 font-light">Starting from</span>
          <div>
            <span className="font-serif text-3xl font-medium text-[#18281d]">
              ₹ {pkg.price.toLocaleString()}
            </span>
            <span className="text-xs text-stone-400 font-light"> / person</span>
          </div>
        </div>

        <button
          onClick={onPlanClick}
          className="w-full py-3.5 rounded-full bg-[#18281d] text-white text-xs sm:text-sm font-medium hover:bg-[#253d2c] transition-all duration-300 shadow-md flex items-center justify-center gap-2 group hover:scale-[1.02]"
        >
          <span>Plan This Journey</span>
          <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
        </button>

        {/* Helpline Callout */}
        <div className="pt-4 border-t border-[#f0ede6] text-center space-y-1">
          <p className="text-[11px] text-stone-400 font-light">
            Need Help? Talk to our travel expert
          </p>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18281d] hover:text-[#c58b59] transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#c58b59]" />
            <span>+91 98765 43210</span>
          </a>
        </div>

        {/* Confidence Guarantees */}
        <div className="pt-4 border-t border-[#f0ede6] space-y-2.5 text-[11px] text-stone-500">
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
