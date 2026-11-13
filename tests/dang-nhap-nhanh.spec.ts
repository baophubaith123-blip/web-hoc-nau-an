import { test, expect } from "@playwright/test";

// Khối "Truy cập nhanh để demo" trên trang đăng nhập: 4 nút bấm vào là vào
// thẳng giao diện của vai trò tương ứng bằng tài khoản mẫu (README).
test.describe("Đăng nhập nhanh để demo", () => {
  test("Hiện đủ 4 nút demo trên trang đăng nhập", async ({ page }) => {
    await page.goto("/dang-nhap");
    await expect(page.getByText("Truy cập nhanh để demo")).toBeVisible();
    await expect(page.getByTestId("nut-demo-admin")).toBeVisible();
    await expect(page.getByTestId("nut-demo-hoc-vien")).toBeVisible();
    await expect(page.getByTestId("nut-demo-dau-bep")).toBeVisible();
    await expect(page.getByTestId("nut-demo-ho-tro")).toBeVisible();
  });

  test("Bấm nút Đầu bếp vào được khu /bep", async ({ page }) => {
    await page.goto("/dang-nhap");
    await page.getByTestId("nut-demo-dau-bep").click();
    await expect(page).toHaveURL(/\/bep$/, { timeout: 30_000 });
  });

  test("Bấm nút Admin vào được khu /quan-tri", async ({ page }) => {
    await page.goto("/dang-nhap");
    await page.getByTestId("nut-demo-admin").click();
    await expect(page).toHaveURL(/\/quan-tri$/, { timeout: 30_000 });
  });

  test("Bấm nút Học viên vào được /bang-dieu-khien", async ({ page }) => {
    await page.goto("/dang-nhap");
    await page.getByTestId("nut-demo-hoc-vien").click();
    await expect(page).toHaveURL(/\/bang-dieu-khien$/, { timeout: 30_000 });
  });

  test("Bấm nút Hỗ trợ vào được khu /nhan-vien", async ({ page }) => {
    await page.goto("/dang-nhap");
    await page.getByTestId("nut-demo-ho-tro").click();
    await expect(page).toHaveURL(/\/nhan-vien$/, { timeout: 30_000 });
  });
});
