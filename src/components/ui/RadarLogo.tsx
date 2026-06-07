export function RadarLogo({
  size = 28,
  animated = false,
}: {
  size?: number;
  animated?: boolean;
}) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none">
        <circle cx="16" cy="16" r="15" stroke="#16794A" strokeWidth="1.5" opacity="0.35" />
        <circle cx="16" cy="16" r="10" stroke="#16794A" strokeWidth="1.5" opacity="0.5" />
        <circle cx="16" cy="16" r="5" stroke="#16794A" strokeWidth="1.5" opacity="0.7" />
        <circle cx="16" cy="16" r="2" fill="#16794A" />
        {/* the "blip" */}
        <circle cx="23" cy="11" r="2.2" fill="#C6F135" stroke="#16794A" strokeWidth="0.8" />
      </svg>
      {animated && (
        <span
          className="absolute inset-0 animate-sweep"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(22,121,74,0.25), transparent 70deg)",
            borderRadius: "9999px",
            maskImage: "radial-gradient(circle, black 60%, transparent 62%)",
            WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 62%)",
          }}
        />
      )}
    </span>
  );
}
