# /add-feature - 機能追加コマンド

新しいコンポーネントや機能を追加するためのテンプレートベースのコマンドです。

## 使用方法

```
/add-feature <種類> <名前>
```

種類:
- `component` - React コンポーネント
- `hook` - カスタムフック
- `type` - 型定義

## コンポーネントテンプレート

```
/add-feature component FileList
```

生成されるファイル:

```typescript
// src/components/FileList.tsx
interface FileListProps {
  // TODO: Props を定義
}

export const FileList = ({}: FileListProps) => {
  return (
    <div className="file-list">
      {/* TODO: 実装 */}
    </div>
  )
}
```

## フックテンプレート

```
/add-feature hook useFileHistory
```

生成されるファイル:

```typescript
// src/hooks/useFileHistory.ts
import { useState, useCallback } from 'react'

interface UseFileHistoryResult {
  // TODO: 戻り値の型を定義
}

export const useFileHistory = (): UseFileHistoryResult => {
  // TODO: 実装
  
  return {
    // TODO: 戻り値
  }
}
```

## 型定義テンプレート

```
/add-feature type FileMetadata
```

生成されるファイル:

```typescript
// src/types/file.ts
export interface FileMetadata {
  id: string
  name: string
  // TODO: 追加のフィールド
}
```

## ベストプラクティス

1. **命名規則に従う**
   - コンポーネント: PascalCase
   - フック: use + PascalCase
   - 型: PascalCase

2. **適切なディレクトリに配置**
   - components/ - UI コンポーネント
   - hooks/ - カスタムフック
   - types/ - 型定義

3. **型定義から始める**
   - Props や戻り値の型を先に定義
   - 実装時に型が導いてくれる

4. **インポートを整理**
   - 既存のインポートパターンに従う
   - 必要なものだけインポート
