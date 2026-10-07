'use client';

import React, { useState } from 'react';
import { TourPackage } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { MessageCircle, ShieldCheck } from 'lucide-react';

interface TourBookingModalProps {
  tour: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TourBookingModal({ tour, isOpen, onClose }: TourBookingModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    travelDate: '',
    travelers: 2,
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tour) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      showToast('Please provide your name and phone number.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        `Thank you ${formData.fullName}! Your inquiry for "${tour.title}" has been registered. Our concierge will contact you within 2 hours.`,
        'success'
      );
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        travelDate: '',
        travelers: 2,
        specialRequests: '',
      });
      onClose();
    }, 600);
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hello TourPlatform! I am interested in booking the tour package: "${tour.title}" (${tour.duration}) starting at ₹${tour.price.toLocaleString('en-IN')}. Please share availability and customized quote.`
    );
    return `https://wa.me/919842212345?text=${text}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Book Tour: ${tour.title}`}
      className="max-w-xl"
    >
      <div className="space-y-5">
        {/* Package summary strip */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-teal-800 block">Package Fare</span>
            <span className="text-xl font-black text-teal-950 font-serif">
              ₹{tour.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-teal-800">/ person</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-teal-800 block">Duration</span>
            <span className="text-sm font-bold text-teal-950">{tour.duration}</span>
          </div>
        </div>

        {/* WhatsApp Fast Track */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="text-xs font-bold text-emerald-950">Instant WhatsApp Booking</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Chat directly with our live tour coordinator for instant confirmation.
            </p>
          </div>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shrink-0 transition shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <div className="relative text-center my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-xs uppercase font-bold text-slate-400">
            or submit online request
          </span>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Travelers
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Special Requirements / Pick-up Location
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Need airport pickup from Coimbatore, vegetarian meals preferred"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Zero cancellation fee within 24h</span>
            </div>

            <Button
              type="submit"
              size="md"
              disabled={isSubmitting}
              className="px-6 font-bold"
            >
              {isSubmitting ? 'Registering...' : 'Confirm Inquiry'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
