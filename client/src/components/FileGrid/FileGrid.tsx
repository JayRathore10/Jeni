import React from 'react';
import './FileGrid.css';
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

const FileGrid: React.FC<Props> = ({ items, selectedIds, onSelect, onOpen, onContextMenu, onToggleStar }) => {
  if (items.length === 0) {
    return (
      <div className="file-grid-empty">
        <div className="file-grid-empty__icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path d="M3 7.5c0-.83.67-1.5 1.5-1.5h4.4c.4 0 .77.16 1.05.43l1.1 1.07h8.45c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-10.5z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="file-grid-empty__title">Nothing here yet</p>
        <p className="file-grid-empty__sub">Drag files in or use the New button to get started.</p>
      </div>
    );
  }

  return (
    <div className="file-grid">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`file-card ${selectedIds.has(item.id) ? 'file-card--selected' : ''}`}
          style={{ '--stagger': `${Math.min(i, 12) * 0.035}s` } as React.CSSProperties}
          onClick={(e) => onSelect(item.id, e.metaKey || e.ctrlKey)}
          onDoubleClick={() => onOpen(item)}
          onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, item); }}
        >
          <button
            className={`file-card__star ${item.starred ? 'file-card__star--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleStar(item.id); }}
            title={item.starred ? 'Remove from starred' : 'Add to starred'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={item.starred ? 'currentColor' : 'none'}>
              <path d="M12 2.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </button>

          {item.shared && (
            <div className="file-card__shared-badge" title="Shared">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 19c0-3 2.9-5.5 6.5-5.5s6.5 2.5 6.5 5.5M14 13.8c2.6.3 4.5 2.1 4.5 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}

          <div className="file-card__preview">
            <FileTypeIcon kind={item.kind} color={item.color} size={item.kind === 'folder' ? 44 : 38} />
          </div>

          <div className="file-card__info">
            <span className="file-card__name" title={item.name}>{item.name}</span>
            <span className="file-card__meta">{item.kind === 'folder' ? `Folder · ${item.owner}` : formatSize(item.size)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;