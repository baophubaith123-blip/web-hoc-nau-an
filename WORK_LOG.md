# 📝 WORK LOG — Web Học Nấu Ăn Online

> **Mục đích:** Lưu lịch sử làm việc để chuyển đổi giữa các AI tool (Claude ↔ Antigravity ↔ Cursor) mà không mất context.
> **Cập nhật lần cuối:** 05/11/2026
> **Cập nhật bởi:** Muse (Đợt nâng cấp giao diện + trang cá nhân/Pro + seed nội dung đợt 2 — xem mục cuối file)

---

## 📌 THÔNG TIN DỰ ÁN

| Mục | Giá trị |
|-----|---------|
| **Tên** | Web học nấu ăn online |
| **Loại** | Đồ án tốt nghiệp |
| **Sinh viên** | [Điền tên] |
| **MSSV** | [Điền MSSV] |
| **GVHD** | [Điền tên GV] |
| **Ngày bắt đầu** | [Điền] |
| **Deadline** | [Điền] |
| **Project path** | `D:\web-hoc-nau-an\` |
| **Supabase Project ID** | `qvsrkxnqeylwtyggyxly` |
| **Supabase URL** | `https://qvsrkxnqeylwtyggyxly.supabase.co` |

---

## 🛠️ TECH STACK ĐÃ CHỐT

| Layer | Công nghệ |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Ngôn ngữ | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (Base UI + Nova preset) |
| Backend/DB | Supabase (Auth, PostgreSQL, Storage, Realtime) |
| State | TanStack Query + Zustand |
| Form | React Hook Form + Zod 4 |
| Dark Mode | next-themes |
| i18n | i18next + react-i18next (mặc định vi) |
| Email | Resend |
| Video | YouTube Embed |
| Realtime | Supabase Realtime |
| Deploy | Vercel + Supabase Cloud |

---

## ✅ TRẠNG THÁI HIỆN TẠI

### GIAI ĐOẠN 1: SETUP — HOÀN THÀNH 90%

- [x] Khởi tạo Next.js 15 project
- [x] Cài shadcn/ui (Base UI + Nova preset: Lucide/Geist)
- [x] Tạo Supabase project (region Singapore)
- [x] Lấy API keys (Publishable + Secret)
- [x] Bật Email provider
- [x] Chạy migration SQL — **20 bảng đã tạo thành công**
- [x] Xác nhận "Success. No rows returned"
- [ ] Cấu hình URL Configuration (**cần làm**)
- [ ] Tạo 4 Storage buckets: avatars, cong-thuc, khoa-hoc, bai-viet (**cần làm**)
- [ ] Tạo file `.env.local` (**cần làm**)
- [ ] Generate TypeScript types (**cần làm**)
- [ ] Tạo Supabase clients (client.ts, server.ts, middleware.ts, admin.ts) (**cần làm**)
- [ ] Test kết nối + chạy `npm run dev` (**cần làm**)

### GIAI ĐOẠN 4A: ZOD VALIDATIONS — ✅ HOÀN THÀNH

**File đã tạo:**
- [x] `src/lib/validations/chung.ts` — Hàm dùng chung (vanBan, vanBanTuyChon, idUuid, urlBatBuoc, urlTuyChon, linkYoutubeTuyChon, soNguyen)
- [x] `src/lib/validations/auth.ts` — Đăng nhập, đăng ký, quên/đặt lại mật khẩu
- [x] `src/lib/validations/cong-thuc.ts` — Công thức + từ chối công thức
- [x] `src/lib/validations/khoa-hoc.ts` — Khóa học, bài học, tài liệu, bài tập
- [x] `src/lib/validations/binh-luan.ts` — Bình luận, đánh giá, báo cáo
- [x] `src/lib/validations/ticket.ts` — Ticket, tin nhắn, liên hệ
- [x] `src/lib/validations/ho-so.ts` — Hồ sơ, đổi mật khẩu
- [x] `src/lib/validations/bai-viet.ts` — Bài viết blog
- [x] `src/lib/validations/quan-tri.ts` — Danh mục, vai trò, khóa user, broadcast, hoàn tiền, cấu hình

**Bổ sung vào `src/lib/i18n/vi.ts`:**
- [x] Khối `kiem_tra` (thêm 9 key mới: gia_toi_thieu, mien_phi_gia_0, mien_phi_khong_quyen_loi, tu_2_lua_chon, dap_an_khong_hop_le, slug, lien_ket_noi_bo, can_dong_y)
- [x] Khối `hanh_dong` (mới, ~30 key cho thông báo action)

**Bổ sung vào `src/app/globals.css`:**
- [x] `@theme inline { --font-sans: var(--font-be-vietnam), ... }`

### GIAI ĐOẠN 4B: PROVIDERS, ROOT LAYOUT, LAYOUT COMPONENTS — ✅ HOÀN THÀNH

**Providers đã tạo:**
- [x] `src/hooks/use-realtime-thong-bao.ts` — Hook realtime thông báo
- [x] `src/providers/thong-bao-provider.tsx` — Context thông báo
- [x] `src/providers/theme-provider.tsx` — Theme + Toaster
- [x] `src/providers/query-provider.tsx` — TanStack Query
- [x] `src/providers/i18n-provider.tsx` — i18next

**Root layout & pages:**
- [x] `src/app/layout.tsx` — Root layout với Be Vietnam Pro font
- [x] `src/app/not-found.tsx` — Trang 404
- [x] `src/app/error.tsx` — Trang lỗi
- [x] `src/app/loading.tsx` — Loading skeleton

**Layout components:**
- [x] `src/components/layout/lien-ket.ts` — Menu chính + phụ
- [x] `src/components/layout/nguoi-dung-header.ts` — Type + helper cho header user
- [x] `src/components/layout/theme-toggle.tsx` — Nút đổi sáng/tối
- [x] `src/components/layout/user-menu.tsx` — Menu user
- [x] `src/components/thong-bao/chuong-thong-bao.tsx` — Chuông thông báo
- [x] `src/components/layout/sidebar.tsx` — Sidebar (desktop) + DanhSachMenu
- [x] `src/components/layout/mobile-nav.tsx` — Menu mobile (Sheet)
- [x] `src/components/layout/header.tsx` — Header tổng
- [x] `src/components/layout/footer.tsx` — Footer
- [x] `src/components/layout/trang-trong.tsx` — Trạng thái rỗng
- [x] `src/components/layout/khung-dashboard.tsx` — Khung dashboard chung

**5 Layout khu vực:**
- [x] `src/app/(cong-khai)/layout.tsx`
- [x] `src/app/(nguoi-dung)/layout.tsx`
- [x] `src/app/(dau-bep)/layout.tsx`
- [x] `src/app/(quan-tri)/layout.tsx`
- [x] `src/app/(ho-tro)/layout.tsx`

### GIAI ĐOẠN 4C: SERVER ACTIONS — ✅ HOÀN THÀNH

**Hàm dùng chung:**
- [x] `src/lib/actions/chung.ts` — canPhien, ghiNhatKy, layIdNguoiDung, guiThongBaoNhieuNguoi, layEmailVaTen, laDuongDanNoiBo

**Actions đã tạo:**
- [x] `src/actions/auth.ts` — Đăng nhập, đăng ký, đăng xuất, quên/đặt lại mật khẩu
- [x] `src/actions/cong-thuc.ts` — Tạo/sửa/xóa mềm công thức, lưu/bỏ lưu, đổi bộ sưu tập
- [x] `src/actions/khoa-hoc.ts` — Tạo/sửa/lưu trữ khóa học, đăng ký miễn phí
- [x] `src/actions/bai-hoc.ts` — Lưu/xóa/sắp xếp bài học, hoàn thành bài, nộp bài tập, cấp chứng chỉ
- [x] `src/actions/binh-luan.ts` — Gửi/sửa/xóa bình luận, đánh giá, báo cáo vi phạm
- [x] `src/actions/ticket.ts` — Tạo ticket, gửi tin nhắn, đổi trạng thái, phân công, đổi ưu tiên, chuyển admin
- [x] `src/actions/ho-so.ts` — Cập nhật hồ sơ, avatar, đổi mật khẩu
- [x] `src/actions/thong-bao.ts` — Đánh dấu đã đọc, xóa, broadcast
- [x] `src/actions/bai-viet.ts` — Tạo/sửa/xóa bài viết blog
- [x] `src/actions/quan-tri.ts` — Đổi vai trò, khóa user, duyệt/từ chối công thức & khóa học, CRUD danh mục, duyệt bình luận, xử lý báo cáo, hoàn tiền, lưu cấu hình, hủy phiên

