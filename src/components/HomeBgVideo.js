"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function subscribe(query) {
  return (notify) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", notify);
    return () => list.removeEventListener("change", notify);
  };
}

function useMedia(query) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function useSaveData() {
  return useSyncExternalStore(
    () => () => {},
    () => navigator.connection?.saveData === true,
    () => false,
  );
}

export default function HomeBgVideo({ src }) {
  const wide = useMedia("(min-width: 761px)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const saver = useSaveData();
  const [docked, setDocked] = useState(false);
  const enabled = Boolean(src) && wide && !reduce && !saver;

  useEffect(() => {
    if (!enabled) return;
    const footer = document.querySelector(".footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setDocked(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`home-wash${docked ? " is-docked" : ""}`} aria-hidden="true">
      <video autoPlay muted loop playsInline preload="metadata">
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
