'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from './Modal';

interface ImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ImageGallery({ images, title, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Main Preview Container */}
      <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-slate-100 group shadow-md">
        <Image
          src={currentImage}
          alt={`${title} - view ${currentIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Counter Badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-xs font-semibold">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/60 backdrop-blur-md text-white hover:bg-slate-950/90 transition shadow-sm"
          aria-label="View Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg backdrop-blur-xs transition opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg backdrop-blur-xs transition opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'relative aspect-16/10 rounded-xl overflow-hidden border-2 transition-all',
                idx === currentIndex
                  ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-xs'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={title}
        className="max-w-4xl p-2 bg-slate-950 border-slate-800 text-white"
      >
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl">
          <Image
            src={currentImage}
            alt={title}
            fill
            sizes="100vw"
            className="object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
