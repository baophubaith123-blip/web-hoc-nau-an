"use server";

// Server wiring cho Cokba (Đợt 3): một lượt hỏi -> nạp dữ liệu ->
// traLoi() của bộ não (Đợt 2) -> ghi nhật ký câu chưa trả lời được
// + lưu trí nhớ phiên cho tài khoản đăng nhập.
//
// NGUYÊN TẮC SỐNG CÒN: hai bảng của migration 008 có thể CHƯA tồn
// tại (Bảo chưa dán SQL) — mọi thao tác đọc/ghi với chúng đều bọc
// try/catch và nuốt lỗi lặng lẽ: mất một dòng nhật ký hoặc rơi về
// localStorage, TUYỆT ĐỐI không làm sập luồng hỏi-đáp.

import { revalidatePath } from "next/cache";
import { canPhien } from "@/lib/actions/chung";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { layPhienHienTai, taoSupabaseServer } from "@/lib/supabase/server";
import { khoaChuanHoa } from "@/lib/tro-ly/chuan-hoa";
import {
  taoSlotTrong,
  type CauTraLoi,
  type SlotTriNho,
} from "@/lib/tro-ly/kieu-du-lieu";
import { taiDuLieuTroLy } from "@/lib/tro-ly/tai-du-lieu";
import { traLoi } from "@/lib/tro-ly/tra-loi";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import type { Json } from "@/types/database";

// ---------------------------------------------------------------------------
// Làm sạch slot do client gửi lên: chỉ giữ đúng các trường đã biết,
// đúng kiểu — client không thể nhồi dữ liệu lạ vào trí nhớ/nhật ký.
// ---------------------------------------------------------------------------

function lamSachSlot(tho: unknown): SlotTriNho {
  const goc = taoSlotTrong();
  if (!tho || typeof tho !== "object") return goc;
  const s = tho as Partial<SlotTriNho>;
  const chuoiHoacNull = (v: unknown): string | null =>
    typeof v === "string" && v.length <= 200 ? v : null;
  const mangChuoi = (v: unknown): string[] =>
    Array.isArray(v)
      ? v.filter((x): x is string => typeof x === "string").map((x) => x.slice(0, 100)).slice(0, 60)
      : [];
  return {
    monDangBan: chuoiHoacNull(s.monDangBan),
    soNguoiAn:
      typeof s.soNguoiAn === "number" && Number.isFinite(s.soNguoiAn) && s.soNguoiAn > 0
        ? Math.min(200, Math.floor(s.soNguoiAn))
        : null,
    nguyenLieuDangCo: mangChuoi(s.nguyenLieuDangCo),
    giaViDaXacNhan:
      s.giaViDaXacNhan === null || s.giaViDaXacNhan === undefined
        ? null
        : mangChuoi(s.giaViDaXacNhan),
    khoaDangBan: chuoiHoacNull(s.khoaDangBan),
    dauBepDangBan: chuoiHoacNull(s.dauBepDangBan),
    baiVietDangBan: chuoiHoacNull(s.baiVietDangBan),
    monDangNau: chuoiHoacNull(s.monDangNau),
    buocHienTai:
      typeof s.buocHienTai === "number" && Number.isFinite(s.buocHienTai)
        ? Math.floor(s.buocHienTai)
        : null,
    danhSachVuaXem: mangChuoi(s.danhSachVuaXem),
    nguyenLieuTruyVanGanNhat: mangChuoi(s.nguyenLieuTruyVanGanNhat),
    choSoNguoiAnChoMon: chuoiHoacNull(s.choSoNguoiAnChoMon),
  };
}

// ---------------------------------------------------------------------------
// Nhật ký câu hỏi chưa trả lời được — ghi qua admin client,
// upsert thủ công theo cau_hoi_chuan_hoa. Mọi lỗi đều bị nuốt.
// ---------------------------------------------------------------------------

async function ghiNhatKyCauHoiChuaTraLoi(
  cauHoi: string,
  nguoiDungId: string | null
): Promise<void> {
  try {
    const chuanHoa = khoaChuanHoa(cauHoi).slice(0, 300);
    if (!chuanHoa) return;
    const admin = taoSupabaseAdmin();
    const { data: cu, error: loiDoc } = await admin
      .from("cau_hoi_chua_tra_loi")
      .select("id, so_lan")
      .eq("cau_hoi_chuan_hoa", chuanHoa)
      .maybeSingle();
    if (loiDoc) return; // bảng chưa tồn tại (chưa chạy migration 008) -> bỏ qua
    if (cu) {
      await admin
        .from("cau_hoi_chua_tra_loi")
        .update({ so_lan: cu.so_lan + 1, lan_hoi_gan_nhat: new Date().toISOString() })
        .eq("id", cu.id);
    } else {
      await admin.from("cau_hoi_chua_tra_loi").insert({
        cau_hoi: cauHoi.slice(0, 500),
        cau_hoi_chuan_hoa: chuanHoa,
        nguoi_dung_id: nguoiDungId,
        lan_hoi_gan_nhat: new Date().toISOString(),
      });
    }
  } catch {
    // Nhật ký là phụ trợ — không bao giờ làm hỏng lượt hỏi.
  }
}

