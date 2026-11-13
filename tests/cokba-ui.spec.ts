// Kiểm chứng Đợt 3 — giao diện Cokba (nút nổi, panel, trang /tro-ly,
// nhật ký admin). Chạy với production build đang chạy ở localhost:3000:
//   npx playwright test tests/cokba-ui.spec.ts --reporter=list
// Ảnh chụp lưu vào test-results/cokba/ để mang về báo cáo.

import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// NGOÀI test-results vì Playwright tự xóa thư mục đó mỗi lần chạy.
const THU_MUC_ANH = path.join(process.cwd(), "anh-kiem-chung-cokba");
fs.mkdirSync(THU_MUC_ANH, { recursive: true });

// Tài khoản test ghi trong README của dự án (giống tests/smoke.spec.ts)
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), {
    timeout: 30_000,
  });
}

async function moPanel(page: Page) {
  const nut = page.getByTestId("nut-noi-cokba");
  await expect(nut).toBeVisible();
  await nut.click();
  await expect(page.getByTestId("o-nhap-cokba")).toBeVisible();
}

async function hoi(page: Page, cau: string) {
  await page.getByTestId("o-nhap-cokba").fill(cau);
  await page.getByTestId("nut-gui-cokba").click();
}

test.describe("Cokba Đợt 3", () => {
  test("a+b) trang chủ có nút nổi, mở panel, hỏi món cà chua ra thẻ món", async ({ page }) => {
    await page.goto("/");
    await moPanel(page);
    await hoi(page, "Món nào làm bằng cà chua?");
    await expect(page.getByTestId("the-cokba").first()).toBeVisible({ timeout: 30_000 });
    expect(await page.getByTestId("the-cokba").count()).toBeGreaterThan(0);
    await page.screenshot({ path: path.join(THU_MUC_ANH, "cokba-panel-desktop.png") });
  });

  test("c) intent có-gì-nấu-nấy: hiện khối gia vị, xác nhận xong ra thẻ có % khớp", async ({ page }) => {
    await page.goto("/");
    await moPanel(page);
    await hoi(page, "Mình có trứng, cà chua thì nấu được gì?");
    await expect(page.getByTestId("khoi-gia-vi")).toBeVisible({ timeout: 30_000 });
    await page.getByRole("button", { name: /Đủ rồi, gợi ý món cho mình/ }).click();
    await expect(page.getByTestId("the-cokba").first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/Khớp \d+%/).first()).toBeVisible();
  });

  test("d) calo: chưa biết số người thì hỏi lại, gõ 3 người ra tổng + lẻ", async ({ page }) => {
    await page.goto("/");
    await moPanel(page);
    // Phở bò Hà Nội: dữ liệu thật 450 calo cho 4 người -> 113/người, 3 người = 339
    await hoi(page, "Món phở bò Hà Nội bao nhiêu calo?");
    await expect(page.getByText(/mấy người/i).first()).toBeVisible({ timeout: 30_000 });
    await hoi(page, "3 người");
    await expect(page.getByText(/339/).first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/calo\/người/).first()).toBeVisible();
  });

  test("e) trang /tro-ly mở được và hỏi được", async ({ page }) => {
    await page.goto("/tro-ly");
    await expect(page.getByRole("heading", { name: /Cokba/ })).toBeVisible();
    await expect(page.getByTestId("nut-noi-cokba")).toHaveCount(0);
    await hoi(page, "Khóa đầu tiên cho người mới là gì?");
    await expect(page.getByTestId("the-cokba").first()).toBeVisible({ timeout: 30_000 });
  });

  test("g) mobile 390x844: panel toàn màn hình, không tràn ngang", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await moPanel(page);
    const panel = page.getByTestId("panel-cokba");
    const box = await panel.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.width)).toBe(390);
    const tranNgang = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(tranNgang).toBe(false);
    await page.screenshot({ path: path.join(THU_MUC_ANH, "cokba-panel-mobile.png") });
  });

  test("f+h) khu staff không có nút nổi; trang nhật ký admin không crash", async ({ page }) => {
    // Chưa đăng nhập vào /quan-tri -> bị đẩy sang đăng nhập (vẫn thuộc khu công khai
    // nên nút nổi được phép có ở trang đăng nhập), kiểm chính: vào thẳng một route
    // staff sau khi đăng nhập admin thì nút nổi KHÔNG xuất hiện.
    await dangNhap(page, "admin@naungon.vn");
    await expect(page).toHaveURL(/\/quan-tri/);
    await page.goto("/quan-tri/nhat-ky-cokba");
    await expect(page.getByTestId("nut-noi-cokba")).toHaveCount(0);
    await expect(
      page.getByText(/Nhật ký Cokba/).first()
    ).toBeVisible({ timeout: 30_000 });
    // Migration 008 đã được chạy vào DB (14/11) -> banner "chưa được kích
    // hoạt" phải VẮNG mặt và trang hiện danh sách nhật ký thật.
    await expect(page.getByText(/chưa được kích hoạt/)).toHaveCount(0);
    await page.screenshot({ path: path.join(THU_MUC_ANH, "cokba-nhat-ky-admin.png") });
  });
});
