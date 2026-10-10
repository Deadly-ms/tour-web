'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import { PlanTripModal } from '../modals/PlanTripModal';
import { SearchModal } from '../modals/SearchModal';
import { NavbarAuth } from '@/components/layout/NavbarAuth';

export function WanderlyNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Check if current page has dark hero background at the top (like Home page)
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Tour Packages', href: '/tour-packages' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Determine navbar styling:
  // On homepage before scroll: transparent overlay with white text
  // After scroll or on inner pages: clean warm background with dark pine text
  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={`${
          isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        } z-40 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent text-white pt-1.5 sm:pt-2'
            : 'bg-[#fcfbfa]/95 backdrop-blur-md text-[#18281d] border-b border-[#e8e4dc] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <svg
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105 ${
                  isTransparent ? 'text-white' : 'text-[#18281d]'
                }`}
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
              <span
                className={`font-serif text-xl sm:text-2xl font-normal tracking-tight ${
                  isTransparent ? 'text-white' : 'text-[#18281d]'
                }`}
              >
                Track your trip
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[13px] tracking-wide font-medium transition-colors duration-200 relative py-1 ${
                      isTransparent
                        ? active
                          ? 'text-white font-semibold'
                          : 'text-white/80 hover:text-white'
                        : active
                        ? 'text-[#18281d] font-semibold'
                        : 'text-stone-600 hover:text-[#18281d]'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full ${
                          isTransparent ? 'bg-white' : 'bg-[#18281d]'
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Search + Plan Your Trip Button */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                  isTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                }`}
                aria-label="Search destinations"
              >
                <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>

              <button
                onClick={() => setIsPlanModalOpen(true)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 ${
                  isTransparent
                    ? 'bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm'
                    : 'bg-[#18281d] text-white hover:bg-[#253d2c] shadow-sm'
                }`}
              >
                <span>Plan Your Trip</span>
                <span className="text-xs">→</span>
              </button>

              {/* Clerk / Auth component */}
              <div className="hidden lg:block">
                <NavbarAuth />
              </div>

              {/* Mobile menu toggle button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-1.5 rounded-lg md:hidden transition-colors ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-stone-800 hover:bg-stone-100'
                }`}
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#fcfbfa] border-b border-[#e8e4dc] text-stone-900 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base font-medium py-1.5 transition-colors ${
                      active ? 'text-[#18281d] font-semibold' : 'text-stone-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#e8e4dc] flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsPlanModalOpen(true);
                }}
                className="w-full py-3 rounded-full bg-[#18281d] text-white text-center text-sm font-medium hover:bg-[#253d2c] transition"
              >
                Plan Your Trip →
              </button>
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchModalOpen(true);
                  }}
                  className="flex items-center gap-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Packages</span>
                </button>
                <NavbarAuth />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <PlanTripModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  );
}
