import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  rating: number;
  reviewsCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function Rating({
  rating,
  reviewsCount,
  size = 'md',
  showCount = true,
  className,
}: RatingProps) {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-semibold',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center text-amber-500">
        <Star className={cn('fill-amber-400 text-amber-400', iconSizes[size])} />
      </div>
      <span className={cn('font-semibold text-slate-800', textSizes[size])}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewsCount !== undefined && (
        <span className={cn('text-slate-500 font-normal', textSizes[size])}>
          ({reviewsCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
