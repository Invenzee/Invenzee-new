"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { nav, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { setScrollLocked } from "@/components/providers/SmoothScroll";
import { onReady } from "@/lib/ready";
import styles from "./Nav.module.css";

export function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let timer = 0;
    const off = onReady(() => {
      timer = window.setTimeout(() => {
        header.dataset.shown = "true";
      }, 0);
    });
    return () => {
      off();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    let condensed = false;

    const apply = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const next = y >= 80;
      if (next === condensed) return;
      condensed = next;
      shell.dataset.condensed = next ? "true" : "false";
    };

    apply();
    window.addEventListener("scroll", apply, { passive: true });
    return () => window.removeEventListener("scroll", apply);
  }, []);

  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const lock = () => setScrollLocked(true);
    lock();
    /* The preloader unlocks on its own timeline. If the menu is already
       open, put the lock back when that class drops. */
    const observer = new MutationObserver(() => {
      if (!document.documentElement.classList.contains("is-loading")) lock();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      setScrollLocked(false);
      requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y);
      });
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onNavigate = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 ${styles.header}`}
      onClick={onNavigate}
    >
      <div ref={shellRef} className={styles.shell} data-condensed="false">
        <a href="#main" className={styles.brand} aria-label="Invenzee, home">
          <Logo variant="full" height={30} priority />
        </a>

        <nav className={styles.desktop} aria-label="Primary">
          <ul className={styles.list}>
            {nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={nav.cta.href} variant="primary" size="md">
            {nav.cta.label}
          </Button>
        </nav>

        <div className={styles.mobile}>
          <div className={styles.compactCta}>
            <Button href={nav.cta.href} variant="primary" size="md">
              {nav.cta.label}
            </Button>
          </div>
          <button
            type="button"
            className={styles.burger}
            data-open={open ? "true" : "false"}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={styles.lines} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={styles.menu}
        data-open={open ? "true" : "false"}
        data-lenis-prevent=""
        inert={open ? undefined : true}
        aria-hidden={open ? undefined : true}
      >
        <nav aria-label="Menu">
          <ul className={styles.menuList}>
            {nav.links.map((link, index) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`t-h2 ${styles.menuLink}`}
                  style={{ "--i": index } as CSSProperties}
                >
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.foot}>
          <a className={styles.email} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className={styles.phones}>
            {site.phones.map((phone) => (
              <a key={phone.href} className={`t-small ${styles.phone}`} href={phone.href}>
                <span className="t-label">{phone.label}</span> {phone.display}
              </a>
            ))}
          </div>
          <Button href={nav.cta.href} variant="primary" size="md">
            {nav.cta.label}
          </Button>
        </div>
      </div>
    </header>
  );
}
