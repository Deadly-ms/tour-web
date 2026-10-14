'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { TourPackage } from '@/types';
import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';
import { getFeaturedTourPackages } from '@/services/tour.service';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface CuratedPackagesProps {
  title?: string;
  tag?: string;
  description?: string;
  packages?: TourPackage[];
  limit?: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function CuratedPackages({
  title = 'Curated Tour Packages',
  tag = 'FEATURED JOURNEYS',
  description = 'Thoughtfully designed itineraries for every kind of traveller — from solo explorers to family getaways.',
  packages,
  limit = 4,
}: CuratedPackagesProps) {
  const [livePackages, setLivePackages] = useState<TourPackage[]>(packages || []);

  useEffect(() => {
    if (packages && packages.length > 0) {
      setLivePackages(packages);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const featured = await getFeaturedTourPackages();
        if (isMounted && featured && featured.length > 0) {
          setLivePackages(featured);
        } else if (isMounted) {
          setLivePackages(MOCK_TOUR_PACKAGES);
        }
      } catch (err) {
        console.warn('[CuratedPackages] Failed to load featured packages:', err);
        if (isMounted) {
          setLivePackages(MOCK_TOUR_PACKAGES);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [packages]);

  // Display only 4 visible cards on the homepage (the remaining can be explored on the tour packages page)
  const allAvailablePackages = livePackages.length > 0 ? livePackages : MOCK_TOUR_PACKAGES;
  const displayPackages = allAvailablePackages.slice(0, limit);
  const total = displayPackages.length;

  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: '(min-width: 768px)' }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const desktop = !!ctx.conditions.desktop;

        // Heading: words rise out of a mask, then the rest fades in
        gsap.from('[data-word]', {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: { trigger: head.current, start: 'top 85%', once: true },
        });
        gsap.from('[data-head-fade]', {
          y: 24,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: head.current, start: 'top 85%', once: true },
        });

        // Cards
        const cells = gsap.utils.toArray<HTMLElement>('[data-cell]', grid.current);
        cells.forEach((cell, i) => {
          const q = gsap.utils.selector(cell);
          const card = q('[data-card]');
          const maskFrom = desktop
            ? 'inset(16% 16% 16% 16% round 56px)'
            : 'inset(10% 10% 10% 10% round 48px)';
          const maskTo = 'inset(0% 0% 0% 0% round 24px)';

          if (desktop) {
            // Columns settle at different depths, photo "opens" like the rounded-shape reveal
            const drift = [25, 55, 35, 65][i % 4];
            const tl = gsap.timeline({
              scrollTrigger: { trigger: cell, start: 'top 100%', end: 'top 40%', scrub: 1 },
            });
            tl.fromTo(card, { y: drift }, { y: 0, ease: 'none', duration: 1 }, 0)
              .fromTo(q('[data-mask]'), { clipPath: maskFrom }, { clipPath: maskTo, ease: 'none', duration: 1 }, 0)
              .fromTo(q('[data-img]'), { scale: 1.35 }, { scale: 1, ease: 'none', duration: 1 }, 0);
          } else {
            // Mobile: simple reveal once per card
            const tl = gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: { trigger: cell, start: 'top 88%', once: true },
            });
            tl.from(card, { y: 50, opacity: 0, duration: 0.9 }, 0)
              .fromTo(q('[data-mask]'), { clipPath: maskFrom }, { clipPath: maskTo, duration: 1.2, ease: 'power3.inOut' }, 0)
              .fromTo(q('[data-img]'), { scale: 1.3 }, { scale: 1, duration: 1.4 }, 0);
          }

          // Caption fades up once the card is on screen
          gsap.from(q('[data-caption]'), {
            y: 22,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: cell, start: 'top 70%', once: true },
          });
        });
      });
    },
    { scope: root, dependencies: [total] }
  );

  return (
    <section ref={root} className="relative overflow-x-clip py-20 sm:py-28 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div
          ref={head}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16"
        >
          <div className="space-y-4 max-w-2xl">
            <div data-head-fade className="flex items-center gap-3">
              <span className="h-px w-8 bg-gray-400" />
              <span className="text-sm uppercase tracking-widest text-gray-500">
                {tag}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.08]">
              {title.split(' ').map((w, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] mr-[0.25em]">
                  <span data-word className="inline-block">
                    {w}
                  </span>
                </span>
              ))}
            </h2>
            <p data-head-fade className="text-sm text-gray-600 leading-relaxed max-w-md">
              {description}
            </p>
          </div>

          <div data-head-fade>
            <Link
              href="/tour-packages"
              className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-black text-white text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors duration-300"
            >
              <span>Explore All Packages</span>
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* 4 Cards Grid: 4 columns on large screens, 2 on tablet, 1 on mobile */}
        <div
          ref={grid}
          className="group/grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 xl:gap-8 gap-y-12 sm:gap-y-14"
        >
          {displayPackages.map((pkg, i) => (
            <Link
              key={pkg.id || pkg._id || pkg.slug || i}
              href={`/tour-packages/${pkg.slug}`}
              data-cell
              className="group/cell block transition-opacity duration-300 group-hover/grid:opacity-55 hover:opacity-100!"
            >
              <div data-card className="will-change-transform">
                {/* Label row */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="font-mono text-xs text-gray-400">{pad(i + 1)}</span>
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold truncate ml-2">
                    {pkg.tags?.[0] ?? pkg.category}
                  </span>
                </div>

                {/* Image */}
                <div
                  data-mask
                  className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-100"
                >
                  <div data-img className="absolute inset-0">
                    <Image
                      src={pkg.heroImage}
                      alt={pkg.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center group-hover/cell:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-wide">
                    {pkg.duration}
                  </span>

                  <span className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 pl-3.5 pr-1.5 py-1.5 rounded-full bg-white/95 backdrop-blur text-black text-xs font-medium group-hover/cell:bg-black group-hover/cell:text-white transition-colors duration-300 shadow-sm">
                    Explore
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </span>
                </div>

                {/* Caption */}
                <div className="pt-4 px-1 space-y-2">
                  <h3 data-caption className="text-xl sm:text-[22px] font-bold text-gray-900 leading-tight group-hover/cell:text-teal-900 transition-colors line-clamp-1">
                    {pkg.title}
                  </h3>
                  <p data-caption className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {pkg.overview}
                  </p>
                  <p data-caption className="pt-1 text-sm text-gray-900">
                    <span className="text-lg font-bold">₹ {pkg.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 font-normal"> / person</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore Remaining Packages Banner */}
        <div
          data-head-fade
          className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#faf8f5] border border-stone-200"
        >
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-teal-800 font-semibold">
              More Journeys To Discover
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900">
              Explore all tour packages
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Looking for more destinations? Browse our complete collection of tailor-made itineraries, scenic escapes, and heritage expeditions on the tour package page.
            </p>
          </div>

          <Link
            href="/tour-packages"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white text-xs sm:text-sm font-medium hover:bg-gray-800 transition-all duration-300 shrink-0 shadow-sm hover:shadow"
          >
            <span>Explore All Packages</span>
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}