import { Bar, Hair, ScreenDef, Sq, motion } from "./primitives";
import {
  CYAN_DEEP,
  INK,
  NAVY,
  WHITE,
  isLight,
  type VariantProps,
} from "./theme";

const LINES: { indent: number; w: number; tone: "fg" | "soft" | "accent" | "marker" }[] = [
  { indent: 0, w: 72, tone: "marker" },
  { indent: 0, w: 128, tone: "accent" },
  { indent: 16, w: 164, tone: "soft" },
  { indent: 16, w: 92, tone: "fg" },
  { indent: 32, w: 146, tone: "accent" },
  { indent: 32, w: 58, tone: "marker" },
  { indent: 32, w: 178, tone: "soft" },
  { indent: 16, w: 104, tone: "fg" },
  { indent: 16, w: 44, tone: "accent" },
  { indent: 0, w: 84, tone: "marker" },
  { indent: 0, w: 150, tone: "soft" },
  { indent: 16, w: 116, tone: "fg" },
];

const BARS = [28, 46, 34, 62, 48];

export function AppArt({ p, id, animated, marker, tone }: VariantProps) {
  const light = isLight(tone);
  const bezel = INK;
  const screenTop = light ? "#F7F9FC" : p.surface2;
  const screenBot = light ? WHITE : p.surface;
  const ink = light ? NAVY : WHITE;
  const muted = light ? "rgba(16,17,69,0.4)" : "rgba(255,255,255,0.48)";
  const codeAccent = tone === "cyan" ? CYAN_DEEP : p.accent;
  const editor = light ? WHITE : p.surface;
  const phone = { x: 168, y: 92, w: 198, h: 408 };
  const edit = { x: 424, y: 150, w: 340, h: 318 };

  const codeFill = {
    fg: ink,
    soft: muted,
    accent: codeAccent,
    marker,
  } as const;

  return (
    <g>
      <defs>
        <ScreenDef id={`${id}-screen`} from={screenTop} to={screenBot} />
        <clipPath id={`${id}-screen`}>
          <rect
            x={phone.x + 12}
            y={phone.y + 14}
            width={phone.w - 24}
            height={phone.h - 28}
            rx={24}
          />
        </clipPath>
        <clipPath id={`${id}-edit`}>
          <rect x={edit.x} y={edit.y} width={edit.w} height={edit.h} rx={18} />
        </clipPath>
      </defs>

      <rect x={-40} y={40} width={180} height={180} rx={40} fill={p.surface} opacity={0.85} />
      <rect x={680} y={420} width={220} height={220} rx={48} fill={p.surface} />
      <Sq x={40} y={460} size={28} fill={p.surface2} />
      <Sq x={720} y={80} size={22} fill={marker} opacity={0.85} />
      <Hair x1={-20} y1={520} x2={220} y2={80} stroke={p.line} />
      <Hair x1={620} y1={-20} x2={860} y2={280} stroke={p.line} />

      <rect
        x={edit.x + 10}
        y={edit.y + 12}
        width={edit.w}
        height={edit.h}
        rx={18}
        fill={INK}
        opacity={light ? 0.1 : 0.35}
      />
      <g clipPath={`url(#${id}-edit)`}>
        <rect x={edit.x} y={edit.y} width={edit.w} height={edit.h} fill={editor} />
        <rect
          x={edit.x}
          y={edit.y}
          width={edit.w}
          height={40}
          fill={light ? "#F3F5F8" : p.surface2}
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={`ed-${i}`}
            cx={edit.x + 22 + i * 14}
            cy={edit.y + 20}
            r={4}
            fill={i === 2 ? marker : muted}
          />
        ))}
        <Sq x={edit.x + 78} y={edit.y + 12} size={16} fill={p.accent} rx={4} />
        <Bar x={edit.x + 102} y={edit.y + 17} w={64} h={6} fill={muted} />
        <rect
          x={edit.x}
          y={edit.y + 40}
          width={46}
          height={edit.h - 40}
          fill={light ? "rgba(16,17,69,0.04)" : "rgba(255,255,255,0.04)"}
        />
        {LINES.map((line, i) => {
          const y = edit.y + 58 + i * 20;
          return (
            <g key={`ln-${line.w}-${line.indent}-${i}`}>
              <text
                x={edit.x + 32}
                y={y + 5}
                textAnchor="end"
                fill={muted}
                fontFamily="var(--font-dm-mono), monospace"
                fontSize={10}
              >
                {i + 1}
              </text>
              <Bar
                x={edit.x + 58 + line.indent}
                y={y}
                w={line.w}
                h={8}
                fill={codeFill[line.tone]}
              />
            </g>
          );
        })}
        <rect
          x={edit.x + 58 + 32 + 58 + 6}
          y={edit.y + 56 + 5 * 20}
          width={8}
          height={12}
          rx={1.5}
          fill={codeAccent}
          className={motion(animated, "blink")}
        />
      </g>

      <path
        d="M366 268 C 400 268, 402 196, 454 196"
        fill="none"
        stroke={p.lineStrong}
        strokeWidth={1.75}
        strokeLinecap="round"
        pathLength={1}
        className={motion(animated, "draw")}
      />
      <Sq x={358} y={258} size={16} fill={p.accent} stroke={p.bg} sw={2} />
      <g className={motion(animated, "pulse")}>
        <Sq x={396} y={220} size={16} fill={marker} stroke={NAVY} sw={1.5} />
      </g>
      <Sq x={446} y={188} size={16} fill={ink} stroke={p.bg} sw={2} />

      <rect
        x={phone.x + 8}
        y={phone.y + 12}
        width={phone.w}
        height={phone.h}
        rx={34}
        fill={INK}
        opacity={0.3}
      />
      <rect
        x={phone.x}
        y={phone.y}
        width={phone.w}
        height={phone.h}
        rx={34}
        fill={bezel}
      />
      <g clipPath={`url(#${id}-screen)`}>
        <rect
          x={phone.x + 12}
          y={phone.y + 14}
          width={phone.w - 24}
          height={phone.h - 28}
          fill={`url(#${id}-screen)`}
        />
        <Bar x={phone.x + 28} y={phone.y + 30} w={26} h={5} fill={muted} />
        <Sq x={phone.x + 148} y={phone.y + 28} size={7} fill={ink} rx={1.5} />
        <Sq x={phone.x + 160} y={phone.y + 28} size={7} fill={p.accent} rx={1.5} />

        <Sq x={phone.x + 28} y={phone.y + 52} size={28} fill={marker} stroke={NAVY} sw={1.25} />
        <Bar x={phone.x + 66} y={phone.y + 56} w={78} h={8} fill={ink} />
        <Bar x={phone.x + 66} y={phone.y + 70} w={48} h={5} fill={muted} />

        <rect
          x={phone.x + 26}
          y={phone.y + 96}
          width={146}
          height={108}
          rx={16}
          fill={light ? "#EEF2F6" : p.surface2}
        />
        {BARS.map((h, i) => (
          <rect
            key={`b-${h}`}
            x={phone.x + 40 + i * 24}
            y={phone.y + 184 - h}
            width={14}
            height={h}
            rx={4}
            fill={i === 3 ? p.accent : i === 1 ? marker : muted}
          />
        ))}

        {[0, 1, 2].map((i) => {
          const y = phone.y + 218 + i * 40;
          const on = i === 0;
          return (
            <g key={`row-${y}`}>
              <Sq
                x={phone.x + 28}
                y={y}
                size={26}
                fill={i === 2 ? p.accent : light ? WHITE : p.surface2}
                stroke={p.line}
                sw={1.25}
              />
              <Bar x={phone.x + 62} y={y + 4} w={62} h={6} fill={ink} />
              <Bar x={phone.x + 62} y={y + 15} w={40} h={5} fill={muted} />
              <rect
                x={phone.x + 132}
                y={y + 4}
                width={34}
                height={18}
                rx={9}
                fill={on ? marker : muted}
              />
              <circle
                cx={on ? phone.x + 156 : phone.x + 142}
                cy={y + 13}
                r={6}
                fill={on ? NAVY : WHITE}
              />
            </g>
          );
        })}

        <rect
          x={phone.x + 12}
          y={phone.y + 348}
          width={phone.w - 24}
          height={48}
          fill={light ? WHITE : p.surface2}
        />
        <Hair
          x1={phone.x + 12}
          y1={phone.y + 348}
          x2={phone.x + phone.w - 12}
          y2={phone.y + 348}
          stroke={p.line}
        />
        {[0, 1, 2, 3].map((i) => (
          <Sq
            key={`tab-${i}`}
            x={phone.x + 32 + i * 38}
            y={phone.y + 362}
            size={16}
            fill={i === 1 ? p.accent : "none"}
            stroke={i === 1 ? "none" : muted}
            sw={1.75}
            rx={4}
          />
        ))}
        <Bar x={phone.x + 78} y={phone.y + 386} w={42} h={4} fill={muted} />
      </g>
      <rect
        x={phone.x + 72}
        y={phone.y + 8}
        width={54}
        height={10}
        rx={5}
        fill={bezel}
      />

      <g className={motion(animated, "float")}>
        <rect x={568} y={104} width={128} height={40} rx={20} fill={marker} />
        <path
          d="M588 124 l8 8 l16 -18"
          fill="none"
          stroke={NAVY}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Bar x={626} y={120} w={50} h={7} fill={NAVY} opacity={0.85} />
      </g>
    </g>
  );
}
