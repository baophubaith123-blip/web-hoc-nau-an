import { test, expect, type Page } from "@playwright/test";

// Tài khoản test ghi trong README của dự án
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  // Chờ đăng nhập hoàn tất (URL rời khỏi trang đăng nhập) để tránh đua phiên
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

test.describe("Trang công khai", () => {
  test("Trang chủ tải được, có tiêu đề và menu chính", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Học Nấu Ăn/);
    await expect(page.getByRole("link", { name: "Công thức" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Khóa học" }).first()).toBeVisible();
  });

  test("Khách chưa đăng nhập bị chuyển về trang đăng nhập khi mở chi tiết", async ({ page }) => {
    await page.goto("/cong-thuc/banh-xeo-mien-tay");
    await expect(page).toHaveURL(/\/dang-nhap/);
  });

  test("Bảng giá hiện nhãn quyền lợi tiếng Việt, không còn mã thô", async ({ page }) => {
    await page.goto("/bang-gia");
    await expect(page.getByText("Xem video HD 1080p sắc nét").first()).toBeVisible();
    await expect(page.getByText("xem_video_hd")).toHaveCount(0);
  });

  test("Bộ lọc trang công thức hiện nhãn tiếng Việt", async ({ page }) => {
    await page.goto("/cong-thuc");
    await expect(page.getByText("Tất cả danh mục")).toBeVisible();
    await expect(page.getByText("Mọi độ khó")).toBeVisible();
    await expect(page.getByText("tat_ca", { exact: true })).toHaveCount(0);
  });
});

test.describe("Đăng nhập theo vai trò", () => {
  test("Admin vào được trang quản trị", async ({ page }) => {
    await dangNhap(page, "admin@naungon.vn");
    await expect(page).toHaveURL(/\/quan-tri/);
    await expect(page.getByRole("heading", { name: /Hệ Thống Quản Trị/ })).toBeVisible();
  });

  test("Đầu bếp vào được khu vực bếp", async ({ page }) => {
    await dangNhap(page, "chef@naungon.vn");
    await expect(page).toHaveURL(/\/bep/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("Nhân viên vào được khu vực hỗ trợ", async ({ page }) => {
    await dangNhap(page, "support@naungon.vn");
    await expect(page).toHaveURL(/\/nhan-vien/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("Học viên vào được bảng điều khiển", async ({ page }) => {
    await dangNhap(page, "user1@naungon.vn");
    await expect(page).toHaveURL(/\/bang-dieu-khien/);
    await expect(page.locator("h1").first()).toBeVisible();
  });
});

test.describe("Phân quyền gói Pro", () => {
  test("Tài khoản Free bị chuyển sang trang nâng cấp khi tạo công thức", async ({ page }) => {
    await dangNhap(page, "user2@naungon.vn");
    await expect(page).toHaveURL(/\/bang-dieu-khien/);
    await page.goto("/tao-cong-thuc");
    await expect(page).toHaveURL(/\/nang-cap-pro/);
  });

  test("Tài khoản Pro mở được form tạo công thức đầy đủ", async ({ page }) => {
    await dangNhap(page, "user1@naungon.vn");
    await expect(page).toHaveURL(/\/bang-dieu-khien/);
    await page.goto("/tao-cong-thuc");
    await expect(page.getByRole("heading", { name: "Tạo công thức món ăn mới" })).toBeVisible();
    await expect(page.getByLabel("Calories (kcal)")).toBeVisible();
    await expect(page.getByText("Danh mục món ăn")).toBeVisible();
  });

  test("Admin mở được trang duyệt nâng cấp Pro", async ({ page }) => {
    await dangNhap(page, "admin@naungon.vn");
    await expect(page).toHaveURL(/\/quan-tri/);
    await page.goto("/quan-tri/duyet-nang-cap");
    await expect(page.getByRole("heading", { name: "Duyệt yêu cầu nâng cấp Pro" })).toBeVisible();
  });
});
