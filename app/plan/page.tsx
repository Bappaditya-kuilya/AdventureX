import { AdventureCard } from "@/components/adventure-card";
import { BestMatchHero } from "@/components/best-match-hero";
import { Navbar } from "@/components/navbar";
import { PlanForm } from "@/components/plan-form";
import { getRecommendations } from "@/lib/recommendations";
import { recommendationSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function PlanPage({
  searchParams
}: {
  searchParams?: Promise<{ duration?: string; budget?: string; vibe?: string; origin?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const parsed = recommendationSchema.safeParse({
    duration: resolvedSearchParams.duration ?? "weekend",
    budget: resolvedSearchParams.budget ?? 5000,
    vibe: resolvedSearchParams.vibe ?? "nature",
    origin: resolvedSearchParams.origin ?? "Pune"
  });

  const input = parsed.success
    ? parsed.data
    : { duration: "weekend" as const, budget: 5000 as const, vibe: "nature" as const, origin: "Pune" };
  const recommendations = await getRecommendations(input);
  const [bestMatch, ...otherMatches] = recommendations.slice(0, 6);

  return (
    <>
      <Navbar />
      <main>
        {/* Page header */}
        <div className="pt-16 pb-10 bg-canvas border-b border-hairline">
          <div className="shell">
            <p className="section-label animate-fade-up">Plan</p>
            <h1 className="display-lg animate-fade-up delay-1 mt-3 max-w-2xl">
              Tell us your ideal weekend. We rank the best options for you.
            </h1>
            <p className="text-body text-lg mt-4 max-w-2xl animate-fade-up delay-2">
              This planner is for users who want guidance, not a long browse session.
            </p>
            <div className="mt-8 animate-fade-up delay-3">
              <PlanForm
                defaultDuration={input.duration}
                defaultBudget={String(input.budget) as "5000" | "10000" | "15000"}
                defaultVibe={input.vibe}
                defaultOrigin={input.origin as "Pune" | "Mumbai" | "Nashik"}
              />
            </div>
          </div>
        </div>

        {/* Filter pills */}
        <div className="py-4 bg-surface-soft border-b border-hairline">
          <div className="shell">
            <div className="flex flex-wrap gap-2">
              {[input.duration, `₹${input.budget.toLocaleString("en-IN")}`, input.vibe, `from ${input.origin}`].map((value) => (
                <span
                  key={value}
                  className="rounded-pill bg-canvas border border-hairline px-4 py-2 text-sm font-medium text-body capitalize"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="pt-10 pb-section bg-canvas">
          <div className="shell">
            {bestMatch ? <BestMatchHero recommendation={bestMatch} /> : null}

            <div className="mt-14">
              <p className="section-label mb-3">Alternatives</p>
              <h2 className="text-title-lg font-semibold text-ink mb-8">Strong backup options</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {otherMatches.map((recommendation) => (
                  <AdventureCard key={recommendation.adventure.id} recommendation={recommendation} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
