"use client";

import { getGradeColor, getGradeBgColor } from "@/lib/grading";

interface GradePillProps {
  grade: string;
  size?: "sm" | "md" | "lg";
}

export function GradePill({ grade, size = "md" }: GradePillProps) {
  const color = getGradeColor(grade);
  const bg = getGradeBgColor(grade);

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-0.5 text-sm",
    lg: "px-3 py-1 text-lg",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-semibold font-[family-name:var(--font-geist-mono)] ${sizeClasses[size]}`}
      style={{ color, backgroundColor: bg }}
    >
      {grade}
    </span>
  );
}
