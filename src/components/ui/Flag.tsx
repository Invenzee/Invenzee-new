import type { ReactElement } from "react";

type FlagCode = "US" | "PK" | "PT" | "AE" | "DE" | "GB";

const names: Record<FlagCode, string> = {
  US: "United States",
  PK: "Pakistan",
  PT: "Portugal",
  AE: "United Arab Emirates",
  DE: "Germany",
  GB: "United Kingdom",
};

function UsFlag() {
  const stripe = 16 / 13;
  return (
    <>
      <rect width="24" height="16" fill="#fff" />
      {Array.from({ length: 7 }, (_, index) => (
        <rect
          key={index}
          y={index * stripe * 2}
          width="24"
          height={stripe}
          fill="#B22234"
        />
      ))}
      <rect width="10.4" height={stripe * 7} fill="#3C3B6E" />
      {Array.from({ length: 9 }, (_, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        return (
          <circle
            key={index}
            cx={1.7 + col * 3}
            cy={1.15 + row * 2.15}
            r="0.45"
            fill="#fff"
          />
        );
      })}
    </>
  );
}

function PkFlag() {
  return (
    <>
      <rect width="24" height="16" fill="#01411C" />
      <rect width="6" height="16" fill="#fff" />
      <circle cx="13.5" cy="8" r="3.15" fill="#fff" />
      <circle cx="14.55" cy="7.45" r="2.55" fill="#01411C" />
      <polygon
        points="17.7,6.15 18.15,7.55 19.65,7.55 18.45,8.4 18.9,9.85 17.7,8.95 16.5,9.85 16.95,8.4 15.75,7.55 17.25,7.55"
        fill="#fff"
      />
    </>
  );
}

function PtFlag() {
  return (
    <>
      <rect width="24" height="16" fill="#FF0000" />
      <rect width="9.6" height="16" fill="#006600" />
      <circle cx="9.6" cy="8" r="2.7" fill="#FFCC00" />
      <circle cx="9.6" cy="8" r="1.45" fill="#003399" />
    </>
  );
}

function AeFlag() {
  return (
    <>
      <rect width="24" height="16" fill="#00732F" />
      <rect y="5.33" width="24" height="5.34" fill="#fff" />
      <rect y="10.67" width="24" height="5.33" fill="#000" />
      <rect width="6" height="16" fill="#FF0000" />
    </>
  );
}

function DeFlag() {
  return (
    <>
      <rect width="24" height="5.33" fill="#000" />
      <rect y="5.33" width="24" height="5.34" fill="#DD0000" />
      <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
    </>
  );
}

function GbFlag() {
  return (
    <>
      <rect width="24" height="16" fill="#012169" />
      <polygon points="0,0 4,0 24,13.4 24,16 20,16 0,2.6" fill="#fff" />
      <polygon points="24,0 20,0 0,13.4 0,16 4,16 24,2.6" fill="#fff" />
      <polygon points="0,0 2.1,0 24,14.6 24,16 21.9,16 0,1.4" fill="#C8102E" />
      <polygon points="24,0 21.9,0 0,14.6 0,16 2.1,16 24,1.4" fill="#C8102E" />
      <rect x="9.6" width="4.8" height="16" fill="#fff" />
      <rect y="5.6" width="24" height="4.8" fill="#fff" />
      <rect x="10.8" width="2.4" height="16" fill="#C8102E" />
      <rect y="6.8" width="24" height="2.4" fill="#C8102E" />
    </>
  );
}

const shapes: Record<FlagCode, () => ReactElement> = {
  US: UsFlag,
  PK: PkFlag,
  PT: PtFlag,
  AE: AeFlag,
  DE: DeFlag,
  GB: GbFlag,
};

/** Small country flag. Used in place of USA / PK and the city names. */
export function Flag({ code }: { code: FlagCode }) {
  const Shape = shapes[code];
  return (
    <svg
      viewBox="0 0 24 16"
      width="22"
      height="15"
      role="img"
      aria-label={names[code]}
      className="inline-block shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgb(255_255_255/0.28)]"
    >
      <Shape />
    </svg>
  );
}
