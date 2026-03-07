import type { Location, Competitor } from "@/types";
import { type ServiceKey } from "@/types";

const SERVICE_KEYS: ServiceKey[] = [
  "serviceBoarding", "serviceDaycare", "serviceGrooming", "serviceTraining",
  "serviceVetCare", "serviceGroomingEd", "serviceWebcams", "serviceMobileGroom", "serviceRetail",
];

export interface MarketPosition {
  locationId: string;
  locationName: string;
  city: string;
  state: string;
  ourRating: number | null;
  ourReviews: number | null;
  avgCompRating: number | null;
  avgCompReviews: number | null;
  ratingDelta: number | null;
  ourLighthouseAvg: number | null;
  compLighthouseAvg: number | null;
  lighthouseGap: number | null;
  ourServiceCount: number;
  maxCompServiceCount: number;
  competitorCount: number;
  compositeScore: number;
  letterGrade: string;
}

function countServices(entity: Location | Competitor): number {
  return SERVICE_KEYS.filter((key) => entity[key]).length;
}

function avg(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function lighthouseAvg(entity: { lighthousePerf: number | null; lighthouseA11y: number | null; lighthouseSEO: number | null; lighthouseBP: number | null }): number | null {
  const scores = [entity.lighthousePerf, entity.lighthouseA11y, entity.lighthouseSEO, entity.lighthouseBP].filter((s): s is number => s !== null);
  return avg(scores);
}

export function computeMarketPosition(
  location: Location,
  competitors: Competitor[]
): MarketPosition {
  const compRatings = competitors.map((c) => c.googleRating).filter((r): r is number => r !== null);
  const compReviews = competitors.map((c) => c.googleReviewCount).filter((r): r is number => r !== null);
  const avgCompRating = avg(compRatings);
  const avgCompReviews = avg(compReviews);

  const ourLH = lighthouseAvg(location);
  const compLHScores = competitors.map((c) => lighthouseAvg(c)).filter((s): s is number => s !== null);
  const compLH = avg(compLHScores);

  const ourServiceCount = countServices(location);
  const maxCompServiceCount = competitors.length > 0
    ? Math.max(...competitors.map(countServices))
    : 0;

  // Composite scoring (0-100)
  let score = 0;

  // Google Rating (25 pts)
  if (location.googleRating !== null && avgCompRating !== null) {
    const ratingAdv = location.googleRating - avgCompRating;
    score += Math.min(25, Math.max(0, 12.5 + ratingAdv * 25));
  } else if (location.googleRating !== null) {
    score += (location.googleRating / 5) * 25;
  }

  // Review Volume (20 pts)
  if (location.googleReviewCount !== null && compReviews.length > 0) {
    const allReviews = [...compReviews, location.googleReviewCount].sort((a, b) => a - b);
    const rank = allReviews.indexOf(location.googleReviewCount);
    score += (rank / (allReviews.length - 1 || 1)) * 20;
  } else if (location.googleReviewCount !== null) {
    score += Math.min(20, (location.googleReviewCount / 200) * 20);
  }

  // Web Performance (25 pts)
  if (ourLH !== null && compLH !== null) {
    const lhAdv = ourLH - compLH;
    score += Math.min(25, Math.max(0, 12.5 + lhAdv * 0.5));
  } else if (ourLH !== null) {
    score += (ourLH / 100) * 25;
  }

  // SEO Health (15 pts) - based on existing SEO score from location data
  if (location.lighthouseSEO !== null) {
    if (compLHScores.length > 0) {
      const compSEO = avg(competitors.map((c) => c.lighthouseSEO).filter((s): s is number => s !== null));
      if (compSEO !== null) {
        const seoAdv = location.lighthouseSEO - compSEO;
        score += Math.min(15, Math.max(0, 7.5 + seoAdv * 0.3));
      } else {
        score += (location.lighthouseSEO / 100) * 15;
      }
    } else {
      score += (location.lighthouseSEO / 100) * 15;
    }
  }

  // Service Breadth (15 pts)
  if (maxCompServiceCount > 0) {
    const serviceRatio = ourServiceCount / Math.max(ourServiceCount, maxCompServiceCount);
    score += serviceRatio * 15;
  } else if (ourServiceCount > 0) {
    score += Math.min(15, (ourServiceCount / 9) * 15);
  }

  const compositeScore = Math.round(score);
  const letterGrade = getMarketGrade(compositeScore);

  return {
    locationId: location.id,
    locationName: location.name,
    city: location.city,
    state: location.state,
    ourRating: location.googleRating,
    ourReviews: location.googleReviewCount,
    avgCompRating: avgCompRating ? Math.round(avgCompRating * 10) / 10 : null,
    avgCompReviews: avgCompReviews ? Math.round(avgCompReviews) : null,
    ratingDelta: location.googleRating !== null && avgCompRating !== null
      ? Math.round((location.googleRating - avgCompRating) * 10) / 10
      : null,
    ourLighthouseAvg: ourLH ? Math.round(ourLH) : null,
    compLighthouseAvg: compLH ? Math.round(compLH) : null,
    lighthouseGap: ourLH !== null && compLH !== null ? Math.round(ourLH - compLH) : null,
    ourServiceCount,
    maxCompServiceCount,
    competitorCount: competitors.length,
    compositeScore,
    letterGrade,
  };
}

function getMarketGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
