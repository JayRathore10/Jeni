import React from 'react';
import './Sidebar.css';
import StorageMeter from '../StorageMeter/StorageMeter';
import NewButton from '../NewButton/NewButton';

interface NavItem { 
  id: string;
  label: string;
  icon: JSX.Element;
  count?: number;
}

interface Props {
  activeNav: string;
  onNavChange: (id: string) => void;
  onCreateFolder: () => void;
  onUploadFiles: (files: FileList) => void;
  collapsed: boolean;
}

const navIcon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const primaryNav: NavItem[] = [
  { id: 'my-files', label: 'My files', icon: navIcon('M3 7.5c0-.83.67-1.5 1.5-1.5h4.4c.4 0 .77.16 1.05.43l1.1 1.07h8.45c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-10.5z') },
  { id: 'shared', label: 'Shared with me', icon: navIcon('M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 19c0-3 2.9-5.5 6.5-5.5s6.5 2.5 6.5 5.5M14 13.8c2.6.3 4.5 2.1 4.5 4.2'), count: 3 },
  { id: 'recent', label: 'Recent', icon: navIcon('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3.5 2') },
  { id: 'starred', label: 'Starred', icon: navIcon('M12 2.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z') },
];

const secondaryNav: NavItem[] = [
  { id: 'trash', label: 'Trash', icon: navIcon('M4 7h16M9 7V4.5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1V7M6 7l1 12.5c.05.8.7 1.5 1.5 1.5h7c.8 0 1.45-.7 1.5-1.5L18 7') },
];

const Sidebar: React.FC<Props> = ({ activeNav, onNavChange, onCreateFolder, onUploadFiles, collapsed }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFiles(e.target.files);
    }
    e.target.value = '';
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__new-wrap">
        <NewButton onCreateFolder={onCreateFolder} onUploadClick={() => fileInputRef.current?.click()} collapsed={collapsed} />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sidebar__hidden-input"
          onChange={handleFileSelect}
        />
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {primaryNav.map((item) => (
            <li key={item.id}>
              <button
                className={`sidebar__item ${activeNav === item.id ? 'sidebar__item--active' : ''}`}
                onClick={() => onNavChange(item.id)}
                title={item.label}
              >
                <span className="sidebar__item-icon">{item.icon}</span>
                <span className="sidebar__item-label">{item.label}</span>
                {item.count && <span className="sidebar__item-badge">{item.count}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar__divider" />

        <ul className="sidebar__list">
          {secondaryNav.map((item) => (
            <li key={item.id}>
              <button
                className={`sidebar__item ${activeNav === item.id ? 'sidebar__item--active' : ''}`}
                onClick={() => onNavChange(item.id)}
                title={item.label}
              >
                <span className="sidebar__item-icon">{item.icon}</span>
                <span className="sidebar__item-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <StorageMeter usedBytes={42_500_000_000} totalBytes={100_000_000_000} collapsed={collapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;