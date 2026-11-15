"use server";

import { revalidatePath } from "next/cache";
import {
  canPhien,
  ghiNhatKy,
  guiThongBaoNhieuNguoi,
  rongThanhNull,
} from "@/lib/actions/chung";
import {
  duyetDonUngTuyenSchema,
  guiDonUngTuyenSchema,
  tuChoiDonUngTuyenSchema,
} from "@/lib/validations/ung-tuyen";
import {
  chuanHoaLoi,
  thanhCong,
  thatBai,
  type KetQua,
} from "@/lib/utils/phan-hoi-loi";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import {
  SO_NGAY_GUI_LAI_SAU_TU_CHOI,
  THONG_BAO_CHUA_KICH_HOAT_010,
  laLoiThieuBang,
} from "@/lib/ung-tuyen";

// Đợt 5 — Đăng ký trở thành đầu bếp (phương án A: ứng tuyển + Admin
// duyệt, theo khuôn Duyệt Pro). Chống rác 3 lớp: kiểm tra đơn chờ ở
// action này + chỉ mục duy nhất từng phần trong migration 010 + chặn
// gửi lại 7 ngày sau lần từ chối gần nhất. Trước khi Bảo chạy
// migration 010, mọi thao tác trả thông báo thân thiện thay vì lỗi.

const lamMoiUngTuyen = () => {
  [
    "/tro-thanh-dau-bep",
    "/quan-tri/duyet-dau-bep",
    "/quan-tri/dau-bep",
    "/dau-bep",
    "/ho-so",
  ].forEach((duongDan) => revalidatePath(duongDan));
};

