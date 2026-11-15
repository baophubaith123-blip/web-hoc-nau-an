import { test, expect, type Page } from "@playwright/test";

// ĐỢT 1 (15/11/2026) — PHÂN QUYỀN CHÉO ở tầng trang + hành động.
// Kỹ thuật: dùng phiên của vai A mở thẳng URL sửa/quản lý tài nguyên của vai B
// (đây là đường duy nhất tới được server action sửa/xóa tương ứng), kỳ vọng bị
// chặn (404 / chuyển hướng về khu của mình) và dữ liệu của B không đổi — kiểm
// chứng lại bằng chính giao diện của chủ sở hữu/admin sau mỗi ca.
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";

// Tài nguyên có sẵn trong DB (đã kiểm chứng 15/11/2026):
// - Khóa "Nấu ăn cho người mới bắt đầu" thuộc đầu bếp Vũ Ngọc Anh (chef-an-sang)
// - Công thức "Bánh xèo miền Tây" thuộc đầu bếp Vũ Ngọc Anh
// - Công thức "Mì Ý sốt bò bằm" (chờ duyệt) thuộc học viên Pro user1
const KHOA_CUA_BEP_B = "cd5ce0af-ebdb-45cb-85b1-b19eac4c0a76";
const TEN_KHOA_B = "Nấu ăn cho người mới bắt đầu";
const CONG_THUC_CUA_BEP_B = "c8c65767-7651-45ed-abff-37c7329abbd8";
const CONG_THUC_CUA_PRO = "949aef96-8d6c-41bf-b934-41206c1bfb4a";

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

test.describe("Đợt 1 — Phân quyền chéo giữa các đầu bếp", () => {
  test("Ca 1: Đầu bếp A mở sửa khóa học của đầu bếp B -> 404, dữ liệu B không đổi", async ({ page, browser }) => {
    await dangNhap(page, "chef@naungon.vn"); // Trần Văn Minh (bếp A)
    await page.goto(`/bep/khoa-hoc/${KHOA_CUA_BEP_B}/sua`);
    // Trang sửa của người khác phải 404: không có form chỉnh sửa khóa học
    await expect(page.getByRole("heading", { name: "Chỉnh sửa khóa học" })).toHaveCount(0);
    await expect(page.locator("#tieu_de")).toHaveCount(0);

    // Kiểm chứng DB qua giao diện admin: khóa của B còn nguyên tiêu đề + trạng thái
    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/khoa-hoc");
    const the = admin.locator("div.border.rounded-2xl").filter({ hasText: TEN_KHOA_B }).first();
    await expect(the).toBeVisible();
    await expect(the.getByText("Đã xuất bản")).toBeVisible();
    await ctxAdmin.close();
  });

  test("Ca 2: Đầu bếp A mở quản lý bài học của khóa đầu bếp B -> 404, không thêm được bài", async ({ page }) => {
    await dangNhap(page, "chef@naungon.vn");
    await page.goto(`/bep/khoa-hoc/${KHOA_CUA_BEP_B}/bai-hoc`);
    await expect(page.getByRole("button", { name: "Thêm bài học mới" })).toHaveCount(0);
    await expect(page.getByText(/Quản lý bài học:/)).toHaveCount(0);
  });

  test("Ca 3: Đầu bếp A mở sửa công thức của đầu bếp B -> 404", async ({ page }) => {
    await dangNhap(page, "chef@naungon.vn");
    await page.goto(`/bep/cong-thuc/${CONG_THUC_CUA_BEP_B}/sua`);
    await expect(page.getByRole("heading", { name: "Chỉnh sửa công thức" })).toHaveCount(0);
    await expect(page.locator("#tieu_de")).toHaveCount(0);
    // Công thức của B vẫn hiện nguyên ở trang công khai
    await page.goto("/cong-thuc");
    await expect(page.getByText("Bánh xèo miền Tây").first()).toBeVisible();
  });
});

