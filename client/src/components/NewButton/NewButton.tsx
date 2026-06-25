import React, { useEffect, useRef, useState } from 'react';
import './NewButton.css';

interface Props {
  onCreateFolder: () => void;
  onUploadClick: () => void;
  collapsed: boolean;
}

const menuIcon = (d: string) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NewButton: React.FC<Props> = ({ onCreateFolder, onUploadClick, collapsed }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const items = [
    {
      label: 'New folder',
      icon: menuIcon('M3 6.5C3 5.67 3.67 5 4.5 5h4.6c.46 0 .9.2 1.2.55l1 1.15h8.2c.83 0 1.5.67 1.5 1.5v9.3c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-11z'),
      action: () => { onCreateFolder(); setOpen(false); },
    },
    { divider: true },
    {
      label: 'File upload',
      icon: menuIcon('M12 16V4M7.5 8.5L12 4l4.5 4.5M4 20h16'),
      action: () => { onUploadClick(); setOpen(false); },
    },
    {
      label: 'Folder upload',
      icon: menuIcon('M3 7.5c0-.83.67-1.5 1.5-1.5h4.4c.4 0 .77.16 1.05.43l1.1 1.07h8.45c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-10.5zM12 11v5M9.5 13.5h5'),
      action: () => { onUploadClick(); setOpen(false); },
    },
  ];

  return (
    <div className="new-btn" ref={ref}>
      <button
        className={`new-btn__trigger ${collapsed ? 'new-btn__trigger--collapsed' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        {!collapsed && <span>New</span>}
      </button>

      {open && (
        <div className={`new-btn__menu ${collapsed ? 'new-btn__menu--collapsed' : ''}`}>
          {items.map((item, i) =>
            'divider' in item ? (
              <div key={i} className="new-btn__divider" />
            ) : (
              <button key={i} className="new-btn__menu-item" onClick={item.action}>
                <span className="new-btn__menu-icon">{item.icon}</span>
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default NewButton;