### GIAI ĐOẠN 4D: EMAIL, VNPAY, CHỨNG CHỈ, API ROUTES — ✅ HOÀN THÀNH

**File đã tạo:**
- [x] `src/lib/email/gui-email.ts` — 3 hàm gửi email Resend + template HTML
- [x] `src/lib/thanh-toan/vnpay.ts` — Tạo URL thanh toán VNPay SHA512 + xác minh chữ ký IPN/return
- [x] `src/lib/pdf/chung-chi.ts` — Tạo file PDF chứng chỉ A4 ngang có QR code xác thực
- [x] `src/app/api/auth/callback/route.ts` — Route callback Supabase Auth
- [x] `src/app/api/thanh-toan/vnpay/tao-url/route.ts` — Route tạo URL VNPay sandbox
- [x] `src/app/api/thanh-toan/vnpay/ket-qua/route.ts` — Route return URL và tự động kích hoạt quyền học
- [x] `src/app/api/thanh-toan/vnpay/ipn/route.ts` — Webhook IPN xử lý giao dịch ngầm
- [x] `src/app/api/chung-chi/[ma]/pdf/route.ts` — Route stream trực tiếp PDF chứng chỉ
- [x] `src/app/api/luot-xem/route.ts` — Route tăng lượt xem công thức qua RPC
- [x] `src/app/api/lien-he/route.ts` — Route tiếp nhận form liên hệ từ khách và ghi log

### PHẦN 5: MODULE COMPONENTS (NHÓM 3) — ✅ HOÀN THÀNH

**Components đã tạo:**
- [x] `src/components/auth/`: FormDangNhap, FormDangKy, FormQuenMatKhau, FormDatLaiMatKhau
- [x] `src/components/cong-thuc/`: TheCongThuc, BoLocCongThuc, NutLuuCongThuc, NguyenLieuScale
- [x] `src/components/khoa-hoc/`: TheKhoaHoc, TrinhPhatYouTube, DanhSachBaiHoc, TheoDoiTienDo
- [x] `src/components/binh-luan/`: KhuBinhLuan (realtime), DanhGiaSao
- [x] `src/components/ho-tro/`: ChatHoTro (realtime + ghi chú nội bộ)
- [x] `src/components/thanh-toan/`: NutMuaKhoaHoc (VNPay sandbox), HienThiGia
- [x] `src/components/quan-tri/`: TheThongKe, BangDuLieu (DataTable tái sử dụng)

### CÁC PHẦN CHƯA LÀM (SAU PHẦN 5)

- [ ] **Phần 6:** 53 trang theo vai trò (public, user, chef, admin, support)
- [ ] **Phần 7:** RLS Policies (file `002_rls_policies.sql`)
- [ ] **Phần 8:** Seed data (10 công thức, 5 khóa học, 5 user mẫu)
- [ ] **Phần 9:** Hoàn thiện (responsive, a11y, SEO, deploy Vercel)

---

## 📋 LỊCH SỬ SESSION

### Session 01 — Claude Free — Setup ban đầu
**Công cụ:** Claude (chat)
**Đã làm:**
- Tạo Next.js 15 project
- Cài shadcn/ui (Base UI + Nova preset)
- Tạo Supabase project `web-hoc-nau-an`
- Chạy migration SQL — 20 bảng
**Kết quả:** ✅ Thành công
**Vấn đề:** Hết lượt Claude Free

### Session 02 — Claude Free — Phần 4A (Zod Validations)
**Công cụ:** Claude (chat)
**Đã làm:**
- Tạo 9 file validations (chung, auth, cong-thuc, khoa-hoc, binh-luan, ticket, ho-so, bai-viet, quan-tri)
- Bổ sung i18n: khối `kiem_tra` + khối `hanh_dong`
- Bổ sung font Be Vietnam Pro vào globals.css
**Kết quả:** ✅ Thành công

### Session 03 — Claude Free — Phần 4B (Providers, Layout)
**Công cụ:** Claude (chat)
**Đã làm:**
- 5 providers (thong-bao, theme, query, i18n) + hook use-realtime-thong-bao
- Root layout + 404 + error + loading
- 11 layout components (header, footer, sidebar, mobile-nav, user-menu, chuong-thong-bao, theme-toggle, trang-trong, khung-dashboard, lien-ket, nguoi-dung-header)
- 5 layout khu vực (cong-khai, nguoi-dung, dau-bep, quan-tri, ho-tro)
**Kết quả:** ✅ Thành công

### Session 04 — Claude Free — Phần 4C (Server Actions)
**Công cụ:** Claude (chat)
**Đã làm:**
- 1 file chung (lib/actions/chung.ts)
- 10 file actions (auth, cong-thuc, khoa-hoc, bai-hoc, binh-luan, ticket, ho-so, thong-bao, bai-viet, quan-tri)
**Kết quả:** ✅ Thành công
**Vấn đề:** Hết lượt Claude Free, dừng ở cuối 4C
**Việc tiếp theo:** Phần 4D (Email Resend, VNPay, PDF chứng chỉ, API routes)

