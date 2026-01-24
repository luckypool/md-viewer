/**
 * Light Theme - Color definitions
 * Mirrors the structure of colors.ts (dark theme) with light-appropriate values
 */

export const lightColors = {
  // Background colors
  bgPrimary: '#ffffff',
  bgSecondary: '#f8faf9',
  bgTertiary: '#f0f4f3',
  bgCard: '#ffffff',

  // Accent colors (same as dark theme for brand consistency)
  accent: '#10b981',
  accentHover: '#059669',
  accentMuted: 'rgba(16, 185, 129, 0.12)',

  // Text colors
  textPrimary: '#1a2e25',
  textSecondary: '#4b5563',
  textMuted: '#6b7280',

  // Border colors
  border: '#e5e7eb',
  borderLight: 'rgba(16, 185, 129, 0.25)',

  // Status colors
  error: '#dc2626',
  warning: '#d97706',
  warningMuted: 'rgba(217, 119, 6, 0.12)',
  success: '#059669',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Shadow (for platforms that support it)
  shadowColor: '#000000',
} as const;

export type LightColorKey = keyof typeof lightColors;
