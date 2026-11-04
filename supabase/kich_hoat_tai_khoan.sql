-- ==============================================================================
-- supabase/kich_hoat_tai_khoan.sql
-- TỔNG HỢP TOÀN DIỆN:
-- 1. Thêm cột Gói Pro vào profiles, cong_thuc, bai_hoc (Migration 003)
-- 2. Tạo 4 bảng Gói Premium + 2 gói Pro Tháng & Pro Năm
-- 3. Tạo/Cập nhật toàn bộ tài khoản test (Admin, Chef, Support, Pro User, Free User)
-- MẬT KHẨU CHUNG CHO TẤT CẢ TÀI KHOẢN: Matkhau@123
-- ==============================================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------------------
-- PHẦN 1: BỔ SUNG CỘT GÓI PRO VÀO CÁC BẢNG HIỆN CÓ
-- ------------------------------------------------------------------------------
alter table public.profiles
  add column if not exists la_pro boolean not null default false,
  add column if not exists goi_hien_tai_id uuid,
  add column if not exists goi_het_han timestamptz;

alter table public.cong_thuc
  add column if not exists tac_gia_la_pro boolean not null default false;

alter table public.bai_hoc
  add column if not exists chi_pro boolean not null default false,
  add column if not exists video_hd_url text,
  add column if not exists tai_lieu_pro jsonb not null default '[]'::jsonb;

