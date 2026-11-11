"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { markerHex, services, type Service } from "@/content/site";
import { ArrowIcon, ArrowLink } from "@/components/ui/Button";
import { Artwork } from "@/components/ui/Artwork";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./Services.module.css";

const COLS =
  "grid-cols-[12px_2rem_minmax(0,1fr)_2.5rem] gap-x-3 sm:gap-x-4";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ServiceRow({
  service,
  index,
  open,
  onOpen,
}: {
  service: Service;
  index: number;
  open: boolean;
  onOpen: () => void;
}) {
  const titleId = `service-title-${service.id}`;
  const panelId = `service-panel-${service.id}`;
  const marker = {
    "--sq": markerHex[service.color],
    width: 12,
    height: 12,
  } as CSSProperties;

  return (
    <Reveal
      as="li"
      delay={index * 60}
      className="border-t border-line last:border-b"
    >
      <h3 className="m-0 leading-none">
        <button
          type="button"
          className={`group/row grid w-full items-center bg-transparent py-[clamp(20px,2vw,30px)] text-left ${COLS}`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            if (!open) onOpen();
          }}
        >
          <span
            aria-hidden="true"
            className={`sq shrink-0 transition-transform duration-500 ease-expo motion-reduce:transition-none ${
              open ? "rotate-45" : "rotate-0"
            }`}
            style={marker}
          />
          <span className="t-label w-full text-fg-3 tabular-nums" aria-hidden="true">
            {pad(index + 1)}
          </span>
          <span
            id={titleId}
            className={`t-h3 min-w-0 text-balance transition-colors duration-500 ease-expo motion-reduce:transition-none ${
              open
                ? "text-fg"
                : "text-fg-3 group-hover/row:text-fg group-focus-visible/row:text-fg"
            }`}
          >
            {service.title}
          </span>
          <span
            aria-hidden="true"
            className={`grid size-10 shrink-0 place-items-center mark-tile border transition-colors duration-500 ease-expo motion-reduce:transition-none ${
              open
                ? "border-transparent bg-cyan text-navy"
                : "border-line-2 bg-transparent text-fg"
            }`}
          >
            <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
              <path
                d="M2 7h10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7 2v10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`${styles.tick} ${open ? styles.tickOff : ""}`}
              />
            </svg>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={titleId}
        inert={open ? undefined : true}
        className={`grid transition-[grid-template-rows] duration-[600ms] ease-expo motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`transition-opacity duration-500 ease-expo motion-reduce:transition-none ${
              open ? "opacity-100 delay-100" : "opacity-0 delay-0"
            }`}
          >
            <div className={`grid ${COLS}`}>
              <div className="col-span-2 col-start-3 min-w-0 pb-8">
                <div
                  aria-hidden="true"
                  className="relative mb-6 aspect-[16/10] overflow-hidden rounded-card bg-surface lg:hidden"
                >
                  <Artwork
                    variant={service.art}
                    tone={service.tone}
                    className="absolute inset-0"
                  />
                </div>
                <p className="t-body max-w-[48ch] text-pretty text-fg-2">
                  {service.summary}
                </p>
                <ul className="mt-5 flex list-none flex-wrap items-baseline p-0 font-display text-[clamp(1.125rem,1.05rem+0.3vw,1.25rem)] leading-snug font-medium tracking-[-0.015em] text-fg">
                  {service.items.map((item, itemIndex) => (
                    <li key={item} className="inline-flex items-baseline">
                      <span>{item}</span>
                      {itemIndex < service.items.length - 1 ? (
                        <span aria-hidden="true" className="px-[0.55em] text-signal">
                          /
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <ArrowLink href="#contact" className="mt-6">
                  {service.cta}
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Services() {
  const [active, setActive] = useState(0);
  const current = services.list[active] ?? services.list[0];
  const total = services.list.length;

  return (
    <section id={services.id} className="theme-dark">
      <div className="wrap sec">
        <div className="grid-12 items-end gap-y-8">
          <div className="col-span-12 min-w-0 lg:col-span-7">
            <Label>{services.label}</Label>
            <Heading parts={services.heading} as="h2" className="t-h2 mt-6" />
          </div>
          <Reveal className="col-span-12 min-w-0 lg:col-span-4 lg:col-start-9">
            <p className="t-lead text-pretty text-fg-2">{services.intro}</p>
          </Reveal>
        </div>

        <div className="mt-[clamp(40px,5vw,80px)] grid-12 items-start">
          <div className="col-span-12 min-w-0 lg:col-span-7">
            <ul className="m-0 list-none p-0">
              {services.list.map((service, index) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  index={index}
                  open={index === active}
                  onOpen={() => setActive(index)}
                />
              ))}
            </ul>
          </div>

          {current ? (
            <div className="col-span-12 hidden min-w-0 lg:col-span-4 lg:col-start-9 lg:block">
              <div className="sticky top-[calc(var(--nav-h)+24px)]">
                <Reveal delay={80}>
                  <div className={styles.frame}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-surface">
                      {services.list.map((service, index) => {
                        const on = index === active;
                        return (
                          <div
                            key={service.id}
                            aria-hidden="true"
                            className={`absolute inset-0 origin-center transition-[opacity,transform] duration-700 ease-expo motion-reduce:transition-none ${
                              on
                                ? "z-[2] scale-100 opacity-100"
                                : "z-[1] scale-[1.08] opacity-0"
                            }`}
                          >
                            <Artwork
                              variant={service.art}
                              tone={service.tone}
                              className="absolute inset-0"
                            />
                          </div>
                        );
                      })}

                      <a
                        href="#contact"
                        aria-label={`Start a ${current.title} project`}
                        className="group/go absolute top-4 right-4 z-20 grid size-11 place-items-center mark-tile bg-white text-navy"
                      >
                        <ArrowIcon className="-rotate-45 transition-transform duration-500 ease-expo group-hover/go:rotate-0 group-focus-visible/go:rotate-0 motion-reduce:transition-none" />
                      </a>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink from-20% via-ink/55 to-transparent px-5 pt-20 pb-5">
                        <div
                          key={current.id}
                          className={`${styles.caption} flex items-end justify-between gap-4`}
                        >
                          <span className="t-label flex min-w-0 items-center gap-2.5 text-fg">
                            <span
                              className="sq shrink-0"
                              style={
                                { "--sq": markerHex[current.color] } as CSSProperties
                              }
                            />
                            <span className="min-w-0">{current.title}</span>
                          </span>
                          <span className="t-label shrink-0 text-fg tabular-nums whitespace-nowrap">
                            {pad(active + 1)}
                            <span aria-hidden="true" className="px-[0.45em] text-signal">
                              /
                            </span>
                            {pad(total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={180}>
                  <div
                    className="mt-4 flex items-center gap-1"
                    role="group"
                    aria-label={services.label}
                  >
                    {services.list.map((service, index) => {
                      const on = index === active;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          aria-pressed={on}
                          aria-label={service.title}
                          onClick={() => setActive(index)}
                          className={`grid size-8 place-items-center mark-tile transition-opacity duration-300 ease-expo motion-reduce:transition-none ${
                            on
                              ? "opacity-100 ring-1 ring-line-2 ring-inset"
                              : "opacity-50 hover:opacity-100 focus-visible:opacity-100"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="sq"
                            style={
                              {
                                "--sq": markerHex[service.color],
                                width: 12,
                                height: 12,
                              } as CSSProperties
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                </Reveal>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
