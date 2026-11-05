# 🍳 Nền Tảng Học Nấu Ăn Trực Tuyến — Đồ Án Tốt Nghiệp

> **Web Học Nấu Ăn Online** là nền tảng số hóa giáo dục ẩm thực hiện đại, kết nối cộng đồng yêu bếp với các đầu bếp chuyên nghiệp. Hệ thống cung cấp công thức chuẩn vị, khóa học video chất lượng cao kèm bài tập thực hành, hỗ trợ tương tác và mô hình nâng cấp thành viên **Pro Premium** linh hoạt.

[![Next.js](https://img.shields.io/badge/Next.js-15.0_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0_Strict-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_Auth-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 📌 1. Tổng Quan Dự Án

- **Tên đồ án:** Web học nấu ăn online
- **Mục tiêu:** Xây dựng một website học nấu ăn toàn diện phục vụ từ người mới bắt đầu đến người học nâng cao; cung cấp công thức, bài học tương tác, hệ thống cấp chứng chỉ trực tuyến và quản lý vận hành khép kín.
- **Mô hình hoạt động:** Chuyển đổi từ bán khóa học lẻ sang **gói hội viên cao cấp (Pro Membership)**, tối ưu trải nghiệm học tập liên tục và mở khóa đặc quyền tác giả nội dung.
- **Quy mô hệ thống:** 68 màn hình chuyên biệt (17 Public, 14 Học viên, 8 Đầu bếp, 26 Quản trị viên, 3 Nhân viên CSKH), 7 API route cùng 24 bảng cơ sở dữ liệu quan hệ.

---

## 🛠️ 2. Tech Stack

| Thành phần | Công nghệ / Thư viện | Phiên bản / Chi tiết |
|---|---|---|
| **Core Framework** | Next.js (App Router, Server Actions) | v15.x |
| **Giao diện & UI** | React, Tailwind CSS, shadcn/ui | React 19, Tailwind v4, Nova preset (Geist/Lucide) |
| **Ngôn ngữ** | TypeScript | Strict mode (100% type-safe, không dùng `any`) |
| **Backend & Database** | Supabase | PostgreSQL 15, Supabase Auth, Storage, Realtime |
| **Quản lý State** | TanStack Query, Zustand | v5 (Server state cache & Client app state) |
| **Xử lý Form & Schema** | React Hook Form, Zod | Zod 4 schema validation |
| **Giao tiếp Email** | Resend API | Email thông báo tài khoản & duyệt gói Pro |
| **Cổng thanh toán** | VNPay Payment Gateway | Môi trường Sandbox thử nghiệm |
| **Phát video** | YouTube Player Embed API | Lazy load tối ưu điểm số Core Web Vitals |
| **Theme & i18n** | next-themes, react-i18next | Dark/Light mode, Tiếng Việt có dấu 100% |

---

## 👥 3. Phân Quyền Người Dùng (5 Vai Trò)

Hệ thống thiết lập phân quyền RBAC phân tầng nghiêm ngặt:

| Vai trò | Phạm vi truy cập | Quyền hạn chính |
|---|---|---|
| **1. Guest (Khách)** | Trang công khai (`/`, `/cong-thuc`, `/khoa-hoc`, `/bang-gia`, `/bai-viet`) | Xem danh sách nội dung tổng quan; khi bấm vào chi tiết hoặc tương tác sẽ được chuyển hướng sang `/dang-nhap`. |
| **2. User (Học viên Free)** | Bảng điều khiển cá nhân (`/bang-dieu-khien`, `/ho-so`, `/goi-cua-toi`) | Xem chi tiết công thức, lưu món ăn, viết bình luận, gửi đánh giá sao, xem video giới thiệu (preview) khóa học. **Không có quyền tạo công thức.** |
| **3. Pro User (Học viên Pro)** | Mở khóa toàn bộ đặc quyền hội viên cao cấp | Mọi quyền của User Free + **CÓ nút Tạo công thức (`/tao-cong-thuc`)**, xem video HD 1080p khóa học, tải tài liệu PDF, làm bài tập trắc nghiệm có chấm điểm, cấp chứng chỉ PDF/QR, hỗ trợ 1-1, huy hiệu Pro vương miện vàng, không quảng cáo. |
| **4. Chef (Đầu bếp)** | Gian bếp sáng tạo (`/bep/*`) | Đăng và quản lý công thức món ăn, tạo và cập nhật giáo trình khóa học/bài học của mình, thống kê số lượng học viên và phản hồi bình luận. |
| **5. Support (Hỗ trợ viên)** | Trung tâm chăm sóc khách hàng (`/nhan-vien/*`) | Quản lý toàn bộ danh sách ticket khiếu nại, chat thời gian thực giải đáp thắc mắc của học viên, thêm ghi chú nội bộ, chuyển tiếp hồ sơ lên Admin. |
| **6. Admin (Quản trị viên)** | Trung tâm điều hành tối cao (`/quan-tri/*`) | Toàn quyền kiểm soát hệ thống: duyệt yêu cầu nâng cấp Pro, cấp gói thủ công, kiểm duyệt công thức/bài viết, quản trị người dùng, quản trị tài chính doanh thu, cấu hình hệ thống và audit log. |

---

## 💎 4. Mô hình Gói Premium (Pro Membership)

Nền tảng vận hành theo mô hình gói dịch vụ thời hạn cố định, **hoàn toàn KHÔNG có gói vĩnh viễn**:

| Tiêu chí | Gói Pro Tháng | Gói Pro Năm (Tiết kiệm 33%) |
|---|---|---|
| **Mã định danh** | `pro_thang` | `pro_nam` |
| **Thời hạn sử dụng** | **30 ngày** (tính từ thời điểm duyệt) | **365 ngày** (tính từ thời điểm duyệt) |
| **Mức phí niêm yết** | **99.000 ₫** | **799.000 ₫** *(tương đương ~66.000 ₫/tháng)* |
| **Quyền lợi nổi bật** | Xem Full video HD, tải giáo trình PDF, làm bài test cấp chứng chỉ, quyền đăng công thức chờ duyệt, huy hiệu Pro vương miện vàng. | Toàn bộ quyền lợi gói tháng + ưu tiên kết nối chef 1-1 và tiết kiệm tối đa chi phí học tập. |
| **Hình thức kích hoạt** | Thanh toán qua VNPay ➜ Tạo yêu cầu ➜ Admin duyệt; hoặc Admin chủ động cấp trực tiếp trong quản trị. | Thanh toán qua VNPay ➜ Tạo yêu cầu ➜ Admin duyệt; hoặc Admin chủ động cấp trực tiếp trong quản trị. |

---

## 📂 5. Cấu Trúc Thư Mục Dự Án

```text
D:\web-hoc-nau-an\
├── src/
│   ├── app/                                # Next.js App Router (68 màn hình)
│   │   ├── (cong-khai)/                    # Trang dành cho khách & tổng quan
│   │   ├── (nguoi-dung)/                   # Bảng điều khiển cá nhân & mua gói
│   │   ├── (dau-bep)/bep/                  # Giao diện quản lý của Đầu bếp
│   │   ├── (ho-tro)/nhan-vien/             # Giao diện Ticket của Hỗ trợ viên
│   │   ├── (quan-tri)/quan-tri/            # Trung tâm điều hành Quản trị viên
│   │   └── api/                            # Webhook & REST endpoints (VNPay, Resend)
│   ├── components/                         # Thư viện component giao diện
│   │   ├── ui/                             # shadcn/ui components (Base UI)
│   │   ├── cong-thuc/                      # Thẻ, bộ lọc, form công thức
│   │   ├── khoa-hoc/                       # Player video, bài tập, tiến độ
│   │   ├── goi/                            # Bảng giá, badge Pro, thẻ gói
│   │   └── quan-tri/                       # DataTable, biểu đồ, modal duyệt gói
│   ├── lib/                                # Cấu hình lõi & tiện ích dùng chung
│   │   ├── actions/                        # Server Actions thực thi nghiệp vụ
│   │   ├── validations/                    # Zod schemas kiểm định dữ liệu
│   │   ├── supabase/                       # Supabase client (Client, Server, Middleware)
│   │   └── utils/                          # Hàm format tiền tệ, thời gian, RBAC
│   ├── hooks/                              # Custom React Hooks
│   ├── providers/                          # Theme, QueryClient, Toast Providers
│   └── types/                              # TypeScript interfaces & Supabase DB types
├── supabase/                               # Dữ liệu & Cơ sở dữ liệu
│   ├── migrations/                         # File migration cấu trúc bảng (001 - 004)
│   ├── seed.sql                            # Nạp 20 công thức, 10 danh mục, 5 khóa học
│   └── kich_hoat_tai_khoan.sql             # Script kích hoạt tài khoản test
├── .env.example                            # Khung cấu hình biến môi trường
├── README.md                               # Tổng quan dự án (File này)
├── TAILIEU-NGHIEPVU.md                     # Tài liệu đặc tả quy trình nghiệp vụ
├── TAILIEU-GIAODIEN.md                     # Tài liệu giao diện wireframe các màn hình
├── TAILIEU-KYTHUAT-FRONTEND.md             # Hướng dẫn kiến trúc kỹ thuật Frontend
├── TAILIEU-KYTHUAT-ADMIN.md                # Hướng dẫn kiến trúc kỹ thuật Admin
└── AGENT.md                                # Quy chuẩn chỉ dẫn AI phát triển code
```

---

## ⚡ 6. Hướng Dẫn Cài Đặt & Chạy Nhanh (8 Bước)

### Bước 1: Chuẩn bị môi trường
Yêu cầu máy tính cài đặt sẵn **Node.js 18.18+** hoặc **Node.js 20+** và công cụ quản lý gói `npm`.

### Bước 2: Clone source code và cài đặt dependencies
```bash
cd D:\web-hoc-nau-an
npm install
```

### Bước 3: Thiết lập biến môi trường
Tạo file `.env.local` từ mẫu `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Dịch vụ gửi email Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM="Học Nấu Ăn <onboarding@resend.dev>"

# Cổng thanh toán VNPay Sandbox
VNPAY_TMN_CODE=TESTCODE
VNPAY_HASH_SECRET=SECRETKEY
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/api/thanh-toan/vnpay/ket-qua
# Đặt true để dùng cổng thanh toán DEMO ngay trong web (không cần mã VNPay thật,
# toàn bộ luồng IPN/duyệt/kích hoạt Pro vẫn chạy thật); có mã thật thì đặt false.
VNPAY_DEMO=true
```

### Bước 4: Khởi tạo Database trên Supabase
1. Mở [Supabase Dashboard](https://supabase.com/dashboard) ➜ Bấm vào mục **SQL Editor**.
2. Thực thi lần lượt các file trong thư mục `supabase/migrations/`:
   - `001_initial_schema.sql`: Khởi tạo các bảng cơ sở dữ liệu nền tảng.
   - `002_rls_policies.sql`: Kích hoạt chính sách bảo mật tầng dòng (RLS).
   - `003_goi_premium.sql`: Tạo 4 bảng Gói Pro, trigger duyệt tự động và hàm kiểm tra.
   - `004_rls_policies.sql`: Bổ sung/chốt chính sách RLS.
   - `005_bai_viet_nguoi_dung.sql`: Bài viết người dùng gửi duyệt (cột lý do từ chối, trạng thái chờ duyệt/từ chối, RLS cho tác giả).
   - `006_thanh_toan_bo_sung_cot.sql`: Bổ sung cột `loai_thanh_toan`, `goi_id` cho bảng `thanh_toan` và khóa ngoại cho `yeu_cau_nang_cap` (chạy lặp lại an toàn).

### Bước 5: Nạp dữ liệu mẫu (Seed Data)
Mở file `supabase/seed.sql`, copy dán vào **SQL Editor** trên Supabase và bấm **Run**. Thao tác này sẽ tạo:
- 10 Danh mục ẩm thực (Món Việt, Á, Âu, Chay, Tráng miệng, Khai vị, Canh/súp, Nướng, Chiên, Đồ uống).
- 20 Công thức mẫu hoàn chỉnh kèm hình ảnh Unsplash và video YouTube hướng dẫn.
- 5 Khóa học tiêu biểu và các bài học mẫu.

### Bước 6: Kích hoạt 5 tài khoản test đa vai trò
Copy toàn bộ nội dung file `supabase/kich_hoat_tai_khoan.sql` vào **SQL Editor** và bấm **Run**. Mật khẩu chung đồng nhất là: **`Matkhau@123`**.

| Giao diện cần test | Tài khoản đăng nhập | Mật khẩu | Đường dẫn đích sau đăng nhập |
|---|---|---|---|
| **Admin Quản trị** | `admin@naungon.vn` | `Matkhau@123` | `/quan-tri` |
| **Chef Đầu bếp** | `chef@naungon.vn` | `Matkhau@123` | `/bep` |
| **Support Chăm sóc** | `support@naungon.vn` | `Matkhau@123` | `/nhan-vien` |
| **Học viên Pro** | `user1@naungon.vn` | `Matkhau@123` | `/bang-dieu-khien` (Có badge Pro, tạo món) |
| **Học viên Free** | `user2@naungon.vn` | `Matkhau@123` | `/bang-dieu-khien` (Quyền học cơ bản) |

### Bước 7: Khởi chạy máy chủ phát triển
```bash
npm run dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000).

### Bước 8: Kiểm tra biên dịch & Build Production
```bash
npm run build
```
Hệ thống sẽ biên dịch sạch 63 route mà không gặp bất kỳ lỗi Type hay Syntax nào.

---

## 📚 7. Danh Mục Tài Liệu Kèm Theo

Bộ tài liệu kỹ thuật chi tiết của đồ án được phân chia độc lập theo vai trò tra cứu:

1. 📄 [**Tài Liệu Nghiệp Vụ (TAILIEU-NGHIEPVU.md)**](./TAILIEU-NGHIEPVU.md): Đặc tả 7 luồng vận hành kinh doanh, 15 quy tắc nghiệp vụ, bảng ma trận phân quyền RBAC và sơ đồ chuyển đổi trạng thái thực thể.
2. 🖥️ [**Tài Liệu Giao Diện (TAILIEU-GIAODIEN.md)**](./TAILIEU-GIAODIEN.md): Đặc tả chi tiết Design System và cấu trúc Wireframe ASCII cho các màn hình trong đồ án.
3. 💻 [**Tài Liệu Kỹ Thuật Frontend (TAILIEU-KYTHUAT-FRONTEND.md)**](./TAILIEU-KYTHUAT-FRONTEND.md): Hướng dẫn triển khai Client/Server components, quản trị state TanStack Query/Zustand, Server Actions và Realtime cho học viên.
4. ⚙️ [**Tài Liệu Kỹ Thuật Admin (TAILIEU-KYTHUAT-ADMIN.md)**](./TAILIEU-KYTHUAT-ADMIN.md): Hướng dẫn chuyên sâu xây dựng Admin Dashboard, xử lý duyệt duyệt yêu cầu Pro, Audit Log, bảo vệ tuyến RLS và báo cáo Recharts.
5. 🤖 [**Quy Ước Làm Việc Với AI (AGENT.md)**](./AGENT.md): Bộ nguyên tắc chỉ đạo, checklist nghiệm thu mã nguồn và kỹ năng tối ưu context dành cho các công cụ AI Pair Programmer.

---

## 📜 8. Bản Quyền & Giấy Phép (License)

Dự án được xây dựng phục vụ mục đích bảo vệ **Đồ án Tốt nghiệp Đại học**. Toàn bộ mã nguồn và tài liệu thuộc quyền tác giả sinh viên thực hiện, phát hành theo giấy phép học thuật phi thương mại.

---

## 📞 9. Thông Tin Liên Hệ

- **Sinh viên thực hiện:** [Điền Họ và Tên sinh viên]
- **Mã số sinh viên (MSSV):** [Điền MSSV]
- **Giảng viên hướng dẫn:** [Điền Tên Giảng Viên Hướng Dẫn]
- **Email học tập:** [Điền địa chỉ Email]
- **Cơ sở đào tạo:** [Điền tên Trường Đại học / Khoa Công nghệ thông tin]
