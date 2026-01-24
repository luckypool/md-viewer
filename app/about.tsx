/**
 * MD Viewer - About Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight } from '../src/theme';
import { useTheme } from '../src/hooks';
import { ThemeToggle } from '../src/components/ui';

export default function AboutScreen() {
  const { colors } = useTheme();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.bgSecondary }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>About MD Viewer</Text>
        <ThemeToggle />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.heroIcon}
            resizeMode="contain"
          />
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>MD Viewer</Text>
          <Text style={[styles.heroVersion, { color: colors.textMuted }]}>Version 1.0.0</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>What is MD Viewer?</Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            MD Viewer is a web application that beautifully renders Markdown files
            stored in your Google Drive. It provides a seamless reading experience
            with syntax highlighting, diagram support, and PDF export capabilities.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Features</Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.accentMuted }]}>
                <Ionicons name="logo-google" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Google Drive Integration</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Connect your Google account and search for Markdown files
                  directly from your Drive. Quick access to your documents
                  without downloading.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.accentMuted }]}>
                <Ionicons name="code-slash-outline" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Syntax Highlighting</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Code blocks are rendered with syntax highlighting for
                  various programming languages including JavaScript, Python,
                  TypeScript, and more.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.accentMuted }]}>
                <Ionicons name="git-network-outline" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Mermaid Diagrams</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Create flowcharts, sequence diagrams, and other visualizations
                  using Mermaid syntax. Diagrams are rendered automatically
                  within your documents.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.accentMuted }]}>
                <Ionicons name="document-outline" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>PDF Export</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Export your rendered Markdown documents as PDF files.
                  Perfect for sharing documentation or creating printable
                  versions of your notes.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.accentMuted }]}>
                <Ionicons name="folder-outline" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Local File Support</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Open Markdown files from your local device without signing in.
                  Great for quick previews or when working offline.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.accentMuted }]}>
                <Ionicons name="time-outline" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Recent Files</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Quick access to recently viewed files. Your reading history
                  is stored locally for convenience.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Supported Formats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Supported Markdown Features</Text>
          <View style={styles.chipContainer}>
            {['Headers', 'Bold / Italic', 'Lists', 'Tables', 'Code Blocks', 'Links', 'Images', 'Blockquotes', 'Task Lists', 'Strikethrough', 'Mermaid', 'GFM'].map((label) => (
              <View key={label} style={[styles.chip, { backgroundColor: colors.bgTertiary, borderColor: colors.border }]}>
                <Text style={[styles.chipText, { color: colors.textSecondary }]}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Privacy & Security</Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            MD Viewer only requests read-only access to your Google Drive files.
            Your documents are never stored on our servers - they are fetched
            directly from Google Drive and rendered in your browser.
            Your authentication tokens are stored securely in your browser's
            local storage.
          </Text>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Built with Expo and React Native Web
          </Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
  },
  heroTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    marginTop: spacing.md,
  },
  heroVersion: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },

  // Sections
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  sectionText: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * 1.6,
  },

  // Feature List
  featureList: {
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },

  // Chips
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipText: {
    fontSize: fontSize.sm,
  },

  // Footer
  footer: {
    marginTop: spacing['2xl'],
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize.sm,
  },
});
