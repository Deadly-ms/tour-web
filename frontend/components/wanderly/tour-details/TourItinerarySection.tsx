'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, MapPin, Sparkles } from 'lucide-react';
import { TourPackage } from '@/types';
import { GalleryLightboxModal } from '../modals/GalleryLightboxModal';

interface TourItinerarySectionProps {
  pkg: TourPackage;
}

export function TourItinerarySection({ pkg }: TourItinerarySectionProps) {
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  const galleryImages = (pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery : [pkg.heroImage]).map((url, i) => ({
    url,
    title: `${pkg.title} - View ${i + 1}`,
    caption: `Highlights and unforgettable moments from ${pkg.destination}`,
  }));

  const openLightbox = (index: number) => {
    setSelectedGalleryIdx(index);
    setIsGalleryOpen(true);
  };

  return (
    <section id="itinerary" className="space-y-6 pt-10 border-t border-[#e8e4dc]">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#18281d]">
          Itinerary
        </h2>
        <span className="text-xs text-stone-400 font-light">
          {pkg.itinerary.length} Days Planned
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Day Timeline */}
        <div className="lg:col-span-7 space-y-3">
          {pkg.itinerary.map((item) => {
            const isOpen = openDay === item.day;
            return (
              <div
                key={item.day}
                className="bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenDay(isOpen ? null : item.day)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#18281d] text-white font-medium">
                      Day {item.day}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base font-medium text-stone-900">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-stone-400">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-stone-100 text-xs sm:text-sm text-stone-600 font-light leading-relaxed space-y-2">
                    <p>{item.description}</p>
                    {(item.meals || item.accommodation) && (
                      <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-stone-500 font-normal">
                        {item.meals && <span>🍽️ Meals: {item.meals}</span>}
                        {item.accommodation && (
                          <span className="inline-flex items-center gap-1.5 bg-stone-100/90 px-2 py-0.5 rounded-md text-stone-700">
                            <span>🏨 Stay: {item.accommodation}</span>
                            {item.accommodationImage && (
                              <span className="relative w-5 h-5 rounded overflow-hidden shrink-0 inline-block border border-stone-300">
                                <Image
                                  src={item.accommodationImage}
                                  alt={item.accommodation}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: 4-Photo Showcase Mosaic */}
        <div className="lg:col-span-5 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {galleryImages.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="relative h-28 sm:h-32 rounded-xl overflow-hidden cursor-pointer group bg-stone-100"
              >
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>

          <button
            onClick={() => openLightbox(0)}
            className="w-full py-2.5 rounded-full border border-stone-300 text-stone-800 text-xs font-medium hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Gallery</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <GalleryLightboxModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        initialIndex={selectedGalleryIdx}
      />
    </section>
  );
}
