'use client';

import React, { useState, useEffect } from 'react';
import { Reveal, RevealGroup } from '@/components/animation/Reveal';
import { Parallax } from '@/components/animation/Parallax';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { DestinationItem } from '@/types';
import { getPopularDestinations, FALLBACK_DESTINATIONS } from '@/services/destination.service';

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
  destinations,
}: PopularDestinationsProps) {
  const [items, setItems] = useState<DestinationItem[]>(destinations || FALLBACK_DESTINATIONS);

  useEffect(() => {
    if (destinations && destinations.length > 0) {
      setItems(destinations);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const liveItems = await getPopularDestinations();
        if (isMounted && liveItems && liveItems.length > 0) {
          setItems(liveItems);
        }
      } catch (err) {
        console.warn('[PopularDestinations] Failed to load live destinations:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [destinations]);

  // Determine responsive grid column spans depending on item count
  const total = items.length;

  const getColSpan = (idx: number): string => {
    if (total === 5) {
      // Classic asymmetric 5-card layout: 3 top, 2 wide bottom
      if (idx < 3) return 'md:col-span-4';
      if (idx === 3) return 'md:col-span-7';
      return 'md:col-span-5';
    }

    if (total === 4) {
      // 2x2 balanced layout
      return 'md:col-span-6';
    }

    if (total % 3 === 0) {
      // Balanced 3-column layout (3, 6, 9 items)
      return 'md:col-span-4';
    }

    // Default flexible grid: top 3 are cols-4, remainder fill nicely
    if (idx < 3) return 'md:col-span-4';
    if (idx === 3 && (total - 3) % 2 === 0) return 'md:col-span-6';
    if (idx === 4 && (total - 3) % 2 === 0) return 'md:col-span-6';
    return 'md:col-span-4';
  };

  const getHeightClass = (idx: number): string => {
    if (total === 5 && idx >= 3) {
      return 'h-64 sm:h-76';
    }
    return 'h-72 sm:h-84';
  };

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <span className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
              {tag}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight font-serif">
              {title}
            </h2>
          </div>
          <div className="lg:max-w-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
            <Link
              href="/tour-packages"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap shrink-0 group"
            >
              <span>View All Destinations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>

        {/* Dynamic Responsive Destinations Grid */}
        <RevealGroup className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6" stagger={0.12}>
          {items.map((item, idx) => {
            const key = item.id || item._id || item.slug || `dest-${idx}`;
            const colSpan = getColSpan(idx);
            const heightClass = getHeightClass(idx);

            return (
              <div key={key} className={colSpan}>
                <DestinationCard item={item} heightClass={heightClass} />
              </div>
            );
          })}
        </RevealGroup>
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
  const targetHref =
    item.href && item.href.trim() !== ''
      ? item.href
      : `/tour-packages?destination=${encodeURIComponent(item.name)}`;

  return (
    <Link
      href={targetHref}
      className={`group relative ${heightClass} w-full rounded-2xl sm:rounded-3xl overflow-hidden block bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300`}
    >
      <Parallax>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </Parallax>
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Card Content at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between text-white">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 font-serif">
            {item.name}
          </h3>
          <p className="text-xs text-white/80 font-normal tracking-wide">
            {Array.isArray(item.tags) ? item.tags.join(' • ') : item.tags}
          </p>
        </div>

        {/* Circular Action Button */}
        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300 shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
