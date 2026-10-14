'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface ServicesHeroProps {
  tag?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  image?: string;
  highlights?: string[];
  ghostNumber?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function ServicesHero({
  tag = 'OUR SERVICES',
  titleLine1 = 'Everything you need.',
  titleLine2 = "Nothing you don't.",
  subtitle = 'From planning to on-ground support, we take care of every detail so you can focus on what matters — experiencing the journey.',
  image = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
  highlights = ['Student & School Tours', 'Corporate & Group Tours', 'Domestic & International'],
  ghostNumber = '01',
  ctaText = 'Contact Us',
  ctaHref = '/contact',
}: ServicesHeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        /* Page-load: the photo opens from a small rounded shape to its full frame,
           the faint number and the headline lines rise, then the copy follows */
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });

        tl.fromTo(
          '[data-mask]',
          { clipPath: 'inset(18% 18% 18% 18% round 140px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 2px)', duration: 1.6, ease: 'power3.inOut', clearProps: 'clipPath' },
          0
        )
          .from('[data-img]', { scale: 1.4, duration: 1.9 }, 0)
          .from('[data-ghost]', { opacity: 0, y: 40, duration: 1.4 }, 0.3)
          .from('[data-eyebrow]', { y: 20, opacity: 0, duration: 0.8 }, 0.35)
          .from('[data-line]', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, 0.45)
          .from('[data-fade]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.95);

        /* Scroll: the photo drifts inside its frame, the faint number lifts away */
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-par]', { yPercent: 8, ease: 'none', scrollTrigger: st });
        gsap.to('[data-ghost]', { yPercent: -30, ease: 'none', scrollTrigger: st });

        /* Gentle mouse parallax (mouse users only) */
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const layers = [
          { sel: '[data-frame]', amount: 12 },
          { sel: '[data-ghost-mouse]', amount: -22 },
        ].flatMap(({ sel, amount }) => {
          const el = root.current?.querySelector<HTMLElement>(sel);
          if (!el) return [];
          return [
            {
              amount,
              x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }),
              y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }),
            },
          ];
        });

        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.amount);
            l.y(ny * l.amount);
          });
        };

        const start = gsap.delayedCall(2.2, () => window.addEventListener('pointermove', onMove));
        return () => {
          start.kill();
          window.removeEventListener('pointermove', onMove);
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-white py-12 sm:py-16 md:py-20 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left: image */}
        <div data-frame className="relative">
          <div
            data-mask
            className="relative h-[380px] md:h-[500px] overflow-hidden rounded-sm bg-gray-100"
          >
            <div data-par className="absolute -inset-y-[10%] inset-x-0">
              <Image
                data-img
                src={image}
                alt="Turquoise mountain lake surrounded by peaks"
                fill
                priority
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Right: content */}
        <div className="relative">
          {/* Faint background number */}
          <div className="pointer-events-none absolute -top-14 md:-top-24 right-0 z-0">
            <div data-ghost-mouse>
              <span
                data-ghost
                className="block text-[88px] md:text-[140px] leading-none font-bold text-gray-100 select-none"
              >
                {ghostNumber}
              </span>
            </div>
          </div>

          <p
            data-eyebrow
            className="relative z-10 text-sm uppercase tracking-widest text-gray-500 mb-4"
          >
            {tag}
          </p>

          <h1 className="relative z-10 text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-line className="block">{titleLine1}</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-line className="block">{titleLine2}</span>
            </span>
          </h1>

          <p data-fade className="relative z-10 text-gray-600 leading-relaxed mb-6 max-w-lg">
            {subtitle}
          </p>

          <ul data-fade className="relative z-10 flex flex-wrap gap-2 mb-8">
            {highlights.map((h) => (
              <li
                key={h}
                className="px-4 py-1.5 border border-gray-300 text-[11px] uppercase tracking-widest text-gray-600"
              >
                {h}
              </li>
            ))}
          </ul>

          <div data-fade className="relative z-10">
            <Link
              href={ctaHref}
              className="inline-block px-8 py-3 border border-black text-black font-medium hover:bg-black hover:text-white transition"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}