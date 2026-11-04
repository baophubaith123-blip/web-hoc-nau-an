"use server";

import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy, laNhanVien, layEmailVaTen } from "@/lib/actions/chung";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import {
  doiTrangThaiTicketSchema, doiUuTienTicketSchema, phanCongTicketSchema, taoTicketSchema, tinNhanTicketSchema,
} from "@/lib/validations/ticket";
import { idUuid } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { guiEmailTraLoiTicket } from "@/lib/email/gui-email";
import { t } from "@/lib/i18n/config";

const lamMoi = (id?: string) => {
  revalidatePath("/ho-tro");
  revalidatePath("/nhan-vien/ticket");
  revalidatePath("/quan-tri/ho-tro");
  if (id) ["/ho-tro/", "/nhan-vien/ticket/", "/quan-tri/ho-tro/"].forEach((p) => revalidatePath(p + id));
};

// Người dùng tạo ticket. Báo cho toàn bộ support/admin qua thông báo realtime
export async function taoTicket(dauVao: unknown): Promise<KetQua<{ id: string; ma_ticket: string }>> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = taoTicketSchema.parse(dauVao);

    const { data, error } = await p.supabase
      .from("ticket_ho_tro")
      .insert({ nguoi_dung_id: p.user.id, tieu_de: d.tieu_de, noi_dung: d.noi_dung, danh_muc: d.danh_muc })
      .select("id, ma_ticket")
      .single();
    if (error) throw error;

    try {
      const admin = taoSupabaseAdmin();
      const { data: nv } = await admin.from("profiles").select("id").in("vai_tro", ["support", "admin"]).eq("trang_thai", "hoat_dong");
      if (nv?.length) {
        await admin.from("thong_bao").insert(
          nv.map((x) => ({
            nguoi_dung_id: x.id, tieu_de: t("hanh_dong.tb_ticket_moi", { ma: data.ma_ticket }),
            noi_dung: d.tieu_de, loai: "ticket", lien_ket: `/nhan-vien/ticket/${data.id}`,
          }))
        );
      }
    } catch (e) {
      console.error("[THONG BAO TICKET]", e); // không làm hỏng việc tạo ticket
    }

    await ghiNhatKy(p.supabase, p.user.id, "tao_ticket", "ticket", data.id);
    lamMoi();
    return thanhCong(data);
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Gửi tin nhắn trong ticket (người dùng hoặc nhân viên; nhân viên có thể ghi chú nội bộ)
export async function guiTinNhan(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = tinNhanTicketSchema.parse(dauVao);
    const laNV = laNhanVien(p.vaiTro);
    if (d.la_noi_bo && !laNV) return thatBai(t("hanh_dong.chi_nv_noi_bo"));

    const { data: tk } = await p.supabase
      .from("ticket_ho_tro").select("id, ma_ticket, trang_thai, nguoi_dung_id, nhan_vien_ho_tro_id")
      .eq("id", d.ticket_id).maybeSingle();
    if (!tk) return thatBai(t("loi.khong_tim_thay"));
    if (tk.trang_thai === "dong") return thatBai(t("ticket.ticket_da_dong"));

    const laChu = tk.nguoi_dung_id === p.user.id;
    const nhanVienTraLoi = laNV && !laChu;

    const { error } = await p.supabase.from("tin_nhan_ticket").insert({
      ticket_id: d.ticket_id, nguoi_gui_id: p.user.id, noi_dung: d.noi_dung, la_noi_bo: d.la_noi_bo,
    });
    if (error) throw error;

    // Tự cập nhật trạng thái theo luồng hội thoại
    if (!d.la_noi_bo) {
      if (laChu && ["cho_phan_hoi", "da_giai_quyet"].includes(tk.trang_thai)) {
        await p.supabase.from("ticket_ho_tro").update({ trang_thai: "dang_xu_ly" }).eq("id", tk.id);
      } else if (nhanVienTraLoi && ["moi", "dang_xu_ly"].includes(tk.trang_thai)) {
        await p.supabase.from("ticket_ho_tro")
          .update({ trang_thai: "cho_phan_hoi", nhan_vien_ho_tro_id: tk.nhan_vien_ho_tro_id ?? p.user.id })
          .eq("id", tk.id);
      }
    }

    // Email cho người dùng khi nhân viên trả lời công khai
    if (nhanVienTraLoi && !d.la_noi_bo) {
      const nd = await layEmailVaTen(tk.nguoi_dung_id);
      if (nd) {
        await guiEmailTraLoiTicket({
          den: nd.email, ten: nd.ten, maTicket: tk.ma_ticket, noiDung: d.noi_dung, ticketId: tk.id,
        }).catch((e: unknown) => console.error("[EMAIL TICKET]", e));
      }
    }

    lamMoi(tk.id);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Đổi trạng thái. Người dùng chỉ được đóng / mở lại ticket của mình
export async function doiTrangThaiTicket(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = doiTrangThaiTicketSchema.parse(dauVao);
    if (!laNhanVien(p.vaiTro) && !["dong", "dang_xu_ly"].includes(d.trang_thai)) {
      return thatBai(t("loi.khong_co_quyen"));
    }
    const { data, error } = await p.supabase
      .from("ticket_ho_tro").update({ trang_thai: d.trang_thai }).eq("id", d.ticket_id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_co_quyen"));
    await ghiNhatKy(p.supabase, p.user.id, "doi_trang_thai_ticket", "ticket", d.ticket_id, { trang_thai: d.trang_thai });
    lamMoi(d.ticket_id);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Phân công (nhan_vien_id = null là bỏ phân công). Nhân viên "nhận xử lý" = tự phân công cho mình
export async function phanCongTicket(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["support", "admin"]);
    if (!p.ok) return p.loi;
    const d = phanCongTicketSchema.parse(dauVao);

    if (d.nhan_vien_id) {
      const { data: nv } = await p.supabase
        .from("profiles").select("id").eq("id", d.nhan_vien_id).in("vai_tro", ["support", "admin"]).eq("trang_thai", "hoat_dong").maybeSingle();
      if (!nv) return thatBai(t("hanh_dong.nhan_vien_khong_hop_le"));
    }

    const { data: tk } = await p.supabase.from("ticket_ho_tro").select("trang_thai").eq("id", d.ticket_id).maybeSingle();
    if (!tk) return thatBai(t("loi.khong_tim_thay"));

    const { error } = await p.supabase
      .from("ticket_ho_tro")
      .update({ nhan_vien_ho_tro_id: d.nhan_vien_id, ...(tk.trang_thai === "moi" && d.nhan_vien_id ? { trang_thai: "dang_xu_ly" } : {}) })
      .eq("id", d.ticket_id);
    if (error) throw error;

    await ghiNhatKy(p.supabase, p.user.id, "phan_cong_ticket", "ticket", d.ticket_id, { nhan_vien_id: d.nhan_vien_id });
    lamMoi(d.ticket_id);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function doiUuTienTicket(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["support", "admin"]);
    if (!p.ok) return p.loi;
    const d = doiUuTienTicketSchema.parse(dauVao);
    const { error } = await p.supabase.from("ticket_ho_tro").update({ do_uu_tien: d.do_uu_tien }).eq("id", d.ticket_id);
    if (error) throw error;
    lamMoi(d.ticket_id);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Support chuyển ticket lên admin: ghi chú nội bộ + tăng ưu tiên + thông báo cho tất cả admin
export async function chuyenTicketLenAdmin(ticketId: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["support"]);
    if (!p.ok) return p.loi;
    const id = idUuid.parse(ticketId);

    const { data: tk } = await p.supabase.from("ticket_ho_tro").select("ma_ticket, do_uu_tien").eq("id", id).maybeSingle();
    if (!tk) return thatBai(t("loi.khong_tim_thay"));

    const { error: e1 } = await p.supabase.from("tin_nhan_ticket").insert({
      ticket_id: id, nguoi_gui_id: p.user.id, noi_dung: t("hanh_dong.ghi_chu_chuyen_admin"), la_noi_bo: true,
    });
    if (e1) throw e1;
    if (tk.do_uu_tien === "thap" || tk.do_uu_tien === "trung_binh") {
      await p.supabase.from("ticket_ho_tro").update({ do_uu_tien: "cao" }).eq("id", id);
    }

    const admin = taoSupabaseAdmin();
    const { data: ds } = await admin.from("profiles").select("id").eq("vai_tro", "admin").eq("trang_thai", "hoat_dong");
    if (ds?.length) {
      await admin.from("thong_bao").insert(
        ds.map((a) => ({
          nguoi_dung_id: a.id, tieu_de: t("hanh_dong.tb_chuyen_admin", { ma: tk.ma_ticket }),
          loai: "ticket", lien_ket: `/quan-tri/ho-tro/${id}`,
        }))
      );
    }
    await ghiNhatKy(p.supabase, p.user.id, "chuyen_ticket_admin", "ticket", id);
    lamMoi(id);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}