import type { Database } from "./database";

export type { Database };

// Lấy kiểu 1 dòng của bảng: Bang<"cong_thuc">
export type Bang<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type BangThem<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type VaiTro = "user" | "chef" | "support" | "admin";

// Cột JSONB: các kiểu dữ liệu cụ thể (ép kiểu khi đọc từ DB)
export type NguyenLieu = { ten: string; so_luong: number; don_vi: string };
export type BuocNau = { thu_tu: number; noi_dung: string; anh?: string };
export type TepDinhKem = { ten: string; url: string };
export type TaiLieu = { ten: string; url: string };
export type BaiTap = { cau_hoi: string; lua_chon: string[]; dap_an_dung: number; diem: number };

export type TrangThaiCongThuc = "nhap" | "cho_duyet" | "xuat_ban" | "luu_tru" | "tu_choi";
export type TrangThaiTicket = "moi" | "dang_xu_ly" | "cho_phan_hoi" | "da_giai_quyet" | "dong";
export type DoUuTien = "thap" | "trung_binh" | "cao" | "khan_cap";

// Gói Pro Premium
export type MaGoi = "pro_thang" | "pro_nam";
export type TrangThaiGoi = "hoat_dong" | "het_han" | "huy";
export type TrangThaiYeuCauNangCap = "cho_duyet" | "da_duyet" | "tu_choi" | "da_huy";

// Tham số trang danh sách (đọc từ URL)
export type ThamSoTrang = Promise<{ [khoa: string]: string | string[] | undefined }>;