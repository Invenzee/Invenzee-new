"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { nav, navMenus, site, type HeadingPart } from "@/content/site";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Flag } from "@/components/ui/Flag";
import { getLenis, setScrollLocked } from "@/components/providers/SmoothScroll";
import { onReady } from "@/lib/ready";
import styles from "./Nav.module.css";

export function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<keyof typeof navMenus | null>(null);

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
    if ((event.target as HTMLElement).closest("a")) {
      setOpen(false);
      setMenu(null);
    }
  };

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 ${styles.header}`}
      onClick={onNavigate}
    >
      <div
        ref={shellRef}
        className={styles.shell}
        data-condensed="false"
        onMouseLeave={() => setMenu(null)}
      >
        <a
          href="/"
          className={styles.brand}
          aria-label="Invenzee, home"
          onClick={(event) => {
            if (window.location.pathname !== "/") return;
            event.preventDefault();
            const lenis = getLenis();
            if (lenis) lenis.scrollTo("#main");
            else document.getElementById("main")?.scrollIntoView();
          }}
        >
          <Logo variant="full" height={30} priority />
        </a>

        <nav className={styles.desktop} aria-label="Primary">
          <ul className={styles.list}>
            {nav.links.map((link) => {
              const key = "menu" in link ? link.menu : undefined;
              const active = key != null && menu === key;
              return (
                <li
                  key={link.href}
                  className={styles.item}
                  onMouseEnter={() => setMenu(key ?? null)}
                >
                  <a
                    href={link.href}
                    className={styles.link}
                    data-open={active ? "true" : undefined}
                    aria-expanded={key ? active : undefined}
                    aria-haspopup={key ? "true" : undefined}
                    onFocus={() => setMenu(key ?? null)}
                  >
                    <span className={styles.linkMark} aria-hidden="true" />
                    {link.label}
                  </a>
                  {active && key ? <MenuPanel name={key} /> : null}
                </li>
              );
            })}
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
            {nav.links.map((link, index) => {
              const key = "menu" in link ? link.menu : undefined;
              return (
                <MobileItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  menu={key}
                  open={open}
                  index={index}
                />
              );
            })}
          </ul>
        </nav>

        <div className={styles.foot}>
          <a className={styles.email} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className={styles.phones}>
            {site.phones.map((phone) => (
              <a key={phone.href} className={`t-small ${styles.phone}`} href={phone.href}>
                <Flag code={phone.flag} /> {phone.display}
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

function MobileItem({
  href,
  label,
  menu,
  open,
  index,
}: {
  href: string;
  label: string;
  menu?: keyof typeof navMenus;
  open: boolean;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setActive(0);
    }
  }, [open]);

  return (
    <li className={styles.menuItem} style={{ "--i": index } as CSSProperties}>
      {menu ? (
        <button
          type="button"
          className={`t-h2 ${styles.menuLink}`}
          data-open={expanded ? "true" : undefined}
          aria-expanded={expanded}
          onClick={() => {
            setExpanded((value) => !value);
            setActive(0);
          }}
        >
          <span className={styles.menuMark} aria-hidden="true" />
          {label}
        </button>
      ) : (
        <a href={href} className={`t-h2 ${styles.menuLink}`}>
          <span className={styles.menuMark} aria-hidden="true" />
          {label}
        </a>
      )}
      {menu ? (
        <div
          className={styles.sub}
          data-open={expanded ? "true" : undefined}
          inert={expanded ? undefined : true}
          aria-hidden={expanded ? undefined : true}
        >
          <div className={styles.subInner}>
            {menu === "services" ? (
              <ServiceSub active={active} onActive={setActive} />
            ) : (
              <AboutSub />
            )}
          </div>
        </div>
      ) : null}
    </li>
  );
}

function ServiceSub({
  active,
  onActive,
}: {
  active: number;
  onActive: (index: number) => void;
}) {
  const panel = navMenus.services;
  return (
    <div className={styles.subPanel}>
      <PanelTitle parts={panel.title} stack />
      <div className={styles.subVisual}>
        {panel.items.map((item, index) => (
          <img
            key={item.image}
            src={item.image}
            alt=""
            className={styles.subImage}
            data-active={index === active ? "true" : undefined}
          />
        ))}
      </div>
      <ul className={styles.subList}>
        {panel.items.map((item, index) => (
          <li key={item.title}>
            <a
              href={item.href}
              className={styles.subLink}
              data-active={index === active ? "true" : undefined}
              onPointerEnter={() => onActive(index)}
              onFocus={() => onActive(index)}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AboutSub() {
  const panel = navMenus.about;
  return (
    <div className={styles.subPanel}>
      <PanelTitle parts={panel.title} stack />
      <ul className={styles.subList}>
        {panel.items.map((item) => (
          <li key={item.title}>
            <a href={item.href} className={styles.subLink}>
              <span>{item.title}</span>
              <span className={styles.subText}>{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PanelTitle({
  parts,
  stack = false,
}: {
  parts: readonly HeadingPart[];
  stack?: boolean;
}) {
  return (
    <p className={styles.panelTitle}>
      {parts.map((part, index) => {
        const last = index === parts.length - 1;
        const accent = typeof part !== "string";
        return (
          <span
            key={index}
            className={`${stack ? styles.titleLine : ""} ${accent ? "accent" : ""}`.trim()}
          >
            {accent ? part.accent : part}
            {last ? <span className={styles.mark} aria-hidden="true" /> : null}
          </span>
        );
      })}
    </p>
  );
}

function MenuPanel({ name }: { name: keyof typeof navMenus }) {
  const panel = navMenus[name];
  const [active, setActive] = useState(0);

  if (name === "services") {
    const items = navMenus.services.items;
    return (
      <div className={styles.panel}>
        <div className={`${styles.panelCard} ${styles.servicesCard}`}>
          <div className={styles.serviceCopy}>
            <PanelTitle parts={panel.title} />
            <ul className={styles.serviceNames}>
              {items.map((item, index) => (
                <li key={item.title}>
                  <a
                    href={item.href}
                    className={styles.serviceName}
                    data-active={index === active ? "true" : undefined}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.serviceVisual}>
            {items.map((item, index) => (
              <img
                key={item.image}
                src={item.image}
                alt=""
                className={styles.serviceImage}
                data-active={index === active ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelCard}>
        <div className={styles.panelLead}>
          <PanelTitle parts={panel.title} stack />
          <a href={panel.cta.href} className={styles.panelCta}>
            {panel.cta.label}
            <ArrowIcon />
          </a>
        </div>
        <ul className={styles.panelList}>
          {panel.items.map((item) => (
            <li key={item.title}>
              <a href={item.href} className={styles.panelItem}>
                <span className={styles.panelItemTitle}>{item.title}</span>
                {"text" in item ? <span className={styles.panelItemText}>{item.text}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
