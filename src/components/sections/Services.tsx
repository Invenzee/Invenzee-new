"use client";

import { useEffect, useRef, useState } from "react";
import { markerHex, services } from "@/content/site";
import { Artwork } from "@/components/ui/Artwork";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./Services.module.css";

const count = services.list.length;
const LINES_PER_SERVICE = 4; // 2 spokes (hub -> arc) + 2 horizontals (arc -> card)

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Adds a short rest on each service: 0..count-1 with plateaus at whole numbers. */
function hold(raw: number) {
  const i = Math.floor(raw);
  const f = raw - i;
  const t = Math.min(1, Math.max(0, (f - 0.2) / 0.6));
  const s = t * t * (3 - 2 * t);
  return Math.min(count - 1, i + s);
}

function ServiceCopy({ index }: { index: number }) {
  const service = services.list[index];
  if (!service) return null;

  return (
    <div className={styles.copyBody}>
      <p className={`t-label ${styles.index}`}>
        <ServiceIcon id={service.id} color={markerHex[service.color]} size={14} />
        <span className="tabular-nums">{pad(index + 1)}</span>
      </p>
      <h3 className={styles.title}>
        {service.title.map((part, partIndex) =>
          typeof part === "string" ? (
            <span key={partIndex}>{part}</span>
          ) : (
            <span key={partIndex} className="accent">
              {part.accent}
            </span>
          ),
        )}
      </h3>
      <p className={`t-body text-pretty text-fg-2 ${styles.summary}`}>{service.summary}</p>
      <ul className={`text-fg ${styles.items}`}>
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
      <Button href="#contact" variant="primary" size="md" className="mt-7">
        {service.cta}
      </Button>
    </div>
  );
}

