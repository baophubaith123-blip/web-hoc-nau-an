import { vi } from "@/lib/i18n/vi";
import type { VaiTro } from "@/types";

export const coQuyen = (vaiTro: VaiTro | null | undefined, cho: VaiTro[]) =>
  !!vaiTro && cho.includes(vaiTro);

// Trang chủ sau đăng nhập theo vai trò
export function trangChuTheoVaiTro(vaiTro: VaiTro): string {
  switch (vaiTro) {
    case "admin": return "/quan-tri";
    case "support": return "/nhan-vien";
    case "chef": return "/bep";
    default: return "/bang-dieu-khien";
  }
}

// Tên gọi + đường dẫn khu vực làm việc riêng của từng vai trò staff (null với học viên thường).
// Dùng cho nhãn "quay về khu vực" ở menu tài khoản và sidebar khu vực thành viên.
export function thongTinKhuVaiTro(vaiTro: VaiTro): { nhan: string; href: string } | null {
  switch (vaiTro) {
    case "admin": return { nhan: "Trang quản trị", href: "/quan-tri" };
    case "support": return { nhan: "Trang hỗ trợ", href: "/nhan-vien" };
    case "chef": return { nhan: "Trang đầu bếp", href: "/bep" };
    default: return null;
  }
}

export type MucMenu = { nhan: string; href: string; icon: string; khoa?: boolean };

// Mau nhan RIENG cho tung khu vuc staff — giup nhin la biet dang o khu nao,
// khong khu nao giong khu nao va khong dung tim/violet:
//  Admin = do, Dau bep = cam, Ho tro = xanh duong. Hoc vien giu mau mac dinh.
export const MAU_NHAN_VAI_TRO: Record<
  string,
  { chip: string; mucDangChon: string }
> = {
  admin: {
    chip: "bg-red-500/10 text-red-600 dark:text-red-400",
    mucDangChon: "bg-red-600 text-white shadow-sm",
  },
  chef: {
    chip: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    mucDangChon: "bg-orange-600 text-white shadow-sm",
  },
  support: {
    chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    mucDangChon: "bg-blue-600 text-white shadow-sm",
  },
};

export const mauNhanVaiTro = (vaiTro: string | null | undefined) =>
  vaiTro ? MAU_NHAN_VAI_TRO[vaiTro] : undefined;

const m = vi.menu;

// Menu sidebar theo khu vực (icon là tên icon lucide-react)
export const MENU_NGUOI_DUNG: MucMenu[] = [
  { nhan: m.bang_dieu_khien, href: "/bang-dieu-khien", icon: "LayoutDashboard" },
  { nhan: "Gói Pro của tôi", href: "/goi-cua-toi", icon: "Crown" },
  { nhan: m.cong_thuc_da_luu, href: "/cong-thuc-cua-toi", icon: "Bookmark" },
  { nhan: m.khoa_hoc_cua_toi, href: "/khoa-hoc-cua-toi", icon: "GraduationCap" },
  { nhan: m.tao_cong_thuc, href: "/tao-cong-thuc", icon: "PlusCircle" },
  { nhan: m.cong_thuc_da_gui, href: "/cong-thuc-da-gui", icon: "Send" },
  { nhan: "Viết bài viết", href: "/tao-bai-viet", icon: "PenLine" },
  { nhan: "Bài viết của tôi", href: "/bai-viet-cua-toi", icon: "Newspaper" },
  { nhan: m.thong_bao, href: "/thong-bao", icon: "Bell" },
  { nhan: m.ho_tro, href: "/ho-tro", icon: "LifeBuoy" },
  { nhan: m.ho_so, href: "/ho-so", icon: "User" },
];

export const MENU_DAU_BEP: MucMenu[] = [
  { nhan: m.tong_quan, href: "/bep", icon: "LayoutDashboard" },
  { nhan: m.quan_ly_cong_thuc, href: "/bep/cong-thuc", icon: "ChefHat" },
  { nhan: m.quan_ly_khoa_hoc, href: "/bep/khoa-hoc", icon: "GraduationCap" },
];

export const MENU_QUAN_TRI: MucMenu[] = [
  { nhan: m.tong_quan, href: "/quan-tri", icon: "LayoutDashboard" },
  { nhan: "Duyệt nâng cấp Pro", href: "/quan-tri/duyet-nang-cap", icon: "ShieldCheck" },
  { nhan: "Quản lý gói Pro", href: "/quan-tri/quan-ly-goi", icon: "Crown" },
  { nhan: m.nguoi_dung, href: "/quan-tri/nguoi-dung", icon: "Users" },
  { nhan: m.quan_ly_dau_bep, href: "/quan-tri/dau-bep", icon: "ChefHat" },
  { nhan: m.quan_ly_cong_thuc, href: "/quan-tri/cong-thuc", icon: "BookOpen" },
  { nhan: m.quan_ly_khoa_hoc, href: "/quan-tri/khoa-hoc", icon: "GraduationCap" },
  { nhan: m.danh_muc, href: "/quan-tri/danh-muc", icon: "FolderTree" },
  { nhan: m.binh_luan, href: "/quan-tri/binh-luan", icon: "MessageSquare" },
  { nhan: m.danh_gia, href: "/quan-tri/danh-gia", icon: "Star" },
  { nhan: m.quan_ly_bai_viet, href: "/quan-tri/bai-viet", icon: "Newspaper" },
  { nhan: m.ho_tro, href: "/quan-tri/ho-tro", icon: "LifeBuoy" },
  { nhan: m.gui_thong_bao, href: "/quan-tri/thong-bao", icon: "Megaphone" },
  { nhan: m.thanh_toan, href: "/quan-tri/thanh-toan", icon: "CreditCard" },
  { nhan: m.bao_cao, href: "/quan-tri/bao-cao", icon: "BarChart3" },
  { nhan: m.nhat_ky, href: "/quan-tri/nhat-ky", icon: "ScrollText" },
  { nhan: m.cau_hinh, href: "/quan-tri/cau-hinh", icon: "Settings" },
];

export const MENU_HO_TRO: MucMenu[] = [
  { nhan: m.tong_quan, href: "/nhan-vien", icon: "LayoutDashboard" },
  { nhan: m.quan_ly_ticket, href: "/nhan-vien/ticket", icon: "Inbox" },
];