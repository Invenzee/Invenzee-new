/**
 * One filled mark per service. Colour comes from the service marker.
 * marketing megaphone, design pen, web browser, software brackets,
 * video play, illustration pencil.
 */
export function ServiceIcon({
  id,
  color,
  size = 14,
  className = "",
}: {
  id: string;
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      data-icon={id}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      className={`block shrink-0 ${className}`}
      style={{ color }}
    >
      <Glyph id={id} />
    </svg>
  );
}

function Glyph({ id }: { id: string }) {
  switch (id) {
    case "marketing":
      return (
        <>
          <path
            fill="currentColor"
            d="M2.4 5.4h3.1L12 2.2v11.6L5.5 10.6H2.4A1.4 1.4 0 0 1 1 9.2V6.8a1.4 1.4 0 0 1 1.4-1.4z"
          />
          <path fill="currentColor" d="M3.6 11.2 4.5 14.4h2.1l-.9-3.2z" />
          <path
            fill="currentColor"
            d="M13.2 5.5c1.25.7 2 1.6 2 2.5s-.75 1.8-2 2.5c-.34.2-.75-.05-.75-.45V5.95c0-.4.41-.65.75-.45z"
          />
        </>
      );
    case "design":
      return (
        <>
          <path fill="currentColor" d="M10.4 1.1 14.9 5.6 6.2 14.3 1.7 9.8 10.4 1.1z" />
          <path fill="currentColor" d="M1.3 10.6.5 15.5l4.9-.8-4.1-4.1z" />
        </>
      );
    case "web":
      return (
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M1.6 2.2h12.8A1.4 1.4 0 0 1 15.8 3.6v9.2a1.4 1.4 0 0 1-1.4 1.4H1.6A1.4 1.4 0 0 1 .2 12.8V3.6A1.4 1.4 0 0 1 1.6 2.2zm.5 3h12v7.4H2.1V5.2z"
        />
      );
    case "software":
      return (
        <>
          <path fill="currentColor" d="M6.2 2.2 1.4 8l4.8 5.8 1.7-1.5L4.4 8l3.5-4.3z" />
          <path fill="currentColor" d="M9.8 2.2 14.6 8l-4.8 5.8-1.7-1.5L11.6 8 8.1 3.7z" />
        </>
      );
    case "video":
      return (
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M3.2 1.4h9.6A2.4 2.4 0 0 1 15.2 3.8v8.4a2.4 2.4 0 0 1-2.4 2.4H3.2a2.4 2.4 0 0 1-2.4-2.4V3.8A2.4 2.4 0 0 1 3.2 1.4zm2.5 3.1 5.6 3.5-5.6 3.5V4.5z"
        />
      );
    case "illustration":
      return (
        <>
          <path fill="currentColor" d="M3.6 9.6 9.6 3.6l2.8 2.8-6 6z" />
          <path fill="currentColor" d="M2.7 10.5.8 15.2l4.7-1.9z" />
          <path fill="currentColor" d="M10.8 2.6 13.4 0 16 2.6 13.4 5.2z" />
        </>
      );
    default:
      return <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />;
  }
}
