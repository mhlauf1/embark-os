import { cn } from "@/lib/utils";

interface LighthouseScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function LighthouseScore({
  score,
  size = "md",
  label,
}: LighthouseScoreProps) {
  const color = getScoreColor(score);
  const dimensions = { sm: 36, md: 56, lg: 80 };
  const dim = dimensions[size];
  const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 5;
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const fontSize = size === "sm" ? "11px" : size === "md" ? "16px" : "22px";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90" role="img" aria-label={`Lighthouse score: ${score} out of 100`}>
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <span
          className={cn("absolute inset-0 flex items-center justify-center font-semibold")}
          style={{ color, fontSize }}
        >
          {score}
        </span>
      </div>
      {label && (
        <span className="text-[11px] text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
