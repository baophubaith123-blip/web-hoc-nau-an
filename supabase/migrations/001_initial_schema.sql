-- =====================================================
-- WEB HỌC NẤU ĂN ONLINE - SCHEMA (idempotent)
-- =====================================================
create extension if not exists pgcrypto;
create extension if not exists unaccent;

-- ---------- 1. PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  ho_ten text,
  avatar_url text,
  bio text,
  vai_tro text not null default 'user' check (vai_tro in ('user','chef','support','admin')),
  so_dien_thoai text,
  dia_chi text,
  ngay_sinh date,
  gioi_tinh text check (gioi_tinh in ('nam','nu','khac')),
  trang_thai text not null default 'hoat_dong' check (trang_thai in ('hoat_dong','khoa')),
  lan_dang_nhap_cuoi timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- 2. DANH MỤC ----------
create table if not exists public.danh_muc (
  id uuid primary key default gen_random_uuid(),
  ten text not null,
  slug text not null unique,
  mo_ta text,
  anh_dai_dien text,
  danh_muc_cha_id uuid references public.danh_muc(id) on delete set null,
  thu_tu int not null default 0,
  trang_thai text not null default 'hoat_dong' check (trang_thai in ('hoat_dong','an')),
  created_at timestamptz not null default now()
);

