import { useColorScheme } from 'nativewind';

import { palette, type ThemePalette } from './palette';

/** Active (resolved) color scheme: 'light' | 'dark'. */
export function useScheme(): 'light' | 'dark' {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
}

/** Imperative theme palette for the active scheme (icons, nav chrome, etc.). */
export function useTheme(): ThemePalette {
  return palette[useScheme()];
}
