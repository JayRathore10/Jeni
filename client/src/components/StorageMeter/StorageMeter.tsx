import React from 'react';
import './StorageMeter.css';

interface Props {
  usedBytes: number;
  totalBytes: number;
  collapsed: boolean;
}

const formatGB = (bytes: number) => (bytes / 1_000_000_000).toFixed(1);

const StorageMeter: React.FC<Props> = ({ usedBytes, totalBytes, collapsed }) => {
  const pct = Math.min(100, (usedBytes / totalBytes) * 100);
  const isHigh = pct > 80;

  if (collapsed) {
    return (
      <div className="storage-meter storage-meter--mini" title={`${formatGB(usedBytes)} GB of ${formatGB(totalBytes)} GB used`}>
        <svg width="28" height="28" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.5" fill="none"
            stroke={isHigh ? 'var(--danger)' : 'var(--primary)'}
            strokeWidth="3"
            strokeDasharray={`${pct * 0.973} 100`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="storage-meter">
      <div className="storage-meter__label-row">
        <span className="storage-meter__label">Storage</span>
        <span className="storage-meter__value">{formatGB(usedBytes)} GB of {formatGB(totalBytes)} GB</span>
      </div>
      <div className="storage-meter__bar">
        <div
          className={`storage-meter__fill ${isHigh ? 'storage-meter__fill--high' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <button className="storage-meter__upgrade">Get more storage</button>
    </div>
  );
};

export default StorageMeter;