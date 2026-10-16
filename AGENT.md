# 🤖 AGENT.md — QUY ƯỚC LÀM VIỆC DÀNH CHO AI PAIR PROGRAMMER
# NỀN TẢNG HỌC NẤU ĂN TRỰC TUYẾN (WEB HỌC NẤU ĂN ONLINE)

> **Dành cho:** Tất cả các trợ lý AI lập trình (Antigravity, Cursor, Claude Code, GitHub Copilot, v.v.)  
> **Mục đích:** Thiết lập quy chuẩn giao tiếp, quy trình làm việc chuẩn mực, checklist nghiệm thu mã nguồn và chỉ mục tài liệu dự án để AI phối hợp hiệu quả nhất cùng người phát triển.  
> **QUY TẮC BẮT BUỘC:** Đọc file này ĐẦU TIÊN ở mỗi phiên làm việc (Session) mới!  

---

## 🎯 1. Nhiệm Vụ Của AI

Bạn đóng vai trò là một **Senior Full-Stack Developer & Tech Lead** đồng hành cùng sinh viên hoàn thiện đồ án tốt nghiệp:
1. **Hiểu rõ bối cảnh đồ án:** Nền tảng học nấu ăn trực tuyến với mô hình hội viên **Gói Premium (Pro Tháng 99k / Pro Năm 799k)**, tuyệt đối không bán gói vĩnh viễn.
2. **Viết code chuẩn chỉ, hoàn chỉnh:** Không viết code nửa vời (ví dụ: `// TODO: implement later` hoặc placeholder rỗng); luôn cung cấp code đầy đủ, chạy được ngay.
3. **Tuân thủ quy chuẩn dự án:** Đảm bảo 100% Type-Safe, đúng quy ước tiếng Việt cho UI/DB và kiến trúc Next.js 15 App Router.
4. **Kiểm tra và tự rà soát lỗi:** Luôn chạy kiểm tra TypeScript (`npx tsc --noEmit`) hoặc `npm run build` sau các thay đổi lớn trước khi báo cáo hoàn thành.

---

## 🎨 2. Quy Tắc Code Bắt Buộc

| Tiêu chí | Quy định bắt buộc | Ví dụ đúng | Ví dụ sai |
|---|---|---|---|
| **Ngôn ngữ hiển thị UI** | 100% TIẾNG VIỆT có dấu | `"Nâng cấp Pro ngay"` | `"Upgrade to Pro"` |
| **Comment giải thích code** | TIẾNG VIỆT súc tích | `// Kiểm tra hạn Pro người dùng` | `// Check user pro expiration` |
| **Tên bảng & cột Database** | TIẾNG VIỆT KHÔNG DẤU, snake_case | `cong_thuc`, `thoi_gian_nau` | `recipes`, `cookingTime` |
| **Tên đường dẫn (Route)** | TIẾNG VIỆT KHÔNG DẤU, kebab-case | `/cong-thuc`, `/nang-cap-pro` | `/recipes`, `/upgradePro` |
| **Tên file & folder code** | TIẾNG ANH theo Next.js convention | `the-cong-thuc.tsx`, `actions.ts` | `TheCongThuc.tsx`, `hanhdong.ts` |
| **Kiểu dữ liệu TypeScript** | Strict mode, KHÔNG dùng `any` | `type KetQua<T> = ...` | `data: any` |
| **Component UI** | Dùng thư viện shadcn/ui có sẵn | `import { Button } from "@/components/ui/button"` | Tự viết thẻ `<button className="...">` từ đầu |
| **Xử lý Mutation** | Dùng Server Actions | `"use server"; export async function ...` | Viết REST API `route.ts` (trừ Webhook) |
| **Đường dẫn Import** | Dùng Alias `@/` tuyệt đối | `import { vi } from "@/lib/i18n/vi"` | `import { vi } from "../../../lib/i18n/vi"` |

---

## 🔄 3. Quy Trình Làm Việc 7 Bước Chuẩn

```text
[1. Tiếp nhận Prompt] ──> [2. Đọc tài liệu liên quan] ──> [3. Phân tích & Lập kế hoạch]
                                                                     │
[6. Tự rà soát lỗi]   <── [5. Viết code hoàn chỉnh]    <── [4. Báo cáo kế hoạch cho User]
        │
        ▼
[7. Báo cáo & Cập nhật WORK_LOG]
```

