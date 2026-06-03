import React, { useState, useRef, useEffect } from 'react';
import './UploadPreview.css';

const files = [
  { name: 'Q4_Report_Final.pdf', size: '4.2 MB', type: 'pdf', progress: 100, color: '#EF4444' },
  { name: 'Brand_Assets.zip', size: '128 MB', type: 'zip', progress: 78, color: '#F97316' },
  { name: 'Team_Photo.jpg', size: '3.8 MB', type: 'img', progress: 100, color: '#3B82F6' },
  { name: 'Roadmap_2025.docx', size: '1.1 MB', type: 'doc', progress: 45, color: '#8B5CF6' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FileIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => (
  <div className="upload-file-icon" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="9" height="12" rx="1.5" fill={color} opacity="0.2"/>
      <rect x="2" y="1" width="9" height="12" rx="1.5" stroke={color} strokeWidth="1.2"/>
      <path d="M10 1l3 3h-3V1z" fill={color}/>
      <path d="M4 6h5M4 8.5h3" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  </div>
);

const UploadPreview: React.FC = () => {
  const [dragging, setDragging] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) e.target.classList.add('section--visible'); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="upload-section section-fade" ref={sectionRef} id="upload">
      <div className="upload-section__container">
        <div className="upload-section__content">
          <span className="section-label">Uploads</span>
          <h2 className="upload-section__title">
            Drop it in.<br />We handle the rest.
          </h2>
          <p className="upload-section__desc">
            Upload anything — from a single screenshot to a 50GB folder. Jeni compresses,
            encrypts, and syncs instantly across all your devices.
          </p>

          <ul className="upload-section__list">
            {['Supports 200+ file formats','Drag-and-drop from anywhere','Resumes interrupted uploads'].map((item, i) => (
              <li key={i} className="upload-section__list-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" fill="var(--accent)" opacity="0.15"/>
                  <path d="M5 8l2 2 4-4" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="upload-section__visual">
          {/* Drop zone */}
          <div
            className={`upload-dropzone ${dragging ? 'upload-dropzone--active' : ''}`}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDrop={() => setDragging(false)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="upload-dropzone__icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 22V10M10 16l6-6 6 6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 26h20" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
            <p className="upload-dropzone__text">
              <strong>Drop files here</strong> or click to browse
            </p>
            <span className="upload-dropzone__sub">Supports all file types up to 50 GB</span>
          </div>

          {/* File list */}
          <div className="upload-filelist">
            <div className="upload-filelist__header">
              <span className="upload-filelist__title">Recent uploads</span>
              <span className="upload-filelist__count">{files.length} files</span>
            </div>

            {files.map((f, i) => (
              <div key={i} className="upload-file-row">
                <FileIcon type={f.type} color={f.color} />
                <div className="upload-file-info">
                  <div className="upload-file-name">{f.name}</div>
                  <div className="upload-file-meta">
                    <span>{f.size}</span>
                    {f.progress < 100 && <span className="upload-file-progress-text">{f.progress}%</span>}
                    {f.progress === 100 && <span className="upload-file-done">✓ Complete</span>}
                  </div>
                  {f.progress < 100 && (
                    <div className="upload-progress-bar">
                      <div
                        className="upload-progress-fill"
                        style={{ width: `${f.progress}%`, background: f.color }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadPreview;