import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOperatorDashboardMetrics } from "@/lib/repository";
import { OPERATOR_COOKIE, verifyOperatorSession } from "@/lib/operator-auth";
import { TrendingUp, Users, IndianRupee, Star } from "lucide-react";

export const dynamic = "force-dynamic";

async function signOut() {
  "use server";
  (await cookies()).set(OPERATOR_COOKIE, "", { path: "/", maxAge: 0 });
  redirect("/operator/login");
}

export default async function OperatorDashboardPage() {
  const operatorId = verifyOperatorSession((await cookies()).get(OPERATOR_COOKIE)?.value);
  const metrics = operatorId ? await getOperatorDashboardMetrics(operatorId) : null;
  if (!operatorId || !metrics) redirect("/operator/login");

  const stats = [
    { label: "Total revenue", value: formatCurrency(metrics.totalRevenue), icon: IndianRupee },
    { label: "Bookings", value: String(metrics.bookingsCount), icon: Users },
    { label: "Avg occupancy", value: `${metrics.averageOccupancy}%`, icon: TrendingUp },
    { label: "Operator rating", value: `${metrics.operator.rating} ★`, icon: Star },
  ];

  const insights = metrics.adventures.flatMap((a) => {
    if (a.demandSignal === "High") {
      return [{ trip: a.title, insight: "High demand detected — raise your margin.", action: "Increase price" }];
    }
    if (a.slotsTotal > 0 && a.slotsLeft / a.slotsTotal <= 0.25) {
      return [{ trip: a.title, insight: `Only ${a.slotsLeft} of ${a.slotsTotal} slots left.`, action: "Add a batch" }];
    }
    return [];
  }).slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        {/* HEADER */}
        <div className="pt-14 pb-8 bg-canvas border-b border-hairline">
          <div className="shell flex justify-between items-start">
            <div>
              <p className="section-label animate-fade-up">Dashboard</p>
              <h1 className="display-md animate-fade-up delay-1 mt-3">Good morning, {metrics.operator.name}.</h1>
              <p className="text-body mt-2 animate-fade-up delay-2">Here is what is happening with your adventures today.</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-xs bg-surface-card border border-hairline px-3 py-1.5 text-xs font-semibold text-muted hover:border-ink hover:text-ink transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* STATS */}
        <div className="py-8 bg-surface-soft border-b border-hairline">
          <div className="shell grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="hairline-card p-5 bg-canvas">
                  <div className="flex items-center justify-between mb-3">
                    <p className="section-label">{stat.label}</p>
                    <div className="h-8 w-8 rounded-sm bg-surface-card grid place-items-center">
                      <Icon className="h-4 w-4 text-ink" />
                    </div>
                  </div>
                  <p className="text-3xl font-semibold text-ink" style={{ letterSpacing: "-0.03em" }}>{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="py-10 pb-section bg-canvas">
          <div className="shell">

            {/* TWO-COL */}
            <div className="grid lg:grid-cols-[1fr_360px] gap-6 mb-6">

              {/* LEFT — Adventures table */}
              <div className="hairline-card overflow-hidden">
                <div className="p-5 border-b border-hairline flex justify-between items-center">
                  <h2 className="text-title-sm font-semibold text-ink">Your Adventures</h2>
                  <Link href="/discover" className="text-sm text-muted hover:text-ink transition-colors">
                    View live →
                  </Link>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-soft">
                      {["Trip", "Slots", "Price", "Demand"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {metrics.adventures.map((adventure) => (
                      <tr key={adventure.id} className="hover:bg-surface-soft/50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-ink">{adventure.title}</p>
                          <p className="text-xs text-muted mt-0.5">{adventure.location}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-body">{adventure.slotsLeft} / {adventure.slotsTotal}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-ink">{formatCurrency(adventure.price)}</td>
                        <td className="px-5 py-4">
                          {adventure.demandSignal === "High" ? (
                            <span className="rounded-xs px-2 py-1 text-xs font-semibold bg-[#a4d4c5]/30 text-[#0a1a1a]">
                              High
                            </span>
                          ) : adventure.demandSignal === "Medium" ? (
                            <span className="rounded-xs px-2 py-1 text-xs font-semibold bg-[#e8b94a]/30 text-[#0a0a0a]">
                              Medium
                            </span>
                          ) : (
                            <span className="rounded-xs px-2 py-1 text-xs font-semibold bg-surface-card text-muted">
                              Low
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* RIGHT — Insights */}
              <div className="hairline-card overflow-hidden">
                <div className="p-5 border-b border-hairline">
                  <h2 className="text-title-sm font-semibold text-ink">Revenue Insights</h2>
                </div>
                <div className="divide-y divide-hairline">
                  {insights.length > 0 ? (
                    insights.map((insight) => (
                      <div key={insight.trip} className="p-5">
                        <p className="text-sm font-semibold text-ink">{insight.trip}</p>
                        <p className="text-sm text-body mt-1">{insight.insight}</p>
                        <button className="mt-2 rounded-xs bg-surface-card border border-hairline px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-strong transition-colors">
                          {insight.action}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-5">
                      <p className="text-sm text-body">All trips healthy — nothing needs your attention right now.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BOOKINGS TABLE */}
            <div className="hairline-card overflow-hidden">
              <div className="p-5 border-b border-hairline flex justify-between">
                <h2 className="text-title-sm font-semibold text-ink">Recent Bookings</h2>
                <span className="text-sm text-muted">Last 30 days</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-surface-soft">
                    <tr>
                      {["Booking ID", "Trip", "Date", "Guests", "Amount", "Status"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {metrics.recentBookings.length > 0 ? (
                      metrics.recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-surface-soft/50 transition-colors">
                          <td className="px-5 py-4">
                            <span className="font-mono text-sm text-muted">{booking.id}</span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-ink">{booking.trip}</p>
                            <p className="text-xs text-muted mt-0.5">{booking.customerName}</p>
                          </td>
                          <td className="px-5 py-4 text-sm text-body">{formatDate(booking.date)}</td>
                          <td className="px-5 py-4 text-sm text-body">{booking.guests} guests</td>
                          <td className="px-5 py-4 text-sm font-semibold text-ink">{formatCurrency(booking.amount)}</td>
                          <td className="px-5 py-4">
                            {booking.status === "confirmed" ? (
                              <span className="rounded-xs px-2 py-1 text-xs font-semibold bg-[#a4d4c5]/30 text-[#0a3a0a]">
                                confirmed
                              </span>
                            ) : (
                              <span className="rounded-xs px-2 py-1 text-xs font-semibold bg-[#e8b94a]/30 text-[#3a2a00]">
                                {booking.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted">
                          No bookings yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
