"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadFile } from "./upload";

export default function MediaUploader() {
  const router = useRouter();
  const [state, setState] = useState({ busy: false, done: 0, total: 0, errors: [] });

  async function onFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    setState({ busy: true, done: 0, total: files.length, errors: [] });
    const errors = [];
    for (let index = 0; index < files.length; index += 1) {
      try {
        await uploadFile(files[index]);
      } catch (error) {
        errors.push(`${files[index].name}: ${error.message}`);
      }
      setState({ busy: true, done: index + 1, total: files.length, errors });
    }
    setState({ busy: false, done: files.length, total: files.length, errors });
    router.refresh();
  }

  return (
    <div className="media-drop">
      <p className="dash-label">Upload images, videos or PDFs</p>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,application/pdf"
        onChange={onFiles}
        disabled={state.busy}
      />
      <p className="dash-hint">
        Images are resized to 2000px and converted to WebP automatically. Videos up to 40MB.
      </p>
      {state.busy ? (
        <p className="dash-hint">
          Uploading {state.done} of {state.total}…
        </p>
      ) : null}
      {!state.busy && state.total > 0 && state.errors.length === 0 ? (
        <p className="dash-ok">Uploaded {state.total} file(s).</p>
      ) : null}
      {state.errors.map((message) => (
        <p className="dash-error" key={message}>
          {message}
        </p>
      ))}
    </div>
  );
}
