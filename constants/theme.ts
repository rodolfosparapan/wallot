export const Colors = {
  // Brand
  primary: '#22c55e',
  primaryLight: '#86efac',
  primaryDark: '#16a34a',
  primaryTint: '#dcfce7',

  // Backgrounds
  bg: '#041208',
  bgCard: '#0a1f0e',
  bgElevated: '#0a4d1c',
  bgMid: '#0f5c22',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#d1fae5',
  textMuted: '#86efac',
  textHint: '#4ade80',

  // Borders
  border: '#0f3d15',
  borderStrong: '#16a34a',

  // Semantic
  income: '#22c55e',
  expense: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',

  // Categories
  housing: '#a78bfa',
  food: '#fb923c',
  transport: '#60a5fa',
  health: '#f472b6',
  shopping: '#fbbf24',
  other: '#94a3b8',
}

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 28,
  hero: 36,
}

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
}

export const CategoryColors: Record<string, string> = {
  housing: Colors.housing,
  food: Colors.food,
  transport: Colors.transport,
  health: Colors.health,
  shopping: Colors.shopping,
  other: Colors.other,
  income: Colors.income,
}

export const Categories = [
  { id: 'food', label: 'Food', icon: '🍔' },
  { id: 'housing', label: 'Housing', icon: '🏠' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'health', label: 'Health', icon: '💊' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'other', label: 'Other', icon: '📦' },
]
