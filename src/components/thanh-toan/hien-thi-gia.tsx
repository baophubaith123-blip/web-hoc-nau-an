interface HienThiGiaProps {
  gia: number;
  mienPhi?: boolean;
  className?: string;
}

export function HienThiGia({ gia, mienPhi = false, className }: HienThiGiaProps) {
  if (mienPhi || gia <= 0) {
    return (
      <span className={`font-bold text-emerald-600 dark:text-emerald-400 ${className || ""}`}>
        Miễn phí
      </span>
    );
  }

  return (
    <span className={`font-bold text-primary ${className || ""}`}>
      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(gia)}
    </span>
  );
}
