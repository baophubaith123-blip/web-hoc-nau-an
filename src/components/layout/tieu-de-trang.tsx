import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface TieuDeTrangProps {
  icon: LucideIcon;
  tieuDe: string;
  moTa: string;
  children?: ReactNode;
}

/** Dải tiêu đề trang dạng banner gradient dùng cho các trang danh sách công khai. */
export function TieuDeTrang({ icon: Icon, tieuDe, moTa, children }: TieuDeTrangProps) {
  return (
    <div className="animate-gradient relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-orange-600 to-amber-500 px-6 py-8 text-primary-foreground shadow-md md:px-10 md:py-10">
      <div
        aria-hidden
        className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10"
      />
      <div
        aria-hidden
        className="absolute -bottom-16 right-32 h-40 w-40 rounded-full bg-black/10"
      />
      <div className="relative flex items-start gap-4">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-sm sm:flex">
          <Icon className="h-6 w-6" />
        </span>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{tieuDe}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-primary-foreground/85">
            {moTa}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
