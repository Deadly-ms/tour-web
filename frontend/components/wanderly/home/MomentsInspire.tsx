'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GalleryLightboxModal } from '../modals/GalleryLightboxModal';

interface GalleryPhoto {
  url: string;
  title: string;
  caption: string;
}

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  {
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    title: 'Golden Thar Dunes',
    caption: 'Sunset ripples across the vast desert dunes outside Jaisalmer.',
  },
  {
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    title: 'Himalayan Stargazing',
    caption: 'Clear galactic skies glowing over snow-clad jagged peaks in Spiti Valley.',
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    title: 'Alpine Lake Reflections',
    caption: 'Pristine glacial waters capturing the morning alpenglow.',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    title: 'Quiet Palm Shorelines',
    caption: 'Turquoise ocean swells touching untouched beaches of South Goa.',
  },
  {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    title: 'Road to Adventure',
    caption: 'Following the open highway across dramatic mountain switchbacks.',
  },
];

interface MomentsInspireProps {
  tag?: string;
  title?: string;
  description?: string;
  photos?: GalleryPhoto[];
}

export function MomentsInspire({
  tag = 'GALLERY',
  title = 'Moments\nThat Inspire.',
  description = 'A glimpse into the beautiful places and unforgettable experiences.',
  photos = DEFAULT_PHOTOS,
}: MomentsInspireProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <section className="py-20 sm:py-24 bg-[#fcfbfa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: Text & CTA */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
              {tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18281d] leading-tight whitespace-pre-line tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-xs">
              {description}
            </p>
            <div className="pt-2">
              <button
                onClick={() => openLightbox(0)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#18281d] hover:text-[#c58b59] transition-colors group"
              >
                <span>Explore Gallery</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Asymmetrical Mosaic */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Photo 1: Large feature */}
              <div
                onClick={() => openLightbox(0)}
                className="relative h-44 sm:h-52 rounded-2xl overflow-hidden cursor-pointer group bg-stone-200"
              >
                <Image
                  src={photos[0].url}
                  alt={photos[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Photo 2 */}
              <div
                onClick={() => openLightbox(1)}
                className="relative h-44 sm:h-52 rounded-2xl overflow-hidden cursor-pointer group bg-stone-200"
              >
                <Image
                  src={photos[1].url}
                  alt={photos[1].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Photo 3 */}
              <div
                onClick={() => openLightbox(2)}
                className="relative h-44 sm:h-52 rounded-2xl overflow-hidden cursor-pointer group bg-stone-200"
              >
                <Image
                  src={photos[2].url}
                  alt={photos[2].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Photo 4 */}
              <div
                onClick={() => openLightbox(3)}
                className="relative h-44 sm:h-52 rounded-2xl overflow-hidden cursor-pointer group bg-stone-200"
              >
                <Image
                  src={photos[3].url}
                  alt={photos[3].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Photo 5: double width or spanning */}
              <div
                onClick={() => openLightbox(4)}
                className="relative h-44 sm:h-52 rounded-2xl overflow-hidden cursor-pointer group bg-stone-200 sm:col-span-2"
              >
                <Image
                  src={photos[4].url}
                  alt={photos[4].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <GalleryLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={photos}
        initialIndex={lightboxIndex}
      />
    </section>
  );
}