// ---------------------------------------------------------------------------
// Trí nhớ server (bảng tro_ly_tri_nho) — dùng session client để RLS
// tự chặn đúng chủ nhân. Bảng chưa có -> trả null / bỏ qua lặng lẽ.
// ---------------------------------------------------------------------------

export async function docTriNhoCokba(): Promise<SlotTriNho | null> {
  try {
    const phien = await layPhienHienTai();
    if (!phien) return null;
    const supabase = await taoSupabaseServer();
    const { data, error } = await supabase
      .from("tro_ly_tri_nho")
      .select("cac_slot")
      .eq("nguoi_dung_id", phien.user.id)
      .maybeSingle();
    if (error || !data) return null;
    return lamSachSlot(data.cac_slot);
  } catch {
    return null;
  }
}

export async function ghiTriNhoCokba(slotTho: SlotTriNho): Promise<void> {
  try {
    const phien = await layPhienHienTai();
    if (!phien) return;
    const supabase = await taoSupabaseServer();
    await supabase.from("tro_ly_tri_nho").upsert(
      {
        nguoi_dung_id: phien.user.id,
        cac_slot: lamSachSlot(slotTho) as unknown as Json,
        cap_nhat_luc: new Date().toISOString(),
      },
      { onConflict: "nguoi_dung_id" }
    );
  } catch {
    // Chưa chạy migration 008 -> trí nhớ phía client (localStorage) vẫn chạy.
  }
}

// ---------------------------------------------------------------------------
// Một lượt hỏi Cokba
// ---------------------------------------------------------------------------

export type KetQuaHoiCokba =
  | { ok: true; traLoi: CauTraLoi }
  | { ok: false; loi: string };

export async function hoiCokba(dauVao: {
  cauHoi: string;
  slot: SlotTriNho;
}): Promise<KetQuaHoiCokba> {
  const cauHoi = typeof dauVao?.cauHoi === "string" ? dauVao.cauHoi.trim() : "";
  if (!cauHoi || cauHoi.length > 500) {
    return { ok: false, loi: "Bạn gõ giúp Cokba một câu hỏi ngắn gọn nhé." };
  }
  try {
    const slot = lamSachSlot(dauVao?.slot);
    const phien = await layPhienHienTai().catch(() => null);
    const duLieu = await taiDuLieuTroLy();
    const ketQua = traLoi(cauHoi, duLieu, slot);
    if (ketQua.khongTraLoiDuoc === true || ketQua.ngoaiPhamVi === true) {
      await ghiNhatKyCauHoiChuaTraLoi(cauHoi, phien?.user.id ?? null);
    }
    if (phien) {
      // Lưu trí nhớ mới nhất cho tài khoản (bọc lỗi bên trong hàm).
      await ghiTriNhoCokba(ketQua.slotDaCapNhat);
    }
    return { ok: true, traLoi: ketQua };
  } catch (e) {
    console.error("[Cokba] Lỗi xử lý lượt hỏi:", e);
    return {
      ok: false,
      loi: "Cokba đang bận một chút, bạn thử hỏi lại sau ít giây nhé.",
    };
  }
}

// ---------------------------------------------------------------------------
// Quản trị: đổi trạng thái một dòng nhật ký Cokba
// ---------------------------------------------------------------------------

const TRANG_THAI_NHAT_KY = ["cho_xu_ly", "da_xu_ly", "bo_qua"] as const;

export async function doiTrangThaiCauHoiCokba(
  id: unknown,
  trangThai: unknown
): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    if (typeof id !== "string" || !id) return thatBai("Dòng nhật ký không hợp lệ.");
    if (
      typeof trangThai !== "string" ||
      !(TRANG_THAI_NHAT_KY as readonly string[]).includes(trangThai)
    ) {
      return thatBai("Trạng thái không hợp lệ.");
    }
    const admin = taoSupabaseAdmin();
    const { error } = await admin
      .from("cau_hoi_chua_tra_loi")
      .update({ trang_thai: trangThai })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/quan-tri/nhat-ky-cokba");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}
