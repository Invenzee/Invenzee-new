import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Marker colour; defaults to brand cyan */
  color?: string;
  className?: string;
};

/** Small mono uppercase label with the square marker, e.g. "■ WHAT WE DO" */
export function Label({ children, color, className = "" }: Props) {
  return (
    <span
      className={`t-label inline-flex items-center gap-2.5 text-fg-3 ${className}`}
    >
      <span
        className="sq"
        style={color ? ({ "--sq": color } as CSSProperties) : undefined}
      />
      {children}
    </span>
  );
}
