"use client";

import { useState } from "react";

export default function MediaField({ name, label, defaultValue = "", accept = "image/*" }) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/uploads", { method: "POST", body });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Upload failed.");
      return;
    }
    setUrl(data.url);
  }

  return (
    <label>
      {label}
      <input type="hidden" name={name} value={url} />
      <input type="file" accept={accept} onChange={onFile} />
      <input
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="or paste a URL"
      />
      {busy ? <span className="dash-hint">Uploading…</span> : null}
      {error ? <span className="dash-error">{error}</span> : null}
      {url ? (
        url.match(/\.(mp4|webm)$/i) || url.includes("video") ? (
          <video src={url} className="dash-preview" controls />
        ) : (
          <img src={url} alt="" className="dash-preview" />
        )
      ) : null}
    </label>
  );
}
