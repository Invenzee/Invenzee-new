"use client";

/* Page-ready signal. The Preloader calls markReady() when it finishes;
   the Hero (and anything else) starts its intro via onReady(). */

const EVENT = "invenzee:ready";
let ready = false;

export function isReady() {
  return ready;
}

export function markReady() {
  if (ready) return;
  ready = true;
  document.documentElement.dataset.ready = "true";
  window.dispatchEvent(new Event(EVENT));
}

/** Runs `cb` once the preloader has finished (immediately if it already has). Returns an unsubscribe. */
export function onReady(cb: () => void): () => void {
  if (ready) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}
