import { Sq, motion } from "./primitives";
import {
  CORAL,
  CYAN,
  LIME,
  NAVY,
  PINK,
  WHITE,
  isLight,
  type VariantProps,
} from "./theme";

function Spark({
  x,
  y,
  s,
  fill,
}: {
  x: number;
  y: number;
  s: number;
  fill: string;
}) {
  const c = s * 0.26;
  return (
    <path
      d={`M${x} ${y - s} L${x + c} ${y - c} L${x + s} ${y} L${x + c} ${y + c} L${x} ${y + s} L${x - c} ${y + c} L${x - s} ${y} L${x - c} ${y - c} Z`}
      fill={fill}
      stroke={NAVY}
      strokeWidth={1.25}
      strokeLinejoin="round"
    />
  );
}

const SPARKS = [
  { x: 112, y: 168, s: 12, fill: CORAL },
  { x: 286, y: 118, s: 9, fill: LIME },
  { x: 430, y: 96, s: 14, fill: PINK },
  { x: 708, y: 250, s: 11, fill: CORAL },
  { x: 96, y: 300, s: 8, fill: LIME },
  { x: 668, y: 470, s: 13, fill: PINK },
  { x: 250, y: 530, s: 8, fill: CORAL },
  { x: 470, y: 500, s: 10, fill: LIME },
];

const DOTS = [
  { x: 348, y: 156, size: 14, fill: PINK },
  { x: 540, y: 188, size: 12, fill: CYAN },
  { x: 164, y: 250, size: 16, fill: CORAL },
  { x: 700, y: 360, size: 14, fill: LIME },
  { x: 390, y: 470, size: 11, fill: CYAN },
  { x: 80, y: 430, size: 12, fill: PINK },
  { x: 610, y: 430, size: 10, fill: CORAL },
];

export function IllustrationArt({ p, animated, marker, tone }: VariantProps) {
  const light = isLight(tone);
  const pen = light ? NAVY : WHITE;
  const hill = tone === "cyan" || tone === "paper" ? WHITE : p.surface;
  const blobA = light ? NAVY : p.surface2;
  const sun = tone === "cyan" ? WHITE : CYAN;
  const leafInk = NAVY;

  return (
    <g>
      <circle cx={648} cy={118} r={78} fill={sun} />
      <path
        d="M500 196 A 150 150 0 0 1 700 64"
        fill="none"
        stroke={CORAL}
        strokeWidth={14}
        strokeLinecap="round"
      />
      <path
        d="M548 168 A 86 86 0 0 1 690 108"
        fill="none"
        stroke={marker}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.9}
      />

      <g className={motion(animated, "driftA")}>
        <path
          d="M-90 330 C 20 236, 110 248, 186 324 C 268 406, 246 520, 128 568 C 8 618, -78 508, -90 410 Z"
          fill={blobA}
        />
      </g>
      <g className={motion(animated, "driftB")}>
        <path
          d="M312 214 C 438 146, 572 196, 586 318 C 600 444, 476 498, 360 436 C 246 374, 214 272, 312 214 Z"
          fill={marker}
          stroke={NAVY}
          strokeWidth={2.5}
        />
        <path
          d="M468 368 C 534 336, 592 384, 566 444 C 540 504, 456 486, 442 428 C 432 384, 424 392, 468 368 Z"
          fill={CORAL}
          stroke={NAVY}
          strokeWidth={2}
        />
      </g>

      <path
        d="M-140 492 C 70 446, 180 534, 320 490 C 460 446, 560 528, 720 468 C 820 434, 900 498, 980 458 L 980 740 L -140 740 Z"
        fill={hill}
      />
      <path
        d="M-80 478 C 90 444, 200 512, 340 474 C 490 434, 600 508, 760 456"
        fill="none"
        stroke={light ? NAVY : p.fg}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.45}
      />

      <path
        d="M196 508 C 192 450, 188 400, 192 352"
        fill="none"
        stroke={pen}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <ellipse
        cx={168}
        cy={372}
        rx={36}
        ry={14}
        fill={LIME}
        stroke={leafInk}
        strokeWidth={1.75}
        transform="rotate(-48 168 372)"
      />
      <ellipse
        cx={214}
        cy={360}
        rx={34}
        ry={13}
        fill={LIME}
        stroke={leafInk}
        strokeWidth={1.75}
        transform="rotate(36 214 360)"
      />
      <ellipse
        cx={186}
        cy={348}
        rx={28}
        ry={12}
        fill={CORAL}
        stroke={leafInk}
        strokeWidth={1.75}
        transform="rotate(-8 186 348)"
      />
      <ellipse
        cx={176}
        cy={398}
        rx={24}
        ry={10}
        fill={marker}
        stroke={leafInk}
        strokeWidth={1.75}
        transform="rotate(58 176 398)"
      />
      <circle cx={192} cy={344} r={6} fill={sun} stroke={leafInk} strokeWidth={1.5} />

      <g className={motion(animated, "pulse")}>
        {SPARKS.map((spark) => (
          <Spark key={`${spark.x}-${spark.y}`} x={spark.x} y={spark.y} s={spark.s} fill={spark.fill} />
        ))}
      </g>
      {DOTS.map((dot) => (
        <Sq
          key={`${dot.x}-${dot.y}`}
          x={dot.x}
          y={dot.y}
          size={dot.size}
          fill={dot.fill}
          stroke={NAVY}
          sw={1.25}
        />
      ))}
      <circle cx={524} cy={430} r={8} fill={LIME} stroke={NAVY} strokeWidth={1.5} />
      <circle cx={140} cy={470} r={6} fill={CORAL} stroke={NAVY} strokeWidth={1.25} />
      <circle cx={600} cy={500} r={5} fill={marker} stroke={NAVY} strokeWidth={1.25} />

      <g>
        <line
          x1={300}
          y1={348}
          x2={378}
          y2={246}
          stroke={pen}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={508}
          y1={322}
          x2={452}
          y2={250}
          stroke={pen}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={508}
          y1={322}
          x2={564}
          y2={394}
          stroke={pen}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={612}
          y1={246}
          x2={548}
          y2={292}
          stroke={pen}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <path
          d="M300 348 C 378 246, 452 250, 508 322 C 564 394, 548 292, 612 246"
          fill="none"
          stroke={pen}
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          className={motion(animated, "draw")}
        />
        {[
          [378, 246],
          [452, 250],
          [564, 394],
          [548, 292],
        ].map(([x, y]) => (
          <circle key={`h-${x}-${y}`} cx={x} cy={y} r={5} fill={pen} />
        ))}
        {[
          [300, 348],
          [508, 322],
          [612, 246],
        ].map(([x, y]) => (
          <rect
            key={`a-${x}-${y}`}
            x={x - 6}
            y={y - 6}
            width={12}
            height={12}
            rx={2.5}
            fill={WHITE}
            stroke={NAVY}
            strokeWidth={1.75}
          />
        ))}
        <g transform="translate(612 246) rotate(-36)">
          <path d="M0 0 L-22 -7 L-22 7 Z" fill={pen} />
          <circle cx={-9} cy={0} r={2.6} fill={PINK} />
        </g>
      </g>
      <circle cx={40} cy={80} r={10} fill={p.fg} opacity={0.35} />
    </g>
  );
}
