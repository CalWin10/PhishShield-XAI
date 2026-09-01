import React from 'react';
import './GlassIcons.css';

export interface GlassIconItem {
  icon: React.ReactNode;
  color?: string;
  label?: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items?: GlassIconItem[];
  icon?: React.ReactNode;
  color?: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function GlassIcon({
  icon,
  color = 'rgba(167, 141, 120, 0.4)',
  isActive = false,
  className = '',
  onClick,
  size = 'md',
}: GlassIconsProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  return (
    <div
      className={`glass-icon-container cursor-pointer select-none ${className}`}
      onClick={onClick}
      style={{ '--glow-color': color } as React.CSSProperties}
    >
      <div className={`glass-icon-item ${sizeClasses[size]} ${isActive ? 'active' : ''}`}>
        <div className="glass-icon-glow" />
        <div className="relative z-10 flex items-center justify-center text-inherit">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default GlassIcon;
