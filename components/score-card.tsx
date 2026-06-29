"use client";

import { CountUp } from "@/components/motion";
import { ScoreBreakdown } from "@/components/score-breakdown";
import { CheckCircle2 } from "lucide-react";
import { Recommendation } from "@/lib/types";

export function ScoreCard({ recommendation }: { recommendation: Recommendation }) {
  const { weekendConfidenceScore, breakdown, reasons } = recommendation;
  return (
    <div className="hairline-card p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="section-label mb-2">Weekend Confidence</p>
          <h2 className="text-6xl font-semibold text-ink leading-none" style={{ letterSpacing: "-0.04em" }}>
            <CountUp value={weekendConfidenceScore} suffix="%" />
          </h2>
        </div>
        <span className="rounded-xs bg-surface-card border border-hairline px-3 py-1.5 text-xs font-semibold text-muted">Transparent</span>
      </div>
      <div className="mt-6">
        <ScoreBreakdown breakdown={breakdown} />
      </div>
      <div className="mt-5 content-card">
        <p className="text-sm font-semibold text-ink">Why this is recommended</p>
        <ul className="mt-3 space-y-2">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2.5 text-sm text-body">
              <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
