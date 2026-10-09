'use client';

import React, { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { getTourPackageBySlug } from '@/services/tour.service';
import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';
import { TourPackage } from '@/types';
import { TourDetailsHero } from '@/components/wanderly/tour-details/TourDetailsHero';
import { TourDetailsTabs } from '@/components/wanderly/tour-details/TourDetailsTabs';
import { TourOverviewSection } from '@/components/wanderly/tour-details/TourOverviewSection';
import { TourItinerarySection } from '@/components/wanderly/tour-details/TourItinerarySection';
import { TourInclusionsSection } from '@/components/wanderly/tour-details/TourInclusionsSection';
import { TourHotelsSection } from '@/components/wanderly/tour-details/TourHotelsSection';
import { TourFAQSection } from '@/components/wanderly/tour-details/TourFAQSection';
import { TourBookingSidebar } from '@/components/wanderly/tour-details/TourBookingSidebar';
import { PlanTripModal } from '@/components/wanderly/modals/PlanTripModal';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TourDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Initial fallback to mock data while loading
  const initialPkg =
    MOCK_TOUR_PACKAGES.find((p) => p.slug === resolvedParams.slug) ||
    MOCK_TOUR_PACKAGES[0];

  const [pkg, setPkg] = useState<TourPackage | null>(initialPkg);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const liveTour = await getTourPackageBySlug(resolvedParams.slug);
        if (isMounted) {
          if (liveTour) {
            setPkg(liveTour);
          } else {
            // If not found in API or mock
            const fallback = MOCK_TOUR_PACKAGES.find((p) => p.slug === resolvedParams.slug);
            if (fallback) {
              setPkg(fallback);
            } else {
              setPkg(null);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load tour by slug:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [resolvedParams.slug]);

  if (!loading && !pkg) {
    notFound();
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#fcfbfa] flex items-center justify-center">
        <div className="animate-pulse text-stone-400 font-serif text-lg">
          Loading itinerary...
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full overflow-hidden bg-[#fcfbfa] pb-24">
      {/* 1. CINEMATIC HERO: Destination image, title, tags, price */}
      <TourDetailsHero pkg={pkg} onPlanClick={() => setIsPlanModalOpen(true)} />

      {/* 2. STICKY TABS NAVIGATION */}
      <TourDetailsTabs />

      {/* 3. SPLIT MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          {/* Left Column: Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            <TourOverviewSection pkg={pkg} />
            <TourItinerarySection pkg={pkg} />
            <TourInclusionsSection pkg={pkg} />
            <TourHotelsSection />
            <TourFAQSection />
          </div>

          {/* Right Column: Sticky Booking Card (4 cols) */}
          <div className="lg:col-span-4">
            <TourBookingSidebar pkg={pkg} onPlanClick={() => setIsPlanModalOpen(true)} />
          </div>
        </div>
      </div>

      {/* Plan Trip / Booking Modal */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        defaultDestination={pkg.destination}
        tourSlug={pkg.slug}
        tourTitle={pkg.title}
      />
    </main>
  );
}
