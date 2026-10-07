'use client';

import React from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, MapPin } from 'lucide-react';

interface HotelItem {
  name: string;
  location: string;
  category: string;
  image: string;
  rating: number;
}

const DEFAULT_HOTELS: HotelItem[] = [
  {
    name: 'Shahpura Haveli Heritage Palace',
    location: 'Jaipur, Rajasthan',
    category: '5-Star Heritage Royal Stay',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
  },
  {
    name: 'Fateh Garh Lakeside Sanctuary',
    location: 'Udaipur, Rajasthan',
    category: 'Luxury Boutique Lakeview Resort',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
  },
];

export function TourHotelsSection({ hotels = DEFAULT_HOTELS }: { hotels?: HotelItem[] }) {
  return (
    <section id="hotels" className="space-y-6 pt-10 border-t border-[#e8e4dc]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#18281d]">
            Curated Stays &amp; Stays
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light pt-1">
            Handpicked heritage boutique hotels offering authenticity and luxurious comfort.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {hotels.map((hotel, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-2xl overflow-hidden border border-[#e8e4dc] shadow-sm flex flex-col"
          >
            <div className="relative h-48 w-full bg-stone-100">
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{hotel.rating}</span>
              </div>
            </div>

            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c58b59]">
                {hotel.category}
              </span>
              <h3 className="font-serif text-base font-medium text-stone-900">
                {hotel.name}
              </h3>
              <p className="text-xs text-stone-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{hotel.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
