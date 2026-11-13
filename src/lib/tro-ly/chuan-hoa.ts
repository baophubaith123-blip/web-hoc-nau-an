// Chuẩn hóa chuỗi tiếng Việt để KHỚP dữ liệu (Đợt 2 — bộ não Cokba).
//
// Hai tầng chuẩn hóa:
//  1) chuanHoa(): viết thường + gộp khoảng trắng — giữ nguyên dấu, dùng cho
//     hiển thị/nhận diện mẫu câu khi cần phân biệt dấu.
//  2) khoaChuanHoa(): tầng 1 + BỎ DẤU + bỏ ghi chú trong ngoặc — đây là
//     "khóa thường hóa" dùng làm khóa so khớp ở khắp bộ não (chỉ mục, bí
//     danh, nhận diện thực thể). Khóa phải khớp đúng quy ước đã ghi trong
//     bi-danh-nguyen-lieu.ts (Đợt 1).

import { BI_DANH_NGUYEN_LIEU } from "./bi-danh-nguyen-lieu";

/** Bỏ dấu tiếng Việt: "Cà chua" -> "ca chua" (sau khi đã viết thường). */
export function boDauTiengViet(chuoi: string): string {
  return chuoi
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/** Viết thường, gộp khoảng trắng thừa, cắt hai đầu. Giữ nguyên dấu. */
export function chuanHoa(chuoi: string): string {
  return chuoi.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Bỏ phần ghi chú trong ngoặc đơn: "Nước mắm (pha chấm)" -> "Nước mắm". */
export function boGhiChuNgoac(chuoi: string): string {
  return chuoi.replace(/\([^)]*\)/g, " ");
}

/**
 * Khóa thường hóa để so khớp: bỏ ghi chú ngoặc -> viết thường -> bỏ dấu ->
 * gộp khoảng trắng. VD: "Hành Lá (thái nhỏ)" -> "hanh la".
 */
export function khoaChuanHoa(chuoi: string): string {
  return chuanHoa(boDauTiengViet(chuanHoa(boGhiChuNgoac(chuoi))));
}

/**
 * Tên chuẩn của một nguyên liệu: tra bảng bí danh bằng khóa thường hóa;
 * không có bí danh thì trả tên gốc đã bỏ ghi chú ngoặc (giữ nguyên hoa/thường
 * để hiển thị). VD: "hành hoa" -> "Hành lá", "Cà chua" -> "Cà chua".
 */
export function tenChuanNguyenLieu(ten: string): string {
  const khoa = khoaChuanHoa(ten);
  const biDanh = BI_DANH_NGUYEN_LIEU[khoa];
  if (biDanh) return biDanh;
  return boGhiChuNgoac(ten).replace(/\s+/g, " ").trim();
}

/** Khóa so khớp cuối cùng của một nguyên liệu (đã qua bí danh). */
export function khoaNguyenLieu(ten: string): string {
  return khoaChuanHoa(tenChuanNguyenLieu(ten));
}

/**
 * Hai khóa có khớp nhau không: bằng nhau, hoặc một khóa là tiền tố theo từ
 * của khóa kia (VD người dùng gõ "trứng" khớp nguyên liệu "trung ga";
 * "ca chua" khớp "ca chua chin" nếu dữ liệu còn sót dạng chưa chuẩn hóa).
 */
export function khopKhoa(a: string, b: string): boolean {
  if (!a || !b) return false;
  return a === b || a.startsWith(b + " ") || b.startsWith(a + " ");
}

/** Câu hỏi đã chuẩn hóa giữ dấu (để nhận diện mẫu câu có dấu). */
export function chuanHoaCauHoi(cau: string): string {
  return chuanHoa(cau.replace(/[?!.,;:""]/g, " "));
}

/** Câu hỏi dạng khóa thường hóa bỏ dấu (để khớp cả khi gõ không dấu). */
export function khoaCauHoi(cau: string): string {
  return khoaChuanHoa(cau.replace(/[?!.,;:""]/g, " "));
}

/** Tách một chuỗi khóa thường hóa thành mảng từ. */
export function tachTu(khoa: string): string[] {
  return khoa.split(" ").filter(Boolean);
}

/** Câu khóa có chứa cụm khóa (theo biên từ) hay không. */
export function chuaCum(khoaCau: string, cum: string): boolean {
  if (!cum) return false;
  return (" " + khoaCau + " ").includes(" " + cum + " ");
}
