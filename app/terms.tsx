/**
 * MD Viewer - Terms of Service Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight } from '../src/theme';
import { useTheme, useLanguage } from '../src/hooks';
import { ThemeToggle, LanguageToggle } from '../src/components/ui';

export default function TermsScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const handleBack = () => {
    router.back();
  };

  const sections = t.legal.terms.sections;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.bgSecondary }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{t.legal.terms.title}</Text>
        <View style={styles.headerActions}>
          <LanguageToggle />
          <ThemeToggle />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
            {t.legal.terms.lastUpdated}
          </Text>

          {Object.values(sections).map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {section.title}
              </Text>
              <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
                {section.body}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  lastUpdated: {
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  sectionBody: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.8,
  },
});
