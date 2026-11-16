type FlagCode = "US" | "PK";

const names: Record<FlagCode, string> = {
  US: "United States",
  PK: "Pakistan",
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

/** Small country flag. Used in place of USA / PK and the city names. */
export function Flag({ code }: { code: FlagCode }) {
  return (
    <svg
      viewBox="0 0 24 16"
      width="22"
      height="15"
      role="img"
      aria-label={names[code]}
      className="inline-block shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgb(255_255_255/0.28)]"
    >
      {code === "US" ? <UsFlag /> : <PkFlag />}
    </svg>
  );
}
