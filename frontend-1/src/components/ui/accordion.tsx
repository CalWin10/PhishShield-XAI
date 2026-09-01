import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
  children?: React.ReactNode;
  key?: React.Key;
}

export function Accordion({
  type = 'single',
  defaultValue,
  className,
  children,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('divide-y divide-brand-light/30 rounded-xl overflow-hidden', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextType {
  value: string;
}

const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children?: React.ReactNode;
  key?: React.Key;
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn('border-b border-brand-light/20 last:border-b-0', className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const acc = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);

  if (!acc || !item) throw new Error('AccordionTrigger must be used inside AccordionItem');

  const isOpen = acc.openItems.includes(item.value);

  return (
    <button
      type="button"
      onClick={() => acc.toggleItem(item.value)}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full items-center justify-between py-3.5 px-4 text-left text-sm font-medium transition-all hover:bg-brand-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium cursor-pointer',
        isOpen && 'bg-brand-secondary/20',
        className
      )}
      {...props}
    >
      <div className="flex-1 pr-4">{children}</div>
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-brand-dark/70 transition-transform duration-200',
          isOpen && 'rotate-180 text-brand-medium'
        )}
      />
    </button>
  );
}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const acc = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);

  if (!acc || !item) throw new Error('AccordionContent must be used inside AccordionItem');

  const isOpen = acc.openItems.includes(item.value);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'px-4 pb-4 pt-1 text-sm text-brand-dark/90 bg-brand-secondary/15 animate-in fade-in-50 duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
