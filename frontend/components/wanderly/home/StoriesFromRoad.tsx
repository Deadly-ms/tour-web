'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, X, Clock, BookOpen } from 'lucide-react';

export interface StoryArticle {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  readTime: string;
  excerpt: string;
  content: string;
}

const DEFAULT_STORIES: StoryArticle[] = [
  {
    id: 'kerala-slow-travel',
    title: 'The Quiet Side of Kerala',
    subtitle: 'A guide to experience slow travel',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    readTime: '4 min read',
    excerpt: 'Beyond the crowded tourist spots lies a tranquil web of palm-fringed canals, early morning bird calls, and village artisans keeping centuries-old traditions alive.',
    content: `Slow travel in Kerala is less about ticking off landmarks and more about settling into the rhythmic lap of water against wooden hulls.

Wake at dawn as mist floats off Lake Vembanad. Sip freshly brewed filter coffee while kingfishers dive for their morning catch. In these waterways, life moves at the tempo of oars.

Our local host families welcome you into heritage tharavadu homes for spice-infused breakfasts, coconut toddy tastings, and Ayurvedic wellness rituals passed through generations. It is travel as it was meant to be: calming, restorative, and unforgettable.`,
  },
  {
    id: '48-hours-in-ladakh',
    title: '48 Hours in Ladakh',
    subtitle: 'A short escape to the mountains',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80',
    readTime: '5 min read',
    excerpt: 'How to make the most of a weekend in the high-altitude desert: monasteries, starry skies, and crisp Himalayan air.',
    content: `High on the Tibetan plateau, the air is thin, crisp, and pure. Even in forty-eight hours, Ladakh rearranges your sense of scale.

Start in Leh's historic Old Town, tracing mudbrick alleys beneath the nine-story Leh Palace. By afternoon, sit in quiet contemplation at Thiksey Monastery as monks chant deep baritone mantras beneath prayer flags flapping in the wind.

As dusk settles, step outside your mountain camp to look up: the Milky Way blazes with a clarity that exists only at eleven thousand feet.`,
  },
  {
    id: 'beyond-the-palace-rajasthan',
    title: 'Beyond the Palace',
    subtitle: "Rajasthan's timeless charm",
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    readTime: '6 min read',
    excerpt: 'Stepping off the beaten track in Rajasthan reveals artisan potteries, stepwell architecture, and stories carved into golden desert stone.',
    content: `While Jaipur and Udaipur rightfully captivate travelers with grand courtyards and mirrored halls, Rajasthan’s true spirit lives in its rural havelis and artisan villages.

Here, block printers in Bagru press carved teak into indigo dye, continuing craft methods perfected in the 17th century. In the Thar desert outside Jodhpur, Bishnoi elders tend to sacred blackbuck antelopes under thorny acacia trees.

Travel here with open eyes, and Rajasthan rewards you with profound warmth, vibrant colors, and hospitality fit for royalty.`,
  },
];

interface StoriesFromRoadProps {
  tag?: string;
  title?: string;
  stories?: StoryArticle[];
}

export function StoriesFromRoad({
  tag = 'THE JOURNAL',
  title = 'Stories from the Road',
  stories = DEFAULT_STORIES,
}: StoriesFromRoadProps) {
  const [activeStory, setActiveStory] = useState<StoryArticle | null>(null);

  return (
    <section className="py-20 sm:py-24 bg-[#fcfbfa] border-b border-[#e8e4dc]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
              {tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18281d] tracking-tight">
              {title}
            </h2>
          </div>
          <div>
            <button
              onClick={() => setActiveStory(stories[0])}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#18281d] hover:text-[#c58b59] transition-colors group"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3 Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="group cursor-pointer flex flex-col space-y-4"
            >
              {/* Image */}
              <div className="relative h-60 sm:h-64 w-full rounded-2xl overflow-hidden bg-stone-100">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-normal text-[#18281d] group-hover:text-[#c58b59] transition-colors">
                  {story.title}
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  {story.subtitle}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#18281d] group-hover:underline">
                    <span>Read More</span>
                    <span className="text-xs">→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl bg-[#fcfbfa] border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-6">
              <Image
                src={activeStory.image}
                alt={activeStory.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span className="text-[#c58b59] font-medium uppercase tracking-wider">The Journal</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activeStory.readTime}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#18281d]">
                {activeStory.title}
              </h2>
              <p className="text-stone-500 text-sm italic">
                {activeStory.subtitle}
              </p>

              <div className="text-stone-700 text-sm leading-relaxed whitespace-pre-line space-y-4 border-t border-[#e8e4dc] pt-4">
                {activeStory.content}
              </div>

              <div className="pt-6 border-t border-[#e8e4dc] flex justify-between items-center">
                <Link
                  href="/tour-packages"
                  onClick={() => setActiveStory(null)}
                  className="text-xs font-semibold text-[#18281d] hover:underline flex items-center gap-1"
                >
                  <span>Explore related journeys</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setActiveStory(null)}
                  className="px-5 py-2 rounded-full bg-[#18281d] text-white text-xs font-medium hover:bg-[#253d2c]"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
