import React from 'react';
import type { FileKind } from '../../types/types';

interface Props {
  kind: FileKind;
  color?: string;
  size?: number;
}

const palette: Record<FileKind, string> = {
  folder: '#FF8A9D',
  doc: '#3B82F6',
  sheet: '#22C55E',
  slide: '#F59E0B',
  pdf: '#EF4444',
  image: '#8B5CF6',
  video: '#EC4899',
  audio: '#06B6D4',
  archive: '#78716C',
  other: '#9CA3AF',
};

const FileTypeIcon: React.FC<Props> = ({ kind, color, size = 20 }) => {
  const c = color || palette[kind];

  if (kind === 'folder') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M3 6.5C3 5.67 3.67 5 4.5 5h4.6c.46 0 .9.2 1.2.55l1 1.15h8.2c.83 0 1.5.67 1.5 1.5v9.3c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-11z"
          fill={c}
        />
      </svg>
    );
  }

  const iconPaths = {
    doc: (
      <>
        <rect x="4" y="2" width="14" height="20" rx="2" fill={c} opacity="0.15" />
        <rect x="4" y="2" width="14" height="20" rx="2" stroke={c} strokeWidth="1.6" />
        <path d="M7.5 8h7M7.5 12h7M7.5 16h4.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    sheet: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2" fill={c} opacity="0.15" />
        <rect x="4" y="2" width="16" height="20" rx="2" stroke={c} strokeWidth="1.6" />
        <path d="M4 9h16M4 14.5h16M9.5 9v13M14.5 9v13" stroke={c} strokeWidth="1.4" />
      </>
    ),
    slide: (
      <>
        <rect x="2" y="4" width="20" height="14" rx="2" fill={c} opacity="0.15" />
        <rect x="2" y="4" width="20" height="14" rx="2" stroke={c} strokeWidth="1.6" />
        <path d="M9 22h6M12 18v4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    pdf: (
      <>
        <path d="M5 2.5C5 1.67 5.67 1 6.5 1H14l5 5v14.5c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5v-18z" fill={c} opacity="0.15" />
        <path d="M5 2.5C5 1.67 5.67 1 6.5 1H14l5 5v14.5c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5v-18z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 1v5h5" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        <text x="12" y="17" textAnchor="middle" fontSize="6" fontWeight="700" fill={c}>PDF</text>
      </>
    ),
    image: (
      <>
        <rect x="2" y="3" width="20" height="18" rx="2" fill={c} opacity="0.15" />
        <rect x="2" y="3" width="20" height="18" rx="2" stroke={c} strokeWidth="1.6" />
        <circle cx="8" cy="9" r="2" fill={c} />
        <path d="M2 17l5.5-5.5a1.5 1.5 0 0 1 2.1 0L14 16l2-2a1.5 1.5 0 0 1 2.1 0L22 17.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    video: (
      <>
        <rect x="2" y="4" width="15" height="16" rx="2" fill={c} opacity="0.15" />
        <rect x="2" y="4" width="15" height="16" rx="2" stroke={c} strokeWidth="1.6" />
        <path d="M17 9.5l5-3v11l-5-3" fill={c} stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
      </>
    ),
    audio: (
      <>
        <circle cx="7" cy="17" r="3" fill={c} opacity="0.2" stroke={c} strokeWidth="1.6" />
        <circle cx="18" cy="15" r="3" fill={c} opacity="0.2" stroke={c} strokeWidth="1.6" />
        <path d="M10 17V5l11-2v12" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    archive: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" fill={c} opacity="0.15" />
        <rect x="3" y="4" width="18" height="16" rx="2" stroke={c} strokeWidth="1.6" />
        <path d="M3 9h18M10 9v2M14 9v2" stroke={c} strokeWidth="1.6" />
      </>
    ),
    other: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2" fill={c} opacity="0.15" />
        <rect x="4" y="2" width="16" height="20" rx="2" stroke={c} strokeWidth="1.6" />
      </>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {iconPaths[kind]}
    </svg>
  );
};

export default FileTypeIcon;