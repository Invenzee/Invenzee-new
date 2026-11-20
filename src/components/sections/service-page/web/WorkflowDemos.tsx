"use client";

import { useState } from "react";
import styles from "./WebsiteStory.module.css";

export function CmsDemo() {
  const [published, setPublished] = useState("Courtyard house");
  const [draft, setDraft] = useState("Travertine pavilion");
  return (
    <div className={styles.cms}>
      <div className={styles.catalog}>
        <div className={styles.catalogHead}>Court Bureau <span>Project index</span></div>
        <div className={styles.listing}><small>01</small><strong aria-live="polite">{published}</strong><i>↗</i></div>
        <div className={styles.listing}><small>02</small><strong>North gallery</strong><i>↗</i></div>
      </div>
      <form className={styles.editor} onSubmit={(event) => { event.preventDefault(); setPublished(draft.trim()); }}>
        <label htmlFor="project-title">Edit project title</label>
        <input id="project-title" maxLength={32} value={draft} onChange={event => setDraft(event.target.value)} />
        <button disabled={!draft.trim() || draft.trim() === published}>{draft.trim() === published ? "Published ✓" : "Publish to demo ↗"}</button>
      </form>
    </div>
  );
}

const stages = ["Submitted", "In review", "Approved"];

export function ApprovalDemo() {
  const [stage, setStage] = useState(0);
  return (
    <div className={styles.workflow}>
      <div className={styles.appBar}><b>Studio desk</b><span>Client portal demo</span></div>
      <div className={styles.request}>
        <small>DESIGN REQUEST / 024</small><strong>Pavilion drawings</strong>
        <div className={styles.progress} aria-hidden="true">
          {stages.map((name, index) => <i key={name} data-active={index <= stage} />)}
        </div>
        <ol>{stages.map((name, index) => <li key={name} data-active={index === stage}>{name}</li>)}</ol>
        <div className={styles.action}>
          <span aria-live="polite">{stages[stage]}</span>
          <button onClick={() => setStage((stage + 1) % stages.length)}>{["Start review", "Approve drawings", "Try again"][stage]} ↗</button>
        </div>
      </div>
    </div>
  );
}
