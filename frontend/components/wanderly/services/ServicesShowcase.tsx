'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Map,
  Hotel,
  Car,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  showcaseImage: string;
  showcaseTitle: string;
  showcaseDescription: string;
  href: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'private-tours',
    number: '01',
    title: 'Private Tours',
    description: 'Tailored experiences for you and your group.',
    icon: Compass,
    showcaseImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Private Tours',
    showcaseDescription: 'Bespoke chauffeurs, private guides, and exclusive access.',
    href: '/tour-packages',
  },
  {
    id: 'custom-itineraries',
    number: '02',
    title: 'Custom Itineraries',
    description: 'Designed around your interests and pace.',
    icon: Map,
    showcaseImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Custom Itineraries',
    showcaseDescription: 'Crafted to your rhythm, whether slow exploration or grand circuit.',
    href: '/contact',
  },
  {
    id: 'hotel-stays',
    number: '03',
    title: 'Hotel & Stays',
    description: 'Handpicked stays in stunning locations.',
    icon: Hotel,
    showcaseImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Luxury Stays',
    showcaseDescription: 'Relax in the most beautiful places on earth.',
    href: '/tour-packages',
  },
  {
    id: 'transportation',
    number: '04',
    title: 'Transportation',
    description: 'Comfortable and safe travel options.',
    icon: Car,
    showcaseImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Seamless Conveyance',
    showcaseDescription: 'Sanitized premium fleet with seasoned chauffeurs.',
    href: '/contact',
  },
  {
    id: 'local-experiences',
    number: '05',
    title: 'Local Experiences',
    description: 'Authentic encounters with local culture.',
    icon: Sparkles,
    showcaseImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Cultural Immersion',
    showcaseDescription: 'Cooking with local chefs, tea plantation walks, and village artisans.',
    href: '/tour-packages',
  },
];

interface ServicesShowcaseProps {
  services?: ServiceItem[];
}

export function ServicesShowcase({ services = DEFAULT_SERVICES }: ServicesShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(2); // Default to Hotel & Stays as shown in image
  const selected = services[selectedIndex];

  return (
    <section className="py-20 sm:py-24 bg-[#faf8f5] border-y border-[#e8e4dc]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Numbered Services List */}
          <div className="lg:col-span-6 space-y-4">
            {services.map((item, idx) => {
              const IconComp = item.icon;
              const isCurrent = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                    isCurrent
                      ? 'bg-white shadow-sm border border-[#e8e4dc]'
                      : 'hover:bg-white/60 border border-transparent'
                  }`}
                >
                  {/* Number Badge */}
                  <div className="flex items-center gap-2 pt-0.5 shrink-0">
                    <span className="font-mono text-xs text-stone-400 font-medium">
                      {item.number}
                    </span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isCurrent ? 'bg-[#18281d] text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1">
                    <h3 className={`font-serif text-lg font-medium transition-colors ${
                      isCurrent ? 'text-[#18281d]' : 'text-stone-800'
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isCurrent ? 'text-[#18281d]' : 'text-stone-300'
                  }`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Featured Showcase Card */}
          <div className="lg:col-span-6">
            <Link
              href={selected.href}
              className="group relative h-[440px] sm:h-[520px] w-full rounded-2xl sm:rounded-3xl overflow-hidden block shadow-lg bg-stone-200"
            >
              <Image
                src={selected.showcaseImage}
                alt={selected.showcaseTitle}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Showcase Card Overlay at Bottom */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-end justify-between">
                <div>
                  <h4 className="font-serif text-2xl font-normal text-white">
                    {selected.showcaseTitle}
                  </h4>
                  <p className="text-xs text-white/80 font-light mt-1 max-w-sm">
                    {selected.showcaseDescription}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white text-[#18281d] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
