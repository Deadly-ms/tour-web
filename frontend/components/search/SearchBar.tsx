'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  variant?: 'hero' | 'compact';
}

export function SearchBar({ className, variant = 'hero' }: SearchBarProps) {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [travellers, setTravellers] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set('destination', destination.trim());
    if (date) params.set('date', date);
    if (travellers) params.set('travellers', travellers);

    router.push(`/tour-packages?${params.toString()}`);
  };

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        'w-full bg-white rounded-2xl md:rounded-full p-2.5 sm:p-3 shadow-2xl border border-slate-200/80 transition-all duration-200',
        className
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-0 items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Destination */}
        <div className="flex items-center gap-3 px-3 py-2 md:py-1">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0">
            <label htmlFor="search-destination" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Destination
            </label>
            <input
              id="search-destination"
              type="text"
              placeholder="Where to? (e.g. Bali, Swiss Alps, Kyoto)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent truncate"
            />
          </div>
        </div>

        {/* Travel Date */}
        <div className="flex items-center gap-3 px-3 py-2 md:py-1">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0">
            <label htmlFor="search-date" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Travel Date
            </label>
            <input
              id="search-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm font-semibold text-slate-900 focus:outline-none bg-transparent cursor-pointer"
            />
          </div>
        </div>

        {/* Travellers */}
        <div className="flex items-center gap-3 px-3 py-2 md:py-1">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0">
            <label htmlFor="search-travellers" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Travellers
            </label>
            <select
              id="search-travellers"
              value={travellers}
              onChange={(e) => setTravellers(e.target.value)}
              className="text-sm font-semibold text-slate-900 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="1">1 Solo Traveler</option>
              <option value="2">2 Travelers (Couple)</option>
              <option value="4">Small Group (3-5)</option>
              <option value="8">Large Group (6+)</option>
            </select>
          </div>
        </div>

        {/* Search CTA */}
        <div className="p-1 md:pl-3 flex justify-end">
          <button
            type="submit"
            className={cn(
              'w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl md:rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all duration-200 active:scale-95 shadow-md shadow-teal-700/20',
              isHero ? 'px-7 py-3.5 text-sm sm:text-base' : 'px-5 py-2.5 text-sm'
            )}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Find Tours</span>
          </button>
        </div>
      </div>
    </form>
  );
}
