"use client";

import { AnimatedBar } from "@/components/motion";
import { RecommendationBreakdown } from "@/lib/types";

// Single source of truth for the 6 transparent score dimensions, shared by
// ScoreCard and BestMatchHero so the labels/order can never drift apart.
export function ScoreBreakdown({ breakdown }: { breakdown: RecommendationBreakdown }) {
  const rows = [
    { label: "Budget fit", value: breakdown.budgetFit },
    { label: "Travel & timing", value: breakdown.travelFit },
    { label: "Weather fit", value: breakdown.weatherFit },
    { label: "Difficulty fit", value: breakdown.difficultyFit },
    { label: "Vibe fit", value: breakdown.vibeFit },
    { label: "Availability", value: breakdown.availabilityFit },
  ];

  return (
    <div className="space-y-4">
      {rows.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-body font-medium">{item.label}</span>
            <span className="text-ink font-semibold">{item.value}/20</span>
          </div>
          <AnimatedBar value={item.value} max={20} />
        </div>
      ))}
    </div>
  );
}
