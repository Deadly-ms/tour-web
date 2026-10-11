'use client';

import React, { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/lib/gsap';

interface ServicesTickerProps {
  words?: string[];
}

/**
 * A thin band of big serif words sliding sideways. Scrolling speeds it up,
 * leans the letters, and scrolling back reverses it.
 */
export function ServicesTicker({
  words = ['Private Tours', 'Custom Itineraries', 'Hotel & Stays', 'Transportation', 'Local Experiences'],
}: ServicesTickerProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = root.current?.querySelector<HTMLElement>('[data-track]');
        if (!track) return;

        const slide = gsap.fromTo(
          track,
          { xPercent: 0 },
          { xPercent: -50, ease: 'none', duration: 40, repeat: -1 }
        );

        const settle = gsap.delayedCall(0.12, () => {
          gsap.to(track, { skewX: 0, duration: 0.7, ease: 'power3.out' });
        });
        settle.pause();

        let boost: gsap.core.Timeline | undefined;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = self.getVelocity();
            const speed = 1 + Math.min(Math.abs(v) / 250, 5);

            boost?.kill();
            boost = gsap
              .timeline()
              .to(slide, { timeScale: self.direction * speed, duration: 0.2 })
              .to(slide, { timeScale: self.direction, duration: 1.2 });

            gsap.to(track, {
              skewX: gsap.utils.clamp(-10, 10, -v / 180),
              duration: 0.25,
              overwrite: 'auto',
            });
            settle.restart(true);
          },
        });

        return () => {
          boost?.kill();
          settle.kill();
          st.kill();
        };
      });
    },
    { scope: root }
  );

  const items = [...words, ...words];

  return (
    <div
      ref={root}
      className="overflow-hidden border-y border-gray-200 bg-white py-6 md:py-9"
      aria-hidden
    >
      <div data-track className="flex w-max items-center whitespace-nowrap text-5xl md:text-7xl font-bold leading-none">
        {items.map((w, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8 pr-8 md:gap-14 md:pr-14">
            <span
              className={
                i % 2 === 0
                  ? 'text-gray-900'
                  : 'text-transparent [-webkit-text-stroke:1.5px_#9ca3af]'
              }
            >
              {w}
            </span>
            <span className="text-2xl text-gray-300 md:text-3xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}