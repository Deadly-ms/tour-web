'use client';

import React from 'react';

export interface MetricItem {
  value: string;
  label: string;
}

const DEFAULT_METRICS: MetricItem[] = [
  { value: '12+', label: 'Destinations' },
  { value: '500+', label: 'Happy Travellers' },
  { value: '4.9/5', label: 'Customer Rating' },
  { value: '8+', label: 'Years of Experience' },
];

interface ImpactMetricsProps {
  metrics?: MetricItem[];
}

export function ImpactMetrics({ metrics = DEFAULT_METRICS }: ImpactMetricsProps) {
  return (
    <section className="py-16 sm:py-20 bg-[#fcfbfa] border-b border-[#e8e4dc]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
            OUR IMPACT
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#e8e4dc] border border-[#e8e4dc] rounded-2xl sm:rounded-3xl bg-white shadow-sm overflow-hidden">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-8 sm:p-10 text-center space-y-2">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18281d] block">
                {m.value}
              </span>
              <span className="text-xs text-stone-500 font-light tracking-wide uppercase">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
