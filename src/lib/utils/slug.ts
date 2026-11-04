// "Phở bò Hà Nội" → "pho-bo-ha-noi"
export function taoSlug(chuoi: string): string {
  return chuoi
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Thêm hậu tố ngẫu nhiên để không trùng slug
export function taoSlugDuyNhat(chuoi: string): string {
  const goc = taoSlug(chuoi) || "muc";
  return `${goc}-${Math.random().toString(36).slice(2, 7)}`;
}