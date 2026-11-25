"use client";

import { useState } from "react";
import s from "./SoftwareStory.module.css";

const shipments = [
  { id: "1042", destination: "London", status: "Collected" },
  { id: "1043", destination: "Leeds", status: "Delayed" },
  { id: "1044", destination: "Bristol", status: "In transit" },
];

export function ShipmentPortal() {
  const [delayed, setDelayed] = useState(false);
  const visible = delayed ? shipments.filter(shipment => shipment.status === "Delayed") : shipments;
  return (
    <div className={s.portal} role="group" aria-label="Shipment portal demo">
      <header className={s.bar}><b>Relay / Portal</b><span>Demo workspace</span></header>
      <div className={s.portalBody}>
        <strong className={s.display}>Shipments</strong>
        <div className={s.filters}>
          <button type="button" aria-pressed={!delayed} onClick={() => setDelayed(false)}>All shipments</button>
          <button type="button" aria-pressed={delayed} onClick={() => setDelayed(true)}>Delayed</button>
        </div>
        <ul aria-live="polite">{visible.map(item => (
          <li key={item.id}><small>#{item.id}</small><b>{item.destination}</b><span>{item.status}</span></li>
        ))}</ul>
      </div>
    </div>
  );
}
