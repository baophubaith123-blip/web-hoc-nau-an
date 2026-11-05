import { test, expect, type Page } from "@playwright/test";

const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";
// Tiêu đề duy nhất cho mỗi lần chạy để test lặp lại được nhiều lần
const TIEU_DE = `TEST_ Kiểm tra luồng hỗ trợ ${Date.now()}`;
const PHAN_HOI = "TEST_ Phản hồi từ nhân viên hỗ trợ.";

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  // Chờ đăng nhập hoàn tất (URL rời khỏi trang đăng nhập) để tránh đua phiên
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

test("Ticket hỗ trợ: user tạo, nhân viên trả lời, user thấy phản hồi", async ({ browser }) => {
  // 1) Học viên Free tạo ticket mới
  const ctxUser = await browser.newContext();
  const user = await ctxUser.newPage();
  await dangNhap(user, "user2@naungon.vn");
  await expect(user).toHaveURL(/\/bang-dieu-khien/);
  await user.goto("/ho-tro");
  await user.getByRole("button", { name: "Gửi yêu cầu mới" }).click();
  await user.getByLabel(/Tiêu đề/).fill(TIEU_DE);
  await user.getByLabel(/Mô tả/).fill("Tin nhắn kiểm tra tự động — dữ liệu TEST_ sẽ được dọn sau khi test.");
  await user.getByRole("button", { name: "Gửi yêu cầu", exact: true }).click();
  await expect(user.getByText(TIEU_DE)).toBeVisible();
  await user.getByText(TIEU_DE).click();
  await expect(user).toHaveURL(/\/ho-tro\/[0-9a-f-]{36}/);

  // 2) Nhân viên hỗ trợ mở ticket và trả lời
  const ctxSup = await browser.newContext();
  const sup = await ctxSup.newPage();
  await dangNhap(sup, "support@naungon.vn");
  await expect(sup).toHaveURL(/\/nhan-vien/);
  await sup.goto("/nhan-vien/ticket");
  try { await sup.waitForLoadState("networkidle", { timeout: 15_000 }); } catch { /* bỏ qua nếu quá thời gian */ }
  await sup.getByText(TIEU_DE).click();
  try { await sup.waitForLoadState("networkidle", { timeout: 15_000 }); } catch { /* bỏ qua nếu quá thời gian */ }
  const oNhap = sup.getByPlaceholder(/Nhập tin nhắn phản hồi/);
  await oNhap.fill(PHAN_HOI);
  await oNhap.press("Enter");
  await expect(sup.getByText(PHAN_HOI).first()).toBeVisible();

  // 3) Học viên tải lại trang và thấy phản hồi
  await user.reload();
  await expect(user.getByText(PHAN_HOI).first()).toBeVisible();

  await ctxUser.close();
  await ctxSup.close();
});
