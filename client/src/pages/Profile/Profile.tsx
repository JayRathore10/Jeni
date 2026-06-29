import React, { useState, useRef, type JSX } from 'react';
import './Profile.css';


type PlanTier = 'Free' | 'Pro' | 'Premium';

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  memberSince: string; // ISO date
  plan: PlanTier;
  avatarUrl: string | null;
}

interface StorageInfo {
  usedBytes: number;
  totalBytes: number;
}

interface AccountField {
  id: keyof Pick<UserProfile, 'fullName' | 'username' | 'email' | 'phone' | 'country' | 'timezone'>;
  label: string;
  value: string;
}

interface SecurityAction {
  id: string;
  label: string;
  description: string;
  icon: JSX.Element;
  kind: 'button' | 'toggle';
}

interface PreferenceToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface UsageStat {
  id: string;
  label: string;
  value: string;
  icon: JSX.Element;
  accentVar: string;
}


const icon = (path: string, viewBox = '0 0 24 24') => (
  <svg width="20" height="20" viewBox={viewBox} fill="none" aria-hidden="true">
    <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Icons = {
  camera: icon('M4 8.5C4 7.4 4.9 6.5 6 6.5h1.5l1-1.5h7l1 1.5H18c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-9zM12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'),
  edit: icon('M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'),
  mail: icon('M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3.5 6l8 6 8-6'),
  calendar: icon('M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'),
  upload: icon('M12 16V4M7.5 8.5L12 4l4.5 4.5M4 20h16'),
  password: icon('M7 11V8a5 5 0 0 1 10 0v3M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z'),
  shield: icon('M12 2.5l8 3.5v6c0 5-3.5 8-8 9.5-4.5-1.5-8-4.5-8-9.5v-6l8-3.5z'),
  activity: icon('M3 12h4l2 7 4-14 2 7h6'),
  devices: icon('M5 4h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM9 20h2M19 8h2v9a1 1 0 0 1-1 1h-3'),
  moon: icon('M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'),
  bell: icon('M18 8a6 6 0 1 0-12 0c0 3.5-1 5.5-2 7h16c-1-1.5-2-3.5-2-7zM9.5 19a2.5 2.5 0 0 0 5 0'),
  backup: icon('M21 15v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4M12 3v12M7.5 10.5L12 15l4.5-4.5'),
  chart: icon('M4 19V10M11 19V4M18 19v-7'),
  files: icon('M4 7.5C4 6.67 4.67 6 5.5 6h4.6c.4 0 .77.16 1.05.43l1.1 1.07h6.25c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-13c-.83 0-1.5-.67-1.5-1.5v-10.5z'),
  folder: icon('M3 6.5C3 5.67 3.67 5 4.5 5h4.6c.46 0 .9.2 1.2.55l1 1.15h8.2c.83 0 1.5.67 1.5 1.5v9.3c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-11z'),
  share: icon('M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 19c0-3 2.9-5.5 6.5-5.5s6.5 2.5 6.5 5.5M14 13.8c2.6.3 4.5 2.1 4.5 4.2'),
  database: icon('M12 5c4.4 0 8-1.1 8-2.5S16.4 0 12 0 4 1.1 4 2.5 7.6 5 12 5zM4 2.5V19c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V2.5M4 9c0 1.4 3.6 2.5 8 2.5S20 10.4 20 9M4 15c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5', '0 0 24 22'),
  trash: icon('M4 7h16M9 7V4.5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1V7M6 7l1 12.5c.05.8.7 1.5 1.5 1.5h7c.8 0 1.45-.7 1.5-1.5L18 7'),
  logout: icon('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'),
  warning: icon('M12 9v4M12 17h.01M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.2h17.8a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-2.6 0z'),
};

const initialProfile: UserProfile = {
  fullName: 'Aanya Verma',
  username: 'aanya.verma',
  email: 'aanya.verma@mybox.app',
  phone: '+91 98765 43210',
  country: 'India',
  timezone: 'GMT+5:30 (Asia/Kolkata)',
  memberSince: '2024-03-12T00:00:00Z',
  plan: 'Pro',
  avatarUrl: null,
};

const storageInfo: StorageInfo = {
  usedBytes: 42_500_000_000,
  totalBytes: 100_000_000_000,
};

const usageStats: UsageStat[] = [
  { id: 'files', label: 'Files Uploaded', value: '1,284', icon: Icons.files, accentVar: '--info' },
  { id: 'folders', label: 'Folders Created', value: '96', icon: Icons.folder, accentVar: '--accent' },
  { id: 'shared', label: 'Shared Files', value: '212', icon: Icons.share, accentVar: '--success' },
  { id: 'storage', label: 'Storage Used', value: '42.5 GB', icon: Icons.database, accentVar: '--warning' },
];


const formatGB = (bytes: number) => (bytes / 1_000_000_000).toFixed(1);

const formatMemberSince = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const getInitials = (name: string) =>
  name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

/* ============================================================
   TOGGLE SWITCH SUBCOMPONENT
   ============================================================ */

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    className={`toggle-switch ${checked ? 'toggle-switch--on' : ''}`}
    onClick={onChange}
  >
    <span className="toggle-switch__thumb" />
  </button>
);

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

