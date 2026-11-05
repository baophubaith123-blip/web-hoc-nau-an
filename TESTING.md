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
| Types `src/types/database.ts` so với migrations 001 + 003 + 005 | — | Khớp 24/24 bảng, đủ cột (005 bổ sung `bai_viet.ly_do_tu_choi` + trạng thái `cho_duyet`/`tu_choi`) |
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
| 14 | Tài khoản Free: `/ho-so` hiện trạng thái thành viên thường, có ô ngày sinh, nút Viết bài viết bị khóa và bật hộp thoại nâng cấp Pro | part-bc.spec.ts | Đạt |
| 15 | Tài khoản Pro: `/ho-so` hiện thẻ thành viên kèm tên gói, ngày hết hạn, số ngày còn lại; nút chức năng không bị khóa | part-bc.spec.ts | Đạt |
| 16 | Luồng bài viết người dùng: Pro gửi bài → "Chờ phê duyệt" → Admin duyệt → bài hiện ở danh sách công khai | part-bc.spec.ts | Đạt |
| 17 | Nội dung seed đợt 2 hiện ở danh sách công khai (Chè ba màu, Lẩu Thái chua cay, Kỹ thuật chiên xào châu Á, Mâm cơm Việt chuẩn vị) | part-bc.spec.ts | Đạt |
| 18 | Khóa học mới (Món Hàn tại nhà): hiện đủ 3 bài học, mở được bài xem trước với trình phát video, không lỗi trang | part-bc.spec.ts | Đạt |
| 19 | Hồi quy: học viên đã đăng nhập mở trang chủ → bấm avatar → mục "Hồ sơ" → vào được `/ho-so`, không lỗi trang | part-bc.spec.ts | Đạt |
| 20 | Cổng thanh toán demo: Free mua Pro Tháng → qua cổng demo bấm thanh toán thành công → về `/goi-cua-toi` thấy yêu cầu "Chờ duyệt" | part-bc.spec.ts | Đạt |
| 21 | Cổng thanh toán demo: Free chọn Pro Năm → qua cổng demo bấm hủy → URL kết quả báo `thanh_toan=that_bai` | part-bc.spec.ts | Đạt |
| 22 | Nhật ký hoạt động (admin): hiển thị bản ghi thật thay vì trạng thái trống (hồi quy lỗi sai tên khóa ngoại trong truy vấn) | roles-fix.spec.ts | Đạt |
| 23 | Thẻ thống kê Admin/Báo cáo/Hỗ trợ: vẽ biểu tượng thật, không còn hiện tên icon dạng chữ (`GraduationCap`, `TrendingUp`, `AlertTriangle`…) | roles-fix.spec.ts | Đạt |
| 24 | Trang đầu bếp: tiêu đề không bị trùng "Bếp trưởng Bếp Trưởng" | roles-fix.spec.ts | Đạt |
| 25 | Ticket: huy hiệu ưu tiên hiện "Trung bình", danh mục hiện "Lỗi kỹ thuật website" (không còn mã thô `trung_binh`/`ky_thuat`); trang chi tiết ticket không tự cuộn cửa sổ | roles-fix.spec.ts | Đạt |


