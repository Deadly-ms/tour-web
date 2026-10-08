'use client';

import React, { useState } from 'react';
import { X, Calendar, Users, MapPin, Compass, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { submitTripEnquiry } from '@/services/enquiry.service';

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
  /** Set when the modal is opened from a specific tour page */
  tourSlug?: string;
  tourTitle?: string;
}

const DESTINATIONS = ['Rajasthan', 'Kerala', 'Ladakh', 'Meghalaya', 'Goa', 'Himachal', 'Custom'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tour destinations look like "Rajasthan, India" but the dropdown values are short names
function matchDestination(d?: string): string {
  if (!d) return 'Rajasthan';
  return DESTINATIONS.find((x) => d.toLowerCase().includes(x.toLowerCase())) ?? 'Custom';
}

export function PlanTripModal({
  isOpen,
  onClose,
  defaultDestination,
  tourSlug,
  tourTitle,
}: PlanTripModalProps) {
  const { showToast } = useToast();
  const [destination, setDestination] = useState(matchDestination(defaultDestination));
  const [duration, setDuration] = useState('5-7 Days');
  const [travelers, setTravelers] = useState('2 Travelers');
  const [travelStyle, setTravelStyle] = useState('Luxury & Heritage');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setTravelDate('');
    setWebsite('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (name.trim().length < 2) {
      showToast('Please enter your full name (at least 2 characters).', 'error');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitTripEnquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        destination,
        tourSlug,
        tourTitle,
        duration,
        travelers,
        travelStyle,
        travelDate: travelDate || undefined,
        notes: notes.trim() || undefined,
        website: website || undefined,
      });

      setIsSubmitted(true);
      showToast('Your journey request has been received! Our travel specialist will reach out shortly.', 'success');
      setTimeout(() => {
        setIsSubmitted(false);
        resetForm();
        onClose();
      }, 2500);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Something went wrong while sending your request.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#fcfbfa] border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-3xl text-[#18281d]">Journey Request Received</h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto">
              Thank you, {name}. Our bespoke trip planner will contact you with a personalized itinerary proposal within 24 hours.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#c58b59] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Tailor-Made Travel
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#18281d] mt-1">Plan Your Dream Journey</h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-1">
                Tell us your travel vision and let our local experts design your bespoke itinerary.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Honeypot field for bot protection */}
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#18281d]" /> Preferred Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-white border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                  >
                    <option value="Rajasthan">Rajasthan (Forts & Royal Palaces)</option>
                    <option value="Kerala">Kerala (Backwaters & Nature)</option>
                    <option value="Ladakh">Ladakh (Himalayan High Passes)</option>
                    <option value="Meghalaya">Meghalaya (Waterfalls & Living Roots)</option>
                    <option value="Goa">Goa (Coasts & Heritage)</option>
                    <option value="Himachal">Himachal Pradesh (Alpine Trails)</option>
                    <option value="Custom">Custom / Multi-City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#18281d]" /> Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                  >
                    <option value="3-5 Days">3 - 5 Days</option>
                    <option value="5-7 Days">5 - 7 Days</option>
                    <option value="8-12 Days">8 - 12 Days</option>
                    <option value="12+ Days">12+ Days (Grand Circuit)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#18281d]" /> Travelers
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full bg-white border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                  >
                    <option value="Solo Traveler">Solo Traveler</option>
                    <option value="Couple">Couple / 2 Travelers</option>
                    <option value="Family (3-4)">Family (3 - 4 Travelers)</option>
                    <option value="Group (5+)">Group (5+ Travelers)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1.5 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#18281d]" /> Travel Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full bg-white border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                  >
                    <option value="Luxury & Heritage">Luxury & Heritage</option>
                    <option value="Adventure & Nature">Adventure & Nature</option>
                    <option value="Slow Travel & Wellness">Slow Travel & Wellness</option>
                    <option value="Culture & Food">Culture & Food</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#18281d]" /> Preferred Travel Date (Optional)
                </label>
                <input
                  type="date"
                  min={today}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-white border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                />
              </div>

              <div className="pt-2 border-t border-[#e8e4dc] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1.5">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1.5">Special Requests or Preferences (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Mention preferred travel dates, specific monuments, dietary preferences, or pace..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#18281d] text-white hover:bg-[#253d2c] transition-colors font-medium flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Custom Plan</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}