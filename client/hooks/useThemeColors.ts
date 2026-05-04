import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '@/constants/theme';
import { useThemeStore } from '@/stores/themeStore';

export type ThemeColors = typeof lightColors;

export function useThemeColors(): ThemeColors {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  return isDark ? darkColors : lightColors;
}

export function useIsDark(): boolean {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  return mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
}
