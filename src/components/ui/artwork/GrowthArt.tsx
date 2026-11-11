import { Bar, HGrid, Hair, Sq, motion } from "./primitives";
import { FONT, INK, NAVY, WHITE, isLight, type VariantProps } from "./theme";

const PTS = [
  [176, 452],
  [300, 408],
  [420, 338],
  [520, 258],
  [600, 188],
] as const;

const BARS = [
  { x: 356, h: 70 },
  { x: 424, h: 98 },
  { x: 492, h: 84 },
  { x: 560, h: 132 },
  { x: 628, h: 158 },
  { x: 696, h: 118 },
];

const LINE = PTS.map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0]} ${pt[1]}`).join(" ");

function Up({
  x,
  y,
  size,
  fill,
  glyph,
}: {
  x: number;
  y: number;
  size: number;
  fill: string;
  glyph: string;
}) {
  const mid = x + size / 2;
  return (
    <g>
      <Sq x={x} y={y} size={size} fill={fill} stroke={NAVY} sw={1.75} />
      <path
        d={`M${mid} ${y + size * 0.72} V${y + size * 0.3} M${mid - size * 0.2} ${y + size * 0.48} L${mid} ${y + size * 0.28} L${mid + size * 0.2} ${y + size * 0.48}`}
        fill="none"
        stroke={glyph}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export function GrowthArt({ p, animated, marker, tone }: VariantProps) {
  const light = isLight(tone);
  const base = 486;
  const chip = light ? NAVY : WHITE;
  const chipInk = light ? WHITE : NAVY;
  const row = light ? WHITE : p.surface;
  const barFill = (i: number) => {
    if (i === 4) return marker;
    if (i === 2) return p.accent;
    if (tone === "paper") return "#9AABBE";
    if (tone === "cyan") return WHITE;
    return p.surface2;
  };

  return (
    <g>
      <HGrid stroke={p.line} top={150} step={68} count={6} />
      <Hair x1={148} y1={120} x2={148} y2={base} stroke={p.lineStrong} />
      <Hair x1={148} y1={base} x2={820} y2={base} stroke={p.lineStrong} />

      {BARS.map((bar, i) => (
        <rect
          key={`bar-${bar.x}`}
          x={bar.x}
          y={base - bar.h}
          width={34}
          height={bar.h}
          rx={8}
          fill={barFill(i)}
          stroke={i === 4 ? NAVY : "none"}
          strokeWidth={i === 4 ? 1.75 : 0}
          opacity={i === 4 || i === 2 ? 1 : 0.95}
        />
      ))}

      <path d={`${LINE} L600 ${base} L176 ${base} Z`} fill={p.accent} opacity={0.16} />
      <path
        d={LINE}
        fill="none"
        stroke={p.accent}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className={motion(animated, "draw")}
      />

      {PTS.slice(0, 4).map((pt) => (
        <g key={`n-${pt[0]}`}>
          <Sq x={pt[0] - 6} y={pt[1] - 6} size={12} fill={WHITE} stroke={NAVY} sw={1.75} rx={3} />
          <line
            x1={pt[0]}
            y1={base}
            x2={pt[0]}
            y2={base + 8}
            stroke={p.lineStrong}
            strokeWidth={1.5}
          />
        </g>
      ))}
      <line
        x1={PTS[4][0]}
        y1={base}
        x2={PTS[4][0]}
        y2={base + 8}
        stroke={p.lineStrong}
        strokeWidth={1.5}
      />
      <g className={motion(animated, "pulse")}>
        <circle
          cx={PTS[4][0]}
          cy={PTS[4][1]}
          r={18}
          fill="none"
          stroke={p.fg}
          strokeWidth={1.75}
        />
      </g>
      <Sq
        x={PTS[4][0] - 9}
        y={PTS[4][1] - 9}
        size={18}
        fill={marker}
        stroke={NAVY}
        sw={1.75}
        rx={4}
      />

      <rect x={168} y={104} width={236} height={48} rx={24} fill={chip} />
      <circle cx={194} cy={128} r={8} fill="none" stroke={chipInk} strokeWidth={2} />
      <line
        x1={200}
        y1={134}
        x2={208}
        y2={142}
        stroke={chipInk}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Bar x={220} y={124} w={92} h={8} fill={chipInk} opacity={0.9} />
      <rect
        x={322}
        y={118}
        width={2.5}
        height={18}
        rx={1}
        fill={light ? WHITE : p.accent}
        className={motion(animated, "blink")}
      />

      {[0, 1, 2].map((i) => {
        const y = 168 + i * 40;
        const hot = i === 0;
        return (
          <g key={`res-${y}`}>
            <rect
              x={168}
              y={y}
              width={220}
              height={34}
              rx={10}
              fill={hot ? p.accent : row}
              stroke={hot ? "none" : p.line}
              strokeWidth={1.25}
            />
            {hot ? (
              <text
                x={184}
                y={y + 17}
                dominantBaseline="central"
                fill={p.accentOn}
                fontFamily={FONT.mono}
                fontSize={13}
                fontWeight={500}
              >
                #1
              </text>
            ) : (
              <Sq x={182} y={y + 9} size={16} fill={p.surface2} stroke={p.lineStrong} sw={1} rx={3} />
            )}
            <Bar
              x={hot ? 214 : 208}
              y={y + 14}
              w={hot ? 96 : 112}
              h={6}
              fill={hot ? p.accentOn : p.fgSoft}
            />
            {hot ? (
              <Sq x={364} y={y + 9} size={16} fill={marker} stroke={NAVY} sw={1.5} rx={3} />
            ) : null}
          </g>
        );
      })}

      <g className={motion(animated, "float")}>
        <rect x={554} y={108} width={164} height={50} rx={16} fill={INK} opacity={light ? 0.14 : 0.35} />
        <rect
          x={548}
          y={100}
          width={164}
          height={50}
          rx={16}
          fill={WHITE}
          stroke={p.lineStrong}
          strokeWidth={1.25}
        />
        <Up x={560} y={109} size={32} fill={marker} glyph={NAVY} />
        <Bar x={604} y={122} w={86} h={8} fill={NAVY} opacity={0.35} />
      </g>

      <g className={motion(animated, "floatAlt")}>
        <rect x={182} y={324} width={148} height={46} rx={16} fill={INK} opacity={light ? 0.12 : 0.28} />
        <rect
          x={176}
          y={316}
          width={148}
          height={46}
          rx={16}
          fill={WHITE}
          stroke={p.lineStrong}
          strokeWidth={1.25}
        />
        <Up x={188} y={324} size={30} fill={marker} glyph={NAVY} />
        <Bar x={228} y={335} w={76} h={7} fill={NAVY} opacity={0.35} />
      </g>

      <circle cx={454} cy={214} r={46} fill="none" stroke={p.fg} strokeWidth={1.5} opacity={0.35} />
      <circle cx={454} cy={214} r={30} fill="none" stroke={p.fg} strokeWidth={1.5} opacity={0.55} />
      <circle cx={454} cy={214} r={15} fill="none" stroke={p.accent} strokeWidth={2} />
      <circle cx={454} cy={214} r={8} fill={NAVY} />
      <circle cx={454} cy={214} r={3.5} fill={marker} />
      <line
        x1={512}
        y1={152}
        x2={466}
        y2={204}
        stroke={p.accent}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <polygon points="448,220 472,190 478,212" fill={p.accent} />
    </g>
  );
}
