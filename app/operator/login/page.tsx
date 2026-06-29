import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mountain } from "lucide-react";
import { DEMO_OPERATOR_ID, OPERATOR_COOKIE, signOperatorSession } from "@/lib/operator-auth";

async function signIn() {
  "use server";
  (await cookies()).set(OPERATOR_COOKIE, signOperatorSession(DEMO_OPERATOR_ID), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  redirect("/operator/dashboard");
}

export default function OperatorLoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: dark feature-card-teal panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 feature-card feature-card-teal min-h-screen">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10 text-white">
            <Mountain className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-white">Maharashtra Adventures</span>
        </div>

        <div className="mt-auto mb-auto">
          <p className="section-label text-white/40 mb-4">Operator Portal</p>
          <h1 className="display-md text-white max-w-xs">Power your adventure business.</h1>
          <p className="text-white/65 mt-4 text-base leading-relaxed max-w-sm">
            Manage bookings, track demand signals, and reach thousands of weekend-ready users.
          </p>
          <div className="flex gap-6 mt-10 text-sm text-white/50">
            <span>20+ operators</span>
            <span>·</span>
            <span>₹1.2Cr+ booked</span>
            <span>·</span>
            <span>4.8 avg rating</span>
          </div>
        </div>

        <p className="text-xs text-white/30">Demo mode — any credentials work</p>
      </div>

      {/* Right: cream login form */}
      <div className="flex items-center justify-center p-8 bg-canvas">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-white">
              <Mountain className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-ink">Operator Portal</span>
          </div>

          <h2 className="display-sm text-ink">Sign in</h2>
          <p className="text-body text-sm mt-2">Enter any credentials to explore the demo dashboard.</p>

          <form action={signIn} className="space-y-5 mt-8">
            <label className="block">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Email</p>
              <input
                type="email"
                name="email"
                required
                defaultValue="demo@adventa.in"
                className="w-full h-11 rounded-md border border-hairline bg-canvas px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
              />
            </label>
            <label className="block">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Password</p>
              <input
                type="password"
                name="password"
                required
                defaultValue="demo1234"
                className="w-full h-11 rounded-md border border-hairline bg-canvas px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
              />
            </label>

            <button type="submit" className="btn-primary w-full justify-center h-11">
              Sign in to dashboard →
            </button>
          </form>

          <p className="text-xs text-muted text-center mt-3">Demo mode — any credentials work</p>
          <Link href="/" className="flex justify-center mt-5 text-sm text-muted hover:text-ink transition-colors">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
