'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
import { SectionHeader } from '@/components/animation/SectionHeader';
import { ScrollProgress } from '@/components/animation/ScrollProgress';
import { GalleryLightboxModal } from '@/components/wanderly/modals/GalleryLightboxModal';

interface GalleryPhoto {
  url: string;
  title: string;
  caption: string;
}

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const PHOTOS: GalleryPhoto[] = [
  { url: u('1509316975850-ff9c5deb0cd9'), title: 'Golden Thar Dunes', caption: 'Sunset ripples across the vast desert dunes outside Jaisalmer.' },
  { url: u('1519681393784-d120267933ba'), title: 'Himalayan Stargazing', caption: 'Clear galactic skies glowing over snow-clad peaks in Spiti Valley.' },
  { url: u('1581793745862-99fde7fa73d2'), title: 'Ladakh Highlands', caption: 'High-altitude silence under enormous skies.' },
  { url: u('1506744038136-46273834b3fb'), title: 'Alpine Lake Reflections', caption: 'Pristine glacial waters capturing the morning alpenglow.' },
  { url: u('1507525428034-b723cf961d3e'), title: 'Quiet Palm Shorelines', caption: 'Turquoise ocean swells touching untouched beaches of South Goa.' },
  { url: u('1544644181-1484b3fdfc62'), title: 'Meghalaya Valleys', caption: 'Clouds drifting through green valleys and living-root country.' },
  { url: u('1469854523086-cc02fe5d8800'), title: 'Road to Adventure', caption: 'Following the open highway across dramatic mountain switchbacks.' },
  { url: u('1599661046289-e31897846e41'), title: 'Rajasthan Heritage', caption: 'Forts, courtyards and the colours of the desert state.' },
  { url: u('1512343879784-a960bf40e7f2'), title: 'Goa Afternoons', caption: 'Slow days and warm light along the coast.' },
  { url: u('1602216056096-3b40cc0c9944'), title: 'Cultural Immersion', caption: 'Meeting local artisans and learning the craft behind the place.' },
  { url: u('1540555700478-4be289fbecef'), title: 'Luxury Stays', caption: 'Handpicked stays in beautiful locations.' },
  { url: u('1566073771259-6a8506099945'), title: 'Heritage Palace', caption: 'Sleeping inside history at a restored palace hotel.' },
  { url: u('1464822759023-fed622ff2c3b'), title: 'High Mountain Trails', caption: 'Early light on the ridgelines before the trail wakes up.' },
  { url: u('1582719478250-c89cae4dc85b'), title: 'Lakeside Sanctuary', caption: 'Still water, soft evenings and nowhere to be.' },
];

/**
 * Bento rhythm, repeating every 7 photos (3 columns on desktop):
 *   row 1:  [ wide ][ 1 ]
 *   row 2:  [ 1 ][ 1 ][ 1 ]
 *   row 3:  [ 1 ][ wide ]
 * On mobile (2 columns) wide tiles and the 6th tile of each cycle span the full width.
 */
const tileSpan = (i: number) => {
  const n = i % 7;
  if (n === 0 || n === 6) return 'col-span-2';
  if (n === 5) return 'col-span-2 lg:col-span-1';
  return 'col-span-1';
};
const isWide = (i: number) => i % 7 === 0 || i % 7 === 6;

export function GalleryPage() {
  const root = useRef<HTMLElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Subtitle fade
        gsap.from('[data-fade]', {
          y: 20,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        });

        // Each tile unveils bottom → top as it enters the viewport,
        // while its photo settles from 125% to 100%.
        gsap.utils.toArray<HTMLElement>('[data-tile]').forEach((tile, i) => {
          const img = tile.querySelector('[data-tile-img]');
          const lag = (i % 3) * 0.1;
          gsap
            .timeline({ scrollTrigger: { trigger: tile, start: 'top 90%', once: true } })
            .fromTo(
              tile,
              { clipPath: 'inset(100% 0% 0% 0% round 16px)' },
              { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' },
              lag
            )
            .fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, lag);
        });
      });
    },
    { scope: root }
  );

  return (
    <>
      <ScrollProgress />

      <main ref={root} className="bg-white text-gray-900 pt-12 sm:pt-16 pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* ================= 01 · GALLERY HERO ================= */}
          <header className="mb-14 sm:mb-18">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
              <SectionHeader
                number="01"
                eyebrow="Visual Stories"
                lines={["Captured Moments", "Photo Gallery"]}
                as="h1"
              />
              <div data-fade className="lg:max-w-md">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed lg:text-right">
                  A curated visual chronicle of our journeys and scenic routes across India — from golden Thar dunes to Himalayan peaks, quiet coastal palms, and historic heritage stays.
                </p>
              </div>
            </div>
          </header>

          {/* ================= BENTO GRID ================= */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 auto-rows-[200px] sm:auto-rows-[250px] lg:auto-rows-[290px]">
            {PHOTOS.map((photo, i) => (
              <button
                key={photo.url}
                type="button"
                data-tile
                onClick={() => openLightbox(i)}
                aria-label={`Open photo: ${photo.title}`}
                className={`group relative overflow-hidden rounded-2xl bg-gray-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer ${tileSpan(i)}`}
              >
                <div data-tile-img className="absolute inset-0">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    sizes={
                      isWide(i)
                        ? '(min-width: 1024px) 66vw, 100vw'
                        : '(min-width: 1024px) 33vw, 50vw'
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Caption: appears on hover / keyboard focus */}
                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <div className="translate-y-2 p-5 sm:p-6 transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-300 block mb-1">
                      {String(i + 1).padStart(2, '0')} · {photo.title}
                    </span>
                    <p className="text-base sm:text-lg font-bold leading-snug text-white">
                      {photo.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ================= 02 · CLOSING CTA ================= */}
          <section className="mt-24 sm:mt-32 pt-16 border-t border-gray-200">
            <div className="max-w-2xl mx-auto text-center space-y-5">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
                Start Your Journey
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Ready to make unforgettable memories?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                Every photograph begins with a journey. Let us create a personalized itinerary shaped around your interests, pace, and comfort.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                <Link
                  href="/tour-packages"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-300 shadow-sm"
                >
                  <span>Explore Tour Packages</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-black text-black text-sm font-medium hover:bg-black hover:text-white transition-colors duration-300"
                >
                  Plan Your Trip
                </Link>
              </div>
            </div>
          </section>
        </div>

        <GalleryLightboxModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={PHOTOS}
          initialIndex={lightboxIndex}
        />
      </main>
    </>
  );
}