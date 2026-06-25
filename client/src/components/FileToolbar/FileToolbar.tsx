import React, { useState, useRef, useEffect } from 'react';
import './FileToolbar.css';
import type { BreadcrumbItem, SortDir, SortKey, ViewMode } from "../../types/types";

interface Props {
  breadcrumbs: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (key: SortKey, dir: SortDir) => void;
  itemCount: number;
}

const sortLabels: Record<SortKey, string> = {
  name: 'Name',
  modified: 'Last modified',
  size: 'File size',
};

const FileToolbar: React.FC<Props> = ({
  breadcrumbs, onBreadcrumbClick, viewMode, onViewModeChange,
  sortKey, sortDir, onSortChange, itemCount,
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="file-toolbar">
      <div className="file-toolbar__top">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={b.id}>
              <button
                className={`breadcrumbs__item ${i === breadcrumbs.length - 1 ? 'breadcrumbs__item--current' : ''}`}
                onClick={() => onBreadcrumbClick(b.id)}
                disabled={i === breadcrumbs.length - 1}
              >
                {b.label}
              </button>
              {i < breadcrumbs.length - 1 && <span className="breadcrumbs__sep">/</span>}
            </React.Fragment>
          ))}
        </nav>

        <div className="file-toolbar__controls">
          <span className="file-toolbar__count">{itemCount} items</span>

          <div className="sort-dropdown" ref={sortRef}>
            <button className="file-toolbar__btn" onClick={() => setSortOpen(!sortOpen)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 4v16M4 7l3-3 3 3M17 20V4M14 17l3 3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {sortLabels[sortKey]}
            </button>
            {sortOpen && (
              <div className="sort-dropdown__menu">
                {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                  <button
                    key={key}
                    className={`sort-dropdown__item ${sortKey === key ? 'sort-dropdown__item--active' : ''}`}
                    onClick={() => { onSortChange(key, sortKey === key && sortDir === 'asc' ? 'desc' : 'asc'); setSortOpen(false); }}
                  >
                    {sortLabels[key]}
                    {sortKey === key && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: sortDir === 'desc' ? 'rotate(180deg)' : 'none' }}>
                        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="view-toggle">
            <button
              className={`view-toggle__btn ${viewMode === 'grid' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" />
                <rect x="13" y="3" width="8" height="8" rx="1.5" fill="currentColor" />
                <rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor" />
                <rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor" />
              </svg>
            </button>
            <button
              className={`view-toggle__btn ${viewMode === 'list' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => onViewModeChange('list')}
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4.5" width="18" height="3" rx="1" fill="currentColor" />
                <rect x="3" y="10.5" width="18" height="3" rx="1" fill="currentColor" />
                <rect x="3" y="16.5" width="18" height="3" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileToolbar;