-- ==============================================================================
-- 004_rls_policies.sql — RLS CHO 4 BẢNG GÓI PREMIUM
-- Idempotent script: Bật RLS và thiết lập chính sách phân quyền chi tiết
-- ==============================================================================

-- 1. BẢNG goi_premium
alter table public.goi_premium enable row level security;

drop policy if exists "Ai cung xem duoc goi dang hoat dong" on public.goi_premium;
create policy "Ai cung xem duoc goi dang hoat dong"
  on public.goi_premium for select
  using (hoat_dong = true or auth.jwt() ->> 'role' = 'service_role' or exists (
    select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'
  ));

drop policy if exists "Admin toan quyen voi goi_premium" on public.goi_premium;
create policy "Admin toan quyen voi goi_premium"
  on public.goi_premium for all
  using (exists (select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'));

-- 2. BẢNG goi_nguoi_dung
alter table public.goi_nguoi_dung enable row level security;

drop policy if exists "Nguoi dung xem lich su goi cua minh" on public.goi_nguoi_dung;
create policy "Nguoi dung xem lich su goi cua minh"
  on public.goi_nguoi_dung for select
  using (nguoi_dung_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'
  ));

drop policy if exists "Admin toan quyen voi goi_nguoi_dung" on public.goi_nguoi_dung;
create policy "Admin toan quyen voi goi_nguoi_dung"
  on public.goi_nguoi_dung for all
  using (exists (select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'));

-- 3. BẢNG yeu_cau_nang_cap
alter table public.yeu_cau_nang_cap enable row level security;

drop policy if exists "Nguoi dung xem yeu cau cua minh" on public.yeu_cau_nang_cap;
create policy "Nguoi dung xem yeu cau cua minh"
  on public.yeu_cau_nang_cap for select
  using (nguoi_dung_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'
  ));

drop policy if exists "Nguoi dung tao yeu cau nang cap cho minh" on public.yeu_cau_nang_cap;
create policy "Nguoi dung tao yeu cau nang cap cho minh"
  on public.yeu_cau_nang_cap for insert
  with check (nguoi_dung_id = auth.uid());

drop policy if exists "Nguoi dung huy yeu cau cho duyet cua minh" on public.yeu_cau_nang_cap;
create policy "Nguoi dung huy yeu cau cho duyet cua minh"
  on public.yeu_cau_nang_cap for update
  using (nguoi_dung_id = auth.uid() and trang_thai = 'cho_duyet')
  with check (nguoi_dung_id = auth.uid() and trang_thai = 'da_huy');

drop policy if exists "Admin toan quyen voi yeu_cau_nang_cap" on public.yeu_cau_nang_cap;
create policy "Admin toan quyen voi yeu_cau_nang_cap"
  on public.yeu_cau_nang_cap for all
  using (exists (select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'));

-- 4. BẢNG quyen_nguoi_dung
alter table public.quyen_nguoi_dung enable row level security;

drop policy if exists "Nguoi dung xem cache quyen cua minh" on public.quyen_nguoi_dung;
create policy "Nguoi dung xem cache quyen cua minh"
  on public.quyen_nguoi_dung for select
  using (nguoi_dung_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'
  ));

drop policy if exists "Admin toan quyen voi quyen_nguoi_dung" on public.quyen_nguoi_dung;
create policy "Admin toan quyen voi quyen_nguoi_dung"
  on public.quyen_nguoi_dung for all
  using (exists (select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and vai_tro = 'admin'));
