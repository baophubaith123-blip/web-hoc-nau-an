// Kiểm chứng nút TRÒN nổi Cokba (yêu cầu của Bảo 14/11/2026): nút tròn
// cố định ~60px kiểu nút nổi Hue Chef, hiện ở MỌI trang người dùng
// (khu công khai + khu người dùng đã đăng nhập), KHÔNG hiện ở 3 khu
// nhân viên (quan-tri đã có ca ở cokba-ui.spec.ts; ở đây thêm bep và
// nhan-vien). Chạy với server ở localhost:3000 (production build).
// Ảnh chụp lưu vào anh-kiem-chung-cokba/ như lệ spec cokba-ui.

import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const THU_MUC_ANH = path.join(process.cwd(), "anh-kiem-chung-cokba");
fs.mkdirSync(THU_MUC_ANH, { recursive: true });

// Tài khoản test ghi trong README của dự án (giống tests/cokba-ui.spec.ts)
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

// Nút phải TRÒN: rộng == cao, trong khoảng 56–64px, có aria-label Cokba.
// QUAN TRỌNG: còn phải nằm TRONG khung nhìn — template gốc của site có
// animation giữ transform (fill-mode both) biến div bọc trang thành
// containing block cho phần tử fixed; nút render trong cây trang sẽ bị
// neo xuống đáy tài liệu (Playwright vẫn báo "visible" + boundingBox
// đúng kích thước dù nút khuất khỏi màn hình). getBoundingClientRect
// là bằng chứng thật: nút fixed đúng nghĩa luôn nằm trọn trong viewport.
async function kiemNutTron(page: Page) {
  const nut = page.getByTestId("nut-noi-cokba");
  await expect(nut).toBeVisible();
  await expect(nut).toHaveAttribute("aria-label", /Cokba/);
  const box = await nut.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs(box!.width - box!.height)).toBeLessThanOrEqual(2);
  expect(box!.width).toBeGreaterThanOrEqual(56);
  expect(box!.width).toBeLessThanOrEqual(64);
  const trongKhungNhin = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="nut-noi-cokba"]');
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return (
      r.top >= 0 &&
      r.left >= 0 &&
      r.bottom <= window.innerHeight + 1 &&
      r.right <= window.innerWidth + 1
    );
  });
  expect(trongKhungNhin).toBe(true);
  return nut;
}

test.describe("Cokba — nút tròn nổi mọi trang người dùng", () => {
  test("a) trang chủ desktop: nút tròn, chụp ảnh", async ({ page }) => {
    await page.goto("/");
    await kiemNutTron(page);
    // Chờ trang nạp xong hẳn (trang chủ stream theo khúc) rồi mới chụp,
    // tránh chụp trúng khung hình skeleton như lần chạy đầu.
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(THU_MUC_ANH, "nut-tron-trang-chu-desktop.png") });
  });

  test("b) trang chủ mobile 390x844: nút tròn, chụp ảnh", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await kiemNutTron(page);
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(THU_MUC_ANH, "nut-tron-trang-chu-mobile.png") });
  });

  test("c+d) khu người dùng: nút tròn ở bảng điều khiển, bấm mở/đóng panel", async ({ page }) => {
    await dangNhap(page, "user1@naungon.vn");
    await expect(page).toHaveURL(/\/bang-dieu-khien/);
    const nut = await kiemNutTron(page);
    await page.screenshot({ path: path.join(THU_MUC_ANH, "nut-tron-bang-dieu-khien.png") });
    await nut.click();
    await expect(page.getByTestId("o-nhap-cokba")).toBeVisible();
    await page.screenshot({ path: path.join(THU_MUC_ANH, "nut-tron-panel-mo-tu-dashboard.png") });
    // Đóng lại bằng chính nút đó (lúc này là icon X) — không có nút thứ hai.
    await nut.click();
    await expect(page.getByTestId("o-nhap-cokba")).toBeHidden();
  });

  test("e) khu đầu bếp /bep: không có nút nổi", async ({ page }) => {
    await dangNhap(page, "chef@naungon.vn");
    await page.goto("/bep");
    await expect(page.getByTestId("nut-noi-cokba")).toHaveCount(0);
  });

  test("f) khu hỗ trợ /nhan-vien: không có nút nổi", async ({ page }) => {
    await dangNhap(page, "support@naungon.vn");
    await page.goto("/nhan-vien");
    await expect(page.getByTestId("nut-noi-cokba")).toHaveCount(0);
  });
});
