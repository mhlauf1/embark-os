export function computeOverallScore(
  perf: number,
  a11y: number,
  seo: number,
  bp: number
): number {
  return perf * 0.3 + a11y * 0.25 + seo * 0.25 + bp * 0.2;
}

export function getLetterGrade(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "#22c55e";
  if (grade.startsWith("B")) return "#3b82f6";
  if (grade.startsWith("C")) return "#f59e0b";
  return "#ef4444";
}

export function getGradeBgColor(grade: string): string {
  if (grade.startsWith("A")) return "rgba(34,197,94,0.1)";
  if (grade.startsWith("B")) return "rgba(59,130,246,0.1)";
  if (grade.startsWith("C")) return "rgba(245,158,11,0.1)";
  return "rgba(239,68,68,0.1)";
}
