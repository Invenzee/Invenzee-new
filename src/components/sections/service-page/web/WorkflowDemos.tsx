import Image from "next/image";
import styles from "./WebsiteStory.module.css";

// Mirror one route so every packet travels the same distance in the same direction relative to the hub.
const mirrors = [undefined, "translate(100 0) scale(-1 1)", "translate(0 100) scale(1 -1)", "translate(100 100) scale(-1 -1)"];
const cable = "M18 25 C33 25 31 50 50 50";

export function CmsBoard() {
  return (
    <div className={styles.hub}>
      <div className={styles.header}><b>Platform studio</b><small>Invenzee / CMS</small></div>
      <div className={styles.network}>
        <svg className={styles.routes} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {mirrors.map((transform, i) => (
            <g key={i} transform={transform}>
              <path className={styles.sheath} d={cable} />
              <path className={styles.wire} d={cable} />
              <path className={styles.packet} d={cable} pathLength="100" />
            </g>
          ))}
        </svg>
        <div className={styles.core}><Image src="/brand/mark.png" alt="" width={72} height={72} /></div>
        <ul className={styles.nodes}>
          {["Shopify", "WordPress", "Wix", "Webflow"].map(name => (
            <li key={name}>
              <i data-brand={name.toLowerCase()} style={{ maskImage: "url(/brand/platforms/" + name.toLowerCase() + ".svg)" }} />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Hosting() {
  return (
    <figure className={styles.rack}>
      <Image src="/services/origin-server.webp" alt="" fill sizes="(max-width:760px) 100vw, 55vw" />
      <figcaption><span>Hostinger / Origin</span><b>Server<br /><em>online.</em></b></figcaption>
      <div className={styles.terminal}>
        <code>$ curl -I https://studio.example</code>
        <p><i />HTTP/2 200</p>
      </div>
    </figure>
  );
}

const history = [
  ["09:40", "Backup saved"],
  ["09:42", "Update applied"],
  ["09:43", "Health check passed"],
];

export function Maintenance() {
  return (
    <div className={styles.logbook}>
      <header><span>Release log</span><small>Sample run</small></header>
      <div className={styles.instrument}>
        <svg viewBox="0 0 180 180" aria-hidden="true">
          <circle cx="90" cy="90" r="76" pathLength="100" />
          <circle className={styles.scale} cx="90" cy="90" r="65" pathLength="100" />
          <path className={styles.needle} d="M90 90 141 56" /><circle className={styles.pivot} cx="90" cy="90" r="5" />
        </svg>
        <strong>184<em>ms</em></strong><small>Response time</small>
      </div>
      <ol className={styles.events}>{history.map(([time, event]) => <li key={time}><time>{time}</time><b>{event}</b></li>)}</ol>
    </div>
  );
}