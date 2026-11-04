"use server";

import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy, guiThongBaoNhieuNguoi, layEmailVaTen, rongThanhNull } from "@/lib/actions/chung";
import {
  taoGoiSchema,
  suaGoiSchema,
  capGoiThuCongSchema,
  thuHoiGoiSchema,
} from "@/lib/validations/goi";
import {
  duyetNangCapSchema,
  tuChoiNangCapSchema,
} from "@/lib/validations/yeu-cau-nang-cap";
import { idUuid } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { tinhNgayHetHan, formatGiaVND } from "@/lib/utils/goi";
import { guiEmailChucMungPro } from "@/lib/email/gui-email";
import { t } from "@/lib/i18n/config";
import type { Bang } from "@/types";

// 1. Lấy tất cả các gói dành cho admin
export async function layDanhSachGoiQuanTriAction(): Promise<KetQua<any[]>> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;

    const { data, error } = await p.supabase
      .from("goi_premium")
      .select("*")
      .order("thu_tu", { ascending: true });

    if (error) throw error;
    return thanhCong(data ?? []);
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// 2. Tạo gói Premium mới
export async function taoGoiAction(dauVao: unknown): Promise<KetQua<any>> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = taoGoiSchema.parse(dauVao);

    const { data, error } = await p.supabase
      .from("goi_premium")
      .insert({
        ma_goi: d.ma_goi as "pro_thang" | "pro_nam",
        ten: d.ten,
        mo_ta: rongThanhNull(d.mo_ta),
        thoi_han_ngay: d.thoi_han_ngay,
        gia: d.gia,
        quyen_loi: d.quyen_loi,
        thu_tu: d.thu_tu,
        hoat_dong: d.hoat_dong,
      })
      .select()
      .single();

    if (error) throw error;

    await ghiNhatKy(p.supabase, p.user.id, "tao_goi_premium", "goi_premium", data.id, {
      ten: d.ten,
      ma_goi: d.ma_goi,
    });

    revalidatePath("/quan-tri/quan-ly-goi");
    revalidatePath("/bang-gia");
    revalidatePath("/nang-cap-pro");
    return thanhCong(data);
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// 3. Sửa gói Premium
export async function suaGoiAction(dauVao: unknown): Promise<KetQua<any>> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = suaGoiSchema.parse(dauVao);

    const updateData: Partial<Bang<"goi_premium">> = {};
    if (d.ten !== undefined) updateData.ten = d.ten;
    if (d.mo_ta !== undefined) updateData.mo_ta = rongThanhNull(d.mo_ta);
    if (d.thoi_han_ngay !== undefined) updateData.thoi_han_ngay = d.thoi_han_ngay;
    if (d.gia !== undefined) updateData.gia = d.gia;
    if (d.quyen_loi !== undefined) updateData.quyen_loi = d.quyen_loi;
    if (d.thu_tu !== undefined) updateData.thu_tu = d.thu_tu;
    if (d.hoat_dong !== undefined) updateData.hoat_dong = d.hoat_dong;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await p.supabase
      .from("goi_premium")
      .update(updateData)
      .eq("id", d.id)
      .select()
      .single();

    if (error) throw error;

    await ghiNhatKy(p.supabase, p.user.id, "sua_goi_premium", "goi_premium", d.id, updateData);

    revalidatePath("/quan-tri/quan-ly-goi");
    revalidatePath("/bang-gia");
    revalidatePath("/nang-cap-pro");
    return thanhCong(data);
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// 4. Xóa gói hoặc chuyển trạng thái ngừng bán
export async function xoaGoiAction(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const goiId = idUuid.parse(id);

    // Kiểm tra xem đã có người dùng mua gói này chưa
    const { count } = await p.supabase
      .from("goi_nguoi_dung")
      .select("*", { count: "exact", head: true })
      .eq("goi_id", goiId);

    if (count && count > 0) {
      // Đã có người dùng -> ngừng kích hoạt thay vì xóa cứng
      const { error } = await p.supabase
        .from("goi_premium")
        .update({ hoat_dong: false })
        .eq("id", goiId);
      if (error) throw error;
    } else {
      const { error } = await p.supabase.from("goi_premium").delete().eq("id", goiId);
      if (error) throw error;
    }

    await ghiNhatKy(p.supabase, p.user.id, "xoa_goi_premium", "goi_premium", goiId);

    revalidatePath("/quan-tri/quan-ly-goi");
    revalidatePath("/bang-gia");
    revalidatePath("/nang-cap-pro");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// 5. Lấy danh sách yêu cầu nâng cấp Pro
export async function layDanhSachYeuCauNangCapAction({
  trangThai,
  trang = 1,
  gioiHan = 15,
}: {
  trangThai?: string;
  trang?: number;
  gioiHan?: number;
}): Promise<KetQua<{ items: any[]; tongSo: number; trangHienTai: number; tongTrang: number }>> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;

    const offset = (trang - 1) * gioiHan;
    let query = p.supabase
      .from("yeu_cau_nang_cap")
      .select("*, nguoi_dung:profiles!yeu_cau_nang_cap_nguoi_dung_id_fkey(*), goi:goi_premium(*), thanh_toan(*)", { count: "exact" });

    if (trangThai && trangThai !== "tat_ca") {
      query = query.eq("trang_thai", trangThai as "cho_duyet" | "da_duyet" | "tu_choi" | "da_huy");
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + gioiHan - 1);

    if (error) throw error;

    return thanhCong({
      items: data ?? [],
      tongSo: count ?? 0,
      trangHienTai: trang,
      tongTrang: Math.ceil((count ?? 0) / gioiHan) || 1,
    });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// 6. Admin duyệt yêu cầu nâng cấp Pro
export async function duyetYeuCauNangCapAction(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = duyetNangCapSchema.parse(dauVao);

    // Lấy thông tin yêu cầu, người dùng và gói
    const { data: yc, error: ycErr } = await p.supabase
      .from("yeu_cau_nang_cap")
      .select("*, goi:goi_premium(*)")
      .eq("id", d.yeu_cau_id)
      .maybeSingle();

    if (ycErr || !yc) return thatBai("Không tìm thấy yêu cầu nâng cấp");
    if (yc.trang_thai !== "cho_duyet") {
      return thatBai("Yêu cầu này đã được xử lý trước đó.");
    }

    const goi = yc.goi;
    if (!goi) return thatBai("Thông tin gói không hợp lệ");

    // Lấy profile hiện tại để tính ngày hết hạn (cộng dồn nếu đang có hạn)
    const { data: profile } = await p.supabase
      .from("profiles")
      .select("id, la_pro, goi_het_han")
      .eq("id", yc.nguoi_dung_id)
      .single();

    const batDau = new Date();
    const hetHan = tinhNgayHetHan(goi.thoi_han_ngay, profile?.goi_het_han);

    // 1. Cập nhật bảng yeu_cau_nang_cap
    const { error: errYc } = await p.supabase
      .from("yeu_cau_nang_cap")
      .update({
        trang_thai: "da_duyet",
        nguoi_duyet_id: p.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", yc.id);
    if (errYc) throw errYc;

    // 2. Thêm vào bảng goi_nguoi_dung
    const { error: errGnd } = await p.supabase.from("goi_nguoi_dung").insert({
      nguoi_dung_id: yc.nguoi_dung_id,
      goi_id: goi.id,
      ngay_bat_dau: batDau.toISOString(),
      ngay_het_han: hetHan.toISOString(),
      trang_thai: "hoat_dong",
      cap_boi_admin: false,
      ghi_chu: `Duyệt từ yêu cầu ${yc.ma_yeu_cau}`,
    });
    if (errGnd) throw errGnd;

    // 3. Cập nhật profiles
    const { error: errProf } = await p.supabase
      .from("profiles")
      .update({
        la_pro: true,
        goi_hien_tai_id: goi.id,
        goi_het_han: hetHan.toISOString(),
      })
      .eq("id", yc.nguoi_dung_id);
    if (errProf) throw errProf;

    // 4. Gửi thông báo hệ thống
    const ngayDinhDang = hetHan.toLocaleDateString("vi-VN");
    await guiThongBaoNhieuNguoi(p.supabase, [yc.nguoi_dung_id], {
      tieu_de: "👑 Nâng cấp Pro thành công!",
      noi_dung: `Chúc mừng bạn! Yêu cầu nâng cấp gói ${goi.ten} đã được duyệt. Hạn sử dụng đến ${ngayDinhDang}.`,
      loai: "he_thong",
      lien_ket: "/goi-cua-toi",
    });

    // 5. Gửi email thông báo
    const ttUser = await layEmailVaTen(yc.nguoi_dung_id);
    if (ttUser) {
      guiEmailChucMungPro({
        den: ttUser.email,
        ten: ttUser.ten,
        tenGoi: goi.ten,
        ngayHetHan: ngayDinhDang,
      }).catch((e) => console.error("[EMAIL PRO ERR]", e));
    }

    // 6. Ghi nhật ký
    await ghiNhatKy(p.supabase, p.user.id, "duyet_nang_cap_pro", "yeu_cau_nang_cap", yc.id, {
      ma_yeu_cau: yc.ma_yeu_cau,
      nguoi_dung_id: yc.nguoi_dung_id,
      goi: goi.ten,
    });

    revalidatePath("/quan-tri/duyet-nang-cap");
    revalidatePath("/goi-cua-toi");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// 7. Admin từ chối yêu cầu nâng cấp Pro
export async function tuChoiYeuCauNangCapAction(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = tuChoiNangCapSchema.parse(dauVao);

    const { data: yc, error: ycErr } = await p.supabase
      .from("yeu_cau_nang_cap")
      .select("*, goi:goi_premium(*)")
      .eq("id", d.yeu_cau_id)
      .maybeSingle();

    if (ycErr || !yc) return thatBai("Không tìm thấy yêu cầu nâng cấp");
    if (yc.trang_thai !== "cho_duyet") {
      return thatBai("Yêu cầu này đã được xử lý trước đó.");
    }

    const { error: errYc } = await p.supabase
      .from("yeu_cau_nang_cap")
      .update({
        trang_thai: "tu_choi",
        nguoi_duyet_id: p.user.id,
        ly_do_tu_choi: d.ly_do_tu_choi,
        updated_at: new Date().toISOString(),
      })
      .eq("id", yc.id);
    if (errYc) throw errYc;

    // Gửi thông báo cho người dùng
    await guiThongBaoNhieuNguoi(p.supabase, [yc.nguoi_dung_id], {
      tieu_de: "Yêu cầu nâng cấp Pro bị từ chối",
      noi_dung: `Rất tiếc, yêu cầu nâng cấp gói ${yc.goi?.ten ?? ""} chưa thể duyệt. Lý do: ${d.ly_do_tu_choi}`,
      loai: "he_thong",
      lien_ket: "/goi-cua-toi",
    });

    await ghiNhatKy(p.supabase, p.user.id, "tu_choi_nang_cap_pro", "yeu_cau_nang_cap", yc.id, {
      ma_yeu_cau: yc.ma_yeu_cau,
      ly_do: d.ly_do_tu_choi,
    });

    revalidatePath("/quan-tri/duyet-nang-cap");
    revalidatePath("/goi-cua-toi");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// 8. Admin cấp gói thủ công cho người dùng
export async function capGoiThuCongAction(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = capGoiThuCongSchema.parse(dauVao);

    const { data: goi, error: goiErr } = await p.supabase
      .from("goi_premium")
      .select("*")
      .eq("id", d.goi_id)
      .maybeSingle();

    if (goiErr || !goi) return thatBai("Gói dịch vụ không tồn tại");

    const { data: userProfile } = await p.supabase
      .from("profiles")
      .select("id, la_pro, goi_het_han")
      .eq("id", d.nguoi_dung_id)
      .single();

    if (!userProfile) return thatBai("Người dùng không tồn tại");

    const batDau = new Date();
    const hetHan = tinhNgayHetHan(goi.thoi_han_ngay, userProfile.goi_het_han);

    // Thêm bản ghi goi_nguoi_dung
    const { error: errGnd } = await p.supabase.from("goi_nguoi_dung").insert({
      nguoi_dung_id: d.nguoi_dung_id,
      goi_id: goi.id,
      ngay_bat_dau: batDau.toISOString(),
      ngay_het_han: hetHan.toISOString(),
      trang_thai: "hoat_dong",
      cap_boi_admin: true,
      ghi_chu: rongThanhNull(d.ghi_chu) ?? "Admin cấp gói thủ công",
    });
    if (errGnd) throw errGnd;

    // Cập nhật profile
    const { error: errProf } = await p.supabase
      .from("profiles")
      .update({
        la_pro: true,
        goi_hien_tai_id: goi.id,
        goi_het_han: hetHan.toISOString(),
      })
      .eq("id", d.nguoi_dung_id);
    if (errProf) throw errProf;

    // Thông báo cho user
    const ngayDinhDang = hetHan.toLocaleDateString("vi-VN");
    await guiThongBaoNhieuNguoi(p.supabase, [d.nguoi_dung_id], {
      tieu_de: "👑 Bạn đã được cấp gói Pro!",
      noi_dung: `Quản trị viên đã cấp cho bạn gói ${goi.ten}. Hạn sử dụng đến ${ngayDinhDang}.`,
      loai: "he_thong",
      lien_ket: "/goi-cua-toi",
    });

    const ttUser = await layEmailVaTen(d.nguoi_dung_id);
    if (ttUser) {
      guiEmailChucMungPro({
        den: ttUser.email,
        ten: ttUser.ten,
        tenGoi: goi.ten,
        ngayHetHan: ngayDinhDang,
      }).catch((e) => console.error("[EMAIL PRO ERR]", e));
    }

    await ghiNhatKy(p.supabase, p.user.id, "cap_goi_thu_cong", "profiles", d.nguoi_dung_id, {
      goi: goi.ten,
      ghi_chu: d.ghi_chu,
    });

    revalidatePath("/quan-tri/nguoi-dung");
    revalidatePath("/goi-cua-toi");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// 9. Thu hồi gói Pro của người dùng
export async function thuHoiGoiAction(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = thuHoiGoiSchema.parse(dauVao);

    // Hủy các gói đang hoạt động của người dùng
    await p.supabase
      .from("goi_nguoi_dung")
      .update({ trang_thai: "huy" })
      .eq("nguoi_dung_id", d.nguoi_dung_id)
      .eq("trang_thai", "hoat_dong");

    // Thu hồi trong profiles
    const { error: errProf } = await p.supabase
      .from("profiles")
      .update({
        la_pro: false,
        goi_hien_tai_id: null,
        goi_het_han: null,
      })
      .eq("id", d.nguoi_dung_id);
    if (errProf) throw errProf;

    // Gửi thông báo
    await guiThongBaoNhieuNguoi(p.supabase, [d.nguoi_dung_id], {
      tieu_de: "Thông báo thu hồi quyền Pro",
      noi_dung: `Quyền thành viên Pro của bạn đã bị thu hồi bởi ban quản trị.${d.ly_do ? ` Lý do: ${d.ly_do}` : ""}`,
      loai: "he_thong",
      lien_ket: "/bang-gia",
    });

    await ghiNhatKy(p.supabase, p.user.id, "thu_hoi_goi_pro", "profiles", d.nguoi_dung_id, {
      ly_do: d.ly_do,
    });

    revalidatePath("/quan-tri/nguoi-dung");
    revalidatePath("/goi-cua-toi");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}
