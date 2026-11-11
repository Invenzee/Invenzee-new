import { Bar, Sq, motion } from "./primitives";
import { FONT, INK, NAVY, WHITE, isLight, type VariantProps } from "./theme";

const WAVE = [
  8, 16, 26, 14, 32, 20, 38, 24, 12, 28, 42, 18, 10, 34, 22, 16, 40, 26, 14, 30,
  46, 20, 12, 36, 24, 16, 32, 10, 26, 38, 18, 14, 28, 22, 12, 20, 30, 16,
];

const GHOSTS = [
  { x: 317, y: 302, opacity: 0.22 },
  { x: 392, y: 329, opacity: 0.4 },
  { x: 475, y: 355, opacity: 0.62 },
];

function Crops({
  x,
  y,
  w,
  h,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}) {
  const n = 14;
  const m = 12;
  const corners = [
    [x + m, y + m, 1, 1],
    [x + w - m, y + m, -1, 1],
    [x + m, y + h - m, 1, -1],
    [x + w - m, y + h - m, -1, -1],
  ] as const;
  return (
    <g>
      {corners.map(([cx, cy, dx, dy]) => (
        <g key={`${cx}-${cy}`}>
          <line
            x1={cx}
            y1={cy}
            x2={cx + dx * n}
            y2={cy}
            stroke={color}
            strokeWidth={1.75}
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy + dy * n}
            stroke={color}
            strokeWidth={1.75}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </g>
  );
}

export function MotionArt({ p, id, animated, marker, tone }: VariantProps) {
  const light = isLight(tone);
  const frame = light ? WHITE : p.surface2;
  const screenTop = light ? "#1C2058" : p.surface2;
  const screenBot = light ? NAVY : p.surface;
  const sceneA = WHITE;
  const sceneB = light ? "#86E2F5" : p.accent;
  const groove = light ? "rgba(16,17,69,0.08)" : p.surface;
  const clipA = light ? NAVY : p.fg;
  const clipB = light ? "rgba(16,17,69,0.45)" : p.fgSoft;
  const frameBox = { x: 150, y: 78, w: 468, h: 276 };
  const screen = { x: 162, y: 90, w: 444, h: 250 };

  return (
    <g>
      <defs>
        <linearGradient id={`${id}-vid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={screenTop} />
          <stop offset="1" stopColor={screenBot} />
        </linearGradient>
        <clipPath id={`${id}-vid`}>
          <rect x={screen.x} y={screen.y} width={screen.w} height={screen.h} rx={16} />
        </clipPath>
      </defs>

      <rect x={-60} y={430} width={980} height={220} fill={p.surface} opacity={light ? 0.45 : 0.55} />

      <rect
        x={frameBox.x + 8}
        y={frameBox.y + 10}
        width={frameBox.w}
        height={frameBox.h}
        rx={24}
        fill={INK}
        opacity={light ? 0.1 : 0.35}
      />
      <rect
        x={frameBox.x}
        y={frameBox.y}
        width={frameBox.w}
        height={frameBox.h}
        rx={24}
        fill={frame}
        stroke={p.lineStrong}
        strokeWidth={1.5}
      />
      <g clipPath={`url(#${id}-vid)`}>
        <rect
          x={screen.x}
          y={screen.y}
          width={screen.w}
          height={screen.h}
          fill={`url(#${id}-vid)`}
        />
        <circle cx={268} cy={268} r={78} fill={sceneB} />
        <rect x={468} y={112} width={120} height={70} rx={18} fill={sceneA} />
        <line
          x1={196}
          y1={150}
          x2={310}
          y2={214}
          stroke={sceneA}
          strokeWidth={16}
          strokeLinecap="round"
        />
        <circle cx={520} cy={248} r={28} fill={marker} stroke={NAVY} strokeWidth={2} />
        <Sq x={430} y={250} size={18} fill={sceneA} />
        <Sq x={200} y={118} size={14} fill={marker} stroke={NAVY} sw={1.5} rx={3} />
        <circle
          cx={186}
          cy={112}
          r={6}
          fill={marker}
          className={motion(animated, "blink")}
        />
      </g>
      <Crops x={screen.x} y={screen.y} w={screen.w} h={screen.h} color={WHITE} />
      <circle cx={384} cy={215} r={36} fill={WHITE} />
      <polygon points="376,198 376,232 404,215" fill={NAVY} />

      <path
        d="M250 274 Q400 340 568 378"
        fill="none"
        stroke={p.fg}
        strokeWidth={1.75}
        strokeDasharray="7 9"
        strokeLinecap="round"
        className={motion(animated, "march")}
      />
      {GHOSTS.map((ghost) => (
        <Sq
          key={`${ghost.x}-${ghost.y}`}
          x={ghost.x - 15}
          y={ghost.y - 15}
          size={30}
          fill={p.fg}
          opacity={ghost.opacity}
        />
      ))}
      <g className={motion(animated, "pulse")}>
        <Sq x={550} y={360} size={36} fill={marker} stroke={NAVY} sw={2} />
      </g>

      <text
        x={204}
        y={378}
        fill={p.fgSoft}
        fontFamily={FONT.mono}
        fontSize={12}
        fontWeight={500}
      >
        01
      </text>
      {Array.from({ length: 34 }, (_, i) => {
        const x = 168 + i * 16;
        const major = i % 4 === 0;
        return (
          <line
            key={`tk-${x}`}
            x1={x}
            y1={major ? 392 : 398}
            x2={x}
            y2={412}
            stroke={p.lineStrong}
            strokeWidth={1.5}
          />
        );
      })}

      <rect x={160} y={424} width={540} height={30} rx={8} fill={groove} />
      <Bar x={176} y={429} w={118} h={20} fill={clipB} rx={6} />
      <Bar x={306} y={429} w={86} h={20} fill={p.accent} rx={6} />
      <rect x={402} y={428} width={78} height={22} rx={6} fill={NAVY} />
      <Bar x={404} y={430} w={74} h={18} fill={marker} rx={5} />
      <Bar x={494} y={429} w={160} h={20} fill={clipA} opacity={0.85} rx={6} />

      <rect x={160} y={462} width={540} height={30} rx={8} fill={groove} />
      <Bar x={188} y={467} w={150} h={20} fill={clipA} opacity={0.78} rx={6} />
      <Bar x={352} y={467} w={210} h={20} fill={p.accent} opacity={0.85} rx={6} />
      <Bar x={576} y={467} w={90} h={20} fill={clipB} rx={6} />
      {[400, 468, 520].map((x) => (
        <rect
          key={`kf-${x}`}
          x={x}
          y={471}
          width={9}
          height={9}
          fill={marker}
          stroke={NAVY}
          strokeWidth={1}
          transform={`rotate(45 ${x + 4.5} ${471 + 4.5})`}
        />
      ))}

      <rect x={160} y={498} width={540} height={26} rx={8} fill={groove} />
      {WAVE.map((sample, i) => {
        const h = Math.max(4, Math.round(sample * 0.46));
        return (
          <rect
            key={`w-${176 + i * 13}`}
            x={176 + i * 13}
            y={511 - h / 2}
            width={4}
            height={h}
            rx={1.5}
            fill={i % 7 === 3 ? marker : p.fg}
            stroke={i % 7 === 3 ? NAVY : "none"}
            strokeWidth={i % 7 === 3 ? 1 : 0}
          />
        );
      })}

      <g className={motion(animated, "playhead")}>
        <rect x={168} y={388} width={470} height={140} fill="transparent" />
        <line
          x1={186}
          y1={388}
          x2={186}
          y2={524}
          stroke={p.accent}
          strokeWidth={2}
        />
        <rect x={176} y={380} width={20} height={16} rx={4} fill={p.accent} />
        <rect x={182} y={384} width={8} height={8} rx={2} fill={p.accentOn} />
      </g>
    </g>
  );
}
