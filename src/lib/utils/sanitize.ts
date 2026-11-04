// Làm sạch văn bản thường: bỏ thẻ HTML, ký tự điều khiển
export function lamSachVanBan(chuoi: string): string {
  return chuoi
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

// Làm sạch từ khóa tìm kiếm trước khi đưa vào .or()/.ilike() của PostgREST
// (chặn ký tự , ( ) % * \ dùng để chèn điều kiện lọc)
export function lamSachTuKhoa(chuoi: string | null | undefined): string {
  return (chuoi ?? "").replace(/[,()%*\\_]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}

// Làm sạch HTML (bài viết). Import động để không nạp jsdom ở server khi không cần
export async function lamSachHtml(html: string): Promise<string> {
  const { default: DOMPurify } = await import("isomorphic-dompurify");
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["h2", "h3", "h4", "p", "br", "strong", "em", "ul", "ol", "li", "blockquote", "a", "img", "hr"],
    ALLOWED_ATTR: ["href", "src", "alt", "target", "rel"],
  });
}