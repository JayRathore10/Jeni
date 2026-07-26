import React, { useEffect, useState } from 'react';
import './FilePreviewModal.css';
import type { FileItem } from '../../types/types';
import api from '../../api/axios';

interface Props {
  item: FileItem;
  onClose: () => void;
  onDownload: (item: FileItem) => void;
}

const FilePreviewModal: React.FC<Props> = ({ item, onClose, onDownload }) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [textData, setTextData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    let isMounted = true;

    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/file/${item.id}/download`, {
          responseType: item.kind === 'doc' ? 'text' : 'blob',
        });
        
        if (!isMounted) return;

        if (item.kind === 'doc') {
          if (typeof response.data === 'string') {
            setTextData(response.data);
          } else if (response.data instanceof Blob) {
            const text = await response.data.text();
            setTextData(text);
          }
        } else {
          url = window.URL.createObjectURL(new Blob([response.data]));
          setObjectUrl(url);
        }
      } catch (err: any) {
        if (isMounted) setError('Failed to load preview');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchContent();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      isMounted = false;
      document.removeEventListener('keydown', handleEsc);
      if (url) window.URL.revokeObjectURL(url);
    };
  }, [item]);

  const renderContent = () => {
    if (loading) {
      return <div className="spinner" />;
    }

    if (error) {
      return (
        <div className="file-preview__error">
          <p>{error}</p>
          <button onClick={() => onDownload(item)} className="file-preview__download-btn">
            Download File Instead
          </button>
        </div>
      );
    }

    if (item.kind === 'image' && objectUrl) {
      return <img src={objectUrl} alt={item.name} className="file-preview__image" />;
    }

    if (item.kind === 'video' && objectUrl) {
      return <video src={objectUrl} controls className="file-preview__video" />;
    }

    if (item.kind === 'pdf' && objectUrl) {
      return <iframe src={objectUrl} className="file-preview__iframe" title={item.name} />;
    }

    if (item.kind === 'doc' && textData !== null) {
      return (
        <pre className="file-preview__text">
          {textData}
        </pre>
      );
    }

    // Fallback
    return (
      <div className="file-preview__fallback">
        <p>No preview available for this file type.</p>
        <button onClick={() => onDownload(item)} className="file-preview__download-btn">
          Download File
        </button>
      </div>
    );
  };

  return (
    <div className="file-preview-modal">
      <div className="file-preview-modal__backdrop" onClick={onClose} />
      <div className="file-preview-modal__content">
        <div className="file-preview-modal__header">
          <h3 className="file-preview-modal__title" title={item.name}>{item.name}</h3>
          <div className="file-preview-modal__actions">
            <button className="file-preview-modal__action-btn" onClick={() => onDownload(item)} title="Download">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4M7.5 11.5L12 16l4.5-4.5M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="file-preview-modal__action-btn" onClick={onClose} title="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="file-preview-modal__body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
