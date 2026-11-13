-- ============================================================
-- 008: Cokba (trợ lý bếp) — nhật ký câu hỏi chưa trả lời được
--      + trí nhớ phiên theo tài khoản
-- ------------------------------------------------------------
-- Mục đích:
--  - cau_hoi_chua_tra_loi: các câu Cokba chưa trả lời được hoặc
--    nằm ngoài phạm vi, gom theo câu đã chuẩn hóa để quản trị
--    xem tần suất tại /quan-tri/nhat-ky-cokba và quyết định bổ
--    sung dữ liệu/cải thiện bộ não. Việc GHI đi qua server action
--    dùng admin client (service role) nên KHÔNG mở policy insert
--    cho anon/authenticated.
--  - tro_ly_tri_nho: slot trí nhớ phiên của Cokba (món đang bàn,
--    số người ăn, nguyên liệu đang có, gia vị đã xác nhận...)
--    cho người dùng ĐÃ ĐĂNG NHẬP, để nhớ xuyên thiết bị. Khách
--    vãng lai dùng localStorage phía client.
--
-- RLS:
--  - tro_ly_tri_nho: mỗi người chỉ đọc/ghi dòng của chính mình
--    (auth.uid() = nguoi_dung_id).
--  - cau_hoi_chua_tra_loi: chỉ admin (public.la_admin() của
--    migration 002) được select/update; không có policy insert.
--
-- Chạy lặp lại an toàn (idempotent) như lệ migration 004/007.
-- Chạy trong Supabase SQL Editor như các migration trước.
-- ============================================================

-- ---------- 1. BẢNG cau_hoi_chua_tra_loi ----------
create table if not exists public.cau_hoi_chua_tra_loi (
  id uuid primary key default gen_random_uuid(),
  cau_hoi text not null,
  cau_hoi_chuan_hoa text not null,
  so_lan int not null default 1,
  nguoi_dung_id uuid references public.profiles(id) on delete set null,
  lan_hoi_gan_nhat timestamptz not null default now(),
  trang_thai text not null default 'cho_xu_ly'
    check (trang_thai in ('cho_xu_ly', 'da_xu_ly', 'bo_qua')),
  tao_luc timestamptz not null default now()
);

create unique index if not exists cau_hoi_chua_tra_loi_chuan_hoa_idx
  on public.cau_hoi_chua_tra_loi (cau_hoi_chuan_hoa);

create index if not exists cau_hoi_chua_tra_loi_trang_thai_idx
  on public.cau_hoi_chua_tra_loi (trang_thai, so_lan desc);

alter table public.cau_hoi_chua_tra_loi enable row level security;

drop policy if exists "Admin xem nhat ky Cokba" on public.cau_hoi_chua_tra_loi;
create policy "Admin xem nhat ky Cokba"
  on public.cau_hoi_chua_tra_loi for select
  using (public.la_admin());

drop policy if exists "Admin cap nhat nhat ky Cokba" on public.cau_hoi_chua_tra_loi;
create policy "Admin cap nhat nhat ky Cokba"
  on public.cau_hoi_chua_tra_loi for update
  using (public.la_admin())
  with check (public.la_admin());

-- Cố ý KHÔNG tạo policy insert/delete: ghi nhật ký đi qua server
-- action với admin client (service role, bỏ qua RLS).

-- ---------- 2. BẢNG tro_ly_tri_nho ----------
create table if not exists public.tro_ly_tri_nho (
  nguoi_dung_id uuid primary key references public.profiles(id) on delete cascade,
  cac_slot jsonb not null default '{}'::jsonb,
  cap_nhat_luc timestamptz not null default now()
);

alter table public.tro_ly_tri_nho enable row level security;

drop policy if exists "Nguoi dung xem tri nho Cokba cua minh" on public.tro_ly_tri_nho;
create policy "Nguoi dung xem tri nho Cokba cua minh"
  on public.tro_ly_tri_nho for select
  using (auth.uid() = nguoi_dung_id);

drop policy if exists "Nguoi dung tao tri nho Cokba cua minh" on public.tro_ly_tri_nho;
create policy "Nguoi dung tao tri nho Cokba cua minh"
  on public.tro_ly_tri_nho for insert
  with check (auth.uid() = nguoi_dung_id);

drop policy if exists "Nguoi dung sua tri nho Cokba cua minh" on public.tro_ly_tri_nho;
create policy "Nguoi dung sua tri nho Cokba cua minh"
  on public.tro_ly_tri_nho for update
  using (auth.uid() = nguoi_dung_id)
  with check (auth.uid() = nguoi_dung_id);
