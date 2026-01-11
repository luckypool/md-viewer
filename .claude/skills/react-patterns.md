# React パターン

## コンポーネント設計

### 単一責任の原則

各コンポーネントは1つの責務のみを持つ。

```typescript
// ✅ Good: 責務が明確
// MarkdownViewer.tsx - Markdown の表示のみ
// PickerButton.tsx - ファイル選択ボタンのみ

// ❌ Bad: 複数の責務
// AllInOneComponent.tsx - 表示、選択、状態管理を全て含む
```

### Presentational vs Container

```typescript
// Presentational Component: 表示のみ
interface MarkdownContentProps {
  content: string
  className?: string
}

export const MarkdownContent = ({ content, className }: MarkdownContentProps) => (
  <div className={className}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  </div>
)

// Container Component: ロジック + 表示
export const MarkdownViewer = () => {
  const { content, loading, error } = useMarkdownFile()
  
  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  return <MarkdownContent content={content} />
}
```

## カスタムフック

### 状態とロジックの分離

```typescript
// hooks/useGooglePicker.ts
export const useGooglePicker = () => {
  const [file, setFile] = useState<GoogleFile | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const openPicker = useCallback(async () => {
    try {
      const result = await showGooglePicker()
      setFile(result)
    } catch (err) {
      setError(err as Error)
    }
  }, [])

  const reset = useCallback(() => {
    setFile(null)
    setError(null)
  }, [])

  return { file, error, openPicker, reset }
}
```

### フックの合成

```typescript
// 複数のフックを組み合わせる
export const useMarkdownFromDrive = () => {
  const { file, openPicker } = useGooglePicker()
  const { content, loading, error } = useFileContent(file?.id)

  return {
    content,
    loading,
    error,
    openPicker,
    hasFile: file !== null
  }
}
```

## 状態管理

### ローカル状態 vs グローバル状態

```typescript
// ローカル状態: コンポーネント内で完結
const [isOpen, setIsOpen] = useState(false)

// 複数コンポーネントで共有が必要な場合のみ Context を使用
const ThemeContext = createContext<ThemeContextValue | null>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const value = useMemo(() => ({ theme, setTheme }), [theme])
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

## エラーバウンダリ

```typescript
// ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

## パフォーマンス最適化

### React.memo

```typescript
// 再レンダリングを避けたい純粋なコンポーネント
export const MarkdownContent = React.memo(({ content }: { content: string }) => (
  <ReactMarkdown>{content}</ReactMarkdown>
))
```

### useMemo / useCallback

```typescript
// 重い計算結果のメモ化
const syntaxHighlightedCode = useMemo(() => {
  return highlightCode(code, language)
}, [code, language])

// 子コンポーネントへのコールバック
const handleFileSelect = useCallback((file: GoogleFile) => {
  setSelectedFile(file)
  onFileSelect?.(file)
}, [onFileSelect])
```

### 遅延ロード

```typescript
// 重いコンポーネントの遅延ロード
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'))

export const CodeBlock = ({ code, language }: CodeBlockProps) => (
  <Suspense fallback={<pre>{code}</pre>}>
    <SyntaxHighlighter language={language}>
      {code}
    </SyntaxHighlighter>
  </Suspense>
)
```

## テスト

### コンポーネントテスト

```typescript
// MarkdownViewer.test.tsx
import { render, screen } from '@testing-library/react'
import { MarkdownViewer } from './MarkdownViewer'

describe('MarkdownViewer', () => {
  it('renders markdown content', () => {
    render(<MarkdownViewer content="# Hello" />)
    expect(screen.getByRole('heading', { name: 'Hello' })).toBeInTheDocument()
  })

  it('renders code blocks with syntax highlighting', () => {
    render(<MarkdownViewer content="```js\nconst x = 1\n```" />)
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })
})
```

### フックテスト

```typescript
// useGooglePicker.test.ts
import { renderHook, act } from '@testing-library/react'
import { useGooglePicker } from './useGooglePicker'

describe('useGooglePicker', () => {
  it('opens picker and returns file', async () => {
    const { result } = renderHook(() => useGooglePicker())
    
    await act(async () => {
      await result.current.openPicker()
    })
    
    expect(result.current.file).not.toBeNull()
  })
})
```
