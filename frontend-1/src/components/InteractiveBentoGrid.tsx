import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface InteractiveBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "110, 71, 59" or "#6E473B"
  enableTilt?: boolean;
  enableSpotlight?: boolean;
  tiltIntensity?: number;
  variant?: 'light' | 'dark' | 'glass' | 'subtle';
  badge?: React.ReactNode;
  key?: React.Key;
  onClick?: React.MouseEventHandler<HTMLDivElement> | (() => void) | ((e?: any) => any);
}

export function InteractiveBentoCard({
  children,
  className = '',
  glowColor = '110, 71, 59',
  enableTilt = true,
  enableSpotlight = true,
  tiltIntensity = 7,
  variant = 'light',
  badge,
  ...props
}: InteractiveBentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState<string>('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -tiltIntensity;
      const rotateY = ((x - centerX) / centerX) * tiltIntensity;
      setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -1000, y: -1000 });
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
  };

  // Resolve color string if hex passed
  const resolvedGlowColor = glowColor.startsWith('#')
    ? (() => {
        const hex = glowColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) || 110;
        const g = parseInt(hex.substring(2, 4), 16) || 71;
        const b = parseInt(hex.substring(4, 6), 16) || 59;
        return `${r}, ${g}, ${b}`;
      })()
    : glowColor;

  const variantStyles = {
    light: 'bg-[#ebe0d1] border-brand-light/40 text-brand-dark',
    dark: 'bg-[#1e150d] border-brand-light/30 text-white',
    glass: 'bg-[#ede3d5]/90 backdrop-blur-md border-brand-light/40 text-brand-dark',
    subtle: 'bg-brand-bg/80 border-brand-light/30 text-brand-dark',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out, box-shadow 0.3s ease',
      }}
      className={cn(
        'relative rounded-2xl border p-6 overflow-hidden transition-all duration-300 group select-none shadow-sm hover:shadow-md',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Layer */}
      {enableSpotlight && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${resolvedGlowColor}, 0.18), transparent 70%)`,
          }}
        />
      )}

      {/* Dynamic Cursor Border Highlight Layer */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl z-0 transition-opacity duration-300 opacity-100"
          style={{
            border: `1px solid rgba(${resolvedGlowColor}, 0.45)`,
          }}
        />
      )}

      {/* Card Content with Relative Z-Index */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {badge && <div className="mb-3">{badge}</div>}
        {children}
      </div>
    </div>
  );
}

export interface InteractiveBentoGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function InteractiveBentoGrid({
  children,
  className = '',
  cols = 3,
}: InteractiveBentoGridProps) {
  const colStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  return (
    <div className={cn('grid gap-5 w-full', colStyles[cols], className)}>
      {children}
    </div>
  );
}
