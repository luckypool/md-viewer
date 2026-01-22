/**
 * MD Viewer - Directory Browser Screen
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../src/theme';
import { useGoogleAuth } from '../src/hooks';
import {
  listFolderContents,
  fetchFolderPath,
  isFolder,
  isMarkdownFile,
} from '../src/services/googleDrive';
import type { DriveFile } from '../src/types';

interface BreadcrumbItem {
  id: string;
  name: string;
}

export default function BrowseScreen() {
  const params = useLocalSearchParams<{ folderId?: string; folderName?: string }>();
  const { isAuthenticated, accessToken, authenticate } = useGoogleAuth();

  const [currentFolderId, setCurrentFolderId] = useState<string>(params.folderId || 'root');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'マイドライブ' },
  ]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォルダ内容を読み込む
  const loadFolderContents = useCallback(async (folderId: string) => {
    if (!accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const contents = await listFolderContents(accessToken, folderId);
      setFiles(contents);

      // パンくずを更新
      const path = await fetchFolderPath(accessToken, folderId);
      setBreadcrumbs(path.map((f) => ({ id: f.id, name: f.name })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'フォルダの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // 初回読み込みとフォルダ変更時
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      loadFolderContents(currentFolderId);
    }
  }, [isAuthenticated, accessToken, currentFolderId, loadFolderContents]);

  // フォルダを開く
  const handleOpenFolder = useCallback((folder: DriveFile) => {
    setCurrentFolderId(folder.id);
  }, []);

  // ファイルを選択して viewer に遷移
  const handleSelectFile = useCallback((file: DriveFile) => {
    router.replace({
      pathname: '/viewer',
      params: {
        id: file.id,
        name: file.name,
        source: 'google-drive',
      },
    });
  }, []);

  // パンくずからフォルダに移動
  const handleBreadcrumbPress = useCallback((item: BreadcrumbItem) => {
    setCurrentFolderId(item.id);
  }, []);

  // 閉じる
  const handleClose = useCallback(() => {
    router.back();
  }, []);

  // 相対時間を計算
  const formatRelativeTime = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) return date.toLocaleDateString('ja-JP');
    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    if (minutes > 0) return `${minutes}分前`;
    return 'たった今';
  };

  // アイテムをレンダリング
  const renderItem = useCallback(
    ({ item }: { item: DriveFile }) => {
      const itemIsFolder = isFolder(item);

      return (
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => (itemIsFolder ? handleOpenFolder(item) : handleSelectFile(item))}
          activeOpacity={0.7}
        >
          <View style={[styles.listIcon, itemIsFolder && styles.folderIcon]}>
            <Ionicons
              name={itemIsFolder ? 'folder' : 'document-text-outline'}
              size={20}
              color={itemIsFolder ? colors.warning : colors.accent}
            />
          </View>
          <View style={styles.listContent}>
            <Text style={styles.listName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.modifiedTime && (
              <Text style={styles.listMeta}>
                {formatRelativeTime(item.modifiedTime)}
              </Text>
            )}
          </View>
          <Ionicons
            name={itemIsFolder ? 'chevron-forward' : 'arrow-forward'}
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      );
    },
    [handleOpenFolder, handleSelectFile]
  );

  // フォルダとファイルを分離してソート
  const sortedFiles = [...files].sort((a, b) => {
    const aIsFolder = isFolder(a);
    const bIsFolder = isFolder(b);
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    return a.name.localeCompare(b.name, 'ja');
  });

  const folders = sortedFiles.filter(isFolder);
  const markdownFiles = sortedFiles.filter(isMarkdownFile);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>フォルダを参照</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Breadcrumbs */}
      {isAuthenticated && (
        <View style={styles.breadcrumbContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.breadcrumbContent}
          >
            {breadcrumbs.map((item, index) => (
              <View key={item.id} style={styles.breadcrumbItem}>
                {index > 0 && (
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={colors.textMuted}
                    style={styles.breadcrumbSeparator}
                  />
                )}
                <TouchableOpacity
                  onPress={() => handleBreadcrumbPress(item)}
                  disabled={index === breadcrumbs.length - 1}
                >
                  <Text
                    style={[
                      styles.breadcrumbText,
                      index === breadcrumbs.length - 1 && styles.breadcrumbTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Body */}
      <View style={styles.body}>
        {!isAuthenticated ? (
          <View style={styles.authPrompt}>
            <Text style={styles.authText}>
              Google Drive を参照するには{'\n'}ログインしてください
            </Text>
            <TouchableOpacity style={styles.authButton} onPress={authenticate}>
              <Ionicons name="logo-google" size={20} color={colors.bgPrimary} />
              <Text style={styles.authButtonText}>Google でログイン</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>読み込み中...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadFolderContents(currentFolderId)}
            >
              <Text style={styles.retryButtonText}>再試行</Text>
            </TouchableOpacity>
          </View>
        ) : files.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>このフォルダは空です</Text>
            <Text style={styles.emptyHint}>
              Markdown ファイル (.md) やサブフォルダがありません
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedFiles}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                {folders.length > 0 && (
                  <Text style={styles.sectionTitle}>
                    {folders.length} フォルダ
                  </Text>
                )}
                {markdownFiles.length > 0 && folders.length > 0 && (
                  <Text style={styles.sectionCount}>
                    ・{markdownFiles.length} ファイル
                  </Text>
                )}
                {markdownFiles.length > 0 && folders.length === 0 && (
                  <Text style={styles.sectionTitle}>
                    {markdownFiles.length} ファイル
                  </Text>
                )}
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },

  // Breadcrumbs
  breadcrumbContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgPrimary,
  },
  breadcrumbContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbSeparator: {
    marginHorizontal: spacing.xs,
  },
  breadcrumbText: {
    fontSize: fontSize.sm,
    color: colors.accent,
  },
  breadcrumbTextActive: {
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },

  // Body
  body: {
    flex: 1,
  },

  // Auth Prompt
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  authText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.base * 1.5,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  authButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.bgPrimary,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
  },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.bgPrimary,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // List
  listContainer: {
    padding: spacing.sm,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  sectionCount: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
    gap: spacing.md,
  },
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderIcon: {
    backgroundColor: colors.warningMuted,
  },
  listContent: {
    flex: 1,
  },
  listName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  listMeta: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
});
