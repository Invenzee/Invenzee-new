import { useId, type ReactNode } from "react";
import type { ArtTone, ArtVariant } from "@/content/site";
import { AppArt } from "./artwork/AppArt";
import { BrandArt } from "./artwork/BrandArt";
import { GrowthArt } from "./artwork/GrowthArt";
import { IllustrationArt } from "./artwork/IllustrationArt";
import { MotionArt } from "./artwork/MotionArt";
import { markerFor, palettes, type VariantProps } from "./artwork/theme";
import { WebArt } from "./artwork/WebArt";

export type ArtworkProps = {
  variant: ArtVariant;
  tone?: ArtTone;
  /** Sizing/positioning classes. The artwork always fills the box it is given. */
  className?: string;
  /** Subtle looping motion inside the artwork (default true) */
  animated?: boolean;
};

const scenes = {
  brand: BrandArt,
  web: WebArt,
  app: AppArt,
  growth: GrowthArt,
  motion: MotionArt,
  illustration: IllustrationArt,
} satisfies Record<ArtVariant, (props: VariantProps) => ReactNode>;

export function Artwork({
  variant,
  tone = "navy",
  className = "",
  animated = true,
}: ArtworkProps) {
  const id = `a${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const Scene = scenes[variant];
  const props: VariantProps = {
    p: palettes[tone],
    id,
    animated,
    marker: markerFor(variant, tone),
    tone,
  };

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect x={-100} y={-100} width={1000} height={800} fill={props.p.bg} />
      <Scene {...props} />
    </svg>
  );
}
