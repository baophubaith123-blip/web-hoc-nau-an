# 🤖 AI CONTEXT — Đọc file này TRƯỚC KHI LÀM VIỆC

## 📌 TRẠNG THÁI HIỆN TẠI (cập nhật 05/11/2026)

- Code đã hoàn thiện toàn bộ tính năng: TypeScript 0 lỗi, ESLint 0 lỗi 0 cảnh báo, build production thành công.
- Toàn bộ source đã được commit Git (trước đây phần lớn file chưa từng commit).
- Giao diện hiển thị nhãn tiếng Việt ở mọi Select/quyền lợi gói; ảnh dữ liệu mẫu là ảnh món ăn thật (Unsplash), video bài học là video nấu ăn thật trên YouTube.
- **Đợt nâng cấp 05/11/2026 (đã hoàn thành):** (A) Thiết kế lại giao diện — chuyển trang mượt mà (`template.tsx`), skeleton loading, banner gradient + thẻ nội dung hiện dần ở các trang danh sách, sidebar khu vực thành viên có chip người dùng và huy hiệu hạng thành viên; (B) Xây lại trang cá nhân `/ho-so` (tải avatar, thẻ hạng thành viên Pro/Free kèm ngày hết hạn, ô ngày sinh), khóa Pro kiểu "mờ + ổ khóa + hộp thoại nâng cấp" cho người dùng Free thay vì ẩn nút, **thành viên Pro được đăng cả công thức VÀ bài viết** (không đăng khóa học) — luồng bài viết người dùng: `/tao-bai-viet`, `/bai-viet-cua-toi`, admin duyệt/từ chối kèm lý do tại `/quan-tri/bai-viet` (migration `005_bai_viet_nguoi_dung.sql`: thêm `bai_viet.ly_do_tu_choi`, trạng thái `cho_duyet`/`tu_choi`, RLS cho tác giả); (C) Seed nội dung đợt 2 (file `supabase/seed-2-noi-dung.sql`): thêm 7 công thức, 7 khóa học, 14 bài viết chi tiết. Kiểm thử tự động Playwright: 18 test case (xem `TESTING.md`).
- Lưu ý dữ liệu: database đang chạy có **17 công thức (16 xuất bản + 1 chờ duyệt làm dữ liệu demo duyệt bài), 12 khóa học, 36 bài học (108 câu hỏi trắc nghiệm), 16 bài viết** — khác với `supabase/seed.sql` trong repo (20 công thức, 5 khóa học, 10 bài học, 5 bài viết). Khi cài mới từ seed.sql sẽ ra bộ dữ liệu đầy đủ của repo; nội dung đã áp lên DB live được ghi lại ở `supabase/cap-nhat-noi-dung.sql` (đợt 1) và `supabase/seed-2-noi-dung.sql` (đợt 2).
- Thanh toán đã demo được toàn bộ luồng ở **chế độ mô phỏng** (05/11/2026): `.env.local` đặt mã demo tự sinh (`VNPAY_TMN_CODE=HNADEMO1`, `VNPAY_DEMO=true`) — trang cổng mô phỏng `/thanh-toan-demo` + route `/api/thanh-toan/demo/xu-ly` ký tham số và gọi IPN/return URL thật, admin duyệt và kích hoạt Pro chạy thật (đã kiểm chứng đầu-cuối, Playwright 21/21). Chỉ còn chờ đăng ký dịch vụ thật để chạy production: mã VNPay merchant thật (điền vào `VNPAY_TMN_CODE`/`VNPAY_HASH_SECRET` rồi đặt `VNPAY_DEMO=false`, không sửa code) và `RESEND_API_KEY` (email). `SUPABASE_SERVICE_ROLE_KEY` đã được thay bằng key mới còn hoạt động (key "default" cũ đã chết phía Supabase) — chứng chỉ PDF, form liên hệ, đếm lượt xem đã chạy tốt với key này. Lưu ý DB: migration `006_thanh_toan_bo_sung_cot.sql` đã bổ sung 2 cột còn thiếu của `thanh_toan` và khóa ngoại `yeu_cau_nang_cap.thanh_toan_id`; API tạo giao dịch ghi bằng service role theo đúng thiết kế RLS (migration 002 mục 19).
- **Đã triển khai production trên Vercel (05/11/2026):** https://web-hoc-nau-an.vercel.app — kết nối GitHub, Production Branch = `master` (Vercel mặc định `main`, phải đổi tay trong Settings → Environments → Production), biến môi trường đã cấu hình đủ (thiếu `RESEND_API_KEY`), `VNPAY_DEMO=true` nên cổng demo chạy cả online.
- **Sửa lỗi 3 giao diện vai trò (05/11/2026):** nhật ký hoạt động (sai gợi ý khóa ngoại trong truy vấn — trang từng luôn trống), thẻ thống kê truyền icon dạng chuỗi ở trang admin/báo cáo/hỗ trợ, khung chat ticket tự cuộn cửa sổ (`scrollIntoView`) gây chồng chữ lên header, nhãn ưu tiên/danh mục ticket chưa dịch, trùng tiền tố "Bếp trưởng" ở trang đầu bếp. Test hồi quy: `tests/roles-fix.spec.ts` (suite 25/25, chạy trên server production).
- **Sửa lỗi gõ tiếng Việt trong ô tìm kiếm (05/11/2026):** viết lại `src/components/cong-thuc/bo-loc-cong-thuc.tsx` — ô nhập uncontrolled (không bị URL ghi đè khi đang gõ, chỉ nạp lại khi URL đổi từ bên ngoài), hỗ trợ IME composition (chỉ tìm kiếm khi soạn xong cụm dấu), áp dụng từ khóa bằng `router.replace` xếp hàng tuần tự + tự áp dụng lại (tối đa 5 lần) khi luồng RSC bị hủy (`ERR_ABORTED`). Tránh `router.replace(url, { scroll: false })`: trên Next 15.5 tùy chọn này làm điều hướng không hoàn tất. Test hồi quy: `tests/search-ime.spec.ts` (suite 26/26, chạy trên server production).
- **Tách khung giao diện 3 khu vực vai trò (05/11/2026):** `KhungDashboard` có prop `khuVaiTro` — 3 layout `(quan-tri)`/`(dau-bep)`/`(ho-tro)` bật cờ này để dùng `TopbarVaiTro` (`src/components/layout/topbar-vai-tro.tsx`) thay cho `Header` công khai: trong các khu vực này TUYỆT ĐỐI không có logo về trang chủ/menu công khai, ngăn kéo di động cũng chỉ chứa menu của khu vực. Khu vực thành viên giữ `Header` công khai như cũ. Đường quay về cho staff khi đã ra ngoài: mục đầu tiên của menu avatar công khai ghi nhãn theo vai trò qua helper `thongTinKhuVaiTro` (`src/lib/utils/vai-tro.ts`) và mục "Về trang ..." ở đầu sidebar khu vực thành viên (chèn trong layout `(nguoi-dung)` khi vai trò là staff). Test hồi quy: `tests/role-shell.spec.ts` (suite 29/29, chạy trên server production).


