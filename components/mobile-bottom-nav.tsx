"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles } from "lucide-react";
import clsx from "clsx";

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-canvas/96 backdrop-blur-xl border-t border-hairline">
        <div className="grid grid-cols-3 h-[60px]">
          <Link
            href="/"
            className={clsx(
              "grid place-items-center gap-1 h-full text-[11px]",
              pathname === "/" ? "font-semibold text-ink" : "font-medium text-muted"
            )}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

          <div className="grid place-items-center relative">
            <Link
              href="/plan"
              className="absolute -top-5 grid place-items-center h-12 w-12 rounded-full bg-ink text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
            >
              <Sparkles className="h-5 w-5" />
            </Link>
            <span className="absolute bottom-2 text-[10px] font-semibold text-ink">Plan</span>
          </div>

          <Link
            href="/discover"
            className={clsx(
              "grid place-items-center gap-1 h-full text-[11px]",
              pathname.startsWith("/discover") ? "font-semibold text-ink" : "font-medium text-muted"
            )}
          >
            <Compass className="h-5 w-5" />
            Discover
          </Link>
        </div>
      </div>
    </nav>
  );
}
