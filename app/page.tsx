"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUrl("");
    setLoading(true);

    try {
      const body: any = {
        content,
      };

      if (ttlSeconds.trim()) {
        const ttl = parseInt(ttlSeconds, 10);
        if (isNaN(ttl) || ttl < 1) {
          setError("TTL must be a positive integer");
          setLoading(false);
          return;
        }
        body.ttl_seconds = ttl;
      }

      if (maxViews.trim()) {
        const views = parseInt(maxViews, 10);
        if (isNaN(views) || views < 1) {
          setError("Max views must be a positive integer");
          setLoading(false);
          return;
        }
        body.max_views = views;
      }

      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        setError("Invalid response from server");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.error || "Failed to create paste");
        setLoading(false);
        return;
      }

      // Validate response has required fields
      if (!data.id || !data.url) {
        setError("Invalid response format from server");
        setLoading(false);
        return;
      }

      setUrl(data.url);
      setContent("");
      setTtlSeconds("");
      setMaxViews("");
      setLoading(false);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      alert("URL copied to clipboard!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Pastebin-Lite</h1>
        <p style={styles.subtitle}>Share your text snippets quickly and securely</p>
      </div>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="content" style={styles.label}>
              Content <span style={styles.required}>*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              placeholder="Paste your text here..."
              style={styles.textarea}
            />
          </div>

          <div style={styles.optionsRow}>
            <div style={styles.formGroup}>
              <label htmlFor="ttl" style={styles.label}>
                TTL (seconds)
                <span style={styles.optional}>optional</span>
              </label>
              <input
                id="ttl"
                type="number"
                value={ttlSeconds}
                onChange={(e) => setTtlSeconds(e.target.value)}
                min="1"
                placeholder="e.g., 3600"
                style={styles.input}
              />
              <small style={styles.helpText}>Paste will expire after this many seconds</small>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="maxViews" style={styles.label}>
                Max Views
                <span style={styles.optional}>optional</span>
              </label>
              <input
                id="maxViews"
                type="number"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                min="1"
                placeholder="e.g., 10"
                style={styles.input}
              />
              <small style={styles.helpText}>Maximum number of times paste can be viewed</small>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            style={{
              ...styles.button,
              ...(loading || !content.trim() ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Creating..." : "Create Paste"}
          </button>
        </form>

        {error && (
          <div style={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {url && (
          <div style={styles.successBox}>
            <div style={styles.successHeader}>
              <strong>✓ Paste created successfully!</strong>
            </div>
            <div style={styles.urlContainer}>
              <input
                type="text"
                value={url}
                readOnly
                style={styles.urlInput}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={copyToClipboard}
                style={styles.copyButton}
                title="Copy URL"
              >
                📋 Copy
              </button>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.viewLink}
            >
              View Paste →
            </a>
          </div>
        )}
      </div>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Created by <strong>Riaz Mohammed</strong>
        </p>
        <p style={styles.footerText}>
          Email: <a href="mailto:riazmohemed0@gmail.com" style={styles.footerLink}>riazmohemed0@gmail.com</a>
        </p>
        <p style={styles.footerText}>
          Candidate ID: <strong>Naukri0126</strong>
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "40px",
    paddingTop: "40px",
  },
  title: {
    fontSize: "48px",
    fontWeight: "700",
    margin: "0 0 10px 0",
    color: "#1a1a1a",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "18px",
    color: "#666",
    margin: "0",
  },
  card: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  required: {
    color: "#e74c3c",
  },
  optional: {
    fontSize: "12px",
    fontWeight: "400",
    color: "#999",
    marginLeft: "8px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontFamily: "monospace",
    resize: "vertical" as const,
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  },
  helpText: {
    display: "block",
    fontSize: "12px",
    color: "#999",
    marginTop: "4px",
  },
  optionsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  },
  button: {
    width: "100%",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#667eea",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 4px rgba(102, 126, 234, 0.3)",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  errorBox: {
    marginTop: "20px",
    padding: "12px 16px",
    backgroundColor: "#fee",
    border: "1px solid #fcc",
    borderRadius: "8px",
    color: "#c33",
    fontSize: "14px",
  },
  successBox: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f0f9ff",
    border: "2px solid #667eea",
    borderRadius: "8px",
  },
  successHeader: {
    fontSize: "16px",
    color: "#667eea",
    marginBottom: "12px",
  },
  urlContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  },
  urlInput: {
    flex: "1",
    padding: "10px 12px",
    fontSize: "14px",
    border: "2px solid #e0e0e0",
    borderRadius: "6px",
    backgroundColor: "#fff",
    fontFamily: "monospace",
  },
  copyButton: {
    padding: "10px 16px",
    fontSize: "14px",
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  viewLink: {
    display: "inline-block",
    color: "#667eea",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
  footer: {
    maxWidth: "900px",
    margin: "60px auto 20px",
    textAlign: "center" as const,
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  footerText: {
    margin: "8px 0",
    fontSize: "14px",
    color: "#666",
  },
  footerLink: {
    color: "#667eea",
    textDecoration: "none",
  },
};