> **Dành cho AI tool (Antigravity, Cursor, Claude, Copilot...)**
> File này chứa TOÀN BỘ context để AI mới hiểu dự án ngay lập tức.
> Đọc kỹ trước khi sinh code.

---

## 🎯 NHIỆM VỤ CỦA BẠN

Bạn là **senior full-stack developer** đang hỗ trợ sinh viên hoàn thành đồ án tốt nghiệp **"Web học nấu ăn online"**.

**Nguyên tắc làm việc:**
1. **Đọc `WORK_LOG.md`** để biết trạng thái hiện tại
2. **Đọc file này** để hiểu quy tắc, cấu trúc, tech stack
3. **Sau MỖI phần code xong**, PHẢI:
   - Rà soát lại toàn bộ code vừa viết
   - Kiểm tra lỗi TypeScript, import, syntax
   - Kiểm tra logic (edge case)
   - Sửa lỗi nếu phát hiện
   - Cập nhật `WORK_LOG.md` (đánh dấu ✅)
4. **Trước khi chuyển phần mới**, hỏi user xác nhận

---

## 🎨 QUY TẮC CODE BẮT BUỘC

| Quy tắc | Chi tiết |
|---------|----------|
| **UI text** | 100% TIẾNG VIỆT có dấu |
| **Comment code** | TIẾNG VIỆT |
| **Tên bảng/cột DB** | TIẾNG VIỆT không dấu (VD: `cong_thuc`) |
| **Tên route** | TIẾNG VIỆT không dấu (VD: `/cong-thuc`) |
| **Tên file/folder** | TIẾNG ANH theo Next.js convention (VD: `cong-thuc-list.tsx`) |
| **TypeScript** | Strict mode, KHÔNG dùng `any` |
| **Component** | Functional, dùng shadcn/ui có sẵn, KHÔNG tự viết UI từ đầu |
| **Form** | React Hook Form + Zod 4 |
| **Data fetching** | Server Components khi có thể, TanStack Query cho client |
| **Mutation** | Server Actions (KHÔNG dùng API routes trừ webhook) |
| **Secrets** | KHÔNG hardcode, dùng `.env.local` |
| **Đường dẫn import** | Dùng alias `@/` |

---

## 🛠️ TECH STACK CHI TIẾT

| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| Framework | Next.js | 15 (App Router) |
| UI Library | React | 19 |
| Ngôn ngữ | TypeScript | strict mode |
| Styling | Tailwind CSS | v4 (KHÔNG có tailwind.config.js) |
| Component UI | shadcn/ui | Base UI + Nova preset (Lucide/Geist) |
| Backend/DB | Supabase | PostgreSQL + Auth + Storage + Realtime |
| State server | TanStack Query | latest |
| State client | Zustand | latest |
| Form | React Hook Form + Zod | Zod 4 |
| Dark Mode | next-themes | latest |
| i18n | i18next + react-i18next | mặc định vi |
| Email | Resend | latest |
| Video | YouTube Embed | iframe + lazy load |
| Toast | Sonner | latest |
| Font | Be Vietnam Pro | Google Font |
| Deploy | Vercel + Supabase Cloud | |

---

## 👥 PHÂN QUYỀN (RBAC) — 5 VAI TRÒ
Admin > Chef > Support > User > Guest

text

