// Imperative color palette for values that can't be a className — icon colors,
// navigation chrome, status bar, ActivityIndicator, placeholders.
// Mirrors the CSS token values in src/global.css.

export type ThemePalette = {
  background: string;
  card: string;
  surfaceMuted: string;
  border: string;
  foreground: string;
  muted: string;
  brand: string;
  brandContrast: string;
  success: string;
  danger: string;
  placeholder: string;
};

export const palette: Record<'light' | 'dark', ThemePalette> = {
  light: {
    background: '#f8fafc',
    card: '#ffffff',
    surfaceMuted: '#f1f5f9',
    border: '#e2e8f0',
    foreground: '#0f172a',
    muted: '#64748b',
    brand: '#6366f1',
    brandContrast: '#ffffff',
    success: '#10b981',
    danger: '#f43f5e',
    placeholder: '#94a3b8',
  },
  dark: {
    background: '#020617',
    card: '#0f172a',
    surfaceMuted: '#1e293b',
    border: '#1e293b',
    foreground: '#f1f5f9',
    muted: '#94a3b8',
    brand: '#818cf8',
    brandContrast: '#ffffff',
    success: '#34d399',
    danger: '#fb7185',
    placeholder: '#64748b',
  },
};
