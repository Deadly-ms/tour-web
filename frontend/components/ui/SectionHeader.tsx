import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  actionHref?: string;
  actionText?: string;
  className?: string;
}

export function SectionHeader({
  tag,
  title,
  subtitle,
  align = 'left',
  actionHref,
  actionText,
  className,
}: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12',
        isCentered && 'text-center md:flex-col md:items-center',
        className
      )}
    >
      <div className={cn('max-w-2xl', isCentered && 'mx-auto')}>
        {tag && (
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full inline-block mb-3 border border-teal-200/50">
            {tag}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionHref && actionText && (
        <div className={cn('shrink-0', isCentered && 'mt-4')}>
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors group"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
