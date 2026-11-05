-- Migration 005: Cho phép thành viên Pro tự gửi bài viết chờ duyệt
-- (trước đây bài viết chỉ do admin tạo). Áp dụng cùng luồng duyệt như công thức:
-- người dùng gửi -> cho_duyet -> admin duyệt (xuat_ban) hoặc từ chối (tu_choi + lý do).
-- Chạy 1 lần trong Supabase Dashboard > SQL Editor.

-- 1. Thêm cột lý do từ chối (giống bảng cong_thuc)
alter table public.bai_viet
  add column if not exists ly_do_tu_choi text;

-- 2. Mở rộng danh sách trạng thái hợp lệ
alter table public.bai_viet
  drop constraint if exists bai_viet_trang_thai_check;
alter table public.bai_viet
  add constraint bai_viet_trang_thai_check
  check (trang_thai in ('nhap', 'cho_duyet', 'xuat_ban', 'luu_tru', 'tu_choi'));

-- 3. Tác giả xem được bài viết của mình ở mọi trạng thái
--    (trước đây chỉ xem được bài đã xuất bản hoặc phải là admin)
drop policy if exists bai_viet_xem on public.bai_viet;
create policy bai_viet_xem on public.bai_viet for select
  using (trang_thai = 'xuat_ban' or tac_gia_id = auth.uid() or public.la_admin());

-- 4. Người dùng đã đăng nhập được tạo bài ở trạng thái nháp / chờ duyệt
create policy bai_viet_tao on public.bai_viet for insert
  with check (tac_gia_id = public.uid_hop_le() and trang_thai in ('nhap', 'cho_duyet'));

-- 5. Tác giả sửa bài của mình, chỉ được đưa về nháp / chờ duyệt
--    (quy tắc trạng thái chi tiết do Server Action kiểm tra thêm)
create policy bai_viet_sua on public.bai_viet for update
  using (tac_gia_id = auth.uid())
  with check (tac_gia_id = public.uid_hop_le() and trang_thai in ('nhap', 'cho_duyet'));

-- 6. Tác giả xóa bài nháp / bị từ chối của mình
create policy bai_viet_xoa on public.bai_viet for delete
  using (tac_gia_id = auth.uid() and trang_thai in ('nhap', 'tu_choi'));
