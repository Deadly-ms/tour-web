import React from 'react';
import { HomeHero } from '@/components/wanderly/home/HomeHero';
import { PopularDestinations } from '@/components/wanderly/home/PopularDestinations';
import { CuratedPackages } from '@/components/wanderly/home/CuratedPackages';
import { WhyChooseUs } from '@/components/wanderly/home/WhyChooseUs';
import { StoriesFromRoad } from '@/components/wanderly/home/StoriesFromRoad';
import { MomentsInspire } from '@/components/wanderly/home/MomentsInspire';

export default function HomePage() {
  return (
    <main className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SECTION: "The World Beyond." */}
      <HomeHero />

      {/* 2. POPULAR DESTINATIONS: Asymmetric 5-card grid */}
      <PopularDestinations />

      {/* 3. CURATED TOUR PACKAGES: 3 curated cards */}
      <CuratedPackages />

      {/* 4. WHY CHOOSE US: "Your Journey, Our Priority." */}
      <WhyChooseUs />

      {/* 5. STORIES FROM THE ROAD: The Journal */}
      <StoriesFromRoad />

      {/* 6. MOMENTS THAT INSPIRE: Gallery Mosaic & Lightbox */}
      <MomentsInspire />
    </main>
  );
}
