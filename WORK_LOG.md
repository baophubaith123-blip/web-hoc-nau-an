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

