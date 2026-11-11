"use client";

import { useRef } from "react";
import { process } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./Process.module.css";

export function Process() {
  const scope = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const rail = railRef.current;
        const fill = fillRef.current;
        const root = scope.current;
        if (!rail || !fill || !root) return;

        const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", root);
        let marks: number[] = [];

        const measure = () => {
          const width = rail.offsetWidth || 1;
          const railLeft = rail.getBoundingClientRect().left;
          marks = nodes.map((node) => {
            const rect = node.getBoundingClientRect();
            const center = rect.left + rect.width / 2 - railLeft;
            return Math.min(1, Math.max(0, center / width));
          });
        };

        const apply = (progress: number, active: boolean) => {
          const clamped = Math.min(1, Math.max(0, progress));
          fill.style.transform = `scaleX(${clamped})`;
          const engaged = active || clamped > 0;
          nodes.forEach((node, i) => {
            node.classList.toggle(styles.nodeOn, engaged && clamped + 0.012 >= (marks[i] ?? 1));
          });
        };

        measure();

        const trigger = ScrollTrigger.create({
          trigger: rail,
          start: "top 80%",
          end: "top 35%",
          scrub: true,
          onRefresh(self) {
            measure();
            apply(self.progress, self.isActive);
          },
          onUpdate(self) {
            apply(self.progress, self.isActive);
          },
        });

        apply(trigger.progress, trigger.isActive);

        return () => {
          fill.style.transform = "";
          nodes.forEach((node) => node.classList.remove(styles.nodeOn));
        };
      });
    },
    { scope },
  );

  return (
    <section id={process.id} ref={scope} className="theme-light sheet relative z-10">
      <div className="wrap sec">
        <div className="grid-12 items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Label>{process.label}</Label>
            <Heading
              parts={process.heading}
              as="h2"
              className="t-h2 mt-6 max-w-[14ch]"
            />
          </div>
          <Reveal className="col-span-12 lg:col-span-4 lg:col-start-9" delay={80}>
            <p className="t-lead text-fg-2">{process.intro}</p>
          </Reveal>
        </div>

        <div className="relative mt-[clamp(56px,7vw,112px)]">
          <div
            ref={railRef}
            className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block"
            aria-hidden="true"
          >
            <div className="h-px w-full bg-line" />
            <div ref={fillRef} className={`${styles.fill} absolute inset-x-0 top-0 h-px bg-signal`} />
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 left-[5.5px] w-px bg-line md:hidden"
            aria-hidden="true"
          />

          <ol className="relative m-0 grid list-none grid-cols-1 gap-y-14 p-0 md:grid-cols-2 md:gap-x-(--g) md:gap-y-16 lg:grid-cols-4 lg:gap-0">
            {process.steps.map((step, i) => (
              <Reveal
                key={step.n}
                as="li"
                delay={i * 90}
                className={`${styles.step} relative pl-7 md:pt-8 md:pr-6 md:pl-0`}
              >
                <span
                  data-node
                  aria-hidden="true"
                  className={`${styles.node} absolute top-[0.85rem] left-0 block md:hidden lg:top-0 lg:block lg:-translate-y-1/2`}
                />
                <span className={styles.num}>{step.n}</span>
                <h3 className="t-h3 mt-6">{step.title}</h3>
                <p className="t-body mt-3 max-w-[30ch] text-fg-2">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
