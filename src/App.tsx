import { useState, useCallback, useEffect } from 'react';
import { PickerButton } from './components/PickerButton';
import { MarkdownViewer } from './components/MarkdownViewer';
import './App.css';

// サンプル Markdown（API キーが未設定の場合に表示）
const SAMPLE_MARKDOWN = `# Welcome to MD Viewer

This is a **Google Drive Markdown Viewer** app.

## Features

- 📁 Select Markdown files from Google Drive
- 👁️ Preview with syntax highlighting
- 📊 GitHub Flavored Markdown support
  - Tables
  - Task lists
  - Strikethrough

## Getting Started

1. Set up your Google Cloud Console project
2. Enable the **Google Picker API** and **Google Drive API**
3. Create an OAuth 2.0 Client ID
4. Create an API Key
5. Add credentials to your \`.env\` file:

\`\`\`bash
VITE_GOOGLE_API_KEY=your_api_key
VITE_GOOGLE_CLIENT_ID=your_client_id
\`\`\`

## Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Table Example

| Feature | Status |
|---------|--------|
| Markdown Preview | ✅ |
| Code Highlighting | ✅ |
| GFM Support | ✅ |
| Dark Mode | ✅ |

---

> **Note:** This sample is displayed when Google API credentials are not configured.
`;

function App() {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);

  // 環境変数チェック
  const hasCredentials = Boolean(
    import.meta.env.VITE_GOOGLE_API_KEY && 
    import.meta.env.VITE_GOOGLE_CLIENT_ID
  );

  useEffect(() => {
    // 認証情報がない場合、数秒後にサンプルを表示
    if (!hasCredentials) {
      const timer = setTimeout(() => setShowSample(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasCredentials]);

  const handleFileSelect = useCallback(
    (file: google.picker.PickerDocument | null, content: string | null) => {
      if (file && content) {
        setMarkdownContent(content);
        setFileName(file.name);
        setShowSample(false);
      }
    },
    []
  );

  const handleShowSample = () => {
    setMarkdownContent(SAMPLE_MARKDOWN);
    setFileName('sample.md');
    setShowSample(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="logo-icon">📄</span>
            MD Viewer
          </h1>
          <PickerButton onFileSelect={handleFileSelect} />
        </div>
      </header>

      <main className="app-main">
        {markdownContent ? (
          <MarkdownViewer content={markdownContent} fileName={fileName || undefined} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h2>No file selected</h2>
            <p>Select a Markdown file from Google Drive to preview it here.</p>
            
            {!hasCredentials && (
              <div className="credentials-warning">
                <p>⚠️ Google API credentials not configured.</p>
                <p className="hint">
                  Set <code>VITE_GOOGLE_API_KEY</code> and <code>VITE_GOOGLE_CLIENT_ID</code> in your <code>.env</code> file.
                </p>
              </div>
            )}
            
            {showSample && (
              <button className="sample-button" onClick={handleShowSample}>
                View Sample
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>MD Viewer • Google Drive Markdown Preview</p>
      </footer>
    </div>
  );
}

export default App;
