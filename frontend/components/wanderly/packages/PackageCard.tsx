'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { TourPackage } from '@/types';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface PackageCardProps {
  pkg: TourPackage;
  /** Position in the grid, used to stagger the entrance. */
  index?: number;
}

export function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  const root = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, fine: '(hover: hover) and (pointer: fine)' }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const q = gsap.utils.selector(el);
        const d = (index % 3) * 0.1; // stagger within a row

        /* Entrance: card rises, the photo unveils top → bottom while it settles
           from a zoom, then the details follow */
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
          .from(el, { y: 60, opacity: 0, duration: 1 }, d)
          .fromTo(
            q('[data-wrap]'),
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' },
            d + 0.05
          )
          .from(q('[data-scale]'), { scale: 1.3, duration: 1.5 }, d + 0.05)
          .from(q('[data-badge]'), { y: -10, opacity: 0, scale: 0.85, duration: 0.7 }, d + 0.5)
          .from(q('[data-info]'), { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, d + 0.45);

        /* Mouse only: the photo slides slightly against the cursor */
        if (!ctx.conditions.fine) return;
        const wrap = q('[data-wrap]')[0] as HTMLElement | undefined;
        const move = q('[data-move]')[0] as HTMLElement | undefined;
        if (!wrap || !move) return;

        const xTo = gsap.quickTo(move, 'x', { duration: 0.6, ease: 'power3' });
        const yTo = gsap.quickTo(move, 'y', { duration: 0.6, ease: 'power3' });
        const onMove = (e: PointerEvent) => {
          const r = wrap.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - 0.5) * -16);
          yTo(((e.clientY - r.top) / r.height - 0.5) * -16);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        wrap.addEventListener('pointermove', onMove);
        wrap.addEventListener('pointerleave', onLeave);
        return () => {
          wrap.removeEventListener('pointermove', onMove);
          wrap.removeEventListener('pointerleave', onLeave);
        };
      });
    },
    { scope: root }
  );

  return (
    <Link
      ref={root}
      href={`/tour-packages/${pkg.slug}`}
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-[box-shadow,border-color] duration-300 hover:shadow-lg flex flex-col"
    >
      {/* Image with Duration Badge */}
      <div data-wrap className="relative h-60 sm:h-64 w-full overflow-hidden bg-gray-100">
        <div data-move className="absolute -inset-4">
          <div data-scale className="absolute inset-0">
            <Image
              src={pkg.heroImage}
              alt={pkg.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
        {/* Top Badge */}
        <div
          data-badge
          className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide"
        >
          {pkg.duration}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div data-info className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span className="truncate">{pkg.destination}</span>
          </div>
          <h3
            data-info
            className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors"
          >
            {pkg.title}
          </h3>
          <p data-info className="text-xs text-gray-500 mt-1 font-normal tracking-wide">
            {pkg.tags && pkg.tags.length > 0 ? pkg.tags.join(' • ') : pkg.category}
          </p>
        </div>

        <div data-info className="pt-3 border-t border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ₹ {pkg.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 font-normal"> / person</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-gray-700 transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}