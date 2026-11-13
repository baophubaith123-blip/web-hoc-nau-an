import { vi } from "@/lib/i18n/vi";

export const SO_MUC_MOI_TRANG = 12;
export const SO_DONG_MOI_TRANG_BANG = 20;

export const NHAN = vi.nhan as {
  [loai: string]: Record<string, string>;
};

export const nhanCua = (loai: keyof typeof vi.nhan, giaTri: string | null | undefined) =>
  giaTri ? ((vi.nhan[loai] as Record<string, string>)[giaTri] ?? giaTri) : "";

// Màu badge theo tông
export const MAU_BADGE = {
  xam: "bg-muted text-muted-foreground",
  xanh_la: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  vang: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  do: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  xanh_duong: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  tim: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  cam: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
} as const;
type Tong = keyof typeof MAU_BADGE;

export const TONG_TRANG_THAI: Record<string, Tong> = {
  // công thức, khóa học, bài viết
  nhap: "xam", cho_duyet: "vang", xuat_ban: "xanh_la", luu_tru: "xam", tu_choi: "do",
  // ticket
  moi: "xanh_duong", dang_xu_ly: "vang", cho_phan_hoi: "cam", da_giai_quyet: "xanh_la", dong: "xam",
  // thanh toán
  cho_xu_ly: "vang", thanh_cong: "xanh_la", that_bai: "do", hoan_tien: "xanh_duong",
  // người dùng, báo cáo
  hoat_dong: "xanh_la", khoa: "do", da_xu_ly: "xanh_la", bo_qua: "xam",
};

export const TONG_UU_TIEN: Record<string, Tong> = {
  thap: "xam", trung_binh: "xanh_duong", cao: "cam", khan_cap: "do",
};

export const TONG_VAI_TRO: Record<string, Tong> = {
  // Admin = do (quyen luc), Dau bep = cam (lua bep), Ho tro = xanh duong (tin cay).
  // Khong dung tim/violet cho nhan dien vai tro.
  user: "xam", chef: "cam", support: "xanh_duong", admin: "do",
};