import { redirect } from "next/navigation";

// Đường dẫn cũ /quan-tri/tong-quan từng có trong menu/bài hướng dẫn cũ — tổng
// quan thật của khu quản trị nằm ở /quan-tri. Chuyển hướng vĩnh viễn về đó
// thay vì để người dùng (và bài kiểm thử) gặp trang 404.
export default function TongQuanQuanTri() {
  redirect("/quan-tri");
}
