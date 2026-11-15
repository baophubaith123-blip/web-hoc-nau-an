import { test, expect, type Page } from "@playwright/test";

// ĐỢT 1 (15/11/2026) — CRUD bài viết (Pro + admin), danh mục, gói Pro.
// Bài viết/danh mục/gói TEST_DOT1_ được tự dọn ngay trong spec bằng chính
// thao tác xóa trên giao diện (bài viết: vào thùng rác rồi xóa vĩnh viễn
// trong thùng rác — cơ chế đợt 3; gói: xóa cứng khi chưa có người mua;
// danh mục: xóa cứng).
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";
const DAU = Date.now();

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

async function dienFormBaiViet(page: Page, tieuDe: string) {
  await page.getByLabel(/Tiêu đề bài viết/).fill(tieuDe);
  await page.getByLabel(/Tóm tắt ngắn/).fill("Bài viết kiểm thử tự động đợt 1 — sẽ được dọn sau khi kiểm tra.");
  await page.getByLabel(/Chuyên mục/).fill("Mẹo vặt");
  await page.getByLabel(/Ảnh bìa/).fill("https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800");
  await page
    .getByLabel(/Nội dung bài viết/)
    .fill(
      "Đây là nội dung kiểm thử tự động đợt 1 cho luồng bài viết.\n\nBài viết đi qua đủ vòng đời: lưu nháp, sửa, gửi duyệt, admin duyệt, xuất bản công khai rồi xóa cứng ở khu quản trị."
    );
}

test.describe("Đợt 1 — CRUD bài viết", () => {
  test("Pro: lưu nháp -> sửa -> gửi duyệt -> admin duyệt -> công khai -> admin xóa cứng", async ({ page, browser }) => {
    const tieuDeNhap = `TEST_DOT1_ Bài nháp ${DAU}`;
    const tieuDeMoi = `TEST_DOT1_ Bài đã sửa và duyệt ${DAU}`;

    // 1) Pro lưu bản nháp
    await dangNhap(page, "user1@naungon.vn");
    await page.goto("/tao-bai-viet");
    await dienFormBaiViet(page, tieuDeNhap);
    await page.getByRole("button", { name: "Lưu bản nháp" }).click();
    await expect(page).toHaveURL(/\/bai-viet-cua-toi/);
    const theNhap = page.locator("div").filter({ hasText: tieuDeNhap }).last();
    await expect(page.getByText(tieuDeNhap)).toBeVisible();
    await expect(page.getByText("Bản nháp").first()).toBeVisible();

    // 2) Sửa bản nháp rồi gửi duyệt luôn từ form sửa
    const theBai = page.locator("[class*='card'], div").filter({ hasText: tieuDeNhap });
    await page.getByRole("link", { name: "Chỉnh sửa" }).first().click();
    await expect(page).toHaveURL(/\/tao-bai-viet\/[0-9a-f-]{36}\/sua/);
    await page.getByLabel(/Tiêu đề bài viết/).fill(tieuDeMoi);
    await page.getByRole("button", { name: "Gửi duyệt bài viết" }).click();
    await expect(page).toHaveURL(/\/bai-viet-cua-toi/);
    await expect(page.getByText(tieuDeMoi)).toBeVisible();
    await expect(page.getByText("Chờ phê duyệt").first()).toBeVisible();
    void theNhap;
    void theBai;

    // 3) Admin duyệt -> xuất bản
    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/bai-viet");
    const theAdmin = admin.locator("div.border.rounded-2xl").filter({ hasText: tieuDeMoi }).first();
    await expect(theAdmin).toBeVisible();
    await theAdmin.getByRole("button", { name: "Duyệt", exact: true }).click();
    await expect(theAdmin.getByText("Xuất bản")).toBeVisible({ timeout: 20_000 });

    // 4) Bài hiện công khai
    const ctxKhach = await browser.newContext();
    const khach = await ctxKhach.newPage();
    await khach.goto("/bai-viet");
    await expect(khach.getByText(tieuDeMoi).first()).toBeVisible();
    await ctxKhach.close();

    // 5) Admin xóa -> bài vào thùng rác (đợt 3), biến mất khỏi danh sách
    // quản trị và trang công khai
    admin.once("dialog", (d) => d.accept());
    // Nút xóa là nút icon thùng rác trong thẻ bài (khi bài không còn chờ duyệt)
    await theAdmin.locator("button").last().click();
    await expect(admin.getByText(tieuDeMoi)).toHaveCount(0, { timeout: 20_000 });

    // 6) Dọn hẳn: admin xóa vĩnh viễn trong thùng rác quản trị để DB về baseline
    await admin.goto("/quan-tri/thung-rac");
    const dongRac = admin.locator("div.divide-y > div").filter({ hasText: tieuDeMoi }).first();
    await expect(dongRac).toBeVisible();
    await dongRac.getByRole("button", { name: "Xóa vĩnh viễn" }).click();
    const hopThoaiRac = admin.getByRole("dialog");
    await hopThoaiRac.getByRole("button", { name: "Tôi hiểu, tiếp tục" }).click();
    await hopThoaiRac.getByRole("button", { name: "Xóa vĩnh viễn" }).click();
    await expect(hopThoaiRac).toBeHidden({ timeout: 20_000 });
    await ctxAdmin.close();
  });

  test("Pro: tạo nháp rồi tự xóa nháp (vào thùng rác rồi xóa vĩnh viễn)", async ({ page }) => {
    const tieuDe = `TEST_DOT1_ Bài nháp tự xóa ${DAU}`;
    await dangNhap(page, "user1@naungon.vn");
    await page.goto("/tao-bai-viet");
    await dienFormBaiViet(page, tieuDe);
    await page.getByRole("button", { name: "Lưu bản nháp" }).click();
    await expect(page).toHaveURL(/\/bai-viet-cua-toi/);
    await expect(page.getByText(tieuDe)).toBeVisible();

    // Mở hộp thoại xóa từ thẻ bài viết của chính bài đó và xác nhận chuyển
    // vào thùng rác (đợt 3: nhãn nút xác nhận là "Chuyển vào thùng rác",
    // chờ hộp thoại đóng = action đã ghi xong rồi mới đi tiếp)
    const vungBai = page.locator("div.overflow-hidden.shadow-xs").filter({ hasText: tieuDe }).first();
    await vungBai.getByRole("button", { name: "Xóa", exact: true }).click();
    const hopThoai = page.getByRole("dialog");
    await hopThoai.getByRole("button", { name: "Chuyển vào thùng rác" }).click();
    await expect(hopThoai).toBeHidden({ timeout: 20_000 });
    await expect(page.getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });

    // Dọn hẳn: xóa vĩnh viễn trong thùng rác của tôi để DB về baseline
    await page.goto("/thung-rac");
    const dong = page.locator("div.divide-y > div").filter({ hasText: tieuDe }).first();
    await expect(dong).toBeVisible();
    await dong.getByRole("button", { name: "Xóa vĩnh viễn" }).click();
    const hopThoai2 = page.getByRole("dialog");
    await hopThoai2.getByRole("button", { name: "Tôi hiểu, tiếp tục" }).click();
    await hopThoai2.getByRole("button", { name: "Xóa vĩnh viễn" }).click();
    await expect(hopThoai2).toBeHidden({ timeout: 20_000 });
    await expect(page.locator("div.divide-y").getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });
  });
});

