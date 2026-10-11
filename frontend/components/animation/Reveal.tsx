'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Fades + slides content up once when it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 40 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, {
          y,
          opacity: 0,
          duration: 1,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface RevealGroupProps extends RevealProps {
  stagger?: number;
}

/** Same, but animates each DIRECT child one after another. */
export function RevealGroup({
  children,
  className,
  delay = 0,
  y = 50,
  stagger = 0.12,
}: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (!ref.current) return;
        gsap.from(ref.current.children, {
          y,
          opacity: 0,
          duration: 1,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}