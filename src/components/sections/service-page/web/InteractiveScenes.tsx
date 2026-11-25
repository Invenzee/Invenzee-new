"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import styles from "./WebsiteStory.module.css";

export function DesignReveal() {
  const [reveal, setReveal] = useState(70);
  return (
    <div className={styles.workbench} style={{ "--reveal": reveal + "%" } as CSSProperties}>
      <div className={styles.specimen}>
        <div className={styles.outline} aria-hidden="true">
          <b>Court Bureau</b><i /><span>Courtyard residence</span>
        </div>
        <div className={styles.finished}>
          <Image src="/services/court-pavilion.webp" alt="A finished architectural portfolio featuring a travertine courtyard" fill sizes="(max-width:760px) 90vw, 45vw" />
          <span>Court Bureau®</span><b>Courtyard<br /><em>residence.</em></b>
        </div>
        <div className={styles.divider} aria-hidden="true"><span>↔</span></div>
        <input className={styles.slider} type="range" min="0" max="100" value={reveal} aria-label="Compare wireframe and finished website" aria-valuetext={reveal + "% finished design"} onChange={event => setReveal(Number(event.target.value))} />
      </div>
      <div className={styles.ruler}><span>Finished site</span><span>Wireframe</span></div>
    </div>
  );
}

export function ClientDesk() {
  const [approved, setApproved] = useState(false);
  return (
    <div className={styles.desk} data-approved={approved}>
      <div className={styles.folder}><span>Project files</span></div>
      <article className={styles.drawing}>
        <header><span>Court Bureau</span><small>A–102</small></header>
        <div className={styles.plan}><Image src="/services/court-floorplan.webp" alt="Architectural drawing of the pavilion ground floor" fill sizes="(max-width:760px) 76vw, 34vw" /></div>
        <footer>Ground floor plan</footer>
      </article>
      <div className={styles.signoff}>
        <small>Client sign-off</small><strong aria-live="polite">{approved ? "Drawing approved" : "Ready for review"}</strong>
        <button type="button" onClick={() => setApproved(!approved)}>{approved ? "Reopen review" : "Approve drawing"} <span aria-hidden="true">{approved ? "↶" : "↗"}</span></button>
      </div>
    </div>
  );
}
