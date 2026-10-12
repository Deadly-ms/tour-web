'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

export default function NotFound() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keep the mascot video playing (browsers can block autoplay)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        /* ───────── The one orchestrated moment ─────────
           1. a thin gold route draws across the page ("the path leads elsewhere")
           2. the framed mascot video unveils while the gold outline follows
           3. headline lines rise, then copy, buttons and links settle in
           4. the "route not found" card floats up last                          */
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.fromTo(
          '[data-route]',
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut' },
          0
        )
          .fromTo(
            '[data-frame-outline]',
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.inOut', clearProps: 'clipPath' },
            0.1
          )
          .fromTo(
            '[data-frame]',
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.inOut', clearProps: 'clipPath' },
            0.3
          )
          .fromTo('[data-video]', { scale: 1.22 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0.3)
          .from('[data-line]', { yPercent: 110, duration: 1.2, stagger: 0.14 }, 0.5)
          .from('[data-fade]', { y: 18, opacity: 0, duration: 0.9, stagger: 0.1 }, 1.0)
          .from('[data-badge]', { y: 24, opacity: 0, duration: 1 }, 1.6);

        /* Pointer devices only: the frame and its outline drift in opposite
           directions as the cursor moves, giving the card a little depth. */
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const section = root.current;
        if (!section) return;

        const fx = gsap.quickTo('[data-frame]', 'x', { duration: 0.9, ease: 'power3' });
        const fy = gsap.quickTo('[data-frame]', 'y', { duration: 0.9, ease: 'power3' });
        const ox = gsap.quickTo('[data-frame-outline]', 'x', { duration: 1.2, ease: 'power3' });
        const oy = gsap.quickTo('[data-frame-outline]', 'y', { duration: 1.2, ease: 'power3' });

        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          fx(nx * 14);
          fy(ny * 10);
          ox(nx * -22);
          oy(ny * -16);
        };

        section.addEventListener('pointermove', move);
        return () => section.removeEventListener('pointermove', move);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex-1 overflow-hidden bg-white text-gray-900">
      {/* Soft ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 h-[620px] w-[620px] rounded-full bg-gray-100 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 h-[520px] w-[520px] rounded-full bg-gray-50 blur-3xl"
      />

      {/* The route: one hairline that wanders across the page */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          data-route
          pathLength={1}
          d="M -20 690 C 200 600, 330 790, 560 680 S 880 430, 1040 540 S 1320 340, 1460 400"
          stroke="#d1d5db"
          strokeOpacity="0.7"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl grid-cols-1 items-center gap-14 px-6 py-14 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:py-20">
        {/* Left: narrative */}
        <div className="space-y-7 sm:space-y-8 lg:col-span-6">
          <div data-fade className="flex items-center gap-4">
            <span className="h-px w-10 bg-black" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Error 404
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-line className="block">This path leads</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-line className="block italic text-gray-500">elsewhere.</span>
            </span>
          </h1>

          <p data-fade className="max-w-md text-sm font-normal leading-relaxed text-gray-600 sm:text-base">
            The page or journey you are looking for has moved or does not exist.
            Let&apos;s guide you back to familiar trails.
          </p>

          <div data-fade className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-gray-800"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>

            <Link
              href="/tour-packages"
              className="group inline-flex items-center gap-2 rounded-full border border-black bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-black transition-all duration-300 hover:bg-black hover:text-white"
            >
              Explore Tour Packages
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div data-fade className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-200 pt-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Or visit</span>
            {[
              { label: 'About', href: '/about' },
              { label: 'Services', href: '/services' },
              { label: 'Contact', href: '/contact' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative text-sm font-medium text-gray-600 transition-colors hover:text-black"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </div>

        {/* Right: framed mascot video */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* Outline, offset behind the frame */}
            <div
              data-frame-outline
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border border-gray-300"
            />

            <div
              data-frame
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-gray-50 border border-gray-200 shadow-xl"
            >
              <video
                ref={videoRef}
                data-video
                className="h-full w-full object-cover mix-blend-multiply"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              >
                <source src="/assets/404-error.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Floating card */}
            <div
              data-badge
              className="absolute -bottom-6 left-4 flex max-w-[240px] items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 px-5 py-4 shadow-xl backdrop-blur-xl sm:-left-6"
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-black" />
              </span>
              <div>
                <p className="text-base font-bold leading-snug text-gray-900">Route not found</p>
                <p className="mt-0.5 text-[11px] font-normal text-gray-500">
                  Let&apos;s find you a better one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}