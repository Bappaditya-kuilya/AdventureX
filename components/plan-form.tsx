"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

const durationOptions = [
  { value: "weekend", label: "Just a weekend", note: "Sat-Sun friendly" },
  { value: "long-weekend", label: "Long weekend", note: "3 to 4 days" },
  { value: "week", label: "A full week", note: "Go bigger" }
] as const;

const budgetOptions = [
  { value: "5000", label: "Up to ₹5k", note: "Budget-conscious" },
  { value: "10000", label: "₹5k to ₹10k", note: "Moderate" },
  { value: "15000", label: "₹10k+", note: "Premium" }
] as const;

const vibeOptions = [
  { value: "adrenaline", label: "Adrenaline", note: "Climbs and sharper terrain" },
  { value: "nature", label: "Nature", note: "Trails, forests, slower pace" },
  { value: "chill", label: "Chill", note: "Camping and low-pressure trips" }
] as const;

const originOptions = [
  { value: "Pune", label: "Pune", note: "Sahyadri doorstep" },
  { value: "Mumbai", label: "Mumbai", note: "Coastal & ghats" },
  { value: "Nashik", label: "Nashik", note: "Northern ranges" }
] as const;

export function PlanForm({
  defaultDuration = "weekend",
  defaultBudget = "5000",
  defaultVibe = "nature",
  defaultOrigin = "Pune"
}: {
  defaultDuration?: "weekend" | "long-weekend" | "week";
  defaultBudget?: "5000" | "10000" | "15000";
  defaultVibe?: "adrenaline" | "nature" | "chill";
  defaultOrigin?: "Pune" | "Mumbai" | "Nashik";
}) {
  const router = useRouter();
  const [duration, setDuration] = useState(defaultDuration);
  const [budget, setBudget] = useState(defaultBudget);
  const [vibe, setVibe] = useState(defaultVibe);
  const [origin, setOrigin] = useState(defaultOrigin);

  return (
    <form
      className="hairline-card p-6 md:p-8 bg-canvas"
      onSubmit={(event) => {
        event.preventDefault();
        const search = new URLSearchParams({ duration, budget, vibe, origin });
        router.push(`/plan?${search.toString()}`);
      }}
    >
      <div className="grid gap-5">
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">How much time do you have?</p>
          <div className="grid grid-cols-3 gap-3">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDuration(option.value)}
                className={duration === option.value
                  ? "rounded-lg border-2 border-ink bg-ink text-white p-4 text-left transition-all duration-150"
                  : "rounded-lg border border-hairline bg-canvas text-ink p-4 text-left hover:border-ink transition-all duration-150"}
              >
                {duration === option.value ? (
                  <>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Check className="h-3.5 w-3.5" />
                      {option.label}
                    </span>
                    <span className="text-xs text-white/60 mt-1 block">{option.note}</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold block">{option.label}</span>
                    <span className="text-xs text-muted mt-1 block">{option.note}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">What is your budget?</p>
          <div className="grid grid-cols-3 gap-3">
            {budgetOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setBudget(option.value)}
                className={budget === option.value
                  ? "rounded-lg border-2 border-ink bg-ink text-white p-4 text-left transition-all duration-150"
                  : "rounded-lg border border-hairline bg-canvas text-ink p-4 text-left hover:border-ink transition-all duration-150"}
              >
                {budget === option.value ? (
                  <>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Check className="h-3.5 w-3.5" />
                      {option.label}
                    </span>
                    <span className="text-xs text-white/60 mt-1 block">{option.note}</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold block">{option.label}</span>
                    <span className="text-xs text-muted mt-1 block">{option.note}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">What is your vibe?</p>
          <div className="grid grid-cols-3 gap-3">
            {vibeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setVibe(option.value)}
                className={vibe === option.value
                  ? "rounded-lg border-2 border-ink bg-ink text-white p-4 text-left transition-all duration-150"
                  : "rounded-lg border border-hairline bg-canvas text-ink p-4 text-left hover:border-ink transition-all duration-150"}
              >
                {vibe === option.value ? (
                  <>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Check className="h-3.5 w-3.5" />
                      {option.label}
                    </span>
                    <span className="text-xs text-white/60 mt-1 block">{option.note}</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold block">{option.label}</span>
                    <span className="text-xs text-muted mt-1 block">{option.note}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Where are you starting from?</p>
          <div className="grid grid-cols-3 gap-3">
            {originOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setOrigin(option.value)}
                className={origin === option.value
                  ? "rounded-lg border-2 border-ink bg-ink text-white p-4 text-left transition-all duration-150"
                  : "rounded-lg border border-hairline bg-canvas text-ink p-4 text-left hover:border-ink transition-all duration-150"}
              >
                {origin === option.value ? (
                  <>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Check className="h-3.5 w-3.5" />
                      {option.label}
                    </span>
                    <span className="text-xs text-white/60 mt-1 block">{option.note}</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold block">{option.label}</span>
                    <span className="text-xs text-muted mt-1 block">{option.note}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-hairline pt-5 flex items-center justify-between gap-4">
          <p className="text-sm text-muted max-w-xs">Answer three questions and get ranked recommendations.</p>
          <button type="submit" className="btn-primary">Find my trip →</button>
        </div>
      </div>
    </form>
  );
}
