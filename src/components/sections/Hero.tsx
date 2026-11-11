"use client";

import { useEffect, useRef, useState } from "react";
import { hero, site, type HeadingPart } from "@/content/site";
import { Artwork } from "@/components/ui/Artwork";
import { LiveClock } from "@/components/ui/LiveClock";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onReady } from "@/lib/ready";
import styles from "./Hero.module.css";

/* Scroll timeline is normalised to 1. Sticky track is 340vh. */
const GROW_END = 0.45;
const SCRIM_START = 0.4;
const SCRIM_END = 0.55;
const WORDS_START = 0.52;
const WORDS_END = 0.88;

type Token = { text: string; accent: boolean };
type Box = { left: number; top: number; width: number; height: number };

function tokenize(parts: readonly HeadingPart[]): Token[] {
  const words: Token[] = [];
  for (const part of parts) {
    const accent = typeof part !== "string";
    const text = accent ? part.accent : part;
    for (const bit of text.split(/(\s+)/)) {
      if (bit.length === 0 || /^\s+$/.test(bit)) continue;
      if (/^[^A-Za-z0-9]+$/.test(bit) && words.length > 0) {
        words[words.length - 1].text += bit;
      } else {
        words.push({ text: bit, accent });
      }
    }
  }
  return words;
}

const STATEMENT_WORDS = tokenize(hero.statement);
const STATEMENT_LABEL = hero.statement
  .map((part) => (typeof part === "string" ? part : part.accent))
  .join("");

function measureTile(tile: HTMLElement, stage: HTMLElement): Box {
  const width = tile.offsetWidth;
  const height = tile.offsetHeight;
  /* offsetLeft ignores transform, so rotation/scale on the tile don't inflate the box. */
  let x = tile.offsetLeft;
  let y = tile.offsetTop;
  let parent = tile.offsetParent as HTMLElement | null;
  while (parent && parent !== stage) {
    x += parent.offsetLeft;
    y += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement | null;
  }
  if (parent === stage && width > 0) {
    return { left: x, top: y, width, height };
  }
  const stageRect = stage.getBoundingClientRect();
  const rect = tile.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return {
    left: cx - stageRect.left - width / 2,
    top: cy - stageRect.top - height / 2,
    width,
    height,
  };
}

function ArtStack({ active, prev }: { active: number; prev: number }) {
  return (
    <div className={styles.stack} aria-hidden="true">
      {hero.slides.map((slide, index) => (
        <div
          key={slide.art}
          className={styles.slide}
          data-active={index === active ? "true" : "false"}
          data-prev={index === prev && index !== active ? "true" : "false"}
        >
          <Artwork
            variant={slide.art}
            tone={slide.tone}
            className="absolute inset-0"
          />
        </div>
      ))}
      <span className={styles.corner} data-corner="" />
    </div>
  );
}

