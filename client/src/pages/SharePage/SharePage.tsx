import React, { useEffect, useState} from "react";
import { FormEvent } from "react";
import { useParams } from "react-router-dom";
import "./SharePage.css";
import { getPublicShareInfo, downloadSharedFile } from "../../api/share.service";

const SharePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<any | null>(null);

  const [password, setPassword] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getPublicShareInfo(token);
        setInfo(data);
      } catch (err: any) {
        const status = err.response?.status;
        const msg = err.response?.data?.message;
        if (status === 404) {
          setError("Link not found or deleted");
        } else if (status === 403) {
          setError(msg || "This link has been disabled.");
        } else if (status === 410) {
          setError(msg || "This link has expired or download limit reached.");
        } else {
          setError("An error occurred while loading this share link.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [token]);

  const handleDownload = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !info) return;

    setDownloading(true);
    setDownloadError(null);

    try {
      await downloadSharedFile(token, info.resourceId.name, info.isPasswordProtected ? password : undefined);
      // Wait, downloadSharedFile downloads the file.
      // After download, let's refresh the info if there is a download limit to update the UI
      try {
        const data = await getPublicShareInfo(token);
        setInfo(data);
      } catch {
        // ignore if it expires/reaches limit immediately after download
      }
    } catch (err: any) {
      // Axios blob response errors need to be parsed from blob to JSON
      if (err.response && err.response.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const parsed = JSON.parse(text);
          setDownloadError(parsed.message || "Failed to download file.");
        } catch {
          setDownloadError("Failed to download file.");
        }
      } else {
        setDownloadError(err.response?.data?.message || "Failed to download file.");
      }
    } finally {
      setDownloading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  if (loading) {
    return (
      <div className="share-page-container">
        <div className="share-card share-card--loading">
          <div className="spinner" />
          <p className="mt-4">Loading share link details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="share-page-container">
        <div className="share-card share-card--error">
          <div className="error-icon">⚠️</div>
          <h2>Access Denied</h2>
          <p className="error-message">{error}</p>
          <a href="/home" className="btn btn--secondary mt-4 inline-block">
            Go to Jeni Cloud
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="share-page-container">
      <div className="share-card animate-in">
        <div className="logo-badge">Jeni Cloud</div>

        <div className="file-preview-area">
          <div className="file-icon-box">
            <span className="file-ext-label">{getFileExtension(info.resourceId.name)}</span>
          </div>
          <h2 className="file-title">{info.resourceId.name}</h2>
          <span className="file-size-label">{formatBytes(info.resourceId.size)}</span>
        </div>

        <form onSubmit={handleDownload} className="download-form">
          {info.isPasswordProtected && (
            <div className="form-group">
              <label htmlFor="sharePasswordInput" className="form-label text-left">This file is password protected</label>
              <input
                id="sharePasswordInput"
                type="password"
                placeholder="Enter password to unlock and download"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}

          {downloadError && (
            <div className="share-modal__alert share-modal__alert--danger mt-2">
              {downloadError}
            </div>
          )}

          <button
            type="submit"
            disabled={downloading}
            className="btn btn--primary btn--large w-full mt-4"
          >
            {downloading ? (
              <span className="flex-center">
                <span className="spinner spinner--sm mr-2" /> Downloading...
              </span>
            ) : (
              "Download File"
            )}
          </button>
        </form>

        <div className="share-footer-info">
          <span>Powered by Jeni Share System</span>
        </div>
      </div>
    </div>
  );
};

export default SharePage;
