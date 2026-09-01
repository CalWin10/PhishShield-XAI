import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number | null;
  max?: number;
  indicatorColor?: string;
  showValueLabel?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Progress({
  className,
  value = 0,
  max = 100,
  indicatorColor,
  showValueLabel = false,
  ...props
}: ProgressProps) {
  const safeValue = value === null || value === undefined ? 0 : Math.min(Math.max(value, 0), max);
  const percentage = Math.round((safeValue / max) * 100);

  let barColor = indicatorColor;
  if (!barColor) {
    if (percentage >= 70) {
      barColor = 'bg-red-700';
    } else if (percentage >= 40) {
      barColor = 'bg-amber-600';
    } else {
      barColor = 'bg-emerald-600';
    }
  }

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={safeValue}
      className={cn('relative h-3 w-full overflow-hidden rounded-full bg-brand-secondary/60 border border-brand-light/30', className)}
      {...props}
    >
      <div
        className={cn('h-full transition-all duration-700 ease-out rounded-full', barColor)}
        style={{ width: `${percentage}%` }}
      />
      <span className="sr-only">{percentage}% complete</span>
    </div>
  );
}
