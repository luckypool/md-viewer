/**
 * Theme Toggle Button Component
 * Cycles through: light → dark → system
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius, spacing } from '../../theme';
import type { ThemeMode } from '../../contexts/ThemeContext';

const cycle: ThemeMode[] = ['light', 'dark', 'system'];

const iconMap: Record<ThemeMode, keyof typeof Ionicons.glyphMap> = {
  light: 'sunny-outline',
  dark: 'moon-outline',
  system: 'phone-portrait-outline',
};

const tooltipMap: Record<ThemeMode, string> = {
  light: 'Theme: Light — Click for Dark',
  dark: 'Theme: Dark — Click for System',
  system: 'Theme: System — Click for Light',
};

export function ThemeToggle() {
  const { mode, setTheme, colors } = useTheme();

  const handlePress = () => {
    const currentIndex = cycle.indexOf(mode);
    const nextIndex = (currentIndex + 1) % cycle.length;
    setTheme(cycle[nextIndex]);
  };

  const webProps = Platform.OS === 'web' ? { title: tooltipMap[mode] } : {};

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.bgTertiary, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={tooltipMap[mode]}
      accessibilityRole="button"
      {...webProps}
    >
      <Ionicons
        name={iconMap[mode]}
        size={20}
        color={colors.accent}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
});