### Session 05 — Antigravity — NHÓM 1: HOÀN THÀNH ✅
**Công cụ:** Antigravity
**Mục tiêu:** Tạo types/database.ts, sửa toàn bộ lỗi type, config i18n en, email Resend, chuẩn hóa Base UI components
**Đã làm:**
- Tạo `src/types/database.ts` với đầy đủ 20 bảng PostgreSQL, Relationships và RPC Functions.
- Tạo `src/lib/i18n/en.ts` hỗ trợ song ngữ cho i18next.
- Cập nhật `src/lib/utils/phan-hoi-loi.ts` chuẩn hóa kiểu generic KetQua và overload thanhCong.
- Cập nhật `src/components/ui/button.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `popover.tsx` hỗ trợ `asChild` tương thích Base UI.
- Tạo `src/lib/email/gui-email.ts` tích hợp Resend với 3 hàm (guiEmailChungChi, guiEmailTraLoiTicket, guiEmailKetQuaDuyet) + template HTML.
- Sửa kiểu dữ liệu TypeScript trong `bai-hoc.ts`, `quan-tri.ts`, `ticket.ts`, `ho-so.ts`.
**Kết quả:** ✅ `npx tsc --noEmit` chạy thành công 0 lỗi.

---

## 🐛 BUG ĐÃ FIX / LƯU Ý QUAN TRỌNG

### Lưu ý từ Claude:
1. **Zod 4**: Dùng `z.email()`, `{ error: ... }` thay vì `{ message: ... }`. Kiểm tra `npm ls zod` nếu gặp lỗi.
2. **z.guid() thay z.uuid()**: Vì id trong seed.sql không theo chuẩn UUID phiên bản → dùng guid()
3. **Sanitize trong schema**: `vanBan()` tự bỏ thẻ HTML trước khi kiểm tra độ dài. Riêng `noi_dung` bài viết (markdown) không strip.
4. **Form số**: Dùng `register("khau_phan", { valueAsNumber: true })`. Ô calories trống thì form phải đổi NaN → null.
5. **Đăng xuất chạy ở client** bằng `supabase.auth.signOut()` rồi `router.refresh()` — không cần server action.
6. **Phân quyền 2 lớp**: middleware chặn theo URL, mỗi layout gọi `yeuCauVaiTro()` kiểm tra lại (cache theo request).
7. **Toaster nằm trong theme-provider.tsx** để toast hoạt động cả trang đăng nhập.
8. **Chuông thông báo chỉ đếm 30 thông báo gần nhất** — trang /thong-bao sẽ phân trang đầy đủ.
9. **File email chưa có**: bai-hoc.ts, ticket.ts, quan-tri.ts import `@/lib/email/gui-email`. Phần 4D sẽ viết file này. **Chưa chạy build trước khi làm xong 4D.**
10. **Công thức đã xóa mềm** vẫn hiện với tác giả. Mọi truy vấn danh sách phải có `.is("deleted_at", null)`.
11. **Lộ đáp án bài tập**: `dap_an_dung` nằm trong JSONB của `bai_hoc` → học viên mở DevTools có thể đọc. Chấp nhận với đồ án, trang học sẽ không select cột `bai_tap`.
12. **Điểm bài tập chưa lưu**: schema 20 bảng không có bảng bài nộp → `nopBaiTap` chỉ chấm và trả kết quả.
13. **Đăng ký/quên mật khẩu qua Resend**: Cần vào Supabase → Authentication → SMTP Settings → bật Custom SMTP (host smtp.resend.com, port 465, user `resend`, password là RESEND_API_KEY).
14. **Giới hạn đăng nhập/đăng ký**: Dựa vào rate limit có sẵn của Supabase Auth.

### Lưu ý về Supabase:
- Supabase dùng **keys mới**: `sb_publishable_...` và `sb_secret_...` (không dùng legacy JWT)
- **RLS CHƯA bật** — sẽ chạy file `002_rls_policies.sql` riêng
- Supabase mới đã bỏ tùy chọn "Confirm email" — test bằng Auto Confirm qua Dashboard

### Lưu ý về Next.js 15 + Tailwind v4:
- **Không có `tailwind.config.js`** — cấu hình theme trong `globals.css`

---

## 📁 CẤU TRÚC FILE ĐÃ TẠO
src/
├── app/
│ ├── (cong-khai)/layout.tsx ✅
│ ├── (nguoi-dung)/layout.tsx ✅
│ ├── (dau-bep)/layout.tsx ✅
│ ├── (quan-tri)/layout.tsx ✅
│ ├── (ho-tro)/layout.tsx ✅
│ ├── layout.tsx ✅
│ ├── not-found.tsx ✅
│ ├── error.tsx ✅
│ ├── loading.tsx ✅
│ └── globals.css ✅ (có bổ sung font)
│
├── components/
│ ├── layout/
│ │ ├── header.tsx ✅
│ │ ├── footer.tsx ✅
│ │ ├── sidebar.tsx ✅
│ │ ├── mobile-nav.tsx ✅
│ │ ├── user-menu.tsx ✅
│ │ ├── theme-toggle.tsx ✅
│ │ ├── trang-trong.tsx ✅
│ │ ├── khung-dashboard.tsx ✅
│ │ ├── lien-ket.ts ✅
│ │ └── nguoi-dung-header.ts ✅
│ └── thong-bao/
│ └── chuong-thong-bao.tsx ✅
│
├── hooks/
│ └── use-realtime-thong-bao.ts ✅
│
├── providers/
│ ├── thong-bao-provider.tsx ✅
│ ├── theme-provider.tsx ✅
│ ├── query-provider.tsx ✅
│ └── i18n-provider.tsx ✅
│
├── actions/
│ ├── auth.ts ✅
│ ├── cong-thuc.ts ✅
│ ├── khoa-hoc.ts ✅
│ ├── bai-hoc.ts ✅
│ ├── binh-luan.ts ✅
│ ├── ticket.ts ✅
│ ├── ho-so.ts ✅
│ ├── thong-bao.ts ✅
│ ├── bai-viet.ts ✅
│ └── quan-tri.ts ✅
│
├── lib/
│ ├── actions/
│ │ └── chung.ts ✅
│ ├── validations/
│ │ ├── chung.ts ✅
│ │ ├── auth.ts ✅
│ │ ├── cong-thuc.ts ✅
│ │ ├── khoa-hoc.ts ✅
│ │ ├── binh-luan.ts ✅
│ │ ├── ticket.ts ✅
│ │ ├── ho-so.ts ✅
│ │ ├── bai-viet.ts ✅
│ │ └── quan-tri.ts ✅
│ ├── i18n/
│ │ └── vi.ts ✅ (có bổ sung)
│ ├── supabase/
│ │ ├── client.ts ⏳ CHƯA (cần tạo)
│ │ ├── server.ts ⏳ CHƯA
│ │ ├── middleware.ts ⏳ CHƯA
│ │ └── admin.ts ⏳ CHƯA
│ ├── utils/
│ │ ├── phan-hoi-loi.ts ⏳ CHƯA
│ │ ├── slug.ts ⏳ CHƯA
│ │ ├── vai-tro.ts ⏳ CHƯA
│ │ ├── hang-so.ts ⏳ CHƯA
│ │ ├── sanitize.ts ⏳ CHƯA
│ │ ├── youtube.ts ⏳ CHƯA
│ │ ├── dinh-dang.ts ⏳ CHƯA
│ │ └── cn.ts ⏳ CHƯA
│ └── email/
│ └── gui-email.ts ⏳ CHƯA (Phần 4D)
│
└── types/
└── database.ts ⏳ CHƯA (generate)

text

**⚠️ CẢNH BÁO:** Claude đã tạo nhiều file **import từ các file CHƯA TỒN TẠI**:
- `@/lib/supabase/server` (layPhienHienTai, taoSupabaseServer, yeuCauVaiTro)
- `@/lib/supabase/client` (taoSupabaseClient)
- `@/lib/supabase/admin` (taoSupabaseAdmin)
- `@/lib/utils/phan-hoi-loi` (thanhCong, thatBai, chuanHoaLoi, KetQua)
- `@/lib/utils/slug` (taoSlugDuyNhat)
- `@/lib/utils/vai-tro` (trangChuTheoVaiTro, MENU_NGUOI_DUNG, MENU_DAU_BEP, MENU_QUAN_TRI, MENU_HO_TRO, MucMenu)
- `@/lib/utils/hang-so` (MAU_BADGE, TONG_VAI_TRO, nhanCua)
- `@/lib/utils/sanitize` (lamSachVanBan)
- `@/lib/utils/youtube` (layIdYoutube)
- `@/lib/utils/dinh-dang` (dinhDangTuongDoi)
- `@/lib/utils/cn` (cn)
- `@/lib/i18n/config` (t, i18next)
- `@/types` (Bang, VaiTro, BaiTap)
- `@/lib/email/gui-email`

**→ Đây là các file CẦN TẠO ở Phần 4D và trước khi build.**

---

## 🎯 TIẾN ĐỘ HOÀN THÀNH (Antigravity)

### Bước 1: Setup & Supabase Clients — ✅ HOÀN THÀNH
- [x] Tạo `src/types/database.ts` với đầy đủ 20 bảng, Relationships foreign key, RPC functions
- [x] Tạo 4 file Supabase client (`client.ts`, `server.ts`, `middleware.ts`, `admin.ts`)
- [x] Cấu hình middleware bảo vệ route đa tầng theo vai trò

### Bước 2: Các file Utils — ✅ HOÀN THÀNH
- [x] `src/lib/utils/phan-hoi-loi.ts`
- [x] `src/lib/utils/slug.ts`
- [x] `src/lib/utils/vai-tro.ts`
- [x] `src/lib/utils/hang-so.ts`
- [x] `src/lib/utils/sanitize.ts`
- [x] `src/lib/utils/youtube.ts`
- [x] `src/lib/utils/dinh-dang.ts`
- [x] `src/lib/utils/cn.ts`
- [x] `src/lib/i18n/config.ts` (chuẩn hóa SSR/RSC)
- [x] `src/types/index.ts`

### Bước 3: Phần 4D (Email, VNPay, PDF, APIs) — ✅ HOÀN THÀNH
- [x] `src/lib/email/gui-email.ts` + 4 template HTML
- [x] `src/lib/thanh-toan/vnpay.ts` (HMAC-SHA512 + IPN verify)
- [x] `src/lib/pdf/chung-chi.ts` (PDF canvas A4 ngang + mã QR xác thực)
- [x] 7 API routes: auth/callback, thanh-toan/vnpay/*, chung-chi/[ma]/pdf, luot-xem, lien-he

### Bước 4: 53 Trang & Components (Phần 5 & 6) — ✅ HOÀN THÀNH
- [x] Public (15 trang)
- [x] User (10 trang)
- [x] Chef (6 trang)
- [x] Admin (15 trang)
- [x] Support (3 trang)

### Bước 5: Build Verification — ✅ HOÀN THÀNH 100%
- [x] `npx tsc --noEmit` — 0 lỗi
- [x] `npm run lint` — 0 lỗi
- [x] `npm run build` — Thành công 57/57 routes với Turbopack production build!

---

## 🔗 LINK QUAN TRỌNG

- Supabase Dashboard: https://supabase.com/dashboard/project/qvsrkxnqeylwtyggyxly
- SQL Editor: https://supabase.com/dashboard/project/qvsrkxnqeylwtyggyxly/sql
- Table Editor: https://supabase.com/dashboard/project/qvsrkxnqeylwtyggyxly/editor
- Storage: https://supabase.com/dashboard/project/qvsrkxnqeylwtyggyxly/storage/buckets
- Authentication: https://supabase.com/dashboard/project/qvsrkxnqeylwtyggyxly/auth/users
- API Keys: https://supabase.com/dashboard/project/qvsrkxnqeylwtyggyxly/settings/api
---

## 🏆 KẾT QUẢ TRIỂN KHAI MÔ HÌNH GÓI PREMIUM & SEED DỮ LIỆU (HOÀN THÀNH 100%)

### 1. Mô hình Gói Premium (Đã chốt và hoàn thiện)
- **2 Gói dịch vụ chính thức:**
  - `pro_thang`: 30 ngày — 99.000 ₫
  - `pro_nam`: 365 ngày — 799.000 ₫ (Tiết kiệm 33%)
  - **Tuyệt đối KHÔNG có gói vĩnh viễn** — mọi gói đều có `ngay_het_han` và được cộng dồn thời hạn nếu gia hạn.
- **Quyền lợi phân cấp rõ ràng:**
  - **User thường (Free):** Xem công thức cơ bản, lưu bài, bình luận, chỉ xem video preview của khóa học, KHÔNG tải tài liệu PDF, KHÔNG làm bài tập trắc nghiệm, KHÔNG nhận chứng chỉ, KHÔNG có nút "Tạo công thức" (nếu cố truy cập `/tao-cong-thuc` sẽ được middleware tự động chuyển hướng sang `/nang-cap-pro`).
  - **Hội viên Pro:** Mở khóa toàn bộ video Full HD 1080p, tải cẩm nang công thức PDF độc quyền, làm bài tập có chấm điểm, nhận chứng chỉ tốt nghiệp (PDF + mã QR xác thực), quyền đăng tải công thức nấu ăn của riêng mình, huy hiệu Pro vương miện vàng (`BadgePro`), học tập 100% không quảng cáo.
- **4 Luồng nghiệp vụ:**
  - Luồng 1: Người dùng mua gói qua VNPay → Tạo yêu cầu `cho_duyet` → Quản trị viên duyệt tại `/quan-tri/duyet-nang-cap` → Hệ thống cập nhật `profiles.la_pro = true`, tạo `goi_nguoi_dung`, gửi thông báo Realtime và gửi Email chúc mừng qua Resend.
  - Luồng 2: Quản trị viên cấp gói hoặc thu hồi gói thủ công (`ModalCapGoi`) trực tiếp trong chi tiết tài khoản học viên tại `/quan-tri/nguoi-dung/[id]`.
  - Luồng 3: Thành viên Pro đăng tải công thức → Admin kiểm duyệt xuất bản.
  - Luồng 4: Người dùng thường truy cập route Pro → Middleware chặn và điều hướng về `/nang-cap-pro`.

### 2. Database & SQL Migration
- `supabase/migrations/003_goi_premium.sql`: Migration idempotent tạo 4 bảng (`goi_premium`, `goi_nguoi_dung`, `yeu_cau_nang_cap`, `quyen_nguoi_dung`) cùng triggers tự động tính thời hạn và cập nhật quyền.
- `supabase/migrations/004_rls_policies.sql`: Thiết lập RLS policies bảo mật theo vai trò.
- `supabase/seed.sql`: Seed 20 công thức chi tiết (nguyên liệu, các bước nấu, ảnh Unsplash chất lượng cao, video YouTube, calories, độ khó), 10 danh mục ẩm thực, 5 tài khoản test đại diện cho 4 vai trò, 5 khóa học, 10 bài học, 20 bình luận, 30 đánh giá, 5 bài viết blog.

### 3. Hệ thống Pages & Components mới
- **Trang công khai:**
  - `src/app/(cong-khai)/bang-gia/page.tsx`: Bảng so sánh tính năng Free vs Pro, thẻ gói, câu hỏi thường gặp FAQ.
- **Trang người dùng:**
  - `src/app/(nguoi-dung)/nang-cap-pro/page.tsx`: Giao diện chọn gói và khởi tạo thanh toán VNPay.
  - `src/app/(nguoi-dung)/goi-cua-toi/page.tsx`: Quản lý thời hạn gói cá nhân, theo dõi yêu cầu chờ duyệt và lịch sử giao dịch.
- **Trang quản trị:**
  - `src/app/(quan-tri)/quan-tri/quan-ly-goi/`: Danh sách gói, thêm gói mới (`/moi`), sửa gói (`/[id]/sua`).
  - `src/app/(quan-tri)/quan-tri/duyet-nang-cap/page.tsx`: Bảng xét duyệt yêu cầu nâng cấp Pro, hỗ trợ duyệt hoặc từ chối kèm lý do.
- **Components:**
  - `BadgePro.tsx`, `NutNangCap.tsx`, `TheGoi.tsx`, `BangSoSanh.tsx`, `FormMuaGoi.tsx`, `FormGoi.tsx`, `BangDuyetNangCap.tsx`, `ModalCapGoi.tsx`.

### 4. Kết quả kiểm tra chất lượng
- `npx tsc --noEmit`: **0 lỗi** (Exit code 0).
- `npm run build`: **Build thành công toàn bộ 63 route** (Exit code 0).

---

## 🎨 ĐỢT NÂNG CẤP GIAO DIỆN + TRANG CÁ NHÂN/PRO + SEED NỘI DUNG ĐỢT 2 (05/11/2026)

Yêu cầu của chủ đồ án: (A) thiết kế lại giao diện thật đẹp, chuyển động mượt mà — ưu tiên số 1; (B) sửa trang cá nhân đầy đủ chức năng + hiển thị hạng thành viên, Pro mới được tự đăng công thức/bài viết (không đăng khóa học), tài khoản thường thấy nút bị làm mờ kèm khóa và thông báo nâng cấp; (C) seed thêm 7 công thức, 7 khóa học, 14 bài viết đạt chuẩn chi tiết/thực tế như đợt 1; (D) kiểm thử + cập nhật tài liệu.

### Phần A — Thiết kế lại giao diện (commit `393ec2d`)
- `src/app/template.tsx`: hiệu ứng chuyển trang fade/slide toàn site (tôn trọng `prefers-reduced-motion`).
- Skeleton loading cho nhóm trang công khai và khu vực thành viên; component dùng chung `TieuDeTrang` (banner gradient đầu trang) và `TrangThaiTrong` (trạng thái trống).
- Trang danh sách công thức/khóa học/bài viết: banner gradient kèm số lượng thật, thẻ nội dung hiện dần theo thứ tự khi cuộn (`HienDan`), thẻ khóa học/bài viết thêm hiệu ứng hover và huy hiệu chuyên mục.
- Khu vực thành viên: sidebar có chip người dùng (avatar, tên, hạng thành viên — Pro có vương miện vàng), bảng điều khiển có dải chào mừng gradient hiện trạng thái Pro và nút nâng cấp.

### Phần B — Trang cá nhân + khóa Pro + luồng bài viết người dùng (commit `bbb14e2`)
- Migration `supabase/migrations/005_bai_viet_nguoi_dung.sql` (chủ đồ án đã chạy trên Supabase): thêm `bai_viet.ly_do_tu_choi`, mở trạng thái `cho_duyet`/`tu_choi`, RLS cho phép tác giả xem/tạo/sửa/xóa bài của mình.
- `/ho-so` xây lại: banner bìa gradient, tải avatar (bucket `avatars`), huy hiệu vai trò + hạng thành viên, thẻ thành viên (Pro: tên gói, ngày hết hạn, thanh tiến độ thời hạn; Free: nút nâng cấp), bổ sung ô **ngày sinh** còn thiếu trong form sửa thông tin.
- Khóa Pro kiểu mới: người dùng Free vẫn thấy mục Thêm công thức / Viết bài viết ở trang cá nhân và menu bên nhưng bị làm mờ kèm ổ khóa; bấm vào hiện hộp thoại "Tính năng dành cho thành viên Pro". Máy chủ (server action + trang) cũng chặn truy cập thẳng. Helper `laProConHan()` trong `src/lib/actions/chung.ts`.
- Luồng bài viết: form `/tao-bai-viet` (Lưu nháp / Gửi duyệt), trang `/bai-viet-cua-toi` theo dõi trạng thái, admin duyệt/từ chối kèm lý do tại `/quan-tri/bai-viet` + gửi thông báo trong hệ thống cho tác giả. Đã kiểm chứng đầu-cuối: Pro gửi → admin duyệt → bài hiện công khai + có thông báo.

### Phần C — Seed nội dung đợt 2 (commit `c380ee8`, file `supabase/seed-2-noi-dung.sql`)
- 7 công thức mới: Cá kho tộ, Bò lúc lắc, Súp cua, Gà rán vỏ giòn, Cà ri gà, Lẩu Thái chua cay, Chè ba màu (mô tả ~300 ký tự, 13–18 nguyên liệu định lượng, 6–7 bước chi tiết).
- 7 khóa học mới (mỗi khóa 3 bài học + 3 câu hỏi trắc nghiệm/bài): Món Hàn tại nhà, Ẩm thực Nhật cơ bản, Món Âu cho bữa tối, Ăn sáng kiểu Việt, Tráng miệng & chè Việt, Eat-clean nhẹ nhàng, Kỹ thuật chiên xào châu Á. Toàn bộ 21 video YouTube đã kiểm chứng tồn tại bằng oEmbed; toàn bộ ảnh Unsplash đã kiểm tra hiển thị thật.
- 14 bài viết mới (6–8 mục nội dung mỗi bài): chọn cá tươi, bảo quản rau củ, kỹ thuật cắt thái, tủ gia vị Việt, nước dùng trong veo, ướp thịt nướng, meal prep, eat-clean, đọc nhãn dinh dưỡng, giảm muối, chọn nồi chảo, an toàn vệ sinh thực phẩm, thay thế nguyên liệu, mâm cơm Việt.
- Số liệu DB sau đợt 2: **17 công thức, 12 khóa học, 36 bài học, 108 câu hỏi trắc nghiệm, 16 bài viết** (backup trước khi seed: lưu ngoài repo).

### Phần D — Kiểm thử & tài liệu
- Thêm `tests/part-bc.spec.ts` (5 test): hồ sơ Free/Pro, hộp thoại khóa Pro, luồng duyệt bài viết đầu-cuối, nội dung seed đợt 2 trên trang công khai, khóa học mới mở được bài xem trước.
- Kết quả cuối: **TypeScript 0 lỗi, ESLint 0/0, production build thành công (81 route), Playwright 18/18 đạt**. Dữ liệu `TEST_` sau test đã dọn sạch.
- Cập nhật đồng bộ: `TESTING.md`, `AI_CONTEXT.md`, `WORK_LOG.md`.

### Còn tồn đọng (việc của chủ đồ án / giai đoạn sau)
- Chạy `git push origin master` từ terminal trên máy (phiên SSH không xác thực được GitHub).
- Đăng ký VNPay sandbox + Resend để điền `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `RESEND_API_KEY` rồi mới test được thanh toán/IPN và email.

