"use client";

import { useState } from "react";
import MediaPreview from "./MediaPreview";
import { kindFromAccept, uploadFile } from "./upload";
import { isVideoUrl } from "@/lib/utils";

export default function MediaField({ name, label, defaultValue = "", accept = "image/*", library = false }) {
  const [state, setState] = useState({ url: defaultValue || "", busy: false, error: "", picking: false, items: null });
  const patch = (next) => setState((current) => ({ ...current, ...next }));

  async function onFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    patch({ busy: true, error: "" });
    try {
      const data = await uploadFile(file);
      patch({ url: data.url, busy: false, items: null });
    } catch (error) {
      patch({ busy: false, error: error.message });
    }
  }

  async function toggleLibrary() {
    if (state.picking) {
      patch({ picking: false });
      return;
    }
    patch({ picking: true, error: "" });
    if (state.items) return;
    try {
      const kind = kindFromAccept(accept);
      const response = await fetch(`/api/uploads?kind=${kind}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Library unavailable.");
      patch({ items: data.items });
    } catch (error) {
      patch({ error: error.message, picking: false });
    }
  }

  return (
    <div className="form-field">
      <span className="dash-label">{label}</span>
      <input type="hidden" name={name} value={state.url} />
      <div className="media-tools">
        <input type="file" accept={accept} onChange={onFile} disabled={state.busy} />
        {library ? (
          <button type="button" className="btn" onClick={toggleLibrary}>
            {state.picking ? "Close library" : "Pick from library"}
          </button>
        ) : null}
        {state.url ? (
          <button type="button" className="dash-mini" onClick={() => patch({ url: "" })}>
            Clear
          </button>
        ) : null}
      </div>
      <input
        type="text"
        inputMode="url"
        value={state.url}
        onChange={(event) => patch({ url: event.target.value })}
        placeholder="or paste a URL"
      />
      {state.busy ? <span className="dash-hint">Uploading…</span> : null}
      {state.error ? (
        <span className="dash-error" role="alert">
          {state.error}
        </span>
      ) : null}
      {state.picking && state.items ? (
        <div className="media-pick">
          {state.items.length === 0 ? <span className="dash-hint">Nothing uploaded yet.</span> : null}
          {state.items.map((item) => (
            <button
              type="button"
              key={item.id}
              title={item.filename}
              onClick={() => patch({ url: item.url, picking: false })}
            >
              {isVideoUrl(item.url) ? (
                <video src={item.url} muted preload="metadata" />
              ) : (
                <img src={item.url} alt={item.filename} loading="lazy" decoding="async" />
              )}
            </button>
          ))}
        </div>
      ) : null}
      <MediaPreview url={state.url} />
    </div>
  );
}
