import React from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, children, ...props }: React.TableHTMLAttributes<HTMLTableElement> & { className?: string; children?: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-auto rounded-xl border border-brand-light/30 shadow-xs">
      <table className={cn('w-full caption-bottom text-sm border-collapse text-brand-dark', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { className?: string; children?: React.ReactNode }) {
  return <thead className={cn('bg-brand-secondary/60 border-b border-brand-light/40', className)} {...props}>{children}</thead>;
}

export function TableBody({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { className?: string; children?: React.ReactNode }) {
  return <tbody className={cn('divide-y divide-brand-light/20 bg-brand-bg/50', className)} {...props}>{children}</tbody>;
}

export function TableFooter({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { className?: string; children?: React.ReactNode }) {
  return <tfoot className={cn('bg-brand-secondary/50 font-medium text-brand-dark', className)} {...props}>{children}</tfoot>;
}

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement> & { className?: string; children?: React.ReactNode }) {
  return (
    <tr
      className={cn('transition-colors hover:bg-brand-secondary/35 data-[state=selected]:bg-brand-secondary/50', className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement> & { className?: string; children?: React.ReactNode }) {
  return (
    <th
      className={cn(
        'h-11 px-4 text-left align-middle font-semibold text-xs text-brand-dark uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement> & { className?: string; children?: React.ReactNode }) {
  return <td className={cn('p-4 align-middle text-sm text-brand-dark', className)} {...props}>{children}</td>;
}

export function TableCaption({ className, children, ...props }: React.HTMLAttributes<HTMLTableCaptionElement> & { className?: string; children?: React.ReactNode }) {
  return <caption className={cn('mt-4 text-xs text-brand-dark/70', className)} {...props}>{children}</caption>;
}
