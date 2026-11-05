# KIỂM THỬ HỆ THỐNG — HỌC NẤU ĂN ONLINE

Tài liệu ghi lại toàn bộ hoạt động kiểm thử đã thực hiện cho đồ án, phục vụ nghiệm thu và bảo vệ.
Cập nhật: 05/11/2026.

## 1. Môi trường & tài khoản kiểm thử

- Môi trường: máy phát triển Windows, Next.js dev server tại `http://localhost:3000`, Supabase cloud (PostgreSQL/Auth/Storage/Realtime).
- Tài khoản kiểm thử (mật khẩu chung `Matkhau@123`, xem thêm README):

| Tài khoản | Vai trò | Gói |
|---|---|---|
| admin@naungon.vn | Quản trị viên (admin) | — |
| chef@naungon.vn | Đầu bếp (chef) | Pro |
| support@naungon.vn | Nhân viên hỗ trợ (support) | — |
| user1@naungon.vn | Học viên (user) | Pro đến 14/10/2027 |
| user2@naungon.vn | Học viên (user) | Free |

## 2. Kiểm chứng tĩnh (chất lượng mã nguồn)

| Hạng mục | Trước hoàn thiện | Sau hoàn thiện |
|---|---|---|
| TypeScript `tsc --noEmit` | 0 lỗi | 0 lỗi |
| ESLint | 0 lỗi, **72 cảnh báo** | **0 lỗi, 0 cảnh báo** |
| Kiểu `any` trong `src/` | 27 vị trí | **0** |
| Types `src/types/database.ts` so với migrations 001 + 003 | — | Khớp 24/24 bảng, đủ cột |
| Production build `npm run build` | — | (xem mục 5) |

## 3. Kiểm thử tự động bằng Playwright

Chạy bằng Microsoft Edge có sẵn trên máy (không tải thêm trình duyệt):

```powershell
npx playwright test
```

Cấu hình: `playwright.config.ts` (testDir `./tests`, baseURL `http://localhost:3000`, tự khởi động dev server nếu chưa chạy, dùng lại server đang chạy nếu có).

| # | Test case | File | Kết quả |
|---|---|---|---|
| 1 | Trang chủ tải được, có tiêu đề và menu chính | smoke.spec.ts | Đạt |
| 2 | Khách bị chuyển về `/dang-nhap` khi mở trang chi tiết | smoke.spec.ts | Đạt |
| 3 | Bảng giá hiện nhãn quyền lợi tiếng Việt, không còn mã thô (`xem_video_hd`) | smoke.spec.ts | Đạt |
| 4 | Bộ lọc công thức hiện nhãn tiếng Việt (Tất cả danh mục / Mọi độ khó) | smoke.spec.ts | Đạt |
| 5 | Admin đăng nhập → `/quan-tri` | smoke.spec.ts | Đạt |
| 6 | Đầu bếp đăng nhập → `/bep` | smoke.spec.ts | Đạt |
| 7 | Nhân viên đăng nhập → `/nhan-vien` | smoke.spec.ts | Đạt |
| 8 | Học viên đăng nhập → `/bang-dieu-khien` | smoke.spec.ts | Đạt |
| 9 | Tài khoản Free vào `/tao-cong-thuc` bị chuyển `/nang-cap-pro` | smoke.spec.ts | Đạt |
| 10 | Tài khoản Pro mở được form tạo công thức (có ô Calories (kcal) + chọn danh mục) | smoke.spec.ts | Đạt |
| 11 | Admin mở được trang duyệt nâng cấp Pro | smoke.spec.ts | Đạt |
| 12 | Trang học bài mở được trình phát video, không lỗi ảnh thu nhỏ YouTube (`img.youtube.com`) | smoke.spec.ts | Đạt |
| 13 | Ticket: user tạo → nhân viên trả lời → user thấy phản hồi | ticket.spec.ts | Đạt |


**Kết quả chạy cuối: 13/13 đạt** (smoke 12/12, ticket 1/1, tổng thời gian ~2 phút; cập nhật 2026-11-05 sau đợt viết lại nội dung và làm đẹp giao diện). Lần chạy đầu tiên có 2 test chưa đạt do lỗi ở phía file test (kỳ vọng nhãn chưa khớp form thật và chưa chờ phiên đăng nhập ổn định trước khi chuyển trang), đã sửa trong file test — mã nguồn ứng dụng không phải thay đổi. Lần chạy thứ hai phát hiện thêm test ticket chưa chạy lặp lại được khi còn dữ liệu cũ (trùng tiêu đề), đã đổi sang tiêu đề duy nhất theo thời gian cho mỗi lần chạy. Dữ liệu `TEST_` tạo trong lúc test đã được dọn sạch: 0 ticket `TEST_` còn lại, tin nhắn trong ticket bị xóa tự động theo cascade của khóa ngoại.

