'use client';

import React from 'react';
import Image from 'next/image';

interface ServicesHeroProps {
  tag?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  image?: string;
}

export function ServicesHero({
  tag = 'OUR SERVICES',
  titleLine1 = 'Everything you need.',
  titleLine2 = "Nothing you don't.",
  subtitle = 'From planning to on-ground support, we take care of every detail so you can focus on what matters — experiencing the journey.',
  image = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
}: ServicesHeroProps) {
  return (
    <section className="pt-10 sm:pt-14 pb-16 sm:pb-20 bg-[#fcfbfa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
              {tag}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#18281d] leading-[1.12] tracking-tight">
              {titleLine1} <br />
              {titleLine2}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-light max-w-md leading-relaxed pt-1">
              {subtitle}
            </p>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6">
            <div className="relative h-[340px] sm:h-[440px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-stone-200">
              <Image
                src={image}
                alt="Turquoise mountain lake surrounded by peaks"
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
