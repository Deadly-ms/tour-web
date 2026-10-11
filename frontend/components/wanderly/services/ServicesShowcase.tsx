'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Map,
  Hotel,
  Car,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Reveal } from '@/components/animation/Reveal';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  showcaseImage: string;
  showcaseTitle: string;
  showcaseDescription: string;
  href: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'private-tours',
    number: '01',
    title: 'Private Tours',
    description: 'Tailored experiences for you and your group.',
    icon: Compass,
    showcaseImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Private Tours',
    showcaseDescription: 'Bespoke chauffeurs, private guides, and exclusive access.',
    href: '/tour-packages',
  },
  {
    id: 'custom-itineraries',
    number: '02',
    title: 'Custom Itineraries',
    description: 'Designed around your interests and pace.',
    icon: Map,
    showcaseImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Custom Itineraries',
    showcaseDescription: 'Crafted to your rhythm, whether slow exploration or grand circuit.',
    href: '/contact',
  },
  {
    id: 'hotel-stays',
    number: '03',
    title: 'Hotel & Stays',
    description: 'Handpicked stays in stunning locations.',
    icon: Hotel,
    showcaseImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Luxury Stays',
    showcaseDescription: 'Relax in the most beautiful places on earth.',
    href: '/tour-packages',
  },
  {
    id: 'transportation',
    number: '04',
    title: 'Transportation',
    description: 'Comfortable and safe travel options.',
    icon: Car,
    showcaseImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Seamless Conveyance',
    showcaseDescription: 'Sanitized premium fleet with seasoned chauffeurs.',
    href: '/contact',
  },
  {
    id: 'local-experiences',
    number: '05',
    title: 'Local Experiences',
    description: 'Authentic encounters with local culture.',
    icon: Sparkles,
    showcaseImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    showcaseTitle: 'Cultural Immersion',
    showcaseDescription: 'Cooking with local chefs, tea plantation walks, and village artisans.',
    href: '/tour-packages',
  },
];

interface ServicesShowcaseProps {
  services?: ServiceItem[];
}

const pad = (n: number) => String(n).padStart(2, '0');

