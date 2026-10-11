'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Expand } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
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
  {
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    title: 'Private Journeys',
    caption: 'Unhurried routes with a guide who knows every story along the way.',
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    title: 'Luxury Stays',
    caption: 'Slow mornings at handpicked stays in beautiful locations.',
  },
  {
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    title: 'Cultural Immersion',
    caption: 'Meeting local artisans and tasting food made the traditional way.',
  },
];

// Tiles per row, and how wide each tile is relative to its row-mates.
// Tip: add 10+ photos to `photos` so no picture repeats.
const ROWS: number[][] = [
  [1.5, 1, 1.25],
  [1, 1.35, 1, 1.2],
  [1.2, 1, 1.6],
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

  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Heading fades up
        if (head.current) {
          gsap.from(head.current.children, {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: head.current, start: 'top 85%', once: true },
          });
        }

        // Mosaic: rows slide in from opposite sides and tiles scale up while
        // you scroll, so the scattered photos "lock" into one clean grid.
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]', grid.current);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid.current,
            start: 'top 92%',
            end: 'top 30%',
            scrub: 1,
          },
        });
        rows.forEach((row, i) => {
          tl.fromTo(
            row,
            { xPercent: (i % 2 === 0 ? -1 : 1) * 22 },
            { xPercent: 0, ease: 'power2.out', duration: 1 },
            0
          );
        });
        tl.fromTo(
          '[data-tile]',
          { scale: 0.82, opacity: 0.15 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            duration: 1,
            stagger: { each: 0.03, from: 'edges' },
          },
          0
        );
      });
    },
    { scope: root }
  );

  // Build the rows from the photos (cycles if there are fewer photos than tiles)
  let cursor = 0;
  const rowsData = ROWS.map((weights) =>
    weights.map((w) => {
      const photoIndex = cursor % photos.length;
      cursor += 1;
      return { weight: w, photoIndex, photo: photos[photoIndex] };
    })
  );

  return (
    <section ref={root} className="relative overflow-x-clip py-20 sm:py-28 bg-[#fcfbfa]">
      {/* Heading */}
      <div ref={head} className="max-w-2xl mx-auto px-6 sm:px-8 text-center space-y-4 sm:space-y-5">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-[#c58b59]" />
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
            {tag}
          </span>
          <span className="h-px w-8 bg-[#c58b59]" />
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#18281d] leading-[1.08] whitespace-pre-line tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-stone-500 font-light leading-relaxed max-w-md mx-auto">
          {description}
        </p>
        <div className="pt-2">
          <button
            onClick={() => openLightbox(0)}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#18281d] text-white text-xs sm:text-sm font-medium hover:bg-[#c58b59] transition-colors duration-300 shadow-sm"
          >
            <span>Explore Gallery</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Full-width mosaic */}
      <div ref={grid} className="group/grid mt-14 sm:mt-20 px-3 sm:px-4 space-y-3 sm:space-y-4">
        {rowsData.map((row, r) => (
          <div key={r} data-row className="flex gap-3 sm:gap-4 h-28 sm:h-44 lg:h-56 will-change-transform">
            {row.map((tile, t) => (
              <button
                key={t}
                type="button"
                data-tile
                onClick={() => openLightbox(tile.photoIndex)}
                aria-label={`Open ${tile.photo.title}`}
                style={{ flex: `${tile.weight} 1 0%` }}
                className="group/tile relative min-w-0 overflow-hidden rounded-xl sm:rounded-2xl bg-stone-200 cursor-pointer text-left"
              >
                <Image
                  src={tile.photo.url}
                  alt={tile.photo.title}
                  fill
                  sizes="(min-width: 1024px) 28vw, 45vw"
                  className="object-cover group-hover/tile:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Dims every tile except the hovered one */}
                <span className="pointer-events-none absolute inset-0 bg-[#fcfbfa]/60 opacity-0 group-hover/grid:opacity-100 group-hover/tile:opacity-0! transition-opacity duration-300" />
                {/* Title on hover */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/65 to-transparent text-white flex items-end justify-between translate-y-2 opacity-0 group-hover/tile:translate-y-0 group-hover/tile:opacity-100 transition duration-300">
                  <span className="font-serif text-sm sm:text-base leading-tight">{tile.photo.title}</span>
                  <Expand className="w-3.5 h-3.5 shrink-0" />
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <GalleryLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={photos}
        initialIndex={lightboxIndex}
      />
    </section>
  );
}