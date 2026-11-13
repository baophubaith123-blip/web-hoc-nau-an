"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, TrendingUp } from "lucide-react";

export interface AnhHero {
  anh: string;
  tieu_de: string;
  slug: string;
}

interface HeroTrangChuProps {
  slides: AnhHero[];
  children: ReactNode;
}

/** Hero trang chủ: trình chiếu ảnh món ăn (hiệu ứng Ken Burns) + thẻ nổi. */
export function HeroTrangChu({ slides, children }: HeroTrangChuProps) {
  const [dangChieu, setDangChieu] = useState(0);
  // Đợt 6 — tối ưu tốc độ: đo nền cho thấy cả 4 ảnh hero full-width
  // (~238KB) tải ngay khi mở trang dù 3 slide đang ẩn. Chỉ tải ảnh của
  // slide đã/sắp hiển thị: slide đầu tải ngay, slide kế được nạp trước
  // 4 giây khi sắp tới lượt, các slide còn lại tải khi tới lượt chiếu.
  const [daTai, setDaTai] = useState<ReadonlySet<number>>(() => new Set([0]));
  const tamDung = useRef(false);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      if (!tamDung.current) {
        setDangChieu((i) => (i + 1) % slides.length);
      }
    }, 5500);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    setDaTai((cu) => (cu.has(dangChieu) ? cu : new Set(cu).add(dangChieu)));
    if (slides.length < 2) return;
    const id = setTimeout(() => {
      const ke = (dangChieu + 1) % slides.length;
      setDaTai((cu) => (cu.has(ke) ? cu : new Set(cu).add(ke)));
    }, 4000);
    return () => clearTimeout(id);
  }, [dangChieu, slides.length]);

  const slideHienTai = slides[dangChieu];

  return (
    <section
      className="relative flex min-h-[460px] overflow-hidden rounded-3xl border shadow-xl md:min-h-[520px]"
      onMouseEnter={() => (tamDung.current = true)}
      onMouseLeave={() => (tamDung.current = false)}
    >
      {/* Lớp ảnh nền trình chiếu */}
      <div className="absolute inset-0 bg-neutral-900">
        {slides.map((s, i) => (
          <div
            key={s.slug}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === dangChieu ? "opacity-100" : "opacity-0"
            }`}
          >
            {daTai.has(i) && (
              <Image
                src={s.anh}
                alt={s.tieu_de}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover ${i === dangChieu ? "animate-kenburns" : ""}`}
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
      </div>

      {/* Nội dung chữ */}
      <div className="relative z-10 flex w-full items-center p-8 md:p-14">
        {children}
      </div>

      {/* Thẻ nổi: món đang thịnh hành */}
      {slideHienTai && (
        <Link
          href={`/cong-thuc/${slideHienTai.slug}`}
          className="animate-float absolute right-8 top-8 z-20 hidden max-w-[240px] rounded-2xl border border-white/25 bg-white/10 p-4 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20 lg:block"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <TrendingUp className="h-3.5 w-3.5" />
            Đang thịnh hành
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug">
            {slideHienTai.tieu_de}
          </p>
          <p className="mt-1 text-xs text-white/75">Xem công thức chi tiết →</p>
        </Link>
      )}

      {/* Thẻ nổi: chứng chỉ */}
      <div className="animate-float-delay absolute bottom-20 right-8 z-20 hidden items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white shadow-lg backdrop-blur-md lg:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/90">
          <Award className="h-5 w-5" />
        </span>
        <div className="text-xs leading-tight">
          <p className="text-sm font-semibold">Chứng chỉ hoàn thành</p>
          <p className="text-white/75">Nhận ngay sau mỗi khóa học</p>
        </div>
      </div>

      {/* Chấm điều hướng trình chiếu */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-8 z-20 flex gap-2 md:left-14">
          {slides.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              aria-label={`Xem ảnh món ${s.tieu_de}`}
              onClick={() => setDangChieu(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === dangChieu ? "w-8 bg-white" : "w-2 bg-white/45 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
