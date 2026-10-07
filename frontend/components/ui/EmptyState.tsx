import React from 'react';
import Link from 'next/link';
import { Compass, Search, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  onReset?: () => void;
  icon?: 'search' | 'compass';
  className?: string;
}

export function EmptyState({
  title = 'No results found',
  message = 'We could not find anything matching your search criteria. Try modifying your filters or search terms.',
  actionText = 'Explore All',
  actionHref,
  onReset,
  icon = 'search',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white/60 my-8',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 shadow-xs">
        {icon === 'compass' ? (
          <Compass className="w-7 h-7" />
        ) : (
          <Search className="w-7 h-7" />
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm sm:text-base max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Filters
          </Button>
        )}
        {actionHref && (
          <Link href={actionHref}>
            <Button size="sm">{actionText}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
