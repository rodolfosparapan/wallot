import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categoryColors } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

interface CategoryIconProps {
  category: string;
  size?: number;
  monochrome?: boolean;
}

export function CategoryIcon({ category, size = 40, monochrome = false }: CategoryIconProps) {
  const c = useThemeColors();
  const cat = categoryColors[category] || categoryColors.other;
  const iconSize = size * 0.5;

  return (
    <View
      style={[
        styles.categoryIcon,
        {
          width: size,
          height: size,
          borderRadius: size * 0.35,
          backgroundColor: monochrome ? c.bg : cat.bg,
          borderWidth: monochrome ? 1 : 0,
          borderColor: monochrome ? c.border : undefined,
        },
      ]}
    >
      <Ionicons
        name={cat.icon as any}
        size={iconSize}
        color={monochrome ? c.textMid : cat.color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
