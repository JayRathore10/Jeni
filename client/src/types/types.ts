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

export const mapBackendFileToItem = (backendFile: any): FileItem => {
  let kind: FileKind = 'other';
  const mime = backendFile.mimeType || '';
  const name = backendFile.name || '';

  if (mime.startsWith('image/')) kind = 'image';
  else if (mime.startsWith('video/')) kind = 'video';
  else if (mime.startsWith('audio/')) kind = 'audio';
  else if (name.endsWith('.pdf')) kind = 'pdf';
  else if (name.endsWith('.zip') || name.endsWith('.rar')) kind = 'archive';
  else if (name.match(/\.(xlsx|xls|csv)$/)) kind = 'sheet';
  else if (name.match(/\.(pptx|ppt)$/)) kind = 'slide';
  else if (name.match(/\.(docx|doc|txt)$/)) kind = 'doc';

  return {
    id: backendFile._id,
    name: backendFile.originalName || backendFile.name,
    kind,
    size: backendFile.size,
    owner: backendFile.owner, // This might be an object id, but in UI we just show it.
    modified: backendFile.updatedAt || backendFile.createdAt,
    starred: false, // Backend doesn't support starred yet
    shared: false, // Backend doesn't support shared prop natively yet
  };
};

export const mapBackendFolderToItem = (backendFolder: any): FileItem => {
  return {
    id: backendFolder._id,
    name: backendFolder.name,
    kind: 'folder',
    size: null,
    owner: backendFolder.owner,
    modified: backendFolder.updatedAt || backendFolder.createdAt,
    starred: false,
    shared: false,
  };
};