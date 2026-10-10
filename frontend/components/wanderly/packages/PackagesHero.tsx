'use client';

import React from 'react';
import Image from 'next/image';

interface PackagesHeroProps {
  tag?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  image?: string;
}

export function PackagesHero({
  tag = 'OUR JOURNEYS',
  titleLine1 = 'Find your perfect',
  titleLine2 = 'desert experience',
  subtitle = 'Explore handpicked tour packages designed for adventure, comfort and unforgettable memories.',
  image = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=85',
}: PackagesHeroProps) {
  return (
    <section className="relative w-full h-[52vh] min-h-[380px] max-h-[500px] flex items-center justify-center overflow-hidden bg-stone-900 select-none">
      {/* Warm Golden Dunes Background */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="Golden desert dunes at warm sunset"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/30" />
      </div>

      {/* Hero Typography */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center text-white space-y-4 py-6 sm:py-8">
        <div className="inline-block">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#e8cbb0] uppercase">
            {tag}
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-white drop-shadow-sm">
          {titleLine1} <br />
          {titleLine2}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-stone-200 font-light max-w-lg mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