### Hotfix sau bàn giao (05/11/2026) — lỗi mở menu avatar làm sập trang
- Chủ đồ án phản ánh: đã đăng nhập, bấm avatar ở header để vào trang cá nhân thì hiện trang "Có sự cố xảy ra".
- Nguyên nhân: `src/components/layout/user-menu.tsx` dùng `DropdownMenuLabel` (Base UI `Menu.GroupLabel`) nằm ngoài `Menu.Group` — Base UI ném lỗi `MenuGroupContext is missing` làm sập toàn bộ trang cho **mọi người dùng đã đăng nhập khi ở trang công khai**. Lỗi có từ bản gốc, các vòng test trước không bắt được vì sau khi đăng nhập test chỉ ở trong khu vực thành viên (layout sidebar, không có header công khai).
- Sửa: bọc `DropdownMenuLabel` trong `DropdownMenuGroup` (+ comment cảnh báo trong code). Đã tái hiện lỗi bằng trình duyệt thật trước khi sửa và xác nhận sau khi sửa: cả tài khoản Pro và Free đều mở menu avatar → "Hồ sơ" → vào `/ho-so` bình thường, 0 lỗi JS.
- Bổ sung test hồi quy vào `tests/part-bc.spec.ts`: đăng nhập → trang chủ → bấm avatar → mục "Hồ sơ" → tới `/ho-so`, không lỗi trang.

