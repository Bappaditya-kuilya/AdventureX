import { listAdventuresWithDates } from "@/lib/repository";
import { AdventureDate, Recommendation, RecommendationBreakdown, RecommendationInput, WeatherRisk } from "@/lib/types";

const difficultyScoreMap = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function weatherRiskPoints(risk: WeatherRisk) {
  if (risk === "Low") return 20;
  if (risk === "Moderate") return 14;
  return 8;
}

function budgetPoints(price: number, budget: number) {
  if (price <= budget) {
    return clamp(16 + Math.round((budget - price) / 300), 16, 20);
  }

  return 0;
}

function vibeDifficulty(vibe: RecommendationInput["vibe"]) {
  if (vibe === "adrenaline") return "Advanced";
  if (vibe === "nature") return "Intermediate";
  return "Beginner";
}

function difficultyPoints(vibe: RecommendationInput["vibe"], actualDifficulty: "Beginner" | "Intermediate" | "Advanced") {
  const targetDifficulty = vibeDifficulty(vibe);
  const gap = Math.abs(difficultyScoreMap[targetDifficulty] - difficultyScoreMap[actualDifficulty]);
  if (gap === 0) return 20;
  if (gap === 1) return 14;
  return 6;
}

function availabilityPoints(date: AdventureDate | null) {
  if (!date) return 0;
  const ratio = date.slotsLeft / date.slotsTotal;
  if (ratio >= 0.5) return 20;
  if (ratio >= 0.25) return 16;
  if (ratio > 0) return 10;
  return 0;
}

function travelPoints(origin: string, travelHoursFromOrigin: Record<string, number>) {
  const travelHours = travelHoursFromOrigin[origin] ?? 6;
  return clamp(22 - Math.round(travelHours * 2), 6, 20);
}

function durationPoints(duration: RecommendationInput["duration"], durationHours: number, travelHours: number) {
  if (duration === "weekend") {
    const base = durationHours <= 30 ? 20 : durationHours <= 48 ? 16 : 8;
    return clamp(base + (travelHours <= 3 ? 2 : 0), 6, 20);
  }

  if (duration === "long-weekend") {
    if (durationHours >= 30 && durationHours <= 54) return 20;
    if (durationHours <= 60) return 14;
    return 8;
  }

  if (durationHours >= 48) return 20;
  if (durationHours >= 30) return 14;
  return 8;
}

// Vibe scores the CATEGORY only. Difficulty is handled by difficultyFit, so we
// deliberately don't re-read difficulty here — that would double-count vibe.
function vibePoints(vibe: RecommendationInput["vibe"], category: string) {
  if (vibe === "adrenaline") {
    if (["Water Sports", "Forts"].includes(category)) return 20;
    if (["Trekking"].includes(category)) return 16;
    return 10;
  }

  if (vibe === "nature") {
    if (["Trekking", "Waterfalls", "Camping"].includes(category)) return 20;
    return 12;
  }

  if (["Camping", "Glamping", "Waterfalls"].includes(category)) return 20;
  return 12;
}

function buildReasons(
  input: RecommendationInput,
  breakdown: RecommendationBreakdown,
  adventure: { category: string; difficulty: string; durationHours: number },
  price: number,
  budget: number,
  travelHours: number,
  date: AdventureDate | null
) {
  const reasons: string[] = [];

  if (breakdown.budgetFit >= 16) reasons.push(`Stays within your ₹${budget.toLocaleString("en-IN")} budget`);
  if (breakdown.difficultyFit >= 16) reasons.push(`Matches a ${input.vibe} weekend better than a generic listing would`);
  if (breakdown.travelFit >= 16) reasons.push(`Travel time is manageable at about ${travelHours} hours`);
  if (breakdown.weatherFit >= 16) reasons.push("Current conditions look strong for the next departure");
  if (breakdown.vibeFit >= 16) reasons.push(`The vibe lines up with a ${input.vibe} trip`);
  if (breakdown.availabilityFit >= 16 && date) reasons.push(`${date.slotsLeft} seats are still open on the next date`);
  if (adventure.durationHours <= 30 && input.duration === "weekend") reasons.push("Fits cleanly into a normal weekend without over-committing");

  return reasons.slice(0, 5);
}

export async function getRecommendations(input: RecommendationInput): Promise<Recommendation[]> {
  const adventures = await listAdventuresWithDates();

  return adventures
    .map((adventure) => {
      const bestDate = adventure.nextAvailableDate;
      const price = bestDate?.dynamicPrice ?? adventure.basePrice;
      const origin = input.origin ?? adventure.originHints[0] ?? "Pune";
      const travelHours = adventure.travelHoursFromOrigin[origin] ?? 6;
      // travelFit blends real travel time (from the chosen origin) with how well
      // the trip length matches the requested duration — both are "will this fit
      // my logistics" signals. travelPoints is now actually used (was dead code).
      const travelFit = Math.round(
        (travelPoints(origin, adventure.travelHoursFromOrigin) +
          durationPoints(input.duration, adventure.durationHours, travelHours)) /
          2
      );
      const breakdown = {
        budgetFit: budgetPoints(price, input.budget),
        travelFit,
        weatherFit: weatherRiskPoints(bestDate?.weatherRisk ?? "High"),
        difficultyFit: difficultyPoints(input.vibe, adventure.difficulty),
        availabilityFit: availabilityPoints(bestDate),
        vibeFit: vibePoints(input.vibe, adventure.category)
      };
      const score =
        breakdown.budgetFit +
        breakdown.travelFit +
        breakdown.weatherFit +
        breakdown.difficultyFit +
        breakdown.availabilityFit +
        breakdown.vibeFit;

      return {
        adventure,
        score,
        // 6 dimensions × 20 = 120 max, normalised to an honest 0–100% confidence
        weekendConfidenceScore: Math.round((score / 120) * 100),
        breakdown,
        reasons: buildReasons(input, breakdown, adventure, price, input.budget, travelHours, bestDate),
        travelHours
      };
    })
    .sort((a, b) => b.score - a.score);
}

export async function getRecommendationForAdventure(adventureId: string, input: RecommendationInput) {
  const recommendations = await getRecommendations(input);
  return recommendations.find((item) => item.adventure.id === adventureId) ?? null;
}
