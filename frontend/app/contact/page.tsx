'use client';

import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('Rajasthan');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Please provide your name and email.', 'error');
      return;
    }

    if (name.trim().length < 2) {
      showToast('Please provide your full name (at least 2 characters).', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (message.trim().length < 10) {
      showToast('Please enter a message with at least 10 characters so we can assist you.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: destination ? `Inquiry for ${destination}` : 'Trip Planning Inquiry',
          message: message.trim(),
          website: website || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message. Please try again.');
      }

      setIsSent(true);
      showToast('Your message has been sent! Our travel specialist will be in touch within 24 hours.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Something went wrong while sending your inquiry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDestination('Rajasthan');
    setMessage('');
    setWebsite('');
    setIsSent(false);
  };

  return (
    <main className="pt-28 sm:pt-36 pb-24 bg-[#fcfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Narrative & Contacts */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase">
                GET IN TOUCH
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#18281d] leading-tight tracking-tight">
                Let&apos;s plan your <br />
                next adventure.
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-sm">
                Have a question about a journey, need a personalized recommendation, or want to customize an itinerary? We are here to help.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-[#e8e4dc]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#e8e4dc] flex items-center justify-center text-[#18281d] shadow-sm shrink-0">
                  <PhoneCall className="w-4 h-4 text-[#c58b59]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-medium text-stone-900">Direct Helpline</h4>
                  <p className="text-xs text-stone-500 font-light mt-0.5">+91 98765 43210 (24/7 Assistance)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#e8e4dc] flex items-center justify-center text-[#18281d] shadow-sm shrink-0">
                  <Mail className="w-4 h-4 text-[#c58b59]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-medium text-stone-900">Email Inquiries</h4>
                  <p className="text-xs text-stone-500 font-light mt-0.5">concierge@trackyourtrip.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#e8e4dc] flex items-center justify-center text-[#18281d] shadow-sm shrink-0">
                  <MapPin className="w-4 h-4 text-[#c58b59]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-medium text-stone-900">Curator Studios</h4>
                  <p className="text-xs text-stone-500 font-light mt-0.5">Jaipur • Kochi • New Delhi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#e8e4dc] rounded-3xl p-8 sm:p-10 shadow-lg">
              {isSent ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-3xl text-[#18281d]">Thank You!</h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                    Your inquiry has been received. One of our dedicated journey specialists will reach out to you within 24 hours.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-4 px-6 py-2 rounded-full border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-serif text-2xl font-normal text-[#18281d]">
                    Send us a message
                  </h3>

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
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full bg-[#fcfbfa] border border-[#e8e4dc] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="eleanor@example.com"
                        className="w-full bg-[#fcfbfa] border border-[#e8e4dc] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#fcfbfa] border border-[#e8e4dc] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">Destination of Interest</label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-[#fcfbfa] border border-[#e8e4dc] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                      >
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Goa">Goa</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Other">Other / Custom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">Tell us about your trip</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your planned travel dates, traveler count, preferred style, or special requests..."
                      className="w-full bg-[#fcfbfa] border border-[#e8e4dc] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#18281d] resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-full bg-[#18281d] text-white text-xs sm:text-sm font-medium hover:bg-[#253d2c] transition-colors shadow-md flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}