'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Pause, Volume2, VolumeX, MapPin } from 'lucide-react';

interface HeroSlide {
  image: string;
  tag: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  location: string;
  ctaText: string;
  ctaHref: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
    tag: 'DISCOVER',
    titleLine1: 'The World',
    titleLine2: 'Beyond.',
    subtitle: 'Curated journeys to extraordinary destinations, crafted for unforgettable experiences.',
    location: 'Ladakh, India',
    ctaText: 'Explore Tours',
    ctaHref: '/tour-packages',
  },
  {
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=85',
    tag: 'HERITAGE',
    titleLine1: 'Royal Charms',
    titleLine2: 'Of Rajasthan.',
    subtitle: 'Step into legendary desert palaces, golden sandstone forts and timeless chivalry.',
    location: 'Jaipur, Rajasthan',
    ctaText: 'View Royal Escapes',
    ctaHref: '/tour-packages/rajasthan-royal-escape',
  },
  {
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=85',
    tag: 'SLOW TRAVEL',
    titleLine1: 'Serene Waters',
    titleLine2: 'Of Kerala.',
    subtitle: 'Drift across emerald canals aboard authentic houseboats amidst swaying coconut groves.',
    location: 'Alleppey, Kerala',
    ctaText: 'Discover Backwaters',
    ctaHref: '/tour-packages/kerala-backwaters',
  },
  {
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=85',
    tag: 'HIGH PEAKS',
    titleLine1: 'The High Passes',
    titleLine2: 'Of Himalaya.',
    subtitle: 'Breathe crystal air on high mountain frontiers under starlit crystalline skies.',
    location: 'Pangong, Ladakh',
    ctaText: 'Explore Highlands',
    ctaHref: '/tour-packages/ladakh-adventure',
  },
];

interface HomeHeroProps {
  slides?: HeroSlide[];
}

export function HomeHero({ slides = DEFAULT_SLIDES }: HomeHeroProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Auto slide advance every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlideIndex];

  return (
    <section className="relative w-full h-[92vh] min-h-[640px] max-h-[960px] flex items-center justify-center overflow-hidden bg-stone-900 select-none">
      {/* Background Images with smooth fade */}
      {slides.map((s, index) => (
        <div
          key={s.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlideIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
          } transform transition-transform duration-[8000ms]`}
        >
          <Image
            src={s.image}
            alt={s.location}
            fill
            priority={index === 0}
            className="object-cover object-center"
          />
          {/* Subtle gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
        </div>
      ))}

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-8 pt-16 sm:pt-20">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          {/* Uppercase Tag */}
          <div className="inline-block">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-white/90 uppercase border-b border-white/30 pb-0.5">
              {slide.tag}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-[84px] text-white font-normal leading-[1.05] tracking-tight drop-shadow-sm">
            {slide.titleLine1} <br />
            {slide.titleLine2}
          </h1>

          {/* Subtitle */}
          <p className="text-white/85 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-lg drop-shadow-sm">
            {slide.subtitle}
          </p>

          {/* CTA Pill Button */}
          <div className="pt-2 sm:pt-4">
            <Link
              href={slide.ctaHref}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#18281d]/90 hover:bg-[#18281d] text-white text-xs sm:text-sm font-medium tracking-wide backdrop-blur-md border border-white/20 transition-all duration-300 hover:shadow-xl group"
            >
              <span>{slide.ctaText}</span>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-20 max-w-7xl mx-auto px-6 sm:px-8 flex items-end justify-between text-white">
        {/* Slide Counter on Left */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-wider font-light text-white/90">
            0{currentSlideIndex + 1} &nbsp;/&nbsp; 0{slides.length}
          </span>
          <div className="flex gap-1.5 items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-[2px] transition-all duration-300 ${
                  i === currentSlideIndex ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Location & Interactive Audio/Play Badge on Right */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs text-white/90">
            <MapPin className="w-3.5 h-3.5 text-[#c58b59]" />
            <span>{slide.location}</span>
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="ml-1 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
              title="Experience Ambient Sound"
              aria-label="Toggle ambient experience"
            >
              {isPlayingAudio ? (
                <Volume2 className="w-3 h-3 text-emerald-300 animate-pulse" />
              ) : (
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
