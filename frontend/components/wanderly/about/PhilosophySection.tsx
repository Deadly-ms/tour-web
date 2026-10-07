'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PhilosophySectionProps {
  tag?: string;
  title?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function PhilosophySection({
  tag = 'OUR PHILOSOPHY',
  title = 'Travel slowly.\nLook closer.\nStay curious.',
  description = 'At Wanderly, we believe that travel is not just about visiting new places, but about feeling, learning and connecting. We create meaningful journeys that bring you closer to nature, people and yourself.',
  image = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  buttonText = 'Our Story',
  buttonHref = '/contact',
}: PhilosophySectionProps) {
  return (
    <section id="philosophy-section" className="py-20 sm:py-24 bg-[#faf8f5] border-y border-[#e8e4dc]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
              {tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18281d] leading-tight whitespace-pre-line tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-lg pt-1">
              {description}
            </p>
            <div className="pt-4">
              <Link
                href={buttonHref}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#18281d] text-white text-xs sm:text-sm font-medium hover:bg-[#253d2c] transition-colors shadow-sm"
              >
                <span>{buttonText}</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6">
            <div className="relative h-[340px] sm:h-[440px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-stone-200">
              <Image
                src={image}
                alt="Coastal cliff village overlooking shimmering blue sea"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
