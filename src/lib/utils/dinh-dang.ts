import { format, formatDistanceToNow } from "date-fns";
import { vi as viLocale } from "date-fns/locale";

type Ngay = string | Date | null | undefined;

// 499000 → "499.000 ₫"
export function dinhDangTien(so: number | string | null | undefined): string {
  const n = Number(so ?? 0);
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
}

export const dinhDangSo = (so: number | null | undefined) =>
  new Intl.NumberFormat("vi-VN").format(so ?? 0);

export function dinhDangNgay(ngay: Ngay, mau = "dd/MM/yyyy"): string {
  if (!ngay) return "";
  return format(new Date(ngay), mau, { locale: viLocale });
}

export const dinhDangNgayGio = (ngay: Ngay) => dinhDangNgay(ngay, "HH:mm dd/MM/yyyy");

// "3 giờ trước"
export function dinhDangTuongDoi(ngay: Ngay): string {
  if (!ngay) return "";
  return formatDistanceToNow(new Date(ngay), { addSuffix: true, locale: viLocale });
}

// 90 → "1 giờ 30 phút"
export function dinhDangThoiGian(phut: number | null | undefined): string {
  const p = Math.max(0, Math.round(phut ?? 0));
  const gio = Math.floor(p / 60);
  const du = p % 60;
  if (gio === 0) return `${du} phút`;
  return du === 0 ? `${gio} giờ` : `${gio} giờ ${du} phút`;
}

export const rutGon = (chuoi: string | null | undefined, doDai = 120) =>
  !chuoi ? "" : chuoi.length > doDai ? chuoi.slice(0, doDai).trimEnd() + "…" : chuoi;

// Đổi số lượng nguyên liệu khi chọn khẩu phần: 1.5 → "1,5"
export function dinhDangSoLuong(so: number): string {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(so);
}