'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    name: 'Aftab',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Meera',
    role: 'Travel Expert',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Karthik',
    role: 'Operations',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Divya',
    role: 'Customer Support',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  },
];

interface MeetTheTeamProps {
  tag?: string;
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
}

export function MeetTheTeam({
  tag = 'MEET OUR TEAM',
  title = 'The People Behind\nYour Journeys',
  subtitle = 'A passionate team of travel experts, local guides and storytellers, working together to create unforgettable experiences.',
  members = DEFAULT_TEAM,
}: MeetTheTeamProps) {
  return (
    <section className="py-20 sm:py-24 bg-[#fcfbfa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left: Text & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
              {tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18281d] leading-tight whitespace-pre-line tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-sm pt-1">
              {subtitle}
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#18281d] text-white text-xs sm:text-sm font-medium hover:bg-[#253d2c] transition-colors shadow-sm"
              >
                <span>Meet The Team</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>

          {/* Right: 4 Team Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {members.map((member, idx) => (
                <div key={idx} className="group space-y-3">
                  <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-medium text-[#18281d]">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 font-light">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
