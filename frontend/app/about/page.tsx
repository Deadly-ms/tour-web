import React from 'react';
import type { Metadata } from 'next';
import { AboutHero } from '@/components/wanderly/about/AboutHero';
import { PhilosophySection } from '@/components/wanderly/about/PhilosophySection';
import { ImpactMetrics } from '@/components/wanderly/about/ImpactMetrics';
import { MeetTheTeam } from '@/components/wanderly/about/MeetTheTeam';
import { AboutCTA } from '@/components/wanderly/about/AboutCTA';

export const metadata: Metadata = {
  title: 'About Us | Wanderly — More Than A Journey',
  description:
    'Learn about Wanderly: our philosophy of slow travel, curated storytelling, sustainable exploration, and the passionate team crafting your journeys.',
};

export default function AboutPage() {
  return (
    <main className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SECTION: "MORE THAN A JOURNEY." */}
      <AboutHero />

      {/* 2. OUR PHILOSOPHY: "Travel slowly. Look closer. Stay curious." */}
      <PhilosophySection />

      {/* 3. OUR IMPACT: Key Metrics (12+, 500+, 4.9/5, 8+) */}
      <ImpactMetrics />

      {/* 4. MEET OUR TEAM: Team grid (Aftab, Meera, Karthik, Divya) */}
      <MeetTheTeam />

      {/* 5. CTA BANNER: "Let's create something extraordinary." */}
      <AboutCTA />
    </main>
  );
}
