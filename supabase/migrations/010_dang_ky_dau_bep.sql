-- ============================================================
-- 010: Đăng ký trở thành đầu bếp (Đợt 5 — kiểm tra toàn diện 15/11)
-- ------------------------------------------------------------
-- Bối cảnh: trước đây tài khoản đầu bếp chỉ do Admin tạo sẵn/đổi vai
-- trò thủ công; học viên không có cách nào tự ứng tuyển. Đợt 5 bổ
-- sung luồng ỨNG TUYỂN + ADMIN DUYỆT (phương án A, chốt F.3):
--   1. Học viên (vai trò user) gửi đơn: chuyên môn, số năm kinh
--      nghiệm (BẮT BUỘC, tối thiểu 0), món tủ, tiểu sử, lý do,
--      liên kết mạng xã hội (tùy chọn). Ảnh/tên lấy từ hồ sơ sẵn có.
--   2. Mỗi tài khoản chỉ có TỐI ĐA 1 đơn đang chờ duyệt (chống rác —
--      chặn cả ở server action lẫn chỉ mục duy nhất từng phần dưới
--      đây, để gọi thẳng API cũng không lách được).
--   3. Admin duyệt -> vai trò tài khoản thành chef (server action
--      cập nhật profiles + gửi thông báo cho người gửi). Từ chối
--      phải kèm lý do; người bị từ chối gửi lại được sau 7 ngày
--      (server action kiểm tra lần từ chối gần nhất).
--
-- RLS (đúng mẫu migration 004 với yeu_cau_nang_cap):
--   - Người dùng chỉ SELECT/INSERT đơn của chính mình.
--   - Admin toàn quyền (policy dùng public.la_admin() như 008/009).
--   - Không có policy UPDATE/DELETE cho người dùng thường: việc đổi
--     trạng thái chỉ đi qua server action của Admin (admin client).
--
-- Realtime: thêm bảng vào publication supabase_realtime (mẫu 007)
-- để trang "Duyệt đầu bếp" của Admin tự cập nhật khi có đơn mới.
--
-- Chạy lặp lại an toàn (idempotent). Code phía app chạy SUY GIẢM
-- duyên dáng khi chưa có bảng này (trang ứng tuyển/trang duyệt hiện
-- thông báo "kích hoạt sau migration 010", không lỗi) — cùng mẫu
-- thùng rác đợt 3 với migration 009.
-- Chạy trong Supabase SQL Editor như các migration trước.
-- ============================================================

-- 1. Bảng đơn ứng tuyển đầu bếp
create table if not exists public.don_ung_tuyen_dau_bep (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  chuyen_mon text not null,
  so_nam_kinh_nghiem int not null check (so_nam_kinh_nghiem >= 0),
  mon_tu text,
  tieu_su text not null,
  ly_do text not null,
  lien_ket_mang_xa_hoi text,
  trang_thai text not null default 'cho_duyet'
    check (trang_thai in ('cho_duyet', 'da_duyet', 'tu_choi')),
  ly_do_tu_choi text,
  nguoi_duyet_id uuid references public.profiles(id) on delete set null,
  duyet_luc timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Chống rác: mỗi tài khoản tối đa 1 đơn đang chờ duyệt
create unique index if not exists don_ung_tuyen_mot_don_cho_moi_nguoi
  on public.don_ung_tuyen_dau_bep (nguoi_dung_id)
  where trang_thai = 'cho_duyet';

-- Danh sách duyệt của Admin sắp theo trạng thái + mới nhất trước
create index if not exists don_ung_tuyen_theo_trang_thai
  on public.don_ung_tuyen_dau_bep (trang_thai, created_at desc);

-- 3. RLS
alter table public.don_ung_tuyen_dau_bep enable row level security;

drop policy if exists "Nguoi dung xem don ung tuyen cua minh" on public.don_ung_tuyen_dau_bep;
create policy "Nguoi dung xem don ung tuyen cua minh"
  on public.don_ung_tuyen_dau_bep for select
  using (nguoi_dung_id = auth.uid());

drop policy if exists "Nguoi dung tao don ung tuyen cho minh" on public.don_ung_tuyen_dau_bep;
create policy "Nguoi dung tao don ung tuyen cho minh"
  on public.don_ung_tuyen_dau_bep for insert
  with check (nguoi_dung_id = auth.uid());

drop policy if exists "Admin toan quyen voi don ung tuyen dau bep" on public.don_ung_tuyen_dau_bep;
create policy "Admin toan quyen voi don ung tuyen dau bep"
  on public.don_ung_tuyen_dau_bep for all
  using (public.la_admin()) with check (public.la_admin());

-- 4. Realtime cho trang duyệt của Admin (idempotent, mẫu migration 007)
do $$
begin
  if not exists (select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public'
      and tablename = 'don_ung_tuyen_dau_bep') then
    alter publication supabase_realtime add table public.don_ung_tuyen_dau_bep;
  end if;
end $$;
