'use client';

import React from 'react';
import Link from 'next/link';

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
  return (
    <section className="py-20 sm:py-24 bg-[#18281d] text-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-white">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md mx-auto">
          {subtitle}
        </p>
        <div className="pt-2">
          <Link
            href={buttonHref}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium border border-white/40 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-md"
          >
            <span>{buttonText}</span>
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
