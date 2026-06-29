"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdventaLogo } from "@/components/logo";

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <AdventaLogo size={30} />
          <div>
            <span className="text-sm font-semibold text-ink tracking-tight">Adventa</span>
            <span className="block text-[10px] text-muted font-medium tracking-wide">Weekend Escapes</span>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/discover", label: "Discover" },
            { href: "/plan", label: "Plan" },
            { href: "/operator/login", label: "Operators" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={"px-3 py-2 rounded-md text-sm font-medium transition-colors " +
                (pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-surface-strong text-ink"
                  : "text-muted hover:text-ink hover:bg-surface-card")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/discover" className="text-sm font-medium text-muted hover:text-ink transition-colors">
            Browse trips
          </Link>
          <Link href="/plan" className="btn-primary text-sm">
            Plan weekend
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/plan" className="btn-primary text-sm h-9 px-4">
            Plan
          </Link>
        </div>
      </div>
    </header>
  );
}
