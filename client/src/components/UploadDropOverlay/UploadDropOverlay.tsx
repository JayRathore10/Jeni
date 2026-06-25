import React from 'react';
import './UploadDropOverlay.css';

interface Props {
  visible: boolean;
}

const UploadDropOverlay: React.FC<Props> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="drop-overlay">
      <div className="drop-overlay__card">
        <div className="drop-overlay__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 16V4M7.5 8.5L12 4l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="drop-overlay__title">Drop files to upload</p>
        <p className="drop-overlay__sub">Release to add them to this folder</p>
      </div>
    </div>
  );
};

export default UploadDropOverlay;