test.describe("Đợt 1 — Phân quyền chéo theo khu vực vai trò", () => {
  test("Ca 4: Học viên Free vào khu bếp / quản trị / hỗ trợ -> bị đưa về bảng điều khiển", async ({ page }) => {
    await dangNhap(page, "user2@naungon.vn");
    for (const duongDan of ["/bep", "/bep/khoa-hoc/moi", "/quan-tri", "/quan-tri/danh-muc", "/nhan-vien", "/nhan-vien/ticket"]) {
      await page.goto(duongDan);
      await expect(page, `Free phải bị chặn ở ${duongDan}`).toHaveURL(/\/bang-dieu-khien/);
    }
  });

  test("Ca 5: Học viên Pro vào khu bếp / quản trị -> bị đưa về bảng điều khiển", async ({ page }) => {
    await dangNhap(page, "user1@naungon.vn");
    for (const duongDan of ["/bep/khoa-hoc/moi", "/bep", "/quan-tri/quan-ly-goi", "/quan-tri/khoa-hoc/moi"]) {
      await page.goto(duongDan);
      await expect(page, `Pro phải bị chặn ở ${duongDan}`).toHaveURL(/\/bang-dieu-khien/);
    }
  });

  test("Ca 6: Nhân viên hỗ trợ vào khu bếp / quản trị -> bị đưa về khu hỗ trợ; không mở được form tạo công thức", async ({ page }) => {
    await dangNhap(page, "support@naungon.vn");
    for (const duongDan of ["/bep", "/bep/khoa-hoc/moi", "/quan-tri", "/quan-tri/danh-muc"]) {
      await page.goto(duongDan);
      await expect(page, `Support phải bị chặn ở ${duongDan}`).toHaveURL(/\/nhan-vien/);
    }
    // Support mở trang tạo công thức: chỉ thấy trang khóa Pro, không thấy biểu mẫu
    await page.goto("/tao-cong-thuc");
    await expect(page.getByRole("heading", { name: "Tạo công thức món ăn mới" })).toHaveCount(0);
    await expect(page.locator("#tieu_de")).toHaveCount(0);
  });

  test("Ca 7: Đầu bếp vào khu quản trị / hỗ trợ -> bị đưa về khu bếp", async ({ page }) => {
    await dangNhap(page, "chef@naungon.vn");
    for (const duongDan of ["/quan-tri", "/quan-tri/danh-muc", "/quan-tri/quan-ly-goi/moi", "/nhan-vien/ticket"]) {
      await page.goto(duongDan);
      await expect(page, `Chef phải bị chặn ở ${duongDan}`).toHaveURL(/\/bep/);
    }
  });
});

test.describe("Đợt 1 — Cổng Pro ở tầng máy chủ + sở hữu bài viết/công thức", () => {
  test("Ca 8: Học viên Free mở thẳng form tạo công thức / viết bài -> bị khóa Pro (không có biểu mẫu)", async ({ page }) => {
    await dangNhap(page, "user2@naungon.vn");
    await page.goto("/tao-cong-thuc");
    await expect(page).toHaveURL(/\/nang-cap-pro|\/tao-cong-thuc/);
    await expect(page.getByRole("heading", { name: "Tạo công thức món ăn mới" })).toHaveCount(0);
    await expect(page.locator("#tieu_de")).toHaveCount(0);

    await page.goto("/tao-bai-viet");
    await expect(page.getByLabel(/Tiêu đề bài viết/)).toHaveCount(0);
  });

  test("Ca 9: Học viên Free mở sửa công thức đang chờ duyệt của Pro khác -> không sửa được", async ({ page, browser }) => {
    await dangNhap(page, "user2@naungon.vn");
    await page.goto(`/tao-cong-thuc/${CONG_THUC_CUA_PRO}/sua`);
    // Không được thấy biểu mẫu chứa dữ liệu món của người khác
    await expect(page.locator("#tieu_de")).toHaveCount(0);

    // Kiểm chứng: món của Pro vẫn nguyên trạng thái chờ duyệt trong khu admin
    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/cong-thuc");
    await expect(admin.getByText("Mì Ý sốt bò bằm").first()).toBeVisible();
    await ctxAdmin.close();
  });

  test("Ca 10: Đầu bếp mở khu quản trị công thức của admin -> bị chặn (khu riêng)", async ({ page }) => {
    await dangNhap(page, "chef@naungon.vn");
    await page.goto("/quan-tri/cong-thuc");
    await expect(page).toHaveURL(/\/bep/);
    await page.goto("/quan-tri/bai-viet");
    await expect(page).toHaveURL(/\/bep/);
  });
});
