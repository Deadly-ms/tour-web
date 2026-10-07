'use client';

import React from 'react';
import Image from 'next/image';
import { Compass, Users, Hotel, Headphones } from 'lucide-react';

interface FeaturePoint {
  icon: React.ElementType;
  title: string;
  description: string;
}

const DEFAULT_FEATURES: FeaturePoint[] = [
  {
    icon: Compass,
    title: 'Personalized Itineraries',
    description: 'Tailored to your interests and pace.',
  },
  {
    icon: Users,
    title: 'Local Expertise',
    description: 'Real people, real stories, local connections.',
  },
  {
    icon: Hotel,
    title: 'Premium Stays',
    description: 'Handpicked hotels & resorts in stunning locations.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: "We're with you, every step of the way.",
  },
];

interface WhyChooseUsProps {
  tag?: string;
  title?: string;
  subtitle?: string;
  features?: FeaturePoint[];
  image?: string;
}

export function WhyChooseUs({
  tag = 'WHY CHOOSE US',
  title = 'Your Journey,\nOur Priority.',
  subtitle = 'We go beyond bookings. We craft personalized experiences with local expertise, trusted partners and a passion for travel.',
  features = DEFAULT_FEATURES,
  image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
}: WhyChooseUsProps) {
  return (
    <section className="py-20 sm:py-24 bg-[#fcfbfa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Traveler Image */}
          <div className="lg:col-span-5">
            <div className="relative h-[480px] sm:h-[560px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md">
              <Image
                src={image}
                alt="Traveler exploring scenic vistas"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right: Narrative + 2x2 Feature Grid */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">
            <div className="space-y-3">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
                {tag}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18281d] leading-tight whitespace-pre-line tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-lg pt-1">
                {subtitle}
              </p>
            </div>

            {/* 2x2 Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              {features.map((f, i) => {
                const IconComponent = f.icon;
                return (
                  <div key={i} className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-[#faf8f5] border border-[#e8e4dc] flex items-center justify-center text-[#18281d] shadow-sm mb-3">
                      <IconComponent className="w-4 h-4 text-[#18281d]" />
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-medium text-[#18281d]">
                      {f.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
