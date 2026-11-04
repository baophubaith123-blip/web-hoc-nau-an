import { Skeleton } from "@/components/ui/skeleton";

export default function DangTai() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-6 p-6">
      <Skeleton className="h-10 w-1/3" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}