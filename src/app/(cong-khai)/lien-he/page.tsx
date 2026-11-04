"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function TrangLienHe() {
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [chuDe, setChuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [dangGui, setDangGui] = useState(false);

  const xuLyGui = async (e: React.FormEvent) => {
    e.preventDefault();
    setDangGui(true);
    try {
      const res = await fetch("/api/lien-he", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ho_ten: hoTen,
          email,
          chu_de: chuDe,
          noi_dung: noiDung,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.thanh_cong) {
        throw new Error(data.loi || "Không thể gửi tin nhắn liên hệ");
      }

      toast.success(data.thong_diep || "Cảm ơn bạn đã liên hệ!");
      setHoTen("");
      setEmail("");
      setChuDe("");
      setNoiDung("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      toast.error(msg);
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Liên hệ với chúng tôi</h1>
        <p className="text-sm text-muted-foreground">
          Bạn có câu hỏi, đề xuất hợp tác hoặc cần hỗ trợ? Hãy gửi lời nhắn cho chúng tôi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* THÔNG TIN LIÊN HỆ */}
        <div className="space-y-4">
          <Card className="p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">hotro@hocnauan.online</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Hotline</p>
                <p className="text-sm font-medium text-foreground">1900 6868 (8:00 - 20:00)</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Địa chỉ</p>
                <p className="text-sm font-medium text-foreground">
                  Tòa nhà Innovation, Khu Công nghệ cao, TP. Hồ Chí Minh
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* FORM LIÊN HỆ */}
        <div className="md:col-span-2">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <form onSubmit={xuLyGui} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ho_ten">Họ và tên</Label>
                    <Input
                      id="ho_ten"
                      required
                      value={hoTen}
                      onChange={(e) => setHoTen(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      disabled={dangGui}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ban@example.com"
                      disabled={dangGui}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chu_de">Chủ đề</Label>
                  <Input
                    id="chu_de"
                    required
                    value={chuDe}
                    onChange={(e) => setChuDe(e.target.value)}
                    placeholder="Hỏi về khóa học, hợp tác đầu bếp..."
                    disabled={dangGui}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noi_dung">Nội dung tin nhắn</Label>
                  <Textarea
                    id="noi_dung"
                    required
                    rows={4}
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                    placeholder="Chi tiết câu hỏi của bạn..."
                    disabled={dangGui}
                  />
                </div>

                <Button type="submit" disabled={dangGui} className="w-full gap-2">
                  {dangGui ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Gửi tin nhắn liên hệ
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
