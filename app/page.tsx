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

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create paste");
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

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Pastebin-Lite</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="content" style={{ display: "block", marginBottom: "5px" }}>
            Content:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            cols={50}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="ttl" style={{ display: "block", marginBottom: "5px" }}>
            TTL (seconds, optional):
          </label>
          <input
            id="ttl"
            type="number"
            value={ttlSeconds}
            onChange={(e) => setTtlSeconds(e.target.value)}
            min="1"
            style={{ padding: "8px", width: "200px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="maxViews" style={{ display: "block", marginBottom: "5px" }}>
            Max Views (optional):
          </label>
          <input
            id="maxViews"
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            min="1"
            style={{ padding: "8px", width: "200px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "15px", color: "red" }}>
          Error: {error}
        </div>
      )}

      {url && (
        <div style={{ marginTop: "15px" }}>
          <p>
            <strong>Paste URL:</strong>{" "}
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

