'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative flex-1 overflow-hidden bg-[#faf8f4]">
      <style>{`
        @keyframes nf-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nf-fade-up { animation: nf-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) { .nf-fade-up { animation: none; } }
      `}</style>

      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-teal-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl"
      />

      {/* VIDEO: Well proportioned and completely visible below sticky navbar */}
      <div className="relative h-[50vh] sm:h-[54vh] min-h-[280px] max-h-[440px] w-full pt-2 sm:pt-4">
        <video
          ref={videoRef}
          className="h-full w-full object-contain mix-blend-multiply"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/assets/404-error.mp4" type="video/mp4" />
        </video>

        {/* Soft fade from video into the page background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#faf8f4]"
        />
      </div>

      {/* CONTENT: Error narrative & navigation */}
      <Container size="narrow" className="relative -mt-6 sm:-mt-8 pb-12 text-center">
        <div
          className="nf-fade-up flex items-center justify-center gap-3"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="h-px w-8 bg-[#b08d57]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8a6d3b]">
            Error 404
          </span>
          <span className="h-px w-8 bg-[#b08d57]" />
        </div>

        <h1
          className="nf-fade-up mb-3 mt-4 font-serif text-3xl font-medium leading-[1.1] tracking-tight text-slate-900 sm:text-5xl"
          style={{ animationDelay: '0.2s' }}
        >
          This path leads{' '}
          <span className="italic text-teal-700">elsewhere</span>
        </h1>

        <p
          className="nf-fade-up mx-auto mb-7 max-w-md text-base leading-relaxed text-slate-500"
          style={{ animationDelay: '0.3s' }}
        >
          The page or journey you are looking for has moved or does not exist.
          Let&apos;s guide you back to familiar trails.
        </p>

        <div
          className="nf-fade-up flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: '0.4s' }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-800"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>

          <Link
            href="/tour-packages"
            className="group inline-flex items-center gap-2 rounded-full border border-[#d9c3a0] bg-white/60 px-8 py-3.5 text-sm font-medium tracking-wide text-slate-800 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-600 hover:text-teal-800"
          >
            Explore Tour Packages
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}