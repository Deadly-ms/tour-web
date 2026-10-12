'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface StackingCardsProps {
  children: React.ReactNode;
  topOffset?: number; // px from top where the first card sticks (below your fixed navbar)
  peek?: number;      // extra px each next card sticks lower
  gap?: number;       // px between cards while scrolling
  className?: string;
}

/** Every direct child = one card. Cards need an opaque background. */
export function StackingCards({
  children,
  topOffset = 104,
  peek = 16,
  gap = 80,
  className = '',
}: StackingCardsProps) {
  const root = useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const wrappers = gsap.utils.toArray<HTMLElement>('[data-stack-card]', root.current);
        wrappers.forEach((wrap, i) => {
          const next = wrappers[i + 1];
          if (!next) return;
          const inner = wrap.querySelector<HTMLElement>('[data-stack-inner]');
          gsap.to(inner, {
            scale: 0.94 - i * 0.01,
            transformOrigin: 'center top',
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: `top ${topOffset + (i + 1) * peek}px`,
              scrub: true,
            },
          });
        });
      });
    },
    { scope: root, dependencies: [items.length] }
  );

  return (
    <div ref={root} className={className}>
      {items.map((child, i) => (
        <div
          key={i}
          data-stack-card
          className="sticky"
          style={{
            top: topOffset + i * peek,
            marginBottom: i === items.length - 1 ? 0 : gap,
          }}
        >
          <div data-stack-inner className="will-change-transform">
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}