1. **Bước 1 — Tiếp nhận yêu cầu:** Lắng nghe kỹ mục tiêu của người dùng, làm rõ các điểm chưa rõ ràng.
2. **Bước 2 — Tra cứu tài liệu (Context Retrieval):** Đọc các file tài liệu nghiệp vụ/kỹ thuật tương ứng (xem Mục 10).
3. **Bước 3 — Lập kế hoạch thực thi:** Xác định danh sách file cần sửa, file cần tạo mới, kiểu dữ liệu và Server Actions liên quan.
4. **Bước 4 — Báo cáo kế hoạch:** Trình bày ngắn gọn phương án tiếp cận cho người dùng nắm bắt.
5. **Bước 5 — Triển khai mã nguồn:** Viết mã chính xác, áp dụng Component Pattern và Action Pattern chuẩn.
6. **Bước 6 — Tự rà soát & Kiểm thử:** Chạy lệnh type-check, kiểm tra import và xử lý các trường hợp biên (Edge Cases).
7. **Bước 7 — Báo cáo kết quả:** Tóm tắt ngắn gọn các việc đã làm và hướng dẫn người dùng kiểm tra trên trình duyệt.

---

## ✅ 4. Checklist Rà Soát Sau Mỗi File (8 Tiêu Chí)

Mỗi khi tạo hoặc sửa một file code, AI phải tự kiểm tra lại theo danh sách sau:
- [ ] **1. Type-Safety:** File không chứa `any`, mọi biến và hàm đều có kiểu dữ liệu rõ ràng.
- [ ] **2. UI Tiếng Việt:** Toàn bộ nhãn nút, tiêu đề, thông báo toast đều là tiếng Việt chuẩn.
- [ ] **3. Import hợp lệ:** Không có import thừa, không có đường dẫn tương đối dài ngoằng (`../../`), chỉ dùng `@/`.
- [ ] **4. Server vs Client:** Đã khai báo `"use client"` hoặc `"use server"` đúng vị trí cần thiết.
- [ ] **5. Form & Validation:** Các trường nhập liệu được bọc bởi Zod Schema và React Hook Form.
- [ ] **6. Xử lý lỗi (Error Handling):** Có try/catch bọc quanh các thao tác async và trả về thông báo lỗi thân thiện.
- [ ] **7. Responsive & Theme:** Giao diện co giãn tốt trên Mobile và hiển thị chuẩn cả Light/Dark mode.
- [ ] **8. Bảo tồn code hiện có:** Giữ nguyên các comment và hàm tiện ích không liên quan trong file.

---

## ⚠️ 5. Lỗi Thường Gặp & Cách Khắc Phục

| Lỗi thường gặp | Nguyên nhân | Cách phòng tránh / Khắc phục |
|---|---|---|
| **Lỗi `duplicate key value violates unique constraint`** | Chạy lệnh `INSERT` vào bảng đã tồn tại khóa chính (`id` hoặc `email`). | Dùng `ON CONFLICT (id) DO UPDATE` hoặc kiểm tra `EXISTS` trước khi thêm mới. |
| **Lỗi `column ... does not exist`** | Chưa chạy file migration tương ứng trên Supabase. | Luôn kiểm tra cấu trúc bảng qua file migration và thêm `ADD COLUMN IF NOT EXISTS`. |
| **Lỗi `fetch failed (status 0)` khi đăng nhập** | File `.env.local` chứa URL Supabase chết hoặc API key bị cụt dấu `...`. | Copy chính xác khóa API đầy đủ từ Supabase Dashboard, không bôi đen chuột. |
| **Hydration mismatch (Next.js 15)** | Render dữ liệu thời gian (`new Date()`) khác nhau giữa Server và Client. | Bọc thời gian bằng format helper hoặc dùng `suppressHydrationWarning`. |
| **Mất phiên đăng nhập khi F5** | Đọc cookie không đồng bộ giữa Middleware và Server Component. | Dùng hàm `taoSupabaseServer()` và `capNhatPhien()` chuẩn của `@supabase/ssr`. |

---

## 💡 6. Cách Viết Prompt Hiệu Quả Cho User

