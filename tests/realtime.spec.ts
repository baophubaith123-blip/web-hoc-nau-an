import { test, expect, type Page } from "@playwright/test";

// Kiểm thử Supabase Realtime: danh sách phía staff đang mở tự cập nhật khi
// dữ liệu thay đổi ở một phiên trình duyệt khác, KHÔNG cần tải lại trang.
// - Ticket: ticket_ho_tro đã nằm trong publication supabase_realtime từ
//   migration 002, RLS cho support/admin xem tất cả.
// - Duyệt Pro: cần migration 007 (đưa yeu_cau_nang_cap + thanh_toan vào
//   publication) đã chạy trên Supabase thì test này mới nhận được event.
// Dữ liệu TEST_RT phát sinh được dọn sau khi chạy suite như các spec khác.
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";
const DAU = Date.now();
const TIEU_DE_TICKET = `TEST_RT Ticket realtime ${DAU}`;
const TEN_PRO = `TEST_RT Pro ${DAU}`;
const EMAIL_PRO = `test-rt-pro-${DAU}@hocnauan.vn`;

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

test("Realtime ticket: học viên tạo ticket -> hàng đợi hỗ trợ đang mở tự hiện ticket mới", async ({ browser }) => {
  // 1) Nhân viên hỗ trợ mở sẵn danh sách ticket và giữ nguyên trang
  const ctxSup = await browser.newContext();
  const sup = await ctxSup.newPage();
  await dangNhap(sup, "support@naungon.vn");
  await sup.goto("/nhan-vien/ticket");
  await expect(sup.getByRole("heading", { name: "Hàng Đợi Yêu Cầu Hỗ Trợ" })).toBeVisible();
  await expect(sup.getByText(TIEU_DE_TICKET)).toHaveCount(0);

  // 2) Học viên ở phiên khác tạo ticket mới qua flow thật
  const ctxUser = await browser.newContext();
  const user = await ctxUser.newPage();
  await dangNhap(user, "user2@naungon.vn");
  await user.goto("/ho-tro");
  await user.getByRole("button", { name: "Gửi yêu cầu mới" }).click();
  await user.getByLabel(/Tiêu đề/).fill(TIEU_DE_TICKET);
  await user.getByLabel(/Mô tả/).fill("TEST_RT — ticket tạo để kiểm tra realtime, sẽ được dọn sau khi test.");
  await user.getByRole("button", { name: "Gửi yêu cầu", exact: true }).click();
  // Tạo ticket qua server action đôi khi chậm trên máy đồ án — chờ hào phóng
  await expect(user.getByText(TIEU_DE_TICKET).first()).toBeVisible({ timeout: 45_000 });

  // 3) Trang hỗ trợ KHÔNG hề reload — ticket phải tự xuất hiện nhờ Realtime
  //    (.first() vì tiêu đề còn xuất hiện trong toast thông báo realtime)
  await expect(sup.getByText(TIEU_DE_TICKET).first()).toBeVisible({ timeout: 45_000 });

  await ctxUser.close();
  await ctxSup.close();
});

test("Realtime duyệt Pro: tài khoản mới mua Pro Tháng -> trang admin đang mở tự hiện yêu cầu", async ({ browser }) => {
  // 1) Admin mở sẵn trang duyệt nâng cấp (bộ lọc mặc định: Chờ duyệt) và giữ nguyên trang
  const ctxAdmin = await browser.newContext();
  const admin = await ctxAdmin.newPage();
  await dangNhap(admin, "admin@naungon.vn");
  await admin.goto("/quan-tri/duyet-nang-cap");
  await expect(admin.getByRole("heading", { name: /Duyệt yêu cầu nâng cấp Pro/ })).toBeVisible();
  await expect(admin.getByText(TEN_PRO)).toHaveCount(0);

  // 2) Phiên khác: đăng ký tài khoản mới (phương án C — vào thẳng, không
  //    cần xác nhận email) rồi mua Pro Tháng qua cổng demo tới khi có yêu
  //    cầu chờ duyệt, theo đúng luồng ở part-bc.spec.ts
  const ctxUser = await browser.newContext();
  const user = await ctxUser.newPage();
  await user.goto("/dang-ky");
  await user.locator("#ho_ten").fill(TEN_PRO);
  await user.locator("#email").fill(EMAIL_PRO);
  await user.locator("#mat_khau").fill(MAT_KHAU);
  await user.locator("#xac_nhan_mat_khau").fill(MAT_KHAU);
  // Ô đồng ý là checkbox ẩn của Radix — bấm vào nhãn như người dùng thật
  await user.locator("label[for='dong_y']").click();
  await user.getByRole("button", { name: /Đăng ký/ }).click();
  await user.waitForURL((url) => !url.pathname.startsWith("/dang-ky"), { timeout: 30_000 });

  await user.goto("/nang-cap-pro");
  const tomTat = user.locator("h4").first();
  if (!((await tomTat.textContent()) || "").includes("Pro Tháng")) {
    await user.getByRole("button", { name: "Chọn gói", exact: true }).click();
  }
  await expect(tomTat).toContainText("Pro Tháng");
  await user.getByRole("button", { name: "Thanh toán qua VNPay" }).click();
  await expect(user).toHaveURL(/thanh-toan-demo/);
  await user.getByRole("button", { name: "Thanh toán thành công" }).click();
  await expect(user).toHaveURL(/goi-cua-toi/);
  await expect(user.getByText("Chờ duyệt").first()).toBeVisible();

  // 3) Trang admin KHÔNG hề reload — yêu cầu của tài khoản mới phải tự
  //    xuất hiện nhờ Realtime (cần migration 007 đã chạy trên Supabase)
  await expect(admin.getByText(TEN_PRO).first()).toBeVisible({ timeout: 60_000 });

  await ctxUser.close();
  await ctxAdmin.close();
});
