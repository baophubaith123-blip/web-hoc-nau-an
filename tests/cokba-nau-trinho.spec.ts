// Kiểm chứng bổ sung Đợt 4 (sau khi Bảo chạy migration 008):
// tài khoản đã đăng nhập bắt đầu buổi nấu -> slot monDangNau phải được
// ghi THẬT vào bảng tro_ly_tri_nho (kiểm qua REST bằng service role,
// key đọc từ .env.local ngay trong test, không in ra log).
// Cuối test XÓA dòng trí nhớ của tài khoản test để DB về baseline 0 dòng.

import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";
const EMAIL_TEST = "admin@naungon.vn";

function docEnv(): Record<string, string> {
  const tho = fs
    .readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
    .replace(/^\uFEFF/, "");
  const env: Record<string, string> = {};
  for (const dong of tho.split(/\r?\n/)) {
    const m = dong.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
  }
  return env;
}

const env = docEnv();
const SUPA_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

async function rest(
  duongDan: string,
  init?: RequestInit
): Promise<{ status: number; json: unknown }> {
  const res = await fetch(`${SUPA_URL}/rest/v1/${duongDan}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: res.status, json };
}

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), {
    timeout: 30_000,
  });
}

test("e) đăng nhập -> bắt đầu nấu -> tro_ly_tri_nho có dòng với monDangNau; dọn dòng sau kiểm chứng", async ({
  page,
}) => {
  test.setTimeout(180_000);
  expect(SUPA_URL).toBeTruthy();
  expect(SERVICE_KEY).toBeTruthy();

  // Baseline: chưa có dòng nào chứa monDangNau của buổi nấu này
  await dangNhap(page, EMAIL_TEST);
  await page.goto("/nau/sup-cua");
  await expect(page.getByTestId("man-chuan-bi")).toBeVisible();
  await page.getByTestId("nut-bat-dau-nau").click();
  await expect(page.getByTestId("man-buoc")).toBeVisible();

  // Chờ dòng trí nhớ xuất hiện trên server với monDangNau khác null
  let dongTimDuoc: { nguoi_dung_id: string } | null = null;
  await expect
    .poll(
      async () => {
        const { json } = await rest(
          "tro_ly_tri_nho?select=nguoi_dung_id,cac_slot"
        );
        const ds = Array.isArray(json) ? json : [];
        const dong = ds.find(
          (d) =>
            d &&
            typeof d === "object" &&
            (d as { cac_slot?: { monDangNau?: unknown } }).cac_slot
              ?.monDangNau != null
        ) as { nguoi_dung_id: string } | undefined;
        dongTimDuoc = dong ?? null;
        return dong ? 1 : 0;
      },
      { timeout: 30_000, intervals: [1000, 2000, 3000] }
    )
    .toBe(1);

  expect(dongTimDuoc).not.toBeNull();
  const userId = dongTimDuoc!.nguoi_dung_id;

  // Dọn: xóa dòng trí nhớ của tài khoản test, xác nhận đã biến mất
  const xoa = await rest(
    `tro_ly_tri_nho?nguoi_dung_id=eq.${encodeURIComponent(userId)}`,
    { method: "DELETE" }
  );
  expect(xoa.status).toBeGreaterThanOrEqual(200);
  expect(xoa.status).toBeLessThan(300);
  const kiemLai = await rest(
    `tro_ly_tri_nho?select=nguoi_dung_id&nguoi_dung_id=eq.${encodeURIComponent(userId)}`
  );
  expect(Array.isArray(kiemLai.json) ? kiemLai.json.length : -1).toBe(0);
});
