'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, PhoneCall, MapPin, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getAllTourPackages } from '@/services/tour.service';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

const inputClass =
  'w-full bg-[#fcfbfa] border border-[#e8e4dc] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 transition-[border-color,box-shadow,background-color] duration-300 focus:outline-none focus:bg-white focus:border-[#c58b59] focus:ring-4 focus:ring-[#c58b59]/10';

export default function ContactPage() {
  const { showToast } = useToast();
  const root = useRef<HTMLElement>(null);
  const formCard = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('Rajasthan');
  const [destinationsList, setDestinationsList] = useState<string[]>([
    'Rajasthan', 'Kerala', 'Ladakh', 'Meghalaya', 'Goa', 'Himachal Pradesh'
  ]);
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /* ───────── Animation 1: page-load intro (runs once) ─────────
     rule draws → headline lines rise → contact rows slide in →
     form card unveils → form fields settle one by one            */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.from('[data-fade]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 }, 0)
          .from('[data-line]', { yPercent: 110, duration: 1.2, stagger: 0.14 }, 0.1)
          .fromTo(
            '[data-rule]',
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.2, ease: 'power3.inOut' },
            0.7
          )
          .from('[data-contact-row]', { x: -18, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.9)
          .fromTo(
            '[data-form-card]',
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath' },
            0.35
          )
          .from('[data-form-field]', { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, 1.1);

        // Soft glow drifts slowly as the page scrolls
        gsap.fromTo(
          '[data-glow]',
          { yPercent: -10 },
          {
            yPercent: 25,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  /* ───────── Animation 2: success state (answers the user's action) ───────── */
  useGSAP(
    () => {
      if (!isSent) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-success-icon]', { scale: 0.5, opacity: 0, duration: 0.8, ease: 'back.out(1.8)' })
          .from('[data-success-fade]', { y: 16, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.4');
      });
    },
    { scope: root, dependencies: [isSent] }
  );

  /* ───────── Animation 3: gentle shake when validation fails ───────── */
  const fail = (msg: string) => {
    showToast(msg, 'error');
    if (
      formCard.current &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      gsap.fromTo(
        formCard.current,
        { x: 0 },
        { keyframes: { x: [-10, 10, -8, 8, -4, 4, 0] }, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const liveTours = await getAllTourPackages();
        if (liveTours && liveTours.length > 0) {
          const list: string[] = [];
          liveTours.forEach((p) => {
            if (p.destination) {
              const clean = p.destination.split(',')[0].trim();
              if (clean && !list.some((d) => d.toLowerCase() === clean.toLowerCase())) {
                list.push(clean);
              }
            }
          });
          if (list.length > 0) setDestinationsList(list);
        }
      } catch (err) {
        console.warn('Failed to load destinations in Contact page:', err);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      fail('Please provide your name and email.');
      return;
    }

    if (name.trim().length < 2) {
      fail('Please provide your full name (at least 2 characters).');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      fail('Please enter a valid email address.');
      return;
    }

    if (message.trim().length < 10) {
      fail('Please enter a message with at least 10 characters so we can assist you.');
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
      fail(err.message || 'Something went wrong while sending your inquiry.');
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
    <main ref={root} className="relative overflow-hidden pt-10 sm:pt-14 pb-24 bg-[#fcfbfa] min-h-screen">
      {/* Very soft warm light behind the form */}
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-40 w-[620px] h-[620px] rounded-full bg-[#c58b59]/[0.07] blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Narrative & Contacts */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span
                data-fade
                className="block text-[11px] font-semibold tracking-[0.25em] text-[#c58b59] uppercase"
              >
                GET IN TOUCH
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#18281d] leading-tight tracking-tight">
                <span className="block overflow-hidden pb-[0.12em]">
                  <span data-line className="block">Let&apos;s plan your</span>
                </span>
                <span className="block overflow-hidden pb-[0.12em]">
                  <span data-line className="block">next adventure.</span>
                </span>
              </h1>
              <p
                data-fade
                className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-sm"
              >
                Have a question about a journey, need a personalized recommendation, or want to customize an itinerary? We are here to help.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div data-rule aria-hidden className="h-px w-full bg-[#e8e4dc]" />

              <div data-contact-row className="group flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#e8e4dc] flex items-center justify-center shadow-sm shrink-0 transition-colors duration-300 group-hover:bg-[#18281d] group-hover:border-[#18281d]">
                  <PhoneCall className="w-4 h-4 text-[#c58b59] transition-colors duration-300 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-medium text-stone-900">Direct Helpline</h4>
                  <a
                    href="tel:+919876543210"
                    className="text-xs text-stone-500 font-light mt-0.5 block hover:text-[#18281d] transition-colors"
                  >
                    +91 98765 43210 (24/7 Assistance)
                  </a>
                </div>
              </div>

              <div data-contact-row className="group flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#e8e4dc] flex items-center justify-center shadow-sm shrink-0 transition-colors duration-300 group-hover:bg-[#18281d] group-hover:border-[#18281d]">
                  <Mail className="w-4 h-4 text-[#c58b59] transition-colors duration-300 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-medium text-stone-900">Email Inquiries</h4>
                  <a
                    href="mailto:concierge@trackyourtrip.com"
                    className="text-xs text-stone-500 font-light mt-0.5 block hover:text-[#18281d] transition-colors"
                  >
                    concierge@trackyourtrip.com
                  </a>
                </div>
              </div>

              <div data-contact-row className="group flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#e8e4dc] flex items-center justify-center shadow-sm shrink-0 transition-colors duration-300 group-hover:bg-[#18281d] group-hover:border-[#18281d]">
                  <MapPin className="w-4 h-4 text-[#c58b59] transition-colors duration-300 group-hover:text-white" />
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
            <div
              ref={formCard}
              data-form-card
              className="bg-white border border-[#e8e4dc] rounded-3xl p-8 sm:p-10 shadow-[0_40px_80px_-40px_rgba(24,40,29,0.3)]"
            >
              {isSent ? (
                <div className="py-16 text-center space-y-4">
                  <div
                    data-success-icon
                    className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 data-success-fade className="font-serif text-3xl text-[#18281d]">Thank You!</h3>
                  <p data-success-fade className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                    Your inquiry has been received. One of our dedicated journey specialists will reach out to you within 24 hours.
                  </p>
                  <button
                    data-success-fade
                    onClick={handleReset}
                    className="mt-4 px-6 py-2 rounded-full border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 data-form-field className="font-serif text-2xl font-normal text-[#18281d]">
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

                  <div data-form-field className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-stone-700 mb-1.5">Your Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium text-stone-700 mb-1.5">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="eleanor@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div data-form-field className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-medium text-stone-700 mb-1.5">Phone Number</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-destination" className="block text-xs font-medium text-stone-700 mb-1.5">Destination of Interest</label>
                      <select
                        id="contact-destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className={inputClass}
                      >
                        {destinationsList.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                        <option value="Other">Other / Custom</option>
                      </select>
                    </div>
                  </div>

                  <div data-form-field>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-stone-700 mb-1.5">Tell us about your trip</label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your planned travel dates, traveler count, preferred style, or special requests..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div data-form-field className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-full bg-[#18281d] text-white text-xs sm:text-sm font-medium hover:bg-[#c58b59] transition-colors duration-300 shadow-md flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
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