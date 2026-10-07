'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export function ClerkWrapper({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey || publishableKey.trim() === '') {
    // If Clerk key is not set yet in environment, render children without throwing runtime error
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
