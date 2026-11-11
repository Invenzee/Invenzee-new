import Image from "next/image";

type Props = {
  /** full = tile + wordmark (dark backgrounds) · ink = navy wordmark (light backgrounds) · mark = tile only */
  variant?: "full" | "ink" | "mark";
  /** Rendered height in px */
  height?: number;
  className?: string;
  priority?: boolean;
};

const files = {
  full: { src: "/brand/logo.png", w: 992, h: 212 },
  ink: { src: "/brand/logo-ink.png", w: 992, h: 212 },
  mark: { src: "/brand/mark.png", w: 212, h: 212 },
} as const;

export function Logo({
  variant = "full",
  height = 32,
  className = "",
  priority,
}: Props) {
  const f = files[variant];
  return (
    <Image
      src={f.src}
      alt="Invenzee"
      width={f.w}
      height={f.h}
      priority={priority}
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
