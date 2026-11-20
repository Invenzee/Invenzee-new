import Image from "next/image";
import type { Service } from "@/content/site";
import { ServiceStory, type StoryChapter } from "../ServiceStory";
import { ApprovalDemo, CmsDemo } from "./WorkflowDemos";
import styles from "./WebsiteStory.module.css";

function CustomSite() {
  return (
    <div className={styles.build}>
      <div className={styles.spec}><span>portfolio.css</span><code>display: grid;</code><code>gap: 24px;</code></div>
      <div className={styles.browser}>
        <div className={styles.url}>court-bureau.example</div>
        <div className={styles.siteHeader}><b>Court Bureau</b><span>Architecture ↗</span></div>
        <div className={styles.coverPhoto}><Image src="/services/court-pavilion.webp" alt="" fill sizes="(max-width: 760px) 85vw, 42vw" /></div>
        <div className={styles.caption}><strong>Travertine pavilion</strong><span>Selected work / 01</span></div>
      </div>
    </div>
  );
}

function Hosting() {
  return (
    <div className={styles.host}>
      <div className={styles.address}><small>DOMAIN</small><strong>court-bureau.example</strong></div>
      <div className={styles.conduit}><i /><i /></div>
      <div className={styles.nodes}>
        <div><small>DNS RECORD</small><strong>A <i>→</i> 192.0.2.8</strong></div>
        <div><small>TLS CERTIFICATE</small><strong>HTTPS <i>✓</i></strong></div>
      </div>
      <div className={styles.conduit}><i /><i /></div>
      <div className={styles.origin}><span>Hostinger</span><b>● Origin online</b></div>
    </div>
  );
}

const responseTimes = [62, 58, 67, 77, 72, 90, 65, 69, 75, 82, 70, 73, 47, 39, 42, 35, 37, 30, 32, 28, 31, 30, 25, 27];

function Maintenance() {
  return (
    <div className={styles.release}>
      <header><small>RELEASE MONITOR</small><strong>Site response</strong></header>
      <div className={styles.chart}>
        {responseTimes.map((height, i) => <i key={i} style={{height: height + "%", animationDelay: i * .075 + "s"}} />)}
        <span>Update deployed</span>
      </div>
      <div className={styles.log}><b>✓</b> Pre-update backup saved<br /><b>✓</b> Staging checks passed<br /><b>✓</b> Production updated</div>
    </div>
  );
}

const chapters: StoryChapter[] = [
  { id: "custom-websites", label: "Website development", heading: ["Custom", "Websites"],
    detail: "We design and build your site around the work you want to show and the action you want customers to take, from a first impression on mobile to a project enquiry.", Art: CustomSite },
  { id: "cms-websites", heading: ["CMS", "Websites"],
    detail: "Give your team an editor built around your content. Add projects, update services, and publish when you’re ready. Try changing a project title in the demo.", Art: CmsDemo, interactive: true },
  { id: "domain-hosting", heading: ["Domains &", "Hostinger Hosting"],
    detail: "We connect your domain, configure your Hostinger hosting and HTTPS certificate, and handle the switch when your site is ready to launch.", Art: Hosting },
  { id: "website-maintenance", heading: ["Website", "Maintenance"],
    detail: "Keep your site healthy after launch. We back it up, test updates on staging, and check performance and customer journeys after each release.", Art: Maintenance },
  { id: "web-applications", heading: ["Web", "Applications"],
    detail: "Give clients and staff a shared place to manage requests, approvals, and handovers. Move a sample drawing through review to see how a custom portal can work.", Art: ApprovalDemo, interactive: true },
];

export function WebsiteStory({ service }: { service: Service }) {
  return <ServiceStory chapters={chapters} service={service} />;
}
