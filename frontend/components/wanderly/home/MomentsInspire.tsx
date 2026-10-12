'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Expand } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
import { GalleryLightboxModal } from '../modals/GalleryLightboxModal';
import Link from 'next/link';
import { SectionHeader } from '@/components/animation/SectionHeader';
import { getPublicGallery } from '@/services/gallery.service';

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
  const [activePhotos, setActivePhotos] = useState<GalleryPhoto[]>(photos);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  // Fetch live photos from database so admin edits immediately show on homepage
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getPublicGallery();
        if (res.success && res.data.length > 0 && isMounted) {
          const mapped: GalleryPhoto[] = res.data.map((item) => ({
            url: item.imageUrl,
            title: item.title,
            caption: item.caption || '',
          }));
          setActivePhotos(mapped);
        }
      } catch (err) {
        console.error('Failed to load live gallery photos for homepage:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const photoList = activePhotos.length > 0 ? activePhotos : DEFAULT_PHOTOS;

  // Header subtitle and button animation - decoupled from photoList state
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (head.current) {
          gsap.fromTo(
            '[data-fade]',
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: { trigger: head.current, start: 'top 85%', once: true },
              clearProps: 'all',
            }
          );
        }
      });
    },
    { scope: head }
  );

  // Mosaic: rows slide in from opposite sides and tiles settle as you scroll
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (!grid.current) return;
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]', grid.current);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid.current,
            start: 'top 95%',
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
          { scale: 0.88, opacity: 0.5 },
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
    { scope: grid, dependencies: [photoList] }
  );

  // Build the rows from the photos (cycles if there are fewer photos than tiles)
  const rowsData = ROWS.map((weights, rowIndex) => {
    const rowStartIndex = ROWS.slice(0, rowIndex).reduce((acc, row) => acc + row.length, 0);
    return weights.map((w, colIndex) => {
      const photoIndex = (rowStartIndex + colIndex) % photoList.length;
      return { weight: w, photoIndex, photo: photoList[photoIndex] };
    });
  });

  // Split title lines cleanly for SectionHeader
  const headerLines = title.includes('\n')
    ? title.split('\n')
    : title.includes('That')
    ? ['Moments That', 'Inspire.']
    : [title];

  return (
    <section ref={root} className="relative overflow-x-clip py-20 sm:py-28 bg-white">
      {/* Heading matching About Page typography */}
      <div ref={head} className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <SectionHeader
          eyebrow={tag}
          lines={headerLines}
          align="center"
          className="mb-4"
        />

        <p
          data-fade
          className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg mx-auto"
        >
          {description}
        </p>

        <div data-fade className="pt-6">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-black hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md ring-1 ring-black/10"
          >
            <span>Explore Gallery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
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
                className="group/tile relative min-w-0 overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 cursor-pointer text-left"
              >
                <Image
                  src={tile.photo.url}
                  alt={tile.photo.title}
                  fill
                  sizes="(min-width: 1024px) 28vw, 45vw"
                  className="object-cover group-hover/tile:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Dims every tile except the hovered one */}
                <span className="pointer-events-none absolute inset-0 bg-white/60 opacity-0 group-hover/grid:opacity-100 group-hover/tile:opacity-0! transition-opacity duration-300" />
                {/* Title on hover */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/65 to-transparent text-white flex items-end justify-between translate-y-2 opacity-0 group-hover/tile:translate-y-0 group-hover/tile:opacity-100 transition duration-300">
                  <span className="text-sm sm:text-base font-bold leading-tight">{tile.photo.title}</span>
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
        images={photoList}
        initialIndex={lightboxIndex}
      />
    </section>
  );
}