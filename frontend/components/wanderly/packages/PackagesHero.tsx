'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface PackagesHeroProps {
  tag?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  image?: string;
}

export function PackagesHero({
  tag = 'OUR JOURNEYS',
  titleLine1 = 'Find your perfect',
  titleLine2 = 'desert experience',
  subtitle = 'Explore handpicked tour packages designed for adventure, comfort and unforgettable memories.',
  image = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=85',
}: PackagesHeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        /* Page-load: the photo settles from a slow zoom while the shade fades in,
           then the label, headline lines and subtitle appear one after another */
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('[data-hero-img]', { scale: 1.3 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
          .fromTo('[data-hero-shade]', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'none' }, 0)
          .from('[data-tag]', { y: 16, opacity: 0, duration: 0.8 }, 0.4)
          .from('[data-line]', { yPercent: 110, duration: 1.1, stagger: 0.14, ease: 'power4.out' }, 0.5)
          .from('[data-sub]', { y: 20, opacity: 0, duration: 0.9 }, 1);

        /* Scroll: the photo moves slower than the page, the text lifts away and fades */
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-par]', { yPercent: 10, ease: 'none', scrollTrigger: st });
        gsap.to('[data-hero-text]', {
          yPercent: -18,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { ...st, end: 'bottom 35%' },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative w-full h-[52vh] min-h-[380px] max-h-[500px] flex items-center justify-center overflow-hidden bg-stone-900 select-none"
    >
      {/* Warm Golden Dunes Background */}
      <div data-hero-par className="absolute -inset-y-[15%] inset-x-0">
        <div data-hero-img className="absolute inset-0">
          <Image
            src={image}
            alt="Golden desert dunes at warm sunset"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div
          data-hero-shade
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/30"
        />
      </div>

      {/* Hero Typography */}
      <div
        data-hero-text
        className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center text-white space-y-4 py-6 sm:py-8"
      >
        <div data-tag className="inline-block">
          <span className="text-sm font-semibold tracking-widest text-white/80 uppercase">
            {tag}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-sm">
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-line className="block">{titleLine1}</span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-line className="block">{titleLine2}</span>
          </span>
        </h1>
        <p
          data-sub
          className="text-sm md:text-base text-white/90 font-normal max-w-lg mx-auto leading-relaxed"
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}