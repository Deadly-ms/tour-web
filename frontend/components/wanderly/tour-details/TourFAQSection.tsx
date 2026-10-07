'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: 'Can this itinerary be fully customized?',
    answer:
      'Yes, absolutely. All our journeys are 100% tailor-made. You can add extra days in Jodhpur or Udaipur, upgrade your suite, request specific dietary arrangements, or include special monument permits.',
  },
  {
    question: 'What type of conveyance and vehicle is provided?',
    answer:
      'You are provided a dedicated, private air-conditioned vehicle (Toyota Innova Crysta or luxury sedan) with a seasoned English-speaking chauffeur who remains with you throughout the circuit.',
  },
  {
    question: 'What is the cancellation and refund policy?',
    answer:
      'We offer flexible bookings with free date rescheduling up to 14 days before your departure date. Full details are outlined in your personalized booking confirmation.',
  },
  {
    question: 'Are monument entrance passes and guides included?',
    answer:
      'Yes, all prime monument tickets and certified local architectural historians for Amber Fort, Mehrangarh, and Udaipur City Palace are included.',
  },
];

export function TourFAQSection({ faqs = DEFAULT_FAQS }: { faqs?: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="space-y-6 pt-10 border-t border-[#e8e4dc]">
      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#18281d]">
        Frequently Asked Questions
      </h2>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
              >
                <span className="font-serif text-sm sm:text-base font-medium text-stone-900">
                  {faq.question}
                </span>
                <span className="text-stone-400 shrink-0 ml-4">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 font-light leading-relaxed border-t border-stone-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
