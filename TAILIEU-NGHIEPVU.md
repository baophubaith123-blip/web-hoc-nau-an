# 📋 TÀI LIỆU ĐẶC TẢ NGHIỆP VỤ HỆ THỐNG
# NỀN TẢNG HỌC NẤU ĂN TRỰC TUYẾN (WEB HỌC NẤU ĂN ONLINE)

> **Dự án:** Đồ án tốt nghiệp Đại học  
> **Chuyên ngành:** Công nghệ thông tin / Kỹ thuật phần mềm  
> **Phiên bản tài liệu:** 2.0 (Cập nhật mô hình Gói Hội Viên Pro Premium)  
> **Ngôn ngữ:** Tiếng Việt  

---

## 📑 MỤC LỤC
1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Các Vai Trò Người Dùng & Quyền Hạn](#2-các-vai-trò-người-dùng--quyền-hạn)
3. [Mô Hình Gói Hội Viên Premium (Pro)](#3-mô-hình-gói-hội-viên-premium-pro)
4. [Các Luồng Nghiệp Vụ Chính (7 Luồng)](#4-các-luồng-nghiệp-vụ-chính-7-luồng)
5. [Quy Tắc Nghiệp Vụ Hệ Thống (Business Rules)](#5-quy-tắc-nghiệp-vụ-hệ-thống-business-rules)
6. [Sơ Đồ Chuyển Đổi Trạng Thái Thực Thể (State Diagrams)](#6-sơ-đồ-chuyển-đổi-trạng-thái-thực-thể-state-diagrams)
7. [Ma Trận Phân Quyền Chi Tiết (RBAC Matrix)](#7-ma-trận-phân-quyền-chi-tiết-rbac-matrix)
8. [Yêu Cầu Phi Chức Năng (Non-Functional Requirements)](#8-yêu-cầu-phi-chức-năng-non-functional-requirements)

---

## 🏢 1. Tổng Quan Hệ Thống

### 1.1. Mục Tiêu Dự Án
Xây dựng một nền tảng học nấu ăn trực tuyến tương tác cao, kết nối ba nhóm đối tượng trọng tâm:
- **Người học (Học viên):** Tiếp cận kho tàng công thức ẩm thực chuẩn vị, tham gia các khóa học chất lượng cao qua video, làm bài tập thực hành, nhận chứng chỉ số và chia sẻ công thức của riêng mình.
- **Đầu bếp (Chef/Giảng viên):** Sáng tạo nội dung, xuất bản khóa học chuyên nghiệp, tương tác và hỗ trợ học viên giải đáp thắc mắc.
- **Đội ngũ quản trị & CSKH:** Vận hành hệ sinh thái, kiểm duyệt chất lượng nội dung, giám sát doanh thu và giải quyết khiếu nại qua hệ thống Ticket.

### 1.2. Đối Tượng Người Dùng
- **Người nội trợ & giới trẻ:** Cần tìm kiếm công thức nấu ăn nhanh, dễ hiểu, có định lượng nguyên liệu tự động co giãn theo khẩu phần.
- **Học viên ẩm thực định hướng nghề nghiệp:** Cần lộ trình bài bản, video độ phân giải cao 1080p, tài liệu sư phạm PDF và chứng chỉ chứng nhận kỹ năng.
- **Chuyên gia ẩm thực & Bếp trưởng:** Cần nền tảng uy tín để truyền đạt kinh nghiệm và xây dựng thương hiệu cá nhân.

### 1.3. Sơ Đồ Kiến Trúc Nghiệp Vụ Tổng Thể (ASCII Architecture)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               WEB HỌC NẤU ĂN ONLINE                                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
          │                                 │                                │
          ▼                                 ▼                                ▼
┌──────────────────┐              ┌──────────────────┐             ┌──────────────────┐
│     HỌC VIÊN     │              │     ĐẦU BẾP      │             │   QUẢN TRỊ VIÊN  │
│  (Free / Pro)    │              │     (Chef)       │             │ (Admin & Support)│
└──────────────────┘              └──────────────────┘             └──────────────────┘
   │            │                        │                                   │
   │ Xem / Lưu  │ Mua gói Pro            │ Soạn khóa học                     │ Duyệt gói Pro
   │ công thức  │ Đăng ký học            │ Soạn công thức                    │ Duyệt công thức
   │ Bình luận  │ Làm bài tập            │ Trả lời thắc mắc                  │ Xử lý ticket
   │            │ Nhận chứng chỉ         │ Xem học viên                      │ Báo cáo doanh thu
   ▼            ▼                        ▼                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             CƠ SỞ DỮ LIỆU & LOGIC TRUNG TÂM                            │
│  - Auth & RBAC (5 vai trò)          - Quản lý công thức & Danh mục                     │
│  - Mô hình Gói Pro (30d / 365d)     - Khóa học, Video HD, Bài tập, Chứng chỉ           │
│  - Cổng VNPay Sandbox               - Realtime Ticket & Thông báo chuông               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 👥 2. Các Vai Trò Người Dùng & Quyền Hạn

Hệ thống phân chia thành **5 vai trò chính thức** (kèm trạng thái hội viên Pro cho vai trò User):

### 2.1. Khách Vãng Lai (Guest)
- Người dùng chưa đăng nhập tài khoản.
- Được truy cập trang chủ (`/`), danh sách công thức (`/cong-thuc`), danh sách khóa học (`/khoa-hoc`), bảng giá gói Pro (`/bang-gia`), bài viết tin tức (`/bai-viet`).
- Khi nhấn vào chi tiết một công thức, khóa học hoặc cố gắng thực hiện hành động (lưu món, bình luận, gửi đánh giá), hệ thống tự động lưu URL chuyển hướng và đưa về trang `/dang-nhap`.

### 2.2. Học Viên Thường (Free User)
- Đã đăng ký và xác thực tài khoản qua email.
- Được xem đầy đủ chi tiết công thức, lưu công thức yêu thích, bình luận thảo luận, gửi đánh giá 1-5 sao.
- Được ghi danh khóa học nhưng **CHỈ xem được video bài học giới thiệu (Preview)**.
- **KHÔNG có quyền:** Xem video HD, tải tài liệu giáo trình PDF, làm bài tập chấm điểm, nhận chứng chỉ số, và **KHÔNG có nút "Tạo công thức"**.

### 2.3. Học Viên Cao Cấp (Pro User)
- Là tài khoản User đã mua hoặc được Admin cấp **Gói Hội Viên Premium** còn hạn sử dụng hợp lệ (`profiles.la_pro = true` và `profiles.goi_het_han > now()`).
- Mở khóa trọn vẹn đặc quyền:
  1. Xem toàn bộ video bài giảng chất lượng cao 1080p (`video_hd_url`).
  2. Tải tài liệu sư phạm định dạng PDF chuẩn.
  3. Làm bài tập trắc nghiệm có chấm điểm tự động.
  4. Cấp chứng chỉ số hóa hoàn thành khóa học (file PDF tải về kèm mã QR tra cứu tính minh bạch).
  5. **CÓ nút "Tạo công thức" (`/tao-cong-thuc`)** để sáng tạo và gửi bài cho Admin duyệt xuất bản.
  6. Hồ sơ cá nhân có **Huy hiệu Pro Vương miện vàng**, viết bio dài hơn, đính kèm liên kết mạng xã hội.
  7. Quyền gửi yêu cầu hỗ trợ 1-1 với Đầu bếp chuyên gia.
  8. Trải nghiệm học tập sạch, không hiển thị biểu ngữ quảng cáo.

### 2.4. Đầu Bếp (Chef)
- Là người hướng dẫn chuyên môn được Admin bổ nhiệm hoặc thăng hạng.
- Sở hữu không gian làm việc chuyên biệt tại `/bep/*`:
  - Soạn thảo, xuất bản và cập nhật công thức món ăn của bản thân.
  - Thiết kế khóa học: thêm chương, bài giảng video preview, video HD, tải tài liệu PDF, cấu hình câu hỏi trắc nghiệm chấm điểm.
  - Xem thống kê số lượng học viên tham gia học bài, đọc và trả lời bình luận của học viên.

### 2.5. Nhân Viên Hỗ Trợ (Support / CSKH)
- Phụ trách giải quyết khiếu nại và đồng hành cùng học viên tại `/nhan-vien/*`:
  - Tiếp nhận, phân loại và cập nhật trạng thái mọi Ticket hỗ trợ từ người dùng.
  - Khung chat thời gian thực (Supabase Realtime) phản hồi tức thì với học viên.
  - Ghi chú nội bộ dành riêng cho đội ngũ kỹ thuật.
  - Chuyển tiếp các trường hợp phức tạp (hoàn tiền, lỗi tài khoản) lên cấp Quản trị viên (Admin).

### 2.6. Quản Trị Viên (Admin)
- Người nắm quyền hạn tối cao trong hệ sinh thái tại `/quan-tri/*`:
  - **Quản lý hội viên:** Duyệt yêu cầu nâng cấp Pro, chủ động cấp gói hoặc thu hồi gói thủ công.
  - **Kiểm duyệt nội dung:** Phê duyệt hoặc từ chối công thức do Pro User gửi lên; quản lý danh mục ẩm thực; kiểm duyệt bình luận, đánh giá.
  - **Vận hành tài chính:** Quản lý cấu hình 2 gói Premium, theo dõi nhật ký giao dịch VNPay, hoàn tiền.
  - **Giám sát hệ thống:** Xem biểu đồ tăng trưởng, nhật ký hoạt động (Audit log) chi tiết, cấu hình thông tin nền tảng.

---

## 💎 3. Mô Hình Gói Hội Viên Premium (Pro)

Hệ thống loại bỏ hoàn toàn việc bán lẻ từng khóa học nhằm đơn giản hóa trải nghiệm, thay vào đó áp dụng **mô hình thuê bao Pro theo thời hạn cố định**.

### 3.1. Bảng Thông Tin 2 Gói Pro Chính Thức

> [!IMPORTANT]
> **QUY TẮC CỐT LÕI:** Tuyệt đối **KHÔNG CÓ GÓI VĨNH VIỄN (LIFETIME)**. Mọi gói cước khi kích hoạt bắt buộc phải có ngày hết hạn xác định (`ngay_het_han NOT NULL`).

| Thông số | Gói Pro Tháng | Gói Pro Năm (Ưu đãi vàng) |
|---|---|---|
| **Mã gói (Code)** | `pro_thang` | `pro_nam` |
| **Tên hiển thị** | **Pro Tháng** | **Pro Năm** |
| **Thời hạn dịch vụ** | **30 ngày** | **365 ngày** |
| **Giá niêm yết** | **99.000 ₫** | **799.000 ₫** *(Tiết kiệm ~33% chi phí)* |
| **Chi phí bình quân** | ~3.300 ₫ / ngày | ~2.180 ₫ / ngày (~66.000 ₫ / tháng) |
| **Chính sách gia hạn** | Cộng dồn thời hạn tiếp nối vào `goi_het_han` hiện tại nếu tài khoản đang còn hạn Pro. | Cộng dồn thời hạn tiếp nối vào `goi_het_han` hiện tại nếu tài khoản đang còn hạn Pro. |

### 3.2. Bảng So Sánh Quyền Lợi: Học Viên Thường (Free) vs Hội Viên Pro

```text
┌────────────────────────────────────────────────────────┬─────────────┬─────────────┐
│ TÍNH NĂNG / QUYỀN LỢI NỀN TẢNG                         │  USER FREE  │   USER PRO  │
├────────────────────────────────────────────────────────┼─────────────┼─────────────┤
│ 1. Xem toàn bộ công thức chuẩn vị chi tiết             │      ✅     │      ✅     │
│ 2. Lưu công thức vào bộ sưu tập cá nhân                │      ✅     │      ✅     │
│ 3. Đánh giá sao & tham gia bình luận cộng đồng         │      ✅     │      ✅     │
│ 4. Tự động co giãn định lượng nguyên liệu theo khẩu phần│     ✅     │      ✅     │
│ 5. Đăng ký ghi danh khóa học nấu ăn                    │      ✅     │      ✅     │
│ 6. Xem video bài học giới thiệu (Preview)              │      ✅     │      ✅     │
│ 7. Xem video bài giảng độ phân giải cao HD 1080p       │      ❌     │      ✅     │
│ 8. Tải giáo trình hướng dẫn nấu ăn file PDF            │      ❌     │      ✅     │
│ 9. Làm bài tập trắc nghiệm có chấm điểm tự động        │      ❌     │      ✅     │
│ 10. Cấp chứng chỉ số hóa (Certificate PDF + QR tra cứu)│      ❌     │      ✅     │
│ 11. CÓ nút "Tạo công thức" gửi Admin duyệt xuất bản    │      ❌     │      ✅     │
│ 12. Huy hiệu Pro vương miện vàng khẳng định đẳng cấp   │      ❌     │      ✅     │
│ 13. Nâng cấp Profile cá nhân (Bio dài hơn, MXH)        │      ❌     │      ✅     │
│ 14. Hỗ trợ chuyên sâu 1-1 cùng Đầu bếp                 │      ❌     │      ✅     │
│ 15. Trải nghiệm học tập tập trung, không có quảng cáo  │      ❌     │      ✅     │
└────────────────────────────────────────────────────────┴─────────────┴─────────────┘
```

---

## 🔄 4. Các Luồng Nghiệp Vụ Chính (7 Luồng)

### 4.1. Luồng 1: Đăng Ký & Đăng Nhập Hệ Thống

```text
[Người Dùng] ──(1) Điền form đăng ký──> [Next.js Server Action]
                                               │
                                       (2) Tạo auth.users + profiles (Free)
                                               │
                                               ▼
                                     [Supabase Auth Engine] ──(3) Gửi mail──> [Hộp thư người dùng]
                                                                                   │
[Học Viên] <──(5) Đăng nhập thành công ── [Xác nhận Token] <──(4) Bấm link xác thực ┘
```

1. **Khách** truy cập `/dang-ky`, cung cấp: Họ tên, Email, Mật khẩu (tối thiểu 6 ký tự).
2. Server Action kiểm tra tính hợp lệ qua Zod Schema. Supabase Auth tạo tài khoản ở trạng thái chờ xác thực và phát sinh bản ghi hồ sơ tương ứng tại `public.profiles` (`vai_tro = 'user'`, `la_pro = false`).
3. Dịch vụ Resend gửi email xác nhận chứa liên kết callback chứa OTP token.
4. Người dùng bấm link trong email xác nhận tài khoản hoạt động (`email_confirmed_at`).
5. Người dùng truy cập `/dang-nhap`. Hệ thống xác thực danh tính, tạo phiên cookie an toàn và điều hướng dựa theo vai trò (`/quan-tri`, `/bep`, `/nhan-vien`, hoặc `/bang-dieu-khien`).

---

### 4.2. Luồng 2: Duyệt Công Thức Do Pro User Đóng Góp

```text
[Pro User] ──(1) Soạn thảo form──> [Gửi duyệt: trang_thai = 'cho_duyet']
                                            │
                                  (2) Bắn thông báo Realtime
                                            │
                                            ▼
                                   [Admin /quan-tri/cong-thuc]
                                            │
                    ┌───────────────────────┴───────────────────────┐
             [Bấm: Duyệt]                                    [Bấm: Từ chối]
                    │                                               │
           (3a) trang_thai = 'xuat_ban'                   (3b) trang_thai = 'tu_choi'
                    │                                               │
                    ▼                                               ▼
         Công thức lên trang chủ                         Gửi thông báo lý do cho tác giả
```

1. Học viên Pro bấm vào nút **"Tạo công thức"** trên thanh điều hướng hoặc truy cập `/tao-cong-thuc`.
2. Học viên điền đầy đủ: Tiêu đề, danh mục, thời gian chuẩn bị/nấu, khẩu phần, độ khó, nguyên liệu (JSON), các bước thực hiện (JSON), ảnh bìa Unsplash và link video YouTube mẫu.
3. Sau khi bấm "Gửi kiểm duyệt", bản ghi công thức được lưu với trạng thái `trang_thai = 'cho_duyet'` và cờ `tac_gia_la_pro = true`.
4. Quản trị viên truy cập `/quan-tri/cong-thuc` xem trước nội dung:
   - **Nếu đạt:** Bấm **"Phê duyệt"** ➜ `trang_thai = 'xuat_ban'`. Công thức ngay lập tức xuất hiện công khai trên website. Tác giả nhận thông báo chuông chúc mừng.
   - **Nếu vi phạm:** Bấm **"Từ chối"**, nhập lý do từ chối ➜ `trang_thai = 'tu_choi'`. Tác giả nhận thông báo lý do để chỉnh sửa lại.

---

### 4.3. Luồng 3: Mua Gói Premium & Duyệt Lên Pro

```text
[Học Viên] ──> [/nang-cap-pro] ──> [Chọn gói: Tháng / Năm] ──> [Cổng VNPay Sandbox]
                                                                        │
                                                               (Thanh toán xong)
                                                                        │
                                                                        ▼
                                                         [Tạo yeu_cau_nang_cap: cho_duyet]
                                                         [Tạo thanh_toan: da_thanh_toan]
                                                                        │
                                                                        ▼
                                                         [Admin /quan-tri/duyet-nang-cap]
                                                                        │
                                                                 (Admin bấm DUYỆT)
                                                                        │
                                                                        ▼
                                                         [Trigger DB: duyet_nang_cap]
                                                         - profiles.la_pro = true
                                                         - profiles.goi_het_han = now + 30/365d
                                                         - Insert goi_nguoi_dung
                                                         - Bắn thông báo Realtime lên Pro
```

1. Học viên truy cập `/nang-cap-pro`, so sánh tính năng và chọn gói mong muốn (Pro Tháng hoặc Pro Năm).
2. Hệ thống khởi tạo đơn hàng và chuyển hướng học viên sang Cổng thanh toán **VNPay Sandbox**.
3. Sau khi học viên hoàn tất giao dịch thanh toán, VNPay gọi về URL kết quả `/api/thanh-toan/vnpay/ket-qua`:
   - Ghi nhận bản ghi giao dịch tại bảng `thanh_toan` với `loai_thanh_toan = 'goi_premium'`.
   - Tự động tạo bản ghi tại bảng `yeu_cau_nang_cap` với mã yêu cầu `YC-XXXXXX`, `trang_thai = 'cho_duyet'`.
4. Quản trị viên nhận thông báo realtime và truy cập màn hình `/quan-tri/duyet-nang-cap`.
5. Quản trị viên đối soát thông tin và nhấn nút **"Duyệt nâng cấp"**:
   - Hàm trigger cơ sở dữ liệu `xu_ly_duyet_nang_cap()` tự động chạy.
   - Cập nhật `profiles.la_pro = true`, gán `goi_hien_tai_id` và tính toán ngày hết hạn chính xác (`goi_het_han = now() + 30 days` hoặc `+ 365 days`).
   - Thêm bản ghi lịch sử vào `goi_nguoi_dung`.
   - Bắn thông báo hệ thống chúc mừng tới chuông thông báo của học viên.
6. Khi học viên tải lại trang hoặc điều hướng, giao diện lập tức hiển thị **Huy hiệu Pro**, mở khóa toàn bộ bài học HD và nút Tạo công thức.

> **Ghi chú — Chế độ demo thanh toán (cập nhật 05/11/2026):** VNPay yêu cầu đăng ký merchant mới cấp mã thật, nên hệ thống có thêm chế độ mô phỏng qua biến môi trường `VNPAY_DEMO=true`: học viên được chuyển tới trang cổng mô phỏng `/thanh-toan-demo` ngay trong website (giao diện giống cổng VNPay, có nhãn "MÔI TRƯỜNG DEMO") với 2 lựa chọn thanh toán thành công / hủy. Từ bước này trở đi mọi xử lý đều là thật: tham số kết quả được ký HMAC-SHA512 bằng cùng hàm dùng cho VNPay, gọi IPN thật, ghi giao dịch, tạo yêu cầu chờ duyệt và Admin duyệt như mô tả ở trên. Khi có mã VNPay thật, chỉ cần điền `VNPAY_TMN_CODE`/`VNPAY_HASH_SECRET` và đặt `VNPAY_DEMO=false` là hệ thống dùng cổng VNPay Sandbox/Production, không phải sửa mã nguồn. Chi tiết kiểm chứng xem `TESTING.md` mục kiểm thử cổng thanh toán demo.

---

### 4.4. Luồng 4: Admin Cấp Gói Pro Thủ Công

```text
[Admin] ──> [/quan-tri/quan-ly-nguoi-dung] ──> [Chọn Người Dùng Cụ Thể]
                                                        │
                                            (Bấm: "Cấp gói Pro")
                                                        │
                                                        ▼
                                            [Modal Form Cấp Gói]
                                            - Chọn gói: Tháng / Năm
                                            - Nhập lý do / Ghi chú thưởng
                                                        │
                                                        ▼
                                            [Server Action: capGoiThuCong]
                                            - Cập nhật profiles (la_pro, goi_het_han)
                                            - Tạo goi_nguoi_dung (cap_boi_admin = true)
                                            - Gửi thông báo chúc mừng tới User
```

1. Áp dụng cho các trường hợp: tặng quà sự kiện, học bổng học tập hoặc xử lý hỗ trợ offline.
2. Admin truy cập danh sách người dùng tại `/quan-tri/quan-ly-nguoi-dung`.
3. Bấm vào menu thao tác của người dùng mong muốn ➜ Chọn **"Cấp gói Pro"**.
4. Hộp thoại (Modal) xuất hiện: Admin chọn gói (Pro Tháng / Pro Năm) và điền ghi chú giải thích.
5. Thực thi Server Action `capGoiThuCong()`:
   - Bản ghi `goi_nguoi_dung` được tạo với cờ `cap_boi_admin = true`.
   - `profiles.la_pro` chuyển thành `true` kèm thời hạn chính xác.
   - Người dùng nhận thông báo realtime về việc được cấp quyền hội viên.

---

### 4.5. Luồng 5: Đăng Ký Khóa Học (Khóa Học Thuộc Gói Pro)

```text
[Học Viên] ──> [Xem trang chi tiết khóa học: /khoa-hoc/[slug]]
                     │
         (Bấm: "Đăng ký học ngay")
                     │
                     ▼
          [Kiểm tra trạng thái User]
          ┌──────────┴──────────┐
    [User Free]           [User Pro]
          │                     │
  Ghi danh thành công   Ghi danh thành công
  Chỉ xem video Preview Mở khóa Video HD 1080p,
  Không có tài liệu/test Tải PDF, Làm test, Cấp chứng chỉ
```

1. Mọi người dùng đã đăng nhập đều có thể nhấn **"Đăng ký học"** một khóa học hoàn toàn miễn phí.
2. Bản ghi được tạo tại bảng `dang_ky_khoa_hoc` liên kết giữa người dùng và khóa học.
3. Sự khác biệt về trải nghiệm học tập:
   - **User Free:** Khi vào bài học, hệ thống chỉ phát video giới thiệu cơ bản. Các nút Tải tài liệu, Làm bài tập trắc nghiệm sẽ bị khóa mờ kèm nhãn **"Dành cho Pro"**.
   - **User Pro:** Toàn bộ nội dung bài học chuyên sâu được hiển thị trọn vẹn, không giới hạn.

---

### 4.6. Luồng 6: Học Bài, Hoàn Thành Khóa Học & Nhận Chứng Chỉ

```text
[Pro User] ──> [Vào trang học: /hoc-bai/[slug]]
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
  Xem Video HD   Tải tài liệu PDF Làm bài trắc nghiệm
       │                           │
  Lưu tiến độ                      Đạt điểm >= 80%
       │                           │
       └─────────────┬─────────────┘
                     ▼
       [Hoàn thành 100% các bài học]
                     │
                     ▼
       [Hệ thống tự động cấp Chứng Chỉ]
       - Tạo bản ghi public.chung_chi
       - Mã chứng chỉ độc bản: CC-XXXXXXXX
       - Sinh mã QR tra cứu trực tuyến
       - Cho phép tải file PDF chứng chỉ
```

1. Học viên học qua từng bài học. Khi xem hết video, hệ thống ghi nhận tiến độ vào bảng `tien_do_bai_hoc` (`da_hoan_thanh = true`).
2. Với các bài học có câu hỏi trắc nghiệm, học viên nộp bài làm:
   - Hệ thống so khớp đáp án tự động.
   - Nếu đạt yêu cầu (từ 80% điểm trở lên), bài học được đánh dấu hoàn thành.
3. Khi tất cả các bài học trong khóa đều đạt `da_hoan_thanh = true`:
   - Khóa học chuyển sang trạng thái hoàn thành (`dang_ky_khoa_hoc.hoan_thanh = true`).
   - Trigger tự động kích hoạt tạo bản ghi tại bảng `chung_chi`: cấp mã chứng chỉ duy nhất dạng `CC-YYYYMMDD-XXXX`, gắn mã QR công khai để xác thực.
   - Học viên có thể xem trực tuyến và tải chứng chỉ PDF về máy.

---

### 4.7. Luồng 7: Hỗ Trợ Khách Hàng (Ticket CSKH Realtime)

```text
[Học Viên] ──> [/ho-tro/tao-ticket] ──> [Gửi yêu cầu: trang_thai = 'moi']
                                                │
                                                ▼
                                    [Support /nhan-vien/tickets]
                                                │
                                    (Tiếp nhận & Chat Realtime)
                                                │
                         ┌──────────────────────┴──────────────────────┐
                [Giải quyết xong]                            [Vấn đề phức tạp]
                         │                                             │
               trang_thai = 'da_giai_quyet'                 Chuyển tiếp lên Admin
                         │                                             │
               Học viên đóng ticket                         Admin can thiệp xử lý
```

1. Học viên gặp khó khăn về kỹ thuật, thanh toán hoặc câu hỏi nấu ăn truy cập `/ho-tro/tao-ticket`.
2. Học viên điền tiêu đề, chọn mức độ ưu tiên (thấp/trung bình/cao) và nội dung cần hỗ trợ. Bản ghi được tạo trong `ticket_ho_tro`.
3. Nhân viên hỗ trợ (Support) truy cập `/nhan-vien` thấy ticket mới xuất hiện ngay lập tức qua kết nối Supabase Realtime.
4. Nhân viên bấm mở ticket, trao đổi trực tiếp với học viên qua khung chat hai chiều (`tin_nhan_ticket`).
5. Nếu cần xin ý kiến kỹ thuật hoặc hoàn tiền, nhân viên sử dụng tính năng **Ghi chú nội bộ** và gắn cờ chuyển Admin.
6. Khi vấn đề được xử lý triệt để, ticket chuyển sang `da_giai_quyet` và học viên có thể đánh giá mức độ hài lòng.

---

## ⚖️ 5. Quy Tắc Nghiệp Vụ Hệ Thống (Business Rules)

Hệ thống tuân thủ nghiêm ngặt 15 quy tắc kinh doanh dưới đây:

1. **[BR-01] Không tồn tại gói vĩnh viễn:** Mọi gói cước Premium chỉ có thời hạn 30 ngày hoặc 365 ngày. Ngày hết hạn `goi_het_han` luôn là giá trị bắt buộc không được phép `NULL` đối với tài khoản Pro.
2. **[BR-02] Tự động cộng dồn thời hạn Pro:** Nếu người dùng đang còn thời hạn Pro mà tiếp tục mua thêm hoặc được cấp thêm gói, thời hạn của gói mới sẽ được cộng nối tiếp từ mốc `goi_het_han` hiện tại chứ không bị ghi đè lãng phí.
3. **[BR-03] Kiểm tra hết hạn Pro tự động:** Khi `now() > goi_het_han`, hàm SQL định kỳ sẽ thu hồi quyền Pro (`la_pro = false`, `goi_hien_tai_id = null`), trạng thái trong `goi_nguoi_dung` chuyển thành `het_han`.
4. **[BR-04] Rào chắn quyền tạo công thức:** Chỉ có **Pro User**, **Chef** hoặc **Admin** mới được phép truy cập và submit form tại route `/tao-cong-thuc`. Người dùng thường cố tình truy cập sẽ bị Middleware chặn và redirect về `/nang-cap-pro?ly_do=tao_cong_thuc`.
5. **[BR-05] Quy trình kiểm duyệt công thức 2 bước:** Mọi công thức đóng góp bởi Pro User đều phải ở trạng thái `cho_duyet`. Chỉ sau khi Admin bấm phê duyệt (`xuat_ban`) thì công thức mới xuất hiện trên trang công khai.
6. **[BR-06] Kiểm soát truy cập video HD:** Video chất lượng cao 1080p (`video_hd_url`) được bảo vệ ở tầng Server Action. Nếu người dùng không phải Pro, API sẽ từ chối trả về URL stream HD.
7. **[BR-07] Điều kiện cấp chứng chỉ số:** Học viên chỉ được cấp chứng chỉ khi tiến độ hoàn thành đạt chính xác 100% tổng số bài học và vượt qua toàn bộ bài kiểm tra trắc nghiệm của khóa học đó.
8. **[BR-08] Nguyên tắc xóa mềm (Soft Delete):** Mọi công thức, khóa học, bài học, bình luận, người dùng khi bị xóa bởi Admin hoặc tác giả đều chỉ được cập nhật cờ `deleted_at = now()`. Tuyệt đối không xóa vật lý khỏi database để đảm bảo toàn vẹn dữ liệu thống kê.
9. **[BR-09] Chống tự tước quyền Quản trị:** Admin đang đăng nhập không thể tự hạ cấp vai trò của chính mình xuống User/Chef, và không thể tự kích hoạt khóa tài khoản của chính mình.
10. **[BR-10] Tính toàn vẹn của Audit Log:** Mọi hành động nhạy cảm trong phân hệ Admin (duyệt gói, cấp gói, đổi vai trò, xóa nội dung, hoàn tiền) bắt buộc phải được ghi nhận vào bảng `nhat_ky_hoat_dong` kèm ID, IP và payload.
11. **[BR-11] Một đánh giá cho mỗi công thức/khóa học:** Mỗi tài khoản chỉ được gửi duy nhất 1 lượt đánh giá sao (1-5 sao) kèm nhận xét cho mỗi công thức hoặc khóa học. Các lần sau chỉ được phép chỉnh sửa đánh giá cũ.
12. **[BR-12] Co giãn nguyên liệu tự động:** Khẩu phần nấu tối thiểu là 1 người và tối đa là 50 người. Định lượng nguyên liệu hiển thị trên giao diện sẽ tỷ lệ thuận theo công thức:  
   $$\text{Định lượng hiển thị} = \frac{\text{Định lượng gốc}}{\text{Khẩu phần gốc}} \times \text{Khẩu phần người dùng chọn}$$
13. **[BR-13] Định danh Slug duy nhất:** Mọi slug của công thức, khóa học, danh mục phải được chuẩn hóa tiếng Việt không dấu, ngăn cách bằng dấu gạch ngang và là duy nhất trong toàn hệ thống.
14. **[BR-14] Bảo vệ kênh hỗ trợ Ticket:** Học viên chỉ có thể mở tối đa 3 ticket ở trạng thái `moi` hoặc `dang_xu_ly` cùng một lúc nhằm ngăn chặn hành vi spam hệ thống.
15. **[BR-15] Xác thực bảo mật hai đầu (Front & Back):** Mọi dữ liệu người dùng gửi lên bắt buộc phải được kiểm định kép qua Zod Schema tại Frontend (Client UX) và kiểm định lại tại Server Actions trước khi truy vấn database.

---

## 📊 6. Sơ Đồ Chuyển Đổi Trạng Thái Thực Thể

### 6.1. Trạng Thái Công Thức (`cong_thuc.trang_thai`)

```text
               ┌───────────────┐
               │     nhap      │ ◄── (Tác giả đang soạn dở)
               └───────┬───────┘
                       │ (Bấm gửi duyệt)
                       ▼
               ┌───────────────┐
         ┌────►│   cho_duyet   │◄── (Pro User gửi bài)
         │     └───────┬───────┘
(Sửa lại)│             │
         │     ┌───────┴───────┐
         │ (Admin duyệt)  (Admin từ chối)
         │     ▼               ▼
   ┌─────┴─────┐       ┌───────────────┐
   │ tu_choi   │       │   xuat_ban    │ ── (Hiện công khai)
   └───────────┘       └───────┬───────┘
                               │ (Admin/Chef ẩn)
                               ▼
                       ┌───────────────┐
                       │    tam_an     │
                       └───────────────┘
```

---

### 6.2. Trạng Thái Yêu Cầu Nâng Cấp Pro (`yeu_cau_nang_cap.trang_thai`)

```text
               ┌─────────────────────────────────┐
               │            cho_duyet            │ ◄── (User thanh toán VNPay xong)
               └────────────────┬────────────────┘
                                │
                ┌───────────────┴───────────────┐
         (Admin duyệt)                   (Admin từ chối / User hủy)
                │                               │
                ▼                               ▼
       ┌─────────────────┐             ┌─────────────────┐
       │     da_duyet    │             │ tu_choi / da_huy│
       └────────┬────────┘             └─────────────────┘
                │
                ▼ (Trigger DB chạy)
       [profiles.la_pro = true]
       [goi_nguoi_dung: 'hoat_dong']
```

---

### 6.3. Trạng Thái Ticket Hỗ Trợ (`ticket_ho_tro.trang_thai`)

```text
   ┌───────────┐         (Support mở xem)        ┌───────────────┐
   │    moi    │ ──────────────────────────────> │  dang_xu_ly   │
   └───────────┘                                 └───────┬───────┘
                                                         │
                         ┌───────────────────────────────┴───────────────────────────────┐
                         ▼                                                               ▼
                 ┌───────────────┐                                               ┌───────────────┐
                 │ cho_phan_hoi  │ (Chờ User phản hồi)                           │ da_giai_quyet │
                 └───────┬───────┘                                               └───────┬───────┘
                         │                                                               │
                         └───────────────────────► ┌───────────┐ ◄───────────────────────┘
                                                   │   dong    │ (Sau 48h hoặc User đóng)
                                                   └───────────┘
```

---

### 6.4. Trạng Thái Gói Người Dùng (`goi_nguoi_dung.trang_thai`)

```text
               ┌─────────────────────────────────┐
               │            hoat_dong            │ ◄── (Được duyệt hoặc cấp thủ công)
               └────────────────┬────────────────┘
                                │
                ┌───────────────┴───────────────┐
         (now() > ngay_het_han)          (Admin thu hồi trước hạn)
                │                               │
                ▼                               ▼
       ┌─────────────────┐             ┌─────────────────┐
       │     het_han     │             │       huy       │
       └─────────────────┘             └─────────────────┘
```

---

## 🔒 7. Ma Trận Phân Quyền Chi Tiết (RBAC Matrix)

| Ký hiệu: | **C** = Create (Tạo) | **R** = Read (Xem) | **U** = Update (Sửa) | **D** = Delete (Xóa) | **-** = Không có quyền |
|---|---|---|---|---|---|

| Phân hệ chức năng | Guest | User Free | Pro User | Chef | Support | Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Trang chủ & Danh mục** | R | R | R | R | R | CRUD |
| **Xem công thức công khai** | R | R | R | R | R | R |
| **Lưu công thức & Đánh giá** | - | CRU | CRU | CRU | CRU | CRUD |
| **Tạo công thức mới** | - | - | **C (Chờ duyệt)** | **CRUD (Trực tiếp)** | - | **CRUD** |
| **Xem Khóa học (Video Preview)**| R | R | R | R | R | R |
| **Học Khóa học (Video HD 1080p)**| - | - | **R** | **R** | **R** | **R** |
| **Tải giáo trình PDF & Test bài**| - | - | **R, C** | **CRUD** | **R** | **CRUD** |
| **Nhận & Tải chứng chỉ số** | - | - | **R, C** | **R** | - | **CRUD** |
| **Mua gói Premium (VNPay)** | - | C | C | C | - | - |
| **Quản lý danh sách gói Pro** | - | - | - | - | - | **CRUD** |
| **Duyệt yêu cầu Pro / Cấp gói** | - | - | - | - | - | **CRUD** |
| **Gửi Ticket hỗ trợ** | - | CR | CR | CR | - | - |
| **Xử lý Ticket & Chat CSKH** | - | - | - | - | **RU** | **CRUD** |
| **Quản lý tài khoản người dùng** | - | - | - | - | R | **CRUD** |
| **Thống kê doanh thu & Audit Log**| - | - | - | - | - | **R** |

---

## 🚀 8. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### 8.1. Hiệu Năng (Performance)
- **Thời gian phản hồi:** Tốc độ tải trang đầu (FCP) dưới 1.2 giây trên mạng 4G/Wifi tiêu chuẩn.
- **Điểm số Lighthouse:** Đạt tối thiểu 90/100 điểm cho các tiêu chí Performance, Accessibility, Best Practices và SEO.
- **Tối ưu hình ảnh:** Toàn bộ ảnh ẩm thực sử dụng định dạng hiện đại Next.js Image Component (`next/image`), nén WebP tự động, kích thước responsive và lazy load.

### 8.2. Bảo Mật & An Toàn Dữ Liệu (Security)
- **Xác thực phiên:** Lưu trữ Session qua HTTP-Only Secure Cookies, ngăn chặn triệt để tấn công XSS và đánh cắp token.
- **Bảo mật tầng cơ sở dữ liệu (RLS):** Bật Row Level Security cho 100% các bảng; quyền hạn truy vấn được cô lập ngay từ PostgreSQL Engine.
- **Chống gian lận phân quyền:** Middleware kiểm tra Session và vai trò tại Edge Network trước khi request đến Server Component.
- **Xác thực dữ liệu đầu vào:** Zod Schema sanitize toàn bộ chuỗi ký tự, ngăn chặn SQL Injection và Stored XSS.

### 8.3. Tính Khả Dụng & Trải Nghiệm (Usability & Accessibility)
- **Tương thích thiết bị (Responsive):** Hiển thị hoàn hảo trên 3 nhóm màn hình chính: Mobile (320px - 767px), Tablet (768px - 1023px) và Desktop (1024px+).
- **Chuẩn trợ năng:** Tuân thủ WCAG 2.1 cấp độ AA: độ tương phản màu chữ đạt chuẩn, có thuộc tính `aria-label` cho các nút icon, điều hướng phím Tab mượt mà.
- **Hỗ trợ Dark Mode:** Chuyển đổi giao diện sáng/tối tự nhiên không gây chớp giật màn hình (`suppressHydrationWarning`).

### 8.4. Tối Ưu Hóa Công Cụ Tìm Kiếm (SEO)
- Tự động sinh `sitemap.xml` và `robots.txt` chứa toàn bộ đường dẫn công thức, khóa học và bài viết chuẩn SEO.
- Thẻ OpenGraph (OG Meta Tags) và JSON-LD Schema (Recipe Schema chuẩn Google Search) được nhúng động cho từng món ăn.
