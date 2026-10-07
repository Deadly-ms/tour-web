'use client';

import React, { useState, useEffect } from 'react';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'inclusions', label: 'Inclusions' },
  { id: 'exclusions', label: 'Exclusions' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'faq', label: 'FAQ' },
];

export function TourDetailsTabs() {
  const [activeTab, setActiveTab] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-16 sm:top-20 z-30 bg-[#fcfbfa]/95 backdrop-blur-md border-b border-[#e8e4dc] transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto py-3.5 scrollbar-none text-xs sm:text-sm font-medium">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`whitespace-nowrap transition-colors relative py-1 ${
                  isActive
                    ? 'text-[#18281d] font-semibold'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#18281d] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