test.describe("Đợt 1 — CRUD danh mục (admin)", () => {
  test("Admin: thêm danh mục -> sửa tên -> xóa danh mục", async ({ page }) => {
    const tenGoc = `TEST_DOT1 Danh mục ${DAU}`;
    const tenMoi = `TEST_DOT1 Danh mục đã sửa ${DAU}`;

    await dangNhap(page, "admin@naungon.vn");
    await page.goto("/quan-tri/danh-muc");
    await expect(page.getByRole("heading", { name: "Quản Lý Danh Mục" })).toBeVisible();

    // Thêm (điền đủ cả mô tả + ảnh — xem ca lỗi đã biết bên dưới về trường để trống)
    await page.getByRole("button", { name: "Thêm danh mục mới" }).click();
    await page.locator("#ten_dm").fill(tenGoc);
    await page.locator("#anh_dm").fill("https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800");
    await page.locator("#mo_ta_dm").fill("Danh mục kiểm thử tự động đợt 1.");
    await page.getByRole("button", { name: "Tạo danh mục" }).click();
    await expect(page.getByText(tenGoc)).toBeVisible({ timeout: 20_000 });

    // Sửa: nút Sửa nằm cùng hàng với tên danh mục
    const dong = page.locator("div.p-4").filter({ hasText: tenGoc }).first();
    await dong.getByRole("button", { name: "Sửa" }).click();
    await page.locator("#ten_dm").fill(tenMoi);
    await page.getByRole("button", { name: "Cập nhật" }).click();
    await expect(page.getByText(tenMoi)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(tenGoc, { exact: true })).toHaveCount(0);

    // Xóa (confirm của trình duyệt)
    page.once("dialog", (d) => d.accept());
    const dongMoi = page.locator("div.p-4").filter({ hasText: tenMoi }).first();
    await dongMoi.locator("button").last().click();
    await expect(page.getByText(tenMoi)).toHaveCount(0, { timeout: 20_000 });
  });
});