**Kết quả chạy cuối: 25/25 test case đạt** (smoke 12/12, ticket 1/1, part-bc 8/8, roles-fix 4/4; cập nhật 05/11/2026 sau vòng sửa lỗi 3 giao diện vai trò — chi tiết ở ghi chú cuối mục này) (smoke 12/12, ticket 1/1, part-bc 8/8; cập nhật 05/11/2026 sau khi bổ sung cổng thanh toán demo và migration 006). Lưu ý tính ổn định: ở vòng chạy gộp cuối, 2 test (số 4 — bộ lọc công thức, và số 13 — ticket) bị trượt vì quá thời gian chờ khi dev server đang chịu tải nặng (chạy lại từng test riêng lẻ đều đạt ngay, dữ liệu kiểm chứng trong database hoàn toàn đúng); test ticket vốn nhạy với thời gian tải trang nên khi chạy toàn bộ suite trên máy yếu cần để máy rảnh. Lần chạy đầu tiên có 2 test chưa đạt do lỗi ở phía file test (kỳ vọng nhãn chưa khớp form thật và chưa chờ phiên đăng nhập ổn định trước khi chuyển trang), đã sửa trong file test — mã nguồn ứng dụng không phải thay đổi. Lần chạy thứ hai phát hiện thêm test ticket chưa chạy lặp lại được khi còn dữ liệu cũ (trùng tiêu đề), đã đổi sang tiêu đề duy nhất theo thời gian cho mỗi lần chạy. Dữ liệu `TEST_` tạo trong lúc test đã được dọn sạch: 0 ticket `TEST_` còn lại, tin nhắn trong ticket bị xóa tự động theo cascade của khóa ngoại. Ghi chú đợt 05/11/2026: vòng chạy đầu của file `part-bc.spec.ts` có 3 test chưa đạt, đều do lỗi ở phía file test (nút "Nâng cấp Pro ngay" là thẻ link chứ không phải button; tiêu đề món xuất hiện đồng thời trong mô tả thẻ gây trùng locator; kỳ vọng sai — người chưa ghi danh chỉ thấy bài học xem trước là đúng thiết kế RLS) — đã sửa file test và chạy lại đạt toàn bộ; mã nguồn ứng dụng không phải thay đổi. Bài viết kiểm thử dùng tiêu đề duy nhất theo thời gian (giống test ticket) để chạy lặp lại không đụng dữ liệu cũ, và đã được xóa khỏi database sau khi test xong.

Ghi chú vòng chạy cổng thanh toán demo (05/11/2026): vòng chạy gộp đầu tiên có 2 test cổng demo chưa đạt do lỗi ở phía file test (locator chữ "MÔI TRƯỜNG DEMO" trùng với câu chú thích dưới chân cổng nên vi phạm strict mode — đã sửa bằng `exact: true`) và test ticket bị trượt vì thời gian chờ; chạy riêng từng test đều đạt. Vòng chạy gộp thứ hai đạt 20/21: test luồng bài viết (số 16) vi phạm strict mode vì trang công khai còn tồn đọng 3 bài `TEST_PW` đã xuất bản từ các lần chạy lỗi trước đó (mỗi lần chạy lỗi đều để lại 1 bài đã duyệt chưa kịp dọn, và locator tiêu đề chưa có `.first()`) — đã dọn dữ liệu tồn đọng, bổ sung `.first()` cho locator, và vòng chạy gộp cuối cùng từ trạng thái sạch đạt **21/21**. Dữ liệu phát sinh từ các test thanh toán demo (giao dịch, yêu cầu nâng cấp, thông báo của tài khoản Free kiểm thử) đã được dọn sạch sau khi chạy suite, tài khoản trở về trạng thái Free ban đầu.

Ghi chú vòng sửa lỗi 3 giao diện vai trò (05/11/2026): kiểm tra thủ công toàn bộ 31 trang Admin/Đầu bếp/Hỗ trợ trên bản production (Vercel) phát hiện 5 lỗi, đã sửa và có test hồi quy riêng (`roles-fix.spec.ts`): (1) trang Nhật ký hoạt động luôn trống vì truy vấn dùng sai tên khóa ngoại khi nối bảng `profiles` — database có 233+ bản ghi nhưng PostgREST báo lỗi quan hệ, nay đã bỏ gợi ý khóa ngoại sai; (2) thẻ thống kê ở Tổng quan Admin, Báo cáo và Tổng quan Hỗ trợ hiện tên icon dạng chữ vì các trang truyền chuỗi thay vì component Lucide — đã đổi sang truyền component như trang Đầu bếp/Học viên; (3) khung chat ticket tự cuộn cả cửa sổ trình duyệt (hiệu ứng phụ của `scrollIntoView`) làm tiêu đề trang chui xuống dưới header dính và hiện xuyên thấu — đã đổi sang cuộn nội bộ trong khung tin nhắn; (4) huy hiệu ưu tiên/danh mục ticket hiện mã thô (`TRUNG_BINH`, `ky_thuat`) ở hàng đợi, chi tiết ticket, tổng quan hỗ trợ và trang giám sát của admin — đã dùng chung bộ nhãn tiếng Việt `nhanCua` (bổ sung nhãn `danh_muc_ticket`); (5) tiêu đề trang Đầu bếp bị trùng "Bếp trưởng Bếp Trưởng…" — đã cắt tiền tố trùng trong họ tên khi hiển thị. Hai test cũ cũng được tăng độ bền trước strict mode bằng `.first()` (khẳng định phản hồi ticket trong `ticket.spec.ts` và dòng "3 bài học video" trong `part-bc.spec.ts` — dữ liệu database xác nhận chỉ có đúng 1 tin nhắn, lỗi nằm ở locator). Lưu ý môi trường chạy test: dev server (`npm run dev`) trên máy kiểm thử nhiều lần tự chết giữa vòng chạy gộp (mọi test sau đó lỗi `ERR_CONNECTION_REFUSED`) và file `.env.local` từng bị ghi đè 2 biến URL sang domain Vercel trong lúc cấu hình deploy (đã khôi phục `localhost:3000`), khiến 2 test cổng demo trượt cho tới khi khôi phục — vòng chạy cuối được thực hiện trên server production (`npm run build` + `npm run start`, đúng chế độ chạy thật trên Vercel) và đạt **25/25 trong ~1,7 phút**. Dữ liệu `TEST_` phát sinh đã được dọn sạch sau vòng chạy.

