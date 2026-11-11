import { Hair, Sq, motion } from "./primitives";
import {
  CORAL,
  CYAN,
  FONT,
  INK,
  NAVY,
  PAPER,
  WHITE,
  isLight,
  type VariantProps,
} from "./theme";

/** Two parallel 60° slashes plus a chevron, in a 0–110 box. */
function Monogram({ fill, dot }: { fill: string; dot: string }) {
  return (
    <g>
      <line
        x1={18}
        y1={74}
        x2={42}
        y2={32}
        stroke={fill}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <line
        x1={34}
        y1={86}
        x2={56}
        y2={48}
        stroke={fill}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <polyline
        points="66,50 86,84 106,50"
        fill="none"
        stroke={fill}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x={48} y={12} width={12} height={12} rx={3} fill={dot} />
    </g>
  );
}

const TICKS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return {
    a,
    x1: +(Math.cos(a) * 178).toFixed(2),
    y1: +(Math.sin(a) * 178).toFixed(2),
    x2: +(Math.cos(a) * 196).toFixed(2),
    y2: +(Math.sin(a) * 196).toFixed(2),
  };
});

export function BrandArt({ p, id, animated, marker, tone }: VariantProps) {
  const light = isLight(tone);
  const tile = { x: 168, y: 136, s: 286 };
  const center = { x: tile.x + tile.s / 2, y: tile.y + tile.s / 2 };
  const heroFill = tone === "paper" ? NAVY : WHITE;
  const heroMark = tone === "paper" ? WHITE : NAVY;
  const iconFill = tone === "paper" ? WHITE : NAVY;
  const iconMark = tone === "paper" ? NAVY : WHITE;
  const tileLine =
    tone === "paper" ? "rgba(255,255,255,0.32)" : "rgba(16,17,69,0.2)";
  const cardBack = light ? NAVY : PAPER;
  const cardInk = light ? WHITE : NAVY;
  const shadow = light ? NAVY : INK;

  const swatches =
    tone === "paper"
      ? [NAVY, CYAN, "#0B7F99", CORAL, WHITE]
      : tone === "cyan"
        ? [NAVY, WHITE, CORAL, INK, "#86E2F5"]
        : [CORAL, CYAN, WHITE, "#86E2F5", PAPER];

  const icon = { x: 430, y: 112, s: 78 };

  return (
    <g>
      <defs>
        <clipPath id={`${id}-tile`}>
          <rect
            x={tile.x}
            y={tile.y}
            width={tile.s}
            height={tile.s}
            rx={tile.s * 0.22}
          />
        </clipPath>
        <clipPath id={`${id}-pat`}>
          <rect x={520} y={458} width={214} height={58} rx={14} />
        </clipPath>
      </defs>

      <Hair x1={-40} y1={center.y} x2={860} y2={center.y} stroke={p.line} />
      <Hair x1={-40} y1={188} x2={860} y2={188} stroke={p.line} />
      <Hair x1={-40} y1={392} x2={860} y2={392} stroke={p.line} />
      <Hair x1={center.x} y1={-40} x2={center.x} y2={660} stroke={p.line} />
      <Hair
        x1={center.x - 280}
        y1={center.y + 485}
        x2={center.x + 280}
        y2={center.y - 485}
        stroke={p.line}
      />
      <Hair
        x1={center.x - 280}
        y1={center.y - 485}
        x2={center.x + 280}
        y2={center.y + 485}
        stroke={p.line}
      />

      <g className={motion(animated, "sway")}>
        <circle
          cx={center.x}
          cy={center.y}
          r={186}
          fill="none"
          stroke={p.lineStrong}
          strokeWidth={1.5}
        />
        {TICKS.map((tick) => (
          <line
            key={tick.a.toFixed(3)}
            x1={center.x + tick.x1}
            y1={center.y + tick.y1}
            x2={center.x + tick.x2}
            y2={center.y + tick.y2}
            stroke={p.lineStrong}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}
      </g>

      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={`bleed-${i * 34}`}
          x1={-80 + i * 34}
          y1={250}
          x2={-36 + i * 34}
          y2={148}
          stroke={p.lineStrong}
          strokeWidth={9}
          strokeLinecap="round"
        />
      ))}

      <text
        x={568}
        y={196}
        fill={p.fg}
        fontFamily={FONT.display}
        fontSize={188}
        fontWeight={500}
        letterSpacing="-0.045em"
      >
        A
        <tspan
          dx={-8}
          fontFamily={FONT.accent}
          fontStyle="italic"
          fontWeight={500}
        >
          a
        </tspan>
      </text>

      <g transform="rotate(-7 624 292)">
        <rect
          x={528}
          y={246}
          width={204}
          height={120}
          rx={16}
          fill={shadow}
          opacity={light ? 0.16 : 0.4}
          transform="translate(8 10)"
        />
        <rect x={520} y={236} width={204} height={120} rx={16} fill={cardBack} />
        <line
          x1={548}
          y1={328}
          x2={596}
          y2={252}
          stroke={cardInk}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.85}
        />
        <line
          x1={578}
          y1={332}
          x2={618}
          y2={268}
          stroke={cardInk}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.85}
        />
        <line
          x1={608}
          y1={336}
          x2={640}
          y2={286}
          stroke={marker}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <Sq x={680} y={250} size={16} fill={marker} />
      </g>

      <g transform="rotate(4.5 650 360)">
        <rect
          x={556}
          y={312}
          width={204}
          height={120}
          rx={16}
          fill={shadow}
          opacity={light ? 0.14 : 0.38}
          transform="translate(7 9)"
        />
        <rect x={548} y={302} width={204} height={120} rx={16} fill={WHITE} />
        <g transform="translate(564 316) scale(0.4)">
          <Monogram fill={NAVY} dot={marker} />
        </g>
        <rect x={624} y={328} width={88} height={8} rx={4} fill={NAVY} />
        <rect
          x={624}
          y={346}
          width={58}
          height={6}
          rx={3}
          fill={NAVY}
          opacity={0.35}
        />
        <text
          x={732}
          y={404}
          textAnchor="end"
          fill={marker}
          fontFamily={FONT.mono}
          fontSize={15}
          fontWeight={500}
        >
          01
        </text>
      </g>

      <g clipPath={`url(#${id}-tile)`}>
        <rect
          x={tile.x}
          y={tile.y}
          width={tile.s}
          height={tile.s}
          fill={heroFill}
        />
        <polygon
          points={`${tile.x},${tile.y} ${tile.x + 86},${tile.y} ${tile.x},${tile.y + 86}`}
          fill={CYAN}
        />
        <circle
          cx={center.x}
          cy={center.y}
          r={108}
          fill="none"
          stroke={tileLine}
          strokeWidth={1.5}
        />
        <Hair
          x1={tile.x + 28}
          y1={center.y}
          x2={tile.x + tile.s - 28}
          y2={center.y}
          stroke={tileLine}
        />
        <Hair
          x1={tile.x + 28}
          y1={center.y - 52}
          x2={tile.x + tile.s - 28}
          y2={center.y - 52}
          stroke={tileLine}
        />
        <Hair
          x1={tile.x + 28}
          y1={center.y + 52}
          x2={tile.x + tile.s - 28}
          y2={center.y + 52}
          stroke={tileLine}
        />
        <Hair
          x1={center.x - 78}
          y1={tile.y + 36}
          x2={center.x + 24}
          y2={tile.y + tile.s - 24}
          stroke={tileLine}
        />
        <g transform={`translate(${tile.x + 38} ${tile.y + 52}) scale(1.92)`}>
          <Monogram fill={heroMark} dot={marker} />
        </g>
      </g>

      <g className={motion(animated, "float")}>
        <Sq x={icon.x} y={icon.y} size={icon.s} fill={iconFill} stroke={CYAN} sw={3} />
        <g transform={`translate(${icon.x + 14} ${icon.y + 16}) scale(0.46)`}>
          <Monogram fill={iconMark} dot={CYAN} />
        </g>
      </g>

      {swatches.map((color, i) => {
        const x = 168 + i * 50;
        return (
          <g key={color + i}>
            <Sq
              x={x}
              y={442}
              size={38}
              fill={color}
              stroke={p.lineStrong}
              sw={1.25}
            />
            <rect
              x={x + 4}
              y={488}
              width={26}
              height={4}
              rx={2}
              fill={p.fgSoft}
            />
          </g>
        );
      })}

      <g clipPath={`url(#${id}-pat)`}>
        <rect x={520} y={458} width={214} height={58} rx={14} fill={light ? WHITE : p.surface} />
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={`pat-${i * 22}`}
            x1={508 + i * 22}
            y1={528}
            x2={534 + i * 22}
            y2={446}
            stroke={marker}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}
      </g>

      {[
        { x: 156, y: 124, fill: p.fg },
        { x: 442, y: 124, fill: p.fg },
        { x: 156, y: 410, fill: p.fg },
        { x: 442, y: 410, fill: marker },
        { x: 96, y: 268, fill: p.fg },
        { x: 612, y: 168, fill: marker },
      ].map((dot) => (
        <Sq key={`${dot.x}-${dot.y}`} x={dot.x} y={dot.y} size={12} fill={dot.fill} rx={2.5} />
      ))}
      <g className={motion(animated, "pulse")}>
        <Sq x={center.x - 6} y={114} size={12} fill={marker} rx={2.5} />
      </g>
    </g>
  );
}
