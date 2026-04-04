import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, categoryColors } from '@/constants/theme';

interface CategoryIconProps {
  category: string;
  size?: number;
  monochrome?: boolean;
}

export function CategoryIcon({ category, size = 40, monochrome = false }: CategoryIconProps) {
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
          backgroundColor: monochrome ? colors.bg : cat.bg,
          borderWidth: monochrome ? 1 : 0,
          borderColor: monochrome ? colors.border : undefined,
        },
      ]}
    >
      <Ionicons
        name={cat.icon as any}
        size={iconSize}
        color={monochrome ? colors.textMid : cat.color}
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
