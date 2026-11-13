// Kiểm chứng Đợt 4 — chế độ nấu rảnh tay (/nau/[slug]).
// Món mẫu: Súp cua (slug "sup-cua", 6 bước, khẩu phần gốc 4 người):
//   - Bước 1 có 2 mốc giờ: "3 phút" (03:00) và khoảng "35-40 phút" (40:00).
//   - Bước 5 có mốc "10 giây" (00:10) — dùng để kiểm chứng báo hết giờ
//     XUYÊN BƯỚC: bật đồng hồ ở bước 5, sang bước 6, banner phải hiện.
// Chạy khi đã có server ở localhost:3000 (dev hoặc production):
//   npx playwright test tests/cokba-nau.spec.ts --reporter=list
// Ảnh chụp lưu vào anh-kiem-chung-cokba/ (ngoài test-results).

import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const THU_MUC_ANH = path.join(process.cwd(), "anh-kiem-chung-cokba");
fs.mkdirSync(THU_MUC_ANH, { recursive: true });

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

function phutGiaySangGiay(text: string): number {
  const parts = text.trim().split(":").map((x) => parseInt(x, 10));
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
}

test.describe("Cokba Đợt 4 — nấu rảnh tay", () => {
  test("a) chuẩn bị: nguyên liệu chia theo số người; đổi số người -> lượng đổi theo quy tắc", async ({
    page,
  }) => {
    await page.goto("/nau/sup-cua");
    await expect(page.getByTestId("man-chuan-bi")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Súp cua/ })).toBeVisible();
    await expect(page.getByTestId("so-nguoi-hien-tai")).toHaveText("4");

    const dongThitCua = page
      .getByTestId("dong-nguyen-lieu")
      .filter({ hasText: "Thịt cua" });
    const dongTrungCut = page
      .getByTestId("dong-nguyen-lieu")
      .filter({ hasText: "Trứng cút" });
    await expect(dongThitCua).toContainText("200 g");
    await expect(dongTrungCut).toContainText("12 quả");

    // 4 -> 2 người: g làm tròn bội 5 (200 -> 100), quả bội 0,5 (12 -> 6)
    await page.getByRole("button", { name: "Giảm số người ăn" }).click();
    await page.getByRole("button", { name: "Giảm số người ăn" }).click();
    await expect(page.getByTestId("so-nguoi-hien-tai")).toHaveText("2");
    await expect(dongThitCua).toContainText("100 g");
    await expect(dongTrungCut).toContainText("6 quả");

    // slot trí nhớ: số người ăn phải được ghi vào localStorage cokba-tri-nho
    const slot = await page.evaluate(() =>
      window.localStorage.getItem("cokba-tri-nho")
    );
    expect(slot).toContain('"soNguoiAn":2');

    await page.screenshot({
      path: path.join(THU_MUC_ANH, "cokba-nau-chuan-bi.png"),
      fullPage: true,
    });
  });

  test("b) buổi nấu: đồng hồ đúng tổng, chạy giảm, tạm dừng đứng yên, +1 phút; báo hết giờ xuyên bước; hoàn thành", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await page.goto("/nau/sup-cua");
    await page.getByTestId("nut-bat-dau-nau").click();
    await expect(page.getByTestId("man-buoc")).toBeVisible();
    await expect(page.getByTestId("tieu-de-buoc")).toHaveText("Bước 1/6");

    // slot: đã ghi món đang nấu + bước hiện tại
    const slotBatDau = await page.evaluate(() =>
      window.localStorage.getItem("cokba-tri-nho")
    );
    expect(slotBatDau).toContain('"monDangNau"');
    expect(slotBatDau).toContain('"buocHienTai":0');

    // Bước 1 có 2 đồng hồ: 03:00 (3 phút) và 40:00 (khoảng 35-40 phút lấy số lớn)
    const dh0 = page.getByTestId("dong-ho-0-0");
    const dh1 = page.getByTestId("dong-ho-0-1");
    await expect(dh0).toBeVisible();
    await expect(dh0.getByTestId("gia-tri-dong-ho")).toHaveText("03:00");
    await expect(dh1.getByTestId("gia-tri-dong-ho")).toHaveText("40:00");

    // Bắt đầu -> sau ~2,3 giây số đếm phải giảm xuống quanh 02:57-02:58
    await dh0.getByRole("button", { name: "Bắt đầu" }).click();
    await page.waitForTimeout(2300);
    const dangChay = await dh0.getByTestId("gia-tri-dong-ho").innerText();
    expect(dangChay).toMatch(/^02:5[6-9]$/);

    // Tạm dừng -> đứng yên
    await dh0.getByRole("button", { name: "Tạm dừng" }).click();
    const vuaDung = await dh0.getByTestId("gia-tri-dong-ho").innerText();
    await page.waitForTimeout(1600);
    const sauDung = await dh0.getByTestId("gia-tri-dong-ho").innerText();
    expect(sauDung).toBe(vuaDung);

    // +1 phút -> tổng còn lại tăng đúng 60 giây (sai số <= 1 giây)
    await dh0.getByRole("button", { name: "+1 phút" }).click();
    const sauCong = await dh0.getByTestId("gia-tri-dong-ho").innerText();
    expect(
      Math.abs(phutGiaySangGiay(sauCong) - phutGiaySangGiay(vuaDung) - 60)
    ).toBeLessThanOrEqual(1);

    await page.screenshot({
      path: path.join(THU_MUC_ANH, "cokba-nau-buoc.png"),
      fullPage: true,
    });

    // Đi tới bước 5 (mốc 10 giây), bật đồng hồ rồi sang bước 6 ngay:
    // banner hết giờ phải hiện dù đang ở bước khác.
    for (let i = 0; i < 4; i++) {
      await page.getByTestId("nut-buoc-tiep").click();
    }
    await expect(page.getByTestId("tieu-de-buoc")).toHaveText("Bước 5/6");
    const dh10s = page.getByTestId("dong-ho-4-0");
    await expect(dh10s.getByTestId("gia-tri-dong-ho")).toHaveText("00:10");
    await dh10s.getByRole("button", { name: "Bắt đầu" }).click();
    await page.getByTestId("nut-buoc-tiep").click();
    await expect(page.getByTestId("tieu-de-buoc")).toHaveText("Bước 6/6");
    await expect(page.getByTestId("thong-bao-het-gio")).toBeVisible({
      timeout: 25_000,
    });
    await expect(page.getByTestId("thong-bao-het-gio")).toContainText("bước 5");
    await expect(page.getByTestId("thong-bao-het-gio")).toContainText("đã xong");

    // Bước cuối -> Hoàn thành
    await page.getByTestId("nut-buoc-tiep").click();
    await expect(page.getByTestId("man-hoan-thanh")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Hoàn thành món Súp cua/ })
    ).toBeVisible();
    expect(await page.getByTestId("the-goi-y").count()).toBeGreaterThanOrEqual(1);

    // slot: hoàn thành xong phải dọn monDangNau + buocHienTai
    const slotXong = await page.evaluate(() =>
      window.localStorage.getItem("cokba-tri-nho")
    );
    expect(slotXong).toContain('"monDangNau":null');
    expect(slotXong).toContain('"buocHienTai":null');
  });

  test("c) mobile 390x844: màn bước không tràn ngang", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/nau/sup-cua");
    await page.getByTestId("nut-bat-dau-nau").click();
    await expect(page.getByTestId("man-buoc")).toBeVisible();
    const tranNgang = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1
    );
    expect(tranNgang).toBe(false);
    await page.screenshot({
      path: path.join(THU_MUC_ANH, "cokba-nau-buoc-mobile.png"),
    });
  });

  // LƯU Ý: middleware của dự án bắt ĐĂNG NHẬP mới xem được trang chi tiết
  // /cong-thuc/[slug] (guest bị chuyển sang /dang-nhap) — nên test này
  // đăng nhập trước. Riêng /nau/[slug] là route công khai cho cả khách.
  test("d) trang công thức (đã đăng nhập) có nút Nấu rảnh tay trỏ đúng /nau/<slug>", async ({
    page,
  }) => {
    await dangNhap(page, "admin@naungon.vn");
    await page.goto("/cong-thuc/sup-cua");
    const nut = page.getByRole("link", { name: /Nấu rảnh tay/ });
    await expect(nut).toBeVisible();
    await expect(nut).toHaveAttribute("href", "/nau/sup-cua");
    await nut.click();
    await page.waitForURL(/\/nau\/sup-cua$/);
    await expect(page.getByTestId("man-chuan-bi")).toBeVisible();
  });
});
