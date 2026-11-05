"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface HienDanProps {
  children: ReactNode;
  className?: string;
  /** Độ trễ hiệu ứng (ms) để các khối xuất hiện so le nhau */
  tre?: number;
}

/** Bọc nội dung để hiện dần (fade + trượt lên) khi cuộn tới vị trí hiển thị. */
export function HienDan({ children, className = "", tre = 0 }: HienDanProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={tre ? { transitionDelay: `${tre}ms` } : undefined}
    >
      {children}
    </div>
  );
}
