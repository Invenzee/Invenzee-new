import type { Service } from "@/content/site";
import { ServiceStory, type StoryChapter } from "../ServiceStory";
import { ShipmentPortal } from "./ShipmentPortal";
import s from "./SoftwareStory.module.css";

function DispatchBoard() {
  return (
    <div className={s.board}>
      <header className={s.bar}><b>Relay / Dispatch</b><span>Morning shift</span></header>
      <div className={s.boardBody}>
        <strong className={s.display}>Dock schedule</strong>
        <div className={s.hours}><span>08:00</span><span>09:00</span><span>10:00</span></div>
        <div className={s.schedule}>
          {["Collection", "Inspection", "Loading"].map((task, i) => (
            <div className={s.lane} key={task}><small>Bay 0{i + 1}</small><b>{task}</b></div>
          ))}
          <i className={s.now} />
        </div>
      </div>
    </div>
  );
}

function MobileScanner() {
  return (
    <div className={s.mobile}>
      <div className={s.phone}>
        <small>RELAY / FIELD APP</small><strong>Scan parcel</strong>
        <div className={s.reader}><i className={s.barcode} /><b /></div>
        <span className={s.receipt}>✓ Parcel received</span>
      </div>
      <div className={s.label}><small>DISPATCH LABEL</small><b>LDN</b><span>Parcel #1042</span><i className={s.barcode} /></div>
    </div>
  );
}

function Integration() {
  return (
    <div className={s.integration}>
      <div className={s.event}><small>WAREHOUSE EVENT</small><strong>Parcel collected</strong><span>Shipment #1042</span></div>
      <div className={s.link}><i /></div>
      <div className={s.endpoint}><header className={s.bar}><b>Delivery API</b><span>200 OK</span></header>
        <pre>{'{\n  "shipment": 1042,\n  "status": "collected"\n}'}</pre>
      </div>
    </div>
  );
}

function Automation() {
  return (
    <div className={s.rules}>
      <div className={s.ruleTitle}><small>DISPATCH RULE</small><strong>Route incoming orders</strong></div>
      <div className={s.trigger}>Order received</div>
      <div className={s.branches}>
        <div><small>Within weight limit</small><b>Create label</b><i>✓ Ready to ship</i></div>
        <div><small>Over weight limit</small><b>Assign review</b><i>↗ Dispatch team</i></div>
      </div>
    </div>
  );
}

const chapters: StoryChapter[] = [
  { id: "custom-software", label: "Software development", heading: ["Custom", "Software"], Art: DispatchBoard,
    detail: "Replace the spreadsheet your team has outgrown. We build software around your schedules, permissions, and handovers so everyone works from the same record." },
  { id: "web-applications", heading: ["Web", "Applications"], Art: ShipmentPortal, interactive: true,
    detail: "Give staff and customers a portal where they can find an order, check its status, or act on a delay. Try filtering shipments in the dispatch demo." },
  { id: "mobile-apps", heading: ["Mobile", "Apps"], Art: MobileScanner,
    detail: "Put the next task in your field team’s hands. We build mobile apps for scanning items, recording visits, and sending updates back to the office." },
  { id: "api-integrations", heading: ["APIs &", "Integrations"], Art: Integration,
    detail: "Connect the tools you already use. We build APIs and sync records across systems so a warehouse scan can update the order your customer sees." },
  { id: "automation", heading: ["Workflow", "Automation"], Art: Automation,
    detail: "Turn repeatable decisions into rules. We automate routine steps, route exceptions to the right person, and give your team a record of what happened." },
];

export function SoftwareStory({ service }: { service: Service }) {
  return <ServiceStory service={service} chapters={chapters} />;
}
