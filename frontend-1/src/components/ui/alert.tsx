import React from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  children?: React.ReactNode;
  className?: string;
}

export function Alert({ className, variant = 'default', children, ...props }: AlertProps) {
  const variants = {
    default: 'bg-brand-secondary/40 border-brand-light/50 text-brand-dark',
    destructive: 'bg-red-50 border-red-300 text-red-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  };

  return (
    <div
      role="alert"
      className={cn('relative w-full rounded-lg border p-4 shadow-sm text-sm', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { className?: string; children?: React.ReactNode }) {
  return <h5 className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...props}>{children}</h5>;
}

export function AlertDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { className?: string; children?: React.ReactNode }) {
  return <div className={cn('text-sm opacity-90 leading-relaxed', className)} {...props}>{children}</div>;
}
