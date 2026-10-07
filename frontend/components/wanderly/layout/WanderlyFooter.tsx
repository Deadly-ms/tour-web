'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export function WanderlyFooter() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing! Inspiring journeys are heading to your inbox.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#fcfbfa] border-t border-[#e8e4dc] text-stone-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#e8e4dc]">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 group inline-block">
              <svg
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-[#18281d] group-hover:scale-105 transition-transform"
              >
                <path
                  d="M3 21L10 7L15 15L18 10L25 21H3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="14" cy="4" r="1.5" fill="currentColor" />
              </svg>
              <span className="font-serif text-2xl font-normal tracking-tight text-[#18281d]">
                Wanderly
              </span>
            </Link>
            <p className="text-xs text-stone-500 max-w-xs font-light leading-relaxed">
              Travel better. Stay curious.
            </p>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed pt-2">
              Curating slow travel, cultural immersion, and bespoke itineraries designed for mindful explorers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link href="/" className="hover:text-[#18281d] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#18281d] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#18281d] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/tour-packages" className="hover:text-[#18281d] transition-colors">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#18281d] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link href="/tour-packages/rajasthan-royal-escape" className="hover:text-[#18281d] transition-colors">
                  Rajasthan
                </Link>
              </li>
              <li>
                <Link href="/tour-packages/kerala-backwaters" className="hover:text-[#18281d] transition-colors">
                  Kerala
                </Link>
              </li>
              <li>
                <Link href="/tour-packages/ladakh-adventure" className="hover:text-[#18281d] transition-colors">
                  Ladakh
                </Link>
              </li>
              <li>
                <Link href="/tour-packages/meghalaya-escape" className="hover:text-[#18281d] transition-colors">
                  Meghalaya
                </Link>
              </li>
              <li>
                <Link href="/tour-packages/goa-beach-holiday" className="hover:text-[#18281d] transition-colors">
                  Goa
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">
              Connect
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#18281d] transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#18281d] transition-colors">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#18281d] transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#18281d] transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">
              Subscribe to our newsletter
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Get travel inspiration and exclusive offers delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white border border-[#e8e4dc] rounded-full pl-4 pr-11 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#18281d]"
                />
                <button
                  type="submit"
                  className="absolute right-1 w-8 h-8 rounded-full bg-[#18281d] text-white flex items-center justify-center hover:bg-[#253d2c] transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © 2026 Wanderly. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-stone-800 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-800 transition">
              Terms of Service
            </Link>
            <div className="flex items-center gap-3 text-stone-600 pl-4 border-l border-stone-200">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#18281d] transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-[#18281d] transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#18281d] transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-[#18281d] transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