export function Services() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const hubRef = useRef<SVGCircleElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);

  /** position = continuous scroll position, 0 .. count - 1 */
  const draw = (position: number) => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    const arc = arcRef.current;
    const hub = hubRef.current;
    if (!stage || !svg || !arc || !hub) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const compact = width < 1024;
    const stageBox = stage.getBoundingClientRect();

    // Small circle: centre on the left edge, so only the right half shows.
    const hubR = compact ? 17 : 34;
    const hubX = 0;
    const hubY = height / 2;

    // Big circle: crosses x = 0 exactly at the top and bottom of the screen.
    const half = height / 2;
    const bulge = hubR + (compact ? 36 : Math.min(110, width * 0.08)); // furthest-right point of the arc
    const radius = (bulge * bulge + half * half) / (2 * bulge);
    const centerX = bulge - radius;

    const copyLeft = bulge + 24;
    const gap = compact ? 15 : 22;
    const spacing = height; // one full screen per service, so only one is ever visible

    // Horizontal lines end where the copy ends and the card starts.
    const card = stage.querySelector<HTMLElement>(`.${styles.stageInner} .${styles.card}`);
    const endX = !compact && card ? card.getBoundingClientRect().left - stageBox.left : width;

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    arc.setAttribute("cx", String(centerX));
    arc.setAttribute("cy", String(hubY));
    arc.setAttribute("r", String(radius));
    hub.setAttribute("cx", String(hubX));
    hub.setAttribute("cy", String(hubY));
    hub.setAttribute("r", String(hubR));

    // x of the circle's right side at a given y.
    const arcX = (y: number) => {
      const dy = Math.min(radius - 1, Math.abs(y - hubY));
      return centerX + Math.sqrt(radius * radius - dy * dy);
    };

    for (let i = 0; i < count; i++) {
      const copy = copyRefs.current[i];
      const d = i - position;
      const visible = Math.abs(d) < 1;

      const lines = [0, 1, 2, 3].map((n) => lineRefs.current[i * LINES_PER_SERVICE + n]);
      lines.forEach((node) => node?.setAttribute("visibility", visible ? "visible" : "hidden"));

      if (copy) copy.style.visibility = visible ? "visible" : "hidden";
      if (!visible || !copy) continue;

      // Ride the circle: slide by dy and pull left by how far the arc curves back.
      const dy = d * spacing;
      const dx = Math.sqrt(Math.max(0, radius * radius - dy * dy)) - radius;

      copy.style.width = `${compact ? Math.max(180, width - copyLeft - 16) : Math.max(280, Math.min(544, endX - copyLeft - 24))}px`;
      const h = copy.offsetHeight;
      const top = hubY + dy - h * 0.42;
      copy.style.transform = `translate3d(${copyLeft + dx}px, ${top}px, 0)`;

      const topY = top - gap;
      const bottomY = top + h + gap;
      const topX = arcX(topY);
      const bottomX = arcX(bottomY);

      const segments = [
        { x1: hubX, y1: hubY, x2: topX, y2: topY }, // hub -> upper arc point
        { x1: hubX, y1: hubY, x2: bottomX, y2: bottomY }, // hub -> lower arc point
        { x1: topX, y1: topY, x2: endX, y2: topY }, // upper horizontal
        { x1: bottomX, y1: bottomY, x2: endX, y2: bottomY }, // lower horizontal
      ];

      segments.forEach((s, n) => {
        const node = lines[n];
        if (!node) return;
        node.setAttribute("x1", String(s.x1));
        node.setAttribute("y1", String(s.y1));
        node.setAttribute("x2", String(s.x2));
        node.setAttribute("y2", String(s.y2));
      });
    }
  };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    draw(progressRef.current);
    const raf = requestAnimationFrame(() => draw(progressRef.current));
    const stage = stageRef.current;
    if (!stage) return () => cancelAnimationFrame(raf);
    const observer = new ResizeObserver(() => draw(progressRef.current));
    observer.observe(stage);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track || reduce) return;

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        const position = hold(self.progress * (count - 1));
        progressRef.current = position;
        draw(position);
        const index = Math.min(count - 1, Math.round(position));
        setActive((current) => (current === index ? current : index));
      },
    });

    return () => trigger.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <section id={services.id} className="theme-dark">
      <div className={`wrap sec ${styles.intro}`}>
        <div className="grid-12 items-end gap-y-8">
          <div className="col-span-12 min-w-0 lg:col-span-7">
            <Label>{services.label}</Label>
            <Heading parts={services.heading} as="h2" className="t-h2 mt-6" />
          </div>
          <Reveal className="col-span-12 min-w-0 lg:col-span-4 lg:col-start-9">
            <p className="t-lead text-pretty text-fg-2">{services.intro}</p>
          </Reveal>
        </div>
      </div>

      {reduce ? (
        <div className={`wrap ${styles.stack}`}>
          {services.list.map((service, index) => (
            <article key={service.id} className={styles.stackItem}>
              <ServiceCopy index={index} />
              <ServiceCard index={index} />
            </article>
          ))}
        </div>
      ) : (
        <div ref={trackRef} className={styles.track} style={{ height: `${count * 100}vh` }}>
          <div ref={stageRef} className={styles.stage}>
            <svg ref={svgRef} className={styles.orbit} aria-hidden="true">
              <circle ref={arcRef} className={styles.arc} />
              {Array.from({ length: count * LINES_PER_SERVICE }, (_, line) => (
                <line
                  key={line}
                  ref={(node) => {
                    lineRefs.current[line] = node;
                  }}
                  className={styles.ray}
                />
              ))}
              <circle ref={hubRef} className={styles.hub} r="34" />
            </svg>

            {services.list.map((service, index) => (
              <div
                key={service.id}
                ref={(node) => {
                  copyRefs.current[index] = node;
                }}
                className={styles.copyItem}
                aria-hidden={index === active ? undefined : true}
              >
                <div className={styles.rideCard}>
                  <ServiceCard index={index} />
                </div>
                <ServiceCopy index={index} />
              </div>
            ))}

            <div className={`wrap ${styles.stageInner}`}>
              <ServiceCard index={active} stacked />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ServiceCard({ index, stacked = false }: { index: number; stacked?: boolean }) {
  const service = services.list[index];
  if (!service) return null;

  return (
    <div className={styles.card}>
      <div className={styles.cardFrame}>
        {stacked ? (
          services.list.map((item, itemIndex) => (
            <div
              key={item.id}
              aria-hidden="true"
              className={`${styles.art} ${itemIndex === index ? styles.artOn : styles.artOff}`}
            >
              {item.image ? (
                <img src={item.image} alt="" className={styles.photo} />
              ) : (
                <Artwork variant={item.art} tone={item.tone} className="absolute inset-0" />
              )}
            </div>
          ))
        ) : service.image ? (
          <img src={service.image} alt="" className={styles.photo} />
        ) : (
          <Artwork variant={service.art} tone={service.tone} className="absolute inset-0" />
        )}
      </div>
    </div>
  );
}