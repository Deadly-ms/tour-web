'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PlanTripModal } from '../modals/PlanTripModal';

interface AboutCTAProps {
  titleLine1?: string;
  titleLine2?: string;
  buttonText?: string;
}

export function AboutCTA({
  titleLine1 = "Let's create",
  titleLine2 = 'something extraordinary.',
  buttonText = 'Plan Your Trip',
}: AboutCTAProps) {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-24 sm:py-32 bg-[#18281d] text-white overflow-hidden">
        {/* Subtle Background Nature Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
            alt="Nature backdrop"
            fill
            className="object-cover object-center mix-blend-overlay"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-8">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-white drop-shadow-sm">
            {titleLine1} <br />
            {titleLine2}
          </h2>

          <div>
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium border border-white/40 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg group"
            >
              <span>{buttonText}</span>
              <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>

      <PlanTripModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} />
    </>
  );
}
