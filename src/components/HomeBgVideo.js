"use client";

import { useEffect, useRef } from "react";

export default function HomeBgVideo({ src }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const stage = node?.closest(".home-stage");
    if (!node || !stage) return;

    const update = () => {
      const bottom = stage.getBoundingClientRect().bottom;
      node.classList.toggle("is-docked", bottom <= window.innerHeight);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!src) return null;

  return (
    <div className="home-bg-slot">
      <aside className="home-bg" ref={ref} aria-hidden="true">
        <video autoPlay muted loop playsInline preload="auto">
          <source src={src} type="video/mp4" />
        </video>
      </aside>
    </div>
  );
}
