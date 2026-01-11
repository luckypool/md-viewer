# /refactor - リファクタリングコマンド

コードを改善するためのワークフローコマンドです。

## 使用方法

```
/refactor <対象> [目的]
```

例:
- `/refactor useGooglePicker エラーハンドリング改善`
- `/refactor components 共通化`

## ワークフロー

1. **現状分析**
   - 対象コードを読む
   - 問題点を特定
   - 改善の方向性を決める

2. **影響範囲の確認**
   - 対象コードを使用している箇所を特定
   - 変更による影響を評価

3. **リファクタリング計画**
   - 段階的な変更手順を決める
   - 各ステップでビルドが通ることを確認

4. **実行**
   - 小さな単位で変更
   - 各ステップで動作確認

5. **検証**
   - ビルド確認
   - 動作確認
   - コードレビュー

## リファクタリングパターン

### コンポーネント分割

```typescript
// Before: 1つの大きなコンポーネント
const App = () => {
  // 100+ lines
}

// After: 責務ごとに分割
const App = () => (
  <>
    <Header />
    <MainContent />
    <Footer />
  </>
)
```

### カスタムフック抽出

```typescript
// Before: コンポーネント内にロジック
const Component = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // fetch logic
  }, [])
}

// After: フックに抽出
const useData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  // ...
  return { data, loading }
}

const Component = () => {
  const { data, loading } = useData()
}
```

### 型の改善

```typescript
// Before: 緩い型
interface Props {
  data: any
  options: object
}

// After: 厳密な型
interface Props {
  data: MarkdownFile
  options: ViewerOptions
}
```

### 条件分岐の整理

```typescript
// Before: ネストした条件分岐
if (loading) {
  return <Spinner />
} else {
  if (error) {
    return <Error />
  } else {
    return <Content />
  }
}

// After: 早期リターン
if (loading) return <Spinner />
if (error) return <Error />
return <Content />
```

## 注意事項

- 動作を変えずに構造を改善する
- 一度に大きく変えすぎない
- 各ステップでビルドが通ることを確認
- リファクタリングと機能追加を同時にしない
