'use client';

import React, { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { ErrorState } from '@/components/ui/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <Container size="narrow">
        <ErrorState
          title="Something went wrong"
          message="We encountered an unexpected issue while loading this page. Our team has been notified. Please try again."
          onRetry={reset}
        />
      </Container>
    </div>
  );
}
