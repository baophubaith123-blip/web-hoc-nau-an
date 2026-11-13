import { vi } from "@/lib/i18n/vi";

// Menu chính (header, mobile, footer dùng chung)
export const LIEN_KET_CHINH = [
  { nhan: vi.menu.cong_thuc, href: "/cong-thuc" },
  { nhan: vi.menu.khoa_hoc, href: "/khoa-hoc" },
  { nhan: "Bảng giá Pro", href: "/bang-gia" },
  { nhan: vi.menu.dau_bep, href: "/dau-bep" },
  { nhan: vi.menu.bai_viet, href: "/bai-viet" },
  { nhan: vi.menu.gioi_thieu, href: "/gioi-thieu" },
  { nhan: vi.menu.lien_he, href: "/lien-he" },
];

export const LIEN_KET_PHU = [
  { nhan: vi.menu.tro_giup, href: "/tro-giup" },
  { nhan: vi.menu.tra_cuu_chung_chi, href: "/tra-cuu-chung-chi" },
];