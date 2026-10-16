# 🛡️ TÀI LIỆU KỸ THUẬT PHÁT TRIỂN PHÂN HỆ QUẢN TRỊ (ADMIN DASHBOARD)
# NỀN TẢNG HỌC NẤU ĂN TRỰC TUYẾN (WEB HỌC NẤU ĂN ONLINE)

> **Dành cho:** AI Coding Assistant & Full-stack Developers phụ trách Backend/Admin  
> **Mục tiêu:** Hướng dẫn chi tiết kiến trúc, patterns, quy tắc bảo mật và code mẫu thực thi để xây dựng toàn bộ **17 màn hình trung tâm điều hành Quản trị viên (Admin)**.  
> **Ngôn ngữ:** TypeScript (Strict), SQL PostgreSQL, Tiếng Việt  

---

## 📑 MỤC LỤC
1. [Tổng Quan Trung Tâm Điều Hành Quản Trị](#1-tổng-quan-trung-tâm-điều-hành-quản-trị)
2. [Cấu Trúc Thư Mục Phân Hệ Admin](#2-cấu-trúc-thư-mục-phân-hệ-admin)
3. [Đặc Tả Kỹ Thuật 17 Màn Hình Admin](#3-đặc-tả-kỹ-thuật-17-màn-hình-admin)
4. [Các Component Chuyên Biệt Phía Admin](#4-các-component-chuyên-biệt-phía-admin)
5. [Quy Chuẩn Server Actions & Ghi Nhật Ký (Audit Log)](#5-quy-chuẩn-server-actions--ghi-nhật-ký-audit-log)
6. [Quy Trình Duyệt Nâng Cấp Pro & Cấp Gói Thủ Công](#6-quy-trình-duyệt-nâng-cấp-pro--cấp-gói-thủ-công)
7. [Các Patterns Xử Lý Dữ Liệu Lớn (Admin Data Patterns)](#7-các-patterns-xử-lý-dữ-liệu-lớn-admin-data-patterns)
8. [Phân Hệ Báo Cáo & Trực Quan Hóa (Recharts BI)](#8-phân-hệ-báo-cáo--trực-quan-hóa-recharts-bi)
9. [Cấu Hình Nền Tảng (System Configuration)](#9-cấu-hình-nền-tảng-system-configuration)
10. [Bảo Mật Tầng Cao & 4 Quy Tắc Sắt Cho Quản Trị Viên](#10-bảo-mật-tầng-cao--4-quy-tắc-sắt-cho-quản-trị-viên)

---

## 🏛️ 1. Tổng Quan Trung Tâm Điều Hành Quản Trị

Phân hệ Quản trị (`/quan-tri/*`) là "trái tim điều hành" của nền tảng, đảm bảo:
- **Kiểm duyệt nội dung chặt chẽ:** Đảm bảo công thức ẩm thực, bài viết và bình luận luôn chuẩn mực, an toàn và hấp dẫn.
- **Vận hành mô hình Gói Pro:** Giám sát dòng tiền, duyệt nhanh các đơn hàng nâng cấp hội viên qua VNPay và cấp gói linh hoạt.
- **Giám sát vận hành 360 độ:** Theo dõi hoạt động của mọi thành viên, ghi nhận nhật ký thao tác (Audit log) minh bạch và trực quan hóa doanh thu theo thời gian thực.
- **Bố cục giao diện:** Sử dụng bố cục kinh điển **Collapsible Sidebar (Trái) + Topbar thông tin + Main Viewport (Phải)**.

---

## 📂 2. Cấu Trúc Thư Mục Phân Hệ Admin

```text
src/
├── app/
│   └── (quan-tri)/quan-tri/
│       ├── layout.tsx                  # Layout bảo vệ vai trò Admin + Sidebar
│       ├── page.tsx                    # Màn 35: Dashboard KPI tổng quan
│       ├── quan-ly-nguoi-dung/         # Màn 36: Quản lý người dùng & cấp gói
│       ├── quan-ly-dau-bep/            # Màn 37: Quản lý & bổ nhiệm đầu bếp
│       ├── cong-thuc/                  # Màn 38: Duyệt công thức Pro gửi
│       ├── khoa-hoc/                   # Màn 39: Quản lý khóa học
│       ├── quan-ly-goi/                # Màn 40: Danh sách gói Premium
│       │   ├── moi/                    # Màn 41: Tạo gói mới
│       │   └── [id]/sua/               # Màn 42: Chỉnh sửa gói
│       ├── duyet-nang-cap/             # Màn 43: Duyệt yêu cầu Pro
│       ├── danh-muc/                   # Màn 44: Quản lý danh mục món ăn
│       ├── binh-luan/                  # Màn 45: Kiểm duyệt bình luận
│       ├── danh-gia/                   # Màn 46: Quản lý đánh giá sao
│       ├── bai-viet/                   # Màn 47: Quản lý blog ẩm thực
│       ├── thong-bao/                  # Màn 48: Phát thông báo toàn sàn
│       ├── thanh-toan/                 # Màn 49: Quản lý đơn hàng VNPay
│       ├── bao-cao/                    # Màn 50: Báo cáo biểu đồ doanh thu
│       └── cau-hinh/                   # Màn 51: Cấu hình thông tin site & SEO
├── components/quan-tri/                # Components chuyên dụng cho Admin
│   ├── the-thong-ke.tsx                # Thẻ Card hiển thị chỉ số KPI
│   ├── bang-duyet-nang-cap.tsx         # Bảng duyệt đơn hàng Pro
│   ├── modal-cap-goi.tsx               # Modal popup cấp gói Pro thủ công
│   ├── bieu-do-doanh-thu.tsx           # Biểu đồ cột/đường Recharts
│   ├── form-goi.tsx                    # Form thêm/sửa gói cước
│   └── thao-tac-duyet-cong-thuc.tsx    # Nút bấm Duyệt/Từ chối kèm popup lý do
└── lib/actions/
    ├── quan-tri-nguoi-dung.ts          # Actions đổi vai trò, khóa, cấp gói
    ├── quan-tri-goi.ts                 # Actions duyệt/từ chối nâng cấp Pro
    ├── quan-tri-cong-thuc.ts           # Actions duyệt xuất bản công thức
    └── chung.ts                        # canPhien(['admin']), ghiNhatKy
```

---

## 🖥️ 3. Đặc Tả Kỹ Thuật 17 Màn Hình Admin

### 1. Dashboard Trung Tâm (`/quan-tri`)
- **Queries:** Đếm tổng số bản ghi `profiles`, `profiles (chef)`, `cong_thuc`, `cong_thuc (cho_duyet)`, `khoa_hoc`, tổng doanh thu `thanh_toan (da_thanh_toan)`.
- **Hiển thị:** 4 thẻ KPI lớn, biểu đồ doanh thu 12 tháng gần nhất và 2 danh sách chờ duyệt khẩn cấp (Gói Pro & Công thức mới).

### 2. Quản Lý Người Dùng (`/quan-tri/quan-ly-nguoi-dung`)
- **Queries:** `profiles` hỗ trợ phân trang (15 dòng/trang), lọc vai trò (All/User/Chef/Support), tìm kiếm theo tên hoặc email.
- **Thao tác:** Khóa/Mở tài khoản, Đổi vai trò, và nút mở `ModalCapGoi` cấp gói Pro trực tiếp.

### 3. Quản Lý Đầu Bếp (`/quan-tri/quan-ly-dau-bep`)
- **Mục đích:** Danh sách các tài khoản có `vai_tro = 'chef'`, hiển thị số lượng công thức và khóa học đang phụ trách; hỗ trợ bổ nhiệm học viên ưu tú lên đầu bếp.

### 4. Duyệt Công Thức Đóng Góp (`/quan-tri/cong-thuc`)
- **Mục đích:** Tiếp nhận các công thức do Pro User gửi lên (`trang_thai = 'cho_duyet'`).
- **Thao tác:** Xem trước toàn bộ nguyên liệu, ảnh, video; bấm **"Duyệt"** (`trang_thai = 'xuat_ban'`) hoặc **"Từ chối"** (`trang_thai = 'tu_choi'`, gửi lý do về cho tác giả).

### 5. Quản Lý Khóa Học (`/quan-tri/khoa-hoc`)
- **Mục đích:** Danh sách toàn bộ khóa học trên hệ thống, gắn cờ nổi bật hoặc ẩn khóa học vi phạm chất lượng.

### 6. Quản Lý Danh Sách Gói Pro (`/quan-tri/quan-ly-goi`)
- **Mục đích:** Quản lý 2 gói cước cốt lõi (`pro_thang`, `pro_nam`), hiển thị giá, thời hạn ngày, số lượng học viên đang sở hữu và trạng thái kích hoạt.

### 7. Tạo Gói Pro Mới (`/quan-tri/quan-ly-goi/moi`)
- **Mục đích:** Biểu mẫu thêm gói dịch vụ mới vào bảng `goi_premium`.

### 8. Chỉnh Sửa Gói Pro (`/quan-tri/quan-ly-goi/[id]/sua`)
- **Mục đích:** Cập nhật thông tin giá niêm yết, thời hạn và quyền lợi JSON của gói cước.

### 9. Duyệt Yêu Cầu Nâng Cấp Pro (`/quan-tri/duyet-nang-cap`)
- **Mục đích:** Danh sách các yêu cầu `yeu_cau_nang_cap` từ học viên đã chuyển khoản VNPay thành công.
- **Thao tác:** Nút bấm **"Duyệt"** (gọi Action kích hoạt Pro tức thì) hoặc **"Hủy/Từ chối"** kèm lý do.

### 10. Quản Lý Danh Mục (`/quan-tri/danh-muc`)
- **Mục đích:** CRUD 10 danh mục ẩm thực (Món Việt, Món Á, Món Âu, Món Chay, v.v.), kéo thả hoặc cập nhật thứ tự ưu tiên hiển thị.

### 11. Quản Lý Bình Luận (`/quan-tri/binh-luan`)
- **Mục đích:** Giám sát các bình luận mới nhất, xóa mềm các bình luận thô tục, spam link quảng cáo.

### 12. Quản Lý Đánh Giá Sao (`/quan-tri/danh-gia`)
- **Mục đích:** Thống kê phản hồi điểm số 1-5 sao của từng món ăn và khóa học.

### 13. Quản Trị Blog Ẩm Thực (`/quan-tri/bai-viet`)
- **Mục đích:** Soạn thảo, biên tập và xuất bản bài viết tin tức, kiến thức ẩm thực.

### 14. Phát Thông Báo Hệ Thống (`/quan-tri/thong-bao`)
- **Mục đích:** Soạn thông báo toàn sàn (Broadcast) hoặc nhắm riêng nhóm tài khoản Pro.

### 15. Quản Lý Giao Dịch Thanh Toán (`/quan-tri/thanh-toan`)
- **Mục đích:** Tra cứu lịch sử nộp tiền qua cổng VNPay, mã giao dịch ngân hàng, đối soát dòng tiền kế toán.

### 16. Báo Cáo & Thống Kê (`/quan-tri/bao-cao`)
- **Mục đích:** Báo cáo tăng trưởng doanh thu, tỷ lệ chuyển đổi hội viên, biểu đồ tròn phân bố danh mục được quan tâm nhiều nhất.

### 17. Cấu Hình Nền Tảng (`/quan-tri/cau-hinh`)
- **Mục đích:** Quản lý tham số hệ thống trong bảng `cau_hinh_he_thong`: Logo, Tên website, Slogan, Hotline, Email hỗ trợ, tham số cổng VNPay Sandbox.

---

## 🧩 4. Các Component Chuyên Biệt Phía Admin

### 4.1. Bảng Duyệt Nâng Cấp Pro (`BangDuyetNangCap.tsx`)
Hiển thị danh sách các yêu cầu nâng cấp dạng bảng, tích hợp nút bấm Duyệt / Từ chối với phản hồi tức thì:

```typescript
// src/components/quan-tri/BangDuyetNangCap.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { duyetNangCapAction, tuChoiNangCapAction } from "@/lib/actions/quan-tri-goi";

interface YeuCauItem {
  id: string;
  ma_yeu_cau: string;
  ngay_tao: string;
  hoc_vien: { ho_ten: string; email: string };
  goi: { ten: string; gia: number; thoi_han_ngay: number };
  trang_thai: "cho_duyet" | "da_duyet" | "tu_choi";
}

export function BangDuyetNangCap({ danhSachBanDau }: { danhSachBanDau: YeuCauItem[] }) {
  const [danhSach, setDanhSach] = useState(danhSachBanDau);
  const [dangXuLyId, setDangXuLyId] = useState<string | null>(null);

  const xuLyDuyet = async (id: string) => {
    setDangXuLyId(id);
    const res = await duyetNangCapAction(id);
    setDangXuLyId(null);
    if (res.thanh_cong) {
      toast.success("Đã duyệt nâng cấp Pro thành công!");
      setDanhSach((prev) => prev.map((item) => (item.id === id ? { ...item, trang_thai: "da_duyet" } : item)));
    } else {
      toast.error(res.thong_bao_loi);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã YC</TableHead>
          <TableHead>Học viên</TableHead>
          <TableHead>Gói cước</TableHead>
          <TableHead>Số tiền</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {danhSach.map((yc) => (
          <TableRow key={yc.id}>
            <TableCell className="font-semibold">{yc.ma_yeu_cau}</TableCell>
            <TableCell>
              <div className="font-medium">{yc.hoc_vien.ho_ten}</div>
              <div className="text-xs text-muted-foreground">{yc.hoc_vien.email}</div>
            </TableCell>
            <TableCell>{yc.goi.ten} ({yc.goi.thoi_han_ngay} ngày)</TableCell>
            <TableCell className="font-medium text-primary">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(yc.goi.gia)}
            </TableCell>
            <TableCell>
              {yc.trang_thai === "cho_duyet" && <Badge variant="outline" className="text-amber-500 border-amber-500">Chờ duyệt</Badge>}
              {yc.trang_thai === "da_duyet" && <Badge className="bg-emerald-500 text-white">Đã duyệt</Badge>}
              {yc.trang_thai === "tu_choi" && <Badge variant="destructive">Từ chối</Badge>}
            </TableCell>
            <TableCell className="text-right space-x-2">
              {yc.trang_thai === "cho_duyet" && (
                <>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={dangXuLyId === yc.id}
                    onClick={() => xuLyDuyet(yc.id)}
                  >
                    {dangXuLyId === yc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                    Duyệt
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 4.2. Modal Cấp Gói Pro Thủ Công (`ModalCapGoi.tsx`)
Cho phép Admin chọn bất kỳ người dùng nào để tặng gói Pro Tháng hoặc Pro Năm kèm ghi chú lưu vết:

```typescript
// src/components/quan-tri/ModalCapGoi.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { capGoiThuCongAction } from "@/lib/actions/quan-tri-goi";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; ho_ten: string; email: string };
}

export function ModalCapGoi({ open, onOpenChange, user }: Props) {
  const [maGoi, setMaGoi] = useState<"pro_thang" | "pro_nam">("pro_thang");
  const [ghiChu, setGhiChu] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const res = await capGoiThuCongAction({
      nguoiDungId: user.id,
      maGoi,
      ghiChu: ghiChu || "Admin cấp trực tiếp từ trang quản lý người dùng",
    });
    setLoading(false);
    if (res.thanh_cong) {
      toast.success(`Đã cấp thành công gói Pro cho ${user.ho_ten}!`);
      onOpenChange(false);
    } else {
      toast.error(res.thong_bao_loi);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Cấp Gói Pro Cho Học Viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Học viên nhận: <strong className="text-foreground">{user.ho_ten}</strong> ({user.email})
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Chọn gói nâng cấp</label>
            <Select value={maGoi} onValueChange={(v: any) => setMaGoi(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pro_thang">Pro Tháng (Thời hạn 30 ngày)</SelectItem>
                <SelectItem value="pro_nam">Pro Năm (Thời hạn 365 ngày)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Lý do / Ghi chú kiểm toán</label>
            <Textarea
              placeholder="VD: Học bổng khuyến học tháng 10 / Quà tặng sự kiện..."
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy bỏ</Button>
          <Button onClick={onSubmit} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Xác nhận cấp gói
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🔒 5. Quy Chuẩn Server Actions & Ghi Nhật Ký (Audit Log)

Mọi Server Action trong phân hệ Admin bắt buộc phải thông qua lớp bảo vệ 3 bước:
1. **Xác thực quyền Admin:** Gọi hàm `canPhien(["admin"])`.
2. **Ghi nhật ký hệ thống:** Gọi hàm `ghiNhatKy()`.
3. **Làm mới dữ liệu trang:** Gọi `revalidatePath()`.

```typescript
// src/lib/actions/quan-tri-goi.ts
"use server";

import { revalidatePath } from "next/cache";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { canPhien, ghiNhatKy } from "@/lib/actions/chung";
import { thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";

// 1. DUYỆT YÊU CẦU NÂNG CẤP PRO
export async function duyetNangCapAction(yeuCauId: string): Promise<KetQua<boolean>> {
  try {
    const { supabase, nguoiDungId: adminId } = await canPhien(["admin"]);

    // Cập nhật trạng thái yêu cầu sang 'da_duyet'
    // Trigger database trg_xu_ly_duyet_nang_cap sẽ tự động:
    // - profiles.la_pro = true
    // - profiles.goi_het_han = now() + 30/365d
    // - Thêm vào goi_nguoi_dung
    // - Bắn thông báo Realtime cho học viên
    const { data: yc, error } = await supabase
      .from("yeu_cau_nang_cap")
      .update({
        trang_thai: "da_duyet",
        nguoi_duyet_id: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", yeuCauId)
      .select("*, goi:goi_premium(ten)")
      .single();

    if (error || !yc) return thatBai("Lỗi phê duyệt: " + error?.message);

    // Ghi nhật ký kiểm toán (Audit Log)
    await ghiNhatKy(supabase, adminId, "duyet_nang_cap_pro", "yeu_cau_nang_cap", yeuCauId, {
      hoc_vien_id: yc.nguoi_dung_id,
      ma_yeu_cau: yc.ma_yeu_cau,
      goi: yc.goi?.ten,
    });

    revalidatePath("/quan-tri/duyet-nang-cap");
    revalidatePath("/quan-tri");
    return thanhCong(true);
  } catch (e: any) {
    return thatBai(e.message || "Lỗi máy chủ khi duyệt yêu cầu.");
  }
}

// 2. CẤP GÓI PRO THỦ CÔNG
export async function capGoiThuCongAction({
  nguoiDungId,
  maGoi,
  ghiChu,
}: {
  nguoiDungId: string;
  maGoi: "pro_thang" | "pro_nam";
  ghiChu: string;
}): Promise<KetQua<boolean>> {
  try {
    const { supabase, nguoiDungId: adminId } = await canPhien(["admin"]);

    // Lấy thông tin gói
    const { data: goi } = await supabase.from("goi_premium").select("*").eq("ma_goi", maGoi).single();
    if (!goi) return thatBai("Gói cước không tồn tại.");

    // Kiểm tra hạn hiện tại để cộng dồn
    const { data: hs } = await supabase.from("profiles").select("goi_het_han").eq("id", nguoiDungId).single();
    let batDau = new Date();
    if (hs?.goi_het_han && new Date(hs.goi_het_han) > new Date()) {
      batDau = new Date(hs.goi_het_han);
    }
    const hetHan = new Date(batDau.getTime() + goi.thoi_han_ngay * 24 * 60 * 60 * 1000);

    // Cập nhật profile
    await supabase.from("profiles").update({
      la_pro: true,
      goi_hien_tai_id: goi.id,
      goi_het_han: hetHan.toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("id", nguoiDungId);

    // Thêm lịch sử gói người dùng
    await supabase.from("goi_nguoi_dung").insert({
      nguoi_dung_id: nguoiDungId,
      goi_id: goi.id,
      ngay_bat_dau: batDau.toISOString(),
      ngay_het_han: hetHan.toISOString(),
      trang_thai: "hoat_dong",
      cap_boi_admin: true,
      ghi_chu: ghiChu,
    });

    // Gửi thông báo chuông cho học viên
    await supabase.from("thong_bao").insert({
      nguoi_dung_id: nguoiDungId,
      tieu_de: "🎉 Bạn đã được cấp gói " + goi.ten,
      noi_dung: "Quản trị viên đã cấp gói hội viên Pro cho tài khoản của bạn. Hạn dùng đến: " + hetHan.toLocaleDateString("vi-VN"),
      loai: "he_thong",
      lien_ket: "/goi-cua-toi",
    });

    // Audit log
    await ghiNhatKy(supabase, adminId, "cap_goi_thu_cong", "profiles", nguoiDungId, {
      goi: goi.ten,
      ngay_het_han: hetHan.toISOString(),
      ghi_chu: ghiChu,
    });

    revalidatePath("/quan-tri/quan-ly-nguoi-dung");
    return thanhCong(true);
  } catch (e: any) {
    return thatBai(e.message || "Lỗi khi cấp gói.");
  }
}
```

---

## ⚡ 6. Quy Trình Duyệt Nâng Cấp Pro & Cấp Gói Thủ Công

Hệ thống kết hợp hoàn hảo giữa **Server Action** và **PostgreSQL Triggers**:
- Khi Quản trị viên bấm Duyệt trong giao diện, Server Action chỉ cần cập nhật `yeu_cau_nang_cap.trang_thai = 'da_duyet'`.
- Database Trigger `trg_xu_ly_duyet_nang_cap` trong file migration [supabase/migrations/003_goi_premium.sql](file:///d:/web-hoc-nau-an/supabase/migrations/003_goi_premium.sql) sẽ nguyên tử hóa (Atomic Transaction):
  1. Đọc số ngày hiệu lực của gói (`30` hoặc `365` ngày).
  2. Kiểm tra nếu học viên đang có hạn Pro cũ thì nối tiếp từ mốc cũ.
  3. Bật cờ `la_pro = true` trong bảng `profiles`.
  4. Ghi bản ghi vào bảng `goi_nguoi_dung`.
  5. Cập nhật bảng cache quyền `quyen_nguoi_dung`.
  6. Tự động chèn thông báo chuông vào bảng `thong_bao`.

---

## 📈 7. Các Patterns Xử Lý Dữ Liệu Lớn (Admin Data Patterns)

1. **Phân trang tầng Server (Server-side Pagination):** Không bao giờ `select(*)` toàn bộ database. Luôn sử dụng `.range(from, to)` kết hợp `{ count: "exact" }`.
2. **Lọc đa điều kiện phối hợp (Compound Filters):** Kết hợp đồng thời Search text (`ilike`), Vai trò (`eq`), Trạng thái (`eq`) và Khoảng ngày (`gte`, `lte`).
3. **Thao tác hàng loạt (Bulk Actions):** Chọn nhiều checkbox cùng lúc để phê duyệt hàng loạt hoặc gửi thông báo chung.

---

## 📊 8. Phân Hệ Báo Cáo & Trực Quan Hóa (Recharts BI)

Phân hệ sử dụng thư viện `recharts` để vẽ biểu đồ tại `/quan-tri/bao-cao` và `/quan-tri`:
- **Biểu đồ đường (AreaChart / LineChart):** Doanh thu theo tháng từ 2 gói Pro Tháng và Pro Năm.
- **Biểu đồ cột (BarChart):** Top 10 công thức ẩm thực có lượt xem và lượt lưu cao nhất.
- **Biểu đồ tròn (PieChart):** Cơ cấu người dùng (Tỷ lệ học viên Free vs học viên Pro).

---

## ⚙️ 9. Cấu Hình Nền Tảng (System Configuration)

Bảng `cau_hinh_he_thong` lưu trữ cấu hình dưới dạng cặp `(khoa, gia_tri, loai_du_lieu)`:
- `thong_tin_site`: Tên platform, slogan, hotline, email liên hệ.
- `seo_mac_dinh`: Title template, meta description, keywords toàn trang.
- `vnpay_config`: Mã TmnCode, URL môi trường Sandbox/Production.
- `tinh_nang_pro`: Bật/tắt các quyền lợi của gói Pro.

---

## 🛡️ 10. Bảo Mật Tầng Cao & 4 Quy Tắc Sắt Cho Quản Trị Viên

Để ngăn chặn lỗi vận hành và tấn công leo thang đặc quyền, hệ thống thiết lập **4 QUY TẮC SẮT**:

1. **[AR-01] Chống tự tước quyền quản trị:** Admin đang đăng nhập tuyệt đối không thể tự hạ cấp vai trò của chính mình (`admin` ➜ `user`).
2. **[AR-02] Chống tự khóa tài khoản:** Admin không thể bấm nút khóa tài khoản của chính mình.
3. **[AR-03] Bắt buộc ghi Audit Log:** Mọi thao tác làm thay đổi dữ liệu bảng (Thêm/Sửa/Xóa/Duyệt) bắt buộc phải ghi 1 bản ghi vào `nhat_ky_hoat_dong`.
4. **[AR-04] Tuyệt đối chỉ xóa mềm (Soft Delete):** Mọi thao tác xóa dữ liệu cốt lõi (User, Công thức, Khóa học) chỉ cập nhật `deleted_at = now()`, không thực thi lệnh `DELETE FROM` vật lý.
