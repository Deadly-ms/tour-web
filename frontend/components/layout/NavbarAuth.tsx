'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Shield,
  ChevronDown,
  LogOut,
  Mail,
} from 'lucide-react';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

export function NavbarAuth() {
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (hasClerkKey) {
    return <ClerkAuthSection />;
  }

  // Graceful state for local preview when Clerk credentials aren't plugged in yet
  return <FallbackAuthSection />;
}

function ClerkAuthSection() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />;
  }

  const role = (user?.publicMetadata as { role?: string })?.role;
  const isAdmin = role === 'admin' || role === 'staff';

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <SignInButton mode="modal">
          <button className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-teal-700 px-3 py-2 rounded-xl transition">
            Log In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl shadow-xs transition">
            Sign Up
          </button>
        </SignUpButton>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition"
        >
          <Shield className="w-3.5 h-3.5 text-amber-700" />
          <span>Admin</span>
        </Link>
      )}
      <UserButton
        userProfileMode="modal"
        appearance={{
          elements: {
            avatarBox: 'w-9 h-9 ring-2 ring-teal-600/30',
          },
        }}
      />
    </div>
  );
}

function FallbackAuthSection() {
  // Demonstration user toggle for visual fidelity when Clerk API key is absent
  const [isDemoSignedIn, setIsDemoSignedIn] = useState(false);
  const [isAdminDemo, setIsAdminDemo] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isDemoSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl border border-amber-200 transition"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin</span>
        </Link>
        <button
          onClick={() => setIsDemoSignedIn(true)}
          className="text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-2 rounded-xl transition"
        >
          Log In
        </button>
        <button
          onClick={() => setIsDemoSignedIn(true)}
          className="text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-3.5 py-2 rounded-xl shadow-xs transition"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
      >
        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Demo User"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
          Sarah
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* User Dropdown */}
      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
          onClick={() => setIsDropdownOpen(false)}
        >
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900">Sarah Jenkins</p>
            <p className="text-[11px] text-slate-500 truncate">sarah.jenkins@example.com</p>
            {isAdminDemo && (
              <span className="inline-block mt-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                Role: Administrator
              </span>
            )}
          </div>

          <div className="py-1">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-800 bg-amber-50/50 hover:bg-amber-100 transition"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              Admin Console
            </Link>
            <Link
              href="/tour-packages"
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <User className="w-4 h-4 text-slate-400" />
              Tour Packages
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              Contact Concierge
            </Link>
          </div>

          <div className="pt-1 border-t border-slate-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAdminDemo(!isAdminDemo);
              }}
              className="w-full text-left px-4 py-1.5 text-[11px] text-slate-400 hover:text-slate-600"
            >
              Toggle Demo Role: {isAdminDemo ? 'Admin' : 'Customer'}
            </button>
            <button
              onClick={() => setIsDemoSignedIn(false)}
              className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
