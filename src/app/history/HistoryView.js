"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import Ornament from "@/components/Ornament";

const HallExperience = dynamic(() => import("@/components/hall/HallExperience"), {
  ssr: false,
  loading: () => (
    <div className="hall-overlay">
      <div className="hall-loading">Opening the archive…</div>
    </div>
  ),
});

export default function HistoryView({ page, tenures }) {
  const [open, setOpen] = useState(0);
  const [hall, setHall] = useState(false);

  return (
    <>
      <section className="hero">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">{page.title}</h1>
            <p className="lede">{page.lede}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Link className="btn btn-outline" href="#wall">
                <img src="/assets/blocks.svg" alt="" width={16} height={16} />
                See Wall of Heroes
              </Link>
              <button className="btn" type="button" onClick={() => setHall(true)}>
                Enter the Hall of Years
              </button>
            </div>
          </div>
          <Ornament />
        </div>
      </section>

      <section className="section" id="wall" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="page-head">
            {page.calligraphyImage ? (
              <img className="calligraphy lg" src={page.calligraphyImage} alt="" />
            ) : null}
            <h2 className="headline">{page.headline}</h2>
          </div>
          <div className="hall-cta">
            <p className="body">
              Step through the Wall of Heroes. Every door is a year. Behind it, the events of that tenure are scattered through a room you can walk.
            </p>
            <button className="btn btn-outline" type="button" onClick={() => setHall(true)}>
              Enter the Hall of Years
            </button>
          </div>
          {hall ? <HallExperience tenures={tenures} onClose={() => setHall(false)} /> : null}
          <div className="accordion">
            {tenures.map((tenure, index) => {
              const events = (tenure.events || []).map((item) =>
                typeof item === "string" ? { name: item } : item,
              );
              return (
                <article className={`acc-item${open === index ? " open" : ""}`} key={tenure.title}>
                  <button className="acc-head" type="button" onClick={() => setOpen(open === index ? -1 : index)}>
                    <div>
                      <h3>{tenure.title}</h3>
                      <p>President: {tenure.president}</p>
                    </div>
                    <img src="/assets/chevron-down.svg" alt="" width={24} height={24} />
                  </button>
                  {tenure.summary ? (
                    <div className="acc-body">
                      <div className="tenure">
                        <div className="person">
                          <img src={tenure.portrait || "/assets/history-portrait.png"} alt="" />
                          <h3>{tenure.president}</h3>
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, marginBottom: 16 }}>
                            Summary of events
                          </h3>
                          <p className="body">{tenure.summary}</p>
                        </div>
                      </div>
                      <div className="tenure-events">
                        {events.map((event, i) => (
                          <div className="person" key={`${event.name}-${i}`}>
                            <img src={event.image || "/assets/portrait-frame.png"} alt="" />
                            <h3>{event.name}</h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="acc-body">
                      <p className="body">
                        Records for this tenure are being gathered from the CLS archive. The society continued its workshops, readings, and campus gatherings under {tenure.president}.
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
