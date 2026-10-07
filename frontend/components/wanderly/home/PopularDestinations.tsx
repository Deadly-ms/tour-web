'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export interface DestinationItem {
  id: string;
  name: string;
  tags: string[];
  image: string;
  href: string;
}

const DEFAULT_DESTINATIONS: DestinationItem[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    tags: ['Heritage', 'Culture', 'Desert'],
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    href: '/tour-packages/rajasthan-royal-escape',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    tags: ['Backwaters', 'Nature', 'Wellness'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    href: '/tour-packages/kerala-backwaters',
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    tags: ['Mountains', 'Adventure', 'Peace'],
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    href: '/tour-packages/ladakh-adventure',
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    tags: ['Clouds', 'Adventure', 'Valleys'],
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    href: '/tour-packages/meghalaya-escape',
  },
  {
    id: 'goa',
    name: 'Goa',
    tags: ['Beaches', 'Relaxation', 'Nightlife'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    href: '/tour-packages/goa-beach-holiday',
  },
];

interface PopularDestinationsProps {
  title?: string;
  tag?: string;
  description?: string;
  destinations?: DestinationItem[];
}

export function PopularDestinations({
  title = 'Popular Destinations',
  tag = 'DISCOVER',
  description = 'From snow-capped mountains to serene backwaters, explore handpicked destinations that bring you closer to nature, culture and adventure.',
  destinations = DEFAULT_DESTINATIONS,
}: PopularDestinationsProps) {
  return (
    <section className="py-20 sm:py-24 bg-[#fcfbfa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
              {tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18281d] tracking-tight">
              {title}
            </h2>
          </div>
          <div className="lg:max-w-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
              {description}
            </p>
            <Link
              href="/tour-packages"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#18281d] hover:text-[#c58b59] transition-colors whitespace-nowrap shrink-0 group"
            >
              <span>View All Destinations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Asymmetrical 5-Item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Top Row: 3 items (Cols 4, 4, 4) */}
          {destinations.slice(0, 3).map((item) => (
            <div key={item.id} className="md:col-span-4">
              <DestinationCard item={item} heightClass="h-72 sm:h-80" />
            </div>
          ))}

          {/* Bottom Row: 2 items (Cols 7, 5) */}
          {destinations.slice(3, 5).map((item, idx) => (
            <div
              key={item.id}
              className={idx === 0 ? 'md:col-span-7' : 'md:col-span-5'}
            >
              <DestinationCard item={item} heightClass="h-64 sm:h-72" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationCard({
  item,
  heightClass,
}: {
  item: DestinationItem;
  heightClass: string;
}) {
  return (
    <Link
      href={item.href}
      className={`group relative ${heightClass} w-full rounded-2xl sm:rounded-3xl overflow-hidden block bg-stone-200 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      {/* Card Content at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between text-white">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-white mb-1.5">
            {item.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-white/75 font-light tracking-wide">
            {item.tags.join(' • ')}
          </p>
        </div>

        {/* Circular Action Button */}
        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#18281d] group-hover:scale-110 transition-all duration-300 shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
