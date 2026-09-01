import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-brand-light/50 bg-[#f4ebe1] px-3.5 py-2 text-sm text-brand-dark placeholder:text-brand-dark/40 shadow-inner transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium focus-visible:border-brand-medium',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-600 focus-visible:ring-red-600',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
