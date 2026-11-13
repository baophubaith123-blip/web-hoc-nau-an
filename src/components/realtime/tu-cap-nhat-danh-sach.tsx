"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { taoSupabaseClient } from "@/lib/supabase/client";

// Lắng nghe INSERT/UPDATE trên các bảng chỉ định qua Supabase Realtime
// (postgres_changes) rồi làm mới dữ liệu của Server Component bằng
// router.refresh() — giữ nguyên URL và bộ lọc đang chọn, không tải lại
// toàn trang. RLS quyết định phiên nào nhận được event nào: nhân viên
// có quyền xem tất cả mới nhận thay đổi của mọi người, người dùng
// thường chỉ nhận phần của chính mình.
// Chỉ dùng cho các trang danh sách phía staff (duyệt nâng cấp Pro,
// hàng đợi ticket hỗ trợ) — nơi người xem không tự tạo dòng mới.
// KHÔNG gắn vào trang mà chính người đang xem tạo dữ liệu (ví dụ hộp
// thoại tạo ticket của học viên): event INSERT của chính mình sẽ kích
// hoạt refresh cắt ngang server action đang bay làm hộp thoại treo.
// Mẫu subscription dọn kênh khi unmount theo src/hooks/use-realtime-thong-bao.ts.
export function TuCapNhatDanhSach({ cacBang }: { cacBang: string[] }) {
  const router = useRouter();
  const supabase = useMemo(() => taoSupabaseClient(), []);
  const henGio = useRef<ReturnType<typeof setTimeout> | null>(null);
  const khoaBang = cacBang.join("+");

  useEffect(() => {
    // Gộp các event đến gần nhau thành một lần làm mới duy nhất. Trễ
    // 1 giây để server action đang chạy trên chính trang này (ví dụ
    // admin bấm Duyệt) kịp hoàn tất trước khi làm mới, tránh refresh
    // cắt ngang action đang bay.
    const lamMoi = () => {
      if (henGio.current) clearTimeout(henGio.current);
      henGio.current = setTimeout(() => router.refresh(), 1000);
    };

    let kenh = supabase.channel(`tu-cap-nhat:${khoaBang}`);
    for (const bang of khoaBang.split("+")) {
      kenh = kenh
        .on("postgres_changes", { event: "INSERT", schema: "public", table: bang }, lamMoi)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: bang }, lamMoi);
    }
    kenh.subscribe();

    return () => {
      if (henGio.current) clearTimeout(henGio.current);
      supabase.removeChannel(kenh);
    };
  }, [khoaBang, supabase, router]);

  return null;
}
