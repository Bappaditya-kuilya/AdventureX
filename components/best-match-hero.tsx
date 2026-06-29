"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CountUp } from "@/components/motion";
import { ScoreBreakdown } from "@/components/score-breakdown";
import { Recommendation } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export function BestMatchHero({ recommendation }: { recommendation: Recommendation }) {
  const { adventure, weekendConfidenceScore, reasons, travelHours, breakdown } = recommendation;
  const nextDate = adventure.nextAvailableDate;
  const price = nextDate?.dynamicPrice ?? adventure.basePrice;

  return (
    <section className="hairline-card overflow-hidden shadow-subtle">
      {/* Hero image */}
      <div className="relative h-[400px] md:h-[440px]">
        <Image src={adventure.heroImage} alt={adventure.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Badge */}
        <div className="absolute top-5 left-5">
          <span className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-sm font-semibold text-ink shadow-subtle">
            <span className="h-2 w-2 rounded-full bg-[#22c55e] inline-block" />
            #1 Best Match
          </span>
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <p className="section-label text-white/50 mb-2">{adventure.category} · {adventure.location}</p>
          <h2 className="display-sm text-white max-w-2xl" style={{ color: "white" }}>{adventure.title}</h2>
          <p className="text-white/70 mt-2 text-sm leading-relaxed max-w-xl">{adventure.shortDescription}</p>
        </div>
      </div>

      {/* Score + details */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline">

        {/* Score panel */}
        <div className="p-8">
          <p className="section-label mb-3">Weekend Confidence Score</p>
          <div className="flex items-end gap-2">
            <span className="text-8xl font-semibold text-ink leading-none" style={{ letterSpacing: "-0.04em" }}>
              <CountUp value={weekendConfidenceScore} />
            </span>
            <span className="text-3xl text-muted pb-2 font-medium">%</span>
          </div>

          <div className="mt-7">
            <ScoreBreakdown breakdown={breakdown} />
          </div>
        </div>

        {/* Details + CTA panel */}
        <div className="p-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Price", value: formatCurrency(price) },
              { label: "Travel time", value: travelHours + " hrs" },
              { label: "Difficulty", value: adventure.difficulty },
              { label: "Next date", value: nextDate ? formatDate(nextDate.date) : "On request" },
            ].map((s) => (
              <div key={s.label} className="content-card">
                <p className="section-label">{s.label}</p>
                <p className="text-lg font-semibold text-ink mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="content-card flex-1">
            <p className="text-sm font-semibold text-ink">Why this wins</p>
            <ul className="mt-3 space-y-2.5">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-2.5 text-sm text-body">
                  <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href={"/checkout?adventure_id=" + adventure.id} className="btn-primary justify-center h-11">
              Book Now
            </Link>
            <Link href={"/adventure/" + adventure.id} className="btn-secondary justify-center h-11 gap-1.5">
              Details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
