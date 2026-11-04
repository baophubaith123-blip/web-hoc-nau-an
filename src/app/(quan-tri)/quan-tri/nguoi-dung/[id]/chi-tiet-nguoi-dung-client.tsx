"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doiVaiTro, khoaNguoiDung } from "@/lib/actions/quan-tri";
import type { Bang, VaiTro } from "@/types";
import { Loader2, ShieldAlert, Lock, Unlock, Crown, Sparkles } from "lucide-react";
import { BadgePro } from "@/components/goi/BadgePro";
import { ModalCapGoi } from "@/components/quan-tri/ModalCapGoi";

interface ChiTietNguoiDungClientProps {
  nguoiDung: Bang<"profiles">;
  idAdminHienTai: string;
  danhSachGoi?: Array<{ id: string; ma_goi: string; ten: string; thoi_han_ngay: number }>;
}

export function ChiTietNguoiDungClient({
  nguoiDung,
  idAdminHienTai,
  danhSachGoi = [],
}: ChiTietNguoiDungClientProps) {
  const router = useRouter();
  const [vaiTroMoi, setVaiTroMoi] = useState<VaiTro>(nguoiDung.vai_tro);
  const [dangXuLyVaiTro, setDangXuLyVaiTro] = useState(false);
  const [dangXuLyKhoa, setDangXuLyKhoa] = useState(false);
  const [moModalCapGoi, setMoModalCapGoi] = useState(false);

  const laChinhMinh = nguoiDung.id === idAdminHienTai;
  const daKhoa = nguoiDung.trang_thai === "khoa";
  const laPro = !!nguoiDung.la_pro;
  const hetHanPro = nguoiDung.goi_het_han ? new Date(nguoiDung.goi_het_han) : null;
  const proConHan = hetHanPro ? hetHanPro > new Date() : false;

  const xuLyDoiVaiTro = async () => {
    if (vaiTroMoi === nguoiDung.vai_tro) return;
    setDangXuLyVaiTro(true);
    try {
      const res = await doiVaiTro({
        nguoi_dung_id: nguoiDung.id,
        vai_tro: vaiTroMoi,
      });

      if (res.thanh_cong) {
        toast.success("Đã cập nhật vai trò người dùng thành công!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi đổi vai trò!");
    } finally {
      setDangXuLyVaiTro(false);
    }
  };

  const xuLyKhoaMoKhoa = async () => {
    const hanhDong = daKhoa ? "mở khóa" : "khóa";
    if (!confirm(`Bạn có chắc muốn ${hanhDong} tài khoản này?`)) return;

    setDangXuLyKhoa(true);
    try {
      const res = await khoaNguoiDung({
        nguoi_dung_id: nguoiDung.id,
        khoa: !daKhoa,
      });

      if (res.thanh_cong) {
        toast.success(`Đã ${hanhDong} tài khoản thành công!`);
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setDangXuLyKhoa(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quản lý gói Pro */}
      <div className="p-4 border rounded-2xl bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-base">Gói hội viên Pro</h3>
          </div>
          {laPro && proConHan ? (
            <BadgePro size="sm" />
          ) : (
            <span className="text-xs text-muted-foreground">Tài khoản thường (Free)</span>
          )}
        </div>

        <div className="p-3 bg-muted/30 rounded-xl text-sm space-y-1">
          <p className="text-muted-foreground text-xs">
            Trạng thái hiện tại:{" "}
            <strong className="text-foreground">
              {laPro && proConHan ? "Thành viên Pro có hiệu lực" : "Chưa kích hoạt Pro hoặc đã hết hạn"}
            </strong>
          </p>
          {hetHanPro && (
            <p className="text-muted-foreground text-xs">
              Hạn sử dụng: <strong className="text-foreground">{hetHanPro.toLocaleDateString("vi-VN")}</strong>
              {" "}({proConHan ? "Đang hiệu lực" : "Đã hết hạn"})
            </p>
          )}
        </div>

        <Button
          type="button"
          onClick={() => setMoModalCapGoi(true)}
          className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-600 hover:to-yellow-600 font-bold"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{laPro ? "Gia hạn / Thu hồi gói Pro" : "Cấp gói Pro thủ công"}</span>
        </Button>
      </div>

      {/* Phân quyền */}
      <div className="p-4 border rounded-2xl bg-card space-y-4">
        <h3 className="font-bold text-base">Phân quyền tài khoản</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Select
            disabled={laChinhMinh || dangXuLyVaiTro}
            value={vaiTroMoi}
            onValueChange={(v) => { if (v) setVaiTroMoi(v as VaiTro); }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn vai trò">
                {(value: string) =>
                  value
                    ? ({
                        user: "Học viên (User)",
                        chef: "Đầu bếp (Chef)",
                        support: "Nhân viên hỗ trợ (Support)",
                        admin: "Quản trị viên (Admin)",
                      } as Record<string, string>)[value] ?? value
                    : "Chọn vai trò"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Học viên (User)</SelectItem>
              <SelectItem value="chef">Đầu bếp (Chef)</SelectItem>
              <SelectItem value="support">Nhân viên hỗ trợ (Support)</SelectItem>
              <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            disabled={laChinhMinh || dangXuLyVaiTro || vaiTroMoi === nguoiDung.vai_tro}
            onClick={xuLyDoiVaiTro}
          >
            {dangXuLyVaiTro && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu vai trò
          </Button>

          {laChinhMinh && (
            <p className="text-xs text-muted-foreground italic">
              (Bạn không thể tự thay đổi vai trò của chính mình)
            </p>
          )}
        </div>
      </div>

      {/* Khóa / Mở khóa */}
      <div className="p-4 border rounded-2xl bg-card space-y-3">
        <h3 className="font-bold text-base text-destructive flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Vùng quản trị rủi ro
        </h3>
        <p className="text-xs text-muted-foreground">
          Khóa tài khoản sẽ lập tức ngăn chặn người dùng đăng nhập và sử dụng mọi dịch vụ trên hệ thống
        </p>

        <Button
          variant={daKhoa ? "default" : "destructive"}
          disabled={laChinhMinh || dangXuLyKhoa}
          onClick={xuLyKhoaMoKhoa}
          className="gap-2"
        >
          {dangXuLyKhoa ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : daKhoa ? (
            <Unlock className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
          {daKhoa ? "Mở khóa tài khoản" : "Khóa tài khoản này"}
        </Button>
      </div>

      {/* Modal Cấp / Thu hồi gói */}
      <ModalCapGoi
        mo={moModalCapGoi}
        onDong={() => setMoModalCapGoi(false)}
        nguoiDung={{
          id: nguoiDung.id,
          ho_ten: nguoiDung.ho_ten,
          username: nguoiDung.username ?? "user",
          la_pro: nguoiDung.la_pro,
          goi_het_han: nguoiDung.goi_het_han,
        }}
        danhSachGoi={danhSachGoi}
      />
    </div>
  );
}

