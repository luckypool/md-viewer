/**
 * Language Toggle Button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius, fontSize, fontWeight, spacing } from '../../theme';
import { Tooltip } from './Tooltip';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const { colors } = useTheme();

  const tooltip = language === 'en'
    ? 'Language: English — Click for 日本語'
    : 'Language: 日本語 — Click for English';

  return (
    <Tooltip label={tooltip}>
      <TouchableOpacity
        onPress={toggleLanguage}
        style={[styles.button, { backgroundColor: colors.bgTertiary, borderColor: colors.border }]}
        activeOpacity={0.7}
        accessibilityLabel={tooltip}
        accessibilityRole="button"
      >
        <Text style={[styles.text, { color: colors.accent }]}>
          {language === 'en' ? 'EN' : 'JA'}
        </Text>
      </TouchableOpacity>
    </Tooltip>
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
