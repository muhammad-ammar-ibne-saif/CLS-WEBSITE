"use client";

import Link from "next/link";
import { useState } from "react";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { tenures } from "@/data/site";

export default function HistoryPage() {
  const [open, setOpen] = useState(0);

  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">Legacy Shaped By Some Brilliant Minds Since 2016</h1>
            <p className="lede">
              CLS saw 11 presidents serve the society, each for one year where everyone contributed with the best of their efforts to the overall growth of society, to the point where it is today.
            </p>
            <Link className="btn btn-outline" href="#wall">
              <img src="/assets/blocks.svg" alt="" width={16} height={16} />
              See Wall of Heroes
            </Link>
          </div>
          <Ornament />
        </div>
      </section>

      <section className="section" id="wall" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="page-head">
            <img className="calligraphy lg" src="/assets/calligraphy-history.png" alt="Urdu calligraphy" />
            <h2 className="headline">A Story of Legacy &amp; Love For Literature</h2>
          </div>
          <div className="accordion">
            {tenures.map((tenure, index) => (
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
                        <img src="/assets/history-portrait.png" alt="" />
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
                      {(tenure.events || []).map((name, i) => (
                        <div className="person" key={`${name}-${i}`}>
                          <img src="/assets/portrait-frame.png" alt="" />
                          <h3>{name}</h3>
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
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
