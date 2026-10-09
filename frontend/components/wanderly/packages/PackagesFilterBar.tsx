'use client';

import React from 'react';
import { Search, MapPin, Calendar, Compass } from 'lucide-react';

interface PackagesFilterBarProps {
  destination: string;
  setDestination: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  travelStyle: string;
  setTravelStyle: (val: string) => void;
  availableDestinations?: string[];
  onSearch?: () => void;
}

export function PackagesFilterBar({
  destination,
  setDestination,
  duration,
  setDuration,
  travelStyle,
  setTravelStyle,
  availableDestinations,
  onSearch,
}: PackagesFilterBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="relative -mt-10 sm:-mt-12 z-30 max-w-5xl mx-auto px-4 sm:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e8e4dc] rounded-2xl sm:rounded-full p-3 sm:p-2.5 shadow-xl flex flex-col sm:flex-row items-center gap-3 sm:gap-2"
      >
        {/* Destination */}
        <div className="w-full sm:flex-1 px-4 py-1.5 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-[#e8e4dc]">
          <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-stone-800 focus:outline-none cursor-pointer py-0.5"
            >
              <option value="All">All Destinations</option>
              {availableDestinations && availableDestinations.length > 0 ? (
                availableDestinations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))
              ) : (
                <>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Goa">Goa</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div className="w-full sm:flex-1 px-4 py-1.5 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-[#e8e4dc]">
          <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-stone-800 focus:outline-none cursor-pointer py-0.5"
            >
              <option value="All">Any Duration</option>
              <option value="short">1 - 4 Days</option>
              <option value="medium">5 - 7 Days</option>
              <option value="long">8+ Days</option>
            </select>
          </div>
        </div>

        {/* Travel Style */}
        <div className="w-full sm:flex-1 px-4 py-1.5 flex items-center gap-3">
          <Compass className="w-4 h-4 text-stone-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Travel Style
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-stone-800 focus:outline-none cursor-pointer py-0.5"
            >
              <option value="All">All Styles</option>
              <option value="Heritage & Temples">Heritage & Culture</option>
              <option value="Coastal & Backwaters">Coastal & Backwaters</option>
              <option value="Adventure">Adventure & Trekking</option>
              <option value="Hill Station">Hill Station & Nature</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#18281d] text-white text-xs font-medium hover:bg-[#253d2c] transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
