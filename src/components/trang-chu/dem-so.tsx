"use client";

import { useEffect, useRef, useState } from "react";

interface DemSoProps {
  giaTri: number;
  hauTo?: string;
  className?: string;
}

/** Số đếm tăng dần từ 0 khi cuộn tới (tôn trọng prefers-reduced-motion). */
export function DemSo({ giaTri, hauTo = "", className = "" }: DemSoProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hienTai, setHienTai] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHienTai(giaTri);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const batDau = performance.now();
        const thoiLuong = 1300;
        const chay = (now: number) => {
          const t = Math.min((now - batDau) / thoiLuong, 1);
          const easing = 1 - Math.pow(1 - t, 3);
          setHienTai(Math.round(easing * giaTri));
          if (t < 1) raf = requestAnimationFrame(chay);
        };
        raf = requestAnimationFrame(chay);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [giaTri]);

  return (
    <span ref={ref} className={className}>
      {hienTai.toLocaleString("vi-VN")}
      {hauTo}
    </span>
  );
}
