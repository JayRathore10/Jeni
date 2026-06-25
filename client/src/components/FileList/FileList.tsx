import React from 'react';
import './FileList.css';
import type { FileItem } from '../../types/types';
import FileTypeIcon from '../FileTypeicon/FileTypeicon';

interface Props {
  items: FileItem[];
  selectedIds: Set<string>;
  onSelect: (id: string, additive: boolean) => void;
  onOpen: (item: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, item: FileItem) => void;
  onToggleStar: (id: string) => void;
}

const formatSize = (bytes: number | null) => {
  if (bytes === null) return '—';
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(0)} KB`;
  if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date('2026-06-24T12:00:00Z');
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const FileList: React.FC<Props> = ({ items, selectedIds, onSelect, onOpen, onContextMenu, onToggleStar }) => {
  if (items.length === 0) {
    return (
      <div className="file-list-empty">
        <p className="file-list-empty__title">Nothing here yet</p>
        <p className="file-list-empty__sub">Drag files in or use the New button to get started.</p>
      </div>
    );
  }

  return (
    <div className="file-list">
      <div className="file-list__header">
        <span className="file-list__col file-list__col--name">Name</span>
        <span className="file-list__col file-list__col--owner">Owner</span>
        <span className="file-list__col file-list__col--modified">Last modified</span>
        <span className="file-list__col file-list__col--size">Size</span>
        <span className="file-list__col file-list__col--actions" />
      </div>

      <div className="file-list__body">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`file-row ${selectedIds.has(item.id) ? 'file-row--selected' : ''}`}
            style={{ '--stagger': `${Math.min(i, 14) * 0.025}s` } as React.CSSProperties}
            onClick={(e) => onSelect(item.id, e.metaKey || e.ctrlKey)}
            onDoubleClick={() => onOpen(item)}
            onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, item); }}
          >
            <span className="file-list__col file-list__col--name file-row__name-cell">
              <FileTypeIcon kind={item.kind} color={item.color} size={20} />
              <span className="file-row__name" title={item.name}>{item.name}</span>
              {item.shared && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="file-row__shared-icon">
                  <path d="M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 19c0-3 2.9-5.5 6.5-5.5s6.5 2.5 6.5 5.5M14 13.8c2.6.3 4.5 2.1 4.5 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </span>
            <span className="file-list__col file-list__col--owner">{item.owner}</span>
            <span className="file-list__col file-list__col--modified">{formatDate(item.modified)}</span>
            <span className="file-list__col file-list__col--size">{item.kind === 'folder' ? '—' : formatSize(item.size)}</span>
            <span className="file-list__col file-list__col--actions">
              <button
                className={`file-row__star ${item.starred ? 'file-row__star--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleStar(item.id); }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill={item.starred ? 'currentColor' : 'none'}>
                  <path d="M12 2.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                className="file-row__more"
                onClick={(e) => { e.stopPropagation(); onContextMenu(e, item); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" />
                </svg>
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;