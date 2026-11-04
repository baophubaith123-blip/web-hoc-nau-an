-- ==============================================================================
-- SQL TẠO 4 TÀI KHOẢN TEST CHO 4 GIAO DIỆN (ADMIN, CHEF, SUPPORT, USER)
-- MẬT KHẨU CHUNG CHO TẤT CẢ TÀI KHOẢN: Matkhau@123
-- Chạy script này trong Supabase Dashboard -> SQL Editor (bấm "Run")
-- ==============================================================================

create extension if not exists pgcrypto;

do $$
declare
  r record;
  v_user_id uuid;
begin
  for r in select * from (values
    -- 1. Quản trị viên (/quan-tri)
    ('a1000000-0000-0000-0000-000000000001'::uuid, 'admin@hocnauan.vn', 'Quản Trị Viên Hệ Thống', 'admin', 'admin_hethong', 'Quản trị viên toàn quyền hệ thống Web Học Nấu Ăn Online.'),
    
    -- 2. Đầu bếp (/bep)
    ('c1000000-0000-0000-0000-000000000001'::uuid, 'daubep@hocnauan.vn', 'Bếp Trưởng Trần Văn Minh', 'chef', 'chef_minh', '15 năm kinh nghiệm ẩm thực truyền thống và hiện đại.'),
    
    -- 3. Nhân viên hỗ trợ (/nhan-vien)
    ('b1000000-0000-0000-0000-000000000001'::uuid, 'hotro@hocnauan.vn', 'Nhân Viên Hỗ Trợ Khách Hàng', 'support', 'support_vien', 'Chăm sóc học viên và hỗ trợ giải đáp kỹ thuật 24/7.'),
    
    -- 4. Học viên / Người dùng (/bang-dieu-khien)
    ('d1000000-0000-0000-0000-000000000001'::uuid, 'hocvien@hocnauan.vn', 'Học Viên Lê Hoàng Nam', 'user', 'hocvien_nam', 'Đam mê nấu nướng và các món ăn gia đình.')
  ) as v(id, email, ho_ten, vai_tro, username, bio)
  loop
    -- Xử lý trong auth.users
    if exists (select 1 from auth.users where email = r.email) then
      update auth.users
      set encrypted_password = crypt('Matkhau@123', gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          raw_user_meta_data = jsonb_build_object('ho_ten', r.ho_ten),
          updated_at = now()
      where email = r.email
      returning id into v_user_id;
    else
      v_user_id := r.id;
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, recovery_token, email_change, email_change_token_new
      ) values (
        '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated', r.email,
        crypt('Matkhau@123', gen_salt('bf')), now(),
        '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('ho_ten', r.ho_ten),
        now(), now(), '', '', '', ''
      );
    end if;

    -- Xử lý trong auth.identities
    if not exists (select 1 from auth.identities where user_id = v_user_id and provider = 'email') then
      insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
      values (
        gen_random_uuid(), v_user_id,
        jsonb_build_object('sub', v_user_id, 'email', r.email, 'email_verified', true),
        'email', v_user_id::text, now(), now(), now()
      );
    end if;

    -- Upsert profile với đúng vai trò
    insert into public.profiles (id, ho_ten, vai_tro, username, bio, trang_thai, updated_at)
    values (v_user_id, r.ho_ten, r.vai_tro, r.username, r.bio, 'hoat_dong', now())
    on conflict (id) do update set
      ho_ten = excluded.ho_ten,
      vai_tro = excluded.vai_tro,
      username = excluded.username,
      bio = excluded.bio,
      trang_thai = 'hoat_dong',
      updated_at = now();

  end loop;
end $$;

-- Xác nhận kết quả
select id, username, ho_ten, vai_tro, trang_thai from public.profiles where username in ('admin_hethong', 'chef_minh', 'support_vien', 'hocvien_nam');
