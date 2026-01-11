# TypeScript ルール

## 型安全性

### Strict モード

このプロジェクトは TypeScript の strict モードを使用しています。

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### null/undefined の扱い

```typescript
// ✅ Good: Optional chaining
const name = user?.profile?.name

// ✅ Good: Nullish coalescing
const displayName = name ?? 'Anonymous'

// ✅ Good: 型ガード
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// ❌ Bad: Non-null assertion の乱用
const name = user!.profile!.name
```

### ジェネリクス

```typescript
// ✅ Good: 適切なジェネリクス
function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json())
}

// 使用例
const data = await fetchData<UserData>('/api/user')
```

## React + TypeScript

### Props の型定義

```typescript
// ✅ Good: interface で Props を定義
interface MarkdownViewerProps {
  content: string
  theme?: 'light' | 'dark'
  onLoad?: () => void
}

// children を含む場合
interface ContainerProps {
  children: React.ReactNode
  className?: string
}
```

### イベントハンドラ

```typescript
// ✅ Good: 適切なイベント型
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value)
}
```

### Hooks の型

```typescript
// useState
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)

// useRef
const inputRef = useRef<HTMLInputElement>(null)
const timerRef = useRef<NodeJS.Timeout | null>(null)

// useReducer
interface State {
  count: number
  error: string | null
}

type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'error'; payload: string }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'decrement':
      return { ...state, count: state.count - 1 }
    case 'error':
      return { ...state, error: action.payload }
  }
}
```

## 非同期処理

### async/await

```typescript
// ✅ Good: async/await を使用
async function fetchMarkdown(fileId: string): Promise<string> {
  const response = await fetch(`/api/files/${fileId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }
  return response.text()
}

// ✅ Good: Promise.all で並列実行
const [user, posts] = await Promise.all([
  fetchUser(userId),
  fetchPosts(userId)
])
```

### エラーハンドリング

```typescript
// ✅ Good: Result パターン
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

async function safelyFetch<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { success: false, error: new Error(`HTTP ${response.status}`) }
    }
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}
```

## 型のエクスポート

```typescript
// types/index.ts
export interface User {
  id: string
  name: string
  email: string
}

export interface MarkdownFile {
  id: string
  name: string
  content: string
  mimeType: string
}

// type のみのエクスポート
export type { GooglePickerResult } from './google'
```

## アンチパターン

### 避けるべきパターン

```typescript
// ❌ Bad: any の使用
const data: any = fetchData()

// ❌ Bad: as による強制キャスト
const user = data as User // 実際の型が不明

// ❌ Bad: Object, Function 型
const obj: Object = {}
const fn: Function = () => {}

// ✅ Good: 具体的な型を使用
const obj: Record<string, unknown> = {}
const fn: () => void = () => {}
```
