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
    <section className="relative flex-1 overflow-hidden bg-white">
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
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-white"
        />
      </div>

      {/* CONTENT: Error narrative & navigation */}
      <Container size="narrow" className="relative -mt-6 sm:-mt-8 pb-12 text-center">
        <div
          className="nf-fade-up flex items-center justify-center gap-3"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="h-px w-8 bg-gray-300" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
            Error 404
          </span>
          <span className="h-px w-8 bg-gray-300" />
        </div>

        <h1
          className="nf-fade-up mb-3 mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl"
          style={{ animationDelay: '0.2s' }}
        >
          This path leads{' '}
          <span className="italic text-gray-700">elsewhere</span>
        </h1>

        <p
          className="nf-fade-up mx-auto mb-7 max-w-md text-base leading-relaxed text-gray-600"
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
            className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>

          <Link
            href="/tour-packages"
            className="group inline-flex items-center gap-2 rounded-full border border-black bg-white px-8 py-3.5 text-sm font-medium tracking-wide text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-white"
          >
            Explore Tour Packages
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}