# MD Viewer

Google Drive に保存された Markdown ファイルをプレビューする Web アプリです。

## 機能

- 📁 Google Drive からファイルを選択
- 👁️ Markdown をリアルタイムプレビュー
- 🎨 シンタックスハイライト付きコードブロック
- 📊 GitHub Flavored Markdown (GFM) サポート
  - テーブル
  - タスクリスト
  - 打ち消し線

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. Google Cloud Console の設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 以下の API を有効化:
   - **Google Picker API**
   - **Google Drive API**

### 3. OAuth 2.0 クライアント ID の作成

1. **APIs & Services** → **Credentials** に移動
2. **Create Credentials** → **OAuth client ID** を選択
3. **Application type**: Web application
4. **Authorized JavaScript origins** に追加:
   - `http://localhost:5173`（開発用）
   - 本番ドメイン（デプロイ後）
5. **Create** をクリックし、**Client ID** を控える

### 4. API キーの作成

1. **Create Credentials** → **API key** を選択
2. 作成された API キーを控える
3. **API キーを制限** することを推奨:
   - **Application restrictions**: HTTP referrers
   - `http://localhost:5173/*` と本番ドメインを追加
   - **API restrictions**: Google Drive API, Google Picker API

### 5. OAuth 同意画面の設定

1. **APIs & Services** → **OAuth consent screen** に移動
2. **User Type**: External（または Internal、組織内のみの場合）
3. アプリ情報を入力
4. **Scopes**: `https://www.googleapis.com/auth/drive.readonly` を追加
5. テストユーザーを追加（External の場合）

### 6. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成:

```bash
VITE_GOOGLE_API_KEY=your_api_key_here
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_APP_ID=your_project_number (optional)
```

### 7. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:5173 でアプリにアクセスできます。

## 使い方

1. 「Select from Drive」ボタンをクリック
2. Google アカウントでログイン（初回のみ）
3. Markdown ファイル (`.md`) を選択
4. プレビューが表示されます

## ビルド

```bash
npm run build
```

`dist/` フォルダに本番用ファイルが生成されます。

## 技術スタック

- **React 19** + **TypeScript**
- **Vite** - ビルドツール
- **react-markdown** - Markdown レンダリング
- **remark-gfm** - GFM サポート
- **react-syntax-highlighter** - コードハイライト
- **Google Picker API** - ファイル選択 UI
- **Google Drive API** - ファイル取得

## ライセンス

MIT