### Cổng thanh toán demo VNPay + sửa 3 lỗi gốc của luồng mua gói (05/11/2026)
- Bối cảnh: chủ đồ án chưa đăng ký được VNPay merchant/Resend, chọn phương án làm **cổng thanh toán demo** để bảo vệ demo được toàn bộ luồng mua gói mà không cần đăng ký dịch vụ ngoài.
- Thiết kế: khi biến môi trường `VNPAY_DEMO=true`, hàm tạo URL thanh toán trỏ về trang nội bộ `/thanh-toan-demo` (giao diện mô phỏng cổng VNPay, có nhãn "MÔI TRƯỜNG DEMO", thẻ test NCB điền sẵn, 2 nút: thanh toán thành công / hủy). Route `/api/thanh-toan/demo/xu-ly` ký bộ tham số kết quả bằng đúng hàm ký HMAC-SHA512 dùng cho VNPay thật, **gọi IPN thật** `/api/thanh-toan/vnpay/ipn` rồi chuyển trình duyệt về return URL thật `/api/thanh-toan/vnpay/ket-qua`. Toàn bộ hậu tuyến (ký/xác minh chữ ký, IPN, cập nhật giao dịch, duyệt admin, kích hoạt Pro) là mã thật — chỉ giao diện cổng ngoài là mô phỏng. Tắt demo: điền mã VNPay thật + đặt `VNPAY_DEMO=false`, không sửa code. `.env.local` hiện dùng mã demo tự sinh (`VNPAY_TMN_CODE=HNADEMO1`, secret ngẫu nhiên 32 ký tự; bản sao lưu `.env.local.bak-demo`).
- Ba lỗi gốc phát hiện khi kiểm chứng (đều có từ trước, không phải do cổng demo):
  1. Database thật thiếu 2 cột `thanh_toan.loai_thanh_toan`, `thanh_toan.goi_id` và khóa ngoại `yeu_cau_nang_cap.thanh_toan_id → thanh_toan.id` mà migration 003 đã khai báo (bản chạy trên Supabase ngày xưa bị thiếu) → API tạo giao dịch lỗi PGRST204, các trang danh sách yêu cầu nâng cấp lỗi PGRST200 không hiện dữ liệu. Đã bổ sung bằng **migration `006_thanh_toan_bo_sung_cot.sql`** (chủ đồ án đã chạy trên Supabase SQL Editor, chạy lặp lại an toàn).
  2. API `tao-url` ghi `thanh_toan`/`yeu_cau_nang_cap` bằng client phiên người dùng nên bị RLS chặn (42501) — trái với thiết kế migration 002 mục 19 "chỉ SERVER/service role được tạo". Đã sửa: ghi bằng service role, `nguoi_dung_id` lấy từ phiên đăng nhập đã xác thực.
  3. Hệ quả: đây là lần đầu tiên luồng mua gói chạy được đầu-cuối kể từ khi viết code.
