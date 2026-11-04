import { NextResponse, type NextRequest } from "next/server";
import { capNhatPhien } from "@/lib/supabase/middleware";
import { trangChuTheoVaiTro } from "@/lib/utils/vai-tro";
import type { VaiTro } from "@/types";

// Trang CHI TIẾT: guest bấm vào sẽ bị chuyển sang /dang-nhap
const CHI_TIET_CAN_DANG_NHAP = [
  /^\/cong-thuc\/[^/]+/,
  /^\/khoa-hoc\/[^/]+/,
  /^\/dau-bep\/[^/]+/,
  /^\/bai-viet\/[^/]+/,
];

// Khu vực của người dùng (cần đăng nhập)
const KHU_NGUOI_DUNG = [
  "/bang-dieu-khien", "/cong-thuc-cua-toi", "/khoa-hoc-cua-toi", "/hoc-bai",
  "/tao-cong-thuc", "/cong-thuc-da-gui", "/ho-so", "/thong-bao", "/ho-tro", "/thanh-toan",
  "/nang-cap-pro", "/goi-cua-toi",
];

// Khu vực theo vai trò
const KHU_THEO_VAI_TRO: { tien_to: string; vai_tro: VaiTro[] }[] = [
  { tien_to: "/quan-tri", vai_tro: ["admin"] },
  { tien_to: "/nhan-vien", vai_tro: ["support", "admin"] },
  { tien_to: "/bep", vai_tro: ["chef", "admin"] },
];

const TRANG_XAC_THUC = ["/dang-nhap", "/dang-ky", "/quen-mat-khau"];

const khopTienTo = (duongDan: string, tienTo: string) =>
  duongDan === tienTo || duongDan.startsWith(tienTo + "/");

// Chỉ cho phép quay lại đường dẫn nội bộ (chống open redirect)
const laDuongDanNoiBo = (p: string | null): p is string =>
  !!p && p.startsWith("/") && !p.startsWith("//") && !p.includes("\\");

export async function middleware(request: NextRequest) {
  const phien = await capNhatPhien(request);
  const { pathname, search } = request.nextUrl;

  // API route tự kiểm tra quyền; middleware chỉ làm mới phiên
  if (pathname.startsWith("/api/")) return phien.response;

  const chuyenHuong = (duongDan: string) => {
    const res = NextResponse.redirect(new URL(duongDan, request.url));
    phien.response.cookies.getAll().forEach((c) => res.cookies.set(c)); // giữ cookie phiên mới
    return res;
  };
  const dichDangNhap = `/dang-nhap?quay-lai=${encodeURIComponent(pathname + search)}`;

  const laChiTiet = CHI_TIET_CAN_DANG_NHAP.some((re) => re.test(pathname));
  const khuVaiTro = KHU_THEO_VAI_TRO.find((k) => khopTienTo(pathname, k.tien_to));
  const laKhuNguoiDung = KHU_NGUOI_DUNG.some((p) => khopTienTo(pathname, p));
  const laTrangXacThuc = TRANG_XAC_THUC.includes(pathname);

  // 1. Guest
  if (!phien.user) {
    if (laChiTiet || khuVaiTro || laKhuNguoiDung) return chuyenHuong(dichDangNhap);
    return phien.response;
  }

  // 2. Đã đăng nhập: chỉ truy vấn profile khi cần (tiết kiệm 1 query ở trang công khai)
  if (!laTrangXacThuc && !khuVaiTro && !laKhuNguoiDung) return phien.response;

  const { data: profile } = await phien.supabase
    .from("profiles")
    .select("vai_tro, trang_thai, la_pro, goi_het_han")
    .eq("id", phien.user.id)
    .single();

  if (!profile || profile.trang_thai !== "hoat_dong") {
    await phien.supabase.auth.signOut();
    return chuyenHuong("/dang-nhap?loi=tai-khoan-bi-khoa");
  }

  const vaiTro = profile.vai_tro as VaiTro;

  // Đã đăng nhập mà vào /dang-nhap, /dang-ky → về trang chủ của vai trò
  if (laTrangXacThuc) {
    const quayLai = request.nextUrl.searchParams.get("quay-lai");
    return chuyenHuong(laDuongDanNoiBo(quayLai) ? quayLai : trangChuTheoVaiTro(vaiTro));
  }

  // Sai vai trò → về trang chủ của vai trò đó
  if (khuVaiTro && !khuVaiTro.vai_tro.includes(vaiTro)) {
    return chuyenHuong(trangChuTheoVaiTro(vaiTro));
  }

  // Kiểm tra quyền tạo công thức: chỉ Pro user, Chef hoặc Admin
  if (khopTienTo(pathname, "/tao-cong-thuc")) {
    const laDauBepHoacAdmin = vaiTro === "chef" || vaiTro === "admin";
    const laProHopLe = profile.la_pro && profile.goi_het_han && new Date(profile.goi_het_han) > new Date();
    if (!laDauBepHoacAdmin && !laProHopLe) {
      return chuyenHuong("/nang-cap-pro?ly_do=tao_cong_thuc");
    }
  }

  return phien.response;
}

export const config = {
  matcher: [
    // Bỏ qua file tĩnh và ảnh
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};