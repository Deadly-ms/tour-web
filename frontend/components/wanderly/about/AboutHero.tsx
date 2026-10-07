'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

interface AboutHeroProps {
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  image?: string;
}

export function AboutHero({
  titleLine1 = 'MORE THAN',
  titleLine2 = 'A JOURNEY.',
  subtitle = 'We believe travel should change the way you see the world.',
  image = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
}: AboutHeroProps) {
  const handleScrollDown = () => {
    const philosophyEl = document.getElementById('philosophy-section');
    if (philosophyEl) {
      philosophyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 bg-[#fcfbfa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
                ABOUT WANDERLY
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#18281d] leading-[1.08] tracking-tight">
                {titleLine1} <br />
                {titleLine2}
              </h1>
              <p className="text-sm sm:text-base text-stone-600 font-light max-w-md leading-relaxed pt-2">
                {subtitle}
              </p>
            </div>

            {/* Scroll Down Link */}
            <div className="pt-4">
              <button
                onClick={handleScrollDown}
                className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-[#18281d] transition-colors group"
              >
                <span>Scroll Down</span>
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-6">
            <div className="relative h-[360px] sm:h-[480px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-stone-200">
              <Image
                src={image}
                alt="Traveler sitting on scenic mountain ridge"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
