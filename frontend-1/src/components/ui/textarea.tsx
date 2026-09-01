import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-lg border border-brand-light/50 bg-[#f4ebe1] p-3 text-sm text-brand-dark placeholder:text-brand-dark/40 shadow-inner transition-colors font-mono',
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

Textarea.displayName = 'Textarea';
