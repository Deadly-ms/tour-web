'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PackagesHero } from '@/components/wanderly/packages/PackagesHero';
import { PackagesFilterBar } from '@/components/wanderly/packages/PackagesFilterBar';
import { PackageGrid } from '@/components/wanderly/packages/PackageGrid';
import { getAllTourPackages } from '@/services/tour.service';
import { TourPackage } from '@/types';
import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';

function TourPackagesContent() {
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get('destination') || 'All';
  const initialCategory = searchParams.get('category') || 'All';

  const [packages, setPackages] = useState<TourPackage[]>(MOCK_TOUR_PACKAGES);
  const [destination, setDestination] = useState(initialDestination);
  const [duration, setDuration] = useState('All');
  const [travelStyle, setTravelStyle] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('popular');

  // Load packages dynamically from API
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const livePackages = await getAllTourPackages();
        if (isMounted && livePackages && livePackages.length > 0) {
          setPackages(livePackages);
        }
      } catch (err) {
        console.error('Failed to load tour packages from API:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPackages = useMemo(() => {
    let list = [...packages];

    // Filter destination
    if (destination !== 'All') {
      list = list.filter((p) =>
        p.destination.toLowerCase().includes(destination.toLowerCase())
      );
    }

    // Filter duration
    if (duration === 'short') {
      list = list.filter((p) => p.durationDays <= 4);
    } else if (duration === 'medium') {
      list = list.filter((p) => p.durationDays >= 5 && p.durationDays <= 7);
    } else if (duration === 'long') {
      list = list.filter((p) => p.durationDays >= 8);
    }

    // Filter travel style
    if (travelStyle !== 'All') {
      list = list.filter(
        (p) =>
          p.category === travelStyle ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(travelStyle.toLowerCase())))
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // popular
      list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }

    return list;
  }, [packages, destination, duration, travelStyle, sortBy]);

  const availableDestinations = useMemo(() => {
    const list: string[] = [];
    packages.forEach((p) => {
      if (p.destination) {
        const clean = p.destination.split(',')[0].trim();
        if (clean && !list.some((d) => d.toLowerCase() === clean.toLowerCase())) {
          list.push(clean);
        }
      }
    });
    return list;
  }, [packages]);

  return (
    <main className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SECTION: Golden sunset desert dunes */}
      <PackagesHero />

      {/* 2. FILTER BAR: Floating search & filter bar */}
      <PackagesFilterBar
        destination={destination}
        setDestination={setDestination}
        duration={duration}
        setDuration={setDuration}
        travelStyle={travelStyle}
        setTravelStyle={setTravelStyle}
        availableDestinations={availableDestinations}
      />

      {/* 3. PACKAGES GRID & PAGINATION */}
      <PackageGrid
        packages={filteredPackages}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </main>
  );
}

export default function TourPackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbfa]" />}>
      <TourPackagesContent />
    </Suspense>
  );
}
