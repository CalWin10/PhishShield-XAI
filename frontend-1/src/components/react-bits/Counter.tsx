import React, { useEffect } from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'motion/react';
import './Counter.css';

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
  key?: React.Key;
}

function NumberComponent({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });
  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num: number) {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number) {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

interface DigitProps {
  place: number | string;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
  key?: React.Key;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  const isDecimal = place === '.';
  const numericPlace = typeof place === 'number' ? place : 1;
  const valueRoundedToPlace = isDecimal ? 0 : getValueRoundedToPlace(value, numericPlace);
  const animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 120,
    damping: 24,
  });

  useEffect(() => {
    if (!isDecimal) {
      animatedValue.set(valueRoundedToPlace);
    }
  }, [animatedValue, valueRoundedToPlace, isDecimal]);

  if (isDecimal) {
    return (
      <span className="counter-digit" style={{ height, ...digitStyle, width: 'fit-content' }}>
        .
      </span>
    );
  }

  return (
    <span className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <NumberComponent key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

export interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: (number | string)[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: string | number;
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places,
  gap = 4,
  borderRadius = 4,
  horizontalPadding = 0,
  textColor = 'inherit',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 0,
  gradientFrom = 'rgba(0,0,0,0.1)',
  gradientTo = 'transparent',
  topGradientStyle,
  bottomGradientStyle,
}: CounterProps) {
  const valStr = value.toString();
  const calculatedPlaces: (number | string)[] =
    places ||
    [...valStr].map((ch, i, a) => {
      if (ch === '.') {
        return '.';
      } else {
        const dotIdx = a.indexOf('.');
        return 10 ** (dotIdx === -1 ? a.length - i - 1 : i < dotIdx ? dotIdx - i - 1 : -(i - dotIdx));
      }
    });

  const height = fontSize + padding;
  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    gap: gap,
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight: fontWeight,
    direction: 'ltr',
  };
  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };
  const defaultBottomGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };

  return (
    <span className="counter-container" style={containerStyle}>
      <span className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}>
        {calculatedPlaces.map((place, idx) => (
          <Digit key={`${place}-${idx}`} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </span>
      {gradientHeight > 0 && (
        <span className="gradient-container">
          <span className="top-gradient" style={topGradientStyle || defaultTopGradientStyle}></span>
          <span
            className="bottom-gradient"
            style={bottomGradientStyle || defaultBottomGradientStyle}
          ></span>
        </span>
      )}
    </span>
  );
}

export { Counter };
