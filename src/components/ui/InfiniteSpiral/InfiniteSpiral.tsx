"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type PointerEvent } from "react";
import "./InfiniteSpiral.css";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};
/** Closest a card is ever scaled. Paint at this size, then scale down, so the photo stays sharp. */
const DEPTH_MAX = 1.45;

export type SpiralItem = {
  src: string;
  alt?: string;
  href?: string;
  target?: string;
  label?: string;
  id?: string;
};

type InfiniteSpiralProps = {
  items?: (string | SpiralItem)[];
  speed?: number;
  direction?: "up" | "down";
  animationMode?: "auto" | "drag" | "scroll" | "all";
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  verticalSpacing?: number;
  perspective?: number;
  cardsPerTurn?: number;
  rotation?: number;
  cardTilt?: number;
  cardRadius?: number;
  centerScale?: number;
  edgeFade?: number;
  edgeBlur?: number;
  pauseOnHover?: boolean;
  imageFit?: "cover" | "contain";
  grayscale?: number;
  className?: string;
};

export default function InfiniteSpiral({
  items = [],
  speed = 0.55,
  direction = "up",
  animationMode = "auto",
  radius = 170,
  cardWidth = 100,
  cardHeight = 100,
  verticalSpacing = 60,
  perspective = 1000,
  cardsPerTurn = 7,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 10,
  centerScale = 1.2,
  edgeFade = 0.3,
  edgeBlur = 6,
  pauseOnHover = true,
  imageFit = "cover",
  grayscale = 0,
  className = "",
}: InfiniteSpiralProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | HTMLAnchorElement | null)[]>([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const autoSpeedRef = useRef(0);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const draggingRef = useRef(false);
  const lastPointerYRef = useRef(0);
  const dragMovedRef = useRef(false);

  const normalizedItems = useMemo(
    () =>
      items.map((item, index) =>
        typeof item === "string"
          ? { src: item, alt: `Spiral image ${index + 1}` }
          : { alt: `Spiral image ${index + 1}`, ...item },
      ),
    [items],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || normalizedItems.length === 0) return;

    let frameId = 0;
    let previousTime = performance.now();
    let bounds = root.getBoundingClientRect();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scrollEnabled = animationMode === "scroll" || animationMode === "all";
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55;
    let lastScrollY = window.scrollY;

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    intersectionObserver.observe(root);

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
      if (!scrollEnabled || !visibleRef.current || scrollDelta === 0) return;
      targetProgressRef.current += clamp(
        (scrollDelta * scrollSpeedMultiplier) / Math.max(verticalSpacing * 2, 1),
        -1.5,
        1.5,
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const render = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const autoEnabled = animationMode === "auto" || animationMode === "all";
      const motionPaused = draggingRef.current || (pauseOnHover && hoveredRef.current);
      const directionMultiplier = direction === "down" ? -1 : 1;
      const desiredAutoSpeed =
        autoEnabled && visibleRef.current && !reducedMotion.matches && !motionPaused
          ? speed * directionMultiplier
          : 0;
      const speedBlend = 1 - Math.exp(-delta * 7);
      autoSpeedRef.current += (desiredAutoSpeed - autoSpeedRef.current) * speedBlend;
      targetProgressRef.current += autoSpeedRef.current * delta;

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11));
      progressRef.current += (targetProgressRef.current - progressRef.current) * followBlend;

      const count = normalizedItems.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35));
      const responsiveRadius = Math.min(radius, Math.max(72, width * 0.36)) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);
      const turnSize = Math.max(cardsPerTurn, 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        let offset = index - progressRef.current;
        offset = modulo(offset + half, count) - half;

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const opacity = 1 - smoothstep(fadeStart, 1, edge);
        const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
        const scale = (1 + (centerScale - 1) * focus) * fit;
        const angle = offset * (360 / turnSize) + rotation;
        const angleRadians = (angle * Math.PI) / 180;
        const x = Math.sin(angleRadians) * responsiveRadius;
        const z = Math.cos(angleRadians) * responsiveRadius;
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, DEPTH_MAX);
        const raster = Math.max(1, centerScale) * DEPTH_MAX;
        const visualScale = (scale * depthScale) / raster;
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
        const blur = edgeBlur * smoothstep(0.35, 1, edge);
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing * fit}px, 0) rotateZ(${cardTilt}deg) scale(${visualScale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : "none";
        card.style.zIndex = String(Math.round(depth * 100000) + index);
        card.style.pointerEvents = opacity > 0.25 ? "auto" : "none";
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    normalizedItems,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    verticalSpacing,
    cardsPerTurn,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover,
  ]);

  const raster = Math.max(1, centerScale) * DEPTH_MAX;
  const layoutWidth = cardWidth * raster;
  const layoutHeight = cardHeight * raster;

  const rootStyle = {
    perspective: `${perspective}px`,
    "--infinite-spiral-card-width": `${layoutWidth}px`,
    "--infinite-spiral-card-height": `${layoutHeight}px`,
    "--infinite-spiral-card-radius": `${cardRadius * raster}px`,
    cursor: animationMode === "drag" || animationMode === "all" ? "grab" : "default",
    touchAction: animationMode === "drag" || animationMode === "all" ? "pan-x" : "auto",
    userSelect: animationMode === "drag" || animationMode === "all" ? "none" : "auto",
  } as CSSProperties;

  const dragEnabled = animationMode === "drag" || animationMode === "all";

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.style.cursor = dragEnabled ? "grab" : "default";
  };

  return (
    <div
      ref={rootRef}
      className={`infinite-spiral ${className}`.trim()}
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onPointerDown={(event) => {
        if (!dragEnabled || event.button !== 0) return;
        draggingRef.current = true;
        dragMovedRef.current = false;
        lastPointerYRef.current = event.clientY;
        targetProgressRef.current = progressRef.current;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current) return;
        const pointerDelta = event.clientY - lastPointerYRef.current;
        lastPointerYRef.current = event.clientY;
        if (Math.abs(pointerDelta) > 0.5) dragMovedRef.current = true;
        targetProgressRef.current -= pointerDelta / Math.max(verticalSpacing, 1);
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={(event) => {
        if (!dragMovedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        dragMovedRef.current = false;
      }}
    >
      <div className="infinite-spiral__stage" role="list" aria-label="Infinite spiral gallery">
        {normalizedItems.map((item, index) => {
          const shared = {
            className: "infinite-spiral__item",
            style: {
              width: layoutWidth,
              height: layoutHeight,
              borderRadius: cardRadius * raster,
            },
            role: "listitem" as const,
            "aria-label": item.label ?? item.alt,
          };
          const image = (
            <img
              className="infinite-spiral__image"
              src={item.src}
              alt={item.alt}
              loading={index < 6 ? "eager" : "lazy"}
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "none",
                maxHeight: "none",
                objectFit: imageFit,
                filter: `grayscale(${Math.min(1, Math.max(0, grayscale))})`,
              }}
            />
          );
          if (item.href) {
            return (
              <a
                key={item.id ?? `${item.src}-${index}`}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                href={item.href}
                target={item.target}
                rel={item.target === "_blank" ? "noreferrer" : undefined}
                {...shared}
              >
                {image}
              </a>
            );
          }
          return (
            <div
              key={item.id ?? `${item.src}-${index}`}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              {...shared}
            >
              {image}
            </div>
          );
        })}
      </div>
    </div>
  );
}
