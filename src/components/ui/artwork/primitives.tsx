import styles from "../Artwork.module.css";

export function motion(
  animated: boolean,
  name: keyof typeof styles,
): string | undefined {
  return animated ? styles[name] : undefined;
}

export function Bar({
  x,
  y,
  w,
  h,
  fill,
  rx,
  opacity,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  rx?: number;
  opacity?: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx ?? h / 2}
      fill={fill}
      opacity={opacity}
    />
  );
}

export function Sq({
  x,
  y,
  size,
  fill,
  rx,
  stroke,
  sw,
  opacity,
}: {
  x: number;
  y: number;
  size: number;
  fill: string;
  rx?: number;
  stroke?: string;
  sw?: number;
  opacity?: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={size}
      height={size}
      rx={rx ?? Math.round(size * 0.22)}
      fill={fill}
      stroke={stroke}
      strokeWidth={stroke ? sw : undefined}
      opacity={opacity}
    />
  );
}

export function Hair({
  x1,
  y1,
  x2,
  y2,
  stroke,
  sw = 1.5,
  dash,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  sw?: number;
  dash?: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={sw}
      strokeDasharray={dash}
      strokeLinecap="round"
    />
  );
}

export function VGrid({
  stroke,
  left = -20,
  step = 80,
  count = 12,
}: {
  stroke: string;
  left?: number;
  step?: number;
  count?: number;
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = left + i * step;
        return <Hair key={x} x1={x} y1={-80} x2={x} y2={700} stroke={stroke} />;
      })}
    </g>
  );
}

export function HGrid({
  stroke,
  top,
  step,
  count,
  x1 = -40,
  x2 = 860,
}: {
  stroke: string;
  top: number;
  step: number;
  count: number;
  x1?: number;
  x2?: number;
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const y = top + i * step;
        return <Hair key={y} x1={x1} y1={y} x2={x2} y2={y} stroke={stroke} />;
      })}
    </g>
  );
}

/** Very shallow vertical fade for device screens. */
export function ScreenDef({
  id,
  from,
  to,
}: {
  id: string;
  from: string;
  to: string;
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
}
