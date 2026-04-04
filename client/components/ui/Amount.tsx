import React from 'react';
import { Text } from 'react-native';
import { colors } from '@/constants/theme';

interface AmountProps {
  value: number;
  type?: 'income' | 'expense' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  currency?: string;
}

export function Amount({ value, type = 'neutral', size = 'md', currency = 'BRL' }: AmountProps) {
  const colorMap = {
    income: colors.green,
    expense: colors.red,
    neutral: colors.text,
  };
  const sizeMap = { sm: 13, md: 16, lg: 22, xl: 32 };
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);

  return (
    <Text
      style={{
        color: colorMap[type],
        fontSize: sizeMap[size],
        fontWeight: '700',
      }}
    >
      {type === 'expense' ? `- ${formatted}` : type === 'income' ? `+ ${formatted}` : formatted}
    </Text>
  );
}
