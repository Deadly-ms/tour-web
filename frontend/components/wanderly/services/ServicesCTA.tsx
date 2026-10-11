'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/lib/gsap';

interface ServicesCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function ServicesCTA({
  title = "Let's plan your next adventure.",
  subtitle = "Get in touch with our team and let's create your perfect journey.",
  buttonText = 'Contact Us',
  buttonHref = '/contact',
}: ServicesCTAProps) {
  const root = useRef<HTMLElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);
  const words = title.split(' ');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          fine: '(hover: hover) and (pointer: fine)',
        },
        (ctx) => {
          if (!ctx.conditions?.motion) return;
          const section = root.current;
          if (!section) return;

          // Headline lights up word by word while scrolling
          gsap.set('[data-word]', { opacity: 0.18 });
          gsap.to('[data-word]', {
            opacity: 1,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top 65%', end: 'center 45%', scrub: true },
          });

          // Giant outlined word drifts sideways behind everything
          gsap.fromTo(
            '[data-bg-word]',
            { xPercent: 12 },
            {
              xPercent: -28,
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );

          gsap.from('[data-cta-fade]', {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 55%', once: true },
          });
          gsap.from('[data-btn]', {
            scale: 0.55,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: section, start: 'top 50%', once: true },
          });

          // Magnetic button (mouse users only): it leans toward the cursor
          const el = btn.current;
          if (!ctx.conditions.fine || !el) return;

          const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });

          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            if (Math.hypot(dx, dy) < 170) {
              xTo(dx * 0.35);
              yTo(dy * 0.35);
            } else {
              xTo(0);
              yTo(0);
            }
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };

          section.addEventListener('pointermove', onMove);
          section.addEventListener('pointerleave', onLeave);
          return () => {
            section.removeEventListener('pointermove', onMove);
            section.removeEventListener('pointerleave', onLeave);
          };
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[90svh] items-center overflow-hidden rounded-t-[2.5rem] bg-[#18281d] py-28 text-white sm:rounded-t-[4rem] sm:py-40"
    >
      {/* Giant outlined word behind the content */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center">
        <span
          data-bg-word
          className="whitespace-nowrap font-serif text-[30vw] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(197,139,89,0.35)]"
        >
          Journey&nbsp;Journey
        </span>
      </div>
      <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-[#c58b59]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl space-y-10 px-6 text-center sm:px-8">
        <div data-cta-fade className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-[#c58b59]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c58b59]">
            Start here
          </span>
          <span className="h-px w-10 bg-[#c58b59]" />
        </div>

        <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          {words.map((w, i) => (
            <span key={i} data-word className="mr-[0.25em] inline-block">
              {w}
            </span>
          ))}
        </h2>

        <p data-cta-fade className="mx-auto max-w-md text-sm font-light leading-relaxed text-stone-300 sm:text-base">
          {subtitle}
        </p>

        <div data-btn className="flex justify-center pt-4">
          <Link
            ref={btn}
            href={buttonHref}
            className="group flex h-36 w-36 flex-col items-center justify-center gap-1.5 rounded-full bg-[#c58b59] text-sm font-medium tracking-wide text-[#18281d] shadow-[0_30px_60px_-20px_rgba(197,139,89,0.6)] transition-colors duration-300 hover:bg-[#d49a68] sm:h-40 sm:w-40"
          >
            <span>{buttonText}</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}