import React from 'react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  perText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PriceDisplay({
  price,
  originalPrice,
  currency = '₹',
  perText = '/ person',
  size = 'md',
  className,
}: PriceDisplayProps) {
  const formattedPrice = price.toLocaleString('en-IN');
  const formattedOriginal = originalPrice?.toLocaleString('en-IN');

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const sizeClasses = {
    sm: {
      amount: 'text-base font-bold text-slate-900',
      original: 'text-xs line-through text-slate-400',
      per: 'text-xs text-slate-500',
    },
    md: {
      amount: 'text-xl font-extrabold text-slate-900',
      original: 'text-xs line-through text-slate-400',
      per: 'text-xs text-slate-500',
    },
    lg: {
      amount: 'text-2xl sm:text-3xl font-extrabold text-slate-900',
      original: 'text-sm line-through text-slate-400',
      per: 'text-sm text-slate-500',
    },
    xl: {
      amount: 'text-3xl sm:text-4xl font-black text-slate-900',
      original: 'text-base line-through text-slate-400',
      per: 'text-base text-slate-600',
    },
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {originalPrice && originalPrice > price && (
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={sizeClasses[size].original}>
            {currency}
            {formattedOriginal}
          </span>
          {discountPercent && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800">
              Save {discountPercent}%
            </span>
          )}
        </div>
      )}
      <div className="flex items-baseline gap-1">
        <span className={sizeClasses[size].amount}>
          {currency}
          {formattedPrice}
        </span>
        {perText && <span className={sizeClasses[size].per}>{perText}</span>}
      </div>
    </div>
  );
}
