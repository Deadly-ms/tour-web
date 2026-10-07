'use client';

import React from 'react';
import Image from 'next/image';
import { TourPackage } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Utensils,
  Hotel,
} from 'lucide-react';

interface TourItineraryModalProps {
  tour: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (tour: TourPackage) => void;
}

export function TourItineraryModal({
  tour,
  isOpen,
  onClose,
  onBookNow,
}: TourItineraryModalProps) {
  if (!tour) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tour.title}
      className="max-w-2xl max-h-[85vh]"
    >
      <div className="space-y-6">
        {/* Banner with Destination & Price */}
        <div className="relative h-44 rounded-2xl overflow-hidden">
          <Image
            src={tour.heroImage}
            alt={tour.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-teal-300 font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{tour.destination}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{tour.duration}</span>
              </div>
              <h4 className="text-base font-bold text-white leading-tight">
                {tour.title}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">From</span>
              <span className="text-xl font-black text-teal-400 font-serif">
                ₹{tour.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tour Overview
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {tour.overview}
          </p>
        </div>

        {/* Day-by-Day Itinerary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Day-by-Day Detailed Itinerary
          </h4>
          <div className="space-y-3">
            {tour.itinerary.map((item) => (
              <div
                key={item.day}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-600 text-white font-black text-xs">
                    Day {item.day}
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">{item.title}</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1">
                  {item.description}
                </p>

                {(item.meals || item.accommodation) && (
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-4 text-[11px] text-slate-600 pl-1">
                    {item.meals && (
                      <div className="flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-teal-600" />
                        <span>Meals: {item.meals}</span>
                      </div>
                    )}
                    {item.accommodation && (
                      <div className="flex items-center gap-1">
                        <Hotel className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Stay: {item.accommodation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Package Inclusions
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {tour.inclusions.map((inc, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              Package Exclusions
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {tour.exclusions.map((exc, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Fixed Tariff:</span>
            <span className="text-lg font-black text-slate-900 font-serif block">
              ₹{tour.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">/ person</span>
            </span>
          </div>

          <Button
            size="md"
            onClick={() => {
              onClose();
              onBookNow(tour);
            }}
            className="gap-1.5 font-bold"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book This Tour</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
