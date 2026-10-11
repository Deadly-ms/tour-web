import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

interface ScrollWordsProps {
  text: string;
  className?: string;
}

/** Words go from pale to solid one by one while you scroll past. */
export function ScrollWords({ text, className = '' }: ScrollWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set('[data-w]', { opacity: 0.15 });
        gsap.to('[data-w]', {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} data-w className="inline-block mr-[0.28em]">
          {word}
        </span>
      ))}
    </p>
  );
}