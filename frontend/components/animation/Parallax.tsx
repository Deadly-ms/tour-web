'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface ParallaxProps {
  children: React.ReactNode;
  amount?: number; // % drift, keep <= 12
  className?: string;
}

/** Use inside a `relative overflow-hidden` box, with <Image fill /> as the child. */
export function Parallax({ children, amount = 10, className = '' }: ParallaxProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          inner.current,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: {
              trigger: outer.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    },
    { scope: outer }
  );

  return (
    <div ref={outer} className={`absolute inset-0 ${className}`}>
      <div ref={inner} className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform">
        {children}
      </div>
    </div>
  );
}