export function ServicesShowcase({ services = DEFAULT_SERVICES }: ServicesShowcaseProps) {
  const n = services.length;
  const root = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [reduce, setReduce] = useState(false);

  // People who prefer reduced motion get a plain list instead of the pinned reel
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (reduce || !root.current) return;
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const q = gsap.utils.selector(root.current!);
        const scene = q('[data-scene]')[0];
        const slides = q('[data-slide]');
        const imgs = q('[data-img]');
        const names = q('[data-name]');
        const infos = q('[data-info]');
        const col = q('[data-count-col]');
        const bar = q('[data-progress]');
        if (!scene || !slides.length) return;

        const STEP = 1.6; // timeline length of one service (1 = animation, 0.6 = rest)

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: `+=${n * 85}%`,
            pin: true,
            scrub: 1,
            snap: {
              snapTo: 'labelsDirectional',
              duration: { min: 0.2, max: 0.6 },
              delay: 0.05,
              ease: 'power1.inOut',
            },
          },
        });

        tl.addLabel('s0', 0);

        slides.forEach((_, i) => {
          if (i === 0) return;
          const at = i * STEP;
          tl.addLabel(`s${i}`, at)
            // new photo wipes up over the old one while it settles
            .fromTo(
              slides[i],
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' },
              at
            )
            .fromTo(imgs[i], { scale: 1.3 }, { scale: 1, duration: 1.2, ease: 'power2.out' }, at)
            // old photo drifts away underneath
            .to(imgs[i - 1], { scale: 1.12, yPercent: -6, duration: 1, ease: 'power2.inOut' }, at)
            // list: previous name fades back, new one lights up
            .to(names[i - 1], { opacity: 0.25, duration: 0.4, ease: 'power2.out' }, at)
            .to(names[i], { opacity: 1, duration: 0.4, ease: 'power2.out' }, at + 0.3)
            // caption card swaps
            .to(infos[i - 1], { autoAlpha: 0, y: -16, duration: 0.3, ease: 'power2.in' }, at)
            .fromTo(
              infos[i],
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
              at + 0.55
            )
            // counter rolls to the next digit
            .to(col, { yPercent: -(100 / n) * i, duration: 0.7, ease: 'power2.inOut' }, at);
        });

        tl.to({}, { duration: 0.6 }); // rest on the last service
        tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: tl.duration() }, 0);

        stRef.current = tl.scrollTrigger ?? null;
        return () => {
          stRef.current = null;
        };
      });
    },
    { scope: root, dependencies: [reduce, n], revertOnUpdate: true }
  );

  // Click a name in the list to scroll straight to that service
  const jump = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    window.scrollTo({ top: st.labelToScroll(`s${i}`), behavior: 'smooth' });
  };

  return (
    <section ref={root} className="relative bg-white">
      {/* ───────── Desktop: pinned service reel ───────── */}
      {!reduce && (
        <div
          data-scene
          className="relative hidden md:flex h-[100svh] min-h-[640px] items-center overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 pt-20">
            <div className="grid grid-cols-12 gap-10 items-center">
              {/* Left: names + counter */}
              <div className="col-span-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-gray-400" />
                  <span className="text-sm uppercase tracking-widest text-gray-500">
                    What we do
                  </span>
                </div>
                <p className="text-2xl xl:text-3xl font-bold text-gray-900 tracking-tight leading-snug mb-8">
                  Services crafted <span className="text-gray-500">around you.</span>
                </p>

                <ol className="space-y-1.5">
                  {services.map((s, i) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        data-name
                        onClick={() => jump(i)}
                        style={{ opacity: i === 0 ? 1 : 0.25 }}
                        className="flex items-baseline gap-4 text-left font-bold text-3xl xl:text-5xl leading-[1.12] tracking-tight text-gray-900"
                      >
                        <span className="font-mono text-xs text-gray-400 tracking-normal">{s.number}</span>
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 flex items-center gap-5">
                  <span className="block h-[1em] overflow-hidden text-3xl font-bold leading-none text-gray-900">
                    <span data-count-col className="block">
                      {services.map((s) => (
                        <span key={s.id} className="block h-[1em] leading-none">
                          {s.number}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="font-mono text-sm text-gray-400">/ {pad(n)}</span>
                  <span className="relative block h-px w-32 bg-gray-200">
                    <span
                      data-progress
                      className="absolute inset-0 origin-left bg-black"
                      style={{ transform: 'scaleX(0)' }}
                    />
                  </span>
                </div>
              </div>

              {/* Right: photo reel */}
              <div className="col-span-7">
                <div className="relative h-[68vh] max-h-[620px] min-h-[420px] w-full overflow-hidden rounded-[2rem] bg-gray-100 shadow-[0_40px_70px_-30px_rgba(0,0,0,0.2)]">
                  {services.map((s, i) => (
                    <div
                      key={s.id}
                      data-slide
                      className="absolute inset-0"
                      style={i === 0 ? undefined : { clipPath: 'inset(100% 0% 0% 0%)' }}
                    >
                      <div data-img className="absolute inset-0">
                        <Image
                          src={s.showcaseImage}
                          alt={s.showcaseTitle}
                          fill
                          priority={i === 0}
                          sizes="(min-width: 1024px) 58vw, 90vw"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                    </div>
                  ))}

                  {/* Caption cards (one visible at a time) */}
                  {services.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.id}
                        data-info
                        style={i === 0 ? undefined : { opacity: 0, visibility: 'hidden' }}
                        className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-5 rounded-2xl border border-white/60 bg-white/90 p-5 backdrop-blur-xl"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">{s.showcaseTitle}</h3>
                            <p className="mt-0.5 text-xs font-normal text-gray-600 leading-relaxed">
                              {s.showcaseDescription}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={s.href}
                          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-black py-2 pl-5 pr-2 text-xs font-medium text-white transition-colors duration-300 hover:bg-gray-800"
                        >
                          Explore
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-45">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────── Mobile (and reduced motion): simple list ───────── */}
      <div className={`max-w-7xl mx-auto px-6 sm:px-8 py-20 ${reduce ? '' : 'md:hidden'}`}>
        <Reveal className="space-y-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gray-400" />
            <span className="text-sm uppercase tracking-widest text-gray-500">
              What we do
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight leading-[1.08]">
            Services crafted <span className="text-gray-500">around you.</span>
          </h2>
        </Reveal>

        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.id}>
                <Link href={s.href} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100">
                    <Image
                      src={s.showcaseImage}
                      alt={s.showcaseTitle}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="absolute right-5 top-4 text-3xl font-bold text-white/80">{s.number}</span>
                  </div>
                  <div className="space-y-2 pt-5">
                    <h3 className="text-2xl font-bold text-gray-900">{s.title}</h3>
                    <p className="text-sm font-normal leading-relaxed text-gray-600">{s.showcaseDescription}</p>
                    <span className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold uppercase tracking-wider text-black">
                      Explore <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}