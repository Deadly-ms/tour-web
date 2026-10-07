import React from 'react';
import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <Container size="narrow" className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Error 404
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight font-serif mt-4 mb-3">
          Destination Uncharted
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed">
          The page or journey you are looking for has moved or does not exist. Let’s guide you back to familiar trails.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <Button size="md" className="gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/tour-packages">
            <Button variant="outline" size="md" className="gap-2">
              <Search className="w-4 h-4" />
              Explore Tour Packages
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
