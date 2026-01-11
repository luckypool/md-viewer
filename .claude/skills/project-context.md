# プロジェクトコンテキスト

## アプリケーション概要

MD Viewer は Google Drive に保存された Markdown ファイルをブラウザで表示するための Web アプリケーションです。

### 主要機能

1. **Google Drive 連携**
   - Google Picker API でファイル選択 UI を表示
   - OAuth 2.0 認証でユーザーの Drive にアクセス
   - Drive API で Markdown ファイルの内容を取得

2. **Markdown レンダリング**
   - react-markdown でパース・表示
   - GitHub Flavored Markdown (GFM) サポート
   - シンタックスハイライト付きコードブロック

### 技術的な制約

- **ブラウザのみ**: サーバーサイドなし、フルクライアントサイド
- **API キー管理**: 環境変数 (VITE_*) で管理、ビルド時に埋め込み
- **スコープ制限**: `drive.readonly` のみ、ファイル読み取りのみ

## ディレクトリ構造と責務

```
src/
├── components/           # UI コンポーネント
│   ├── MarkdownViewer.tsx   # Markdown 表示
│   └── PickerButton.tsx     # ファイル選択ボタン
├── hooks/                # カスタムフック
│   └── useGooglePicker.ts   # Google Picker ロジック
├── types/                # 型定義
│   └── google.d.ts          # Google API 型定義
├── App.tsx               # メインアプリ
├── App.css               # アプリスタイル
├── main.tsx              # エントリポイント
└── index.css             # グローバルスタイル
```

## コンポーネント関係

```
App
├── PickerButton (useGooglePicker)
│   └── Google Picker UI (外部)
└── MarkdownViewer
    ├── ReactMarkdown
    └── SyntaxHighlighter
```

## 外部依存関係

### Google APIs

```typescript
// Google Picker API
gapi.load('picker', callback)
google.picker.PickerBuilder

// Google Drive API
gapi.client.drive.files.get({
  fileId: string,
  alt: 'media'
})

// OAuth 2.0
google.accounts.oauth2.initTokenClient
```

### npm パッケージ

| パッケージ | 用途 |
|-----------|------|
| react-markdown | Markdown → React 変換 |
| remark-gfm | GFM プラグイン |
| react-syntax-highlighter | コードハイライト |

## 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| VITE_GOOGLE_API_KEY | Google API キー | ✓ |
| VITE_GOOGLE_CLIENT_ID | OAuth Client ID | ✓ |
| VITE_GOOGLE_APP_ID | GCP プロジェクト番号 | - |

## セキュリティ考慮事項

1. **API キーの制限**
   - HTTP リファラーで制限
   - 使用可能な API を制限

2. **OAuth スコープ**
   - 最小権限の原則 (drive.readonly のみ)

3. **CORS**
   - Google API は CORS 対応済み

## 将来の拡張ポイント

- [ ] ファイル履歴の保存
- [ ] 複数ファイルのタブ表示
- [ ] オフラインキャッシュ
- [ ] カスタムテーマ
- [ ] PDF エクスポート
