import { Skeleton } from "@/components/ui/skeleton";

/** Khung xương tải trang cho khu vực công khai (danh sách thẻ). */
export default function DangTaiCongKhai() {
  return (
    <div className="space-y-8 pb-16">
      <Skeleton className="h-36 w-full rounded-3xl md:h-44" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-4/3 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
