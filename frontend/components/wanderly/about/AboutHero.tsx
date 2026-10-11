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
  image = "/img2.jpg",
}: AboutHeroProps) {
  const handleScrollDown = () => {
    const philosophyEl = document.getElementById('philosophy-section');
    if (philosophyEl) {
      philosophyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-gray-500 uppercase">
                ABOUT TRACK YOUR TRIP
              </span>
              <h1 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.08] tracking-tight">
                {titleLine1} <br />
                {titleLine2}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-normal max-w-md leading-relaxed pt-2">
                {subtitle}
              </p>
            </div>

            {/* Scroll Down Link */}
            <div className="pt-4">
              <button
                onClick={handleScrollDown}
                className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors group"
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
