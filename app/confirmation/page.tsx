import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { formatCurrency, formatDate } from "@/lib/format";

function randomRef() {
  return Math.random().toString(36).toUpperCase().slice(2, 8);
}

export default async function ConfirmationPage({
  searchParams
}: {
  searchParams?: Promise<{ bookingId?: string; adventure?: string; date?: string; participants?: string; totalPrice?: string; adventure_id?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const ref = params.bookingId ? params.bookingId.slice(-6).toUpperCase() : randomRef();
  const participants = params.participants ?? "2";

  return (
    <>
      <Navbar />
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>
      <main className="bg-canvas min-h-screen">
        <div className="py-16 bg-canvas">
          <div className="shell max-w-2xl">

            {/* Checkmark hero */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="animate-scale-in w-24 h-24 rounded-full bg-[#dcfce7] border-2 border-[#86efac] flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="section-label animate-fade-up">Booking confirmed</p>
              <h1 className="display-md animate-fade-up mt-3">Your adventure is locked in</h1>
              <p className="text-body mt-3 max-w-md animate-fade-up">
                Maharashtra Adventures has confirmed your slot. Get ready for an unforgettable experience.
              </p>
            </div>

            {/* Booking reference */}
            <div className="hairline-card p-6 mb-6 flex items-center justify-between">
              <div>
                <p className="section-label">Booking reference</p>
                <p className="font-mono text-2xl font-semibold text-ink mt-1 tracking-widest">{ref}</p>
              </div>
              <div className="text-right">
                <p className="section-label">Status</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16a34a] mt-1 uppercase tracking-wide">
                  <span className="h-2 w-2 rounded-full bg-[#16a34a] inline-block" />
                  Confirmed
                </span>
              </div>
            </div>

            {/* Trip details */}
            <div className="hairline-card p-6 mb-6">
              <p className="section-label mb-4">Trip summary</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="content-card">
                  <p className="section-label">Adventure</p>
                  <p className="text-base font-semibold text-ink mt-1">{params.adventure ?? "Maharashtra Adventure"}</p>
                </div>
                <div className="content-card">
                  <p className="section-label">Departure</p>
                  <p className="text-base font-semibold text-ink mt-1">{params.date ? formatDate(params.date) : "Date TBC"}</p>
                </div>
                <div className="content-card">
                  <p className="section-label">Guests</p>
                  <p className="text-base font-semibold text-ink mt-1">{participants} {Number(participants) === 1 ? "person" : "people"}</p>
                </div>
                <div className="content-card">
                  <p className="section-label">Total charged</p>
                  <p className="text-base font-semibold text-ink mt-1">{formatCurrency(Number(params.totalPrice ?? 0))}</p>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="hairline-card p-6 mb-6">
              <p className="section-label mb-5">What happens next</p>
              <ol className="space-y-5">
                {[
                  {
                    num: "1",
                    title: "Confirmation email",
                    desc: "You will receive a detailed confirmation email with your booking summary and operator contact within the next few minutes."
                  },
                  {
                    num: "2",
                    title: "Meet your guide",
                    desc: "Your lead guide will reach out 48 hours before departure with the meeting point, what to pack, and final logistics."
                  },
                  {
                    num: "3",
                    title: "Adventure day",
                    desc: "Show up, gear up, and experience Maharashtra like never before. Your guide handles everything from here."
                  }
                ].map((step) => (
                  <li key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-ink text-canvas text-sm font-semibold grid place-items-center">
                      {step.num}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{step.title}</p>
                      <p className="text-sm text-muted mt-0.5">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Demo note */}
            <div className="rounded-md border border-hairline bg-surface-soft px-5 py-4 mb-8 text-sm text-muted">
              <span className="font-semibold text-ink">Demo mode.</span> No real payment was processed. This booking is stored for demonstration purposes only.
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/discover" className="btn-secondary flex-1 justify-center h-12 text-sm">
                Explore more trips
              </Link>
              <Link href="/" className="btn-primary flex-1 justify-center h-12 text-sm">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
