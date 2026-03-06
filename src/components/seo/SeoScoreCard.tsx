"use client";

import { getGradeColor, getGradeBgColor } from "@/lib/grading";

interface SeoScoreCardProps {
  score: number;
  grade: string;
  label?: string;
}

export function SeoScoreCard({ score, grade, label }: SeoScoreCardProps) {
  const color = getGradeColor(grade);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted/30"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-[family-name:var(--font-geist-mono)] text-xl font-bold"
            style={{ color }}
          >
            {score}
          </span>
        </div>
      </div>
      <span
        className="inline-flex items-center rounded-md px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-sm font-semibold"
        style={{ color, backgroundColor: getGradeBgColor(grade) }}
      >
        {grade}
      </span>
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
