import React from 'react';
import type { Metadata } from 'next';
import { ServicesHero } from '@/components/wanderly/services/ServicesHero';
import { ServicesShowcase } from '@/components/wanderly/services/ServicesShowcase';
import { ServicesCTA } from '@/components/wanderly/services/ServicesCTA';

export const metadata: Metadata = {
  title: 'Services | Wanderly — Everything You Need. Nothing You Don’t.',
  description:
    'From bespoke itinerary planning to private chauffeured tours, boutique hotel curation, and authentic cultural immersion, discover Wanderly services.',
};

export default function ServicesPage() {
  return (
    <main className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SECTION: "Everything you need. Nothing you don't." */}
      <ServicesHero />

      {/* 2. SERVICES SHOWCASE: Numbered 01-05 interactive list & luxury card */}
      <ServicesShowcase />

      {/* 3. CTA BANNER: "Let's plan your next adventure." */}
      <ServicesCTA />
    </main>
  );
}