| Vai trò | Quyền hạn |
|---------|-----------|
| **Guest** | Chỉ xem giao diện public. Bấm vào nội dung → redirect `/dang-nhap` |
| **User** | Lưu công thức, đăng ký khóa học, bình luận, đánh giá, gửi ticket. **KHÔNG** có nút "Tạo công thức". Xem video preview, không tải tài liệu, không nhận chứng chỉ. |
| **Pro User** | Tất cả quyền User + xem video HD, tải tài liệu PDF, làm bài tập, nhận chứng chỉ, **CÓ nút "Tạo công thức"** (gửi chờ admin duyệt), profile nâng cấp (badge Pro), hỗ trợ 1-1, không quảng cáo |
| **Chef** | Tất cả quyền User + tạo/quản lý công thức & khóa học của mình, xem thống kê, trả lời bình luận |
| **Support** | Tất cả quyền User + quản lý TẤT CẢ ticket hỗ trợ, chat realtime, ghi chú nội bộ, chuyển ticket lên admin |
| **Admin** | Toàn quyền: quản lý user, chef, support, duyệt nội dung, duyệt yêu cầu nâng cấp Pro, xử lý báo cáo, hoàn tiền, cấu hình hệ thống |

**Middleware bảo vệ route theo vai trò:**
- Guest vào `(nguoi-dung)`, `(dau-bep)`, `(quan-tri)`, `(ho-tro)` → redirect `/dang-nhap`
- User vào `(dau-bep)`, `(quan-tri)`, `(ho-tro)` → redirect `/bang-dieu-khien`
- Chef vào `(quan-tri)`, `(ho-tro)` → redirect `/bang-dieu-khien`
- Support vào `(quan-tri)`, `(dau-bep)` → redirect `/bang-dieu-khien`
- Admin vào TẤT CẢ

**Middleware bảo vệ route theo GÓI PRO:**
- `/tao-cong-thuc`, `/tao-cong-thuc/[id]/sua` → chỉ Pro User mới vào được
- User thường → redirect `/nang-cap-pro`

**Phân quyền 2 lớp:**
- Lớp 1: Middleware chặn theo URL pattern
- Lớp 2: Mỗi layout gọi `yeuCauVaiTro()` hoặc `yeuCauPro()` kiểm tra lần nữa (cache theo request)

---

## 💎 MÔ HÌNH GÓI PREMIUM (Pro)

### 2 GÓI (KHÔNG có gói vĩnh viễn)

| Gói | Mã | Thời hạn | Giá | Ghi chú |
|-----|-----|----------|-----|---------|
| Pro Tháng | `pro_thang` | 30 ngày | 99.000 ₫ | Dùng thử |
| Pro Năm | `pro_nam` | 365 ngày | 799.000 ₫ | Tiết kiệm 33% |

**Mọi gói đều có `ngay_het_han` cụ thể — KHÔNG có null/vĩnh viễn.**

### Quyền lợi Pro (quyen_loi JSONB)

Cột `quyen_loi` lưu danh sách **nhãn hiển thị tiếng Việt** (mỗi phần tử là một dòng quyền lợi, admin sửa tự do ở form gói). Danh mục 8 quyền lợi chuẩn nằm ở `QUYEN_LOI_PRO` trong `src/lib/utils/goi.ts` (id → tên hiển thị); component `TheGoi` tự dịch id sang tên nếu gặp dữ liệu cũ còn lưu id:

