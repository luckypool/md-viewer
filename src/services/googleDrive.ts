/**
 * Google Drive API クライアント
 * プラットフォーム共通で使用
 */

import type { DriveFile, DriveFileListResponse } from '../types/googleDrive';
import type { UserInfo } from '../types/user';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

// Markdown ファイルの MIME タイプ
const MARKDOWN_MIME_TYPES = ['text/markdown', 'text/x-markdown', 'text/plain'];

// フォルダの MIME タイプ
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

/**
 * 検索クエリをサニタイズ（シングルクォートをエスケープ）
 */
function sanitizeQuery(query: string): string {
  return query.replace(/'/g, "\\'");
}

/**
 * ユーザー情報を取得
 */
export async function fetchUserInfo(
  accessToken: string
): Promise<UserInfo | null> {
  try {
    const response = await fetch(
      `${DRIVE_API_BASE}/about?fields=user(displayName,emailAddress,photoLink)`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return {
      email: data.user.emailAddress,
      displayName: data.user.displayName,
      photoUrl: data.user.photoLink || null,
    };
  } catch {
    return null;
  }
}

/**
 * Markdown ファイルを検索
 */
export async function searchMarkdownFiles(
  accessToken: string,
  query: string
): Promise<DriveFile[]> {
  if (!query.trim()) {
    return [];
  }

  // Markdown ファイルのみを検索するクエリを構築
  const mimeTypeQuery = MARKDOWN_MIME_TYPES.map(
    (type) => `mimeType='${type}'`
  ).join(' or ');

  // ファイル名で検索（.md または .markdown 拡張子を含む）
  const sanitized = sanitizeQuery(query);
  const searchQuery = `(${mimeTypeQuery}) and (name contains '${sanitized}' or name contains '.md' and fullText contains '${sanitized}') and trashed=false`;

  const response = await fetch(
    `${DRIVE_API_BASE}/files?` +
      new URLSearchParams({
        q: searchQuery,
        fields:
          'files(id,name,mimeType,modifiedTime,size,iconLink,webViewLink,owners)',
        pageSize: '20',
        orderBy: 'modifiedTime desc',
      }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data: DriveFileListResponse = await response.json();

  // .md または .markdown 拡張子でフィルタリング
  return (data.files || []).filter(
    (file) =>
      file.name.toLowerCase().endsWith('.md') ||
      file.name.toLowerCase().endsWith('.markdown')
  );
}

/**
 * ファイル内容を取得
 */
export async function fetchFileContent(
  accessToken: string,
  fileId: string,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return await response.text();
}

/**
 * ファイル情報を取得
 */
export async function fetchFileInfo(
  accessToken: string,
  fileId: string
): Promise<DriveFile | null> {
  try {
    const response = await fetch(
      `${DRIVE_API_BASE}/files/${fileId}?fields=id,name,mimeType,modifiedTime,size`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

/**
 * フォルダかどうかを判定
 */
export function isFolder(file: DriveFile): boolean {
  return file.mimeType === FOLDER_MIME_TYPE;
}

/**
 * Markdown ファイルかどうかを判定
 */
export function isMarkdownFile(file: DriveFile): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.md') || name.endsWith('.markdown');
}

/**
 * フォルダ内のファイルとサブフォルダを取得
 * @param accessToken アクセストークン
 * @param folderId フォルダID（'root' でマイドライブのルート）
 * @returns フォルダとMarkdownファイルの配列
 */
export async function listFolderContents(
  accessToken: string,
  folderId: string = 'root'
): Promise<DriveFile[]> {
  // フォルダとMarkdownファイル（.md, .markdown 拡張子を持つもの）を取得
  const mimeTypeQuery = MARKDOWN_MIME_TYPES.map(
    (type) => `mimeType='${type}'`
  ).join(' or ');

  const searchQuery = `'${folderId}' in parents and trashed=false and (mimeType='${FOLDER_MIME_TYPE}' or ${mimeTypeQuery})`;

  const response = await fetch(
    `${DRIVE_API_BASE}/files?` +
      new URLSearchParams({
        q: searchQuery,
        fields:
          'files(id,name,mimeType,modifiedTime,size,iconLink,webViewLink,owners,parents)',
        pageSize: '100',
        orderBy: 'folder,name',
      }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to list folder contents: ${response.statusText}`);
  }

  const data: DriveFileListResponse = await response.json();
  const files = data.files || [];

  // フォルダは全て、ファイルは .md/.markdown のみを返す
  return files.filter(
    (file) => isFolder(file) || isMarkdownFile(file)
  );
}

/**
 * フォルダ情報を取得（パンくず用）
 */
export async function fetchFolderInfo(
  accessToken: string,
  folderId: string
): Promise<DriveFile | null> {
  if (folderId === 'root') {
    return {
      id: 'root',
      name: 'マイドライブ',
      mimeType: FOLDER_MIME_TYPE,
    };
  }

  try {
    const response = await fetch(
      `${DRIVE_API_BASE}/files/${folderId}?fields=id,name,mimeType,parents`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

/**
 * フォルダの親階層を取得（パンくずナビゲーション用）
 */
export async function fetchFolderPath(
  accessToken: string,
  folderId: string
): Promise<DriveFile[]> {
  const path: DriveFile[] = [];
  let currentId = folderId;

  while (currentId && currentId !== 'root') {
    const folder = await fetchFolderInfo(accessToken, currentId);
    if (!folder) break;

    path.unshift(folder);

    // 親フォルダを取得
    const parents = (folder as DriveFile & { parents?: string[] }).parents;
    currentId = parents?.[0] || '';
  }

  // ルートを先頭に追加
  path.unshift({
    id: 'root',
    name: 'マイドライブ',
    mimeType: FOLDER_MIME_TYPE,
  });

  return path;
}
