interface SearchResultsProps {
  results: DriveFile[];
  query: string;
  onFileClick: (file: DriveFile) => void;
}

export function SearchResults({ results, query, onFileClick }: SearchResultsProps) {
  // 日時をフォーマット
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // ファイルサイズをフォーマット
  const formatSize = (sizeString?: string) => {
    if (!sizeString) return '';
    const size = parseInt(sizeString, 10);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!query) {
    return (
      <div className="search-empty">
        <div className="search-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <p>ファイル名で検索してください</p>
        <span className="search-hint">例: readme, notes, docs</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-empty">
        <div className="search-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 9l6 6m0-6l-6 6" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <p>「{query}」に一致するファイルがありません</p>
        <span className="search-hint">.md または .markdown ファイルのみ検索されます</span>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results-header">
        <span>{results.length} 件の結果</span>
      </div>
      <ul className="search-results-list">
        {results.map((file) => (
          <li key={file.id}>
            <button
              className="search-result-item"
              onClick={() => onFileClick(file)}
            >
              <div className="search-result-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
              </div>
              <div className="search-result-content">
                <span className="search-result-name">{file.name}</span>
                <div className="search-result-meta">
                  {file.modifiedTime && (
                    <span className="search-result-date">
                      {formatDate(file.modifiedTime)}
                    </span>
                  )}
                  {file.size && (
                    <span className="search-result-size">
                      {formatSize(file.size)}
                    </span>
                  )}
                  {file.owners?.[0]?.displayName && (
                    <span className="search-result-owner">
                      {file.owners[0].displayName}
                    </span>
                  )}
                </div>
              </div>
              <div className="search-result-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
