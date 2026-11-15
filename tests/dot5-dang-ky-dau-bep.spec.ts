import { test, expect, type Page, type Browser } from "@playwright/test";

// ĐỢT 5 (16/11/2026) — ĐĂNG KÝ TRỞ THÀNH ĐẦU BẾP (phương án A: học viên
// ứng tuyển -> Admin duyệt -> tài khoản thành đầu bếp).
//
// Ca luôn chạy (không cần bảng don_ung_tuyen_dau_bep): điểm vào CTA ở
// /dau-bep, trang ứng tuyển mở không crash, trang Admin "Duyệt đầu
// bếp" mở được (form hoặc thông báo chưa kích hoạt đều đạt).
// Ca luồng THẬT chỉ chạy khi migration 010 đã được dán — nhận biết
// bằng việc trang ứng tuyển hiện form thật thay vì thông báo
// "migration 010"; chưa có bảng thì skip kèm lý do rõ ràng.
// Tài khoản luồng thật là tài khoản DÙNG MỘT LẦN đăng ký ngay trong
// test (tiền tố TEST_DOT5_); coordinator dọn sau suite bằng admin
// client nên DB trở về baseline.
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";
const DAU = Date.now();

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), {
    timeout: 30_000,
  });
}

async function dangKyTaiKhoanMoi(page: Page, email: string, hoTen: string) {
  await page.goto("/dang-ky");
  await page.locator("#ho_ten").fill(hoTen);
  await page.locator("#email").fill(email);
  await page.locator("#mat_khau").fill(MAT_KHAU);
  await page.locator("#xac_nhan_mat_khau").fill(MAT_KHAU);
  await page.locator("label[for='dong_y']").click();
  await page.getByRole("button", { name: /Đăng ký/ }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-ky"), {
    timeout: 30_000,
  });
}

// Điền và gửi form ứng tuyển trên trang /tro-thanh-dau-bep
async function guiFormUngTuyen(page: Page, monTu: string) {
  await page.goto("/tro-thanh-dau-bep");
  await page.getByRole("button", { name: "Món Việt truyền thống" }).click();
  await page.locator("#so_nam_kinh_nghiem").fill("2");
  await page.locator("#mon_tu").fill(monTu);
  await page
    .locator("#tieu_su")
    .fill(
      "TEST_DOT5 — Tôi nấu ăn gia đình hơn 5 năm, mê món Việt truyền thống và muốn chia sẻ công thức dễ làm cho mọi nhà."
    );
  await page
    .locator("#ly_do")
    .fill(
      "TEST_DOT5 — Muốn đăng công thức và mở khóa học món Việt cơ bản cho người mới bắt đầu nấu ăn."
    );
  await page.getByRole("button", { name: "Gửi đơn ứng tuyển" }).click();
  // Gửi thành công -> trang refresh hiện thẻ trạng thái đang chờ duyệt
  await expect(page.getByText(/đang chờ duyệt/).first()).toBeVisible({
    timeout: 30_000,
  });
}

test.describe("Đợt 5 — Đăng ký đầu bếp: bề mặt luôn chạy", () => {
  test("Trang /dau-bep có điểm vào Ứng tuyển làm đầu bếp", async ({ page }) => {
    await page.goto("/dau-bep");
    const cta = page.getByRole("link", { name: "Ứng tuyển làm đầu bếp" });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/tro-thanh-dau-bep|\/dang-nhap/);
  });

  test("Trang ứng tuyển mở không crash (khách bị đưa đi đăng nhập)", async ({
    page,
  }) => {
    await page.goto("/tro-thanh-dau-bep");
    await expect(page).toHaveURL(/\/dang-nhap/);
  });

  test("Học viên mở được trang ứng tuyển — form thật hoặc thông báo chưa kích hoạt", async ({
    page,
  }) => {
    await dangNhap(page, "user2@naungon.vn");
    await page.goto("/tro-thanh-dau-bep");
    await expect(
      page.getByRole("heading", { name: "Trở thành đầu bếp" })
    ).toBeVisible();
    const coForm = await page
      .getByRole("button", { name: "Gửi đơn ứng tuyển" })
      .isVisible()
      .catch(() => false);
    const chuaKichHoat = await page
      .getByText(/migration 010/)
      .isVisible()
      .catch(() => false);
    const dangCho = await page
      .getByText(/đang chờ duyệt/)
      .isVisible()
      .catch(() => false);
    expect(coForm || chuaKichHoat || dangCho).toBeTruthy();
  });

  test("Admin mở được mục Duyệt đầu bếp (danh sách hoặc thông báo chưa kích hoạt)", async ({
    page,
  }) => {
    await dangNhap(page, "admin@naungon.vn");
    await page.goto("/quan-tri/duyet-dau-bep");
    await expect(
      page.getByRole("heading", { name: "Duyệt đầu bếp" })
    ).toBeVisible();
    const chuaKichHoat = await page
      .getByText(/migration 010/)
      .isVisible()
      .catch(() => false);
    const coDanhSach = await page
      .getByText(/Đang chờ duyệt/)
      .isVisible()
      .catch(() => false);
    expect(chuaKichHoat || coDanhSach).toBeTruthy();
    // Sidebar khu Admin có mục Duyệt đầu bếp
    await expect(
      page.getByRole("link", { name: "Duyệt đầu bếp" }).first()
    ).toBeVisible();
  });

  test("Đầu bếp hiện tại vào trang ứng tuyển thấy thông báo đã là đầu bếp", async ({
    page,
  }) => {
    await dangNhap(page, "chef@naungon.vn");
    await page.goto("/tro-thanh-dau-bep");
    await expect(page.getByText(/đã là đầu bếp/)).toBeVisible();
  });
});

