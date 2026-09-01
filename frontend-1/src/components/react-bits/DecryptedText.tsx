import React, { useEffect, useState, useRef } from 'react';

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'mount';
}

export function DecryptedText({
  text,
  speed = 40,
  maxIterations = 12,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?/~',
  className = '',
  parentClassName = '',
  encryptedClassName = 'opacity-60 text-brand-medium font-mono',
  animateOn = 'mount',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const getAvailableChars = () => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.split(''))).filter((c) => c !== ' ').join('');
    }
    return characters;
  };

  const scramble = () => {
    setIsScrambling(true);
    const available = getAvailableChars();
    const len = text.length;
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (sequential) {
              const progress = iteration / maxIterations;
              let threshold = 0;
              if (revealDirection === 'start') {
                threshold = Math.floor(progress * len);
                if (index < threshold) return char;
              } else if (revealDirection === 'end') {
                threshold = Math.floor((1 - progress) * len);
                if (index >= threshold) return char;
              } else {
                const mid = Math.floor(len / 2);
                const span = Math.floor((progress * len) / 2);
                if (index >= mid - span && index <= mid + span) return char;
              }
            } else {
              if (iteration >= maxIterations) return char;
            }
            return available[Math.floor(Math.random() * available.length)];
          })
          .join('');
      });

      iteration++;
      if (iteration > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (animateOn === 'mount') {
      const clean = scramble();
      return clean;
    }
  }, [text, animateOn]);

  useEffect(() => {
    if (animateOn === 'hover' && isHovering && !isScrambling) {
      const clean = scramble();
      return clean;
    }
  }, [isHovering]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${parentClassName}`.trim()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className={isScrambling ? encryptedClassName : className}>{displayText}</span>
    </span>
  );
}

export default DecryptedText;
