import { test, expect, type Page } from "@playwright/test";

// ĐỢT 1 (15/11/2026) — CRUD khóa học + bài học theo vai trò.
// Mọi dữ liệu tạo ra đều có tiền tố TEST_DOT1_ để đợt dọn cuối xóa khỏi DB
// (khóa học không có nút xóa/lưu trữ trên giao diện — xem báo cáo đợt 1).
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";
const DAU = Date.now();

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

async function dienFormKhoaHoc(page: Page, tieuDe: string, moTa: string) {
  await page.locator("#tieu_de").fill(tieuDe);
  await page.locator("#mo_ta").fill(moTa);
}

function theKhoaHoc(page: Page, tieuDe: string) {
  return page.locator("div.border.rounded-2xl").filter({ hasText: tieuDe }).first();
}

test.describe("Đợt 1 — CRUD khóa học (đầu bếp + admin)", () => {
  test("Đầu bếp: tạo nháp -> sửa -> gửi duyệt -> admin duyệt -> hiện công khai", async ({ page, browser }) => {
    const tieuDeGoc = `TEST_DOT1_ Khóa bếp cơ bản ${DAU}`;
    const tieuDeMoi = `TEST_DOT1_ Khóa bếp cơ bản (đã sửa) ${DAU}`;

    // 1) Đầu bếp tạo khóa học miễn phí, lưu nháp
    await dangNhap(page, "chef@naungon.vn");
    await page.goto("/bep/khoa-hoc/moi");
    await expect(page.getByRole("heading", { name: "Tạo khóa học mới" })).toBeVisible();
    await dienFormKhoaHoc(page, tieuDeGoc, "Khóa học kiểm thử đợt 1: tạo, sửa, gửi duyệt khóa học của đầu bếp.");
    await page.getByRole("button", { name: "Lưu nháp" }).click();
    await expect(page).toHaveURL(/\/bep\/khoa-hoc$/);
    await expect(theKhoaHoc(page, tieuDeGoc).getByText("Bản nháp")).toBeVisible();

    // 2) Sửa tiêu đề rồi lưu nháp lại
    await theKhoaHoc(page, tieuDeGoc).getByRole("link", { name: "Sửa" }).click();
    await expect(page.getByRole("heading", { name: "Chỉnh sửa khóa học" })).toBeVisible();
    await page.locator("#tieu_de").fill(tieuDeMoi);
    await page.getByRole("button", { name: "Lưu nháp" }).click();
    await expect(page).toHaveURL(/\/bep\/khoa-hoc$/);
    await expect(page.getByText(tieuDeMoi).first()).toBeVisible();
    await expect(page.getByText(tieuDeGoc, { exact: true })).toHaveCount(0);

    // 3) Gửi phê duyệt -> trạng thái chờ phê duyệt
    await theKhoaHoc(page, tieuDeMoi).getByRole("link", { name: "Sửa" }).click();
    await page.getByRole("button", { name: "Gửi phê duyệt" }).click();
    await expect(page).toHaveURL(/\/bep\/khoa-hoc$/);
    await expect(theKhoaHoc(page, tieuDeMoi).getByText("Chờ phê duyệt")).toBeVisible();

    // 4) Admin duyệt -> đã xuất bản (kiểm chứng chéo bằng giao diện admin)
    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/khoa-hoc");
    const theAdmin = theKhoaHoc(admin, tieuDeMoi);
    await expect(theAdmin.getByText("Chờ phê duyệt")).toBeVisible();
    await theAdmin.getByRole("button", { name: "Duyệt", exact: true }).click();
    await expect(theAdmin.getByText("Đã xuất bản")).toBeVisible({ timeout: 20_000 });
    await ctxAdmin.close();

    // 5) Khóa học hiện ở danh sách công khai
    await page.goto("/khoa-hoc");
    await expect(page.getByText(tieuDeMoi).first()).toBeVisible();
  });

  test("Đầu bếp: thêm bài học có quiz -> sửa bài học -> xóa bài học (khóa trả phí)", async ({ page }) => {
    const tieuDeKhoa = `TEST_DOT1_ Khóa có quiz ${DAU}`;
    const tieuDeBai = `TEST_DOT1_ Bài học có quiz ${DAU}`;
    const tieuDeBaiMoi = `TEST_DOT1_ Bài học có quiz (đã sửa) ${DAU}`;

    await dangNhap(page, "chef@naungon.vn");
    await page.goto("/bep/khoa-hoc/moi");
    await dienFormKhoaHoc(page, tieuDeKhoa, "Khóa học kiểm thử đợt 1: bài học kèm câu hỏi trắc nghiệm.");
    // Tắt "miễn phí" (switch đầu tiên) để mở ô giá + quyền lợi bài tập
    await page.getByRole("switch").nth(0).click();
    await page.locator("#gia").fill("99000");
    // Bật "Bài tập trắc nghiệm" (switch thứ 4: chứng chỉ, tài liệu, BÀI TẬP, hỗ trợ 1-1)
    await page.getByRole("switch").nth(3).click();
    await page.getByRole("button", { name: "Lưu nháp" }).click();
    await expect(page).toHaveURL(/\/bep\/khoa-hoc$/);

    // Vào trang bài học của khóa vừa tạo
    await theKhoaHoc(page, tieuDeKhoa).getByRole("link", { name: /Bài học/ }).click();
    await expect(page).toHaveURL(/\/bep\/khoa-hoc\/[0-9a-f-]{36}\/bai-hoc/);
    await page.getByRole("button", { name: "Thêm bài học mới" }).click();
    await expect(page.getByText("Thêm bài học mới", { exact: true }).last()).toBeVisible();
    await page.locator("#tieu_de_bh").fill(tieuDeBai);
    // Phải điền cả mô tả: để trống mô tả là lỗi đã biết D1-P1-02 (client gửi
    // undefined, baiHocSchema yêu cầu chuỗi) — đợt 2 sửa xong sẽ bỏ ghi chú này.
    await page.locator("#mo_ta_bh").fill("Bài học kiểm thử đợt 1 kèm câu hỏi trắc nghiệm.");
    await page.locator("#video_url_bh").fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    // Thêm 1 câu hỏi trắc nghiệm (chỉ hiện khi khóa bật bài tập)
    await page.getByRole("button", { name: "Thêm câu hỏi" }).click();
    await page.getByPlaceholder("Nhập nội dung câu hỏi...").fill("TEST_DOT1_ Nhiệt độ chiên gà rán lần 1 là bao nhiêu?");
    await page.getByPlaceholder("Lựa chọn 1").fill("150 độ C");
    await page.getByPlaceholder("Lựa chọn 2").fill("170 độ C");
    await page.getByPlaceholder("Lựa chọn 3").fill("200 độ C");
    await page.getByPlaceholder("Lựa chọn 4").fill("120 độ C");
    await page.getByRole("button", { name: "Thêm bài học", exact: true }).click();
    const dongBai = page.locator("div.border.rounded-xl").filter({ hasText: tieuDeBai }).first();
    await expect(dongBai).toBeVisible();
    await expect(dongBai.getByText(/1 câu trắc nghiệm/)).toBeVisible();

    // Sửa tiêu đề bài học
    await dongBai.getByRole("button", { name: "Sửa" }).click();
    await page.locator("#tieu_de_bh").fill(tieuDeBaiMoi);
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText(tieuDeBaiMoi).first()).toBeVisible();

    // Xóa bài học (hộp confirm của trình duyệt) -> biến mất khỏi danh sách
    page.once("dialog", (d) => d.accept());
    const dongMoi = page.locator("div.border.rounded-xl").filter({ hasText: tieuDeBaiMoi }).first();
    await dongMoi.locator("button").last().click();
    await expect(page.getByText(tieuDeBaiMoi)).toHaveCount(0, { timeout: 20_000 });
  });

  test("Admin: tạo khóa học -> xuất bản ngay -> hiện công khai, admin sửa được", async ({ page }) => {
    const tieuDe = `TEST_DOT1_ Khóa admin tạo ${DAU}`;
    const tieuDeMoi = `TEST_DOT1_ Khóa admin tạo (đã sửa) ${DAU}`;

    await dangNhap(page, "admin@naungon.vn");
    await page.goto("/quan-tri/khoa-hoc/moi");
    await expect(page.getByRole("heading", { name: "Tạo khóa học mới" })).toBeVisible();
    await dienFormKhoaHoc(page, tieuDe, "Khóa học kiểm thử đợt 1 do admin tạo và xuất bản ngay.");
    await page.getByRole("button", { name: "Xuất bản ngay" }).click();
    await expect(page).toHaveURL(/\/quan-tri\/khoa-hoc$/);
    await expect(theKhoaHoc(page, tieuDe).getByText("Đã xuất bản")).toBeVisible();

    // Admin sửa tiêu đề
    await theKhoaHoc(page, tieuDe).getByRole("link", { name: "Sửa" }).click();
    await page.locator("#tieu_de").fill(tieuDeMoi);
    await page.getByRole("button", { name: "Lưu nháp" }).click();
    await expect(page).toHaveURL(/\/quan-tri\/khoa-hoc$/);
    await expect(page.getByText(tieuDeMoi).first()).toBeVisible();

    // Hiện công khai với tiêu đề mới
    await page.goto("/khoa-hoc");
    await expect(page.getByText(tieuDeMoi).first()).toBeVisible();
  });
});
