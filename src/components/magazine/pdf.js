"use client";

// Loads pdf.js only in the browser, once, and points it at its worker.
let pdfjsPromise = null;

export function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

export async function openPdf(src) {
  const pdfjs = await loadPdfjs();
  // Range requests let big issues open on page 1 before the whole file has downloaded.
  return pdfjs.getDocument({ url: src, disableAutoFetch: true, isEvalSupported: false }).promise;
}

export async function renderPage(page, canvas, cssWidth) {
  const base = page.getViewport({ scale: 1 });
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const scale = cssWidth / base.width;
  const viewport = page.getViewport({ scale: scale * ratio });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  canvas.style.width = `${Math.floor(viewport.width / ratio)}px`;
  canvas.style.height = `${Math.floor(viewport.height / ratio)}px`;
  const task = page.render({ canvasContext: canvas.getContext("2d"), viewport });
  return task;
}
