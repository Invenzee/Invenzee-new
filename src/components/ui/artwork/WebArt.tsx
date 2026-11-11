import { Bar, Hair, ScreenDef, Sq, VGrid, motion } from "./primitives";
import {
  CYAN,
  INK,
  NAVY,
  WHITE,
  isLight,
  type VariantProps,
} from "./theme";

function Lock({ x, y, stroke }: { x: number; y: number; stroke: string }) {
  return (
    <g>
      <rect x={x} y={y + 4} width={10} height={8} rx={2} fill={stroke} />
      <path
        d={`M${x + 2} ${y + 4.5} V${y + 3} a3 3 0 0 1 6 0 v1.5`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </g>
  );
}

function Slashes({
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
  const count = Math.max(3, Math.round(w / 22));
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <line
          key={`sl-${x}-${i}`}
          x1={x + 8 + i * 18}
          y1={y + h - 6}
          x2={x + 8 + i * 18 + h * 0.42}
          y2={y + 6}
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

export function WebArt({ p, id, animated, marker, tone }: VariantProps) {
  const light = isLight(tone);
  const frame = light ? WHITE : p.surface2;
  const page = light ? (tone === "paper" ? "#F7F8FB" : WHITE) : p.surface;
  const ink = light ? NAVY : WHITE;
  const muted = light ? "rgba(16,17,69,0.42)" : "rgba(255,255,255,0.5)";
  const photo = light ? NAVY : INK;
  const photoInk = light ? (tone === "paper" ? CYAN : WHITE) : marker;
  const win = { x: 118, y: 86, w: 508, h: 382 };
  const phone = { x: 508, y: 274, w: 158, h: 304 };

  return (
    <g>
      <defs>
        <ScreenDef id={`${id}-page`} from={light ? WHITE : p.surface2} to={page} />
        <ScreenDef
          id={`${id}-phone`}
          from={light ? "#F4F7FB" : p.surface2}
          to={light ? WHITE : p.surface}
        />
        <clipPath id={`${id}-photo`}>
          <rect x={452} y={178} width={148} height={132} rx={16} />
        </clipPath>
        <clipPath id={`${id}-pscreen`}>
          <rect x={phone.x + 10} y={phone.y + 14} width={138} height={276} rx={18} />
        </clipPath>
        <clipPath id={`${id}-win`}>
          <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={22} />
        </clipPath>
      </defs>

      <VGrid stroke={p.line} left={-10} step={74} count={12} />

      <rect
        x={win.x + 10}
        y={win.y + 14}
        width={win.w}
        height={win.h}
        rx={22}
        fill={light ? NAVY : INK}
        opacity={light ? 0.12 : 0.4}
      />

      <g clipPath={`url(#${id}-win)`}>
        <rect
          x={win.x}
          y={win.y}
          width={win.w}
          height={win.h}
          fill={`url(#${id}-page)`}
        />
        <rect x={win.x} y={win.y} width={win.w} height={46} fill={frame} />
        <Hair
          x1={win.x}
          y1={win.y + 46}
          x2={win.x + win.w}
          y2={win.y + 46}
          stroke={p.line}
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={`dot-${i}`}
            cx={win.x + 28 + i * 16}
            cy={win.y + 23}
            r={4.5}
            fill={i === 0 ? marker : muted}
          />
        ))}
        <rect
          x={win.x + 168}
          y={win.y + 12}
          width={196}
          height={22}
          rx={11}
          fill={light ? "rgba(16,17,69,0.06)" : "rgba(255,255,255,0.06)"}
        />
        <Lock x={win.x + 180} y={win.y + 14} stroke={muted} />
        <Bar x={win.x + 200} y={win.y + 20} w={72} h={6} fill={muted} />
        <rect
          x={win.x + 286}
          y={win.y + 18}
          width={2}
          height={10}
          rx={1}
          fill={p.accent}
          className={motion(animated, "blink")}
        />

        <Sq x={142} y={150} size={26} fill={ink} />
        <rect x={148} y={156} width={8} height={14} rx={2} fill={page} transform="rotate(-60 152 163)" />
        <Bar x={180} y={158} w={42} h={7} fill={muted} />
        <Bar x={232} y={158} w={32} h={7} fill={muted} />
        <Bar x={274} y={158} w={36} h={7} fill={muted} />
        <rect x={520} y={148} width={78} height={28} rx={14} fill={ink} />
        <Bar x={534} y={159} w={36} h={6} fill={page} />

        <Bar x={142} y={196} w={250} h={18} fill={ink} />
        <Bar x={142} y={222} w={196} h={18} fill={p.accent} />
        <Bar x={142} y={248} w={128} h={18} fill={ink} />

        <g clipPath={`url(#${id}-photo)`}>
          <rect x={452} y={178} width={148} height={132} fill={photo} />
          <Slashes x={452} y={178} w={148} h={132} color={photoInk} />
          <Sq x={466} y={192} size={16} fill={marker} />
        </g>

        <Bar x={142} y={286} w={220} h={6} fill={muted} />
        <Bar x={142} y={300} w={188} h={6} fill={muted} />
        <Bar x={142} y={314} w={204} h={6} fill={muted} />
        <Bar x={142} y={328} w={140} h={6} fill={muted} />

        <rect x={142} y={348} width={112} height={34} rx={17} fill={p.accent} />
        <Bar x={158} y={361} w={48} h={7} fill={p.accentOn} />
        <Sq x={216} y={357} size={16} fill={p.accentOn} rx={4} />

        {[0, 1, 2].map((i) => {
          const x = 142 + i * 150;
          return (
            <g key={`card-${x}`}>
              <rect
                x={x}
                y={398}
                width={140}
                height={56}
                rx={12}
                fill={light ? WHITE : p.surface2}
                stroke={p.line}
                strokeWidth={1.25}
              />
              <Sq x={x + 10} y={408} size={36} fill={i === 1 ? p.accent : photo} />
              {i === 1 ? (
                <Sq x={x + 18} y={416} size={12} fill={p.accentOn} rx={2} />
              ) : (
                <line
                  x1={x + 18}
                  y1={436}
                  x2={x + 36}
                  y2={416}
                  stroke={photoInk}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              )}
              <Bar x={x + 54} y={416} w={68} h={6} fill={ink} />
              <Bar x={x + 54} y={430} w={44} h={5} fill={muted} />
            </g>
          );
        })}
      </g>
      <rect
        x={win.x}
        y={win.y}
        width={win.w}
        height={win.h}
        rx={22}
        fill="none"
        stroke={p.lineStrong}
        strokeWidth={1.5}
      />

      <g className={motion(animated, "nudge")}>
        <polygon
          points="268,372 268,394 274,387.5 280.5,396 283.8,394 277.2,385.4 286,385"
          fill={ink}
          stroke={page}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </g>

      <rect
        x={phone.x + 8}
        y={phone.y + 12}
        width={phone.w}
        height={phone.h}
        rx={28}
        fill={INK}
        opacity={0.28}
      />
      <rect
        x={phone.x}
        y={phone.y}
        width={phone.w}
        height={phone.h}
        rx={28}
        fill={INK}
      />
      <g clipPath={`url(#${id}-pscreen)`}>
        <rect
          x={phone.x + 10}
          y={phone.y + 14}
          width={138}
          height={276}
          fill={`url(#${id}-phone)`}
        />
        <Bar x={phone.x + 48} y={phone.y + 26} w={28} h={5} fill={muted} />
        <Sq x={phone.x + 118} y={phone.y + 24} size={8} fill={p.accent} rx={2} />
        <Sq x={phone.x + 24} y={phone.y + 46} size={18} fill={ink} />
        <Bar x={phone.x + 48} y={phone.y + 52} w={40} h={5} fill={muted} />
        <Bar x={phone.x + 24} y={phone.y + 78} w={100} h={12} fill={ink} />
        <Bar x={phone.x + 24} y={phone.y + 96} w={72} h={12} fill={p.accent} />
        <rect
          x={phone.x + 24}
          y={phone.y + 120}
          width={110}
          height={72}
          rx={12}
          fill={photo}
        />
        <Slashes
          x={phone.x + 24}
          y={phone.y + 120}
          w={110}
          h={72}
          color={photoInk}
        />
        <Bar x={phone.x + 24} y={phone.y + 204} w={96} h={5} fill={muted} />
        <Bar x={phone.x + 24} y={phone.y + 216} w={70} h={5} fill={muted} />
        <rect
          x={phone.x + 24}
          y={phone.y + 232}
          width={78}
          height={22}
          rx={11}
          fill={p.accent}
        />
        <Bar x={phone.x + 36} y={phone.y + 240} w={36} h={5} fill={p.accentOn} />
      </g>
      <rect
        x={phone.x + 56}
        y={phone.y + 10}
        width={46}
        height={8}
        rx={4}
        fill={INK}
      />
    </g>
  );
}
