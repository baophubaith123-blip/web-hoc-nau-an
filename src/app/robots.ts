import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/bep/",
        "/quan-tri/",
        "/nhan-vien/",
        "/bang-dieu-khien/",
        "/cong-thuc-cua-toi/",
        "/khoa-hoc-cua-toi/",
        "/hoc-bai/",
        "/tao-cong-thuc/",
        "/cong-thuc-da-gui/",
        "/ho-so/",
        "/thong-bao/",
        "/ho-tro/",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
