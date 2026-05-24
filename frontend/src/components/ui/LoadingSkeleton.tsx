export default function LoadingSkeleton({ count = 3, type = "card" }: { count?: number; type?: "card" | "row" | "text" }) {
  if (type === "row") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-white/5 rounded-xl">
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="h-4 bg-white/10 rounded w-1/6" />
            <div className="h-4 bg-white/10 rounded w-1/6" />
            <div className="h-4 bg-white/10 rounded w-1/6" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-2/3" />
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-5/6" />
        <div className="h-4 bg-white/10 rounded w-4/6" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
          <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-white/10 rounded-full w-16" />
            <div className="h-6 bg-white/10 rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
