import Image from "next/image";
import Link from "next/link";
import { AdventaLogo } from "@/components/logo";
import { Navbar } from "@/components/navbar";
import { PlanForm } from "@/components/plan-form";
import { ParallaxCard } from "@/components/motion";
import { formatCurrency } from "@/lib/format";
import { listAdventuresWithDates } from "@/lib/repository";

export default async function HomePage() {
  const allAdventures = await listAdventuresWithDates();
  const featured = allAdventures.slice(0, 8);
  const districts = new Set(allAdventures.map((a) => a.district)).size;
  const rated = allAdventures.filter((a) => typeof a.rating === "number");
  const avgRating = rated.length
    ? (rated.reduce((sum, a) => sum + (a.rating ?? 0), 0) / rated.length).toFixed(1)
    : "—";

  const categoryCards = [
    {
      color: "teal",
      category: "Trekking",
      href: "/discover?category=Trekking",
      title: "Summit views, guided trails.",
      body: "Certified guides, Sahyadri peaks, monsoon trails. From beginner forest walks to advanced ridge climbs.",
      stat: allAdventures.filter((a) => a.category === "Trekking").length + " treks",
      textLight: true,
    },
    {
      color: "peach",
      category: "Camping",
      href: "/discover?category=Camping",
      title: "Campfire nights, lake mornings.",
      body: "Waterfront camps, bonfire evenings, star-lit skies. No gear needed — everything is arranged.",
      stat: allAdventures.filter((a) => a.category === "Camping").length + " camps",
      textLight: false,
    },
    {
      color: "lavender",
      category: "Waterfalls",
      href: "/discover?category=Waterfalls",
      title: "Monsoon season magic.",
      body: "Hidden jungle waterfalls, natural rock pools, and forest canopy trails best in June–September.",
      stat: allAdventures.filter((a) => a.category === "Waterfalls").length + " experiences",
      textLight: false,
    },
    {
      color: "ochre",
      category: "Forts",
      href: "/discover?category=Forts",
      title: "Maharashtra history, sky-high.",
      body: "Maratha forts with panoramic views. History, architecture, and a genuine workout on every trail.",
      stat: allAdventures.filter((a) => a.category === "Forts").length + " forts",
      textLight: false,
    },
    {
      color: "pink",
      category: "Glamping",
      href: "/discover?category=Glamping",
      title: "Luxury camping, zero compromise.",
      body: "Premium tents, gourmet meals, and sunset views. The outdoors, with hotel-level comfort.",
      stat: allAdventures.filter((a) => a.category === "Glamping").length + " stays",
      textLight: true,
    },
    {
      color: "mint",
      category: "Water Sports",
      href: "/discover?category=Water Sports",
      title: "Rivers, lakes, adrenaline.",
      body: "White-water rafting on Kundalika, kayaking Mulshi Lake, and water sports weekends near Pune and Mumbai.",
      stat: allAdventures.filter((a) => a.category === "Water Sports").length + " trips",
      textLight: false,
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* SECTION 1 — HERO */}
        <section className="bg-canvas" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="shell">
            <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-12 items-stretch">
              {/* Left col */}
              <div className="flex flex-col justify-center pt-24 pb-20 md:pb-section">
                <p className="section-label animate-fade-up">
                  Weekend Escapes · Adventa
                </p>
                <h1 className="display-xl animate-fade-up delay-1 mt-4 max-w-xl">
                  Discover your next escape.
                </h1>
                <p className="text-body text-lg leading-relaxed max-w-md mt-5 animate-fade-up delay-2">
                  We match your weekend to the perfect escape. Trek Sahyadri peaks, camp by lakes, explore ancient forts.
                </p>
                <div className="flex gap-3 mt-8 animate-fade-up delay-3">
                  <Link href="/discover" className="btn-primary">
                    Explore trips
                  </Link>
                  <Link href="/plan" className="btn-secondary">
                    Get matched →
                  </Link>
                </div>
                <div className="flex items-center gap-6 mt-12 animate-fade-up delay-4">
                  <div>
                    <span className="text-2xl font-semibold text-ink">{allAdventures.length}+</span>
                    <span className="text-sm text-muted ml-1.5">trips</span>
                  </div>
                  <div>
                    <span className="text-2xl font-semibold text-ink">{districts}</span>
                    <span className="text-sm text-muted ml-1.5">districts</span>
                  </div>
                  <div>
                    <span className="text-2xl font-semibold text-ink">{avgRating}★</span>
                    <span className="text-sm text-muted ml-1.5">avg rating</span>
                  </div>
                </div>
              </div>

              {/* Right col — 3D stacked cards */}
              <div className="hidden md:flex items-center justify-end pt-16 pb-12 relative">
                <ParallaxCard className="card-3d-wrapper relative w-full max-w-[420px] group">
                  {/* Bottom card */}
                  <div
                    className="absolute card-3d-far"
                    style={{ top: "48px", left: "48px", right: "-24px", bottom: "-24px" }}
                  >
                    <div className="h-full rounded-[20px] bg-brand-peach opacity-60" />
                  </div>

                  {/* Middle card */}
                  <div
                    className="absolute card-3d-behind"
                    style={{ top: "24px", left: "24px", right: "-12px", bottom: "-12px" }}
                  >
                    <div className="h-full rounded-[20px] bg-brand-lavender opacity-80" />
                  </div>

                  {/* Front card */}
                  <div
                    className="card-3d relative bg-canvas border border-hairline"
                    style={{ minHeight: "380px" }}
                  >
                    <div className="relative h-52 rounded-t-[20px] overflow-hidden">
                      <Image
                        src={
                          featured[0]?.heroImage ??
                          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={featured[0]?.title ?? "Adventure"}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="p-6">
                      <p className="section-label">{featured[0]?.category ?? "Trekking"}</p>
                      <h3 className="text-title-lg font-semibold text-ink mt-1">
                        {featured[0]?.title ?? "Devkund Waterfall Trek"}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-2xl font-semibold text-ink">
                          {formatCurrency(
                            featured[0]?.nextAvailableDate?.dynamicPrice ??
                              featured[0]?.basePrice ??
                              1899
                          )}
                        </p>
                        <Link
                          href={"/adventure/" + (featured[0]?.id ?? "")}
                          className="btn-primary h-9 px-4 text-sm"
                        >
                          Book now
                        </Link>
                      </div>
                    </div>
                    {/* Hover preview — proper mini-cards of other top adventures */}
                    <div className="border-t border-hairline translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="px-5 pt-4 pb-5">
                        <p className="section-label mb-3">More this weekend</p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {featured.slice(1, 5).map((a) => (
                            <Link
                              key={a.id}
                              href={"/adventure/" + a.id}
                              className="flex items-center gap-2.5 rounded-lg border border-hairline bg-surface-soft p-2 transition-all duration-150 hover:border-ink/30 hover:bg-canvas"
                            >
                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md">
                                <Image src={a.heroImage} alt={a.title} fill className="object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-ink leading-tight">{a.title}</p>
                                <p className="text-xs text-muted mt-0.5">
                                  {formatCurrency(a.nextAvailableDate?.dynamicPrice ?? a.basePrice)}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ParallaxCard>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — CATEGORY FEATURE CARDS */}
        <section className="py-section bg-canvas">
          <div className="shell">
            <p className="section-label">Activities</p>
            <h2 className="display-md mt-3">Pick the kind of weekend you want.</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
              {categoryCards.map((c) => (
                <Link
                  key={c.category}
                  href={c.href}
                  className={
                    "feature-card feature-card-" +
                    c.color +
                    " group block transition-transform duration-200 hover:-translate-y-1"
                  }
                >
                  <p
                    className={
                      "section-label mb-3 " +
                      (c.textLight ? "text-white/50" : "text-ink/50")
                    }
                  >
                    {c.category}
                  </p>
                  <h3
                    className={
                      "font-semibold mb-3 " +
                      (c.textLight ? "text-white" : "text-ink")
                    }
                    style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.02em" }}
                  >
                    {c.title}
                  </h3>
                  <p
                    className={
                      "text-sm leading-relaxed mb-6 " +
                      (c.textLight ? "text-white/75" : "text-body")
                    }
                    style={{ maxWidth: "280px" }}
                  >
                    {c.body}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        "text-xs font-semibold " +
                        (c.textLight ? "text-white/60" : "text-muted")
                      }
                    >
                      {c.stat}
                    </span>
                    <span
                      className={
                        "text-sm font-semibold " +
                        (c.textLight ? "text-white" : "text-ink")
                      }
                    >
                      Browse →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — PLAN FORM */}
        <section className="py-section bg-surface-soft">
          <div className="shell">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: feature card */}
              <div className="feature-card feature-card-teal" style={{ minHeight: "360px" }}>
                <p className="section-label text-white/50 mb-3">Trip Planner</p>
                <h2 className="display-sm text-white mt-2 max-w-xs">
                  Tell us your time, budget, and vibe.
                </h2>
                <p className="text-white/70 mt-4 text-sm leading-relaxed">
                  Answer 3 questions. We score every adventure and show you the top 3 — with transparent reasoning.
                </p>
                <div className="flex flex-col gap-2 mt-8">
                  <span className="inline-flex items-center gap-2 text-sm text-white/80">
                    <span className="h-1 w-1 rounded-full bg-white/40 inline-block" />
                    No account needed
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-white/80">
                    <span className="h-1 w-1 rounded-full bg-white/40 inline-block" />
                    3 questions
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-white/80">
                    <span className="h-1 w-1 rounded-full bg-white/40 inline-block" />
                    Instant shortlist
                  </span>
                </div>
              </div>

              {/* Right: plan form */}
              <PlanForm />
            </div>
          </div>
        </section>

        {/* SECTION 4 — FEATURED TRIPS */}
        <section className="py-section bg-canvas">
          <div className="shell">
            <div className="flex items-end justify-between">
              <div>
                <p className="section-label">Featured this weekend</p>
                <h2 className="display-md mt-3">Popular escapes.</h2>
              </div>
              <Link href="/discover" className="text-sm font-medium text-muted hover:text-ink transition-colors">
                See all trips →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
              {featured.map((a) => (
                <Link
                  key={a.id}
                  href={"/adventure/" + a.id}
                  className="group block hairline-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-subtle"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-[14px]">
                    <Image
                      src={a.heroImage}
                      alt={a.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="section-label">{a.category}</p>
                      <span className="text-xs font-semibold text-ink">{(a.rating ?? 4.5).toFixed(1)} ★</span>
                    </div>
                    <h3 className="text-base font-semibold text-ink mt-2 leading-snug">{a.title}</h3>
                    <p className="text-sm text-muted mt-1">{a.location}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-hairline">
                      <p className="text-lg font-semibold text-ink">
                        {formatCurrency(a.nextAvailableDate?.dynamicPrice ?? a.basePrice)}
                      </p>
                      <p className="text-sm text-muted">{a.durationHours} hrs</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — CTA BAND */}
        <section className="py-section bg-surface-soft">
          <div className="shell text-center">
            <p className="section-label">Ready to go?</p>
            <h2 className="display-md mt-3 max-w-lg mx-auto text-balance">
              Your next Maharashtra weekend is three questions away.
            </h2>
            <div className="flex gap-3 justify-center mt-8">
              <Link href="/plan" className="btn-primary">
                Start planning
              </Link>
              <Link href="/discover" className="btn-secondary">
                Browse all trips
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-surface-soft border-t border-hairline py-12">
        <div className="shell flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <AdventaLogo size={28} />
            <span className="text-sm font-semibold text-ink">Adventa</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-muted">
            <Link href="/discover">Discover</Link>
            <Link href="/plan">Plan</Link>
            <Link href="/operator/login">Operators</Link>
          </nav>
          <p className="text-sm text-muted">
            © 2026 Adventa. Made by Bappaditya Kuilya.
          </p>
        </div>
      </footer>
    </>
  );
}