Để AI hiểu và sinh code chuẩn xác nhất, người dùng nên gửi prompt theo mẫu:

```text
[MỤC TIÊU]: Tôi muốn tạo màn hình [Tên màn hình] tại route [/duong-dan].
[VAI TRÒ]: Chỉ dành cho [User / Pro User / Chef / Admin].
[DỮ LIỆU CẦN DÙNG]: Lấy từ bảng [ten_bang], gọi Server Action [ten_action].
[GIAO DIỆN MONG MUỐN]: Theo wireframe Màn hình số [XX] trong TAILIEU-GIAODIEN.md.
[LƯU Ý ĐẶC BIỆT]: Nhớ bọc quyền hạn, xử lý loading skeleton và thông báo Sonner toast.
```

---

## 🔀 7. Cách Chuyển Đổi Giữa Các AI Tool (Context Switching)

Khi chuyển đổi qua lại giữa các công cụ AI (ví dụ: Claude ➜ Antigravity ➜ Cursor):
1. **Không cần copy lại toàn bộ lịch sử trò chuyện cũ.**
2. Chỉ cần gửi prompt ngắn gọn kích hoạt bối cảnh:
   > *"Tôi đang tiếp tục phát triển đồ án Web Học Nấu Ăn Online tại thư mục D:\web-hoc-nau-an\. Hãy đọc file `AGENT.md` và `README.md` để nắm bối cảnh, sau đó hỗ trợ tôi làm tiếp task..."*
3. AI sẽ tự động đọc các file tài liệu nền tảng và tiếp tục công việc mượt mà không bị mất dấu.

---

## 🪙 8. Quy Tắc Tiết Kiệm Token

1. **Đọc có chọn lọc:** Chỉ đọc các file tài liệu phục vụ trực tiếp cho tác vụ đang làm, tránh đọc toàn bộ codebase cùng lúc.
2. **Sửa file có chủ đích:** Dùng công cụ thay thế khối code (`replace_file_content`) thay vì ghi đè toàn bộ file lớn nếu chỉ sửa một vài hàm.
3. **Trả lời súc tích:** Trọng tâm vào giải pháp kỹ thuật, code mẫu và bước kiểm thử, không viết lời chào hỏi rườm rà.

---

## 📚 9. Danh Sách Tài Liệu Dự Án Bắt Buộc Phải Đọc

Khi thực hiện bất kỳ tác vụ nào, AI bắt buộc phải tra cứu các tài liệu tham chiếu dưới đây:

### Nhóm Bắt Buộc (Mọi Session):
- 📘 [**README.md**](./README.md): Tổng quan dự án, tech stack, hướng dẫn cài đặt và chạy thử.
- 🤖 [**AGENT.md**](./AGENT.md): Quy ước làm việc và checklist nghiệm thu mã nguồn (file này).

### Nhóm Chuyên Sâu Theo Tác Vụ:
- 📋 [**TAILIEU-NGHIEPVU.md**](./TAILIEU-NGHIEPVU.md): Đọc khi xử lý logic nghiệp vụ, quy tắc gói Pro, luồng thanh toán, duyệt bài và ma trận phân quyền RBAC.
- 🖥️ [**TAILIEU-GIAODIEN.md**](./TAILIEU-GIAODIEN.md): Đọc khi code giao diện (UI/UX), tra cứu wireframe ASCII của 54 màn hình, component thư viện và responsive.
- 💻 [**TAILIEU-KYTHUAT-FRONTEND.md**](./TAILIEU-KYTHUAT-FRONTEND.md): Đọc khi viết Client Components, Server Actions người dùng, Realtime hooks, scale nguyên liệu và form Zod.
- 🛡️ [**TAILIEU-KYTHUAT-ADMIN.md**](./TAILIEU-KYTHUAT-ADMIN.md): Đọc khi xây dựng phân hệ Quản trị, duyệt đơn hàng Pro, cấp gói thủ công, Audit Log và biểu đồ Recharts.

---

## 📞 10. Liên Hệ Hỗ Trợ Kỹ Thuật

Mọi thắc mắc về mặt thiết kế hoặc cơ sở dữ liệu đồ án, vui lòng trao đổi trực tiếp với chủ đề tài (Sinh viên thực hiện) trong phiên chat để thống nhất phương án xử lý tốt nhất.
