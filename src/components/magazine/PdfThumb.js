"use client";

import { useEffect, useRef, useState } from "react";
import { openPdf, renderPage } from "./pdf";

// First page of a PDF, drawn once the card scrolls near the viewport.
export default function PdfThumb({ src, title }) {
  const holder = useRef(null);
  const canvas = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src || !holder.current) return undefined;
    let cancelled = false;
    let doc = null;
    let task = null;

    const draw = async () => {
      try {
        doc = await openPdf(src);
        const page = await doc.getPage(1);
        if (cancelled || !canvas.current) return;
        task = await renderPage(page, canvas.current, holder.current.clientWidth || 320);
        await task.promise;
      } catch (error) {
        if (!cancelled && error?.name !== "RenderingCancelledException") setFailed(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          draw();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(holder.current);

    return () => {
      cancelled = true;
      observer.disconnect();
      task?.cancel();
      doc?.destroy();
    };
  }, [src]);

  return (
    <div ref={holder} className="mag-thumb" role="img" aria-label={`${title} cover`}>
      {failed ? <span className="mag-thumb-fallback">{title}</span> : <canvas ref={canvas} />}
    </div>
  );
}
