"use client";

import { useEffect, useRef } from "react";

export default function HomeBgVideo({ src }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const footer = document.querySelector(".footer");
    if (!node || !footer) return;

    const update = () => {
      node.classList.toggle("is-docked", footer.getBoundingClientRect().top < window.innerHeight);
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
    <div className="home-wash" ref={ref} aria-hidden="true">
      <video autoPlay muted loop playsInline preload="auto">
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
