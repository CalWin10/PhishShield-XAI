import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'warning' | 'success' | 'brand';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-brand-medium text-white border-transparent',
    secondary: 'bg-brand-secondary text-brand-dark border-transparent',
    outline: 'border border-brand-light/60 text-brand-dark bg-transparent',
    destructive: 'bg-red-800 text-white border-transparent',
    warning: 'bg-amber-600 text-white border-transparent',
    success: 'bg-emerald-700 text-white border-transparent',
    brand: 'bg-brand-light/30 text-brand-dark border-brand-light/50',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-medium focus:ring-offset-2 whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
