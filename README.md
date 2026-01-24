<div align="center">

# MD Viewer

Google Drive やローカルに保存された Markdown ファイルをプレビューする Web アプリです。

[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)](https://expo.dev/)
[![React Native Web](https://img.shields.io/badge/React%20Native%20Web-0.81-61DAFB?logo=react)](https://necolas.github.io/react-native-web/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## 機能

- 📁 Google Drive からファイルを検索・選択
- 💻 ローカルファイルのプレビュー対応
- 👁️ Markdown をリアルタイムプレビュー
- 🎨 シンタックスハイライト付きコードブロック
- 📊 GitHub Flavored Markdown (GFM) サポート
  - テーブル
  - タスクリスト
  - 打ち消し線
- 📈 Mermaid ダイアグラム対応
- 📄 PDF 出力機能
- 🕐 最近使ったファイルの履歴
- ⌨️ キーボードショートカット（`⌘K` / `Ctrl+K` で検索）
- 🌙 ダークモード / ライトモード切り替え
- 🌐 日本語 / 英語 切り替え

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. Google Cloud Console の設定

> **Note:** Google Drive 連携を使用しない場合は、この手順をスキップしてローカルファイルのみでご利用いただけます。

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 以下の API を有効化:
   - **Google Drive API**

### 3. OAuth 2.0 クライアント ID の作成

1. **APIs & Services** → **Credentials** に移動
2. **Create Credentials** → **OAuth client ID** を選択
3. **Application type**: Web application
4. **Authorized JavaScript origins** に追加:
   - `http://localhost:8081`（開発用）
   - 本番ドメイン（デプロイ後）
5. **Create** をクリックし、**Client ID** を控える

### 4. API キーの作成

1. **Create Credentials** → **API key** を選択
2. 作成された API キーを控える
3. **API キーを制限** することを推奨:
   - **API restrictions**: Google Drive API

### 5. OAuth 同意画面の設定

1. **APIs & Services** → **OAuth consent screen** に移動
2. **User Type**: External（または Internal、組織内のみの場合）
3. アプリ情報を入力
4. **Scopes**: `https://www.googleapis.com/auth/drive.readonly` を追加
5. テストユーザーを追加（External の場合）

### 6. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成（`.env.example` を参照）:

```bash
EXPO_PUBLIC_GOOGLE_API_KEY=your_api_key_here
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_web_client_id_here
```

### 7. 開発サーバーの起動

```bash
# Web 開発サーバー
npm start
# または
npm run web
```

## 使い方

### Google Drive から開く

1. 「Google でサインイン」ボタンをクリック
2. Google アカウントでログイン
3. 検索ボックスをクリック（または `⌘K` / `Ctrl+K`）
4. ファイル名を入力して検索
5. ファイルを選択するとプレビューが表示されます

### ローカルファイルを開く

1. 「ローカルファイルを開く」ボタンをクリック
2. Markdown ファイル (`.md`) を選択
3. プレビューが表示されます

### 最近使ったファイル

ログイン後、ホーム画面に最近開いたファイルの履歴が表示されます。
クリックするだけで素早くファイルを開くことができます。

### テーマ・言語の切り替え

ヘッダー右側のアイコンから切り替え可能です:
- 🌙/☀️ ダークモード / ライトモード
- EN/JA 英語 / 日本語

### PDF として出力

1. Markdown ファイルを開いた状態で、共有ボタンをクリック
2. PDF ファイルがダウンロードされます

## プロジェクト構造

```
md-viewer/
├── app/                      # Expo Router
│   ├── _layout.tsx           # ルートレイアウト
│   ├── index.tsx             # ホーム画面
│   ├── viewer.tsx            # Markdown 表示
│   ├── search.tsx            # Google Drive 検索
│   ├── about.tsx             # アプリについて
│   └── license.tsx           # ライセンス表示
├── src/
│   ├── components/
│   │   ├── ui/               # 共通 UI コンポーネント
│   │   └── markdown/         # Markdown レンダラー
│   ├── contexts/             # React Context
│   │   ├── ThemeContext      # テーマ管理
│   │   └── LanguageContext   # 言語管理
│   ├── hooks/                # カスタムフック
│   │   ├── useGoogleAuth     # Google OAuth (GIS)
│   │   ├── useFilePicker     # ファイル選択
│   │   ├── useTheme          # テーマフック
│   │   ├── useLanguage       # 言語フック
│   │   └── useShare          # PDF 出力・共有
│   ├── i18n/                 # 国際化
│   │   └── locales/          # 翻訳ファイル（en, ja）
│   ├── services/             # サービス層
│   │   ├── storage.ts        # localStorage ラッパー
│   │   ├── fileHistory.ts    # ファイル履歴
│   │   └── googleDrive.ts    # Drive API
│   ├── theme/                # テーマ定義
│   └── types/                # 型定義
├── assets/                   # 画像・フォント
├── app.json                  # Expo 設定
└── package.json
```

## 技術スタック

- **Expo SDK 54** + **React Native Web**
- **Expo Router 6** - ファイルベースルーティング
- **TypeScript 5.9**
- **react-markdown** - Markdown レンダリング
- **react-syntax-highlighter** - コードハイライト
- **mermaid** - ダイアグラム表示
- **html2pdf.js** - PDF 出力
- **Google Identity Services (GIS)** - OAuth 認証
- **Google Drive API** - ファイル検索・取得

## デプロイ

### Vercel

```bash
npm run build
```

`vercel.json` が設定済みです。

## ライセンス

[MIT License](./LICENSE)

Copyright (c) 2025 luckypool