```json
[
  "xem_video_hd",
  "tai_tai_lieu",
  "lam_bai_tap",
  "nhan_chung_chi",
  "tao_cong_thuc",
  "profile_nang_cap",
  "ho_tro_1_1",
  "khong_quang_cao"
]
Luồng nghiệp vụ
Luồng 1 — User mua gói:

text
User → /nang-cap-pro → Chọn gói → Thanh toán VNPay
     → Tạo yeu_cau_nang_cap (trạng thái: cho_duyet)
     → Admin nhận thông báo realtime
     → Admin vào /quan-tri/duyet-nang-cap → Duyệt
     → Trigger DB tự động: profiles.la_pro = true, tạo goi_nguoi_dung, 
        insert quyen_nguoi_dung, gửi thông báo realtime
     → User thấy badge Pro + mở khóa tính năng
Luồng 2 — Admin cấp gói thủ công:

text
Admin → /quan-tri/quan-ly-nguoi-dung → Chọn user → Modal "Cấp gói Pro"
     → Chọn gói (Tháng/Năm) + ghi chú
     → Action capGoiThuCong → Cập nhật profiles + tạo goi_nguoi_dung (cap_boi_admin=true)
     → User nhận thông báo
Luồng 3 — Pro User đăng công thức:

text
Pro User → /tao-cong-thuc → Điền form → Gửi
        → cong_thuc.trang_thai = 'cho_duyet', tac_gia_la_pro = true
        → Admin duyệt → 'xuat_ban'
        → Admin từ chối → thông báo lý do
Luồng 4 — User thường vào route Pro:

text
User → /tao-cong-thuc
    → Middleware check profiles.la_pro = false hoặc goi_het_han < now()
    → Redirect /nang-cap-pro
Route bảo vệ bởi Pro
/tao-cong-thuc — Chỉ Pro

/tao-cong-thuc/[id]/sua — Chỉ Pro

/hoc-bai/[khoaHocId]/[baiHocId] — Pro xem full, user thường chỉ xem bài có xem_truoc = true

Trang cần tạo cho gói Pro
Public:

/bang-gia — So sánh Free vs Pro

User:

/nang-cap-pro — Chọn gói + thanh toán VNPay

/goi-cua-toi — Lịch sử mua gói + ngày hết hạn

Admin:

/quan-tri/quan-ly-goi — CRUD 2 gói

/quan-tri/duyet-nang-cap — Duyệt yêu cầu nâng cấp

Components gói Pro
src/components/goi/TheGoi.tsx — Card gói

src/components/goi/BangSoSanh.tsx — Bảng Free vs Pro

src/components/goi/NutNangCap.tsx — Nút nâng cấp

src/components/goi/BadgePro.tsx — Badge Pro cạnh tên user (icon vương miện vàng)

src/components/goi/FormMuaGoi.tsx — Form chọn gói + thanh toán

src/components/quan-tri/FormGoi.tsx — CRUD gói

src/components/quan-tri/BangDuyetNangCap.tsx — Table duyệt

src/components/quan-tri/ModalCapGoi.tsx — Modal cấp gói thủ công

🗄️ DATABASE — 24 BẢNG
Database PostgreSQL trên Supabase. Tên bảng/cột TIẾNG VIỆT không dấu.

20 BẢNG CŨ
#	Bảng	Mô tả
1	profiles	Mở rộng auth.users: username, ho_ten, avatar_url, bio, vai_tro (user/chef/support/admin), trang_thai (hoat_dong/khoa), la_pro (bool), goi_hien_tai_id (FK), goi_het_han (timestamptz)
2	danh_muc	Danh mục công thức (phân cấp cha-con), slug, thu_tu
3	cong_thuc	Công thức: tieu_de, slug, nguyen_lieu (JSONB), cac_buoc (JSONB), do_kho, trang_thai (nhap/cho_duyet/xuat_ban/luu_tru/tu_choi), noi_bat, luot_xem, deleted_at, tac_gia_la_pro (bool)
4	cong_thuc_danh_muc	Many-to-many công thức ↔ danh mục
5	khoa_hoc	Khóa học: cap_do, ĐÃ BỎ: gia, mien_phi, co_chung_chi, co_tai_lieu, co_bai_tap, ho_tro_1_1 (giờ theo gói Pro)
6	bai_hoc	Bài học: video_url, tai_lieu (JSONB), bai_tap (JSONB), thu_tu, xem_truoc, chi_pro (bool), video_hd_url (text), tai_lieu_pro (JSONB)
7	dang_ky_khoa_hoc	Đăng ký khóa học
8	tien_do_bai_hoc	Tiến độ từng bài
9	cong_thuc_da_luu	Công thức đã lưu
10	binh_luan	Bình luận có reply
11	danh_gia	Đánh giá sao 1-5
12	bai_viet	Blog
13	ticket_ho_tro	Ticket hỗ trợ
14	tin_nhan_ticket	Tin nhắn trong ticket
15	thong_bao	Thông báo realtime
16	cau_hinh_he_thong	Cấu hình hệ thống
17	nhat_ky_hoat_dong	Audit log
18	bao_cao_vi_pham	Báo cáo vi phạm
19	thanh_toan	Giao dịch: thêm loai_thanh_toan (khoa_hoc/goi_premium), goi_id (FK), khoa_hoc_id cho phép NULL
20	chung_chi	Chứng chỉ (chỉ cấp cho Pro)
4 BẢNG MỚI (Gói Premium)
#	Bảng	Mô tả
21	goi_premium	Gói: ma_goi (pro_thang/pro_nam), ten, thoi_han_ngay (30/365), gia, quyen_loi (JSONB), thu_tu, hoat_dong
22	goi_nguoi_dung	Lịch sử mua gói: nguoi_dung_id, goi_id, ngay_bat_dau, ngay_het_han, trang_thai, cap_boi_admin, ghi_chu
23	yeu_cau_nang_cap	Yêu cầu nâng cấp: ma_yeu_cau (YC-xxxxxx), nguoi_dung_id, goi_id, trang_thai (cho_duyet/da_duyet/tu_choi/da_huy), thanh_toan_id, ly_do_tu_choi, nguoi_duyet_id
24	quyen_nguoi_dung	Cache quyền: nguoi_dung_id (PK), la_pro (bool), goi_hien_tai_id, ngay_het_han, cap_nhat_luc
Trigger & Function
cap_nhat_updated_at() — Tự cập nhật updated_at cho 10 bảng có cột này

tao_profile_moi() — Tạo profile khi user signup

dong_bo_khoa_hoc() — Cập nhật số bài học + tổng thời gian

tinh_tien_do() — Tính % tiến độ khi hoàn thành bài

ghi_dong_luc() — Ghi thời điểm đóng ticket

duyet_nang_cap() — Khi admin duyệt yeu_cau → tự kích hoạt Pro (cập nhật profiles, tạo goi_nguoi_dung, insert quyen_nguoi_dung, gửi thông báo)

kiem_tra_het_han_goi() — Hàm SQL tự cập nhật la_pro=false khi hết hạn (chạy cron hoặc khi login)

la_pro(p_nguoi_dung_id uuid) — Helper check user có Pro không, trả về boolean

RLS Policies
RLS CHƯA BẬT cho 20 bảng cũ — file 002_rls_policies.sql sẽ chạy sau

RLS CHO 4 BẢNG MỚI đã có trong 003_goi_premium.sql:

goi_premium: ai cũng đọc gói active, chỉ admin CRUD

goi_nguoi_dung: user xem của mình, admin full

yeu_cau_nang_cap: user xem/tạo/hủy của mình, admin full

quyen_nguoi_dung: user xem của mình, admin full

📁 CẤU TRÚC THƯ MỤC ĐẦY ĐỦ
text
web-hoc-nau-an/
├── README.md
├── WORK_LOG.md                  # Lịch sử làm việc (cập nhật mỗi session)
├── AI_CONTEXT.md                # File này
├── DATABASE.md                  # Chi tiết schema (nếu có)
├── .env.local                   # Biến môi trường (KHÔNG commit)
├── .env.example
├── next.config.js
├── tsconfig.json
├── middleware.ts                # Root middleware (⏳ CHƯA TẠO)
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql  ✅ ĐÃ CHẠY
│   │   ├── 002_rls_policies.sql    ⏳ CHƯA
│   │   └── 003_goi_premium.sql     ⏳ CHƯA (migration gói Pro)
│   └── seed.sql                 ⏳ CHƯA (20 công thức + users + khóa học)
├── public/
└── src/
    ├── app/
    │   ├── (cong-khai)/         ✅ Layout có
    │   │   ├── page.tsx         ⏳ Trang chủ
    │   │   ├── bang-gia/        ⏳ MỚI — So sánh Free vs Pro
    │   │   ├── cong-thuc/       ⏳
    │   │   ├── khoa-hoc/        ⏳
    │   │   ├── dau-bep/         ⏳
    │   │   ├── bai-viet/        ⏳
    │   │   ├── lien-he/         ⏳
    │   │   ├── gioi-thieu/      ⏳
    │   │   ├── tro-giup/        ⏳
    │   │   └── dang-nhap/       ⏳
    │   ├── (nguoi-dung)/        ✅ Layout có
    │   │   ├── bang-dieu-khien/ ⏳
    │   │   ├── nang-cap-pro/    ⏳ MỚI — Chọn gói + thanh toán
    │   │   ├── goi-cua-toi/     ⏳ MỚI — Lịch sử gói
    │   │   ├── cong-thuc-cua-toi/ ⏳
    │   │   ├── khoa-hoc-cua-toi/ ⏳
    │   │   ├── hoc-bai/         ⏳
    │   │   ├── tao-cong-thuc/   ⏳ (chỉ Pro)
    │   │   ├── cong-thuc-da-gui/ ⏳
    │   │   ├── ho-so/           ⏳
    │   │   ├── thong-bao/       ⏳
    │   │   └── ho-tro/          ⏳
    │   ├── (dau-bep)/           ✅ Layout có
    │   ├── (quan-tri)/          ✅ Layout có
    │   │   ├── bang-dieu-khien/ ⏳
    │   │   ├── quan-ly-goi/     ⏳ MỚI — CRUD gói
    │   │   ├── duyet-nang-cap/  ⏳ MỚI — Duyệt yêu cầu Pro
    │   │   └── ... (13 trang khác)
    │   ├── (ho-tro)/            ✅ Layout có
    │   ├── api/                 ⏳ Phần 4D
    │   ├── layout.tsx           ✅
    │   ├── globals.css          ✅
    │   ├── not-found.tsx        ✅
    │   ├── error.tsx            ✅
    │   └── loading.tsx          ✅
    ├── components/
    │   ├── ui/                  ⏳ Cần cài shadcn add
    │   ├── layout/              ✅ 10 file
    │   ├── thong-bao/           ✅ chuong-thong-bao.tsx
    │   ├── goi/                 ⏳ MỚI — TheGoi, BangSoSanh, NutNangCap, BadgePro, FormMuaGoi
    │   ├── cong-thuc/           ⏳
    │   ├── khoa-hoc/            ⏳
    │   ├── binh-luan/           ⏳
    │   ├── danh-gia/            ⏳
    │   ├── auth/                ⏳
    │   ├── ho-tro/              ⏳
    │   ├── thanh-toan/          ⏳
    │   └── quan-tri/            ⏳ (FormGoi, BangDuyetNangCap, ModalCapGoi)
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts        ⏳ CẦN TẠO NGAY
    │   │   ├── server.ts        ⏳ CẦN TẠO NGAY
    │   │   ├── middleware.ts    ⏳ CẦN TẠO NGAY
    │   │   └── admin.ts         ⏳ CẦN TẠO NGAY
    │   ├── actions/
    │   │   └── chung.ts         ✅
    │   ├── validations/         ✅ 9 file
    │   │   ├── goi.ts           ⏳ MỚI
    │   │   └── yeu-cau-nang-cap.ts ⏳ MỚI
    │   ├── i18n/
    │   │   ├── vi.ts            ✅
    │   │   └── config.ts        ⏳ CẦN TẠO NGAY
    │   ├── email/
    │   │   └── gui-email.ts     ⏳ Phần 4D (thêm guiEmailNangCapPro)
    │   ├── thanh-toan/
    │   │   └── vnpay.ts         ⏳ Phần 4D (hỗ trợ cả khóa học + gói)
    │   ├── pdf/
    │   │   └── chung-chi.ts     ⏳ Phần 4D
    │   └── utils/
    │       ├── phan-hoi-loi.ts  ⏳ CẦN TẠO NGAY
    │       ├── slug.ts          ⏳ CẦN TẠO NGAY
    │       ├── vai-tro.ts       ⏳ CẦN TẠO NGAY
    │       ├── hang-so.ts       ⏳ CẦN TẠO NGAY
    │       ├── sanitize.ts      ⏳ CẦN TẠO NGAY
    │       ├── youtube.ts       ⏳ CẦN TẠO NGAY
    │       ├── dinh-dang.ts     ⏳ CẦN TẠO NGAY
    │       ├── cn.ts            ⏳ CẦN TẠO NGAY
    │       └── goi.ts           ⏳ MỚI — laProHopLe, tinhNgayHetHan, formatGiaVND
    ├── hooks/
    │   └── use-realtime-thong-bao.ts ✅
    ├── actions/                 ✅ 10 file
    │   ├── goi.ts               ⏳ MỚI
    │   └── quan-tri/
    │       └── quan-ly-goi.ts   ⏳ MỚI
    ├── providers/               ✅ 4 file
    └── types/
        ├── database.ts          ⏳ Generate từ Supabase
        └── index.ts             ⏳ CẦN TẠO NGAY (thêm GoiPremium, YeuCauNangCap)
🚨 CÁC FILE CLAUDE ĐÃ TẠO NHƯNG IMPORT TỪ FILE CHƯA TỒN TẠI
Các file sau cần tạo NGAY để project build được:

File cần tạo	Export cần có	Dùng bởi
src/lib/supabase/client.ts	taoSupabaseClient()	use-realtime-thong-bao, user-menu
src/lib/supabase/server.ts	taoSupabaseServer(), layPhienHienTai(), yeuCauVaiTro(), yeuCauPro()	5 layouts, actions
src/lib/supabase/middleware.ts	capNhatPhien()	middleware.ts
src/lib/supabase/admin.ts	taoSupabaseAdmin()	actions
src/lib/utils/phan-hoi-loi.ts	thanhCong(), thatBai(), chuanHoaLoi(), KetQua<T>	TẤT CẢ actions
src/lib/utils/slug.ts	taoSlugDuyNhat()	actions cong-thuc, khoa-hoc, bai-viet
src/lib/utils/vai-tro.ts	MENU_*, MucMenu, trangChuTheoVaiTro()	5 layouts, sidebar, header
src/lib/utils/hang-so.ts	MAU_BADGE, TONG_VAI_TRO, nhanCua()	user-menu
src/lib/utils/sanitize.ts	lamSachVanBan()	validations/chung
src/lib/utils/youtube.ts	layIdYoutube()	validations/chung
src/lib/utils/dinh-dang.ts	dinhDangTuongDoi()	chuong-thong-bao
src/lib/utils/cn.ts	cn()	Nhiều component
src/lib/utils/goi.ts	laProHopLe(), tinhNgayHetHan(), formatGiaVND()	Components gói
src/lib/i18n/config.ts	t(), i18next	validations, actions, footer
src/types/index.ts	Bang<T>, VaiTro, BaiTap, GoiPremium, YeuCauNangCap	Nhiều file
src/lib/email/gui-email.ts	4 hàm email (thêm guiEmailNangCapPro())	actions
⚠️ KHÔNG CHẠY npm run build ĐƯỢC cho đến khi tạo xong tất cả file trên.

🎯 THỨ TỰ CÔNG VIỆC CẦN LÀM
BƯỚC 1: Hoàn thiện Setup
1.1. Cấu hình Supabase Dashboard:

Authentication → URL Configuration:

Site URL: http://localhost:3000

Redirect URLs: http://localhost:3000/**

Storage → tạo 4 bucket public: avatars, cong-thuc, khoa-hoc, bai-viet

1.2. Tạo file .env.local:

env
NEXT_PUBLIC_SUPABASE_URL=https://qvsrkxnqeylwtyggyxly.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sb_publishable_...>
SUPABASE_SERVICE_ROLE_KEY=<sb_secret_...>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=
EMAIL_FROM="Học Nấu Ăn <onboarding@resend.dev>"
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/api/thanh-toan/vnpay/ket-qua
1.3. Generate types:

bash
npx supabase gen types typescript --project-id qvsrkxnqeylwtyggyxly > src/types/database.ts
BƯỚC 2: Tạo 4 file Supabase client
src/lib/supabase/client.ts — taoSupabaseClient() (browser)

src/lib/supabase/server.ts — taoSupabaseServer(), layPhienHienTai(), yeuCauVaiTro(cho?), yeuCauPro() (mới)

src/lib/supabase/middleware.ts — capNhatPhien(request)

src/lib/supabase/admin.ts — taoSupabaseAdmin()

BƯỚC 3: Tạo các file utils
src/lib/utils/phan-hoi-loi.ts — thanhCong(), thatBai(), chuanHoaLoi(), KetQua<T>

src/lib/utils/slug.ts — taoSlugDuyNhat(ten)

src/lib/utils/vai-tro.ts — MENU_*, MucMenu, trangChuTheoVaiTro()

src/lib/utils/hang-so.ts — MAU_BADGE, TONG_VAI_TRO, nhanCua()

src/lib/utils/sanitize.ts — lamSachVanBan()

src/lib/utils/youtube.ts — layIdYoutube()

src/lib/utils/dinh-dang.ts — dinhDangTuongDoi()

src/lib/utils/cn.ts — cn()

src/lib/utils/goi.ts — laProHopLe(profile), tinhNgayHetHan(goi), formatGiaVND(gia)

BƯỚC 4: Tạo src/lib/i18n/config.ts
Init i18next với resource từ vi.ts, export i18next (default) + t().

BƯỚC 5: Tạo src/types/index.ts
Export:

Bang<T> — type helper từ Database

VaiTro — 'user' | 'chef' | 'support' | 'admin'

BaiTap — { cau_hoi, lua_chon, dap_an_dung, diem }

GoiPremium — Row từ goi_premium

YeuCauNangCap — Row từ yeu_cau_nang_cap

GoiNguoiDung — Row từ goi_nguoi_dung

BƯỚC 6: Migration gói Premium
Tạo file supabase/migrations/003_goi_premium.sql (nội dung tôi đã viết ở tin nhắn trước)

User sẽ paste file vào Supabase SQL Editor để chạy

File này tạo 4 bảng mới + sửa 5 bảng cũ + seed 2 gói + trigger + RLS

BƯỚC 7: Seed data
Tạo file supabase/seed.sql (cập nhật)

Nội dung: 5 users, 10 danh mục, 20 công thức, 5 khóa học, 10 bài học, 20 bình luận, 30 đánh giá, 5 bài viết, 3 ticket

User sẽ paste vào Supabase SQL Editor để chạy

Phải IDEMPOTENT (ON CONFLICT DO NOTHING)

BƯỚC 8: Hoàn thiện Phần 4D
src/lib/email/gui-email.ts — 4 hàm + 5 mẫu email

src/lib/thanh-toan/vnpay.ts — Tạo URL, ký, xác minh IPN (hỗ trợ cả khóa học + gói Premium)

src/lib/pdf/chung-chi.ts — PDF có QR

7 API routes:

src/app/api/auth/callback/route.ts

src/app/api/thanh-toan/vnpay/tao-url/route.ts (nhận loai: 'khoa_hoc' | 'goi_premium')

src/app/api/thanh-toan/vnpay/ket-qua/route.ts

src/app/api/thanh-toan/vnpay/ipn/route.ts

src/app/api/chung-chi/[ma]/pdf/route.ts

src/app/api/luot-xem/route.ts

src/app/api/lien-he/route.ts

BƯỚC 9: Actions gói Premium (MỚI)
src/actions/goi.ts — User: muaGoi(goiId), huyYeuCau(id), layGoiCuaToi()

src/actions/quan-tri/quan-ly-goi.ts — Admin: taoGoi(), suaGoi(), xoaGoi(), duyetNangCap(id), tuChoiNangCap(id, lyDo), capGoiThuCong(nguoiDungId, goiId, ghiChu), thuHoiGoi(nguoiDungId, lyDo)

src/lib/validations/goi.ts + src/lib/validations/yeu-cau-nang-cap.ts

BƯỚC 10: UI Components gói Premium
src/components/goi/TheGoi.tsx

src/components/goi/BangSoSanh.tsx

src/components/goi/NutNangCap.tsx

src/components/goi/BadgePro.tsx

src/components/goi/FormMuaGoi.tsx

src/components/quan-tri/FormGoi.tsx

src/components/quan-tri/BangDuyetNangCap.tsx

src/components/quan-tri/ModalCapGoi.tsx

BƯỚC 11: 53 trang (bao gồm 5 trang mới)
Theo thứ tự: Auth → Public → User → Chef → Admin → Support

Trang mới so với kế hoạch cũ:

/bang-gia (public)

/nang-cap-pro (user)

/goi-cua-toi (user)

/quan-tri/quan-ly-goi (admin)

/quan-tri/duyet-nang-cap (admin)

BƯỚC 12: Cập nhật UI hiển thị Pro
Ẩn nút "Tạo công thức" khỏi sidebar nếu user không phải Pro

Hiển thị BadgePro cạnh tên user trong UserMenu

Hiển thị BadgePro trong CommentItem (nếu tác giả là Pro)

Hiển thị BadgePro trong ChefCard (nếu chef là Pro)

Middleware chặn route Pro

BƯỚC 13: Test build
bash
npm run build
Sửa HẾT lỗi TypeScript.

BƯỚC 14: Test chạy
bash
npm run dev
Trang chủ load

Đăng nhập admin/chef/user

User thường: KHÔNG thấy nút "Tạo công thức"

User mua gói Pro → admin duyệt → thấy badge Pro + nút "Tạo công thức"

Admin cấp gói thủ công → user thấy ngay

Chuyển dark mode

Realtime thông báo

📦 DEPENDENCIES
json
{
  "dependencies": {
    "next": "15.x",
    "react": "19.x",
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "@tanstack/react-query": "latest",
    "zustand": "latest",
    "react-hook-form": "latest",
    "zod": "4.x",
    "next-themes": "latest",
    "i18next": "latest",
    "react-i18next": "latest",
    "resend": "latest",
    "sonner": "latest",
    "lucide-react": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "nanoid": "latest",
    "pdf-lib": "latest",
    "qrcode": "latest"
  }
}
Cài thêm:

bash
npm i resend nanoid pdf-lib qrcode
npx shadcn@latest add button card input label badge avatar dropdown-menu dialog sheet tabs table form select textarea checkbox switch sonner separator skeleton popover alert-dialog alert progress
🚨 LỖI THƯỜNG GẶP & CÁCH TRÁNH
Lỗi	Cách tránh
Quên 'use client' cho component dùng hook	Kiểm tra kỹ đầu file
Quên await cho createClient() server	Server client là async function
Dùng any cho Supabase types	Dùng types đã generate
Quên revalidatePath() sau mutation	Gọi sau mỗi Server Action
Sai tên bảng (Anh thay vì Việt)	Check AI_CONTEXT.md
UI text tiếng Anh	Dịch hết sang tiếng Việt
Hardcode secret	Dùng process.env
Quên 'use server' cho Server Action	Đầu file actions
Zod 4 dùng message	Dùng { error: ... }
z.uuid() fail với seed.sql	Dùng z.guid()
Form số bị NaN	Dùng valueAsNumber: true
Hydration mismatch ở theme-toggle	Dùng class dark:
Quên check Pro ở route tạo công thức	Middleware + layout double check
Quên revalidate sau khi duyệt nâng cấp	revalidatePath('/bang-dieu-khien')
🔄 QUY TRÌNH LÀM VIỆC VỚI AI
Khi user yêu cầu code phần X:

Đọc context: AI_CONTEXT.md + WORK_LOG.md + file liên quan

Xác nhận hiểu: Tóm tắt + liệt kê file sẽ tạo/sửa + hỏi user

Code: Đầy đủ, không TODO, comment tiếng Việt

Rà soát sau khi code xong (BẮT BUỘC):

✅ TypeScript errors

✅ Imports đầy đủ

✅ Syntax

✅ Logic (edge case)

✅ Tuân thủ quy tắc

✅ UI text tiếng Việt

✅ Tên bảng/cột DB đúng

✅ Sửa lỗi ngay

✅ Báo cáo user

Cập nhật WORK_LOG.md

Hỏi user test trước khi chuyển phần mới

📊 TỔNG KẾT TIẾN ĐỘ
Giai đoạn	Trạng thái	Ghi chú
Setup ban đầu	🟡 90%	Còn URL Config + Storage + .env + types
Phần 4A (Zod)	✅ 100%	9 file validations
Phần 4B (Layout)	✅ 100%	11 components + 5 layouts
Phần 4C (Actions)	✅ 100%	10 file actions
Migration 003 gói Pro	⏳ 0%	Cần chạy
Seed 20 công thức	⏳ 0%	Cần chạy
Phần 4D (Email/VNPay/API)	⏳ 0%	Cần làm
File utils (bổ sung)	⏳ 0%	Cần làm ngay
Supabase clients	⏳ 0%	Cần làm ngay
Actions gói Pro	⏳ 0%	MỚI — Cần làm
Components gói Pro	⏳ 0%	MỚI — Cần làm
Phần 5 (Components)	⏳ 0%	Sau 4D
Phần 6 (53 pages)	⏳ 0%	Sau Phần 5
RLS Policies (20 bảng cũ)	⏳ 0%	File 002_rls_policies.sql
Deploy	⏳ 0%	Vercel + Supabase Cloud
🎯 MỤC TIÊU CUỐI CÙNG
Hoàn thành 53+ màn hình với đầy đủ tính năng:

Nhóm	Số màn hình
Public (Guest)	16 (thêm /bang-gia)
User	12 (thêm /nang-cap-pro, /goi-cua-toi)
Chef	6
Admin	17 (thêm /quan-ly-goi, /duyet-nang-cap)
Support	3
Tổng	54
📞 THÔNG TIN LIÊN HỆ
Ngôn ngữ giao tiếp: Tiếng Việt

Múi giờ: GMT+7

Cách liên lạc: Chat trực tiếp

🔄 CẬP NHẬT FILE NÀY
Sau mỗi session làm việc lớn, cập nhật:

Trạng thái hiện tại

File đã tạo/sửa

Việc tiếp theo

File này là "bộ não" của dự án. Không được để lỗi thời.

Lần cập nhật cuối: [Điền ngày]
Người cập nhật: [Điền tên]

text

---

## 📋 HƯỚNG DẪN SỬ DỤNG

### Bước 1: Cập nhật file `AI_CONTEXT.md`

Copy toàn bộ nội dung ở trên, paste vào file `AI_CONTEXT.md` trong `D:\web-hoc-nau-an\`.

### Bước 2: Cập nhật file `WORK_LOG.md`

Thêm mục **"Mô hình Gói Premium"** vào phần GHI CHÚ QUAN TRỌNG (nội dung tôi đã viết ở tin nhắn trước).

### Bước 3: Mở Antigravity

1. Trỏ đến thư mục `D:\web-hoc-nau-an\`
2. Paste prompt hoàn chỉnh tôi đã viết ở tin nhắn trước (prompt có 8 nhóm)
3. Antigravity sẽ đọc 2 file, tóm tắt, chờ bạn xác nhận
4. Bạn gõ "OK bắt đầu" → Antigravity code liên tục

### Bước 4: Chạy migration + seed

Sau khi Antigravity viết xong file `003_goi_premium.sql` và `seed.sql`:
1. Vào Supabase SQL Editor
2. Paste nội dung `003_goi_premium.sql` → Run
3. Paste nội dung `seed.sql` → Run
4. Kiểm tra Table Editor: 24 bảng, 20 công thức, 2 gói Pro

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Migration 003 phải chạy TRƯỚC khi test** — vì code sẽ reference các bảng mới
2. **Seed phải idempotent** — chạy lại không nhân đôi dữ liệu
3. **Nếu Antigravity báo "cần session mới"** — mở chat mới, paste lại prompt, nó sẽ đọc `WORK_LOG.md` để biết đang dừng ở đâu
4. **Sau khi xong gói Pro** — test kỹ 4 luồng nghiệp vụ trước khi chuyển phần tiếp