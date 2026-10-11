import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

/** Thin bar at the very top that fills as you scroll down the page. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );
    });
  });

  return (
    <div
      ref={bar}
      className="fixed top-0 left-0 z-[60] h-[3px] w-full origin-left bg-black"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}