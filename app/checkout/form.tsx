"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { AdventureWithDates } from "@/lib/types";

const dietaryOptions = [
  { value: "no-preference", label: "No preference" },
  { value: "veg", label: "Vegetarian" },
  { value: "non-veg", label: "Non-veg" },
  { value: "vegan", label: "Vegan" }
] as const;

const inputClass =
  "w-full h-11 rounded-md border border-hairline bg-canvas px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors";

export function CheckoutForm({ adventure }: { adventure: AdventureWithDates }) {
  const router = useRouter();
  const bookableDates = useMemo(
    () => adventure.nextDates.filter((date) => date.slotsLeft > 0),
    [adventure.nextDates]
  );

  const [adventureDateId, setAdventureDateId] = useState(
    (adventure.nextAvailableDate ?? bookableDates[0])?.id ?? ""
  );
  const [participants, setParticipants] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState<(typeof dietaryOptions)[number]["value"]>("no-preference");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedDate = bookableDates.find((date) => date.id === adventureDateId) ?? null;
  const maxParticipants = Math.min(8, selectedDate?.slotsLeft ?? 1);
  const totalPrice = (selectedDate?.dynamicPrice ?? 0) * participants;

  if (bookableDates.length === 0) {
    return (
      <div className="hairline-card p-6">
        <p className="section-label">Sold out</p>
        <p className="text-body text-sm mt-2">Every upcoming departure is fully booked. Check back soon for new dates.</p>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedDate) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adventureId: adventure.id,
          adventureDateId: selectedDate.id,
          date: selectedDate.date,
          participants,
          name,
          email,
          phone,
          dietaryPreference,
          specialRequests: specialRequests || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Booking failed. Please try again.");
        return;
      }

      const params = new URLSearchParams({
        bookingId: data.bookingId,
        adventure: adventure.title,
        date: selectedDate.date,
        participants: String(participants),
        totalPrice: String(totalPrice)
      });
      router.push(`/confirmation?${params.toString()}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="hairline-card p-6 md:p-7 bg-canvas h-fit">
      <p className="section-label mb-4">Confirm your booking</p>

      <div className="grid gap-4">
        <label>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Departure date</p>
          <select
            value={adventureDateId}
            onChange={(event) => {
              setAdventureDateId(event.target.value);
              setParticipants(1);
            }}
            className={inputClass}
          >
            {bookableDates.map((date) => (
              <option key={date.id} value={date.id}>
                {formatDate(date.date)} · {formatCurrency(date.dynamicPrice)} · {date.slotsLeft} left
              </option>
            ))}
          </select>
        </label>

        <label>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Participants</p>
          <select
            value={participants}
            onChange={(event) => setParticipants(Number(event.target.value))}
            className={inputClass}
          >
            {Array.from({ length: maxParticipants }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "person" : "people"}
              </option>
            ))}
          </select>
        </label>

        <label>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Full name</p>
          <input type="text" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
        </label>

        <label>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Email</p>
          <input type="email" required maxLength={120} value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
        </label>

        <label>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Phone</p>
          <input type="tel" required minLength={7} maxLength={20} value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} />
        </label>

        <label>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Dietary preference</p>
          <select value={dietaryPreference} onChange={(event) => setDietaryPreference(event.target.value as typeof dietaryPreference)} className={inputClass}>
            {dietaryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Special requests (optional)</p>
          <textarea rows={3} maxLength={500} value={specialRequests} onChange={(event) => setSpecialRequests(event.target.value)} className="w-full rounded-md border border-hairline bg-canvas px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none transition-colors" />
        </label>
      </div>

      {/* Honest demo-payment notice — no card data is collected */}
      <div className="mt-5 rounded-md border border-hairline bg-surface-soft px-4 py-3 flex gap-2.5">
        <Lock className="h-4 w-4 text-muted shrink-0 mt-0.5" />
        <p className="text-xs text-muted">
          <span className="font-semibold text-ink">Demo payment mode.</span> No card details are collected and no real charge is made. Your slot is reserved instantly.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-hairline pt-5">
        <div>
          <p className="section-label">Total</p>
          <p className="text-2xl font-semibold text-ink mt-1">{formatCurrency(totalPrice)}</p>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? "Confirming…" : "Confirm booking"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-[#c0392b]">{error}</p>}
    </form>
  );
}
