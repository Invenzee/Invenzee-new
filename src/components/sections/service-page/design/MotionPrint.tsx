import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./DesignStory.module.css";

// Original cut-letter artwork, kept as paths so every campaign application
// uses the same silhouette, including the outline stage of the drawing.
const letters = [
  "M6 0H71L64 16H23V29H56L67 40V65L56 76H0L7 60H48V46H15L3 35V10Z",
  "M79 0H98V28H123V0H142V76H123V46H98V76H79Z",
  "M154 0H174V76H154Z",
  "M186 0H246L239 17H206V31H235L229 47H206V76H186Z",
  "M254 0H324L317 17H293V76H273V17H247Z",
];

export function Wordmark({ drawing = false }: { drawing?: boolean }) {
  return (
    <svg viewBox="-12 -4 353 84" aria-hidden="true" className={styles.wordmark}>
      <g transform="translate(10 0) skewX(-9)">
        {letters.map((d, index) => (
          <path key={d} d={d} pathLength="1" className={drawing ? styles.drawLetter : undefined}
            fill="currentColor" style={{ "--offset": `${index * .09}s` } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

export function IdentityProof() {
  return (
    <div className={styles.identity}>
      <div className={styles.drawing}>
        <div className={styles.guides}><i /><i /><i /></div>
        <Wordmark drawing />
        <svg className={styles.anchors} viewBox="0 0 353 84" aria-hidden="true">
          <path d="M18 5H86M18 5L7 79M7 79H68" />
          {[[18,5],[86,5],[7,79],[68,79]].map(([x,y]) => <rect key={x} x={x-1.8} y={y-1.8} width="3.6" height="3.6" />)}
        </svg>
        <div className={styles.submark}>NIGHT RUN</div>
      </div>
    </div>
  );
}

export function InkProof() {
  return (
    <div className={styles.proof}>
      <div className={styles.paper}>
        <div className={styles.cyanInk}><span>10K</span></div>
        <div className={styles.darkInk}>
          <Wordmark />
          <strong>NIGHT<br />RUN<span>↗</span></strong>
          <div className={styles.imprint}>SHIFT RUN CLUB</div>
        </div>
        <i className={styles.pressEdge} />
      </div>
      <div className={styles.swatches}>
        <span>Midnight</span><span>Signal</span><span>Paper</span>
      </div>
    </div>
  );
}

export function CampaignImage() {
  return (
    <div className={styles.imageBoard}>
      <div className={styles.photoCrop}>
        <Image src="/services/shift-night-run.webp" alt="" fill sizes="(max-width: 760px) 90vw, 50vw" />
        <div className={styles.photoShade} />
        <div className={styles.cropGrid}><i /><i /></div>
        <div className={styles.adLockup}><Wordmark /><span>RUN AFTER DARK.</span></div>
      </div>
      <div className={styles.shoeAd}>
        <Image src="/services/shift-footstrike.webp" alt="" fill sizes="(max-width: 760px) 42vw, 21vw" />
        <Wordmark />
        <span>10K</span>
      </div>
    </div>
  );
}
