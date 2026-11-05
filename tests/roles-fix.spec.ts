import { test, expect, type Page } from "@playwright/test";

const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

test("Nhật ký hoạt động (admin): hiển thị bản ghi thay vì trạng thái trống", async ({ page }) => {
  await dangNhap(page, "admin@naungon.vn");
  await page.goto("/quan-tri/nhat-ky");
  // Trước khi sửa: truy vấn sai tên khóa ngoại nên trang luôn hiện câu này dù DB có hàng trăm bản ghi
  await expect(page.getByText("Chưa có bản ghi hoạt động nào.")).toHaveCount(0);
  await expect(page.getByText(/Thực hiện bởi/).first()).toBeVisible();
});

test("Thẻ thống kê: vẽ biểu tượng thật, không còn hiện tên icon dạng chữ", async ({ browser }) => {
  const ctxAdmin = await browser.newContext();
  const admin = await ctxAdmin.newPage();
  await dangNhap(admin, "admin@naungon.vn");
  await admin.goto("/quan-tri");
  await expect(admin.locator("body")).not.toContainText("GraduationCap");
  await expect(admin.locator("body")).not.toContainText("CreditCard");
  await admin.goto("/quan-tri/bao-cao");
  await expect(admin.locator("body")).not.toContainText("TrendingUp");
  await ctxAdmin.close();

  const ctxSup = await browser.newContext();
  const sup = await ctxSup.newPage();
  await dangNhap(sup, "support@naungon.vn");
  await sup.goto("/nhan-vien");
  await expect(sup.locator("body")).not.toContainText("AlertTriangle");
  await expect(sup.locator("body")).not.toContainText("CheckCircle2");
  await ctxSup.close();
});

test("Trang đầu bếp: tiêu đề không bị trùng 'Bếp trưởng Bếp Trưởng'", async ({ page }) => {
  await dangNhap(page, "chef@naungon.vn");
  await page.goto("/bep");
  const h1 = await page.locator("h1").first().innerText();
  expect(h1).not.toMatch(/bếp trưởng bếp trưởng/i);
  expect(h1).toContain("Trần Văn Minh");
});

test("Ticket: nhãn ưu tiên/danh mục hiển thị tiếng Việt và trang chi tiết không tự cuộn", async ({ browser }) => {
  const tieuDe = `TEST_ Kiểm tra nhãn ticket ${Date.now()}`;

  const ctxUser = await browser.newContext();
  const user = await ctxUser.newPage();
  await dangNhap(user, "user2@naungon.vn");
  await user.goto("/ho-tro");
  await user.getByRole("button", { name: "Gửi yêu cầu mới" }).click();
  await user.getByLabel(/Tiêu đề/).fill(tieuDe);
  await user.getByLabel(/Mô tả/).fill("Tin nhắn kiểm tra tự động — dữ liệu TEST_ sẽ được dọn sau khi test.");
  await user.getByRole("button", { name: "Gửi yêu cầu", exact: true }).click();
  await expect(user.getByText(tieuDe)).toBeVisible();
  await ctxUser.close();

  const ctxSup = await browser.newContext();
  const sup = await ctxSup.newPage();
  await dangNhap(sup, "support@naungon.vn");
  await sup.goto("/nhan-vien/ticket");
  const dong = sup.locator(".divide-y > div", { hasText: tieuDe });
  await expect(dong).toContainText(/trung bình/i);
  await expect(dong).toContainText("Lỗi kỹ thuật website");
  await expect(dong).not.toContainText("trung_binh");
  await expect(dong).not.toContainText("ky_thuat");

  await sup.getByText(tieuDe).click();
  await expect(sup).toHaveURL(/\/nhan-vien\/ticket\/[0-9a-f-]{36}/);
  await expect(sup.getByText("Lỗi kỹ thuật website")).toBeVisible();
  await expect(sup.locator("body")).not.toContainText("Ky_thuat");
  // Khung chat chỉ cuộn nội bộ: cửa sổ không bị kéo xuống như trước
  await sup.waitForTimeout(2500);
  expect(await sup.evaluate(() => window.scrollY)).toBe(0);
  await ctxSup.close();
});
