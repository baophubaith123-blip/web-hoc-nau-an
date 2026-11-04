// Tách ID 11 ký tự từ mọi dạng link YouTube
export function layIdYoutube(url: string | null | undefined): string | null {
  if (!url) return null;
  const kq = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return kq?.[1] ?? null;
}

// Dùng domain nocookie để hạn chế theo dõi
export const taoUrlNhungYoutube = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;

export const taoAnhBiaYoutube = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;