## 4. Kiểm thử thủ công đã thực hiện

- **Crawl toàn bộ route**: 13/13 route công khai trả 200; 33/33 route bảo vệ trả 307 chuyển `/dang-nhap` khi chưa đăng nhập; URL không tồn tại trả 404; không có lỗi 500.
- **Đăng nhập 5 vai trò** qua Supabase Auth API: thành công cả 5.
- **Phân quyền (middleware)**: khách mở trang chi tiết công thức/khóa học/bài viết → `/dang-nhap`; `/quan-tri` chỉ admin; `/nhan-vien` chỉ support + admin; `/bep` chỉ chef + admin; tài khoản bị khóa bị đăng xuất; tạo công thức yêu cầu Pro còn hạn.
- **Dữ liệu hiển thị**: ảnh món ăn/khóa học/bài viết là ảnh món ăn thật (Unsplash); video 15/15 bài học là video nấu ăn thật trên YouTube (đã kiểm chứng từng link bằng oEmbed); quyền lợi gói ở bảng giá hiển thị tiếng Việt đầy đủ.
- **Ảnh chụp đối chứng** trước/sau sửa lỗi lưu trong thư mục kiểm thử của nhóm phát triển.

## 5. Kiểm thử production build

- Production build `npm run build` **thành công** (05/11/2026): biên dịch 16,6 giây, sinh 63 trang tĩnh, bảng route tổng **78 route** (68 trang giao diện + 7 API route + `robots.txt` + `sitemap.xml` + trang 404). First Load JS dùng chung 209 kB, Middleware 98,4 kB.
- Sau khi build, khởi động lại dev server và crawl kiểm tra: **14/14** route công khai trả 200; **9/9** route bảo vệ mẫu trả 307 về `/dang-nhap` khi chưa đăng nhập; URL không tồn tại trả 404; không có lỗi 500.
- Ảnh chụp sau hoàn thiện (trang chủ, trang công thức, bảng giá) xác nhận: ảnh món ăn thật hiển thị đúng, bảng giá liệt kê đủ 8 quyền lợi tiếng Việt cho cả 2 gói.


## 6. Giới hạn đã biết (cần cấu hình môi trường để kiểm thử tiếp)

Các mục dưới đây **không phải lỗi code** — code đã hoàn thiện, chỉ thiếu thông tin đăng nhập dịch vụ bên thứ ba trong `.env.local`:

| Tính năng | Trạng thái | Nguyên nhân / cách khắc phục |
|---|---|---|
| Thanh toán VNPay (sandbox) | Chưa test được | `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET` đang trống — đăng ký tại sandbox.vnpayment.vn |
| Gửi email (Resend) | Chưa test được | `RESEND_API_KEY` đang trống |
| Tải chứng chỉ PDF, form liên hệ, đếm lượt xem, IPN VNPay | **Đã khắc phục 05/11/2026** | Secret key "default" cũ phía Supabase đã chết (trả 401 dù đúng định dạng) — đã tạo secret key mới và cấu hình lại `SUPABASE_SERVICE_ROLE_KEY`; kiểm chứng: form liên hệ ghi được nhật ký + thông báo admin, đếm lượt xem tăng đúng, sitemap có đủ slug, chứng chỉ xuất PDF thành công (riêng IPN VNPay còn chờ thông tin VNPay bên dưới) |
| Chứng chỉ PDF — dữ liệu mẫu | **Đã kiểm chứng** | Đã tạo chứng chỉ thử cho học viên mẫu, tải PDF thành công (200, đúng định dạng PDF), sau đó xóa dữ liệu thử. Lưu ý: bản đầu phát hiện lỗi font WinAnsi không mã hóa được tiếng Việt trong `src/lib/pdf/chung-chi.ts` — đã sửa bằng cách nhúng font Be Vietnam Pro (Regular/Bold/Italic) qua `@pdf-lib/fontkit` |
| Đẩy code lên GitHub từ phiên làm việc từ xa | Làm thủ công | Git Credential Manager không chạy trong phiên SSH — chạy `git push` từ terminal/VS Code trên máy |

## 7. Ghi chú dữ liệu

Database đang vận hành dùng bộ dữ liệu gọn: 9 công thức, 5 khóa học, 15 bài học, 2 bài viết.
File `supabase/seed.sql` trong repo chứa bộ dữ liệu đầy đủ hơn (20 công thức, 5 khóa học, 10 bài học, 5 bài viết) dùng khi cài đặt mới.
Dữ liệu kiểm thử tạo trong quá trình test đều có tiền tố `TEST_` và đã được dọn sau khi test xong.
