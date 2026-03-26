export const colors = {
  green: '#22c55e',
  greenDeep: '#14532d',
  greenDark: '#166534',
  greenMid: '#16a34a',
  greenLight: '#dcfce7',
  greenSoft: '#f0fdf4',
  white: '#ffffff',
  bg: '#f7f9f8',
  text: '#111917',
  textMid: '#3d6b52',
  textMuted: '#7a9e8a',
  textDim: '#b0caba',
  red: '#ef4444',
  redLight: '#fef2f2',
  yellow: '#f59e0b',
  yellowLight: '#fffbeb',
  blue: '#3b82f6',
  blueLight: '#eff6ff',
  border: 'rgba(0,0,0,0.07)',
};

export const categoryColors: Record<string, { bg: string; icon: string; color: string }> = {
  food: { bg: '#fff7ed', icon: 'fast-food', color: '#f97316' },
  transport: { bg: '#eff6ff', icon: 'car', color: '#3b82f6' },
  housing: { bg: '#f5f3ff', icon: 'home', color: '#8b5cf6' },
  health: { bg: '#fdf2f8', icon: 'heart', color: '#ec4899' },
  shopping: { bg: '#fffbeb', icon: 'bag-handle', color: '#f59e0b' },
  entertainment: { bg: '#eef2ff', icon: 'game-controller', color: '#6366f1' },
  education: { bg: '#f0fdfa', icon: 'book', color: '#14b8a6' },
  other: { bg: '#f8fafc', icon: 'ellipsis-horizontal', color: '#64748b' },
  salary: { bg: '#f0fdf4', icon: 'wallet', color: '#22c55e' },
  freelance: { bg: '#f0fdf4', icon: 'laptop', color: '#16a34a' },
};

export const typography = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  base: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  green: {
    shadowColor: '#14532d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 8,
  },
};
