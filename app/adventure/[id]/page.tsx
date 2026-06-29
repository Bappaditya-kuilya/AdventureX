import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { ScoreCard } from "@/components/score-card";
import { AnimatedBar, CountUp, SlideUp, FadeIn, StaggerList, StaggerItem } from "@/components/motion";
import { formatCurrency, formatDate } from "@/lib/format";
import { getRecommendationForAdventure } from "@/lib/recommendations";
import { getAdventureWithDates, getOperatorById } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function AdventureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adventure = await getAdventureWithDates(id);
  if (!adventure) notFound();
  const nextDate = adventure.nextAvailableDate;
  const operator = await getOperatorById(adventure.operatorId);

  const recommendation = await getRecommendationForAdventure(adventure.id, {
    duration: adventure.durationHours <= 30 ? "weekend" : adventure.durationHours <= 54 ? "long-weekend" : "week",
    budget: ((nextDate?.dynamicPrice ?? adventure.basePrice) <= 5000 ? 5000 : (nextDate?.dynamicPrice ?? adventure.basePrice) <= 10000 ? 10000 : 15000),
    origin: adventure.originHints[0] ?? "Mumbai",
    vibe: adventure.difficulty === "Advanced" ? "adrenaline" : adventure.category === "Camping" || adventure.category === "Waterfalls" ? "chill" : "nature"
  });

  if (!recommendation) notFound();

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <div className="relative h-[60vh] min-h-[480px] w-full">
          <Image
            src={adventure.heroImage}
            fill
            className="object-cover"
            priority
            alt={adventure.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 pb-10">
            <div className="shell">
              <SlideUp>
                <p className="section-label text-white/50 mb-3">
                  {adventure.category} · {adventure.district}
                </p>
                <h1 className="display-md max-w-2xl" style={{ color: "white" }}>
                  {adventure.title}
                </h1>
                <div className="flex flex-wrap gap-5 mt-4 text-sm text-white/70">
                  <span>★ 4.8 · 127 reviews</span>
                  <span>Hosted by {operator?.name ?? "Verified Operator"}</span>
                  <span>{adventure.durationHours} hrs</span>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <div className="py-8 bg-canvas border-b border-hairline">
          <div className="shell">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {adventure.gallery.slice(0, 3).map((image, idx) => (
                <FadeIn key={image} delay={idx * 0.1}>
                  <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden">
                    <Image fill className="object-cover" src={image} alt={adventure.title} />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="py-12 pb-24 bg-canvas">
          <div className="shell grid gap-12 lg:grid-cols-[1fr_380px]">

            {/* LEFT */}
            <div className="space-y-10">

              {/* About */}
              <SlideUp>
              <div className="pb-10 border-b border-hairline">
                <h2 className="text-title-lg font-semibold text-ink">About this experience</h2>
                <p className="text-body leading-relaxed mt-3">{adventure.description}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {adventure.tags.map((tag) => (
                    <span key={tag} className="rounded-xs bg-surface-card border border-hairline px-3 py-1 text-sm text-body">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              </SlideUp>

              {/* Quick stats */}
              <div className="pb-10 border-b border-hairline">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Duration", value: adventure.durationHours + " hrs" },
                    { label: "Difficulty", value: adventure.difficulty },
                    { label: "Group", value: "Up to 20 people" },
                  ].map((stat) => (
                    <div key={stat.label} className="content-card">
                      <p className="section-label">{stat.label}</p>
                      <p className="text-xl font-semibold text-ink mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included */}
              <div className="pb-10 border-b border-hairline">
                <h2 className="text-title-lg font-semibold text-ink">What&apos;s included</h2>
                <StaggerList className="grid grid-cols-2 gap-3 mt-4">
                  {adventure.included.map((item) => (
                    <StaggerItem key={item}>
                      <div className="flex gap-3">
                        <span className="text-[#22c55e] font-bold">✓</span>
                        <span className="text-sm text-body">{item}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>

              {/* Day plan */}
              <div className="pb-10 border-b border-hairline">
                <h2 className="text-title-lg font-semibold text-ink">Day plan</h2>
                <StaggerList className="space-y-0 mt-5">
                  {adventure.itinerary.map((step, i) => (
                    <StaggerItem key={step}>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-ink text-white text-sm font-semibold grid place-items-center shrink-0">
                            {i + 1}
                          </div>
                          {i < adventure.itinerary.length - 1 && (
                            <div className="w-px flex-1 bg-hairline mt-1 min-h-[28px]" />
                          )}
                        </div>
                        <p className="text-sm text-body pt-1.5 pb-5">{step}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>

              {/* Available dates */}
              <div className="pb-10 border-b border-hairline">
                <h2 className="text-title-lg font-semibold text-ink">Available dates</h2>
                <StaggerList className="grid md:grid-cols-3 gap-3 mt-4">
                  {adventure.nextDates.map((date) => (
                    <StaggerItem key={date.id}>
                      <div className="hairline-card p-5">
                        <p className="text-sm font-semibold text-ink">{formatDate(date.date)}</p>
                        <p className="text-2xl font-semibold text-ink mt-2">{formatCurrency(date.dynamicPrice)}</p>
                        <p className="text-sm text-muted mt-1">{date.slotsLeft} of {date.slotsTotal} seats</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="rounded-xs bg-surface-card px-2 py-1 text-xs font-medium text-muted">
                            {date.weatherRisk} weather risk
                          </span>
                          <span className="rounded-xs bg-surface-card px-2 py-1 text-xs font-medium text-muted">
                            {date.demandSignal} demand
                          </span>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>

              {/* Cancellation + Operator */}
              <div className="grid sm:grid-cols-2 gap-8 pt-2">
                <div>
                  <h2 className="text-lg font-semibold text-ink">Cancellation policy</h2>
                  <p className="text-sm text-body mt-2">{adventure.cancellationPolicy}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-ink">Operator details</h2>
                  <div className="space-y-1.5 text-sm text-body mt-2">
                    <p>{operator?.yearsActive ?? 6} years active</p>
                    <p>{operator?.rating ?? 4.7}/5 operator score</p>
                    <p>{operator?.contact ?? "+91 98765 41000"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT STICKY */}
            <SlideUp delay={0.1}>
            <div className="lg:sticky lg:top-24 space-y-5">

              {/* Booking card */}
              <div className="hairline-card p-6 shadow-subtle">
                <div className="flex items-baseline justify-between">
                  <p>
                    <span className="text-3xl font-semibold text-ink">
                      {formatCurrency(nextDate?.dynamicPrice ?? adventure.basePrice)}
                    </span>
                    <span className="text-sm text-muted font-normal ml-1">/ person</span>
                  </p>
                  <span className="text-sm text-muted">★ 4.8</span>
                </div>

                <div className="hairline-card mt-5 overflow-hidden p-0">
                  <div className="grid grid-cols-2 divide-x divide-hairline">
                    <div className="p-4">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">CHECK-IN</p>
                      <p className="text-sm text-ink mt-1">
                        {nextDate ? formatDate(nextDate.date) : "Select date"}
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">GUESTS</p>
                      <p className="text-sm text-ink mt-1">2 participants</p>
                    </div>
                  </div>
                </div>

                <Link
                  href={"/checkout?adventure_id=" + adventure.id}
                  className="btn-primary w-full justify-center mt-4 h-12 text-base"
                >
                  Reserve
                </Link>
                <p className="text-xs text-muted text-center mt-2">Demo mode — no charge</p>

                <div className="space-y-2.5 mt-5 text-sm">
                  <div className="flex justify-between text-body">
                    <span>Base fare</span>
                    <span>{formatCurrency(nextDate?.dynamicPrice ?? adventure.basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Platform fee</span>
                    <span>Included</span>
                  </div>
                </div>
              </div>

              <ScoreCard recommendation={recommendation} />
            </div>
            </SlideUp>
          </div>
        </div>
      </main>
    </>
  );
}
