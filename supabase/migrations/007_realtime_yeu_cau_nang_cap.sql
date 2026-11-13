-- ============================================================
-- 007: Bật Realtime cho bảng yeu_cau_nang_cap và thanh_toan
-- ------------------------------------------------------------
-- Mục đích: trang "Duyệt yêu cầu nâng cấp Pro" của admin tự cập nhật
-- khi có yêu cầu mới (INSERT) hoặc yêu cầu/giao dịch đổi trạng thái
-- (UPDATE) mà không cần tải lại trang — client lắng nghe
-- postgres_changes rồi gọi router.refresh() (component
-- TuCapNhatDanhSach). Bảng ticket_ho_tro ĐÃ có Realtime từ mục 8
-- của migration 002 nên không cần thêm ở đây.
--
-- RLS: KHÔNG cần thêm policy mới.
--  - yeu_cau_nang_cap: migration 004 đã có policy cho admin xem tất
--    cả yêu cầu, người dùng thường chỉ xem được yêu cầu của mình.
--  - thanh_toan: migration 002 đã có policy cho admin xem tất cả
--    (thanh_toan_admin / thanh_toan_xem).
-- Realtime tôn trọng RLS nên event chỉ được gửi tới đúng phiên có
-- quyền SELECT dòng đó: admin nhận mọi thay đổi, người dùng thường
-- (nếu có lắng nghe) chỉ nhận phần của chính mình.
--
-- Chạy lặp lại an toàn (idempotent) — cùng mẫu với mục 8 của
-- migration 002. Chạy trong Supabase SQL Editor như các migration
-- trước của dự án.
-- ============================================================

do $$
declare t text;
begin
  foreach t in array array['yeu_cau_nang_cap','thanh_toan']
  loop
    if not exists (select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