-- ---------- 3. CÔNG THỨC ----------
create table if not exists public.cong_thuc (
  id uuid primary key default gen_random_uuid(),
  tieu_de text not null,
  slug text not null unique,
  mo_ta text,
  nguyen_lieu jsonb not null default '[]'::jsonb,
  cac_buoc jsonb not null default '[]'::jsonb,
  thoi_gian_chuan_bi int not null default 0,
  thoi_gian_nau int not null default 0,
  khau_phan int not null default 1 check (khau_phan > 0),
  do_kho text not null default 'de' check (do_kho in ('de','trung_binh','kho')),
  anh_dai_dien text,
  video_url text,
  calories int,
  tac_gia_id uuid not null references public.profiles(id) on delete cascade,
  trang_thai text not null default 'nhap' check (trang_thai in ('nhap','cho_duyet','xuat_ban','luu_tru','tu_choi')),
  ly_do_tu_choi text,
  noi_bat boolean not null default false,
  luot_xem int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------- 4. CÔNG THỨC - DANH MỤC ----------
create table if not exists public.cong_thuc_danh_muc (
  cong_thuc_id uuid not null references public.cong_thuc(id) on delete cascade,
  danh_muc_id uuid not null references public.danh_muc(id) on delete cascade,
  primary key (cong_thuc_id, danh_muc_id)
);

-- ---------- 5. KHÓA HỌC ----------
create table if not exists public.khoa_hoc (
  id uuid primary key default gen_random_uuid(),
  tieu_de text not null,
  slug text not null unique,
  mo_ta text,
  mo_ta_chi_tiet text,
  anh_dai_dien text,
  video_gioi_thieu text,
  cap_do text not null default 'co_ban' check (cap_do in ('co_ban','trung_cap','nang_cao')),
  gia numeric(12,0) not null default 0 check (gia >= 0),
  mien_phi boolean not null default true,
  dau_bep_id uuid not null references public.profiles(id) on delete cascade,
  trang_thai text not null default 'nhap' check (trang_thai in ('nhap','cho_duyet','xuat_ban','luu_tru')),
  tong_thoi_gian int not null default 0,
  so_bai_hoc int not null default 0,
  co_chung_chi boolean not null default false,
  co_tai_lieu boolean not null default false,
  co_bai_tap boolean not null default false,
  ho_tro_1_1 boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- 6. BÀI HỌC ----------
create table if not exists public.bai_hoc (
  id uuid primary key default gen_random_uuid(),
  khoa_hoc_id uuid not null references public.khoa_hoc(id) on delete cascade,
  tieu_de text not null,
  mo_ta text,
  video_url text,
  tai_lieu jsonb not null default '[]'::jsonb,
  bai_tap jsonb not null default '[]'::jsonb,
  thoi_gian_phut int not null default 0,
  thu_tu int not null default 0,
  xem_truoc boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- 7. ĐĂNG KÝ KHÓA HỌC ----------
create table if not exists public.dang_ky_khoa_hoc (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  khoa_hoc_id uuid not null references public.khoa_hoc(id) on delete cascade,
  ngay_dang_ky timestamptz not null default now(),
  ngay_hoan_thanh timestamptz,
  phan_tram_tien_do int not null default 0 check (phan_tram_tien_do between 0 and 100),
  da_thanh_toan boolean not null default false,
  ma_giao_dich text,
  unique (nguoi_dung_id, khoa_hoc_id)
);

-- ---------- 8. TIẾN ĐỘ BÀI HỌC ----------
create table if not exists public.tien_do_bai_hoc (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  bai_hoc_id uuid not null references public.bai_hoc(id) on delete cascade,
  hoan_thanh boolean not null default false,
  ngay_hoan_thanh timestamptz,
  unique (nguoi_dung_id, bai_hoc_id)
);

-- ---------- 9. CÔNG THỨC ĐÃ LƯU ----------
create table if not exists public.cong_thuc_da_luu (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  cong_thuc_id uuid not null references public.cong_thuc(id) on delete cascade,
  bo_suu_tap text not null default 'Mặc định',
  ngay_luu timestamptz not null default now(),
  unique (nguoi_dung_id, cong_thuc_id)
);

-- ---------- 10. BÌNH LUẬN ----------
create table if not exists public.binh_luan (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  cong_thuc_id uuid not null references public.cong_thuc(id) on delete cascade,
  noi_dung text not null check (char_length(noi_dung) between 1 and 2000),
  binh_luan_cha_id uuid references public.binh_luan(id) on delete cascade,
  da_duyet boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------- 11. ĐÁNH GIÁ ----------
create table if not exists public.danh_gia (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  cong_thuc_id uuid not null references public.cong_thuc(id) on delete cascade,
  diem int not null check (diem between 1 and 5),
  nhan_xet text,
  created_at timestamptz not null default now(),
  unique (nguoi_dung_id, cong_thuc_id)
);

-- ---------- 12. BÀI VIẾT ----------
create table if not exists public.bai_viet (
  id uuid primary key default gen_random_uuid(),
  tieu_de text not null,
  slug text not null unique,
  tom_tat text,
  noi_dung text,
  anh_dai_dien text,
  tac_gia_id uuid not null references public.profiles(id) on delete cascade,
  danh_muc text,
  trang_thai text not null default 'nhap' check (trang_thai in ('nhap','xuat_ban','luu_tru')),
  luot_xem int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- 13. TICKET HỖ TRỢ ----------
create sequence if not exists public.seq_ma_ticket start 1000;

create table if not exists public.ticket_ho_tro (
  id uuid primary key default gen_random_uuid(),
  ma_ticket text not null unique default ('TK-' || nextval('public.seq_ma_ticket')),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  tieu_de text not null,
  noi_dung text not null,
  danh_muc text,
  do_uu_tien text not null default 'trung_binh' check (do_uu_tien in ('thap','trung_binh','cao','khan_cap')),
  trang_thai text not null default 'moi' check (trang_thai in ('moi','dang_xu_ly','cho_phan_hoi','da_giai_quyet','dong')),
  nhan_vien_ho_tro_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  dong_luc timestamptz
);

-- ---------- 14. TIN NHẮN TICKET ----------
create table if not exists public.tin_nhan_ticket (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.ticket_ho_tro(id) on delete cascade,
  nguoi_gui_id uuid not null references public.profiles(id) on delete cascade,
  noi_dung text not null check (char_length(noi_dung) between 1 and 5000),
  tep_dinh_kem jsonb not null default '[]'::jsonb,
  la_noi_bo boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- 15. THÔNG BÁO ----------
create table if not exists public.thong_bao (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  tieu_de text not null,
  noi_dung text,
  loai text not null default 'he_thong',
  lien_ket text,
  da_doc boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- 16. CẤU HÌNH HỆ THỐNG ----------
create table if not exists public.cau_hinh_he_thong (
  id uuid primary key default gen_random_uuid(),
  khoa text not null unique,
  gia_tri jsonb not null default '{}'::jsonb,
  mo_ta text,
  updated_at timestamptz not null default now()
);

-- ---------- 17. NHẬT KÝ HOẠT ĐỘNG ----------
create table if not exists public.nhat_ky_hoat_dong (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid references public.profiles(id) on delete set null,
  hanh_dong text not null,
  doi_tuong text,
  doi_tuong_id text,
  chi_tiet jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ---------- 18. BÁO CÁO VI PHẠM ----------
create table if not exists public.bao_cao_vi_pham (
  id uuid primary key default gen_random_uuid(),
  nguoi_bao_cao_id uuid not null references public.profiles(id) on delete cascade,
  loai_doi_tuong text not null check (loai_doi_tuong in ('cong_thuc','binh_luan','khoa_hoc','nguoi_dung','bai_viet')),
  doi_tuong_id uuid not null,
  ly_do text not null,
  mo_ta text,
  trang_thai text not null default 'moi' check (trang_thai in ('moi','dang_xu_ly','da_xu_ly','bo_qua')),
  nguoi_xu_ly_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- 19. THANH TOÁN ----------
create table if not exists public.thanh_toan (
  id uuid primary key default gen_random_uuid(),
  ma_giao_dich text not null unique,
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  khoa_hoc_id uuid not null references public.khoa_hoc(id) on delete restrict,
  so_tien numeric(12,0) not null check (so_tien >= 0),
  phuong_thuc text not null check (phuong_thuc in ('momo','vnpay','stripe','chuyen_khoan')),
  trang_thai text not null default 'cho_xu_ly' check (trang_thai in ('cho_xu_ly','thanh_cong','that_bai','hoan_tien')),
  ma_giao_dich_ngoai text,
  chi_tiet jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- 20. CHỨNG CHỈ ----------
create table if not exists public.chung_chi (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  khoa_hoc_id uuid not null references public.khoa_hoc(id) on delete cascade,
  ma_chung_chi text not null unique,
  ngay_cap timestamptz not null default now(),
  url_pdf text,
  unique (nguoi_dung_id, khoa_hoc_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
create index if not exists idx_profiles_vai_tro on public.profiles(vai_tro);
create index if not exists idx_danh_muc_cha on public.danh_muc(danh_muc_cha_id);
create index if not exists idx_cong_thuc_trang_thai on public.cong_thuc(trang_thai) where deleted_at is null;
create index if not exists idx_cong_thuc_tac_gia on public.cong_thuc(tac_gia_id);
create index if not exists idx_cong_thuc_noi_bat on public.cong_thuc(noi_bat) where noi_bat = true;
create index if not exists idx_ctdm_danh_muc on public.cong_thuc_danh_muc(danh_muc_id);
create index if not exists idx_khoa_hoc_dau_bep on public.khoa_hoc(dau_bep_id);
create index if not exists idx_khoa_hoc_trang_thai on public.khoa_hoc(trang_thai);
create index if not exists idx_bai_hoc_khoa_hoc on public.bai_hoc(khoa_hoc_id, thu_tu);
create index if not exists idx_dkkh_nguoi_dung on public.dang_ky_khoa_hoc(nguoi_dung_id);
create index if not exists idx_dkkh_khoa_hoc on public.dang_ky_khoa_hoc(khoa_hoc_id);
create index if not exists idx_tdbh_nguoi_dung on public.tien_do_bai_hoc(nguoi_dung_id);
create index if not exists idx_ctdl_nguoi_dung on public.cong_thuc_da_luu(nguoi_dung_id);
create index if not exists idx_binh_luan_cong_thuc on public.binh_luan(cong_thuc_id) where deleted_at is null;
create index if not exists idx_binh_luan_nguoi_dung on public.binh_luan(nguoi_dung_id);
create index if not exists idx_danh_gia_cong_thuc on public.danh_gia(cong_thuc_id);
create index if not exists idx_bai_viet_trang_thai on public.bai_viet(trang_thai);
create index if not exists idx_ticket_nguoi_dung on public.ticket_ho_tro(nguoi_dung_id);
create index if not exists idx_ticket_trang_thai on public.ticket_ho_tro(trang_thai);
create index if not exists idx_ticket_nhan_vien on public.ticket_ho_tro(nhan_vien_ho_tro_id);
create index if not exists idx_tin_nhan_ticket on public.tin_nhan_ticket(ticket_id, created_at);
create index if not exists idx_thong_bao_nguoi_dung on public.thong_bao(nguoi_dung_id, da_doc, created_at desc);
create index if not exists idx_nhat_ky_nguoi_dung on public.nhat_ky_hoat_dong(nguoi_dung_id, created_at desc);
create index if not exists idx_bao_cao_trang_thai on public.bao_cao_vi_pham(trang_thai);
create index if not exists idx_thanh_toan_nguoi_dung on public.thanh_toan(nguoi_dung_id);
create index if not exists idx_thanh_toan_khoa_hoc on public.thanh_toan(khoa_hoc_id);
create index if not exists idx_chung_chi_nguoi_dung on public.chung_chi(nguoi_dung_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Tự cập nhật updated_at
create or replace function public.cap_nhat_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['profiles','cong_thuc','khoa_hoc','binh_luan','bai_viet',
                           'ticket_ho_tro','cau_hinh_he_thong','thanh_toan']
  loop
    execute format('drop trigger if exists trg_updated_at on public.%I', t);
    execute format('create trigger trg_updated_at before update on public.%I
                    for each row execute function public.cap_nhat_updated_at()', t);
  end loop;
end $$;

-- Tạo profile khi user đăng ký
create or replace function public.tao_profile_moi()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, ho_ten, avatar_url)
  values (
    new.id,
    split_part(new.email, '@', 1) || '_' || substr(replace(new.id::text, '-', ''), 1, 4),
    coalesce(new.raw_user_meta_data->>'ho_ten', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.tao_profile_moi();

-- Cập nhật tổng số bài học / thời gian của khóa học
create or replace function public.dong_bo_khoa_hoc()
returns trigger language plpgsql security definer set search_path = public as $$
declare kh uuid := coalesce(new.khoa_hoc_id, old.khoa_hoc_id);
begin
  update public.khoa_hoc k set
    so_bai_hoc = (select count(*) from public.bai_hoc where khoa_hoc_id = kh),
    tong_thoi_gian = (select coalesce(sum(thoi_gian_phut),0) from public.bai_hoc where khoa_hoc_id = kh)
  where k.id = kh;
  return null;
end $$;

drop trigger if exists trg_dong_bo_khoa_hoc on public.bai_hoc;
create trigger trg_dong_bo_khoa_hoc
  after insert or update or delete on public.bai_hoc
  for each row execute function public.dong_bo_khoa_hoc();

-- Tự tính phần trăm tiến độ khi hoàn thành bài
create or replace function public.tinh_tien_do()
returns trigger language plpgsql security definer set search_path = public as $$
declare kh uuid; tong int; xong int; pt int;
begin
  select khoa_hoc_id into kh from public.bai_hoc where id = new.bai_hoc_id;
  select count(*) into tong from public.bai_hoc where khoa_hoc_id = kh;
  select count(*) into xong from public.tien_do_bai_hoc t
    join public.bai_hoc b on b.id = t.bai_hoc_id
    where t.nguoi_dung_id = new.nguoi_dung_id and b.khoa_hoc_id = kh and t.hoan_thanh;
  pt := case when tong = 0 then 0 else round(xong * 100.0 / tong) end;
  update public.dang_ky_khoa_hoc set
    phan_tram_tien_do = pt,
    ngay_hoan_thanh = case when pt = 100 then now() else null end
  where nguoi_dung_id = new.nguoi_dung_id and khoa_hoc_id = kh;
  return new;
end $$;

drop trigger if exists trg_tinh_tien_do on public.tien_do_bai_hoc;
create trigger trg_tinh_tien_do
  after insert or update on public.tien_do_bai_hoc
  for each row execute function public.tinh_tien_do();

-- Đóng ticket → ghi thời điểm đóng
create or replace function public.ghi_dong_luc()
returns trigger language plpgsql as $$
begin
  if new.trang_thai in ('da_giai_quyet','dong') and old.trang_thai not in ('da_giai_quyet','dong') then
    new.dong_luc = now();
  elsif new.trang_thai not in ('da_giai_quyet','dong') then
    new.dong_luc = null;
  end if;
  return new;
end $$;

drop trigger if exists trg_ghi_dong_luc on public.ticket_ho_tro;
create trigger trg_ghi_dong_luc
  before update on public.ticket_ho_tro
  for each row execute function public.ghi_dong_luc();

-- Hàm tăng lượt xem (gọi qua supabase.rpc, tránh cấp quyền UPDATE)
create or replace function public.tang_luot_xem_cong_thuc(p_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.cong_thuc set luot_xem = luot_xem + 1 where id = p_id and trang_thai = 'xuat_ban';
$$;