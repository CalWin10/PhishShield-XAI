import React from 'react';
import './BorderGlow.css';

export interface BorderGlowProps {
  children: React.ReactNode;
  color?: string;
  glowColor?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
  borderWidth?: number;
  id?: string;
}

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  glowColor = '#6E473B',
  borderRadius = '16px',
  className = '',
  style,
  animated = true,
  id,
}) => {
  return (
    <div
      id={id}
      className={`border-glow-wrapper relative ${className}`}
      style={{
        borderRadius,
        '--glow-color': glowColor,
        ...style,
      } as React.CSSProperties}
    >
      {animated && (
        <div className="border-glow-beam" style={{ borderRadius }}>
          <div
            className="absolute inset-0 opacity-40 blur-[2px]"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 70%)`,
            }}
          />
        </div>
      )}
      <div className="border-glow-inner h-full w-full" style={{ borderRadius }}>
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