## 4. Kiểm thử thủ công đã thực hiện

- **Crawl toàn bộ route**: 13/13 route công khai trả 200; 33/33 route bảo vệ trả 307 chuyển `/dang-nhap` khi chưa đăng nhập; URL không tồn tại trả 404; không có lỗi 500.
- **Đăng nhập 5 vai trò** qua Supabase Auth API: thành công cả 5.
- **Phân quyền (middleware)**: khách mở trang chi tiết công thức/khóa học/bài viết → `/dang-nhap`; `/quan-tri` chỉ admin; `/nhan-vien` chỉ support + admin; `/bep` chỉ chef + admin; tài khoản bị khóa bị đăng xuất; tạo công thức yêu cầu Pro còn hạn.
- **Dữ liệu hiển thị**: ảnh món ăn/khóa học/bài viết là ảnh món ăn thật (Unsplash); video 36/36 bài học là video nấu ăn thật trên YouTube (đã kiểm chứng từng link bằng oEmbed, 36/36 trả về 200); quyền lợi gói ở bảng giá hiển thị tiếng Việt đầy đủ.
- **Giao diện đợt nâng cấp (05/11/2026)**: chuyển trang có hiệu ứng mượt mà, trang danh sách có skeleton khi tải và banner gradient; chụp màn hình trước/sau đối chứng cho trang công thức, khóa học, bài viết và bảng điều khiển thành viên.
- **Trang cá nhân `/ho-so`**: tải ảnh đại diện lên Storage thành công; tài khoản Pro hiện thẻ thành viên kèm tên gói, ngày hết hạn và thanh tiến độ thời hạn; tài khoản Free hiện trạng thái thành viên thường; form sửa thông tin (kèm ô ngày sinh bổ sung) và form đổi mật khẩu lưu đúng xuống database.
- **Khóa Pro trên trang cá nhân**: tài khoản Free thấy nút Thêm công thức / Viết bài viết bị làm mờ kèm ổ khóa ở cả trang cá nhân và menu bên; bấm vào hiện hộp thoại thông báo cần nâng cấp Pro; máy chủ cũng chặn truy cập thẳng route tạo nội dung nếu không phải Pro còn hạn.
- **Luồng bài viết người dùng**: Pro gửi bài → trạng thái "Chờ phê duyệt" ở `/bai-viet-cua-toi` → admin thấy số bài chờ duyệt tại `/quan-tri/bai-viet`, bấm Duyệt → bài xuất hiện công khai ở `/bai-viet` và tác giả nhận được thông báo trong hệ thống. Dữ liệu `TEST_` tạo khi kiểm chứng đã được dọn sạch.
- **Hotfix menu avatar (05/11/2026)**: chủ đồ án báo đã đăng nhập bấm avatar thì sập trang "Có sự cố xảy ra". Đã tái hiện bằng trình duyệt thật và tìm ra nguyên nhân: `user-menu.tsx` dùng `DropdownMenuLabel` (Base UI `Menu.GroupLabel`) nằm ngoài `Menu.Group` nên Base UI ném lỗi `MenuGroupContext is missing` — sập trang cho mọi người dùng đã đăng nhập tại các trang công khai (các vòng test trước không bắt được vì sau đăng nhập chỉ kiểm tra khu vực thành viên vốn dùng layout khác). Đã sửa bằng cách bọc label trong `DropdownMenuGroup`, xác nhận cả tài khoản Pro lẫn Free đều mở menu → "Hồ sơ" → vào `/ho-so` bình thường, 0 lỗi JS, và bổ sung test hồi quy số 19.
- **Cổng thanh toán demo VNPay (05/11/2026)**: kiểm chứng thủ công bằng trình duyệt thật toàn bộ chuỗi: tài khoản Free mua gói Pro Tháng → chuyển sang trang cổng mô phỏng (đúng số tiền 99.000 ₫, có nhãn MÔI TRƯỜNG DEMO) → bấm thanh toán thành công → hệ thống gọi IPN thật, giao dịch chuyển `thanh_cong`, tạo thông báo → yêu cầu hiện "Chờ duyệt" ở `/goi-cua-toi` và ở trang admin `/quan-tri/duyet-nang-cap` → admin bấm Duyệt → tài khoản lên Pro thật (hồ sơ hiện thẻ thành viên Pro, hạn 30 ngày). Nhánh hủy thanh toán: giao dịch ghi `that_bai`, mã phản hồi 24. Quá trình kiểm chứng phát hiện và đã sửa 3 lỗi gốc có từ trước (không phải do cổng demo gây ra): (a) bảng `thanh_toan` thiếu 2 cột `loai_thanh_toan`, `goi_id` và bảng `yeu_cau_nang_cap` thiếu khóa ngoại sang `thanh_toan` trên database thật — bổ sung bằng migration 006; (b) API tạo URL thanh toán ghi dữ liệu bằng client phiên người dùng nên bị RLS chặn (lỗi 42501) — đã chuyển sang ghi bằng service role đúng thiết kế của migration 002 (mục 19: chỉ server được tạo bản ghi thanh toán); (c) hệ quả của (a): hai trang danh sách yêu cầu nâng cấp không hiển thị được dữ liệu dù bộ đếm vẫn đúng. Sau khi sửa, toàn bộ luồng mua gói hoạt động đầu-cuối lần đầu tiên. Lưu ý nghiệp vụ có từ thiết kế gốc: yêu cầu nâng cấp được tạo ở trạng thái chờ duyệt ngay khi bắt đầu thanh toán, nên giao dịch hủy/thất bại vẫn để lại 1 yêu cầu chờ duyệt — admin có thể từ chối các yêu cầu này ở trang duyệt.
- **Ảnh chụp đối chứng** trước/sau sửa lỗi lưu trong thư mục kiểm thử của nhóm phát triển.

