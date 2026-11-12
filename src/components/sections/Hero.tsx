"use client";

import { useEffect, useRef, useState } from "react";
import { hero, type HeadingPart } from "@/content/site";
import { Artwork } from "@/components/ui/Artwork";
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

function Letters({ text }: { text: string }) {
  return [...text].map((char, index) =>
    char === " " ? (
      " "
    ) : (
      <span key={`${char}-${index}`} className={styles.letter}>
        {char}
      </span>
    ),
  );
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
    const root = rootRef.current;
    const visual = root?.querySelector<HTMLElement>("[data-tilt]");
    if (!visual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetY = 0;
    let targetX = 0;
    let currentY = 0;
    let currentX = 0;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      const box = visual.getBoundingClientRect();
      const over =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      if (!over) {
        targetY = 0;
        targetX = 0;
        return;
      }
      const px = (event.clientX - (box.left + box.width / 2)) / box.width;
      const py = (event.clientY - (box.top + box.height / 2)) / box.height;
      targetY = px * 10;
      targetX = py * -6;
    };

    const tick = () => {
      currentY += (targetY - currentY) * 0.045;
      currentX += (targetX - currentX) * 0.045;
      const idle = Math.abs(currentY) < 0.02 && Math.abs(currentX) < 0.02 && targetY === 0 && targetX === 0;
      visual.style.transform = idle ? "" : `rotateY(${currentY}deg) rotateX(${currentX}deg)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      visual.style.transform = "";
    };
  }, []);

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
        const eyebrow = gsap.utils.toArray<HTMLElement>("[data-anim='eyebrow']", root);
        const dot = gsap.utils.toArray<HTMLElement>("[data-anim='dot']", root);

        gsap.set(words, { yPercent: 110 });
        gsap.set(line2text, { yPercent: 110 });
        gsap.set(eyebrow, { opacity: 0, y: 18 });
        gsap.set(dot, { scale: 0, rotation: -90, transformOrigin: "50% 50%" });

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
          intro.to(line2text, { yPercent: 0, duration: 1.05, ease: "expo.out" }, 0.18);
          intro.to(dot, { scale: 1, rotation: 0, duration: 0.7, ease: "expo.out" }, 0.42);
        });

        return () => {
          cancelled = true;
          stop();
          intro?.kill();
          gsap.set([...words, ...line2text, ...eyebrow, ...dot], {
            clearProps: "all",
          });
        };
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = root.querySelector<HTMLElement>("[data-anim='stage']");
        const track = root.querySelector<HTMLElement>("[data-anim='track']");
        const dot = root.querySelector<HTMLElement>("[data-anim='dot']");
        const media = root.querySelector<HTMLElement>("[data-anim='media']");
        if (!stage || !track || !dot || !media) return;

        const copy = root.querySelector<HTMLElement>("[data-anim='copy']");
        const scrim = media.querySelector<HTMLElement>("[data-anim='scrim']");
        const corner = media.querySelector<HTMLElement>("[data-corner]");
        const statement = media.querySelector<HTMLElement>("[data-anim='statement']");
        const swords = gsap.utils.toArray<HTMLElement>("[data-sword]", media);

        let scrollTl: gsap.core.Timeline | null = null;
        let cancelled = false;
        let retries = 0;

        const buildScroll = () => {
          if (cancelled || !root.isConnected) return;
          scrollTl?.scrollTrigger?.kill();
          scrollTl?.kill();

          const read = () => measureTile(dot, stage);
          gsap.set(media, {
            ...read(),
            rotation: 0,
            scale: 1,
            borderRadius: "0 22% 0 22%",
            transformOrigin: "50% 50%",
            autoAlpha: 0,
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
              rotation: 0,
              scale: 1,
              borderRadius: "0 5% 0 5%",
            },
            {
              left: 0,
              top: 0,
              width: () => stage.offsetWidth,
              height: () => stage.offsetHeight,
              rotation: 0,
              scale: 1,
              borderRadius: "0 0% 0 0%",
              ease: "power2.inOut",
              duration: GROW_END,
              immediateRender: false,
              overwrite: "auto",
            },
            0,
          );
          scrollTl.to(dot, { autoAlpha: 0, duration: 0.04, ease: "none" }, 0);
          scrollTl.to(media, { autoAlpha: 1, duration: 0.08, ease: "none" }, 0);

          if (copy) {
            scrollTl.fromTo(
              copy,
              { y: 0 },
              {
                y: () => -window.innerHeight * 0.95,
                ease: "power2.inOut",
                duration: GROW_END,
                immediateRender: false,
              },
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
          const box = measureTile(dot, stage);
          if (box.width < 2 && retries < 12) {
            retries += 1;
            requestAnimationFrame(begin);
            return;
          }
          mediaIntroPlayed.current = true;
          buildScroll();
        };

        const stop = afterReady(begin);

        return () => {
          cancelled = true;
          stop();
          scrollTl?.scrollTrigger?.kill();
          scrollTl?.kill();
          const clear: HTMLElement[] = [media, ...swords];
          if (copy) clear.push(copy);
          if (statement) clear.push(statement);
          if (scrim) clear.push(scrim);
          if (corner) clear.push(corner);
          gsap.set(clear, { clearProps: "all" });
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
          <div className={styles.copy} data-anim="copy">
            <p className={`t-lead text-3xl max-sm:text-xl ${styles.eyebrow}`} data-anim="eyebrow">
              {hero.eyebrow}
            </p>
            <h1 id="hero-title" className={styles.title} aria-label="Drive serious conversion">
              <span aria-hidden="true" className={styles.visual} data-tilt="">
                <span className={`t-hero ${styles.line1}`}>
                  <span className={styles.mask} data-mask="lead">
                    <span className={styles.word} data-anim="word">
                      <Letters text={hero.line1[0]} />
                    </span>
                  </span>
                  <span className={styles.mask} data-mask="tail">
                    <span className={styles.word} data-anim="word">
                      <Letters text={hero.line1[1]} />
                    </span>
                  </span>
                </span>
                <span className={styles.line2} data-anim="line2">
                  <span className={styles.mask2}>
                    <span className={`accent ${styles.line2text}`} data-anim="line2text">
                      <Letters text={hero.line2} />
                    </span>
                  </span>
                  <button type="button" className={`dot ${styles.signal}`} data-anim="dot" aria-label="Pop the mark">
                    <span className={styles.dotGrow}>
                      <span className={styles.dotFace}>
                        <ArtStack active={frame.active} prev={frame.prev} />
                      </span>
                    </span>
                  </button>
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
