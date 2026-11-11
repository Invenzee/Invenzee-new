import type { ReactNode } from "react";

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      width="1em"
      height="1em"
    >
      <path
        d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  /** primary = cyan pill (main CTA) · outline = hairline pill · solid = navy pill for light sections */
  variant?: "primary" | "outline" | "solid";
  size?: "md" | "lg";
  className?: string;
  external?: boolean;
};

const variants = {
  primary:
    "bg-cyan text-navy hover:bg-cyan-bright [--chip:var(--color-navy)] [--chip-fg:#fff]",
  outline:
    "border border-line-2 text-fg hover:border-fg [--chip:var(--fg)] [--chip-fg:var(--bg)]",
  solid:
    "bg-navy text-white hover:bg-ink-3 [--chip:var(--color-cyan)] [--chip-fg:var(--color-navy)]",
} as const;

const sizes = {
  md: "h-11 pl-5 pr-1.5 text-[0.9375rem] [--chip-size:2rem]",
  lg: "h-14 pl-7 pr-2 text-[1.0625rem] [--chip-size:2.5rem]",
} as const;

/** Pill button with the arrow chip. The arrow slides through the chip on hover. */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external,
}: ButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group/btn inline-flex shrink-0 items-center gap-3 mark font-display font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span>{children}</span>
      <span className="relative grid size-(--chip-size) place-items-center overflow-hidden mark-tile bg-(--chip) text-(--chip-fg)">
        <ArrowIcon className="transition-transform duration-500 ease-expo group-hover/btn:translate-x-[180%]" />
        <ArrowIcon className="absolute -translate-x-[180%] transition-transform duration-500 ease-expo group-hover/btn:translate-x-0" />
      </span>
    </a>
  );
}

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

/** Underlined text link with a trailing arrow, e.g. "Start a project →" */
export function ArrowLink({
  href,
  children,
  className = "",
  external,
}: ArrowLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group/link relative inline-flex items-center gap-2 pb-1.5 font-display text-[0.9375rem] font-semibold tracking-[-0.01em] text-fg ${className}`}
    >
      <span>{children}</span>
      <ArrowIcon className="transition-transform duration-500 ease-expo group-hover/link:translate-x-1" />
      <span className="absolute inset-x-0 bottom-0 h-px bg-line-2" />
      <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-expo group-hover/link:scale-x-100" />
    </a>
  );
}
