import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface SectionHeaderProps {
  number: string;          // big faint number, e.g. "01"
  eyebrow: string;         // small uppercase label
  lines: string[];         // title, one entry per line
  align?: 'left' | 'right' | 'center';
  className?: string;
}

const TEXT_ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;
// The faint number sits on the opposite side of the text
const GHOST_POS = {
  left: 'right-0',
  right: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
} as const;

/**
 * Faint big number (drifts slower than the page) + eyebrow fade +
 * title lines rising out of a mask.
 */
export function SectionHeader({
  number,
  eyebrow,
  lines,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const once = { trigger: root.current, start: 'top 85%', once: true };

        gsap.from('[data-eyebrow]', {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: once,
        });
        gsap.from('[data-line]', {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.12,
          delay: 0.1,
          ease: 'power4.out',
          scrollTrigger: once,
        });
        gsap.fromTo(
          '[data-ghost]',
          { yPercent: 35 },
          {
            yPercent: -35,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={`relative ${TEXT_ALIGN[align]} ${className}`}>
      <div className={`pointer-events-none absolute -top-10 md:-top-24 z-0 ${GHOST_POS[align]}`}>
        <span
          data-ghost
          className="block text-[88px] md:text-[140px] leading-none font-bold text-gray-100 select-none"
        >
          {number}
        </span>
      </div>

      <p data-eyebrow className="relative z-10 text-sm uppercase tracking-widest text-gray-500 mb-4">
        {eyebrow}
      </p>
      <h2 className="relative z-10 text-4xl md:text-5xl font-bold leading-tight text-gray-900">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em]">
            <span data-line className="block">
              {line}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}