- Kiểm chứng đầu-cuối bằng trình duyệt thật: Free mua Pro Tháng → cổng demo → thành công → IPN ghi `thanh_cong` + thông báo → yêu cầu chờ duyệt hiện ở cả trang người dùng và trang admin → admin duyệt → tài khoản lên Pro (hạn 30 ngày). Nhánh hủy: giao dịch `that_bai` mã 24. Dữ liệu kiểm chứng đã dọn sạch, tài khoản Free kiểm thử trở về trạng thái ban đầu.
- Kiểm thử: thêm 2 test Playwright cho cổng demo (thành công + hủy) vào `tests/part-bc.spec.ts`; kết quả cuối **21/21 đạt, TypeScript 0 lỗi, ESLint 0/0, production build thành công (83 route)**. Chi tiết các vòng chạy và lưu ý locator xem `TESTING.md`.
- Còn lại cho production thật: đăng ký VNPay merchant để lấy `VNPAY_TMN_CODE`/`VNPAY_HASH_SECRET` thật và Resend để lấy `RESEND_API_KEY` (email vẫn chưa gửi thật; thông báo trong hệ thống đã bao phủ mọi sự kiện thanh toán). Ghi chú nghiệp vụ từ thiết kế gốc: yêu cầu nâng cấp được tạo ở trạng thái chờ duyệt ngay khi bắt đầu thanh toán nên giao dịch hủy/thất bại vẫn để lại yêu cầu chờ duyệt cho admin từ chối.

### Triển khai lên Vercel (05/11/2026)
- Project Vercel `web-hoc-nau-an`, domain chính thức: **https://web-hoc-nau-an.vercel.app**, kết nối trực tiếp repo GitHub — mỗi lần push lên `master` là Vercel tự deploy bản mới. Lưu ý: Production Branch của Vercel mặc định là `main` nên đã đổi tay thành `master` trong Settings → Environments → Production → Branch Tracking (không đổi thì push không kích hoạt bản production).
- Biến môi trường trên Vercel: nhập từ `.env.local` bằng chức năng Import .env (10 biến, bỏ `RESEND_API_KEY` vì còn trống); riêng `NEXT_PUBLIC_SITE_URL=https://web-hoc-nau-an.vercel.app` và `VNPAY_RETURN_URL=https://web-hoc-nau-an.vercel.app/api/thanh-toan/vnpay/ket-qua`; giữ `VNPAY_DEMO=true` để cổng thanh toán demo hoạt động cả trên bản online.
- Commit này đồng thời là commit kích hoạt bản deploy production đầu tiên.

### Sửa 5 lỗi ở 3 giao diện vai trò (05/11/2026)
- Kiểm tra toàn bộ trang Admin/Đầu bếp/Hỗ trợ trên bản production theo yêu cầu, phát hiện và sửa 5 lỗi (đều có test hồi quy trong `tests/roles-fix.spec.ts`, suite nay 25 test):
  1. **Nhật ký hoạt động luôn trống**: `quan-tri/nhat-ky/page.tsx` nối `profiles` bằng gợi ý khóa ngoại không tồn tại (`nhat_ky_he_thong_nguoi_dung_id_fkey`) khiến PostgREST lỗi và trang hiện trạng thái trống dù bảng có 233+ bản ghi → bỏ gợi ý, dùng quan hệ mặc định.
  2. **Thẻ thống kê hiện tên icon dạng chữ** (`Users`, `TrendingUp`, `AlertTriangle`… bị tràn/cắt) ở Tổng quan Admin, Báo cáo, Tổng quan Hỗ trợ: các trang này truyền `icon` dạng chuỗi trong khi component `TheThongKe` cần ReactNode → truyền component Lucide như trang Đầu bếp/Học viên.
  3. **Chi tiết ticket bị chồng chữ lên header**: `ChatHoTro` dùng `scrollIntoView` nên mỗi lần mở/cập nhật tin nhắn, cả cửa sổ bị cuộn xuống và tiêu đề chui dưới header dính trong suốt → đổi sang cuộn nội bộ trong khung tin nhắn (`scrollTo` trên vùng chứa).
  4. **Nhãn ticket thô**: huy hiệu ưu tiên và danh mục hiện `TRUNG_BINH`/`ky_thuat` ở 4 màn hình (tổng quan hỗ trợ, hàng đợi, chi tiết ticket, giám sát admin) → dùng `nhanCua("do_uu_tien"/"danh_muc_ticket", …)`, bổ sung bộ nhãn `danh_muc_ticket` vào `lib/i18n/vi.ts`.
  5. **Trùng "Bếp trưởng"**: tiêu đề trang Đầu bếp cộng tiền tố vào họ tên vốn đã chứa "Bếp Trưởng" → cắt tiền tố trùng khi hiển thị.
- Tăng độ bền 2 test cũ trước strict mode (`.first()`): khẳng định phản hồi trong `ticket.spec.ts` và "3 bài học video" trong `part-bc.spec.ts`.
- Sự cố môi trường trong lúc kiểm chứng: file `.env.local` trên máy bị lưu nhầm 2 biến `NEXT_PUBLIC_SITE_URL`/`VNPAY_RETURN_URL` sang domain Vercel (từ bước cấu hình deploy, đáng lẽ không lưu) khiến luồng demo ở localhost nhảy sang bản online — đã khôi phục về `localhost:3000` (biến trên Vercel không bị ảnh hưởng). Dev server trên máy nhiều lần tự chết giữa vòng chạy test gộp → vòng kiểm chứng cuối chạy trên server production (`build` + `start`): **tsc 0 lỗi, ESLint 0/0, build OK, Playwright 25/25**.

## 🔍 SỬA LỖI GÕ TIẾNG VIỆT TRONG Ô TÌM KIẾM (05/11/2026)

- **Phản ánh:** gõ tiếng Việt ở ô tìm kiếm trang Công thức bị mất chữ/mất dấu; có lúc gõ xong mà danh sách không lọc.
- **Nguyên nhân:** `BoLocCongThuc` đồng bộ hai chiều ô nhập ↔ URL: mỗi nhịp gõ là một lần `router.push` tải lại toàn trang, trang tải xong lại ghi đè ô nhập bằng từ khóa cũ trên URL — phá cụm dấu đang soạn của bộ gõ tiếng Việt (IME). Hai lần điều hướng chồng nhau còn làm luồng dữ liệu RSC bị hủy giữa chừng (`net::ERR_ABORTED`) khiến từ khóa không được áp dụng.
- **Cách sửa (chỉ trong `src/components/cong-thuc/bo-loc-cong-thuc.tsx`):** ô nhập chuyển sang dạng không kiểm soát (uncontrolled) — chữ đang gõ chỉ nằm ở ô nhập, chỉ nạp lại khi URL thay đổi từ bên ngoài (nút Quay lại, Xóa bộ lọc); nhận biết trạng thái soạn dấu IME (`compositionstart`/`compositionend` + `isComposing`), chỉ lên lịch tìm kiếm khi đã soạn xong cụm chữ; áp dụng từ khóa bằng `router.replace` (không thêm mục lịch sử) và **không** dùng `{ scroll: false }` — tùy chọn này khiến điều hướng không hoàn tất trên Next 15.5 (đã kiểm chứng thực nghiệm); các lần áp dụng từ khóa xếp hàng tuần tự, không chạy chồng nhau, tự áp dụng lại tối đa 5 lần nếu lần trước bị hủy; khi đổi các bộ lọc khác giữa lúc đang gõ, từ khóa trong ô vẫn được giữ và áp dụng cùng.
- **Kiểm chứng:** test hồi quy mới `tests/search-ime.spec.ts` (gõ 2 nhịp xuyên qua thời điểm tải lại, khẳng định ô chữ nguyên vẹn + còn focus + URL đủ từ khóa + lọc đúng món); tăng độ bền `ticket.spec.ts` (chờ hydrate) và `part-bc.spec.ts` (`.first()` thẻ thành viên). Kết quả: tsc 0 lỗi, ESLint 0/0, production build OK, **Playwright 26/26** trên server production; kiểm chứng lại hành vi gõ trên bản Vercel sau khi deploy.


