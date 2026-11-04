"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { guiBroadcast } from "@/lib/actions/thong-bao";
import { Send, Loader2, BellRing } from "lucide-react";

export function FormGuiThongBao() {
  const router = useRouter();
  const [dangGui, setDangGui] = useState(false);

  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [lienKet, setLienKet] = useState("");
  const [doiTuong, setDoiTuong] = useState<"tat_ca" | "chef" | "support">("tat_ca");

  const xuLyGui = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieuDe.trim() || !noiDung.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung thông báo!");
      return;
    }

    setDangGui(true);
    try {
      const res = await guiBroadcast({
        tieu_de: tieuDe.trim(),
        noi_dung: noiDung.trim(),
        lien_ket: lienKet.trim() || undefined,
        doi_tuong: doiTuong,
      });

      if (res.thanh_cong) {
        toast.success(`Đã gửi thông báo thành công tới ${res.du_lieu.so_nguoi_nhan} người dùng!`);
        setTieuDe("");
        setNoiDung("");
        setLienKet("");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi phát sóng thông báo");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="w-5 h-5 text-primary" /> Soạn thông báo phát sóng
        </CardTitle>
        <CardDescription>
          Thông báo sẽ được gửi theo thời gian thực (realtime) tới hòm thư người dùng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={xuLyGui} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doi_tuong_tb">Đối tượng nhận thông báo</Label>
            <Select
              value={doiTuong}
              onValueChange={(val) => {
                if (val) setDoiTuong(val as "tat_ca" | "chef" | "support");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm đối tượng">
                  {(value: string) =>
                    value
                      ? ({
                          tat_ca: "Tất cả thành viên hệ thống",
                          chef: "Chỉ đầu bếp đối tác (Chef)",
                          support: "Chỉ nhân viên hỗ trợ (Support)",
                        } as Record<string, string>)[value] ?? value
                      : "Chọn nhóm đối tượng"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tat_ca">Tất cả thành viên hệ thống</SelectItem>
                <SelectItem value="chef">Chỉ đầu bếp đối tác (Chef)</SelectItem>
                <SelectItem value="support">Chỉ nhân viên hỗ trợ (Support)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tieu_de_tb">Tiêu đề thông báo *</Label>
            <Input
              id="tieu_de_tb"
              placeholder="VD: Cập nhật điều khoản & tính năng mới tháng 10"
              value={tieuDe}
              onChange={(e) => setTieuDe(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noi_dung_tb">Nội dung chi tiết *</Label>
            <Textarea
              id="noi_dung_tb"
              rows={5}
              placeholder="Nhập thông điệp cần truyền tải tới cộng đồng..."
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lien_ket_tb">Đường dẫn liên kết (Tùy chọn)</Label>
            <Input
              id="lien_ket_tb"
              placeholder="VD: /khoa-hoc hoặc /bai-viet/su-kien-am-thuc"
              value={lienKet}
              onChange={(e) => setLienKet(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={dangGui} className="w-full gap-2">
            {dangGui ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Phát sóng thông báo ngay
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
