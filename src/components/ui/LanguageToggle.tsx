/**
 * Language Toggle Button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius, fontSize, fontWeight, spacing } from '../../theme';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const { colors } = useTheme();

  const tooltip = language === 'en'
    ? 'Language: English — Click for 日本語'
    : 'Language: 日本語 — Click for English';

  const webProps = Platform.OS === 'web' ? { title: tooltip } : {};

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      style={[styles.button, { backgroundColor: colors.bgTertiary, borderColor: colors.border }]}
      activeOpacity={0.7}
      accessibilityLabel={tooltip}
      accessibilityRole="button"
      {...webProps}
    >
      <Text style={[styles.text, { color: colors.accent }]}>
        {language === 'en' ? 'EN' : 'JA'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