## 🧭 TÁCH KHUNG GIAO DIỆN 3 KHU VỰC VAI TRÒ (05/11/2026)

- **Yêu cầu:** Admin là một giao diện riêng, Đầu bếp và Hỗ trợ cũng vậy — tuyệt đối không hiện các chức năng trang công khai (Công thức, Khóa học...) như ở header hiện tại; đồng thời khi đang ở 3 khu vực này mà bấm sang Hồ sơ hay bất kỳ trang nào không liên quan thì không có cách nào quay về trang của vai trò mình.
- **Nguyên nhân:** `KhungDashboard` (khung chung cho cả 4 khu vực sau đăng nhập) render nguyên `Header` của trang công khai ở trên cùng — logo bấm về trang chủ kèm toàn bộ menu công khai (Công thức/Khóa học/Bảng giá Pro/Đầu bếp/Bài viết/Giới thiệu/Liên hệ) và ngăn kéo di động `MobileNav` cũng trộn liên kết công khai vào khu vực vai trò. Lối quay về duy nhất là mục đầu tiên của menu avatar: đích đến vốn đã đúng theo vai trò (`trangChuTheoVaiTro`) nhưng nhãn ghi chung chung "Bảng điều khiển" nên không ai nhận ra; sidebar khu vực thành viên thì không có lối về nào.
- **Cách sửa:** component mới `src/components/layout/topbar-vai-tro.tsx` — topbar riêng cho 3 khu vực (tên khu vực + huy hiệu vai trò, nút chuyển theme, chuông thông báo, menu tài khoản gọn chỉ gồm trang chủ khu vực/hồ sơ cá nhân/đăng xuất; ngăn kéo di động chỉ chứa menu của khu vực, không trộn liên kết công khai); `KhungDashboard` thêm prop `khuVaiTro`, 3 layout `(quan-tri)`/`(dau-bep)`/`(ho-tro)` bật cờ này — khu vực thành viên giữ nguyên header công khai. Menu avatar ở header công khai: mục đầu tiên đổi nhãn theo vai trò qua helper mới `thongTinKhuVaiTro` trong `src/lib/utils/vai-tro.ts` ("Trang quản trị"/"Trang đầu bếp"/"Trang hỗ trợ" kèm icon; học viên thường vẫn thấy "Bảng điều khiển"). Layout khu vực thành viên: nếu tài khoản là staff thì chèn mục "Về trang quản trị/đầu bếp/hỗ trợ" lên đầu menu sidebar.
- **Kiểm chứng:** test hồi quy mới `tests/role-shell.spec.ts` (3 test × 3 vai trò: khẳng định header trong khu vực không chứa logo về "/" và các link Bảng giá Pro/Giới thiệu/Liên hệ, topbar hiện đúng huy hiệu vai trò; từ /ho-so bấm mục "Về trang..." quay về đúng khu vực; từ trang chủ mở menu avatar bấm mục "Trang ..." quay về đúng khu vực). Kết quả: tsc 0 lỗi, ESLint 0/0, production build OK, **Playwright 29/29** trên server production; kiểm chứng lại trên Vercel sau khi deploy. Dữ liệu `TEST_` phát sinh trong lúc test đã được dọn sạch.

## 🛠️ ĐỢT SỬA CHUYÊN SÂU SAU VÒNG TEST TOÀN DIỆN (13/11/2026)

Xuất phát từ báo cáo test toàn diện cùng ngày (79 lượt quét, lỗi L-01…L-09). Làm theo từng nhóm nhỏ, commit ngay sau mỗi nhóm đạt tsc/lint: `f66ede2` (nhóm 1), `4578036` (nhóm 2), `72ae629` + `a0d0b4d` + `125a874` (nhóm 3 và bổ sung).

