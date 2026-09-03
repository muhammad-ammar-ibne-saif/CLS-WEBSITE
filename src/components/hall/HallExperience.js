"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getHallRooms } from "@/data/archive";
import HallScene from "./HallScene";

export default function HallExperience({ onClose, tenures }) {
  const rooms = useMemo(() => getHallRooms(tenures), [tenures]);
  const inputRef = useRef({ forward: false, back: false, left: false, right: false });
  const [hud, setHud] = useState({
    title: "Hall of Years",
    subtitle: "Wall of Heroes · CLS archive",
    prompt: "Click to look around. Arrows to walk.",
    event: null,
    looking: null,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  function hold(dir, value) {
    inputRef.current[dir] = value;
  }

  return (
    <div className="hall-overlay" role="dialog" aria-label="Hall of Years">
      <HallScene rooms={rooms} inputRef={inputRef} onHud={setHud} onReady={() => setReady(true)} />

      {!ready ? <div className="hall-loading">Opening the archive…</div> : null}

      <div className={`hall-veil${ready ? " in" : ""}`} />

      <header className="hall-top">
        <div>
          <p className="hall-kicker">{hud.yearLabel || "CLS"}</p>
          <h2>{hud.title}</h2>
          <p>{hud.subtitle}</p>
        </div>
        <button className="btn btn-outline hall-leave" type="button" onClick={onClose}>
          Leave the hall
        </button>
      </header>

      {hud.event ? (
        <aside className="hall-plaque">
          <p className="hall-kicker">In this year</p>
          <h3>{hud.event.name}</h3>
          <p>{hud.event.note}</p>
        </aside>
      ) : (
        <p className="hall-prompt">{hud.prompt}</p>
      )}

      <div className="hall-crosshair" aria-hidden="true" />

      <div className="hall-help">
        <span>↑ walk</span>
        <span>↓ back</span>
        <span>← → turn</span>
        <span>click look</span>
        <span>enter door</span>
      </div>

      <div className="hall-pad" aria-label="Walk controls">
        <button
          type="button"
          className="hall-pad-btn hall-pad-up"
          onPointerDown={() => hold("forward", true)}
          onPointerUp={() => hold("forward", false)}
          onPointerLeave={() => hold("forward", false)}
        >
          ↑
        </button>
        <button
          type="button"
          className="hall-pad-btn hall-pad-left"
          onPointerDown={() => hold("left", true)}
          onPointerUp={() => hold("left", false)}
          onPointerLeave={() => hold("left", false)}
        >
          ←
        </button>
        <button
          type="button"
          className="hall-pad-btn hall-pad-down"
          onPointerDown={() => hold("back", true)}
          onPointerUp={() => hold("back", false)}
          onPointerLeave={() => hold("back", false)}
        >
          ↓
        </button>
        <button
          type="button"
          className="hall-pad-btn hall-pad-right"
          onPointerDown={() => hold("right", true)}
          onPointerUp={() => hold("right", false)}
          onPointerLeave={() => hold("right", false)}
        >
          →
        </button>
      </div>
    </div>
  );
}
