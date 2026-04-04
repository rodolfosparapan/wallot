import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/constants/theme';

interface WLogoProps {
  size?: number;
  color?: string;
}

export function WLogo({ size = 48, color = colors.green }: WLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M6 12L14 36L24 18L34 36L42 12"
        stroke={color}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
