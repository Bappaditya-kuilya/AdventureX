import { Navbar } from "@/components/navbar";

function SkeletonCard() {
  return (
    <div className="hairline-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-surface-card rounded-t-[14px]" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-surface-card rounded" />
        <div className="h-4 w-3/4 bg-surface-card rounded" />
        <div className="h-3 w-1/2 bg-surface-card rounded" />
        <div className="flex justify-between pt-3 border-t border-hairline">
          <div className="h-5 w-20 bg-surface-card rounded" />
          <div className="h-3 w-12 bg-surface-card rounded" />
        </div>
      </div>
    </div>
  );
}

export default function DiscoverLoading() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-canvas">
        <div className="pt-16 pb-8 bg-canvas border-b border-hairline">
          <div className="shell">
            <div className="h-3 w-20 bg-surface-card rounded animate-pulse" />
            <div className="h-10 w-2/3 bg-surface-card rounded mt-4 animate-pulse" />
            <div className="h-4 w-1/2 bg-surface-card rounded mt-4 animate-pulse" />
          </div>
        </div>
        <div className="py-5 bg-surface-soft border-b border-hairline">
          <div className="shell flex gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-9 w-20 rounded-pill bg-surface-card animate-pulse" />
            ))}
          </div>
        </div>
        <div className="py-10 bg-canvas flex-1">
          <div className="shell">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
