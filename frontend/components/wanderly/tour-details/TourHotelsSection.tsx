'use client';

import React from 'react';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { TourPackage, HotelItem } from '@/types';

const FALLBACK_HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
];

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

interface TourHotelsSectionProps {
  pkg?: TourPackage;
  hotels?: HotelItem[];
  title?: string;
  subtitle?: string;
}

export function TourHotelsSection({
  pkg,
  hotels: propHotels,
  title = 'Curated Stays & Resorts',
  subtitle = 'Handpicked heritage boutique hotels offering authenticity and luxurious comfort.',
}: TourHotelsSectionProps) {
  // Determine which hotel list to render
  let displayHotels: HotelItem[] = [];

  if (propHotels && propHotels.length > 0) {
    displayHotels = propHotels;
  } else if (pkg?.hotels && pkg.hotels.length > 0) {
    displayHotels = pkg.hotels;
  } else if (pkg?.itinerary && pkg.itinerary.length > 0) {
    // Dynamically derive stays from itinerary accommodations if available
    const uniqueAccommodations = Array.from(
      new Set(
        pkg.itinerary
          .map((d) => d.accommodation?.trim())
          .filter((acc): acc is string => Boolean(acc && !acc.match(/^(none|n\/a|selected hotel|tba)$/i)))
      )
    );

    if (uniqueAccommodations.length > 0) {
      const tourMedia = [
        ...(pkg.gallery || []),
        pkg.heroImage,
        ...FALLBACK_HOTEL_IMAGES,
      ].filter(Boolean);

      displayHotels = uniqueAccommodations.map((accName, idx) => {
        const dayWithImage = pkg.itinerary.find(
          (d) => d.accommodation?.trim().toLowerCase() === accName.toLowerCase() && d.accommodationImage
        );

        return {
          name: accName,
          location: pkg.destination || 'Prime Location',
          category: idx % 2 === 0 ? 'Curated Tour Stay' : 'Luxury Boutique Stay',
          image: dayWithImage?.accommodationImage || tourMedia[idx % tourMedia.length] || FALLBACK_HOTEL_IMAGES[0],
          rating: Number((pkg.rating ? Math.min(5, Math.max(4.6, pkg.rating - idx * 0.04)) : 4.9).toFixed(2)),
        };
      });
    }
  }

  // If no package was provided at all, fall back to default preview
  if (displayHotels.length === 0 && !pkg) {
    displayHotels = DEFAULT_HOTELS;
  }

  // If a package is specified but has no hotels and no accommodations, omit section gracefully
  if (displayHotels.length === 0) {
    return null;
  }

  return (
    <section id="hotels" className="space-y-6 pt-10 border-t border-[#e8e4dc]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#18281d]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light pt-1">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {displayHotels.map((hotel, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-2xl overflow-hidden border border-[#e8e4dc] shadow-sm flex flex-col"
          >
            <div className="relative h-48 w-full bg-stone-100">
              <Image
                src={hotel.image || FALLBACK_HOTEL_IMAGES[idx % FALLBACK_HOTEL_IMAGES.length]}
                alt={hotel.name}
                fill
                unoptimized={Boolean(hotel.image && !hotel.image.includes('unsplash.com') && !hotel.image.includes('cloudinary.com'))}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{hotel.rating || 4.9}</span>
              </div>
            </div>

            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c58b59]">
                {hotel.category || 'Handpicked Stay'}
              </span>
              <h3 className="font-serif text-base font-medium text-stone-900">
                {hotel.name}
              </h3>
              <p className="text-xs text-stone-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{hotel.location || pkg?.destination || 'Destination'}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
