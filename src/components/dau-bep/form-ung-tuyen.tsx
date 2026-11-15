"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { guiDonUngTuyen } from "@/lib/actions/ung-tuyen-dau-bep";
import { toast } from "sonner";

// Các hướng chuyên môn gợi ý — người ứng tuyển tích chọn một hoặc
// nhiều mục, lưu vào đơn dưới dạng một chuỗi nối bằng " · ".
export const CAC_CHUYEN_MON = [
  "Món Việt truyền thống",
  "Món Á",
  "Món Âu",
  "Làm bánh & tráng miệng",
  "Món chay",
  "Eat-clean / healthy",
  "Đồ uống & pha chế",
  "Khác",
];

export function FormUngTuyenDauBep() {
  const router = useRouter();
  const [dangGui, setDangGui] = useState(false);
  const [chuyenMon, setChuyenMon] = useState<string[]>([]);
  const [soNam, setSoNam] = useState("");
  const [monTu, setMonTu] = useState("");
  const [tieuSu, setTieuSu] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [lienKet, setLienKet] = useState("");

  const chonChuyenMon = (muc: string) =>
    setChuyenMon((cu) =>
      cu.includes(muc) ? cu.filter((x) => x !== muc) : [...cu, muc]
    );

  const guiDon = async () => {
    if (chuyenMon.length === 0) {
      toast.error("Vui lòng chọn ít nhất một hướng chuyên môn.");
      return;
    }
    const soNamNum = Number(soNam);
    if (soNam.trim() === "" || Number.isNaN(soNamNum) || soNamNum < 0) {
      toast.error("Vui lòng nhập số năm kinh nghiệm (tối thiểu 0 — mới vào nghề cứ nhập 0).");
      return;
    }
    if (tieuSu.trim().length < 30) {
      toast.error("Tiểu sử cần ít nhất 30 ký tự để quản trị viên hiểu rõ về bạn.");
      return;
    }
    if (lyDo.trim().length < 20) {
      toast.error("Lý do ứng tuyển cần ít nhất 20 ký tự.");
      return;
    }
    setDangGui(true);
    try {
      const ketQua = await guiDonUngTuyen({
        chuyen_mon: chuyenMon.join(" · "),
        so_nam_kinh_nghiem: soNamNum,
        mon_tu: monTu.trim() || undefined,
        tieu_su: tieuSu.trim(),
        ly_do: lyDo.trim(),
        lien_ket_mang_xa_hoi: lienKet.trim() || undefined,
      });
      if (ketQua.thanh_cong) {
        toast.success(
          "Đã gửi đơn ứng tuyển! Quản trị viên sẽ xem hồ sơ và phản hồi qua mục thông báo của bạn."
        );
        router.refresh();
      } else {
        toast.error(ketQua.loi);
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi gửi đơn. Vui lòng thử lại.");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ChefHat className="h-5 w-5 text-primary" />
          Đơn ứng tuyển đầu bếp
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tên và ảnh đại diện lấy từ hồ sơ của bạn. Mỗi tài khoản chỉ có một đơn
          đang chờ duyệt tại một thời điểm.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Chuyên môn của bạn *</Label>
          <div className="flex flex-wrap gap-2">
            {CAC_CHUYEN_MON.map((muc) => {
              const dangChon = chuyenMon.includes(muc);
              return (
                <button
                  key={muc}
                  type="button"
                  onClick={() => chonChuyenMon(muc)}
                  aria-pressed={dangChon}
                  className={
                    dangChon
                      ? "rounded-full bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground shadow-sm"
                      : "rounded-full border bg-background px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  }
                >
                  {muc}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="so_nam_kinh_nghiem">Số năm kinh nghiệm *</Label>
            <Input
              id="so_nam_kinh_nghiem"
              type="number"
              min={0}
              max={70}
              step={1}
              inputMode="numeric"
              placeholder="VD: 3 (mới vào nghề thì nhập 0)"
              value={soNam}
              onChange={(e) => setSoNam(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Bắt buộc — tối thiểu 0 năm. Kinh nghiệm tự nấu tại nhà cũng được tính.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mon_tu">Món tủ / món sở trường</Label>
            <Input
              id="mon_tu"
              placeholder="VD: Phở bò tái nạm, Bánh flan caramel…"
              value={monTu}
              onChange={(e) => setMonTu(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tieu_su">Tiểu sử ngắn *</Label>
          <Textarea
            id="tieu_su"
            rows={4}
            maxLength={1000}
            placeholder="Giới thiệu về bạn: bạn là ai, đã nấu ăn/học nghề ở đâu, phong cách ẩm thực bạn theo đuổi… (ít nhất 30 ký tự)"
            value={tieuSu}
            onChange={(e) => setTieuSu(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{tieuSu.trim().length}/30 ký tự tối thiểu</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ly_do">Vì sao bạn muốn trở thành đầu bếp trên Học Nấu Ăn? *</Label>
          <Textarea
            id="ly_do"
            rows={3}
            maxLength={1000}
            placeholder="Bạn muốn chia sẻ điều gì với cộng đồng? Dự định đăng công thức/mở khóa học về chủ đề nào? (ít nhất 20 ký tự)"
            value={lyDo}
            onChange={(e) => setLyDo(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{lyDo.trim().length}/20 ký tự tối thiểu</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lien_ket_mang_xa_hoi">Liên kết mạng xã hội / kênh nấu ăn (nếu có)</Label>
          <Input
            id="lien_ket_mang_xa_hoi"
            type="url"
            placeholder="https://www.facebook.com/… hoặc kênh TikTok/YouTube của bạn"
            value={lienKet}
            onChange={(e) => setLienKet(e.target.value)}
          />
        </div>

        <Button onClick={guiDon} disabled={dangGui} className="w-full sm:w-auto" size="lg">
          {dangGui ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Gửi đơn ứng tuyển
        </Button>
      </CardContent>
    </Card>
  );
}
