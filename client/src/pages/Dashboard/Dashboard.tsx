import React, { useState, useMemo, useCallback, useRef } from 'react';
import './Dashboard.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar';
import FileToolbar from '../../components/FileToolbar/FileToolbar';
import FileGrid from '../../components/FileGrid/FileGrid';
import FileList from '../../components/FileList/FileList';
import ContextMenu from '../../components/ContextMenu/ContextMenu';
import UploadDropOverlay from '../../components/UploadDropOverlay/UploadDropOverlay';
import { mockFiles } from '../../mockData';
import type { FileItem, SortDir, SortKey, ViewMode, BreadcrumbItem } from '../../types/types';

interface ContextMenuState {
  item: FileItem;
  x: number;
  y: number;
}

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [activeNav, setActiveNav] = useState('my-files');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: 'root', label: 'My files' }]);
  const dragCounter = useRef(0);

  // --- Filtering & sorting ---
  const visibleFiles = useMemo(() => {
    let result = [...files];

    if (activeNav === 'starred') result = result.filter((f) => f.starred);
    if (activeNav === 'shared') result = result.filter((f) => f.shared);
    if (activeNav === 'trash') result = [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      // Folders first, always
      if (a.kind === 'folder' && b.kind !== 'folder') return -1;
      if (a.kind !== 'folder' && b.kind === 'folder') return 1;

      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      if (sortKey === 'modified') cmp = new Date(a.modified).getTime() - new Date(b.modified).getTime();
      if (sortKey === 'size') cmp = (a.size ?? 0) - (b.size ?? 0);

      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [files, activeNav, searchQuery, sortKey, sortDir]);

  // --- Handlers ---
  const handleSelect = useCallback((id: string, additive: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(additive ? prev : []);
      if (next.has(id) && additive) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleOpen = useCallback((item: FileItem) => {
    if (item.kind === 'folder') {
      setBreadcrumbs((prev) => [...prev, { id: item.id, label: item.name }]);
    }
    // For files: would open a preview modal in a full implementation
  }, []);

  const handleBreadcrumbClick = useCallback((id: string) => {
    setBreadcrumbs((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      return idx === -1 ? prev : prev.slice(0, idx + 1);
    });
  }, []);

  const handleToggleStar = useCallback((id: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f)));
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent, item: FileItem) => {
    setContextMenu({ item, x: e.clientX, y: e.clientY });
    setSelectedIds(new Set([item.id]));
  }, []);

  const handleContextAction = useCallback((action: string, item: FileItem) => {
    if (action === 'star') {
      handleToggleStar(item.id);
    } else if (action === 'delete') {
      setFiles((prev) => prev.filter((f) => f.id !== item.id));
    } else if (action === 'open') {
      handleOpen(item);
    }
    // rename / share / download / copy would hook into real backend logic here
  }, [handleToggleStar, handleOpen]);

  const addUploadedFiles = useCallback((fileList: FileList) => {
    const newItems: FileItem[] = Array.from(fileList).map((file, i) => ({
      id: `upload-${Date.now()}-${i}`,
      name: file.name,
      kind: file.type.startsWith('image/') ? 'image'
        : file.type.startsWith('video/') ? 'video'
        : file.type.startsWith('audio/') ? 'audio'
        : file.name.endsWith('.pdf') ? 'pdf'
        : file.name.endsWith('.zip') ? 'archive'
        : file.name.match(/\.(xlsx|xls|csv)$/) ? 'sheet'
        : file.name.match(/\.(pptx|ppt)$/) ? 'slide'
        : file.name.match(/\.(docx|doc|txt)$/) ? 'doc'
        : 'other',
      size: file.size,
      owner: 'You',
      modified: new Date().toISOString(),
      starred: false,
      shared: false,
    }));
    setFiles((prev) => [...newItems, ...prev]);
  }, []);

  const handleCreateFolder = useCallback(() => {
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: 'Untitled folder',
      kind: 'folder',
      size: null,
      owner: 'You',
      modified: new Date().toISOString(),
      starred: false,
      shared: false,
      color: '#FF8A9D',
    };
    setFiles((prev) => [newFolder, ...prev]);
  }, []);

  // --- Drag and drop (page-level) ---
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addUploadedFiles(e.dataTransfer.files);
    }
  }, [addUploadedFiles]);

  return (
    <div
      className="dashboard"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onCreateFolder={handleCreateFolder}
        onUploadFiles={addUploadedFiles}
        collapsed={sidebarCollapsed}
      />

      <div className="dashboard__main">
        <DashboardTopbar
          onSearch={setSearchQuery}
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
        />

        <div className="dashboard__content" onClick={() => setSelectedIds(new Set())}>
          <FileToolbar
            breadcrumbs={breadcrumbs}
            onBreadcrumbClick={handleBreadcrumbClick}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortKey={sortKey}
            sortDir={sortDir}
            onSortChange={(key, dir) => { setSortKey(key); setSortDir(dir); }}
            itemCount={visibleFiles.length}
          />

          {viewMode === 'grid' ? (
            <FileGrid
              items={visibleFiles}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onContextMenu={handleContextMenu}
              onToggleStar={handleToggleStar}
            />
          ) : (
            <FileList
              items={visibleFiles}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onContextMenu={handleContextMenu}
              onToggleStar={handleToggleStar}
            />
          )}
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          item={contextMenu.item}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}

      <UploadDropOverlay visible={isDragging} />
    </div>
  );
};

export default Dashboard;