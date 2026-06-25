export type FileKind =
  | 'folder'
  | 'doc'
  | 'sheet'
  | 'slide'
  | 'pdf'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'other';

export interface FileItem {
  id: string;
  name: string;
  kind: FileKind;
  size: number | null; // bytes, null for folders
  owner: string;
  modified: string; // ISO date
  starred: boolean;
  shared: boolean;
  color?: string; // folder color tag
  thumbnail?: string; // optional preview color/gradient key
}

export type SortKey = 'name' | 'modified' | 'size';
export type SortDir = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

export interface BreadcrumbItem {
  id: string;
  label: string;
}