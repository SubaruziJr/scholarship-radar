import { classNames } from "@/lib/format";

export function MatchRing({
  score,
  size = 56,
  stroke = 6,
  showLabel = true,
}: {
  score: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = c - (clamped / 100) * c;

  // color by tier
  const color =
    clamped >= 80 ? "#A6CF1F" : clamped >= 60 ? "#16794A" : clamped >= 40 ? "#3B6FE0" : "#8A9990";

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E7E2D6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      {showLabel && (
        <span
          className={classNames(
            "absolute font-display font-semibold leading-none",
            size >= 56 ? "text-lg" : "text-sm"
          )}
        >
          {clamped}
        </span>
      )}
    </div>
  );
}
