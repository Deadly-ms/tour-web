'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, Users, Hotel, Headphones, Plus, Minus } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
import { Reveal, RevealGroup } from '@/components/animation/Reveal';

interface FeaturePoint {
  icon: React.ElementType;
  title: string;
  description: string;
}

const DEFAULT_FEATURES: FeaturePoint[] = [
  {
    icon: Compass,
    title: 'Personalized Itineraries',
    description: 'Tailored to your interests and pace.',
  },
  {
    icon: Users,
    title: 'Local Expertise',
    description: 'Real people, real stories, local connections.',
  },
  {
    icon: Hotel,
    title: 'Premium Stays',
    description: 'Handpicked hotels & resorts in stunning locations.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: "We're with you, every step of the way.",
  },
];

interface WhyChooseUsProps {
  tag?: string;
  title?: string;
  subtitle?: string;
  features?: FeaturePoint[];
  image?: string;
  ctaText?: string;
  ctaHref?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function WhyChooseUs({
  tag = 'WHY CHOOSE US',
  title = 'Your Journey,\nOur Priority.',
  subtitle = 'We go beyond bookings. We craft personalized experiences with local expertise, trusted partners and a passion for travel.',
  features = DEFAULT_FEATURES,
  image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  ctaText = 'Plan Your Journey',
  ctaHref = '/contact',
}: WhyChooseUsProps) {
  const [open, setOpen] = useState(0);
  const scene = useRef<HTMLDivElement>(null);

  // Image starts as a small rounded shape and expands to fill the screen
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, mobile: '(max-width: 767px)' }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const from = ctx.conditions.mobile
          ? 'inset(24% 8% 24% 8% round 48px)'
          : 'inset(20% 30% 20% 30% round 220px)';

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene.current,
            start: 'top top',
            end: '+=110%',
            pin: true,
            scrub: 1,
          },
        });
        tl.fromTo(
          '[data-expand]',
          { clipPath: from },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 },
          0
        )
          .fromTo('[data-expand-img]', { scale: 1.4 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .fromTo('[data-expand-text]', { scale: 0.8 }, { scale: 1, ease: 'none', duration: 1 }, 0);
      });
    },
    { scope: scene }
  );

  return (
    <section className="bg-[#fcfbfa]">
      {/* Scene 1: expanding image with title */}
      <div ref={scene} className="relative h-[100svh] w-full overflow-hidden bg-[#fcfbfa]">
        <div data-expand className="absolute inset-0 overflow-hidden bg-stone-800">
          <div data-expand-img className="absolute inset-0">
            <Image
              src={image}
              alt="Traveler exploring scenic vistas"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex items-center justify-center px-6 text-center text-white">
            <div data-expand-text className="space-y-4">
              <span className="block text-[11px] font-semibold tracking-[0.3em] text-[#e3c9a8] uppercase">
                {tag}
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] whitespace-pre-line tracking-tight">
                {title}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Scene 2: statement + accordion */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <Reveal className="lg:col-span-5 space-y-7">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-[#c58b59]" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
              {tag}
            </span>
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-[#18281d] leading-snug">{subtitle}</p>
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#18281d] text-white text-xs sm:text-sm font-medium hover:bg-[#c58b59] transition-colors duration-300"
          >
            <span>{ctaText}</span>
            <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </Reveal>

        <RevealGroup className="lg:col-span-7 border-t border-[#e8e4dc]" stagger={0.1}>
          {features.map((f, i) => {
            const Icon = f.icon;
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-[#e8e4dc]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="group w-full flex items-center gap-4 sm:gap-6 py-6 text-left"
                >
                  <span className="w-6 shrink-0 font-mono text-xs text-stone-400">{pad(i + 1)}</span>
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-[#faf8f5] border border-[#e8e4dc] flex items-center justify-center text-[#18281d]">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 font-serif text-xl sm:text-2xl text-[#18281d] group-hover:text-[#c58b59] transition-colors">
                    {f.title}
                  </span>
                  <span
                    className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                      isOpen
                        ? 'bg-[#18281d] border-[#18281d] text-white'
                        : 'border-stone-300 text-stone-600 group-hover:border-[#c58b59]'
                    }`}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="pb-6 pl-[6rem] sm:pl-[7rem] pr-12 text-sm text-stone-500 font-light leading-relaxed max-w-lg">
                      {f.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}