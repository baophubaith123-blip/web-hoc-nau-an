import type { MetadataRoute } from "next";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Các trang tĩnh
  const routesTinh: MetadataRoute.Sitemap = [
    "",
    "/cong-thuc",
    "/khoa-hoc",
    "/dau-bep",
    "/bai-viet",
    "/gioi-thieu",
    "/lien-he",
    "/tro-giup",
  ].map((duongDan) => ({
    url: `${baseUrl}${duongDan}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: duongDan === "" ? 1.0 : 0.8,
  }));

  try {
    const admin = taoSupabaseAdmin();

    const [{ data: congThucList }, { data: khoaHocList }, { data: baiVietList }] =
      await Promise.all([
        admin
          .from("cong_thuc")
          .select("slug, updated_at")
          .eq("trang_thai", "xuat_ban")
          .is("deleted_at", null)
          .limit(100),
        admin
          .from("khoa_hoc")
          .select("slug, updated_at")
          .eq("trang_thai", "xuat_ban")
          .limit(100),
        admin
          .from("bai_viet")
          .select("slug, updated_at")
          .eq("trang_thai", "xuat_ban")
          .limit(100),
      ]);

    const routesCongThuc: MetadataRoute.Sitemap = (congThucList || []).map((ct) => ({
      url: `${baseUrl}/cong-thuc/${ct.slug}`,
      lastModified: new Date(ct.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const routesKhoaHoc: MetadataRoute.Sitemap = (khoaHocList || []).map((kh) => ({
      url: `${baseUrl}/khoa-hoc/${kh.slug}`,
      lastModified: new Date(kh.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const routesBaiViet: MetadataRoute.Sitemap = (baiVietList || []).map((bv) => ({
      url: `${baseUrl}/bai-viet/${bv.slug}`,
      lastModified: new Date(bv.updated_at),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...routesTinh, ...routesCongThuc, ...routesKhoaHoc, ...routesBaiViet];
  } catch (e) {
    console.error("[SITEMAP GENERATION ERROR]", e);
    return routesTinh;
  }
}
