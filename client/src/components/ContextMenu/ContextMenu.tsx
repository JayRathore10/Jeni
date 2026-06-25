import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';
import type { FileItem } from '../../types/types';

interface Props {
  item: FileItem;
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string, item: FileItem) => void;
}

const icon = (d: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ContextMenu: React.FC<Props> = ({ item, x, y, onClose, onAction }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', escHandler);
    };
  }, [onClose]);

  // Keep menu within viewport
  const [pos, setPos] = React.useState({ x, y });
  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const adjX = x + rect.width > window.innerWidth ? window.innerWidth - rect.width - 8 : x;
      const adjY = y + rect.height > window.innerHeight ? window.innerHeight - rect.height - 8 : y;
      setPos({ x: adjX, y: adjY });
    }
  }, [x, y]);

  const items = [
    { key: 'open', label: item.kind === 'folder' ? 'Open' : 'Preview', icon: icon('M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z') },
    { key: 'rename', label: 'Rename', icon: icon('M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z') },
    { key: 'share', label: 'Share', icon: icon('M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 19c0-3 2.9-5.5 6.5-5.5s6.5 2.5 6.5 5.5M14 13.8c2.6.3 4.5 2.1 4.5 4.2') },
    { key: 'download', label: 'Download', icon: icon('M12 16V4M7.5 11.5L12 16l4.5-4.5M4 20h16'), hideForFolder: true },
    { key: 'star', label: item.starred ? 'Remove from starred' : 'Add to starred', icon: icon('M12 2.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z') },
    { key: 'copy', label: 'Make a copy', icon: icon('M8 8V4.5c0-.83.67-1.5 1.5-1.5h9c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5H15M5.5 8h9c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5v-9c0-.83.67-1.5 1.5-1.5z') },
    { divider: true },
    { key: 'delete', label: 'Move to trash', icon: icon('M4 7h16M9 7V4.5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1V7M6 7l1 12.5c.05.8.7 1.5 1.5 1.5h7c.8 0 1.45-.7 1.5-1.5L18 7'), danger: true },
  ];

  return (
    <div
      className="context-menu"
      ref={ref}
      style={{ left: pos.x, top: pos.y }}
      role="menu"
    >
      <div className="context-menu__header">
        <span className="context-menu__header-name">{item.name}</span>
      </div>
      {items.map((it, i) =>
        'divider' in it ? (
          <div key={i} className="context-menu__divider" />
        ) : it.hideForFolder && item.kind === 'folder' ? null : (
          <button
            key={it.key}
            className={`context-menu__item ${it.danger ? 'context-menu__item--danger' : ''}`}
            onClick={() => { onAction(it.key, item); onClose(); }}
          >
            <span className="context-menu__icon">{it.icon}</span>
            {it.label}
          </button>
        )
      )}
    </div>
  );
};

export default ContextMenu;