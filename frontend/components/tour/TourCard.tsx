'use client';

import React from 'react';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle2,
  CalendarCheck,
  Eye,
} from 'lucide-react';
import { TourPackage } from '@/types';
import { Button } from '@/components/ui/Button';

interface TourCardProps {
  tour: TourPackage;
  onViewItinerary?: (tour: TourPackage) => void;
  onBookNow?: (tour: TourPackage) => void;
}

export function TourCard({ tour, onViewItinerary, onBookNow }: TourCardProps) {
  return (
    <div className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
          <Image
            src={tour.heroImage}
            alt={tour.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-xs">
              {tour.category}
            </span>

            {tour.discountPercent && (
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                {tour.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Bottom Overlay info on Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 font-medium drop-shadow-md">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{tour.destination}</span>
            </div>
            {tour.bestSeller && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950">
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Duration & Group Size & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                {tour.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {tour.groupSize}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{tour.rating}</span>
              <span className="text-amber-700/60 font-normal">({tour.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug line-clamp-2">
            {tour.title}
          </h3>

          {/* Overview Snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {tour.overview}
          </p>

          {/* Inclusions Highlights */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Key Inclusions:
            </span>
            {tour.inclusions.slice(0, 3).map((inc, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span className="truncate">{inc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="p-5 sm:p-6 pt-0 space-y-3">
        <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Starting from</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-serif">
                ₹{tour.price.toLocaleString('en-IN')}
              </span>
              {tour.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{tour.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">per person (twin sharing)</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewItinerary?.(tour)}
            className="text-xs font-semibold gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Itinerary</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onBookNow?.(tour)}
            className="text-xs font-semibold gap-1.5 shadow-xs"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
