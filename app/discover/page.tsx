import Link from "next/link";
import { AdventureCard } from "@/components/adventure-card";
import { Navbar } from "@/components/navbar";
import { listAdventuresWithDates } from "@/lib/repository";
import { SlideUp, StaggerList, StaggerItem, FadeIn } from "@/components/motion";

export const dynamic = "force-dynamic";

const categories = ["All", "Trekking", "Camping", "Waterfalls", "Forts", "Glamping", "Water Sports"] as const;
const budgets = [
  { label: "All budgets", value: "" },
  { label: "Up to ₹2k", value: "2000" },
  { label: "Up to ₹3k", value: "3000" },
  { label: "Up to ₹5k", value: "5000" }
] as const;
const durations = [
  { label: "Any duration", value: "" },
  { label: "Weekend", value: "24" },
  { label: "Long weekend", value: "48" },
  { label: "Extended", value: "72" }
] as const;
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export default async function DiscoverPage({
  searchParams
}: {
  searchParams?: Promise<{ category?: string; maxPrice?: string; duration?: string; difficulty?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const allAdventures = await listAdventuresWithDates();
  const filtered = allAdventures.filter((adventure) => {
    if (params.category && params.category !== "All" && adventure.category !== params.category) return false;
    if (params.difficulty && params.difficulty !== "All" && adventure.difficulty !== params.difficulty) return false;
    if (params.maxPrice) {
      const limit = Number(params.maxPrice);
      const price = adventure.nextAvailableDate?.dynamicPrice ?? adventure.basePrice;
      if (price > limit) return false;
    }
    if (params.duration) {
      const target = Number(params.duration);
      if (target === 24 && adventure.durationHours > 30) return false;
      if (target === 48 && (adventure.durationHours < 24 || adventure.durationHours > 54)) return false;
      if (target === 72 && adventure.durationHours < 48) return false;
    }
    return true;
  });

  function hrefFor(next: Record<string, string | undefined>) {
    const search = new URLSearchParams();
    Object.entries({ ...params, ...next }).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    const query = search.toString();
    return query ? `/discover?${query}` : "/discover";
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-canvas">
        {/* Page Header */}
        <div className="pt-16 pb-8 bg-canvas border-b border-hairline">
          <div className="shell">
            <p className="section-label animate-fade-up">Discover</p>
            <SlideUp>
              <h1 className="display-lg animate-fade-up delay-1 mt-3 max-w-3xl text-balance">
                Adventures across Maharashtra, filtered to fit your weekend.
              </h1>
            </SlideUp>
            <SlideUp delay={0.08}>
              <p className="text-body text-lg mt-4 max-w-2xl animate-fade-up delay-2">
                Filter by type, budget, and difficulty. Or use the Planner for a curated shortlist.
              </p>
            </SlideUp>
          </div>
        </div>

        {/* Filter Bar */}
        <FadeIn delay={0.12}>
        <div className="py-5 bg-surface-soft border-b border-hairline sticky top-16 z-40">
          <div className="shell">
            <div className="flex flex-wrap gap-2 items-center">
              {/* Categories */}
              {categories.map((item) => {
                const active = (params.category ?? "All") === item;
                return (
                  <Link
                    key={item}
                    href={hrefFor({ category: item === "All" ? undefined : item })}
                    className={
                      active
                        ? "rounded-pill bg-ink text-white px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
                        : "rounded-pill border border-hairline bg-canvas text-muted px-4 py-2 text-sm font-medium whitespace-nowrap hover:border-ink hover:text-ink transition-colors"
                    }
                  >
                    {item}
                  </Link>
                );
              })}

              <div className="h-5 w-px bg-hairline mx-1" />

              {/* Budget */}
              {budgets.map((budget) => {
                const active = (params.maxPrice ?? "") === budget.value;
                return (
                  <Link
                    key={budget.label}
                    href={hrefFor({ maxPrice: budget.value || undefined })}
                    className={
                      active
                        ? "rounded-pill bg-ink text-white px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
                        : "rounded-pill border border-hairline bg-canvas text-muted px-4 py-2 text-sm font-medium whitespace-nowrap hover:border-ink hover:text-ink transition-colors"
                    }
                  >
                    {budget.label}
                  </Link>
                );
              })}

              <div className="h-5 w-px bg-hairline mx-1" />

              {/* Duration */}
              {durations.map((duration) => {
                const active = (params.duration ?? "") === duration.value;
                return (
                  <Link
                    key={duration.label}
                    href={hrefFor({ duration: duration.value || undefined })}
                    className={
                      active
                        ? "rounded-pill bg-ink text-white px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
                        : "rounded-pill border border-hairline bg-canvas text-muted px-4 py-2 text-sm font-medium whitespace-nowrap hover:border-ink hover:text-ink transition-colors"
                    }
                  >
                    {duration.label}
                  </Link>
                );
              })}

              <div className="h-5 w-px bg-hairline mx-1" />

              {/* Difficulty */}
              {difficulties.map((difficulty) => {
                const active = (params.difficulty ?? "All") === difficulty;
                return (
                  <Link
                    key={difficulty}
                    href={hrefFor({ difficulty: difficulty === "All" ? undefined : difficulty })}
                    className={
                      active
                        ? "rounded-pill bg-ink text-white px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
                        : "rounded-pill border border-hairline bg-canvas text-muted px-4 py-2 text-sm font-medium whitespace-nowrap hover:border-ink hover:text-ink transition-colors"
                    }
                  >
                    {difficulty}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        </FadeIn>

        {/* Results Area */}
        <div className="py-10 bg-canvas flex-1">
          <div className="shell">
            <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-muted">{filtered.length} trips found</p>
                <h2 className="text-xl font-semibold text-ink mt-0.5">Browse and compare</h2>
              </div>
              <Link href="/plan" className="text-sm font-medium text-muted hover:text-ink transition-colors">
                Want a shortlist instead? →
              </Link>
            </div>
            </FadeIn>

            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-4xl mb-4">🗺</p>
                <h2 className="text-xl font-semibold text-ink">No trips match these filters.</h2>
                <p className="text-muted mt-2">Try adjusting your filters or browse all trips.</p>
                <Link href="/discover" className="btn-primary mt-6 inline-flex">
                  Clear filters
                </Link>
              </div>
            ) : (
              <StaggerList className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((adventure) => (
                  <StaggerItem key={adventure.id}>
                    <AdventureCard
                      recommendation={{
                        adventure,
                        score: 0,
                        weekendConfidenceScore: 0,
                        breakdown: {
                          budgetFit: 0,
                          travelFit: 0,
                          weatherFit: 0,
                          difficultyFit: 0,
                          availabilityFit: 0,
                          vibeFit: 0
                        },
                        reasons: [],
                        travelHours: adventure.travelHoursFromOrigin[adventure.originHints[0] ?? "Pune"] ?? 0
                      }}
                    />
                  </StaggerItem>
                ))}
              </StaggerList>
            )}
          </div>
        </div>

        <div className="pb-section" />
      </main>
    </>
  );
}