const Profile: React.FC = () => {
  const [profile] = useState<UserProfile>(initialProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [security, setSecurity] = useState({ twoFactor: true });
  const [preferences, setPreferences] = useState<PreferenceToggle[]>([
    { id: 'darkMode', label: 'Dark Mode', description: 'Use a darker color theme across the app', enabled: false },
    { id: 'emailNotifications', label: 'Email Notifications', description: 'Get notified about activity via email', enabled: true },
    { id: 'autoBackup', label: 'Auto Backup', description: 'Automatically back up new files daily', enabled: true },
    { id: 'shareAnalytics', label: 'Share Analytics', description: 'Help us improve by sharing usage data', enabled: false },
  ]);

  const usedPct = Math.min(100, (storageInfo.usedBytes / storageInfo.totalBytes) * 100);
  const remainingGB = formatGB(storageInfo.totalBytes - storageInfo.usedBytes);

  const accountFields: AccountField[] = [
    { id: 'fullName', label: 'Full Name', value: profile.fullName },
    { id: 'username', label: 'Username', value: `@${profile.username}` },
    { id: 'email', label: 'Email', value: profile.email },
    { id: 'phone', label: 'Phone Number', value: profile.phone },
    { id: 'country', label: 'Country', value: profile.country },
    { id: 'timezone', label: 'Time Zone', value: profile.timezone },
  ];

  const securityActions: SecurityAction[] = [
    { id: 'password', label: 'Change Password', description: 'Update your password regularly to stay secure', icon: Icons.password, kind: 'button' },
    { id: '2fa', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account', icon: Icons.shield, kind: 'toggle' },
    { id: 'activity', label: 'Login Activity', description: 'Review recent sign-ins to your account', icon: Icons.activity, kind: 'button' },
    { id: 'devices', label: 'Connected Devices', description: 'Manage devices linked to your account', icon: Icons.devices, kind: 'button' },
  ];

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  return (
    <main className="profile-page" aria-label="Profile settings">
      <div className="profile-page__container">

        {/* ============== HEADER CARD ============== */}
        <section className="profile-header glass-card" aria-label="Profile overview">
          <div className="profile-header__avatar-wrap">
            <div className="profile-header__avatar" aria-hidden={!!profile.avatarUrl}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={`${profile.fullName}'s avatar`} className="profile-header__avatar-img" />
              ) : (
                <span className="profile-header__avatar-initials">{getInitials(profile.fullName)}</span>
              )}
            </div>
            <button
              type="button"
              className="profile-header__avatar-edit"
              onClick={handleAvatarClick}
              aria-label="Change profile photo"
              title="Change profile photo"
            >
              {Icons.camera}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="profile-header__file-input" />
          </div>

          <div className="profile-header__info">
            <div className="profile-header__name-row">
              <h1 className="profile-header__name">{profile.fullName}</h1>
              <span className={`plan-badge plan-badge--${profile.plan.toLowerCase()}`}>{profile.plan}</span>
            </div>
            <p className="profile-header__email">
              <span className="profile-header__meta-icon">{Icons.mail}</span>
              {profile.email}
            </p>
            <p className="profile-header__since">
              <span className="profile-header__meta-icon">{Icons.calendar}</span>
              Member since {formatMemberSince(profile.memberSince)}
            </p>
          </div>

          <button type="button" className="btn btn--secondary profile-header__edit-btn">
            {Icons.edit}
            Edit Profile
          </button>
        </section>

        {/* ============== STORAGE OVERVIEW ============== */}
        <section className="storage-card glass-card" aria-label="Storage overview">
          <div className="storage-card__header">
            <h2 className="card-title">Storage Overview</h2>
            <button type="button" className="btn btn--primary storage-card__upgrade-btn">
              Upgrade Plan
            </button>
          </div>

          <div className="storage-card__stats-row">
            <div className="storage-card__stat">
              <span className="storage-card__stat-value">{formatGB(storageInfo.usedBytes)} GB</span>
              <span className="storage-card__stat-label">Used</span>
            </div>
            <div className="storage-card__stat storage-card__stat--center">
              <span className="storage-card__stat-value storage-card__stat-value--accent">{usedPct.toFixed(0)}%</span>
              <span className="storage-card__stat-label">of total</span>
            </div>
            <div className="storage-card__stat storage-card__stat--right">
              <span className="storage-card__stat-value">{formatGB(storageInfo.totalBytes)} GB</span>
              <span className="storage-card__stat-label">Total</span>
            </div>
          </div>

          <div
            className="storage-card__progress-track"
            role="progressbar"
            aria-valuenow={Math.round(usedPct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Storage used"
          >
            <div className="storage-card__progress-fill" style={{ '--fill-pct': `${usedPct}%` } as React.CSSProperties} />
          </div>

          <p className="storage-card__remaining">{remainingGB} GB remaining</p>
        </section>

        {/* ============== ACCOUNT INFORMATION ============== */}
        <section className="info-card glass-card" aria-label="Account information">
          <h2 className="card-title">Account Information</h2>
          <ul className="info-list">
            {accountFields.map((field) => (
              <li key={field.id} className="info-list__row">
                <div className="info-list__text">
                  <span className="info-list__label">{field.label}</span>
                  <span className="info-list__value">{field.value}</span>
                </div>
                <button
                  type="button"
                  className="info-list__edit-btn"
                  aria-label={`Edit ${field.label}`}
                  title={`Edit ${field.label}`}
                >
                  {Icons.edit}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ============== SECURITY ============== */}
        <section className="security-card glass-card" aria-label="Security settings">
          <h2 className="card-title">Security</h2>
          <ul className="security-list">
            {securityActions.map((action) => (
              <li key={action.id} className="security-list__row">
                <span className="security-list__icon">{action.icon}</span>
                <div className="security-list__text">
                  <span className="security-list__label">{action.label}</span>
                  <span className="security-list__description">{action.description}</span>
                </div>
                {action.kind === 'toggle' ? (
                  <ToggleSwitch
                    checked={security.twoFactor}
                    onChange={() => setSecurity((s) => ({ ...s, twoFactor: !s.twoFactor }))}
                    label={action.label}
                  />
                ) : (
                  <button type="button" className="btn btn--secondary btn--small">
                    Manage
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ============== PREFERENCES ============== */}
        <section className="preferences-card glass-card" aria-label="Preferences">
          <h2 className="card-title">Preferences</h2>
          <ul className="preferences-list">
            {preferences.map((pref) => (
              <li key={pref.id} className="preferences-list__row">
                <div className="preferences-list__text">
                  <span className="preferences-list__label">{pref.label}</span>
                  <span className="preferences-list__description">{pref.description}</span>
                </div>
                <ToggleSwitch
                  checked={pref.enabled}
                  onChange={() => togglePreference(pref.id)}
                  label={pref.label}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* ============== USAGE STATISTICS ============== */}
        <section className="stats-card glass-card" aria-label="Usage statistics">
          <h2 className="card-title">Usage Statistics</h2>
          <div className="stats-grid">
            {usageStats.map((stat) => (
              <div key={stat.id} className="stats-grid__item">
                <span
                  className="stats-grid__icon"
                  style={{ '--stat-color': `var(${stat.accentVar})` } as React.CSSProperties}
                >
                  {stat.icon}
                </span>
                <span className="stats-grid__value">{stat.value}</span>
                <span className="stats-grid__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ============== DANGER ZONE ============== */}
        <section className="danger-card glass-card" aria-label="Danger zone">
          <div className="danger-card__header">
            <span className="danger-card__icon">{Icons.warning}</span>
            <h2 className="card-title card-title--danger">Danger Zone</h2>
          </div>
          <p className="danger-card__description">
            These actions are irreversible. Please proceed with caution.
          </p>
          <div className="danger-card__actions">
            <button type="button" className="btn btn--ghost danger-card__logout-btn">
              {Icons.logout}
              Logout
            </button>
            <button type="button" className="btn btn--danger">
              {Icons.trash}
              Delete Account
            </button>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Profile;