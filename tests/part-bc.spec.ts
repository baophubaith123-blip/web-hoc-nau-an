import { test, expect, type Page } from "@playwright/test";

// Kiểm thử các luồng mới (Part B + Part C): trang cá nhân theo hạng thành viên,
// khóa Pro trên trang cá nhân, luồng bài viết người dùng gửi duyệt, nội dung seed đợt 2.
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

test.describe("Trang cá nhân theo hạng thành viên", () => {
  test("Tài khoản Free: hiện trạng thành viên thường, có ô ngày sinh, nút Pro bị khóa và bật hộp thoại nâng cấp", async ({ page }) => {
    await dangNhap(page, "user2@naungon.vn");
    await page.goto("/ho-so");
    await expect(page.getByText("Bạn đang là thành viên thường")).toBeVisible();
    // Ô nhập ngày sinh (bổ sung ở Part B)
    await expect(page.locator('input[type="date"]')).toBeVisible();
    // Nút "Viết bài viết" ở trạng thái khóa -> bấm vào hiện hộp thoại nâng cấp
    await page.getByRole("button", { name: /Viết bài viết/ }).first().click();
    await expect(page.getByText("Tính năng dành cho thành viên Pro")).toBeVisible();
    await expect(page.getByRole("link", { name: "Nâng cấp Pro ngay" })).toBeVisible();
  });

  test("Tài khoản Pro: thẻ thành viên hiện gói và hạn dùng, nút chức năng không bị khóa", async ({ page }) => {
    await dangNhap(page, "user1@naungon.vn");
    await page.goto("/ho-so");
    await expect(page.getByText(/Bạn đang là thành viên Pro/)).toBeVisible();
    await expect(page.getByText(/Hết hạn/)).toBeVisible();
    await expect(page.getByText(/còn \d+ ngày/)).toBeVisible();
    // Tile "Viết bài viết" là liên kết mở form (không phải nút khóa)
    await expect(page.getByRole("link", { name: /Viết bài viết/ }).first()).toBeVisible();
  });
});

test.describe("Luồng bài viết người dùng gửi duyệt", () => {
  // Tiêu đề duy nhất theo thời gian để chạy lặp lại không đụng dữ liệu cũ (giống ticket.spec.ts)
  const TIEU_DE = `TEST_PW Bài viết kiểm thử luồng gửi duyệt ${Date.now()}`;

  test("Pro gửi bài -> trạng thái chờ duyệt -> Admin duyệt -> bài hiện công khai", async ({ page, browser }) => {
    // 1) Pro viết và gửi bài
    await dangNhap(page, "user1@naungon.vn");
    await page.goto("/tao-bai-viet");
    await page.getByLabel(/Tiêu đề bài viết/).fill(TIEU_DE);
    await page.getByLabel(/Tóm tắt ngắn/).fill("Bài viết tự động dùng để kiểm thử luồng gửi duyệt bài của thành viên Pro.");
    await page.getByLabel(/Chuyên mục/).fill("Mẹo vặt");
    await page.getByLabel(/Ảnh bìa/).fill("https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800");
    await page.getByLabel(/Nội dung bài viết/).fill(
      "Đây là nội dung kiểm thử tự động cho luồng bài viết của thành viên Pro.\n\nBài viết này sẽ được admin duyệt trong cùng phiên kiểm thử và hiển thị công khai nếu luồng hoạt động đúng. Nội dung không dùng cho mục đích nào khác."
    );
    await page.getByRole("button", { name: "Gửi duyệt bài viết" }).click();
    await expect(page).toHaveURL(/\/bai-viet-cua-toi/);
    await expect(page.getByText(TIEU_DE)).toBeVisible();
    await expect(page.getByText("Chờ phê duyệt").first()).toBeVisible();

    // 2) Admin duyệt bài trong ngữ cảnh trình duyệt riêng
    const ctxAdmin = await browser.newContext();
    const trangAdmin = await ctxAdmin.newPage();
    await dangNhap(trangAdmin, "admin@naungon.vn");
    await trangAdmin.goto("/quan-tri/bai-viet");
    const theBai = trangAdmin.locator("div.border.rounded-2xl").filter({ hasText: TIEU_DE }).first();
    await expect(theBai).toBeVisible();
    await theBai.getByRole("button", { name: "Duyệt", exact: true }).click();
    await expect(theBai.getByText(/Xuất bản/)).toBeVisible({ timeout: 20_000 });
    await ctxAdmin.close();

    // 3) Bài hiện trong danh sách công khai cho khách
    const ctxKhach = await browser.newContext();
    const trangKhach = await ctxKhach.newPage();
    await trangKhach.goto("/bai-viet");
    await expect(trangKhach.getByText(TIEU_DE)).toBeVisible();
    await ctxKhach.close();
  });
});

test.describe("Nội dung seed đợt 2 (Part C)", () => {
  test("Danh sách công khai hiện công thức, khóa học và bài viết mới", async ({ page }) => {
    await page.goto("/cong-thuc");
    await expect(page.getByText("Chè ba màu").first()).toBeVisible();
    await expect(page.getByText("Lẩu Thái chua cay").first()).toBeVisible();

    await page.goto("/khoa-hoc");
    await expect(page.getByText("Kỹ thuật chiên xào châu Á").first()).toBeVisible();

    await page.goto("/bai-viet");
    await expect(page.getByText(/Mâm cơm Việt chuẩn vị/)).toBeVisible();
  });

  test("Khóa học mới hiện bài xem trước và mở được trang học bài", async ({ page }) => {
    const loiTrang: string[] = [];
    page.on("pageerror", (e) => loiTrang.push(String(e)));
    await dangNhap(page, "user1@naungon.vn");
    await page.goto("/khoa-hoc/mon-han-tai-nha");
    await expect(page.getByRole("heading", { name: "Món Hàn tại nhà" })).toBeVisible();
    // Khóa học khai báo đủ 3 bài học; người chưa ghi danh chỉ thấy bài xem trước (đúng RLS)
    await expect(page.getByText(/3 bài học video/)).toBeVisible();
    const baiXemTruoc = page.getByRole("link", { name: /Muối kim chi cải thảo giòn cay chuẩn vị/ });
    await expect(baiXemTruoc).toBeVisible();
    await baiXemTruoc.click();
    await expect(page).toHaveURL(/\/hoc-bai\//);
    await expect(page.getByText("Video chưa khả dụng")).toHaveCount(0);
    await expect(page.locator('img[src*="img.youtube.com"]').first()).toBeVisible();
    expect(loiTrang).toEqual([]);
  });
});
