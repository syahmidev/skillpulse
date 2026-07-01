/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Theme-flipping semantic tokens (see src/global.css).
        background: 'rgb(var(--color-background) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        'surface-muted': 'rgb(var(--color-surface-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        // Fixed accents (same in both themes).
        brand: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#f43f5e',
      },
    },
  },
  plugins: [],
};
