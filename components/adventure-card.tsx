import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Recommendation } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-[#a4d4c5] text-[#0a1a1a]",
  Intermediate: "bg-[#e8b94a] text-[#0a0a0a]",
  Advanced: "bg-[#ff6b5a] text-white",
};

export function AdventureCard({ recommendation }: { recommendation: Recommendation }) {
  const { adventure, weekendConfidenceScore, travelHours } = recommendation;
  const date = adventure.nextAvailableDate;
  const price = date?.dynamicPrice ?? adventure.basePrice;
  const rating = adventure.rating ?? 4.5;
  const reviews = adventure.reviewsCount;

  return (
    <Link href={"/adventure/" + adventure.id} className="group block hairline-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Image area with gallery hover strip */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={adventure.heroImage} alt={adventure.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category badge top-left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block rounded-pill bg-canvas/90 backdrop-blur px-3 py-1 text-xs font-semibold text-ink">
            {adventure.category}
          </span>
        </div>

        {/* Rating badge top-right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-pill bg-canvas/90 backdrop-blur px-3 py-1 text-xs font-semibold text-ink">
            <Star className="h-3 w-3 fill-[#e8b94a] text-[#e8b94a]" />
            {rating.toFixed(1)}
            {reviews ? <span className="font-normal text-muted">({reviews})</span> : null}
          </span>
        </div>

        {/* Gallery strip — slides up on hover */}
        {adventure.gallery && adventure.gallery.length >= 2 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full opacity-0 transition-all duration-350 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex gap-0.5 bg-black/20 backdrop-blur-sm p-1.5">
              {adventure.gallery.slice(0, 3).map((img, i) => (
                <div key={i} className="relative flex-1 aspect-[16/9] overflow-hidden rounded-sm">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-ink leading-snug">{adventure.title}</h3>
          {weekendConfidenceScore > 0 && (
            <span className="shrink-0 text-xs font-semibold text-muted">{weekendConfidenceScore}%</span>
          )}
        </div>
        <p className="text-sm text-muted mt-0.5">{adventure.location}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className={"inline-block rounded-xs px-2 py-0.5 text-xs font-semibold " + (difficultyColors[adventure.difficulty] ?? "bg-surface-card text-body")}>
            {adventure.difficulty}
          </span>
          {travelHours > 0 && (
            <span className="inline-block rounded-xs bg-surface-card px-2 py-0.5 text-xs font-semibold text-body">
              {travelHours}h away
            </span>
          )}
          {date && (
            <span className="inline-block rounded-xs bg-surface-card px-2 py-0.5 text-xs font-semibold text-body">
              {date.slotsLeft} seats
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-hairline">
          <p className="text-lg font-semibold text-ink">{formatCurrency(price)}<span className="text-sm font-normal text-muted ml-1">/person</span></p>
          <span className="text-sm font-medium text-muted group-hover:text-ink transition-colors">View →</span>
        </div>
      </div>
    </Link>
  );
}
