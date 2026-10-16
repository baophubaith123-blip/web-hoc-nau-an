# 🖥️ TÀI LIỆU THIẾT KẾ GIAO DIỆN & ĐẶC TẢ WIREFRAME (54 MÀN HÌNH)
# NỀN TẢNG HỌC NẤU ĂN TRỰC TUYẾN (WEB HỌC NẤU ĂN ONLINE)

> **Mục đích:** Đặc tả chi tiết Design System, cấu trúc Layout chung và Wireframe chi tiết cho **54 màn hình** trong toàn bộ hệ thống để phục vụ việc lập trình giao diện (Frontend Development) một cách chính xác, đồng nhất.  
> **Ngôn ngữ:** Tiếng Việt  
> **Tech stack UI:** Next.js 15 App Router, React 19, Tailwind CSS v4, shadcn/ui (Base UI + Nova Preset).

---

## 📑 MỤC LỤC
1. [Hệ Thống Thiết Kế (Design System)](#1-hệ-thống-thiết-kế-design-system)
2. [Cấu Trúc Layout Chung Nền Tảng](#2-cấu-trúc-layout-chung-nền-tảng)
3. [Bảng Tổng Hợp 54 Màn Hình](#3-bảng-tổng-hợp-54-màn-hình)
4. [Chi Tiết Wireframe 16 Màn Hình Phân Hệ Công Khai (Public)](#4-chi-tiết-wireframe-16-màn-hình-phân-hệ-công-khai-public)
5. [Chi Tiết Wireframe 12 Màn Hình Phân Hệ Học Viên (User / Pro)](#5-chi-tiết-wireframe-12-màn-hình-phân-hệ-học-viên-user--pro)
6. [Chi Tiết Wireframe 6 Màn Hình Phân Hệ Đầu Bếp (Chef)](#6-chi-tiết-wireframe-6-màn-hình-phân-hệ-đầu-bếp-chef)
7. [Chi Tiết Wireframe 17 Màn Hình Phân Hệ Quản Trị (Admin)](#7-chi-tiết-wireframe-17-màn-hình-phân-hệ-quản-trị-admin)
8. [Chi Tiết Wireframe 3 Màn Hình Phân Hệ Chăm Sóc Khách Hàng (Support)](#8-chi-tiết-wireframe-3-màn-hình-phân-hệ-chăm-sóc-khách-hàng-support)
9. [Thư Viện Component (shadcn/ui & Custom)](#9-thư-viện-component-shadcnui--custom)
10. [Điểm Ngắt Giao Diện (Responsive Breakpoints) & Trợ Năng](#10-điểm-ngắt-giao-diện-responsive-breakpoints--trợ-năng)

---

## 🎨 1. Hệ Thống Thiết Kế (Design System)

### 1.1. Bảng Màu Tiêu Chuẩn (Color Palette)
- **Primary (Chủ đạo - Cam ấm thực / Amber Orange):**
  - Light mode: `#f59e0b` (Amber 500) / `#d97706` (Amber 600)
  - Dark mode: `#fbbf24` (Amber 400)
  - Ý nghĩa: Kích thích vị giác, mang lại cảm giác ấm cúng của gian bếp gia đình.
- **Pro Accent (Hội viên Pro - Vàng kim / Gold):**
  - Màu sắc: `#eab308` (Yellow 500) kết hợp gradient `#f59e0b` ➜ `#eab308`.
  - Icon: Vương miện vàng (Crown icon).
- **Secondary (Phụ trợ):** Nền slate nhẹ `#f1f5f9` (Light) / `#1e293b` (Dark).
- **Trạng thái (Status Colors):**
  - Thành công (Success / Đã duyệt / Xuất bản): `#10b981` (Emerald 500)
  - Cảnh báo (Warning / Chờ duyệt): `#f59e0b` (Amber 500)
  - Lỗi / Nguy hiểm (Destructive / Từ chối / Hết hạn): `#ef4444` (Rose 500)
  - Thông tin (Info): `#3b82f6` (Blue 500)
- **Background & Foreground:**
  - Light: Nền trắng tinh khôi `#ffffff`, chữ xám đen `#0f172a`.
  - Dark: Nền đen chì `#09090b`, chữ xám sáng `#f8fafc`.

### 1.2. Typography (Phông Chữ)
- **Font gia đình:** `Be Vietnam Pro` (Google Font) - Tối ưu hoàn hảo cho hiển thị tiếng Việt có dấu.
- **Phân cấp kiểu chữ:**
  - `Display / Hero`: 36px - 48px, Font-extrabold, Line-height 1.15
  - `Heading 1 (H1)`: 30px - 36px, Font-bold, Line-height 1.2
  - `Heading 2 (H2)`: 24px - 28px, Font-semibold, Line-height 1.25
  - `Heading 3 (H3)`: 20px - 22px, Font-semibold, Line-height 1.3
  - `Body Text`: 15px - 16px, Font-normal, Line-height 1.6
  - `Small / Metadata`: 12px - 13px, Font-medium, text-muted-foreground

### 1.3. Khoảng Cách (Spacing) & Bo Góc (Border Radius)
- Khoảng cách cơ bản: Grid 4px (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).
- Bo góc (Border radius): `rounded-xl` (12px) cho thẻ Card; `rounded-2xl` (16px) cho Modal; `rounded-full` cho Avatar và Badge.

---

## 🏛️ 2. Cấu Trúc Layout Chung Nền Tảng

### 2.1. Layout Trang Công Khai (Public Layout)
Áp dụng cho khách và các trang thông tin chung.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Menu (Công thức, Khóa học, Đầu bếp, Bảng giá) | Auth Btn │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                          NỘI DUNG CHÍNH (MAIN)                         │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ FOOTER: Về chúng tôi | Danh mục | Điều khoản & Bảo mật | Bản quyền     │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.2. Layout Trang Dashboard (User / Chef / Admin / Support Layout)
Áp dụng cho các khu vực quản trị và bảng điều khiển người dùng.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ TOPBAR: Logo nhỏ | Nút thu gọn Sidebar | Chuông thông báo | UserMenu   │
├───────────────────┬────────────────────────────────────────────────────┤
│ SIDEBAR (Cố định) │ NỘI DUNG BẢNG ĐIỀU KHIỂN (MAIN VIEW)               │
│ - Trang chủ       │ - Breadcrumb                                       │
│ - Quản lý mục 1   │ - Tiêu đề trang & Nút hành động chính              │
│ - Quản lý mục 2   │ - Bảng dữ liệu / Thẻ thống kê / Biểu đồ            │
│ - Quản lý mục 3   │                                                    │
│ - Đăng xuất       │                                                    │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 📋 3. Bảng Tổng Hợp 54 Màn Hình

| STT | Tên Màn Hình | Route (Đường dẫn) | Vai trò | Phân hệ |
|---|---|---|---|---|
| 01 | Trang chủ | `/` | Guest / All | Public |
| 02 | Danh sách công thức | `/cong-thuc` | Guest / All | Public |
| 03 | Chi tiết công thức | `/cong-thuc/[slug]` | User / All | Public |
| 04 | Danh sách khóa học | `/khoa-hoc` | Guest / All | Public |
| 05 | Chi tiết khóa học | `/khoa-hoc/[slug]` | User / All | Public |
| 06 | Danh sách đầu bếp | `/dau-bep` | Guest / All | Public |
| 07 | Hồ sơ đầu bếp | `/dau-bep/[username]` | Guest / All | Public |
| 08 | Danh sách bài viết blog | `/bai-viet` | Guest / All | Public |
| 09 | Chi tiết bài viết | `/bai-viet/[slug]` | Guest / All | Public |
| 10 | Bảng giá gói Pro | `/bang-gia` | Guest / All | Public |
| 11 | Giới thiệu nền tảng | `/gioi-thieu` | Guest / All | Public |
| 12 | Điều khoản dịch vụ | `/dieu-khoan` | Guest / All | Public |
| 13 | Chính sách bảo mật | `/chinh-sach` | Guest / All | Public |
| 14 | Đăng nhập | `/dang-nhap` | Guest | Public |
| 15 | Đăng ký tài khoản | `/dang-ky` | Guest | Public |
| 16 | Quên mật khẩu | `/quen-mat-khau` | Guest | Public |
| 17 | Bảng điều khiển học viên | `/bang-dieu-khien` | User / Pro | Học viên |
| 18 | Hồ sơ cá nhân | `/ho-so` | User / Pro | Học viên |
| 19 | Công thức đã lưu | `/cong-thuc-cua-toi` | User / Pro | Học viên |
| 20 | Khóa học của tôi | `/khoa-hoc-cua-toi` | User / Pro | Học viên |
| 21 | Phòng học trực tuyến | `/hoc-bai/[slug]` | User / Pro | Học viên |
| 22 | Chứng chỉ của tôi | `/chung-chi` | User / Pro | Học viên |
| 23 | Chi tiết chứng chỉ & QR | `/chung-chi/[ma]` | User / Pro | Học viên |
| 24 | Tạo công thức mới | `/tao-cong-thuc` | Pro User | Học viên |
| 25 | Quản lý công thức đã gửi | `/cong-thuc-da-gui` | Pro User | Học viên |
| 26 | Nâng cấp Pro (VNPay) | `/nang-cap-pro` | User / All | Học viên |
| 27 | Lịch sử gói Premium | `/goi-cua-toi` | User / Pro | Học viên |
| 28 | Hỗ trợ & Ticket của tôi | `/ho-tro` | User / Pro | Học viên |
| 29 | Dashboard gian bếp | `/bep` | Chef | Đầu bếp |
| 30 | Quản lý công thức bếp | `/bep/cong-thuc` | Chef | Đầu bếp |
| 31 | Soạn công thức đầu bếp | `/bep/cong-thuc/tao` | Chef | Đầu bếp |
| 32 | Chỉnh sửa công thức | `/bep/cong-thuc/[id]/sua` | Chef | Đầu bếp |
| 33 | Quản lý khóa học bếp | `/bep/khoa-hoc` | Chef | Đầu bếp |
| 34 | Phản hồi học viên | `/bep/binh-luan` | Chef | Đầu bếp |
| 35 | Trung tâm quản trị | `/quan-tri` | Admin | Quản trị |
| 36 | Quản lý người dùng | `/quan-tri/quan-ly-nguoi-dung` | Admin | Quản trị |
| 37 | Quản lý đầu bếp | `/quan-tri/quan-ly-dau-bep` | Admin | Quản trị |
| 38 | Duyệt công thức đóng góp | `/quan-tri/cong-thuc` | Admin | Quản trị |
| 39 | Quản lý khóa học hệ thống | `/quan-tri/khoa-hoc` | Admin | Quản trị |
| 40 | Danh sách gói Premium | `/quan-tri/quan-ly-goi` | Admin | Quản trị |
| 41 | Tạo gói Premium mới | `/quan-tri/quan-ly-goi/moi` | Admin | Quản trị |
| 42 | Chỉnh sửa gói Premium | `/quan-tri/quan-ly-goi/[id]/sua`| Admin | Quản trị |
| 43 | Duyệt yêu cầu nâng cấp | `/quan-tri/duyet-nang-cap` | Admin | Quản trị |
| 44 | Quản lý danh mục | `/quan-tri/danh-muc` | Admin | Quản trị |
| 45 | Quản lý bình luận | `/quan-tri/binh-luan` | Admin | Quản trị |
| 46 | Quản lý đánh giá | `/quan-tri/danh-gia` | Admin | Quản trị |
| 47 | Quản lý bài viết blog | `/quan-tri/bai-viet` | Admin | Quản trị |
| 48 | Gửi thông báo hệ thống | `/quan-tri/thong-bao` | Admin | Quản trị |
| 49 | Quản lý giao dịch thanh toán | `/quan-tri/thanh-toan` | Admin | Quản trị |
| 50 | Báo cáo & Thống kê | `/quan-tri/bao-cao` | Admin | Quản trị |
| 51 | Cấu hình nền tảng | `/quan-tri/cau-hinh` | Admin | Quản trị |
| 52 | Dashboard hỗ trợ CSKH | `/nhan-vien` | Support | Hỗ trợ |
| 53 | Phòng chat xử lý Ticket | `/nhan-vien/tickets/[id]` | Support | Hỗ trợ |
| 54 | Quản lý câu hỏi FAQ | `/nhan-vien/cau-hoi-thuong-gap` | Support | Hỗ trợ |

---

## 🌐 4. Chi Tiết Wireframe 16 Màn Hình Phân Hệ Công Khai (Public)

### Màn hình 01: Trang chủ (`/`)
- **Vai trò:** Guest / Mọi người
- **Mục đích:** Quảng bá hình ảnh, dẫn dắt học viên đăng ký, giới thiệu các món ăn nổi bật và gói Pro.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Công thức | Khóa học | Bảng giá | [Đăng nhập] [Đăng ký]│
├────────────────────────────────────────────────────────────────────────┤
│ [HERO BANNER]: "Học Nấu Ăn Chuẩn Vị Cùng Bếp Trưởng"                  │
│ [Thanh tìm kiếm nhanh món ăn]  [Nút: Khám phá công thức] [Nút: Lên Pro] │
├────────────────────────────────────────────────────────────────────────┤
│ [DANH MỤC ẨM THỰC]: (Món Việt | Món Á | Món Âu | Món Chay | Đồ Uống...)│
├────────────────────────────────────────────────────────────────────────┤
│ [CÔNG THỨC NỔI BẬT NHẤT]: Grid 3x2 (6 thẻ món ăn có ảnh, độ khó, time) │
├────────────────────────────────────────────────────────────────────────┤
│ [BANNER GÓI PRO]: Giới thiệu đặc quyền Pro (Xem video HD, làm test...) │
├────────────────────────────────────────────────────────────────────────┤
│ [KHÓA HỌC TIÊU BIỂU]: 3 khóa học video hàng đầu                        │
├────────────────────────────────────────────────────────────────────────┤
│ [ĐỘI NGŨ ĐẦU BẾP UY TÍN]: 4 thẻ Bếp trưởng kèm kinh nghiệm             │
├────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                 │
└────────────────────────────────────────────────────────────────────────┘
```
- **Components:** `Header`, `HeroSection`, `DanhMucSlider`, `TheCongThuc`, `BannerPro`, `TheKhoaHoc`, `TheDauBep`, `Footer`.
- **Data Fetch:** Top 6 `cong_thuc (noi_bat = true)`, 3 `khoa_hoc`, 4 `profiles (chef)`, 10 `danh_muc`.
- **Actions:** Tìm kiếm từ khóa, click thẻ món ăn, chuyển hướng đăng ký Pro.
- **States:** Skeleton shimmer khi tải, hiển thị danh sách rỗng nếu không có dữ liệu.

---

### Màn hình 02: Danh Sách Công Thức (`/cong-thuc`)
- **Vai trò:** Guest / Mọi người
- **Mục đích:** Khám phá kho tàng công thức nấu ăn qua bộ lọc chuyên sâu.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                 │
├────────────────────────────┬───────────────────────────────────────────┤
│ [BỘ LỌC TÌM KIẾM BÊN TRÁI] │ [DANH SÁCH CÔNG THỨC] (Grid 3 cột)        │
│ - Ô nhập từ khóa           │ - Thanh sắp xếp (Mới nhất, Xem nhiều, Sao)│
│ - Chọn danh mục ẩm thực    │ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ - Mức độ khó (Dễ/TB/Khó)   │ │  Món 1   │ │  Món 2   │ │  Món 3   │    │
│ - Thời gian nấu (<30p,...) │ └──────────┘ └──────────┘ └──────────┘    │
│ - [Nút: Đặt lại bộ lọc]    │ [PHÂN TRANG]: < 1 2 3 4 >                 │
└────────────────────────────┴───────────────────────────────────────────┘
```
- **Components:** `BoLocCongThuc`, `TheCongThuc`, `PhanTrang`, `SapXepSelect`.
- **Data Fetch:** `cong_thuc` (phân trang 12 item/trang), danh sách `danh_muc`.
- **Actions:** Lọc đa điều kiện, chuyển trang, gõ tìm kiếm debounce.

---

### Màn hình 03: Chi Tiết Công Thức (`/cong-thuc/[slug]`)
- **Vai trò:** User / All (Nếu là khách, khi bấm lưu hoặc bình luận sẽ chuyển hướng đăng nhập).
- **Mục đích:** Hướng dẫn chi tiết nguyên liệu, các bước nấu và video tích hợp.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Tiêu đề món ăn | [Badge Độ khó] | [Nút Lưu món] | [Lượt xem & Đánh giá]│
│ Tác giả: Avatar Bếp trưởng | Ngày đăng                                 │
├────────────────────────────────────────────────────────────────────────┤
│ [TRÌNH PHÁT YOUTUBE / ẢNH COVER]: Khung video hướng dẫn nấu trực tiếp  │
├────────────────────────────────────────────────────────────────────────┤
│ [THÔNG SỐ NHANH]: Chuẩn bị: 20p | Nấu: 40p | Khẩu phần: 4 | Calo: 450 │
├────────────────────────────────────────────────────────────────────────┤
│ [BỘ TÍNH NGUYÊN LIỆU]: [ - ] Khẩu phần: 4 người [ + ] (Tự scale)       │
│ - Thịt bò: 500g                                                        │
│ - Bánh phở: 600g                                                       │
├────────────────────────────────────────────────────────────────────────┤
│ [CÁC BƯỚC THỰC HIỆN]:                                                  │
│ Bước 1: [Checkbox] Sơ chế nguyên liệu...                               │
│ Bước 2: [Checkbox] Hầm xương lấy nước dùng...                          │
├────────────────────────────────────────────────────────────────────────┤
│ [ĐÁNH GIÁ SAO & BÌNH LUẬN]: Gửi đánh giá sao, danh sách bình luận con │
└────────────────────────────────────────────────────────────────────────┘
```
- **Components:** `TrinhPhatYouTube`, `NguyenLieuScale`, `BuocNauList`, `KhuBinhLuan`, `DanhGiaSao`, `NutLuuCongThuc`.
- **Data Fetch:** Chi tiết 1 `cong_thuc`, `danh_gia`, cây `binh_luan`, trạng thái `da_luu`.
- **Actions:** Tăng giảm khẩu phần, tick hoàn thành bước, gửi bình luận, lưu món.

---

### Màn hình 04: Danh Sách Khóa Học (`/khoa-hoc`)
- **Route:** `/khoa-hoc` | **Vai trò:** All
- **Mục đích:** Hiển thị danh mục khóa học đào tạo nấu ăn từ cơ bản đến nâng cao.
- **Layout:** Thanh tìm kiếm + Grid 3 cột hiển thị các khóa học kèm nhãn "Gói Pro mở khóa trọn bộ".
- **Components:** `TheKhoaHoc`, `BoLocKhoaHoc`.

---

### Màn hình 05: Chi Tiết Khóa Học (`/khoa-hoc/[slug]`)
- **Route:** `/khoa-hoc/[slug]` | **Vai trò:** All
- **Mục đích:** Xem đề cương khóa học, xem video preview bài mở đầu và nút ghi danh học.
- **Layout:** Cột trái video preview + mô tả; Cột phải danh sách bài học và nút [Đăng ký học ngay].

---

### Màn hình 06: Danh Sách Đầu Bếp (`/dau-bep`)
- **Route:** `/dau-bep` | **Vai trò:** All
- **Mục đích:** Tôn vinh các bếp trưởng, giảng viên chuyên nghiệp trên nền tảng.
- **Layout:** Grid 4 cột thẻ đầu bếp (Avatar tròn, tên, chuyên môn, số công thức đã đăng).

---

### Màn hình 07: Hồ Sơ Đầu Bếp (`/dau-bep/[username]`)
- **Route:** `/dau-bep/[username]` | **Vai trò:** All
- **Mục đích:** Xem chi tiết tiểu sử đầu bếp, các công thức và khóa học do đầu bếp này phụ trách.

---

### Màn hình 08: Danh Sách Bài Viết Blog (`/bai-viet`)
- **Route:** `/bai-viet` | **Vai trò:** All
- **Mục đích:** Cung cấp mẹo vặt nhà bếp, kiến thức dinh dưỡng, văn hóa ẩm thực.

---

### Màn hình 09: Chi Tiết Bài Viết Blog (`/bai-viet/[slug]`)
- **Route:** `/bai-viet/[slug]` | **Vai trò:** All
- **Mục đích:** Bài viết chi tiết định dạng Rich Text/Markdown kèm bình luận thảo luận.

---

### Màn hình 10: Bảng Giá So Sánh Gói Pro (`/bang-gia`)
- **Route:** `/bang-gia` | **Vai trò:** All
- **Mục đích:** Trang tiếp thị so sánh chi tiết giữa Free vs Pro, niêm yết giá Pro Tháng & Pro Năm.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                 │
├────────────────────────────────────────────────────────────────────────┤
│ HERO: "Đầu Tư Kỹ Năng Bếp Núi — Nâng Tầm Trải Nghiệm Cùng PRO"         │
├───────────────────────────────────┬────────────────────────────────────┤
│ [THẺ GÓI PRO THÁNG]               │ [THẺ GÓI PRO NĂM - KHUYÊN DÙNG]    │
│ - Giá: 99.000 ₫ / 30 ngày         │ - Giá: 799.000 ₫ / 365 ngày        │
│ - Tiết kiệm chi phí linh hoạt     │ - Tiết kiệm 33% (Chỉ ~66k/tháng)   │
│ - [NÚT: NÂNG CẤP GÓI THÁNG]       │ - [NÚT: NÂNG CẤP GÓI NĂM NGAY]     │
├───────────────────────────────────┴────────────────────────────────────┤
│ [BẢNG SO SÁNH TÍNH NĂNG CHI TIẾT (FREE VS PRO)]: 15 tiêu chí so sánh   │
├────────────────────────────────────────────────────────────────────────┤
│ [CÂU HỎI THƯỜNG GẶP (FAQ Accordion)]: 5 câu hỏi về thanh toán & quyền  │
└────────────────────────────────────────────────────────────────────────┘
```
- **Components:** `TheGoi`, `BangSoSanh`, `AccordionFAQ`, `NutNangCap`.

---

### Màn hình 11: Giới Thiệu Nền Tảng (`/gioi-thieu`)
- **Route:** `/gioi-thieu` | **Vai trò:** All
- **Mục đích:** Sứ mệnh, tầm nhìn, đội ngũ sáng lập đồ án tốt nghiệp.

---

### Màn hình 12: Điều Khoản Dịch Vụ (`/dieu-khoan`)
- **Route:** `/dieu-khoan` | **Vai trò:** All
- **Mục đích:** Quy định quyền tác giả, bản quyền công thức và chính sách gói cước.

---

### Màn hình 13: Chính Sách Bảo Mật (`/chinh-sach`)
- **Route:** `/chinh-sach` | **Vai trò:** All
- **Mục đích:** Quy định bảo mật thông tin cá nhân và dữ liệu thanh toán giao dịch.

---

### Màn hình 14: Đăng Nhập (`/dang-nhap`)
- **Route:** `/dang-nhap` | **Vai trò:** Guest
- **Mục đích:** Đăng nhập tài khoản bằng Email + Mật khẩu. Hỗ trợ ghi nhớ `quay-lai` URL.

---

### Màn hình 15: Đăng Ký Tài Khoản (`/dang-ky`)
- **Route:** `/dang-ky` | **Vai trò:** Guest
- **Mục đích:** Đăng ký tài khoản học viên mới kèm họ tên và xác thực email.

---

### Màn hình 16: Quên Mật Khẩu (`/quen-mat-khau`)
- **Route:** `/quen-mat-khau` | **Vai trò:** Guest
- **Mục đích:** Gửi email đặt lại mật khẩu bảo mật qua liên kết OTP.

---

## 🎓 5. Chi Tiết Wireframe 12 Màn Hình Phân Hệ Học Viên (User / Pro)

### Màn hình 17: Bảng Điều Khiển Học Viên (`/bang-dieu-khien`)
- **Vai trò:** User Free / Pro User
- **Mục đích:** Tổng quan tiến độ học tập, trạng thái gói Pro, công thức vừa lưu.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ TOPBAR: Logo | Xin chào, Lê Nam [BADGE PRO 👑] | [Chuông: 3] | Avatar │
├───────────────────┬────────────────────────────────────────────────────┤
│ SIDEBAR           │ [BANNER CHÀO MỪNG + TRẠNG THÁI GÓI]                │
│ - Tổng quan (Active)│ Bạn đang dùng gói Pro Năm (Còn 240 ngày)         │
│ - Hồ sơ cá nhân   ├────────────────────────────────────────────────────┤
│ - Công thức đã lưu│ [THỐNG KÊ]: Đang học: 3 | Đã xong: 1 | Món lưu: 12 │
│ - Khóa học của tôi├────────────────────────────────────────────────────┤
│ - Chứng chỉ       │ [TIẾP TỤC BÀI HỌC DỞ DANG]: Thanh % tiến độ bài    │
│ - Tạo công thức*  ├────────────────────────────────────────────────────┤
│ - Gói của tôi     │ [CÔNG THỨC MỚI GỢI Ý CHO BẠN]: Grid 3 thẻ món ăn   │
│ - Hỗ trợ CSKH     │                                                    │
└───────────────────┴────────────────────────────────────────────────────┘
```
- **Components:** `SidebarUser`, `TheThongKeHocVien`, `TienDoHocTapCard`, `BadgePro`.

---

### Màn hình 18: Hồ Sơ Cá Nhân (`/ho-so`)
- **Route:** `/ho-so` | **Vai trò:** User / Pro
- **Mục đích:** Cập nhật thông tin cá nhân, ảnh đại diện Avatar, mật khẩu, liên kết mạng xã hội (Pro).

---

### Màn hình 19: Công Thức Đã Lưu (`/cong-thuc-cua-toi`)
- **Route:** `/cong-thuc-cua-toi` | **Vai trò:** User / Pro
- **Mục đích:** Quản lý danh sách các món ăn đã đánh dấu yêu thích để tiện xem lại khi vào bếp.

---

### Màn hình 20: Khóa Học Của Tôi (`/khoa-hoc-cua-toi`)
- **Route:** `/khoa-hoc-cua-toi` | **Vai trò:** User / Pro
- **Mục đích:** Danh sách các khóa học đã ghi danh, hiển thị thanh phần trăm tiến độ từng khóa.

---

### Màn hình 21: Phòng Học Trực Tuyến (`/hoc-bai/[slug]`)
- **Route:** `/hoc-bai/[slug]` | **Vai trò:** User / Pro
- **Mục đích:** Màn hình phát video bài giảng, hiển thị tài liệu PDF và bài tập trắc nghiệm.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ [QUAY LẠI KHÓA HỌC] Tiêu đề bài học: Kỹ thuật cầm dao và cắt cơ bản    │
├────────────────────────────────────────┬───────────────────────────────┤
│ [VIDEO PLAYER CHÍNH]:                  │ [DANH SÁCH BÀI HỌC (CURRICULUM│
│ - Chế độ phát HD 1080p (Pro User)      │ - Bài 1: Kỹ thuật dao (Xong)  │
│ - Nút: Đánh dấu đã hoàn thành bài      │ - Bài 2: Chảo gang [PRO HD]   │
├────────────────────────────────────────┤ - Bài 3: Hầm xương phở [PRO]  │
│ [TAB 1: TÀI LIỆU PDF CHUYÊN SÂU]       │                               │
│ - Giáo_trình_cắt_thái_chuẩn_Âu.pdf     │ [TIẾN ĐỘ KHÓA]: 65%           │
│   [Nút: Tải về PDF] (Chỉ dành cho Pro) │                               │
├────────────────────────────────────────┤                               │
│ [TAB 2: BÀI KIỂM TRA TRẮC NGHIỆM]      │                               │
│ Câu 1: Góc nghiêng chuẩn của dao thái? │                               │
│ ( ) 15 độ   ( ) 30 độ   (*) 45 độ      │                               │
│ [Nút: Nộp bài làm trắc nghiệm]         │                               │
└────────────────────────────────────────┴───────────────────────────────┘
```
- **Components:** `VideoPlayerHD`, `DanhSachBaiHocSidebar`, `TaiLieuProView`, `BaiTapTracNghiemForm`.

---

### Màn hình 22: Chứng Chỉ Của Tôi (`/chung-chi`)
- **Route:** `/chung-chi` | **Vai trò:** User / Pro
- **Mục đích:** Kho lưu trữ các chứng chỉ số hóa mà học viên đã đạt được sau khi học xong 100% khóa học.

---

### Màn hình 23: Chi Tiết Chứng Chỉ & QR Tra Cứu (`/chung-chi/[ma]`)
- **Route:** `/chung-chi/[ma]` | **Vai trò:** Public tra cứu
- **Mục đích:** Hiển thị chứng chỉ trang trọng kèm tên học viên, chữ ký Bếp trưởng, ngày cấp và mã QR công khai xác thực chống làm giả.

---

### Màn hình 24: Tạo Công Thức Mới (`/tao-cong-thuc`)
- **Route:** `/tao-cong-thuc` | **Vai trò:** Pro User / Chef / Admin (User thường bị chặn)
- **Mục đích:** Soạn thảo công thức ẩm thực mới để gửi Admin kiểm duyệt.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ TIÊU ĐỀ: Đóng Góp Công Thức Ẩm Thực (Đặc Quyền Thành Viên Pro 👑)       │
├────────────────────────────────────────────────────────────────────────┤
│ [FORM ĐIỀN THÔNG TIN CÔNG THỨC]:                                       │
│ 1. Tên món ăn | Danh mục ẩm thực | Mức độ khó | Khẩu phần (người)      │
│ 2. Thời gian chuẩn bị (phút) | Thời gian nấu (phút) | Calo ước tính    │
│ 3. Mô tả ngắn truyền cảm hứng về món ăn                                │
│ 4. URL Ảnh đại diện (Unsplash) | URL Video hướng dẫn (YouTube link)    │
│ 5. Bảng nguyên liệu: [Tên nguyên liệu] [Số lượng] [Đơn vị] [+ Thêm]    │
│ 6. Các bước nấu: Bước 1: [Mô tả chi tiết...] [+ Thêm bước tiếp theo]   │
├────────────────────────────────────────────────────────────────────────┤
│ [NÚT LƯU NHÁP]                 [NÚT: GỬI CÔNG THỨC CHỜ PHÊ DUYỆT]      │
└────────────────────────────────────────────────────────────────────────┘
```
- **Components:** `FormCongThuc`, `DynamicInputNguyenLieu`, `DynamicInputCacBuoc`.

---

### Màn hình 25: Quản Lý Công Thức Đã Gửi (`/cong-thuc-da-gui`)
- **Route:** `/cong-thuc-da-gui` | **Vai trò:** Pro User
- **Mục đích:** Theo dõi trạng thái kiểm duyệt các công thức mình đã gửi (Chờ duyệt / Đã xuất bản / Bị từ chối kèm lý do).

---

### Màn hình 26: Nâng Cấp Gói Pro (`/nang-cap-pro`)
- **Route:** `/nang-cap-pro` | **Vai trò:** User / All
- **Mục đích:** Màn hình thanh toán trực tiếp: Chọn gói (Tháng 99k / Năm 799k), nhập thông tin và thanh toán qua VNPay Sandbox.

---

### Màn hình 27: Lịch Sử Gói Premium (`/goi-cua-toi`)
- **Route:** `/goi-cua-toi` | **Vai trò:** User / Pro
- **Mục đích:** Tra cứu lịch sử đăng ký, thời gian bắt đầu, ngày hết hạn và tình trạng kích hoạt.

---

### Màn hình 28: Trung Tâm Hỗ Trợ & Ticket (`/ho-tro`)
- **Route:** `/ho-tro` | **Vai trò:** User / Pro
- **Mục đích:** Danh sách các Ticket yêu cầu hỗ trợ cá nhân và form mở Ticket mới gửi Support.

---

## 👨‍🍳 6. Chi Tiết Wireframe 6 Màn Hình Phân Hệ Đầu Bếp (Chef)

### Màn hình 29: Dashboard Gian Bếp (`/bep`)
- **Route:** `/bep` | **Vai trò:** Chef
- **Mục đích:** Thống kê số món đã đăng, số học viên theo học, số lượt xem tổng và bình luận mới.

### Màn hình 30: Quản Lý Công Thức Bếp (`/bep/cong-thuc`)
- **Route:** `/bep/cong-thuc` | **Vai trò:** Chef
- **Mục đích:** Danh sách công thức do chính đầu bếp tạo; hỗ trợ ẩn/hiện hoặc sửa nội dung.

### Màn hình 31: Soạn Công Thức Đầu Bếp (`/bep/cong-thuc/tao`)
- **Route:** `/bep/cong-thuc/tao` | **Vai trò:** Chef
- **Mục đích:** Tạo món ăn mới (đầu bếp xuất bản trực tiếp không cần qua duyệt Admin).

### Màn hình 32: Chỉnh Sửa Công Thức Đầu Bếp (`/bep/cong-thuc/[id]/sua`)
- **Route:** `/bep/cong-thuc/[id]/sua` | **Vai trò:** Chef
- **Mục đích:** Cập nhật công thức nấu ăn hiện có.

### Màn hình 33: Quản Lý Khóa Học Của Bếp (`/bep/khoa-hoc`)
- **Route:** `/bep/khoa-hoc` | **Vai trò:** Chef
- **Mục đích:** Thiết kế cây chương mục khóa học, gắn link video bài giảng HD và câu hỏi trắc nghiệm.

### Màn hình 34: Phản Hồi Học Viên (`/bep/binh-luan`)
- **Route:** `/bep/binh-luan` | **Vai trò:** Chef
- **Mục đích:** Đọc và giải đáp các thắc mắc của học viên tại các công thức/bài học của mình.

---

## 🛡️ 7. Chi Tiết Wireframe 17 Màn Hình Phân Hệ Quản Trị (Admin)

### Màn hình 35: Trung Tâm Điều Hành Quản Trị (`/quan-tri`)
- **Route:** `/quan-tri` | **Vai trò:** Admin
- **Mục đích:** Tổng quan sức khỏe hệ thống qua thẻ KPI và biểu đồ tăng trưởng.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ TOPBAR ADMIN: Hệ Thống Quản Trị Trung Tâm | [Admin Profile]           │
├───────────────────┬────────────────────────────────────────────────────┤
│ SIDEBAR ADMIN     │ [4 THẺ KPI CHÍNH]:                                 │
│ - Dashboard (Act) │ 👥 Tổng User: 1,420     | 💎 Thành viên Pro: 345    │
│ - Quản lý User    │ 🍲 Tổng công thức: 280  | 💰 Doanh thu: 45.800.000 ₫ │
│ - Quản lý Chef    ├────────────────────────────────────────────────────┤
│ - Duyệt công thức │ [BIỂU ĐỒ RECHARTS]: Doanh thu & Tăng trưởng Pro    │
│ - Quản lý khóa học├────────────────────────────────────────────────────┤
│ - Quản lý gói Pro │ [YÊU CẦU NÂNG CẤP CHỜ DUYỆT (Top 5)]:              │
│ - Duyệt gói Pro*  │ - YC-0012: user1@naungon.vn (Gói Năm) [Nút Duyệt]  │
│ - Danh mục        ├────────────────────────────────────────────────────┤
│ - Báo cáo / Audit │ [CÔNG THỨC MỚI CHỜ KIỂM DUYỆT (Top 5)]:           │
│ - Cấu hình        │ - Phở cuốn tôm thịt - Tác giả: Lê Nam [Nút Xem]    │
└───────────────────┴────────────────────────────────────────────────────┘
```
- **Components:** `TheThongKeAdmin`, `BieuDoDoanhThu`, `BangDuyetNhanh`.

---

### Màn hình 36: Quản Lý Người Dùng (`/quan-tri/quan-ly-nguoi-dung`)
- **Route:** `/quan-tri/quan-ly-nguoi-dung` | **Vai trò:** Admin
- **Mục đích:** Xem danh sách tài khoản, tìm kiếm, lọc theo vai trò (User/Pro/Chef/Support), đổi vai trò, khóa tài khoản và **Nút Cấp gói Pro thủ công**.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ BẢNG QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG                                      │
├────────────────────────────────────────────────────────────────────────┤
│ [Bộ lọc: Vai trò] [Bộ lọc: Trạng thái] [Ô tìm kiếm Email/Tên]          │
├────────────────────────────────────────────────────────────────────────┤
│ TÊN & EMAIL       │ VAI TRÒ │ TRẠNG THÁI PRO │ TRẠNG THÁI │ THAO TÁC   │
├───────────────────┼─────────┼────────────────┼────────────┼────────────┤
│ Lê Nam (user1...) │ user    │ [Pro Năm (👑)] │ Hoạt động  │ [...] Menu │
│ Nguyễn Hoa (...)  │ user    │ [Free]         │ Hoạt động  │ [Cấp Pro]  │
│ Minh Trần (...)   │ chef    │ [Pro (Miễn)]   │ Hoạt động  │ [...] Menu │
└───────────────────┴─────────┴────────────────┴────────────┴────────────┘
```
- **Modal đi kèm:** `ModalCapGoi` (Chọn gói Tháng/Năm, ghi chú lý do cấp).

---

### Màn hình 37: Quản Lý Đầu Bếp (`/quan-tri/quan-ly-dau-bep`)
- **Route:** `/quan-tri/quan-ly-dau-bep` | **Vai trò:** Admin
- **Mục đích:** Thăng cấp người dùng lên vai trò Chef hoặc hạ cấp về User thường.

---

### Màn hình 38: Duyệt Công Thức Đóng Góp (`/quan-tri/cong-thuc`)
- **Route:** `/quan-tri/cong-thuc` | **Vai trò:** Admin
- **Mục đích:** Kiểm duyệt công thức do Pro User gửi lên. Xem trước toàn bộ nội dung, hình ảnh và chọn **Phê duyệt** hoặc **Từ chối (nhập lý do)**.

---

### Màn hình 39: Quản Lý Khóa Học (`/quan-tri/khoa-hoc`)
- **Route:** `/quan-tri/khoa-hoc` | **Vai trò:** Admin
- **Mục đích:** Danh sách khóa học, kiểm duyệt khóa học mới của Chef trước khi xuất bản.

---

### Màn hình 40: Quản Lý Danh Sách Gói Pro (`/quan-tri/quan-ly-goi`)
- **Route:** `/quan-tri/quan-ly-goi` | **Vai trò:** Admin
- **Mục đích:** Quản lý danh mục 2 gói cước (`pro_thang`, `pro_nam`), giá bán, thời hạn ngày, bật/tắt hoạt động.

---

### Màn hình 41: Tạo Gói Pro Mới (`/quan-tri/quan-ly-goi/moi`)
- **Route:** `/quan-tri/quan-ly-goi/moi` | **Vai trò:** Admin
- **Mục đích:** Biểu mẫu thêm cấu hình gói Premium mới.

---

### Màn hình 42: Chỉnh Sửa Gói Pro (`/quan-tri/quan-ly-goi/[id]/sua`)
- **Route:** `/quan-tri/quan-ly-goi/[id]/sua` | **Vai trò:** Admin
- **Mục đích:** Cập nhật giá niêm yết, quyền lợi hoặc mô tả của gói cước.

---

### Màn hình 43: Duyệt Yêu Cầu Nâng Cấp Pro (`/quan-tri/duyet-nang-cap`)
- **Route:** `/quan-tri/duyet-nang-cap` | **Vai trò:** Admin
- **Mục đích:** Nơi Admin kiểm tra các đơn hàng thanh toán nâng cấp Pro của người dùng.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ PHÊ DUYỆT YÊU CẦU NÂNG CẤP HỘI VIÊN PRO                                │
├────────────────────────────────────────────────────────────────────────┤
│ [Tabs: Chờ duyệt (3) | Đã duyệt (45) | Đã từ chối (2)]                 │
├────────────────────────────────────────────────────────────────────────┤
│ MÃ YÊU CẦU │ NGƯỜI DÙNG       │ GÓI ĐĂNG KÝ │ SỐ TIỀN  │ HÀNH ĐỘNG     │
├────────────┼──────────────────┼─────────────┼──────────┼───────────────┤
│ YC-94821   │ user1@naungon.vn │ Pro Tháng   │ 99.000 ₫ │ [DUYỆT] [HỦY] │
│ YC-94822   │ nam@gmail.com    │ Pro Năm     │ 799.000 ₫│ [DUYỆT] [HỦY] │
└────────────┴──────────────────┴─────────────┴──────────┴───────────────┘
```
- **Actions:** Bấm `[DUYỆT]` ➜ Trigger DB tự cập nhật `profiles.la_pro = true` và sinh `goi_nguoi_dung`.

---

### Màn hình 44: Quản Lý Danh Mục Ẩm Thực (`/quan-tri/danh-muc`)
- **Route:** `/quan-tri/danh-muc` | **Vai trò:** Admin
- **Mục đích:** CRUD danh mục món ăn (Tên, slug, icon, thứ tự sắp xếp).

---

### Màn hình 45: Quản Lý Bình Luận (`/quan-tri/binh-luan`)
- **Route:** `/quan-tri/binh-luan` | **Vai trò:** Admin
- **Mục đích:** Lọc các bình luận bị báo cáo xấu, xóa mềm các nội dung vi phạm tiêu chuẩn cộng đồng.

---

### Màn hình 46: Quản Lý Đánh Giá (`/quan-tri/danh-gia`)
- **Route:** `/quan-tri/danh-gia` | **Vai trò:** Admin
- **Mục đích:** Giám sát đánh giá sao cho từng công thức và khóa học.

---

### Màn hình 47: Quản Lý Bài Viết Blog (`/quan-tri/bai-viet`)
- **Route:** `/quan-tri/bai-viet` | **Vai trò:** Admin
- **Mục đích:** Quản lý bài đăng tin tức ẩm thực, mẹo vặt nhà bếp.

---

### Màn hình 48: Gửi Thông Báo Hệ Thống (`/quan-tri/thong-bao`)
- **Route:** `/quan-tri/thong-bao` | **Vai trò:** Admin
- **Mục đích:** Tạo và phát sóng thông báo (Broadcast) tới toàn bộ thành viên hoặc riêng nhóm Pro.

---

### Màn hình 49: Quản Lý Giao Dịch Thanh Toán (`/quan-tri/thanh-toan`)
- **Route:** `/quan-tri/thanh-toan` | **Vai trò:** Admin
- **Mục đích:** Danh sách mã giao dịch VNPay, trạng thái thành công, hỗ trợ đối soát kế toán.

---

### Màn hình 50: Báo Cáo & Thống Kê (`/quan-tri/bao-cao`)
- **Route:** `/quan-tri/bao-cao` | **Vai trò:** Admin
- **Mục đích:** Biểu đồ doanh thu theo tuần/tháng/năm, tỷ lệ chuyển đổi từ Free sang Pro, top món ăn xem nhiều nhất.

---

### Màn hình 51: Cấu Hình Nền Tảng (`/quan-tri/cau-hinh`)
- **Route:** `/quan-tri/cau-hinh` | **Vai trò:** Admin
- **Mục đích:** Cấu hình tên website, logo, slogan, thông số cổng VNPay và email Resend.

---

## 🎧 8. Chi Tiết Wireframe 3 Màn Hình Phân Hệ Hỗ Trợ (Support)

### Màn hình 52: Dashboard Hỗ Trợ Khách Hàng (`/nhan-vien`)
- **Route:** `/nhan-vien` | **Vai trò:** Support / Admin
- **Mục đích:** Xem số lượng Ticket đang chờ xử lý, Ticket mới phát sinh qua Realtime.

---

### Màn hình 53: Phòng Chat Xử Lý Ticket (`/nhan-vien/tickets/[id]`)
- **Route:** `/nhan-vien/tickets/[id]` | **Vai trò:** Support / Admin
- **Mục đích:** Khung chat trực tiếp giải đáp khiếu nại của học viên; có chức năng thêm ghi chú nội bộ và chuyển trạng thái ticket.
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ TICKET #TK-102: Lỗi thanh toán VNPay nhưng chưa lên Pro                 │
│ Người gửi: user1@naungon.vn | Trạng thái: [Đang xử lý] | Độ ưu tiên: Cao│
├────────────────────────────────────────┬───────────────────────────────┤
│ KHUNG CHAT REALTIME:                   │ THÔNG TIN KHÁCH HÀNG:         │
│ [User - 10:15]: Em đã chuyển khoản 99k │ - Học viên: Lê Nam            │
│ thành công nhưng tài khoản chưa có Pro.│ - Đã thanh toán: 99.000 ₫     │
│                                        │ - Mã GD: 14892019             │
│ [Support - 10:16]: Dạ chào bạn, bên    ├───────────────────────────────┤
│ mình đang đối soát và duyệt ngay ạ!    │ [GHI CHÚ NỘI BỘ]:             │
├────────────────────────────────────────┤ "Đã báo Admin kiểm tra mã GD" │
│ [Ô nhập tin nhắn...] [Nút Gửi]         ├───────────────────────────────┤
│                                        │ [NÚT: ĐÁNH DẤU ĐÃ GIẢI QUYẾT] │
└────────────────────────────────────────┴───────────────────────────────┘
```

---

### Màn hình 54: Quản Lý Câu Hỏi Thường Gặp FAQ (`/nhan-vien/cau-hoi-thuong-gap`)
- **Route:** `/nhan-vien/cau-hoi-thuong-gap` | **Vai trò:** Support / Admin
- **Mục đích:** Quản lý kho câu trả lời mẫu giúp nhân viên phản hồi nhanh các tình huống phổ biến.

---

## 🧩 9. Thư Viện Component (shadcn/ui & Custom)

### 9.1. shadcn/ui Components Sử Dụng
- `Button`: Biến thể `default`, `outline`, `ghost`, `destructive`, `secondary`.
- `Badge`: Thẻ hiển thị độ khó (`Dễ`, `Trung bình`, `Khó`), trạng thái duyệt, nhãn `Nổi bật`.
- `Card`: Khung bao thẻ món ăn, khóa học, thống kê KPI.
- `Dialog / Modal`: Hộp thoại xác nhận duyệt gói, cấp gói, đăng công thức.
- `DropdownMenu`: Thao tác bảng dữ liệu, menu chuyển đổi tài khoản.
- `Table`: Hiển thị danh sách quản trị bảng dữ liệu.
- `Tabs`: Chuyển đổi tab xem tài liệu, bài tập, lịch sử duyệt.
- `Sonner`: Toast thông báo góc phải màn hình.

### 9.2. Custom Components Chuyên Biệt Dự Án
- `BadgePro`: Huy hiệu vương miện vàng khẳng định đẳng cấp thành viên Pro (`src/components/goi/BadgePro.tsx`).
- `TheGoi`: Thẻ hiển thị gói Pro Tháng / Pro Năm kèm giá và nút bấm (`src/components/goi/TheGoi.tsx`).
- `BangSoSanh`: Bảng đối chiếu quyền lợi Free vs Pro (`src/components/goi/BangSoSanh.tsx`).
- `TrinhPhatYouTube`: Trình phát nhúng video YouTube tối ưu hóa lazy load (`src/components/khoa-hoc/trinh-phat-youtube.tsx`).
- `NguyenLieuScale`: Bộ tính toán tự động co giãn định lượng nguyên liệu theo số người ăn (`src/components/cong-thuc/nguyen-lieu-scale.tsx`).

---

## 📱 10. Điểm Ngắt Giao Diện (Responsive) & Trợ Năng

### 10.1. Điểm Ngắt Màn Hình (Breakpoints)
- **Mobile (`< 768px`):** 
  - Header thu gọn thành menu Hamburger ngăn kéo (Sheet/Drawer).
  - Grid danh sách công thức chuyển thành 1 cột.
  - Sidebar bảng điều khiển thu gọn hoặc chuyển thành Bottom Navigation Bar.
- **Tablet (`768px - 1023px`):** 
  - Grid danh sách công thức hiển thị 2 cột.
  - Bộ lọc nằm ngang trên đầu danh sách.
- **Desktop (`>= 1024px`):** 
  - Hiển thị đầy đủ Sidebar cố định bên trái.
  - Grid công thức hiển thị 3 cột chuẩn.

### 10.2. Tiêu Chuẩn Trợ Năng (Accessibility)
- Đảm bảo 100% các nút bấm dạng icon có thuộc tính `aria-label` tương ứng (ví dụ: `aria-label="Lưu công thức vào mục yêu thích"`).
- Thẻ hình ảnh bắt buộc có thuộc tính `alt` mô tả tên món ăn rõ ràng.
- Hiển thị viền Focus rõ nét (`focus-visible:ring-2`) khi người dùng điều hướng qua bàn phím.
