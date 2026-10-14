import React from 'react';
import type { Metadata } from 'next';
import { ServicesHero } from '@/components/wanderly/services/ServicesHero';
import { ServicesShowcase } from '@/components/wanderly/services/ServicesShowcase';
import { ServicesCTA } from '@/components/wanderly/services/ServicesCTA';
import { ServicesTicker } from '@/components/wanderly/services/ServicesTicker';

export const metadata: Metadata = {
  title: 'Services | Track your trip — College, Corporate, School, Family & More',
  description:
    'Tour packages for colleges, corporates, schools, groups and families, plus domestic, inbound and outbound holidays, planned end to end by Track your trip.',
};

export default function ServicesPage() {
  return (
    <main className="flex flex-col w-full overflow-x-clip">
      {/* 1. HERO SECTION: "Everything you need. Nothing you don't." */}
      <ServicesHero />

      <ServicesTicker />
      
      {/* 2. SERVICES SHOWCASE: Numbered 01-05 interactive list & luxury card */}
      <ServicesShowcase />

      {/* 3. CTA BANNER: "Let's plan your next adventure." */}
      <ServicesCTA />
    </main>
  );
}