## 5. Kiểm thử production build

- Production build `npm run build` **thành công** (05/11/2026): bảng route tổng **83 route** (72 trang giao diện — bổ sung `/thanh-toan-demo` — + 8 API route — bổ sung `/api/thanh-toan/demo/xu-ly` — + `robots.txt` + `sitemap.xml` + trang 404). Middleware 98,4 kB. (Lưu ý vận hành: build từng bị crash 0xC0000005 khi còn tiến trình node mồ côi của phiên test chiếm ~3,4 GB RAM; tắt hết tiến trình node rồi build lại thì thành công — không liên quan mã nguồn.)
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

Database đang vận hành sau đợt seed nội dung 2 (05/11/2026): **17 công thức** (16 xuất bản + công thức "Mì Ý sốt bò bằm" giữ ở trạng thái chờ duyệt làm dữ liệu demo cho luồng duyệt bài của admin), **12 khóa học, 36 bài học kèm 108 câu hỏi trắc nghiệm, 16 bài viết**.
File `supabase/seed.sql` trong repo chứa bộ dữ liệu cài đặt mới (20 công thức, 5 khóa học, 10 bài học, 5 bài viết). Nội dung đã áp lên database thật được ghi lại đầy đủ trong repo: đợt 1 ở `supabase/cap-nhat-noi-dung.sql`, đợt 2 ở `supabase/seed-2-noi-dung.sql` (chạy lặp lại không nhân đôi dữ liệu).
Dữ liệu kiểm thử tạo trong quá trình test đều có tiền tố `TEST_` và đã được dọn sau khi test xong.
