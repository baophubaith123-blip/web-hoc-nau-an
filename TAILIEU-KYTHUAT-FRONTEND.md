# 💻 TÀI LIỆU KỸ THUẬT PHÁT TRIỂN PHÍA FRONTEND
# NỀN TẢNG HỌC NẤU ĂN TRỰC TUYẾN (WEB HỌC NẤU ĂN ONLINE)

> **Dành cho:** AI Coding Assistant & Frontend Developers  
> **Mục tiêu:** Hướng dẫn chi tiết kiến trúc kỹ thuật, quy tắc code, patterns và ví dụ mã nguồn chuẩn mực để xây dựng các phân hệ người dùng (Guest, User, Pro User, Chef, Support).  
> **Ngôn ngữ:** TypeScript (Strict), Tiếng Việt  

---

## 📑 MỤC LỤC
1. [Tech Stack Frontend Chi Tiết](#1-tech-stack-frontend-chi-tiết)
2. [Cấu Trúc Thư Mục Frontend Chuẩn Hóa](#2-cấu-trúc-thư-mục-frontend-chuẩn-hóa)
3. [Quy Tắc Lập Trình Frontend Cốt Lõi](#3-quy-tắc-lập-trình-frontend-cốt-lõi)
4. [Các Module Tính Năng Trọng Tâm](#4-các-module-tính-năng-trọng-tâm)
5. [Quy Chuẩn Xây Dựng Component (Component Patterns)](#5-quy-chuẩn-xây-dựng-component-component-patterns)
6. [Quy Chuẩn Custom Hooks & State Management](#6-quy-chuẩn-custom-hooks--state-management)
7. [Mô Hình Xử Lý Đột Biến Dữ Liệu (Server Actions Pattern)](#7-mô-hình-xử-lý-đột-biến-dữ-liệu-server-actions-pattern)
8. [Đa Ngôn Ngữ (i18n Pattern)](#8-đa-ngôn-ngữ-i18n-pattern)
9. [Bảo Mật Phía Client & Trợ Năng](#9-bảo-mật-phía-client--trợ-năng)
10. [Tối Ưu Hóa Hiệu Năng & Best Practices](#10-tối-ưu-hóa-hiệu-năng--best-practices)

---

## 🛠️ 1. Tech Stack Frontend Chi Tiết

| Công nghệ | Phiên bản | Vai trò & Đặc điểm kỹ thuật |
|---|---|---|
| **Next.js** | 15.x | Framework nền tảng với App Router, React Server Components (RSC) và Server Actions. |
| **React** | 19.x | Thư viện UI hiện đại, hỗ trợ native `useActionState`, `useOptimistic`, Actions async. |
| **TypeScript** | 5.x | Strict Type-Safety 100%, tuyệt đối không sử dụng `any`, định nghĩa kiểu từ Database Types. |
| **Tailwind CSS** | v4.x | Styling hiệu năng cao, import `@import "tailwindcss";` trong `globals.css` (không dùng `tailwind.config.js`). |
| **shadcn/ui** | Base UI | Preset Nova (Lucide icons / Geist font), tùy biến component trực tiếp trong mã nguồn. |
| **TanStack Query** | v5.x | Quản trị Server State tại Client, cache dữ liệu và tự động làm mới khi cần. |
| **Zustand** | v5.x | Quản trị Client App State (trạng thái mở modal, giỏ hàng, thông tin tạm). |
| **React Hook Form + Zod** | v7 + Zod 4 | Quản lý form hiệu năng cao, validate schema đầu vào chặt chẽ. |
| **next-themes** | v0.4+ | Quản lý Dark/Light mode chống nhấp nháy giao diện khi Hydration. |
| **Supabase Client / SSR** | `@supabase/ssr` | Đồng bộ phiên qua cookie HttpOnly an toàn giữa Client, Server và Middleware. |
| **Sonner** | v1.x | Toast thông báo trạng thái hiện đại, mượt mà ở góc màn hình. |

---

## 📂 2. Cấu Trúc Thư Mục Frontend Chuẩn Hóa

```text
src/
├── app/                                # App Router phân nhóm theo Route Groups
│   ├── (cong-khai)/                    # Không yêu cầu đăng nhập
│   │   ├── layout.tsx                  # Public Header + Footer
│   │   ├── page.tsx                    # Trang chủ (/)
│   │   ├── cong-thuc/                  # /cong-thuc và /cong-thuc/[slug]
│   │   ├── khoa-hoc/                   # /khoa-hoc và /khoa-hoc/[slug]
│   │   ├── dau-bep/                    # /dau-bep và /dau-bep/[username]
│   │   ├── bai-viet/                   # /bai-viet và /bai-viet/[slug]
│   │   ├── bang-gia/                   # /bang-gia (Tiếp thị gói Pro)
│   │   ├── dang-nhap/                  # /dang-nhap
│   │   ├── dang-ky/                    # /dang-ky
│   │   └── quen-mat-khau/              # /quen-mat-khau
│   ├── (nguoi-dung)/                   # Yêu cầu đăng nhập (Học viên)
│   │   ├── layout.tsx                  # Dashboard Header + User Sidebar
│   │   ├── bang-dieu-khien/            # /bang-dieu-khien
│   │   ├── ho-so/                      # /ho-so
│   │   ├── cong-thuc-cua-toi/          # /cong-thuc-cua-toi
│   │   ├── khoa-hoc-cua-toi/           # /khoa-hoc-cua-toi
│   │   ├── hoc-bai/[slug]/             # /hoc-bai/[slug] (Phòng học HD)
│   │   ├── chung-chi/                  # /chung-chi
│   │   ├── tao-cong-thuc/              # /tao-cong-thuc (Chặn nếu không phải Pro)
│   │   ├── cong-thuc-da-gui/           # /cong-thuc-da-gui
│   │   ├── nang-cap-pro/               # /nang-cap-pro (Mua gói qua VNPay)
│   │   ├── goi-cua-toi/                # /goi-cua-toi
│   │   └── ho-tro/                     # /ho-tro (Gửi ticket)
│   ├── (dau-bep)/bep/                  # Giao diện dành riêng cho Chef
│   ├── (ho-tro)/nhan-vien/             # Giao diện dành riêng cho Support
│   └── api/                            # REST Endpoints / Webhooks (VNPay, Auth Callback)
├── components/                         # Thư viện component UI tái sử dụng
│   ├── ui/                             # shadcn/ui nguyên bản
│   ├── cong-thuc/                      # TheCongThuc, BoLocCongThuc, NguyenLieuScale
│   ├── khoa-hoc/                       # TheKhoaHoc, TrinhPhatYouTube, BaiTapTracNghiem
│   ├── goi/                            # TheGoi, BangSoSanh, BadgePro, NutNangCap
│   ├── binh-luan/                      # KhuBinhLuan, DanhGiaSao, BinhLuanItem
│   └── bo-cuc/                         # Header, Footer, Sidebar, UserMenu
├── hooks/                              # Custom React Hooks
│   ├── use-auth.ts                     # Hook phiên người dùng
│   ├── use-thong-bao-realtime.ts       # Hook lắng nghe chuông thông báo Realtime
│   └── use-debounce.ts                 # Hook chống spam tìm kiếm
├── lib/                                # Logic lõi, kết nối DB & Utilities
│   ├── actions/                        # Server Actions (auth, cong-thuc, goi, khoa-hoc)
│   ├── supabase/                       # client.ts, server.ts, middleware.ts
│   ├── validations/                    # Zod schemas (auth.ts, cong-thuc.ts, goi.ts)
│   └── utils/                          # dinh-dang.ts, phan-hoi-loi.ts, vai-tro.ts
└── providers/                          # Root context wrappers
    ├── query-provider.tsx              # TanStack Query Client
    ├── theme-provider.tsx              # next-themes Dark mode
    └── toast-provider.tsx              # Sonner Toaster
```

---

## 📐 3. Quy Tắc Lập Trình Frontend Cốt Lõi

### 3.1. Phân Định Server Component vs Client Component
- **Mặc định toàn bộ Page & Layout là React Server Component (RSC):**
  - Thực hiện Data Fetching trực tiếp trong component bất đồng bộ (`async/await`).
  - Truy cập cơ sở dữ liệu qua `taoSupabaseServer()` mà không để lộ khóa bí mật hay gây phình bundle Javascript phía trình duyệt.
- **Chỉ sử dụng Client Component (`"use client"`) khi:**
  1. Cần lắng nghe sự kiện tương tác người dùng: `onClick`, `onChange`, `onSubmit`.
  2. Cần sử dụng React State hoặc Lifecycle: `useState`, `useEffect`, `useRef`.
  3. Cần sử dụng Browser APIs: `window`, `localStorage`, `navigator`.
  4. Sử dụng Custom Hooks: `useRouter`, `useSearchParams`, `useQuery`.

### 3.2. Mô Hình Truy Vấn Dữ Liệu Chuẩn (Data Fetching Pattern)

```typescript
// src/app/(cong-khai)/cong-thuc/[slug]/page.tsx (Server Component)
import { notFound } from "next/navigation";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { TrinhPhatYouTube } from "@/components/khoa-hoc/trinh-phat-youtube";
import { NguyenLieuScale } from "@/components/cong-thuc/nguyen-lieu-scale";
import { NutLuuCongThuc } from "@/components/cong-thuc/nut-luu-cong-thuc"; // Client Component

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ChiTietCongThucPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await taoSupabaseServer();

  // Truy vấn song song dữ liệu trên Server
  const { data: congThuc, error } = await supabase
    .from("cong_thuc")
    .select("*, tac_gia:profiles(id, ho_ten, avatar_url)")
    .eq("slug", slug)
    .eq("trang_thai", "xuat_ban")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !congThuc) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">{congThuc.tieu_de}</h1>
        <NutLuuCongThuc congThucId={congThuc.id} />
      </div>

      {congThuc.video_url && (
        <TrinhPhatYouTube url={congThuc.video_url} tieuDe={congThuc.tieu_de} />
      )}

      <NguyenLieuScale 
        nguyenLieuGoc={congThuc.nguyen_lieu} 
        khauPhanGoc={congThuc.khau_phan} 
      />
    </article>
  );
}
```

---

## 🧩 4. Các Module Tính Năng Trọng Tâm

### 4.1. Module Gói Hội Viên Pro (Subscription & Paywall)
- **Kiểm soát rào cản tính năng (Feature Gate):**
  - Hiển thị badge vàng `BadgePro` cạnh tên tác giả.
  - Video HD 1080p và tài liệu PDF chỉ mở khi `profile.la_pro === true`.
  - Nút **"Tạo công thức"** trên Navigation chỉ render khi là Pro User, Chef hoặc Admin.

```typescript
// src/components/goi/NutNangCap.tsx
"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NutNangCapProps {
  maGoi?: "pro_thang" | "pro_nam";
  className?: string;
}

export function NutNangCap({ maGoi = "pro_nam", className }: NutNangCapProps) {
  return (
    <Button asChild className={`bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold shadow-md ${className}`}>
      <Link href={`/nang-cap-pro?goi=${maGoi}`}>
        <Crown className="mr-2 h-4 w-4" />
        Nâng cấp Pro ngay
      </Link>
    </Button>
  );
}
```

### 4.2. Module Co Giãn Khẩu Phần & Nguyên Liệu (Recipe Scaler)
- Cho phép người nấu tùy chỉnh số người ăn từ 1 đến 50.
- Tự động tính toán lại định lượng chính xác theo thời gian thực tại Client:

```typescript
// src/components/cong-thuc/nguyen-lieu-scale.tsx
"use client";

import { useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NguyenLieu } from "@/types";

interface Props {
  nguyenLieuGoc: NguyenLieu[];
  khauPhanGoc: number;
}

export function NguyenLieuScale({ nguyenLieuGoc, khauPhanGoc }: Props) {
  const [khauPhan, setKhauPhan] = useState(khauPhanGoc);
  const tyLe = khauPhan / khauPhanGoc;

  return (
    <div className="rounded-xl border p-6 bg-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Nguyên liệu chuẩn bị
        </h3>
        <div className="flex items-center gap-3 bg-muted p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            disabled={khauPhan <= 1}
            onClick={() => setKhauPhan((p) => Math.max(1, p - 1))}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="font-semibold text-sm px-1">{khauPhan} người</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            disabled={khauPhan >= 50}
            onClick={() => setKhauPhan((p) => Math.min(50, p + 1))}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ul className="divide-y text-sm">
        {nguyenLieuGoc.map((nl, idx) => {
          const soLuongMoi = Math.round(nl.so_luong * tyLe * 10) / 10;
          return (
            <li key={idx} className="py-2.5 flex justify-between items-center">
              <span className="text-foreground">{nl.ten}</span>
              <span className="font-medium text-primary">
                {soLuongMoi} {nl.don_vi}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

---

## ⚡ 5. Quy Chuẩn Xây Dựng Component (Component Patterns)

Mọi Component trong thư mục `src/components/` phải tuân thủ nghiêm ngặt 4 nguyên tắc:
1. **Khởi tạo Interface Props rõ ràng:** Định nghĩa kiểu đầu vào minh bạch, có comment hướng dẫn nếu cần.
2. **Không bọc `"use client"` bừa bãi:** Tách nhỏ phần tương tác thành các micro-component con để giữ component cha là Server Component.
3. **Sử dụng `cn()` để gộp lớp CSS:** Sử dụng tiện ích `cn(clsx, twMerge)` chuẩn để tránh xung đột class Tailwind.
4. **Hỗ trợ trạng thái Empty và Skeleton:** Luôn xử lý trường hợp mảng rỗng và hiển thị khung xương khi tải.

---

## 🔄 6. Quy Chuẩn Custom Hooks & State Management

### 6.1. Hook Lắng Nghe Thông Báo Realtime (Supabase Realtime)

```typescript
// src/hooks/use-thong-bao-realtime.ts
"use client";

import { useEffect, useState } from "react";
import { taoSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Bang } from "@/types";

type ThongBao = Bang<"thong_bao">;

export function useThongBaoRealtime(userId: string | null) {
  const [danhSach, setDanhSach] = useState<ThongBao[]>([]);
  const [soChuaDoc, setSoChuaDoc] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const supabase = taoSupabaseClient();

    // 1. Lắng nghe bản ghi mới được INSERT cho chính userId này
    const channel = supabase
      .channel(`thong_bao:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "thong_bao",
          filter: `nguoi_dung_id=eq.${userId}`,
        },
        (payload) => {
          const tbMoi = payload.new as ThongBao;
          setDanhSach((prev) => [tbMoi, ...prev]);
          setSoChuaDoc((c) => c + 1);
          toast.info(tbMoi.tieu_de, {
            description: tbMoi.noi_dung,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { danhSach, soChuaDoc, setSoChuaDoc };
}
```

---

## 🚀 7. Mô Hình Xử Lý Đột Biến Dữ Liệu (Server Actions Pattern)

Mọi thao tác thay đổi cơ sở dữ liệu (Insert, Update, Delete) bắt buộc phải thực hiện qua **Server Actions** với kiểu trả về thống nhất `KetQua<T>`.

### 7.1. Cấu Trúc Trả Về Chuẩn Hóa
```typescript
// src/lib/utils/phan-hoi-loi.ts
export type KetQua<T> =
  | { thanh_cong: true; du_lieu: T }
  | { thanh_cong: false; thong_bao_loi: string; chi_tiet?: unknown };

export const thanhCong = <T>(du_lieu: T): KetQua<T> => ({
  thanh_cong: true,
  du_lieu,
});

export const thatBai = (thong_bao_loi: string, chi_tiet?: unknown): KetQua<never> => ({
  thanh_cong: false,
  thong_bao_loi,
  chi_tiet,
});
```

### 7.2. Ví Dụ Action Đăng Công Thức Phía Server
```typescript
// src/lib/actions/cong-thuc.ts
"use server";

import { revalidatePath } from "next/cache";
import { taoSupabaseServer, layPhienHienTai } from "@/lib/supabase/server";
import { congThucSchema } from "@/lib/validations/cong-thuc";
import { thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";

export async function taoCongThucAction(dauVao: unknown): Promise<KetQua<{ id: string }>> {
  try {
    const phien = await layPhienHienTai();
    if (!phien) return thatBai("Bạn cần đăng nhập để thực hiện thao tác này.");

    // Kiểm tra quyền: Phải là Pro User, Chef hoặc Admin
    const laPro = phien.profile.la_pro && phien.profile.goi_het_han && new Date(phien.profile.goi_het_han) > new Date();
    const laDauBep = phien.profile.vai_tro === "chef" || phien.profile.vai_tro === "admin";
    if (!laPro && !laDauBep) {
      return thatBai("Tính năng tạo công thức chỉ dành riêng cho thành viên gói Pro.");
    }

    // Validate dữ liệu bằng Zod 4
    const d = congThucSchema.parse(dauVao);
    const supabase = await taoSupabaseServer();

    // Chef đăng là xuất bản ngay, Pro User gửi là chờ duyệt
    const trangThai = laDauBep ? "xuat_ban" : "cho_duyet";

    const { data, error } = await supabase
      .from("cong_thuc")
      .insert({
        ...d,
        tac_gia_id: phien.user.id,
        tac_gia_la_pro: laPro,
        trang_thai: trangThai,
      })
      .select("id")
      .single();

    if (error) return thatBai("Lỗi lưu dữ liệu: " + error.message);

    revalidatePath("/cong-thuc");
    revalidatePath("/bang-dieu-khien");
    return thanhCong({ id: data.id });
  } catch (e: any) {
    return thatBai(e.message || "Đã xảy ra lỗi không mong muốn.");
  }
}
```

---

## 🌐 8. Đa Ngôn Ngữ (i18n Pattern)

- Hệ thống mặc định 100% tiếng Việt có dấu.
- Mọi chuỗi thông báo, nhãn nhãn, thông điệp lỗi được tập trung tại file `src/lib/i18n/vi.ts`.
- Sử dụng hàm trợ giúp `t(key)` để đảm bảo nhất quán và dễ dàng bảo trì hoặc mở rộng sang tiếng Anh sau này.

---

## 🔒 9. Bảo Mật Phía Client & Trợ Năng

1. **Chống lộ lọt thông tin:** Tuyệt đối không import `SUPABASE_SERVICE_ROLE_KEY` hoặc các biến môi trường bí mật trong Client Component.
2. **Kiểm soát Middleware tại Edge:** [src/middleware.ts](file:///d:/web-hoc-nau-an/src/middleware.ts) đảm nhận vai trò chốt chặn đầu tiên:
   - Chặn khách vào các route `/bang-dieu-khien`, `/ho-so`, `/hoc-bai/*`.
   - Chặn học viên thường vào `/tao-cong-thuc` (chuyển hướng sang `/nang-cap-pro`).
   - Chặn truy cập trái vai trò vào `/quan-tri/*`, `/bep/*`, `/nhan-vien/*`.
3. **Sanitize mã độc:** Khi hiển thị nội dung rich text bài viết blog, luôn sử dụng thư viện DOMPurify hoặc component Renderer an toàn để ngăn chặn tấn công XSS.

---

## ⚡ 10. Tối Ưu Hóa Hiệu Năng (Performance Best Practices)

- **Hình ảnh sắc nét & nhẹ:** 100% hình ảnh dùng `next/image`, cung cấp đầy đủ `sizes` và thiết lập `priority` cho hình ảnh Hero trên màn hình đầu tiên.
- **Dynamic Imports:** Sử dụng `next/dynamic` cho các module nặng như trình soạn thảo rich-text hoặc thư viện vẽ biểu đồ `recharts` để giảm thiểu kích thước bundle JavaScript ban đầu.
- **Debounce Input Tìm Kiếm:** Áp dụng hook `useDebounce` (300ms) trên các ô tìm kiếm công thức để tránh gửi liên tục các request không cần thiết tới server.
