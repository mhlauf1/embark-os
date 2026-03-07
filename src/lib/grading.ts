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
  if (grade.startsWith("A")) return "#4A9A6E";
  if (grade.startsWith("B")) return "#2D7A6B";
  if (grade.startsWith("C")) return "#CB8A40";
  return "#C45C4A";
}

export function getGradeBgColor(grade: string): string {
  if (grade.startsWith("A")) return "rgba(74,154,110,0.1)";
  if (grade.startsWith("B")) return "rgba(45,122,107,0.1)";
  if (grade.startsWith("C")) return "rgba(203,138,64,0.1)";
  return "rgba(196,92,74,0.1)";
}
