"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Artwork } from "@/components/ui/Artwork";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { contact, headingText, markerHex, type ArtVariant, type HeadingPart, type Service } from "@/content/site";
import { servicePages } from "@/content/service-pages";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./MarketingStory.module.css";

const chapters: { id: string; label: string; heading: HeadingPart[]; detail: string; art: ArtVariant }[] = [
  {
    id: "feed",
    label: "Digital marketing",
    heading: servicePages.marketing.headline,
    detail: "",
    art: "growth",
  },
  {
    id: "social-media",
    label: "Social media",
    heading: ["Social Media ", { accent: "Marketing" }],
    detail: "Give people a reason to stop scrolling. We plan what to publish, make the creative, and use the response to shape what goes out next.",
    art: "brand",
  },
  {
    id: "seo",
    label: "SEO · Organic search",
    heading: ["Be there when ", { accent: "they search." }],
    detail: "SEO starts with how your customers search. We map that intent to your pages, fix technical barriers, and track how visibility changes over time.",
    art: "growth",
  },
  {
    id: "paid-ads",
    label: "Paid ads · Search and social",
    heading: ["Make your ", { accent: "ad spend" }, " count."],
    detail: "Give each campaign a clear goal. We test creative and landing pages, track conversions, and put more budget behind what works.",
    art: "web",
  },
  {
    id: "content-email",
    label: "Content and email",
    heading: ["Give people a ", { accent: "reason" }, " to come back."],
    detail: "From explainers to email sequences, we build content around the questions people have before they buy and the reasons they return afterward.",
    art: "motion",
  },
];

function ChapterCopy({ index, service }: { index: number; service: Service }) {
  const chapter = chapters[index];

  return (
    <div className={styles.copy}>
      <Label color={markerHex.lime}>{index === 0 ? headingText(service.title) : chapter.label}</Label>
      <Heading
        as={index === 0 ? "h1" : "h2"}
        className={index === 0 ? styles.title : `t-h2 ${styles.heading}`}
        parts={chapter.heading}
        dot={false}
        show
      />
      <p className="t-lead text-fg-2">{index === 0 ? service.summary : chapter.detail}</p>
      {index === 0 || index === chapters.length - 1 ? (
        <Button href={`#${contact.id}`}>{service.cta}</Button>
      ) : null}
    </div>
  );
}

export function MarketingStory({ service }: { service: Service }) {
  const story = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const mobileContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = story.current;
    const host = viewport.current;
    const mobile = mobileContent.current;
    if (!root || !host || !mobile) return;
    const mobilePanels = Array.from(mobile.children) as HTMLElement[];
    let activePanel = 0;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const controller = new AbortController();
      let dispose: (() => void) | undefined;

      void import("./marketing-scene").then(async ({ mountMarketingScene }) => {
        if (controller.signal.aborted) return;
        dispose = await mountMarketingScene(host, controller.signal, (update) => {
          root.dataset.motion = "ready";
          const sections = Array.from(root.querySelectorAll<HTMLElement>("section"));
          let stops = sections.map((section) => section.offsetTop);
          const sync = (position: number) => {
            const next = stops.findIndex((stop) => stop > position);
            if (next <= 0) {
              update(next === 0 ? 0 : stops.length - 1);
              return;
            }
            const previous = next - 1;
            update(previous + (position - stops[previous]) / (stops[next] - stops[previous]));
          };
          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => sync(self.scroll() - self.start),
            onRefresh: (self) => {
              stops = sections.map((section) => section.offsetTop);
              sync(self.scroll() - self.start);
            },
          });
          sync(trigger.scroll() - trigger.start);

          const entrances = gsap.context(() => {
            sections.slice(1).forEach((section) => {
              gsap.fromTo(section.querySelector(`.${styles.copy}`), {
                x: section.dataset.side === "right" ? 36 : -36,
                opacity: 0.5,
              }, {
                x: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: { trigger: section, start: "top 75%", end: "top 25%", scrub: true },
              });
            });
          }, root);

          return () => {
            entrances.revert();
            trigger.kill();
          };
        }, (socialOpacity, seoOpacity, chapter) => {
          root.style.setProperty("--social-copy-opacity", String(socialOpacity));
          root.style.setProperty("--seo-copy-opacity", String(seoOpacity));
          if (chapter !== activePanel) {
            if (mobilePanels[activePanel]) mobilePanels[activePanel].hidden = true;
            if (mobilePanels[chapter]) mobilePanels[chapter].hidden = false;
            activePanel = chapter;
          }
        });
      }).catch(() => {
        if (!controller.signal.aborted) root.dataset.motion = "fallback";
      });

      return () => {
        controller.abort();
        dispose?.();
        root.dataset.motion = "loading";
        root.style.removeProperty("--social-copy-opacity");
        root.style.removeProperty("--seo-copy-opacity");
        if (mobilePanels[activePanel]) mobilePanels[activePanel].hidden = true;
        mobilePanels[0].hidden = false;
        activePanel = 0;
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div className={`theme-dark ${styles.story}`} ref={story} data-motion="loading">
      <div className={styles.stage}>
        <div className={styles.viewport} ref={viewport} aria-hidden="true" />
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.poster}>
            <Image
              src="/models/marketing/instagram-office-camera.jpg"
              fill
              alt=""
              sizes="(max-width: 760px) 36vw, 29vw"
              preload
            />
          </div>
          <span className={styles.badge}>♥ 148 likes</span>
          <span className={styles.badge}>◇ 84 comments</span>
          <span className={styles.badge}>+ 60 followers</span>
        </div>
        <div className={styles.mobileContent} ref={mobileContent}>
          {chapters.map(({ id }, index) => (
            <div key={id} hidden={index !== 0} data-chapter={id}>
              <ChapterCopy index={index} service={service} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chapters}>
        {chapters.map((chapter, index) => (
          <section id={chapter.id} key={chapter.id} className={styles.chapter} data-side={index % 2 ? "right" : "left"}>
            <div className={`wrap ${styles.row}`}>
              <ChapterCopy index={index} service={service} />
              <div className={styles.fallback} aria-hidden="true">
                <Artwork variant={chapter.art} tone={index % 2 ? "navy" : "ink"} animated={false} />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