test.describe("Đợt 5 — Luồng thật (cần migration 010)", () => {
  // Nhận biết 010 đã dán chưa: user2 mở trang ứng tuyển — nếu chỉ thấy
  // thông báo migration 010 (không form, không thẻ chờ) thì skip cả nhóm.
  async function daKichHoat010(browser: Browser): Promise<boolean> {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    try {
      await dangNhap(page, "user2@naungon.vn");
      await page.goto("/tro-thanh-dau-bep");
      const chuaKichHoat = await page
        .getByText(/migration 010/)
        .isVisible()
        .catch(() => false);
      return !chuaKichHoat;
    } finally {
      await ctx.close();
    }
  }

  test("Ứng viên gửi đơn -> chặn gửi trùng -> Admin duyệt -> vào được khu bếp + hiện ở /dau-bep", async ({
    browser,
  }) => {
    test.setTimeout(300_000);
    if (!(await daKichHoat010(browser))) {
      test.skip(true, "Chờ migration 010 — bảng don_ung_tuyen_dau_bep chưa tồn tại");
    }
    const tenUngVien = `TEST_DOT5 Ung Vien ${DAU}`;
    const emailUngVien = `test-dot5-ung-vien-${DAU}@hocnauan.vn`;

    // 1) Đăng ký tài khoản dùng một lần rồi gửi đơn
    const ctxUv = await browser.newContext();
    const uv = await ctxUv.newPage();
    await dangKyTaiKhoanMoi(uv, emailUngVien, tenUngVien);
    await guiFormUngTuyen(uv, `TEST_DOT5 Phở gà ${DAU}`);

    // 2) Chặn rác: đang có đơn chờ thì form biến mất (không gửi trùng được)
    await uv.goto("/tro-thanh-dau-bep");
    await expect(
      uv.getByRole("button", { name: "Gửi đơn ứng tuyển" })
    ).toHaveCount(0);

    // 3) Admin thấy đơn, bấm Duyệt
    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/duyet-dau-bep");
    const theDon = admin
      .locator("div")
      .filter({ hasText: tenUngVien })
      .filter({ hasText: "năm kinh nghiệm" })
      .last();
    await expect(theDon.getByText(tenUngVien)).toBeVisible({ timeout: 30_000 });
    await theDon.getByRole("button", { name: "Duyệt thành đầu bếp" }).click();
    await expect(admin.getByText(/chính thức trở thành đầu bếp/)).toBeVisible({
      timeout: 30_000,
    });

    // 4) Ứng viên nhận vai trò đầu bếp: vào được khu /bep
    await uv.goto("/bep");
    await expect(uv).toHaveURL(/\/bep/);
    await expect(uv.getByText(/Tổng quan|Khu vực đầu bếp|Trang đầu bếp/).first()).toBeVisible();

    // 5) Hồ sơ hiện ở trang /dau-bep công khai
    const ctxKhach = await browser.newContext();
    const khach = await ctxKhach.newPage();
    await khach.goto("/dau-bep");
    await expect(khach.getByText(`Chef ${tenUngVien}`)).toBeVisible();

    await ctxUv.close();
    await ctxAdmin.close();
    await ctxKhach.close();
  });

  test("Admin từ chối kèm lý do -> ứng viên thấy lý do và bị chặn gửi lại 7 ngày", async ({
    browser,
  }) => {
    test.setTimeout(300_000);
    if (!(await daKichHoat010(browser))) {
      test.skip(true, "Chờ migration 010 — bảng don_ung_tuyen_dau_bep chưa tồn tại");
    }
    const tenUngVien = `TEST_DOT5 Tu Choi ${DAU}`;
    const emailUngVien = `test-dot5-tu-choi-${DAU}@hocnauan.vn`;
    const lyDo = `TEST_DOT5 hồ sơ còn sơ sài ${DAU}`;

    const ctxUv = await browser.newContext();
    const uv = await ctxUv.newPage();
    await dangKyTaiKhoanMoi(uv, emailUngVien, tenUngVien);
    await guiFormUngTuyen(uv, `TEST_DOT5 Cháo gà ${DAU}`);

    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/duyet-dau-bep");
    const theDon = admin
      .locator("div")
      .filter({ hasText: tenUngVien })
      .filter({ hasText: "năm kinh nghiệm" })
      .last();
    await expect(theDon.getByText(tenUngVien)).toBeVisible({ timeout: 30_000 });
    await theDon.getByRole("button", { name: "Từ chối", exact: true }).click();
    const hopThoai = admin.getByRole("dialog");
    await hopThoai.locator("textarea").fill(lyDo);
    await hopThoai.getByRole("button", { name: "Từ chối đơn này" }).click();
    await expect(admin.getByText(/Đã từ chối đơn/)).toBeVisible({
      timeout: 30_000,
    });

    // Ứng viên mở lại trang: thấy lý do + mốc gửi lại sau 7 ngày, không có form
    await uv.goto("/tro-thanh-dau-bep");
    await expect(uv.getByText(/chưa được duyệt/).first()).toBeVisible();
    await expect(uv.getByText(lyDo)).toBeVisible();
    await expect(uv.getByText(/gửi lại từ ngày/)).toBeVisible();
    await expect(
      uv.getByRole("button", { name: "Gửi đơn ứng tuyển" })
    ).toHaveCount(0);

    await ctxUv.close();
    await ctxAdmin.close();
  });
});
