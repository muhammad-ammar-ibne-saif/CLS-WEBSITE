"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { openPdf, renderPage } from "./pdf";

const SPREAD_MIN_WIDTH = 900;
// Multiples of the "fit to screen" size.
const ZOOM_STEPS = [1.5, 2, 2.5, 3, 4];

// Pages shown together: the cover alone, then facing pairs (2–3, 4–5, …) like a printed magazine.
function viewFor(page, total, spread) {
  if (!spread || page === 1) return [page];
  const left = page % 2 === 0 ? page : page - 1;
  return left + 1 <= total ? [left, left + 1] : [left];
}

function stepFrom(page, total, spread, direction) {
  const view = viewFor(page, total, spread);
  const next = direction > 0 ? view[view.length - 1] + 1 : view[0] - 1;
  if (next < 1 || next > total) return page;
  return viewFor(next, total, spread)[0];
}

export default function MagazineReader({ src, title }) {
  const shell = useRef(null);
  const stage = useRef(null);
  const canvases = useRef([]);
  const touch = useRef(null);
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rendering, setRendering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  // Text being typed into the page box; null means "show the current page".
  const [draft, setDraft] = useState(null);

  const total = doc?.numPages || 0;
  const spread = size.width >= SPREAD_MIN_WIDTH && zoom === 0;
  const view = total ? viewFor(page, total, spread) : [];

  useEffect(() => {
    let cancelled = false;
    let loaded = null;
    openPdf(src)
      .then((pdf) => {
        if (cancelled) {
          pdf.destroy();
          return;
        }
        loaded = pdf;
        setDoc(pdf);
      })
      .catch(() => {
        if (!cancelled) setError("This issue could not be opened in the browser. Use Download instead.");
      });
    return () => {
      cancelled = true;
      loaded?.destroy();
    };
  }, [src]);

  useEffect(() => {
    if (!stage.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!doc || !size.width) return undefined;
    let cancelled = false;
    const tasks = [];
    const pages = viewFor(page, doc.numPages, spread);

    async function draw() {
      setRendering(true);
      try {
        const loaded = await Promise.all(pages.map((n) => doc.getPage(n)));
        if (cancelled) return;
        const gap = pages.length > 1 ? 4 : 0;
        const pad = 24;
        const availW = (size.width - pad * 2 - gap) / pages.length;
        const availH = size.height - pad * 2;
        const widest = loaded.reduce((max, p) => {
          const vp = p.getViewport({ scale: 1 });
          const fit = Math.min(availW / vp.width, availH / vp.height);
          return Math.min(max, fit * vp.width);
        }, Infinity);
        const fitWidth = zoom === 0 ? widest : widest * ZOOM_STEPS[zoom - 1];
        for (let i = 0; i < loaded.length; i += 1) {
          const canvas = canvases.current[i];
          if (!canvas || cancelled) return;
          const task = await renderPage(loaded[i], canvas, Math.max(120, fitWidth));
          tasks.push(task);
          await task.promise;
        }
      } catch (err) {
        if (!cancelled && err?.name !== "RenderingCancelledException") {
          setError("A page failed to load. Try again or download the PDF.");
        }
      } finally {
        if (!cancelled) setRendering(false);
      }
    }

    draw();
    return () => {
      cancelled = true;
      tasks.forEach((task) => task.cancel());
    };
  }, [doc, page, spread, zoom, size.width, size.height]);

  const go = useCallback(
    (direction) => {
      if (!total) return;
      stage.current?.scrollTo({ top: 0, left: 0 });
      setPage((current) => stepFrom(current, total, spread, direction));
    },
    [total, spread],
  );

  const jump = useCallback(
    (value) => {
      const n = Math.min(Math.max(1, Number(value) || 1), total || 1);
      stage.current?.scrollTo({ top: 0, left: 0 });
      setPage(n);
      setDraft(null);
    },
    [total],
  );

  useEffect(() => {
    function onKey(event) {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") go(1);
      if (event.key === "ArrowLeft" || event.key === "PageUp") go(-1);
      if (event.key === "Home") jump(1);
      if (event.key === "End") jump(total);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, jump, total]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === shell.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else shell.current?.requestFullscreen?.().catch(() => {});
  }

  function onTouchStart(event) {
    if (zoom !== 0 || event.touches.length !== 1) return;
    touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  function onTouchEnd(event) {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  }

  const label = view.length > 1 ? `${view[0]}–${view[1]}` : `${view[0] || 0}`;
  const atStart = !total || view[0] <= 1;
  const atEnd = !total || view[view.length - 1] >= total;

  return (
    <div ref={shell} className={`mag-reader${fullscreen ? " is-fullscreen" : ""}`}>
      <div className="mag-toolbar" role="toolbar" aria-label="Magazine controls">
        <div className="mag-tool-group">
          <button type="button" onClick={() => go(-1)} disabled={atStart} aria-label="Previous page">
            ‹
          </button>
          <form
            className="mag-page-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (draft !== null) jump(draft);
            }}
          >
            <input
              aria-label="Page number"
              inputMode="numeric"
              value={draft ?? String(view[0] || 1)}
              onChange={(event) => setDraft(event.target.value.replace(/\D/g, ""))}
              onBlur={() => (draft === null ? null : jump(draft))}
            />
            <span>
              {view.length > 1 ? `(${label}) ` : ""}/ {total || "…"}
            </span>
          </form>
          <button type="button" onClick={() => go(1)} disabled={atEnd} aria-label="Next page">
            ›
          </button>
        </div>
        <div className="mag-tool-group">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0, z - 1))}
            disabled={zoom === 0}
            aria-label="Zoom out"
          >
            −
          </button>
          <button type="button" className="mag-fit" onClick={() => setZoom(0)} aria-label="Fit to screen">
            {zoom === 0 ? "Fit" : `${Math.round(ZOOM_STEPS[zoom - 1] * 100)}%`}
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(ZOOM_STEPS.length, z + 1))}
            disabled={zoom === ZOOM_STEPS.length}
            aria-label="Zoom in"
          >
            +
          </button>
          <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit full screen" : "Full screen"}>
            {fullscreen ? "⤡" : "⤢"}
          </button>
          <a className="mag-download" href={src} download aria-label={`Download ${title}`}>
            <img src="/assets/download.svg" alt="" width={16} height={16} />
          </a>
        </div>
      </div>

      <div
        ref={stage}
        className={`mag-stage${zoom ? " is-zoomed" : ""}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-live="polite"
      >
        {error ? (
          <div className="mag-error">
            <p className="lede">{error}</p>
            <a className="btn btn-outline" href={src} download>
              Download PDF
            </a>
          </div>
        ) : !doc ? (
          <p className="mag-loading">Opening {title}…</p>
        ) : (
          <div className={`mag-spread${view.length > 1 ? " is-pair" : ""}${rendering ? " is-busy" : ""}`}>
            {view.map((n, i) => (
              <canvas
                key={`${n}-${view.length}`}
                ref={(node) => {
                  canvases.current[i] = node;
                }}
                aria-label={`Page ${n} of ${total}`}
                role="img"
              />
            ))}
          </div>
        )}
        {doc && !error ? (
          <>
            <button type="button" className="mag-edge mag-edge-prev" onClick={() => go(-1)} disabled={atStart} aria-label="Previous page" />
            <button type="button" className="mag-edge mag-edge-next" onClick={() => go(1)} disabled={atEnd} aria-label="Next page" />
          </>
        ) : null}
      </div>
    </div>
  );
}
