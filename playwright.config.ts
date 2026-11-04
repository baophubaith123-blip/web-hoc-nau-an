import { defineConfig } from "@playwright/test";

// Kiểm thử tự động cho đồ án — chạy bằng Microsoft Edge có sẵn trên máy
// (channel: "msedge") để không phải tải thêm Chromium.
export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    channel: "msedge",
    locale: "vi-VN",
    navigationTimeout: 90_000,
    actionTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
