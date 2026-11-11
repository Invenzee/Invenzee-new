"use client";

import { useSyncExternalStore } from "react";

const PLACEHOLDER = "--:--";

function subscribeToClock(onTick: () => void) {
  const id = window.setInterval(onTick, 10_000);
  return () => window.clearInterval(id);
}

function formatTime(timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date());
}

/** Live HH:MM for a time zone. Renders "--:--" on the server and during hydration. */
export function LiveClock({
  timeZone,
  className = "",
}: {
  timeZone: string;
  className?: string;
}) {
  const time = useSyncExternalStore(
    subscribeToClock,
    () => formatTime(timeZone),
    () => PLACEHOLDER,
  );
  return <time className={`tabular-nums ${className}`}>{time}</time>;
}

const noopSubscribe = () => () => {};

/** Current year, read on the client (keeps server components free of `new Date()`). */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => 2026,
  );
  return <span>{year}</span>;
}
