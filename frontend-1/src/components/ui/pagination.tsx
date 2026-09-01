import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    if (startPage > 0) {
      buttons.push(
        <Button
          key="first"
          variant={currentPage === 0 ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPageChange(0)}
          className="h-8 w-8 p-0"
        >
          1
        </Button>
      );
      if (startPage > 1) {
        buttons.push(
          <span key="dots-1" className="px-1 text-brand-dark/50">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPageChange(i)}
          className="h-8 w-8 p-0"
        >
          {i + 1}
        </Button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        buttons.push(
          <span key="dots-2" className="px-1 text-brand-dark/50">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        );
      }
      buttons.push(
        <Button
          key="last"
          variant={currentPage === totalPages - 1 ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPageChange(totalPages - 1)}
          className="h-8 w-8 p-0"
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('flex items-center justify-center space-x-1 sm:space-x-2', className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-8 px-2.5 gap-1"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center space-x-1">{renderPageButtons()}</div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8 px-2.5 gap-1"
        aria-label="Next Page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
