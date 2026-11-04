"use client";

import { useState } from "react";
import { taoTicket } from "@/lib/actions/ticket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function TaoTicketDialog() {
  const router = useRouter();
  const [mo, setMo] = useState(false);
  const [dangGui, setDangGui] = useState(false);

  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [danhMuc, setDanhMuc] = useState<string>("ky_thuat");

  const xuLyTao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieuDe.trim() || !noiDung.trim()) {
      toast.error("Vui lòng điền tiêu đề và nội dung");
      return;
    }

    setDangGui(true);
    try {
      const res = await taoTicket({
        tieu_de: tieuDe.trim(),
        noi_dung: noiDung.trim(),
        danh_muc: danhMuc,
      });

      if (res.thanh_cong) {
        toast.success("Tạo yêu cầu hỗ trợ thành công!");
        setMo(false);
        setTieuDe("");
        setNoiDung("");
        router.push(`/ho-tro/${res.du_lieu.id}`);
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể tạo ticket");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <Dialog open={mo} onOpenChange={setMo}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          Gửi yêu cầu mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Gửi yêu cầu hỗ trợ kỹ thuật</DialogTitle>
        </DialogHeader>
        <form onSubmit={xuLyTao} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="danh_muc">Phân loại vấn đề</Label>
            <Select
              value={danhMuc}
              onValueChange={(val) => setDanhMuc(val ?? "khac")}
              disabled={dangGui}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string) =>
                    ({
                      tai_khoan: "Vấn đề tài khoản",
                      thanh_toan: "Thanh toán & Đơn hàng",
                      khoa_hoc: "Khóa học & Bài tập",
                      ky_thuat: "Lỗi kỹ thuật website",
                      khac: "Khác",
                    } as Record<string, string>)[value] ?? value
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tai_khoan">Vấn đề tài khoản</SelectItem>
                <SelectItem value="thanh_toan">Thanh toán & Đơn hàng</SelectItem>
                <SelectItem value="khoa_hoc">Khóa học & Bài tập</SelectItem>
                <SelectItem value="ky_thuat">Lỗi kỹ thuật website</SelectItem>
                <SelectItem value="khac">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tieu_de">Tiêu đề yêu cầu *</Label>
            <Input
              id="tieu_de"
              value={tieuDe}
              onChange={(e) => setTieuDe(e.target.value)}
              placeholder="Tóm tắt ngắn gọn vấn đề cần trợ giúp..."
              disabled={dangGui}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noi_dung">Mô tả chi tiết *</Label>
            <Textarea
              id="noi_dung"
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              placeholder="Mô tả cụ thể sự cố, khóa học liên quan hoặc câu hỏi của bạn..."
              rows={4}
              disabled={dangGui}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMo(false)}
              disabled={dangGui}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={dangGui}>
              {dangGui ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
