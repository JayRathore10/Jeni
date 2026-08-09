import React, { useEffect, useState, useCallback } from "react";
import "./ShareModal.css";
import type { FileItem } from "../../types/types";
import {
  createShareLink,
  getMyShareLinks,
  updateShareLink,
  deleteShareLink,
  getShareLinkStats,
} from "../../api/share.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: FileItem;
}

type Tab = "list" | "create" | "edit" | "stats" | "qr";

const ShareModal: React.FC<Props> = ({ isOpen, onClose, item }) => {
  const [activeTab, setActiveTab] = useState<Tab>("list");
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editing/Creating State
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [expiryOption, setExpiryOption] = useState("never");
  const [customExpiresAt, setCustomExpiresAt] = useState("");
  const [downloadLimitOption, setDownloadLimitOption] = useState("unlimited");
  const [customMaxDownloads, setCustomMaxDownloads] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Statistics State
  const [selectedLinkStats, setSelectedLinkStats] = useState<any | null>(null);

  // QR Code State
  const [selectedLinkForQr, setSelectedLinkForQr] = useState<any | null>(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyShareLinks();
      const itemLinks = data.filter((l: any) => l.resourceId === item.id);
      setLinks(itemLinks);
      if (itemLinks.length === 0) {
        setActiveTab("create");
      } else {
        setActiveTab("list");
      }
    } catch (err: any) {
      setError("Failed to load share links.");
    } finally {
      setLoading(false);
    }
  }, [item.id]);

  useEffect(() => {
    if (isOpen) {
      fetchLinks();
      resetForm();
    }
  }, [isOpen, fetchLinks]);

  const resetForm = () => {
    setEditingLinkId(null);
    setIsPasswordProtected(false);
    setPassword("");
    setPasswordChanged(false);
    setExpiryOption("never");
    setCustomExpiresAt("");
    setDownloadLimitOption("unlimited");
    setCustomMaxDownloads("");
    setIsActive(true);
    setSelectedLinkStats(null);
    setSelectedLinkForQr(null);
    setError(null);
    setSuccessMsg(null);
  };

  const getFrontendUrl = (token: string) => {
    return `${window.location.origin}/share/${token}`;
  };

  const handleCopyLink = async (token: string) => {
    const url = getFrontendUrl(token);
    try {
      await navigator.clipboard.writeText(url);
      setSuccessMsg("Link copied to clipboard!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setSuccessMsg("Link copied to clipboard!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (e) {
        setError("Failed to copy link.");
      }
      document.body.removeChild(textArea);
    }
  };

  const getComputedExpiresAt = () => {
    if (expiryOption === "never") return null;
    const now = new Date();
    if (expiryOption === "1day") {
      return new Date(now.getTime() + 24 * 3600 * 1000).toISOString();
    }
    if (expiryOption === "7days") {
      return new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString();
    }
    if (expiryOption === "30days") {
      return new Date(now.getTime() + 30 * 24 * 3600 * 1000).toISOString();
    }
    if (expiryOption === "custom" && customExpiresAt) {
      return new Date(customExpiresAt).toISOString();
    }
    return null;
  };

  const getComputedMaxDownloads = () => {
    if (downloadLimitOption === "unlimited") return null;
    if (downloadLimitOption === "custom") {
      const parsed = parseInt(customMaxDownloads, 10);
      return isNaN(parsed) || parsed < 1 ? null : parsed;
    }
    return parseInt(downloadLimitOption, 10);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const expiresAt = getComputedExpiresAt();
      const maxDownloads = getComputedMaxDownloads();

      if (activeTab === "create") {
        await createShareLink({
          resourceType: item.kind === "folder" ? "folder" : "file",
          resourceId: item.id,
          expiresAt,
          password: isPasswordProtected ? password : null,
          maxDownloads,
        });
        setSuccessMsg("Share link created successfully!");
      } else if (activeTab === "edit" && editingLinkId) {
        await updateShareLink(editingLinkId, {
          expiresAt,
          maxDownloads,
          password: isPasswordProtected ? password : null,
          passwordChanged,
          isActive,
        });
        setSuccessMsg("Share link updated successfully!");
      }

      await fetchLinks();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save share link.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (link: any) => {
    setEditingLinkId(link._id);
    setIsActive(link.isActive);
    setIsPasswordProtected(link.isPasswordProtected || !!link.password);
    setPassword("");
    setPasswordChanged(false);

    // Parse Expiry
    if (!link.expiresAt) {
      setExpiryOption("never");
    } else {
      const expDate = new Date(link.expiresAt);
      const timeDiff = expDate.getTime() - Date.now();
      const daysDiff = Math.round(timeDiff / (24 * 3600 * 1000));

      if (daysDiff === 1) setExpiryOption("1day");
      else if (daysDiff === 7) setExpiryOption("7days");
      else if (daysDiff === 30) setExpiryOption("30days");
      else {
        setExpiryOption("custom");
        // format to datetime-local value
        const pad = (num: number) => String(num).padStart(2, "0");
        const formatted = `${expDate.getFullYear()}-${pad(expDate.getMonth() + 1)}-${pad(expDate.getDate())}T${pad(expDate.getHours())}:${pad(expDate.getMinutes())}`;
        setCustomExpiresAt(formatted);
      }
    }

    // Parse Max Downloads
    if (!link.maxDownloads) {
      setDownloadLimitOption("unlimited");
    } else {
      const limits = [1, 5, 10, 50, 100];
      if (limits.includes(link.maxDownloads)) {
        setDownloadLimitOption(String(link.maxDownloads));
      } else {
        setDownloadLimitOption("custom");
        setCustomMaxDownloads(String(link.maxDownloads));
      }
    }

    setActiveTab("edit");
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this share link?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteShareLink(id);
      setSuccessMsg("Share link deleted successfully.");
      await fetchLinks();
    } catch (err: any) {
      setError("Failed to delete share link.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActiveClick = async (link: any) => {
    setLoading(true);
    setError(null);
    try {
      await updateShareLink(link._id, {
        isActive: !link.isActive,
      });
      setSuccessMsg(`Share link ${!link.isActive ? "activated" : "disabled"} successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchLinks();
    } catch (err: any) {
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatsClick = async (link: any) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await getShareLinkStats(link._id);
      setSelectedLinkStats(stats);
      setActiveTab("stats");
    } catch (err: any) {
      setError("Failed to fetch statistics.");
    } finally {
      setLoading(false);
    }
  };

  const handleQrClick = (link: any) => {
    setSelectedLinkForQr(link);
    setActiveTab("qr");
  };

  const handleDownloadQr = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = getFrontendUrl(token);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = `qr-code-${token}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError("Failed to download QR code image.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal">
      <div className="share-modal__backdrop" onClick={onClose} />
      <div className="share-modal__content">
        <div className="share-modal__header">
          <h3>Share "{item.name}"</h3>
          <button className="share-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="share-modal__body">
          {error && <div className="share-modal__alert share-modal__alert--danger">{error}</div>}
          {successMsg && <div className="share-modal__alert share-modal__alert--success">{successMsg}</div>}

          {loading && <div className="share-modal__loading-overlay"><div className="spinner" /></div>}

          {/* LIST TAB */}
          {activeTab === "list" && (
            <div className="share-modal__list-view">
              <div className="share-modal__list-header">
                <h4>Active Links ({links.length})</h4>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => {
                    resetForm();
                    setActiveTab("create");
                  }}
                >
                  + Create Link
                </button>
              </div>

              <div className="share-modal__links-container">
                {links.map((link) => {
                  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
                  const isLimitReached = link.maxDownloads !== null && link.downloadCount >= link.maxDownloads;
                  let statusText = "Active";
                  let statusClass = "status-tag--active";

                  if (!link.isActive) {
                    statusText = "Disabled";
                    statusClass = "status-tag--disabled";
                  } else if (isExpired) {
                    statusText = "Expired";
                    statusClass = "status-tag--expired";
                  } else if (isLimitReached) {
                    statusText = "Limit Reached";
                    statusClass = "status-tag--limit";
                  }

                  return (
                    <div key={link._id} className="share-link-card">
                      <div className="share-link-card__info">
                        <div className="share-link-card__url-row">
                          <span className="share-link-card__url" title={getFrontendUrl(link.token)}>
                            {getFrontendUrl(link.token)}
                          </span>
                          <span className={`status-tag ${statusClass}`}>{statusText}</span>
                        </div>
                        <div className="share-link-card__metadata">
                          <span>Downloads: {link.downloadCount}/{link.maxDownloads ?? "∞"}</span>
                          {link.expiresAt && (
                            <span>Expires: {new Date(link.expiresAt).toLocaleDateString()}</span>
                          )}
                          {link.password && <span className="share-link-card__meta-lock">🔒 Password</span>}
                        </div>
                      </div>

                      <div className="share-link-card__actions">
                        <button
                          className="btn-icon"
                          title="Copy Link"
                          onClick={() => handleCopyLink(link.token)}
                        >
                          📋
                        </button>
                        <button
                          className="btn-icon"
                          title="Show QR Code"
                          onClick={() => handleQrClick(link)}
                        >
                          📱
                        </button>
                        <button
                          className="btn-icon"
                          title="View Statistics"
                          onClick={() => handleStatsClick(link)}
                        >
                          📈
                        </button>
                        <button
                          className="btn-icon"
                          title="Edit Settings"
                          onClick={() => handleEditClick(link)}
                        >
                          ⚙️
                        </button>
                        <button
                          className={`btn-icon ${link.isActive ? "btn-icon--active" : "btn-icon--inactive"}`}
                          title={link.isActive ? "Disable Link" : "Enable Link"}
                          onClick={() => handleToggleActiveClick(link)}
                        >
                          🚫
                        </button>
                        <button
                          className="btn-icon btn-icon--danger"
                          title="Delete Link"
                          onClick={() => handleDeleteClick(link._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CREATE / EDIT TAB */}
          {(activeTab === "create" || activeTab === "edit") && (
            <form className="share-form" onSubmit={handleSave}>
              <div className="share-form__title-row">
                <h4>{activeTab === "create" ? "Configure New Share Link" : "Edit Share Settings"}</h4>
                {links.length > 0 && (
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => setActiveTab("list")}
                  >
                    Back to list
                  </button>
                )}
              </div>

              {activeTab === "edit" && (
                <div className="form-group form-group--row">
                  <label htmlFor="isActiveToggle" className="form-label">Link Enabled</label>
                  <label className="toggle-switch">
                    <input
                      id="isActiveToggle"
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              )}

              {/* Password Protection */}
              <div className="form-group">
                <div className="form-group--row">
                  <label htmlFor="passwordToggle" className="form-label">Password Protection</label>
                  <label className="toggle-switch">
                    <input
                      id="passwordToggle"
                      type="checkbox"
                      checked={isPasswordProtected}
                      onChange={(e) => {
                        setIsPasswordProtected(e.target.checked);
                        setPasswordChanged(true);
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                {isPasswordProtected && (
                  <input
                    type="password"
                    placeholder={activeTab === "edit" ? "Enter new password (leave blank to keep current)" : "Enter password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordChanged(true);
                    }}
                    className="form-input mt-2"
                  />
                )}
              </div>

              {/* Expiration Date */}
              <div className="form-group">
                <label htmlFor="expirySelect" className="form-label">Expiration Time</label>
                <select
                  id="expirySelect"
                  value={expiryOption}
                  onChange={(e) => setExpiryOption(e.target.value)}
                  className="form-select"
                >
                  <option value="never">Never</option>
                  <option value="1day">1 Day</option>
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                  <option value="custom">Custom Date</option>
                </select>
                {expiryOption === "custom" && (
                  <input
                    type="datetime-local"
                    value={customExpiresAt}
                    onChange={(e) => setCustomExpiresAt(e.target.value)}
                    required
                    className="form-input mt-2"
                  />
                )}
              </div>

              {/* Download Limit */}
              <div className="form-group">
                <label htmlFor="downloadLimitSelect" className="form-label">Maximum Downloads</label>
                <select
                  id="downloadLimitSelect"
                  value={downloadLimitOption}
                  onChange={(e) => setDownloadLimitOption(e.target.value)}
                  className="form-select"
                >
                  <option value="unlimited">Unlimited</option>
                  <option value="1">1 Download</option>
                  <option value="5">5 Downloads</option>
                  <option value="10">10 Downloads</option>
                  <option value="50">50 Downloads</option>
                  <option value="100">100 Downloads</option>
                  <option value="custom">Custom Count</option>
                </select>
                {downloadLimitOption === "custom" && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter maximum downloads"
                    value={customMaxDownloads}
                    onChange={(e) => setCustomMaxDownloads(e.target.value)}
                    required
                    className="form-input mt-2"
                  />
                )}
              </div>

              <div className="share-form__actions">
                {links.length > 0 ? (
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setActiveTab("list")}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={onClose}
                  >
                    Close
                  </button>
                )}
                <button type="submit" className="btn btn--primary">
                  {activeTab === "create" ? "Generate Link" : "Save Settings"}
                </button>
              </div>
            </form>
          )}

          {/* STATISTICS TAB */}
          {activeTab === "stats" && selectedLinkStats && (
            <div className="share-stats">
              <div className="share-stats__header">
                <h4>Statistics & logs</h4>
                <button className="btn btn--secondary btn--sm" onClick={() => setActiveTab("list")}>
                  Back to list
                </button>
              </div>

              <div className="share-stats__grid">
                <div className="stat-card-mini">
                  <span className="stat-card-mini__title">Total Downloads</span>
                  <span className="stat-card-mini__value">{selectedLinkStats.totalDownloads}</span>
                </div>
                <div className="stat-card-mini">
                  <span className="stat-card-mini__title">Max Limit</span>
                  <span className="stat-card-mini__value">
                    {selectedLinkStats.maxDownloads ?? "Unlimited"}
                  </span>
                </div>
                <div className="stat-card-mini">
                  <span className="stat-card-mini__title">Expires</span>
                  <span className="stat-card-mini__value">
                    {selectedLinkStats.expiresAt
                      ? new Date(selectedLinkStats.expiresAt).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
                <div className="stat-card-mini">
                  <span className="stat-card-mini__title">Status</span>
                  <span className="stat-card-mini__value">
                    {selectedLinkStats.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="share-stats__logs-section">
                <h5>Recent Access Logs</h5>
                <div className="share-stats__logs-container">
                  {selectedLinkStats.logs.length === 0 ? (
                    <p className="no-logs">No downloads recorded yet.</p>
                  ) : (
                    <table className="logs-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>IP Address</th>
                          <th>Device/User Agent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLinkStats.logs.map((log: any, idx: number) => (
                          <tr key={idx}>
                            <td>{new Date(log.downloadedAt).toLocaleString()}</td>
                            <td><code>{log.ipAddress}</code></td>
                            <td><span className="user-agent-text" title={log.userAgent}>{log.userAgent}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* QR CODE TAB */}
          {activeTab === "qr" && selectedLinkForQr && (
            <div className="share-qr-view">
              <div className="share-qr-view__header">
                <h4>QR Code Scan to Download</h4>
                <button className="btn btn--secondary btn--sm" onClick={() => setActiveTab("list")}>
                  Back to list
                </button>
              </div>

              <div className="share-qr-view__content">
                <div className="qr-container">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                      getFrontendUrl(selectedLinkForQr.token)
                    )}`}
                    alt="QR Code Scan Link"
                    className="qr-image"
                  />
                  <p>Scan to download on phone or share visually</p>
                </div>

                <div className="qr-url-box">
                  <input
                    type="text"
                    readOnly
                    value={getFrontendUrl(selectedLinkForQr.token)}
                    className="form-input font-mono"
                  />
                  <button
                    className="btn btn--secondary"
                    onClick={() => handleCopyLink(selectedLinkForQr.token)}
                  >
                    Copy
                  </button>
                </div>

                <button
                  className="btn btn--primary w-full mt-4"
                  onClick={() => handleDownloadQr(selectedLinkForQr.token)}
                >
                  Download QR Code (PNG)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
