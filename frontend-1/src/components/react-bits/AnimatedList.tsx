import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './AnimatedList.css';

export interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
  delay?: number;
  stagger?: number;
  emptyState?: React.ReactNode;
}

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  className = '',
  delay = 0.05,
  stagger = 0.04,
  emptyState,
}: AnimatedListProps<T>) {
  if (items.length === 0 && emptyState) {
    return <div className="w-full">{emptyState}</div>;
  }

  return (
    <div className={`animated-list-container ${className}`}>
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => {
          const key = keyExtractor(item, index);
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{
                duration: 0.35,
                delay: Math.min(index * stagger, 0.4) + delay,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="animated-list-item"
            >
              {renderItem(item, index)}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default AnimatedList;
