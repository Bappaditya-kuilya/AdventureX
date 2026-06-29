import { notFound } from "next/navigation";
import Image from "next/image";
import { CheckoutForm } from "./form";
import { Navbar } from "@/components/navbar";
import { formatCurrency, formatDate } from "@/lib/format";
import { getAdventureWithDates } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams?: Promise<{ adventure_id?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const adventureId = params.adventure_id;
  if (!adventureId) notFound();

  const adventure = await getAdventureWithDates(adventureId);
  if (!adventure) notFound();

  return (
    <>
      <Navbar />
      <main>
        {/* PAGE HEADER */}
        <div className="pt-14 pb-8 bg-canvas border-b border-hairline">
          <div className="shell">
            <p className="section-label animate-fade-up">Checkout</p>
            <h1 className="display-md animate-fade-up delay-1 mt-3">{adventure.title}</h1>
            <p className="text-body mt-3 max-w-xl animate-fade-up delay-2">
              Review the next live departure and confirm your booking in demo payment mode.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="py-12 pb-section bg-canvas">
          <div className="shell grid gap-10 lg:grid-cols-[1fr_420px]">

            {/* LEFT */}
            <div>
              <div className="relative aspect-[16/9] rounded-[16px] overflow-hidden">
                <Image src={adventure.heroImage} alt={adventure.title} fill className="object-cover" />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="hairline-card p-5">
                  <p className="section-label">From</p>
                  <p className="text-2xl font-semibold text-ink mt-1">
                    {formatCurrency(adventure.nextAvailableDate?.dynamicPrice ?? adventure.basePrice)}
                  </p>
                </div>
                <div className="hairline-card p-5">
                  <p className="section-label">Difficulty</p>
                  <p className="text-2xl font-semibold text-ink mt-1">{adventure.difficulty}</p>
                </div>
                <div className="hairline-card p-5">
                  <p className="section-label">Duration</p>
                  <p className="text-2xl font-semibold text-ink mt-1">{adventure.durationHours} hrs</p>
                </div>
              </div>

              <div className="hairline-card mt-5 p-6">
                <p className="section-label mb-4">Available dates</p>
                <div className="space-y-3">
                  {adventure.nextDates.map((date) => (
                    <div key={date.id} className="content-card">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-ink">{formatDate(date.date)}</span>
                        <span className="text-sm font-semibold text-ink">{formatCurrency(date.dynamicPrice)}</span>
                      </div>
                      <p className="text-sm text-muted mt-1">
                        {date.slotsLeft} of {date.slotsTotal} seats · {date.demandSignal} demand
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <CheckoutForm adventure={adventure} />
          </div>
        </div>
      </main>
    </>
  );
}