-- ------------------------------------------------------------------------------
-- PHẦN 2: TẠO 4 BẢNG CHO MÔ HÌNH GÓI PRO
-- ------------------------------------------------------------------------------
create table if not exists public.goi_premium (
  id uuid primary key default gen_random_uuid(),
  ma_goi text not null unique check (ma_goi in ('pro_thang', 'pro_nam')),
  ten text not null,
  mo_ta text,
  thoi_han_ngay int not null check (thoi_han_ngay in (30, 365)),
  gia numeric(12, 0) not null check (gia >= 0),
  quyen_loi jsonb not null default '[]'::jsonb,
  thu_tu int not null default 0,
  hoat_dong boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goi_nguoi_dung (
  id uuid primary key default gen_random_uuid(),
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  goi_id uuid not null references public.goi_premium(id) on delete restrict,
  ngay_bat_dau timestamptz not null default now(),
  ngay_het_han timestamptz not null,
  trang_thai text not null default 'hoat_dong' check (trang_thai in ('hoat_dong', 'het_han', 'huy')),
  cap_boi_admin boolean not null default false,
  ghi_chu text,
  created_at timestamptz not null default now()
);

create table if not exists public.yeu_cau_nang_cap (
  id uuid primary key default gen_random_uuid(),
  ma_yeu_cau text not null unique,
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  goi_id uuid not null references public.goi_premium(id) on delete restrict,
  trang_thai text not null default 'cho_duyet' check (trang_thai in ('cho_duyet', 'da_duyet', 'tu_choi', 'da_huy')),
  thanh_toan_id uuid,
  ly_do_tu_choi text,
  nguoi_duyet_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quyen_nguoi_dung (
  nguoi_dung_id uuid primary key references public.profiles(id) on delete cascade,
  la_pro boolean not null default false,
  goi_hien_tai_id uuid references public.goi_premium(id) on delete set null,
  ngay_het_han timestamptz,
  cap_nhat_luc timestamptz not null default now()
);

-- Khởi tạo sẵn 2 gói Pro chuẩn
insert into public.goi_premium (ma_goi, ten, mo_ta, thoi_han_ngay, gia, quyen_loi, thu_tu, hoat_dong)
values
  ('pro_thang', 'Pro Tháng', 'Trải nghiệm trọn vẹn toàn bộ tính năng cao cấp trong 30 ngày.', 30, 99000, '["xem_video_hd", "tai_tai_lieu", "lam_bai_tap", "nhan_chung_chi", "tao_cong_thuc", "profile_nang_cap", "ho_tro_1_1", "khong_quang_cao"]'::jsonb, 1, true),
  ('pro_nam', 'Pro Năm', 'Gói tiết kiệm 33% chi phí, thỏa sức nấu nướng và nhận chứng chỉ trọn năm.', 365, 799000, '["xem_video_hd", "tai_tai_lieu", "lam_bai_tap", "nhan_chung_chi", "tao_cong_thuc", "profile_nang_cap", "ho_tro_1_1", "khong_quang_cao"]'::jsonb, 2, true)
on conflict (ma_goi) do update set
  ten = excluded.ten,
  mo_ta = excluded.mo_ta,
  thoi_han_ngay = excluded.thoi_han_ngay,
  gia = excluded.gia,
  quyen_loi = excluded.quyen_loi,
  updated_at = now();

-- Hàm kiểm tra Pro
create or replace function public.la_pro(p_nguoi_dung_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = p_nguoi_dung_id
      and la_pro = true
      and (goi_het_han is not null and goi_het_han > now())
  );
$$;

-- ------------------------------------------------------------------------------
-- PHẦN 3: KÍCH HOẠT VÀ ĐỒNG BỘ 5 VAI TRÒ TÀI KHOẢN TEST (MẬT KHẨU: Matkhau@123)
-- ------------------------------------------------------------------------------
do $$
declare
  r record;
begin
  for r in select * from (values
    -- 1. Quản trị viên (/quan-tri)
    ('a1000000-0000-0000-0000-000000000001'::uuid, 'admin@naungon.vn', 'Quản Trị Viên Hệ Thống', 'admin_hethong', 'admin', false, 'Quản trị viên toàn quyền hệ thống.'),
    ('a1000000-0000-0000-0000-000000000002'::uuid, 'admin@hocnauan.vn', 'Quản Trị Viên Hệ Thống', 'admin_hocnauan', 'admin', false, 'Quản trị viên toàn quyền hệ thống.'),

    -- 2. Đầu bếp (/bep)
    ('c1000000-0000-0000-0000-000000000001'::uuid, 'chef@naungon.vn', 'Bếp Trưởng Trần Văn Minh', 'chef_minh', 'chef', true, '15 năm kinh nghiệm ẩm thực truyền thống và hiện đại.'),
    ('c1000000-0000-0000-0000-000000000002'::uuid, 'daubep@hocnauan.vn', 'Bếp Trưởng Trần Văn Minh', 'chef_daubep', 'chef', true, '15 năm kinh nghiệm ẩm thực truyền thống và hiện đại.'),

    -- 3. Nhân viên hỗ trợ CSKH (/nhan-vien)
    ('b1000000-0000-0000-0000-000000000001'::uuid, 'support@naungon.vn', 'Nhân Viên Hỗ Trợ CSKH', 'support_naungon', 'support', false, 'Hỗ trợ kỹ thuật và học tập 24/7.'),
    ('b1000000-0000-0000-0000-000000000002'::uuid, 'hotro@hocnauan.vn', 'Nhân Viên Hỗ Trợ CSKH', 'support_vien', 'support', false, 'Hỗ trợ kỹ thuật và học tập 24/7.'),

    -- 4. Học viên PRO (/bang-dieu-khien, /tao-cong-thuc)
    ('d1000000-0000-0000-0000-000000000001'::uuid, 'user1@naungon.vn', 'Học Viên Pro Lê Nam', 'hocvien_pro', 'user', true, 'Thành viên Pro đam mê làm bánh và món Âu.'),
    ('d1000000-0000-0000-0000-000000000003'::uuid, 'hocvien@hocnauan.vn', 'Học Viên Lê Hoàng Nam', 'hocvien_nam', 'user', true, 'Học viên Pro có quyền tạo công thức và xem video HD.'),

    -- 5. Học viên thường - Free (/bang-dieu-khien)
    ('d1000000-0000-0000-0000-000000000002'::uuid, 'user2@naungon.vn', 'Học Viên Nguyễn Hoa', 'hocvien_hoa', 'user', false, 'Học viên gói Free cơ bản.')
  ) as v(id, email, ho_ten, username, vai_tro, la_pro, bio)
  loop
    -- Bước A: Dọn sạch bản ghi trùng email khác ID nếu có
    delete from auth.identities where identity_data->>'email' = r.email and user_id != r.id;
    delete from auth.users where email = r.email and id != r.id;

    -- Bước B: Cập nhật hoặc tạo mới trong auth.users dựa trên ID
    if exists (select 1 from auth.users where id = r.id) then
      update auth.users
      set email = r.email,
          encrypted_password = crypt('Matkhau@123', gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
          raw_user_meta_data = jsonb_build_object('ho_ten', r.ho_ten),
          updated_at = now()
      where id = r.id;
    else
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, recovery_token, email_change, email_change_token_new
      ) values (
        '00000000-0000-0000-0000-000000000000', r.id, 'authenticated', 'authenticated', r.email,
        crypt('Matkhau@123', gen_salt('bf')), now(),
        '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('ho_ten', r.ho_ten),
        now(), now(), '', '', '', ''
      );
    end if;

    -- Bước C: Đồng bộ auth.identities
    delete from auth.identities where user_id = r.id;
    insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    values (
      gen_random_uuid(), r.id,
      jsonb_build_object('sub', r.id::text, 'email', r.email, 'email_verified', true),
      'email', r.id::text, now(), now(), now()
    );

    -- Bước D: Upsert vào public.profiles
    insert into public.profiles (
      id, ho_ten, vai_tro, username, bio, la_pro, goi_het_han, trang_thai, avatar_url, updated_at
    ) values (
      r.id, r.ho_ten, r.vai_tro, r.username, r.bio, r.la_pro,
      case when r.la_pro then now() + interval '365 days' else null end,
      'hoat_dong', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', now()
    )
    on conflict (id) do update set
      ho_ten = excluded.ho_ten,
      vai_tro = excluded.vai_tro,
      username = excluded.username,
      bio = excluded.bio,
      la_pro = excluded.la_pro,
      goi_het_han = excluded.goi_het_han,
      trang_thai = 'hoat_dong',
      updated_at = now();

  end loop;
end $$;

-- Kiểm tra lại danh sách tài khoản đã kích hoạt thành công
select id, username, ho_ten, vai_tro, la_pro, trang_thai from public.profiles order by created_at desc;