test.describe("Đợt 2 — L-03: trường tùy chọn để trống", () => {
  // L-03 đã sửa ở đợt 2: helper tùy chọn trong validations/chung.ts chấp
  // nhận undefined/null/chuỗi rỗng nhất quán, nên tạo danh mục chỉ với tên
  // (để trống Mô tả/Ảnh — hai trường giao diện không bắt buộc) phải thành
  // công. Ca này ở đợt 1 là test.fail() ghi nhận lỗi; nay là ca xanh thật
  // và tự dọn danh mục vừa tạo ngay trong ca.
  test("Admin tạo danh mục chỉ với tên + slug (để trống mô tả/ảnh) phải thành công", async ({ page }) => {
    const ten = `TEST_DOT1 Danh mục tối thiểu ${DAU}`;
    await dangNhap(page, "admin@naungon.vn");
    await page.goto("/quan-tri/danh-muc");
    await page.getByRole("button", { name: "Thêm danh mục mới" }).click();
    await page.locator("#ten_dm").fill(ten);
    await page.getByRole("button", { name: "Tạo danh mục" }).click();
    await expect(page.getByText(ten)).toBeVisible({ timeout: 20_000 });

    // Dọn: xóa danh mục vừa tạo (confirm của trình duyệt)
    page.once("dialog", (d) => d.accept());
    const dong = page.locator("div.p-4").filter({ hasText: ten }).first();
    await dong.locator("button").last().click();
    await expect(page.getByText(ten)).toHaveCount(0, { timeout: 20_000 });
  });
});

test.describe("Đợt 1 — CRUD gói Pro (admin)", () => {
  test("Admin: sửa gói Pro Năm (đổi tên -> kiểm chứng -> trả lại tên cũ)", async ({ page }) => {
    const tenTam = `TEST_DOT1_ Pro Năm tạm ${DAU}`;
    await dangNhap(page, "admin@naungon.vn");
    await page.goto("/quan-tri/quan-ly-goi");
    const dong = page.locator("tr").filter({ hasText: "pro_nam" }).first();
    await expect(dong).toBeVisible();
    await dong.getByRole("link", { name: "Sửa" }).click();
    await expect(page).toHaveURL(/\/quan-tri\/quan-ly-goi\/[0-9a-f-]{36}\/sua/);
    await page.locator("#ten").fill(tenTam);
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page).toHaveURL(/\/quan-tri\/quan-ly-goi$/);
    await expect(page.getByText(tenTam)).toBeVisible();

    // Trả lại tên gốc ngay trong cùng ca kiểm tra
    const dong2 = page.locator("tr").filter({ hasText: "pro_nam" }).first();
    await dong2.getByRole("link", { name: "Sửa" }).click();
    await page.locator("#ten").fill("Pro Năm");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page).toHaveURL(/\/quan-tri\/quan-ly-goi$/);
    await expect(page.locator("tr").filter({ hasText: "pro_nam" }).getByText("Pro Năm")).toBeVisible();
  });

  // L-02 ĐÃ ĐÓNG: migration 009 (đợt 3, Bảo đã dán 16/11/2026) bỏ CHECK
  // ma_goi IN ('pro_thang','pro_nam') và nới ràng buộc thoi_han_ngay > 0
  // nên admin tạo được gói với mã mới. Ca này nay chạy THẬT trọn vòng:
  // tạo -> sửa tên -> xóa (chưa có người mua nên xóa cứng) -> hết dấu vết.
  test("Admin tạo gói với mã gói mới phải thành công", async ({ page }) => {
    const maGoi = `test_dot1_${DAU}`;
    const tenSua = `TEST_DOT1_ Gói đã sửa ${DAU}`;
    await dangNhap(page, "admin@naungon.vn");
    await page.goto("/quan-tri/quan-ly-goi/moi");
    await page.locator("#ma_goi").fill(maGoi);
    await page.locator("#ten").fill(`TEST_DOT1_ Gói kiểm thử ${DAU}`);
    await page.locator("#mo_ta").fill("Gói kiểm thử tự động đợt 1 — không bán thật.");
    await page.locator("#thoi_han_ngay").fill("7");
    await page.locator("#gia").fill("123000");
    await page.locator("#quyen_loi").fill("Quyền lợi kiểm thử đợt 1");
    await page.getByRole("button", { name: "Tạo gói mới" }).click();
    await expect(page).toHaveURL(/\/quan-tri\/quan-ly-goi$/, { timeout: 20_000 });
    await expect(page.locator("tr").filter({ hasText: maGoi })).toHaveCount(1);

    // Sửa tên gói mới
    const dong = page.locator("tr").filter({ hasText: maGoi }).first();
    await dong.getByRole("link", { name: "Sửa" }).click();
    await expect(page).toHaveURL(/\/quan-tri\/quan-ly-goi\/[0-9a-f-]{36}\/sua/);
    await page.locator("#ten").fill(tenSua);
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page).toHaveURL(/\/quan-tri\/quan-ly-goi$/);
    await expect(page.locator("tr").filter({ hasText: maGoi }).getByText(tenSua)).toBeVisible();

    // Dọn: xóa gói mới (confirm của trình duyệt)
    page.once("dialog", (d) => d.accept());
    await page.locator("tr").filter({ hasText: maGoi }).getByRole("button", { name: "Xóa" }).click();
    await expect(page.locator("tr").filter({ hasText: maGoi })).toHaveCount(0, { timeout: 20_000 });
  });
});
