<div align="center">

# MD Viewer

Google Drive やローカルに保存された Markdown ファイルをプレビューするアプリです。

[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)

**Web** | **iOS** | **Android**

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
- 📈 Mermaid ダイアグラム対応（Web）
- 📄 PDF 出力・共有機能
- 🕐 最近使ったファイルの履歴
- ⌨️ キーボードショートカット（`⌘K` / `Ctrl+K` で検索、Web のみ）

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

#### Web 用

1. **APIs & Services** → **Credentials** に移動
2. **Create Credentials** → **OAuth client ID** を選択
3. **Application type**: Web application
4. **Authorized JavaScript origins** に追加:
   - `http://localhost:8081`（開発用）
   - 本番ドメイン（デプロイ後）
5. **Create** をクリックし、**Client ID** を控える

#### iOS / Android 用（オプション）

1. **Create Credentials** → **OAuth client ID** を選択
2. **Application type**: iOS または Android
3. Bundle ID / Package name を入力
4. **Create** をクリックし、**Client ID** を控える

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
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id_here      # iOS 用（オプション）
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id  # Android 用（オプション）
```

### 7. 開発サーバーの起動

```bash
# 全プラットフォーム
npm start

# Web のみ
npm run web

# iOS のみ
npm run ios

# Android のみ
npm run android
```

## 使い方

### Google Drive から開く

1. 「Google でログイン」ボタンをタップ
2. Google アカウントでログイン
3. 検索ボックスをタップ（Web: `⌘K` / `Ctrl+K`）
4. ファイル名を入力して検索
5. ファイルを選択するとプレビューが表示されます

### ローカルファイルを開く

1. 「ローカルファイルを開く」ボタンをタップ
2. Markdown ファイル (`.md`) を選択
3. プレビューが表示されます

### 最近使ったファイル

ログイン後、ホーム画面に最近開いたファイルの履歴が表示されます。
タップするだけで素早くファイルを開くことができます。

### PDF として出力・共有

1. Markdown ファイルを開いた状態で、共有ボタンをタップ
2. iOS / Android では共有シートが表示されます
3. Web では PDF ファイルがダウンロードされます

## プロジェクト構造

```
md-viewer/
├── app/                      # Expo Router
│   ├── _layout.tsx           # ルートレイアウト
│   ├── index.tsx             # ホーム画面
│   ├── viewer.tsx            # Markdown 表示
│   └── search.tsx            # Google Drive 検索
├── src/
│   ├── components/
│   │   ├── ui/               # 共通 UI コンポーネント
│   │   └── markdown/         # Markdown レンダラー（プラットフォーム別）
│   ├── hooks/                # カスタムフック（プラットフォーム別）
│   │   ├── useGoogleAuth     # Google OAuth
│   │   ├── useFilePicker     # ファイル選択
│   │   └── useShare          # PDF 出力・共有
│   ├── services/             # サービス層
│   │   ├── storage.ts        # ストレージ抽象化
│   │   ├── fileHistory.ts    # ファイル履歴
│   │   └── googleDrive.ts    # Drive API
│   ├── theme/                # テーマ定義
│   └── types/                # 型定義
├── assets/                   # 画像・フォント
├── app.json                  # Expo 設定
└── package.json
```

## プラットフォーム別実装

ファイル拡張子でプラットフォームを自動分岐:

- `*.web.ts` / `*.web.tsx` - Web 専用
- `*.native.ts` / `*.native.tsx` - iOS / Android 専用
- `*.ts` / `*.tsx` - 共通エントリポイント

## 技術スタック

- **Expo SDK 54** + **React Native 0.81**
- **Expo Router 6** - ファイルベースルーティング
- **TypeScript 5.9**
- **react-markdown** / **react-native-markdown-display** - Markdown レンダリング
- **expo-auth-session** - Native OAuth
- **expo-document-picker** - ファイル選択
- **expo-print** / **expo-sharing** - PDF 出力・共有
- **Google Drive API** - ファイル検索・取得

## デプロイ

### Web（Vercel）

```bash
npx expo export -p web
```

`vercel.json` が設定済みです。

### iOS / Android

```bash
npx eas build
```

## ライセンス

MIT
