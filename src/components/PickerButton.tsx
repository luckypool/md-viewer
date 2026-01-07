import { useGooglePicker } from '../hooks/useGooglePicker';

interface PickerButtonProps {
  onFileSelect?: (file: google.picker.PickerDocument | null, content: string | null) => void;
}

export function PickerButton({ onFileSelect }: PickerButtonProps) {
  const {
    isLoading,
    isApiLoaded,
    error,
    openPicker,
    selectedFile,
    fileContent,
    isLoadingContent,
  } = useGooglePicker();

  // ファイルが選択されたら親に通知
  if (selectedFile && fileContent && onFileSelect) {
    onFileSelect(selectedFile, fileContent);
  }

  const getButtonText = () => {
    if (!isApiLoaded) return 'Loading...';
    if (isLoading) return 'Opening...';
    if (isLoadingContent) return 'Loading file...';
    return 'Select from Drive';
  };

  return (
    <div className="picker-button-container">
      <button
        className="picker-button"
        onClick={openPicker}
        disabled={!isApiLoaded || isLoading || isLoadingContent}
      >
        <svg 
          className="drive-icon" 
          viewBox="0 0 87.3 78" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H1.5c0 1.55.4 3.1 1.2 4.5l3.9 9.35z" 
            fill="#0066da"
          />
          <path 
            d="M43.65 25l-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5l16.15-28z" 
            fill="#00ac47"
          />
          <path 
            d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.85L47.3 73.5l12.55 3.3z" 
            fill="#ea4335"
          />
          <path 
            d="M43.65 25L57.4 1.2c-1.35-.8-2.85-1.2-4.4-1.2H34.4c-1.55 0-3.05.45-4.4 1.2L43.65 25z" 
            fill="#00832d"
          />
          <path 
            d="M59.85 53H27.5l-13.75 23.8c1.35.8 2.85 1.2 4.4 1.2h50.4c1.55 0 3.05-.45 4.4-1.2L59.85 53z" 
            fill="#2684fc"
          />
          <path 
            d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.2 28h27.45c0-1.55-.4-3.1-1.2-4.5l-12.7-22z" 
            fill="#ffba00"
          />
        </svg>
        <span>{getButtonText()}</span>
      </button>

      {error && <p className="picker-error">{error}</p>}

      {selectedFile && (
        <div className="selected-file-info">
          <span className="file-name">{selectedFile.name}</span>
        </div>
      )}
    </div>
  );
}
