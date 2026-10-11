'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { TourPackage } from '@/types';
import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface CuratedPackagesProps {
  title?: string;
  tag?: string;
  description?: string;
  packages?: TourPackage[];
}

const pad = (n: number) => String(n).padStart(2, '0');

export function CuratedPackages({
  title = 'Curated Tour Packages',
  tag = 'FEATURED JOURNEYS',
  description = 'Thoughtfully designed itineraries for every kind of traveller — from solo explorers to family getaways.',
  packages,
}: CuratedPackagesProps) {
  const displayPackages = packages || MOCK_TOUR_PACKAGES.slice(0, 3);
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
            // Columns settle at different speeds (depth), photo "opens" like the
            // rounded-shape reveal, all tied to the scroll position
            const drift = [70, 150, 30][i % 3];
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
              <span>View All Packages</span>
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* Tall cards */}
        <div
          ref={grid}
          className="group/grid grid grid-cols-1 md:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-14 md:gap-y-20"
        >
          {displayPackages.map((pkg, i) => (
            <Link
              key={pkg.id}
              href={`/tour-packages/${pkg.slug}`}
              data-cell
              className="group/cell block transition-opacity duration-300 group-hover/grid:opacity-55 hover:opacity-100!"
            >
              <div data-card className="will-change-transform">
                {/* Label row */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="font-mono text-xs text-gray-400">{pad(i + 1)}</span>
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    {pkg.tags?.[0] ?? pkg.category}
                  </span>
                </div>

                {/* Image */}
                <div
                  data-mask
                  className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100"
                >
                  <div data-img className="absolute inset-0">
                    <Image
                      src={pkg.heroImage}
                      alt={pkg.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover object-center group-hover/cell:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

                  <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-wide">
                    {pkg.duration}
                  </span>

                  <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-white/90 backdrop-blur text-black text-xs font-medium group-hover/cell:bg-black group-hover/cell:text-white transition-colors duration-300">
                    Explore
                    <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </span>
                </div>

                {/* Caption */}
                <div className="pt-5 px-1 space-y-2">
                  <h3 data-caption className="text-2xl sm:text-[26px] font-bold text-gray-900 leading-tight">
                    {pkg.title}
                  </h3>
                  <p data-caption className="text-sm text-gray-600 leading-relaxed line-clamp-2">
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
      </div>
    </section>
  );
}