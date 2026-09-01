import React from 'react';
import { GhostFibers } from '@/components/react-bits/GhostFibers';
import { GradientWaves } from '@/components/react-bits/GradientWaves';
import { MoltenMetal } from '@/components/react-bits/MoltenMetal';

export type BackgroundVariant = 'ghost-fibers' | 'gradient-waves' | 'molten-metal' | 'ambient-drift';

interface AnimatedBackgroundProps {
  variant?: BackgroundVariant;
  opacity?: number;
  className?: string;
}

export function AnimatedBackground({
  variant = 'ghost-fibers',
  opacity = 0.85,
  className = '',
}: AnimatedBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-1000 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {variant === 'ghost-fibers' && (
        <GhostFibers
          lineColor="#58382E"
          glowColor="#8C6F5A"
          speed={0.22}
          scale={2.2}
          rotation={12}
          rotationSpeed={0.15}
          layers={5}
          waveAmplitude={0.022}
          waveFrequency={3.0}
          waveSpeed={0.15}
          layerSpeed={0.08}
          twist={0.1}
          twistFrequency={4}
          twistSpeed={0.9}
          lineFrequency={5.0}
          lineSpacing={1.8}
          lineSharpness={16}
          glowFalloff={8}
          glowIntensity={1.6}
          brightness={2.2}
          blueBoost={0.9}
          vignette={0.65}
          grain={0.03}
          lightMode={true}
          fps={45}
        />
      )}

      {variant === 'gradient-waves' && (
        <GradientWaves
          horizonColor="#291C0E"
          waveColor="#6E473B"
          crestColor="#E1D4C2"
          speed={0.25}
          amplitude={2.2}
          waveScale={0.5}
          waveRatio={0.85}
          swell={28}
          turbulence={16}
          tilt={1.15}
          zoom={1.1}
          height={5.2}
          fogDepth={18}
          detail="medium"
          brightness={1.1}
          opacity={0.85}
          mouseInteraction={true}
          parallaxStrength={0.4}
          grain={true}
          grainIntensity={0.04}
        />
      )}

      {variant === 'molten-metal' && (
        <MoltenMetal
          color1="#291C0E"
          color2="#6E473B"
          color3="#BEB5A9"
          backgroundColor="#E1D4C2"
          speed={0.22}
          scale={3.5}
          detail={3}
          glow={1.4}
          coreSize={0.09}
          swirl={0.8}
          fold={-0.18}
          blackPoint={0.06}
          brightness={1.2}
          colorMode="molten"
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseStrength={0.25}
          opacity={0.8}
          lightMode={true}
        />
      )}

      {variant === 'ambient-drift' && (
        <GhostFibers
          lineColor="#58382E"
          glowColor="#8C6F5A"
          speed={0.14}
          scale={2.6}
          rotation={-15}
          rotationSpeed={0.08}
          layers={3}
          waveAmplitude={0.012}
          waveFrequency={2.2}
          waveSpeed={0.09}
          layerSpeed={0.04}
          lineFrequency={3.8}
          lineSpacing={1.5}
          lineSharpness={12}
          glowFalloff={8}
          glowIntensity={1.2}
          brightness={1.7}
          vignette={0.65}
          grain={0.02}
          lightMode={true}
          fps={35}
        />
      )}
    </div>
  );
}

export default AnimatedBackground;