export async function guiDonUngTuyen(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    // Chỉ học viên thường mới cần ứng tuyển; đầu bếp/nhân viên đã có
    // khu vực làm việc riêng, tránh đơn rác từ tài khoản nội bộ.
    if (p.vaiTro !== "user") {
      return thatBai(
        "Tài khoản của bạn đã là đầu bếp/nhân viên của Học Nấu Ăn nên không cần gửi đơn ứng tuyển."
      );
    }
    const d = guiDonUngTuyenSchema.parse(dauVao);

    const { data: donCho, error: loiCho } = await p.supabase
      .from("don_ung_tuyen_dau_bep")
      .select("id")
      .eq("nguoi_dung_id", p.user.id)
      .eq("trang_thai", "cho_duyet")
      .maybeSingle();
    if (loiCho) {
      if (laLoiThieuBang(loiCho)) return thatBai(THONG_BAO_CHUA_KICH_HOAT_010);
      throw loiCho;
    }
    if (donCho) {
      return thatBai(
        "Bạn đã có một đơn ứng tuyển đang chờ duyệt. Vui lòng chờ quản trị viên xử lý trước khi gửi đơn mới."
      );
    }

    // Lần từ chối gần nhất: phải chờ đủ 7 ngày mới gửi lại được.
    const { data: donTuChoi, error: loiTuChoi } = await p.supabase
      .from("don_ung_tuyen_dau_bep")
      .select("duyet_luc, created_at")
      .eq("nguoi_dung_id", p.user.id)
      .eq("trang_thai", "tu_choi")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (loiTuChoi) {
      if (laLoiThieuBang(loiTuChoi)) return thatBai(THONG_BAO_CHUA_KICH_HOAT_010);
      throw loiTuChoi;
    }
    if (donTuChoi) {
      const mocMs = new Date(
        donTuChoi.duyet_luc ?? donTuChoi.created_at
      ).getTime();
      const conLaiMs =
        mocMs + SO_NGAY_GUI_LAI_SAU_TU_CHOI * 24 * 60 * 60 * 1000 - Date.now();
      if (conLaiMs > 0) {
        const soNgayConLai = Math.ceil(conLaiMs / (24 * 60 * 60 * 1000));
        return thatBai(
          `Đơn ứng tuyển gần nhất của bạn đã bị từ chối. Bạn có thể gửi lại sau ${soNgayConLai} ngày nữa (quy định chờ ${SO_NGAY_GUI_LAI_SAU_TU_CHOI} ngày sau mỗi lần từ chối).`
        );
      }
    }

    const { error } = await p.supabase.from("don_ung_tuyen_dau_bep").insert({
      nguoi_dung_id: p.user.id,
      chuyen_mon: d.chuyen_mon,
      so_nam_kinh_nghiem: d.so_nam_kinh_nghiem,
      mon_tu: rongThanhNull(d.mon_tu),
      tieu_su: d.tieu_su,
      ly_do: d.ly_do,
      lien_ket_mang_xa_hoi: rongThanhNull(d.lien_ket_mang_xa_hoi),
    });
    if (error) {
      if (laLoiThieuBang(error)) return thatBai(THONG_BAO_CHUA_KICH_HOAT_010);
      // 23505: chỉ mục "một đơn chờ mỗi người" chặn khi hai lần gửi
      // chạy song song — dịch sang thông báo dễ hiểu.
      if (error.code === "23505") {
        return thatBai(
          "Bạn đã có một đơn ứng tuyển đang chờ duyệt. Vui lòng chờ quản trị viên xử lý trước khi gửi đơn mới."
        );
      }
      throw error;
    }

    await ghiNhatKy(
      p.supabase,
      p.user.id,
      "gui_don_ung_tuyen_dau_bep",
      "don_ung_tuyen_dau_bep"
    );
    lamMoiUngTuyen();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function duyetDonUngTuyen(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const { don_id } = duyetDonUngTuyenSchema.parse(dauVao);
    const admin = taoSupabaseAdmin();

    const { data: don, error: loiDoc } = await admin
      .from("don_ung_tuyen_dau_bep")
      .select("id, nguoi_dung_id, trang_thai")
      .eq("id", don_id)
      .maybeSingle();
    if (loiDoc) {
      if (laLoiThieuBang(loiDoc)) return thatBai(THONG_BAO_CHUA_KICH_HOAT_010);
      throw loiDoc;
    }
    if (!don) return thatBai("Không tìm thấy đơn ứng tuyển này.");
    if (don.trang_thai !== "cho_duyet") {
      return thatBai("Đơn này đã được xử lý trước đó rồi.");
    }

    const bayGio = new Date().toISOString();
    const { error: loiDon } = await admin
      .from("don_ung_tuyen_dau_bep")
      .update({
        trang_thai: "da_duyet",
        nguoi_duyet_id: p.user.id,
        duyet_luc: bayGio,
        updated_at: bayGio,
      })
      .eq("id", don_id)
      .eq("trang_thai", "cho_duyet");
    if (loiDon) throw loiDon;

    // Đổi vai trò thành đầu bếp — từ đây người dùng vào được khu /bep
    // và hồ sơ của họ hiện ở trang /dau-bep công khai.
    const { error: loiVaiTro } = await admin
      .from("profiles")
      .update({ vai_tro: "chef" })
      .eq("id", don.nguoi_dung_id);
    if (loiVaiTro) throw loiVaiTro;

    await guiThongBaoNhieuNguoi(admin, [don.nguoi_dung_id], {
      tieu_de: "Chúc mừng! Bạn đã trở thành đầu bếp",
      noi_dung:
        "Đơn ứng tuyển đầu bếp của bạn đã được quản trị viên duyệt. Từ bây giờ bạn có thể vào khu vực đầu bếp để đăng công thức và mở khóa học của riêng mình.",
      loai: "he_thong",
      lien_ket: "/bep",
    });
    await ghiNhatKy(
      p.supabase,
      p.user.id,
      "duyet_don_ung_tuyen_dau_bep",
      "don_ung_tuyen_dau_bep",
      don_id,
      { nguoi_dung_id: don.nguoi_dung_id }
    );
    lamMoiUngTuyen();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function tuChoiDonUngTuyen(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const { don_id, ly_do_tu_choi } = tuChoiDonUngTuyenSchema.parse(dauVao);
    const admin = taoSupabaseAdmin();

    const { data: don, error: loiDoc } = await admin
      .from("don_ung_tuyen_dau_bep")
      .select("id, nguoi_dung_id, trang_thai")
      .eq("id", don_id)
      .maybeSingle();
    if (loiDoc) {
      if (laLoiThieuBang(loiDoc)) return thatBai(THONG_BAO_CHUA_KICH_HOAT_010);
      throw loiDoc;
    }
    if (!don) return thatBai("Không tìm thấy đơn ứng tuyển này.");
    if (don.trang_thai !== "cho_duyet") {
      return thatBai("Đơn này đã được xử lý trước đó rồi.");
    }

    const bayGio = new Date().toISOString();
    const { error: loiDon } = await admin
      .from("don_ung_tuyen_dau_bep")
      .update({
        trang_thai: "tu_choi",
        ly_do_tu_choi,
        nguoi_duyet_id: p.user.id,
        duyet_luc: bayGio,
        updated_at: bayGio,
      })
      .eq("id", don_id)
      .eq("trang_thai", "cho_duyet");
    if (loiDon) throw loiDon;

    await guiThongBaoNhieuNguoi(admin, [don.nguoi_dung_id], {
      tieu_de: "Đơn ứng tuyển đầu bếp chưa được duyệt",
      noi_dung: `Lý do: ${ly_do_tu_choi}. Bạn có thể hoàn thiện hồ sơ và gửi lại sau ${SO_NGAY_GUI_LAI_SAU_TU_CHOI} ngày.`,
      loai: "he_thong",
      lien_ket: "/tro-thanh-dau-bep",
    });
    await ghiNhatKy(
      p.supabase,
      p.user.id,
      "tu_choi_don_ung_tuyen_dau_bep",
      "don_ung_tuyen_dau_bep",
      don_id,
      { nguoi_dung_id: don.nguoi_dung_id, ly_do_tu_choi }
    );
    lamMoiUngTuyen();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}
