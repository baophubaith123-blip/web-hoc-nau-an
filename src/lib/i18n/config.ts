import i18next from "i18next";
import { vi } from "./vi";
import { en } from "./en";

// Khởi tạo 1 lần. Mặc định tiếng Việt
if (!i18next.isInitialized) {
  i18next.init({
    resources: { vi: { translation: vi }, en: { translation: en } },
    lng: "vi",
    fallbackLng: "vi",
    interpolation: { escapeValue: false },
    initAsync: false,
  });
}

// Dùng được cả ở Server Component: t("chung.luu"), t("cong_thuc.khau_phan_n", { so: 4 })
export const t = (khoa: string, tuyChon?: Record<string, unknown>): string =>
  i18next.t(khoa, tuyChon) as string;

export default i18next;