- **Nhóm 1 — luồng tiền (A1+A3+A8 + lệch giá khóa học):** helper mới `src/lib/thanh-toan/yeu-cau.ts`: giao dịch `that_bai` (gồm hủy mã 24) → yêu cầu nâng cấp đi kèm tự chuyển `da_huy` kèm lý do ngay trong IPN và return handler; cơ chế quét lười `donYeuCauHetHan()` (chạy khi mở trang duyệt/gói của tôi) hủy yêu cầu có giao dịch thất bại và yêu cầu quá 30 phút chưa hoàn tất. Thông báo của một giao dịch chỉ tạo ở IPN (bỏ bản trùng ở return handler, bỏ chữ "(IPN)"). Trang duyệt nâng cấp: thêm cột thanh toán (số tiền + mã giao dịch + huy hiệu trạng thái), nút Duyệt **khóa** khi chưa thanh toán thành công, server action cũng chặn duyệt ở tầng server; ngày giờ format cố định `Asia/Ho_Chi_Minh` (gốc của lỗi React #418 ở trang này). `/goi-cua-toi`: banner chờ duyệt chỉ hiện khi đã trả tiền, yêu cầu hủy/thất bại vào mục lịch sử "Đã hủy". Giá khóa học khi tạo URL thanh toán lấy từ DB (`khoa_hoc.gia`) thay cho hard-code 299.000đ (trang bán hiện 499.000đ). **Ca kiểm chứng thật:** hai yêu cầu "ma" `YC-CQ2M48DB` (giao dịch kẹt `cho_xu_ly` từ 14:17) và `YC-TJ0REJYO` (giao dịch `that_bai`) đang `cho_duyet` trước đợt sửa → sau khi cơ chế mới chạy, cả hai tự chuyển `da_huy` với lý do tương ứng, không sửa tay.
- **Nhóm 2 — tách giao diện staff (rà soát + vá trên nền `e6b6834`):** rà soát toàn bộ layout/menu/topbar 3 khu vực: khung đã tách đúng (topbar riêng, không header công khai, menu đúng vai trò, có đường quay về từ Hồ sơ và menu avatar). Vá nhận diện: huy hiệu Admin bỏ màu tím → đỏ; thêm bản đồ màu nhấn riêng `MAU_NHAN_VAI_TRO` (Admin đỏ, Đầu bếp cam, Hỗ trợ xanh dương) áp vào chip icon topbar + mục đang chọn ở sidebar/menu di động; hai trạng thái ticket/thanh toán hết dùng tông tím. Mở rộng `tests/role-shell.spec.ts`: khẳng định sidebar không chứa liên kết học viên, topbar có tiêu đề khu + chip màu đúng vai trò, thêm test menu di động 390px cho Admin.
- **Nhóm 3 — sửa nhẹ (A5/A6/A7/A9, B2/B3/B6) + toast đăng ký:** A6: trang `/dau-bep` trống vì RLS `profiles` chặn client phiên đọc hồ sơ người khác (anon trả `[]`) → đọc danh sách/hồ sơ đầu bếp bằng admin client chỉ lấy trường công khai, thêm trạng thái trống; trang chi tiết đầu bếp yêu cầu đăng nhập là theo thiết kế `CHI_TIET_CAN_DANG_NHAP` (như công thức/khóa học) nên giữ nguyên. A7: cổng Pro cho `/tao-bai-viet` — bản đầu thêm điều kiện ở middleware nhưng trang vẫn không chuyển hướng vì `/tao-bai-viet` **không nằm trong `KHU_NGUOI_DUNG`** nên middleware trả về sớm; bổ sung vào danh sách là hết (commit `125a874`). A5: bắt network log thấy `/bep` prefetch 10 link chết kiểu cũ `/quan-ly-cong-thuc/moi`, `/quan-ly-khoa-hoc/...` → trỏ về route thật `/bep/...` (+ `urlQuayLai` mặc định của form khóa học); footer có link `/tra-cuu-chung-chi` không tồn tại route (404 ở mọi trang công khai) → gỡ link chết. A9: thêm trang `/quan-tri/tong-quan` chuyển hướng về `/quan-tri`. B2: title/description riêng cho trang chủ, công thức, khóa học, bài viết, đầu bếp (+ `generateMetadata` hồ sơ đầu bếp). B6: viết lại trang 404 (icon ChefHat, nền gradient ấm amber/cam, nút về trang chủ + khám phá công thức). B3: quét mobile 390×844 các trang chính — không tràn ngang. Toast đăng ký: Supabase Auth đã tắt Confirm email (đăng ký vào thẳng bảng điều khiển) nhưng toast vẫn nói "kiểm tra email để xác nhận" → đổi `dang_ky_thanh_cong` thành câu chào mừng, tách khóa mới `dang_ky_cho_xac_nhan` cho nhánh chờ xác nhận.
- **Kiểm chứng tổng:** tsc 0 lỗi, ESLint toàn dự án 0 lỗi, production build OK (Compiled successfully ~55s). Playwright chính thức **30/30** trên server production (vòng lặp cuối 29/30 + `search-ime` đạt khi chạy riêng — test này vốn flaky dưới tải, đã ghi nhận từ 05/11). Regression riêng bằng 3 tài khoản MỚI: mua Pro thành công → admin duyệt được (huy hiệu "Đã thanh toán", Pro +30 ngày, đúng 1 thông báo thanh toán); hủy tại cổng → yêu cầu tự `da_huy` kèm mã 24; bỏ dở → không banner chờ duyệt, nút Duyệt của admin bị khóa kèm chú thích; mua khóa học ở cổng demo đúng **499.000đ** (DB khớp). Quét 19 trang theo 6 vai trò: không còn lỗi console React #418, không còn 404 nào ngoài chủ đích. Dữ liệu test đã dọn sạch, số đếm DB trở về đúng baseline (profiles 11 · thanh_toan 4 · yeu_cau 3 · thong_bao 212); tài khoản `testpro2026@hocnauan.vn` giữ lại cho demo theo yêu cầu.


## 🍳 ĐỢT BỔ SUNG TỐI 13/11/2026 — TRANG ĐẦU BẾP, TRA CỨU CHỨNG CHỈ, ĐĂNG NHẬP NHANH DEMO

Xuất phát từ phản ánh của chủ đồ án: mở giao diện người dùng "chả thấy có đầu bếp nào", kèm 3 mục lưu ý còn lại của đợt sửa chuyên sâu chiều 13/11. Điều tra + dữ liệu làm trước (mũi riêng), code làm theo từng nhóm nhỏ, commit ngay sau mỗi nhóm: `7e6b6ac` (nhóm 1), `136bbb9` (nhóm 2), `ba81e84` (nhóm 3).

- **Điều tra gốc rễ "không thấy đầu bếp":** trang `/dau-bep` tự nó không hỏng (đã đọc bằng admin client từ đợt trước) — vấn đề nằm ở TRANG CHỦ: mục "Đầu bếp hàng đầu" truy vấn `profiles` bằng client phiên thường, mà RLS `profiles` chỉ cho đọc hồ sơ của chính mình → trả 0 dòng cho cả khách lẫn học viên → cả mục bị ẩn bởi điều kiện `length > 0`. Cộng thêm dữ liệu DB lúc đó chỉ có 2 profiles chef và cả hai trùng một người seed ("Bếp Trưởng Trần Văn Minh" ×2, cùng bio, không avatar) nên trang danh sách cũng nhìn như trống/hỏng. Nút "Đầu bếp" ở header/menu mobile/footer đều đúng, không phải nguyên nhân.
- **Dữ liệu đầu bếp (làm ở mũi điều tra, dữ liệu demo có chủ đích — giữ lại, không xóa):** tách 2 chef cũ thành Trần Văn Minh (Việt truyền thống, chính là tài khoản demo khu /bep `chef@naungon.vn`) và Lê Thanh Tùng (món Âu); thêm 4 chef mẫu: Phạm Thu Hà (bánh Âu), Vũ Ngọc Anh (ăn sáng/người mới), Huỳnh Mỹ Linh (chay/eat-clean), Trần Hải Đăng (Á châu + chè) — tổng **6 chef, profiles 11 → 15**. Gắn lại tác giả cho 8 khóa học, 10 công thức, 9 bài viết để đầu bếp nào cũng có nội dung (số liệu thật sau gắn: Minh 6/2/2, Tùng 3/2/2, Hà 1/1/1, Ngọc Anh 2/2/1, Mỹ Linh 1/2/2, Đăng 3/3/1 — thứ tự công thức/khóa học/bài viết).
- **Nhóm 1 — trang chủ + trang đầu bếp (`7e6b6ac`):** truy vấn "Đầu bếp hàng đầu" ở trang chủ chuyển sang admin client (server-side), chỉ lấy trường công khai `id, ho_ten, avatar_url, bio`. `/dau-bep`: mỗi thẻ hiện số liệu THẬT đếm từ DB (số công thức · khóa học · bài viết đã xuất bản của từng người) + chuyên môn suy từ bio + nút "Xem hồ sơ"; thêm khối "Đầu bếp nổi bật" (người nhiều nội dung nhất — Trần Văn Minh) ở đầu trang. Chi tiết `/dau-bep/[id]`: **mở công khai cho khách** (gỡ khỏi `CHI_TIET_CAN_DANG_NHAP` trong middleware — thay đổi chủ đích theo yêu cầu của chủ đồ án, khác ghi nhận "giữ theo thiết kế" ở đợt chiều), hiện bio + danh sách công thức/khóa học/bài viết của đầu bếp đó.
- **Nhóm 2 — tra cứu chứng chỉ (`136bbb9`):** route công khai `/tra-cuu-chung-chi` (trang server, form GET nhập mã): tra bảng `chung_chi` bằng admin client với điều kiện khớp mã chính xác duy nhất — mã đúng hiện tên học viên, khóa học, ngày cấp, mã, huy hiệu "Chứng chỉ hợp lệ" và nút xem PDF (tái dùng route `/api/chung-chi/[ma]/pdf` sẵn có); mã sai hiện thông báo "Không tìm thấy chứng chỉ" rõ ràng. Gắn lại link "Tra cứu chứng chỉ" ở footer (`LIEN_KET_PHU`, khóa i18n đã có sẵn vi/en) — thay cho link chết đã gỡ ở đợt chiều.
- **Nhóm 3 — đăng nhập nhanh demo (`ba81e84`):** khối "Truy cập nhanh để demo" dưới form `/dang-nhap` với 4 nút màu theo khu vực: Admin (đỏ) → `/quan-tri`, Học viên (teal) → `/bang-dieu-khien`, Đầu bếp (cam) → `/bep`, Hỗ trợ (xanh dương) → `/nhan-vien`. Nút gọi server action mới `dangNhapNhanhDemo` (tái dùng nguyên logic `dangNhap`, mật khẩu demo để ở phía server) với tài khoản mẫu công khai trong README; có trạng thái "Đang vào..." và toast lỗi. Comment trong code ghi rõ đây là nút demo dùng tài khoản mẫu, cần xóa khi triển khai thật. Thêm `tests/dang-nhap-nhanh.spec.ts` (5 test: 4 nút hiện trên trang đăng nhập + bấm từng nút vào đúng khu vực).
- **Kiểm chứng tổng:** tsc 0 lỗi, ESLint toàn dự án 0, production build OK (route `/tra-cuu-chung-chi` có trong bảng build). Playwright chính thức **35/35** (30 cũ + 5 mới) — lượt này chạy trên server production (`next start`) vì dev server do Playwright tự khởi động bị sập out-of-memory (V8 "Zone Allocation failed") hai lần liên tiếp sau nhiều vòng build/dev chồng nhau trong ngày (kèm `.next` lẫn artifact khiến `next start` báo `routesManifest.dataRoutes is not iterable`; đã xóa `.next` và build sạch lại — lỗi môi trường máy test, không phải lỗi ứng dụng). Quét tay các trang đã đổi (khách + user1 + mobile 390×844): trang chủ hiện mục đầu bếp cho cả khách và học viên; `/dau-bep` đủ 6 thẻ, số liệu khớp DB; chi tiết đầu bếp khách mở thẳng không bị đẩy sang đăng nhập; tra cứu mã thật `CC-C42B598529` ra chứng chỉ hợp lệ (TEST Pro 2026 — Bí quyết nấu phở và bún — 13/11/2026), mã sai ra thông báo không tìm thấy; mobile không tràn ngang ở cả 4 trang. Đã push `master` và kiểm chứng lại trên live sau deploy.