function Statement({ scroll = false }: { scroll?: boolean }) {
  return (
    <p className={styles.statementText} aria-label={STATEMENT_LABEL}>
      <span aria-hidden="true">
        {STATEMENT_WORDS.map((word, index) => (
          <span
            key={`${word.text}-${index}`}
            className={word.accent ? "accent" : undefined}
            data-sword={scroll ? "" : undefined}
          >
            {index > 0 ? " " : ""}
            {word.text}
          </span>
        ))}
      </span>
    </p>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaIntroPlayed = useRef(false);
  const [frame, setFrame] = useState({ active: 0, prev: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const count = hero.slides.length;
    const id = window.setInterval(() => {
      setFrame((current) => ({
        prev: current.active,
        active: (current.active + 1) % count,
      }));
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      const afterReady = (run: () => void) => {
        let started = false;
        let timer = 0;
        const start = () => {
          if (started) return;
          started = true;
          run();
        };
        const off = onReady(() => {
          void document.fonts.ready.then(start);
          timer = window.setTimeout(start, 700);
        });
        return () => {
          started = true;
          off();
          window.clearTimeout(timer);
        };
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-anim='word']", root);
        const line2text = gsap.utils.toArray<HTMLElement>("[data-anim='line2text']", root);
        const tile = gsap.utils.toArray<HTMLElement>("[data-anim='tile']", root);
        const eyebrow = gsap.utils.toArray<HTMLElement>("[data-anim='eyebrow']", root);
        const dot = gsap.utils.toArray<HTMLElement>("[data-anim='dot']", root);
        const bar = gsap.utils.toArray<HTMLElement>("[data-anim='bar']", root);

        gsap.set(words, { yPercent: 110 });
        gsap.set(line2text, { yPercent: 110 });
        gsap.set(tile, {
          scale: 0,
          rotation: -30,
          opacity: 0,
          transformOrigin: "50% 50%",
        });
        gsap.set(eyebrow, { opacity: 0, y: 18 });
        gsap.set(dot, { scale: 0, rotation: -90, transformOrigin: "50% 50%" });
        gsap.set(bar, { opacity: 0, y: 12 });

        let intro: gsap.core.Timeline | null = null;
        let cancelled = false;
        const stop = afterReady(() => {
          if (cancelled || !root.isConnected) return;
          intro = gsap.timeline();
          intro.to(eyebrow, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }, 0);
          intro.to(
            words,
            { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 },
            0.06,
          );
          intro.to(
            tile,
            { scale: 1, rotation: -8, opacity: 1, duration: 1.1, ease: "expo.out" },
            0.08,
          );
          intro.to(line2text, { yPercent: 0, duration: 1.05, ease: "expo.out" }, 0.18);
          intro.to(dot, { scale: 1, rotation: 0, duration: 0.7, ease: "expo.out" }, 0.42);
          intro.to(bar, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, 0.3);
        });

        return () => {
          cancelled = true;
          stop();
          intro?.kill();
          gsap.set([...words, ...line2text, ...tile, ...eyebrow, ...dot, ...bar], {
            clearProps: "all",
          });
        };
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = root.querySelector<HTMLElement>("[data-anim='stage']");
        const track = root.querySelector<HTMLElement>("[data-anim='track']");
        const tile = root.querySelector<HTMLElement>("[data-anim='tile']");
        const media = root.querySelector<HTMLElement>("[data-anim='media']");
        if (!stage || !track || !tile || !media) return;

        const lead = root.querySelector<HTMLElement>("[data-mask='lead']");
        const tail = root.querySelector<HTMLElement>("[data-mask='tail']");
        const eyebrow = root.querySelector<HTMLElement>("[data-anim='eyebrow']");
        const line2 = root.querySelector<HTMLElement>("[data-anim='line2']");
        const bar = root.querySelector<HTMLElement>("[data-anim='bar']");
        const visual = tile.querySelector<HTMLElement>("[data-visual]");
        const scrim = media.querySelector<HTMLElement>("[data-anim='scrim']");
        const corner = media.querySelector<HTMLElement>("[data-corner]");
        const statement = media.querySelector<HTMLElement>("[data-anim='statement']");
        const swords = gsap.utils.toArray<HTMLElement>("[data-sword]", media);

        let mediaIntro: gsap.core.Timeline | null = null;
        let scrollTl: gsap.core.Timeline | null = null;
        let cancelled = false;
        let retries = 0;

        const place = (rotation: number, scale: number) => {
          const box = measureTile(tile, stage);
          if (visual) gsap.set(visual, { autoAlpha: 0 });
          gsap.set(tile, { backgroundColor: "transparent" });
          gsap.set(media, {
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
            rotation,
            scale,
            borderRadius: "0 22% 0 22%",
            transformOrigin: "50% 50%",
            autoAlpha: 1,
          });
          return box;
        };

        const buildScroll = () => {
          if (cancelled || !root.isConnected) return;
          scrollTl?.scrollTrigger?.kill();
          scrollTl?.kill();

          const read = () => measureTile(tile, stage);
          gsap.set(media, {
            ...read(),
            rotation: -8,
            scale: 1,
            borderRadius: "0 22% 0 22%",
            transformOrigin: "50% 50%",
            autoAlpha: 1,
          });
          if (swords.length) gsap.set(swords, { opacity: 0.14 });
          if (statement) gsap.set(statement, { opacity: 0 });
          if (scrim) gsap.set(scrim, { opacity: 0 });

          scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          scrollTl.fromTo(
            media,
            {
              left: () => read().left,
              top: () => read().top,
              width: () => read().width,
              height: () => read().height,
              rotation: -8,
              scale: 1,
              borderRadius: "0 22% 0 22%",
            },
            {
              left: 0,
              top: 0,
              width: () => stage.offsetWidth,
              height: () => stage.offsetHeight,
              rotation: 0,
              scale: 1,
              borderRadius: "0 0 0 0",
              ease: "power2.inOut",
              duration: GROW_END,
              immediateRender: false,
              overwrite: "auto",
            },
            0,
          );

          if (lead) {
            scrollTl.fromTo(
              lead,
              { xPercent: 0, opacity: 1 },
              {
                xPercent: -42,
                opacity: 0,
                ease: "power2.inOut",
                duration: GROW_END,
                immediateRender: false,
              },
              0,
            );
          }
          if (tail) {
            scrollTl.fromTo(
              tail,
              { xPercent: 0, opacity: 1 },
              {
                xPercent: 42,
                opacity: 0,
                ease: "power2.inOut",
                duration: GROW_END,
                immediateRender: false,
              },
              0,
            );
          }
          if (eyebrow) {
            scrollTl.fromTo(
              eyebrow,
              { y: 0, opacity: 1 },
              {
                y: 36,
                opacity: 0,
                ease: "power2.inOut",
                duration: GROW_END,
                immediateRender: false,
              },
              0,
            );
          }
          if (line2) {
            scrollTl.fromTo(
              line2,
              { y: 0, opacity: 1 },
              {
                y: 48,
                opacity: 0,
                ease: "power2.inOut",
                duration: GROW_END,
                immediateRender: false,
              },
              0,
            );
          }
          if (bar) {
            scrollTl.to(
              bar,
              { opacity: 0, duration: 0.32, ease: "power1.in", immediateRender: false },
              0,
            );
          }
          if (corner) {
            scrollTl.to(corner, { opacity: 0, duration: 0.24, ease: "power1.out" }, 0);
          }
          if (scrim) {
            scrollTl.fromTo(
              scrim,
              { opacity: 0 },
              {
                opacity: 1,
                duration: SCRIM_END - SCRIM_START,
                ease: "power1.inOut",
                immediateRender: false,
              },
              SCRIM_START,
            );
          }
          if (statement) {
            scrollTl.to(statement, { opacity: 1, duration: 0.06, ease: "none" }, 0.48);
          }
          if (swords.length > 0) {
            const step = (WORDS_END - WORDS_START) / swords.length;
            scrollTl.to(
              swords,
              { opacity: 1, duration: step, stagger: step, ease: "none" },
              WORDS_START,
            );
          }
          /* 88%–100% holds. A dummy tween keeps the timeline from ending at 0.88. */
          const hold = { t: 0 };
          scrollTl.to(hold, { t: 1, duration: 1 - WORDS_END, ease: "none" }, WORDS_END);

          requestAnimationFrame(() => {
            if (!cancelled) ScrollTrigger.refresh();
          });
        };

        const begin = () => {
          if (cancelled || !root.isConnected) return;
          const box = measureTile(tile, stage);
          if (box.width < 2 && retries < 12) {
            retries += 1;
            requestAnimationFrame(begin);
            return;
          }

          if (mediaIntroPlayed.current) {
            place(-8, 1);
            buildScroll();
            return;
          }

          place(-30, 0);
          mediaIntro = gsap.timeline({
            onComplete: () => {
              mediaIntroPlayed.current = true;
              buildScroll();
            },
          });
          mediaIntro.to(media, {
            scale: 1,
            rotation: -8,
            duration: 1.1,
            ease: "expo.out",
          });
        };

        const stop = afterReady(begin);

        return () => {
          cancelled = true;
          stop();
          mediaIntro?.kill();
          scrollTl?.scrollTrigger?.kill();
          scrollTl?.kill();
          const clear: HTMLElement[] = [media, ...swords];
          if (statement) clear.push(statement);
          if (scrim) clear.push(scrim);
          if (corner) clear.push(corner);
          if (lead) clear.push(lead);
          if (tail) clear.push(tail);
          if (line2) clear.push(line2);
          if (eyebrow) clear.push(eyebrow);
          if (bar) clear.push(bar);
          if (visual) clear.push(visual);
          gsap.set(clear, { clearProps: "all" });
          gsap.set(tile, { clearProps: "backgroundColor" });
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className={`theme-dark relative ${styles.hero}`}
      aria-labelledby="hero-title"
    >
      <div className={styles.track} data-anim="track">
        <div className={styles.stage} data-anim="stage">
          <div className={styles.copy}>
            <p className={`t-lead text-fg ${styles.eyebrow}`} data-anim="eyebrow">
              {hero.eyebrow}
            </p>
            <h1 id="hero-title" className={styles.title} aria-label="We invent what's next">
              <span aria-hidden="true" className={styles.visual}>
                <span className={`t-hero ${styles.line1}`}>
                  <span className={styles.mask} data-mask="lead">
                    <span className={styles.word} data-anim="word">
                      {hero.line1[0]}
                    </span>
                  </span>
                  <span className={styles.tile} data-anim="tile">
                    <span className={styles.tileVisual} data-visual="">
                      <ArtStack active={frame.active} prev={frame.prev} />
                    </span>
                  </span>
                  <span className={styles.mask} data-mask="tail">
                    <span className={styles.word} data-anim="word">
                      {hero.line1[1]}
                    </span>
                  </span>
                </span>
                <span className={styles.line2} data-anim="line2">
                  <span className={styles.mask2}>
                    <span className={`accent ${styles.line2text}`} data-anim="line2text">
                      {hero.line2}
                    </span>
                  </span>
                  <span className={`dot ${styles.dot}`} data-anim="dot" />
                </span>
              </span>
            </h1>
          </div>

          <div className={styles.media} data-anim="media">
            <ArtStack active={frame.active} prev={frame.prev} />
            <div className={styles.scrim} data-anim="scrim" aria-hidden="true" />
            <div className={styles.statement} data-anim="statement">
              <Statement scroll />
            </div>
          </div>

          <div className={`t-label ${styles.bar}`} data-anim="bar">
            <div className={`wrap ${styles.barInner}`}>
              <div className={styles.clocks}>
                {site.clocks.map((clock) => (
                  <span key={clock.code} className={styles.clock}>
                    <span>{clock.city}</span>
                    <LiveClock timeZone={clock.timeZone} className="text-cyan" />
                  </span>
                ))}
              </div>
              <div className={styles.hint}>
                <span>{hero.scrollHint}</span>
                <span className={styles.scrollLine} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cardWrap}>
        <div className="wrap">
          <div className={`rounded-card ${styles.card}`}>
            <ArtStack active={frame.active} prev={frame.prev} />
            <div className={styles.cardScrim} aria-hidden="true" />
            <div className={styles.cardCopy}>
              <Reveal>
                <Statement />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
