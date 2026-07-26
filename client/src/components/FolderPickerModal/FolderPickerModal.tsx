import React, { useEffect, useState, useMemo } from 'react';
import './FolderPickerModal.css';
import { getFolders } from '../../api/folder.service';

interface FolderNode {
  id: string;
  name: string;
  parentFolder: string | null;
  children: FolderNode[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetFolderId: string | null) => void;
  title?: string;
}

const FolderPickerModal: React.FC<Props> = ({ isOpen, onClose, onMove, title = 'Move to...' }) => {
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setSelectedFolderId(null);
      getFolders()
        .then((data) => {
          // map backend folders
          const nodes: Record<string, FolderNode> = {};
          data.forEach((f: any) => {
            nodes[f._id] = { id: f._id, name: f.name, parentFolder: f.parentFolder, children: [] };
          });
          
          const rootNodes: FolderNode[] = [];
          
          Object.values(nodes).forEach(node => {
            if (node.parentFolder && nodes[node.parentFolder]) {
              nodes[node.parentFolder].children.push(node);
            } else {
              rootNodes.push(node);
            }
          });
          
          setFolders(rootNodes);
        })
        .catch(err => {
          setError('Failed to load folders');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderTree = (nodes: FolderNode[], level = 0) => {
    return (
      <ul className="folder-tree__list">
        {nodes.map(node => {
          const isExpanded = expandedFolders.has(node.id);
          const isSelected = selectedFolderId === node.id;
          const hasChildren = node.children.length > 0;

          return (
            <li key={node.id} className="folder-tree__item">
              <div 
                className={`folder-tree__row ${isSelected ? 'folder-tree__row--selected' : ''}`}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={() => setSelectedFolderId(node.id)}
              >
                <div 
                  className="folder-tree__expander"
                  onClick={(e) => hasChildren ? toggleExpand(node.id, e) : undefined}
                >
                  {hasChildren ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : <span style={{ width: 16 }} />}
                </div>
                <svg className="folder-tree__icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" fill="currentColor" opacity="0.8" />
                </svg>
                <span className="folder-tree__name">{node.name}</span>
              </div>
              
              {isExpanded && hasChildren && (
                renderTree(node.children, level + 1)
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="folder-picker-modal">
      <div className="folder-picker-modal__backdrop" onClick={onClose} />
      <div className="folder-picker-modal__content">
        <div className="folder-picker-modal__header">
          <h3>{title}</h3>
          <button className="folder-picker-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <div className="folder-picker-modal__body">
          {loading ? (
            <div className="spinner" />
          ) : error ? (
            <p className="folder-picker-modal__error">{error}</p>
          ) : (
            <div className="folder-tree">
              <div 
                className={`folder-tree__row ${selectedFolderId === null ? 'folder-tree__row--selected' : ''}`}
                style={{ paddingLeft: '8px', marginBottom: '8px' }}
                onClick={() => setSelectedFolderId(null)}
              >
                 <svg className="folder-tree__icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="folder-tree__name font-medium">My files (Root)</span>
              </div>
              
              {renderTree(folders)}
              
              {folders.length === 0 && (
                <p className="folder-picker-modal__empty">No folders available.</p>
              )}
            </div>
          )}
        </div>
        
        <div className="folder-picker-modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => onMove(selectedFolderId)} disabled={loading}>
            Move here
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderPickerModal;
