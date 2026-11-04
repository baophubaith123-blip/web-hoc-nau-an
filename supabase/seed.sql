-- ==============================================================================
-- supabase/seed.sql — DỮ LIỆU MẪU ĐỒ ÁN TỐT NGHIỆP "HỌC NẤU ĂN ONLINE"
-- Idempotent: chạy nhiều lần an toàn không gây trùng lặp
-- ==============================================================================

create extension if not exists pgcrypto;

-- 1. TẠO 5 TÀI KHOẢN MẪU
do $$
declare
  r record;
  v_user_id uuid;
begin
  for r in select * from (values
    ('a1000000-0000-0000-0000-000000000001'::uuid, 'admin@naungon.vn', 'Matkhau@123', 'Quản Trị Viên', 'admin_hethong', 'admin', false, 'Quản trị viên toàn quyền hệ thống.'),
    ('c1000000-0000-0000-0000-000000000001'::uuid, 'chef@naungon.vn', 'Matkhau@123', 'Bếp Trưởng Trần Văn Minh', 'chef_minh', 'chef', true, '15 năm kinh nghiệm bếp Việt & Âu, chuyên gia ẩm thực truyền thống.'),
    ('b1000000-0000-0000-0000-000000000001'::uuid, 'support@naungon.vn', 'Matkhau@123', 'Nhân Viên Hỗ Trợ CSKH', 'support_vien', 'support', false, 'Bộ phận hỗ trợ kỹ thuật và học tập 24/7.'),
    ('d1000000-0000-0000-0000-000000000001'::uuid, 'user1@naungon.vn', 'Matkhau@123', 'Học Viên Pro Lê Nam', 'hocvien_pro', 'user', true, 'Thành viên Pro đam mê làm bánh và món Âu.'),
    ('d1000000-0000-0000-0000-000000000002'::uuid, 'user2@naungon.vn', 'Matkhau@123', 'Học Viên Nguyễn Hoa', 'hocvien_hoa', 'user', false, 'Người mới bắt đầu tìm hiểu công thức nấu ăn gia đình.')
  ) as v(id, email, pass, ho_ten, username, vai_tro, la_pro, bio)
  loop
    -- Auth.users
    if exists (select 1 from auth.users where id = r.id or email = r.email) then
      update auth.users
      set encrypted_password = crypt(r.pass, gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          raw_user_meta_data = jsonb_build_object('ho_ten', r.ho_ten),
          updated_at = now()
      where id = r.id or email = r.email;
      v_user_id := r.id;
    else
      v_user_id := r.id;
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
      ) values (
        '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated', r.email,
        crypt(r.pass, gen_salt('bf')), now(),
        '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('ho_ten', r.ho_ten),
        now(), now()
      );
    end if;

    -- Auth.identities
    if not exists (select 1 from auth.identities where user_id = v_user_id and provider = 'email') then
      insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
      values (
        gen_random_uuid(), v_user_id,
        jsonb_build_object('sub', v_user_id, 'email', r.email, 'email_verified', true),
        'email', v_user_id::text, now(), now(), now()
      );
    end if;

    -- Profiles
    insert into public.profiles (
      id, ho_ten, vai_tro, username, bio, la_pro, goi_het_han, trang_thai, avatar_url, updated_at
    ) values (
      v_user_id, r.ho_ten, r.vai_tro, r.username, r.bio, r.la_pro,
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
      updated_at = now();

    -- Cache quyen_nguoi_dung
    insert into public.quyen_nguoi_dung (nguoi_dung_id, la_pro, ngay_het_han, cap_nhat_luc)
    values (v_user_id, r.la_pro, case when r.la_pro then now() + interval '365 days' else null end, now())
    on conflict (nguoi_dung_id) do update set
      la_pro = excluded.la_pro,
      ngay_het_han = excluded.ngay_het_han,
      cap_nhat_luc = now();
  end loop;
end $$;

-- 2. TẠO 10 DANH MỤC
insert into public.danh_muc (id, ten, slug, mo_ta, thu_tu) values
  ('10000000-0000-0000-0000-000000000001', 'Món Việt', 'mon-viet', 'Hương vị đậm đà truyền thống ba miền Bắc - Trung - Nam', 1),
  ('10000000-0000-0000-0000-000000000002', 'Món Á', 'mon-a', 'Tinh hoa ẩm thực châu Á: Nhật Bản, Hàn Quốc, Trung Hoa, Thái Lan', 2),
  ('10000000-0000-0000-0000-000000000003', 'Món Âu', 'mon-au', 'Kỹ thuật làm bếp phương Tây tinh tế, chuẩn vị nhà hàng', 3),
  ('10000000-0000-0000-0000-000000000004', 'Món chay', 'mon-chay', 'Thanh đạm, giàu dinh dưỡng và an lành cho sức khỏe', 4),
  ('10000000-0000-0000-0000-000000000005', 'Món tráng miệng', 'mon-trang-mieng', 'Bánh ngọt, flan, chè và món tráng miệng hấp dẫn', 5),
  ('10000000-0000-0000-0000-000000000006', 'Món khai vị', 'mon-khai-vi', 'Gỏi cuốn, súp nhẹ kích thích vị giác đầu bữa tiệc', 6),
  ('10000000-0000-0000-0000-000000000007', 'Món canh/súp', 'canh-sup', 'Nước dùng thanh ngọt, bổ dưỡng cho mâm cơm sum vầy', 7),
  ('10000000-0000-0000-0000-000000000008', 'Món nướng', 'mon-nuong', 'Các món nướng than hoa, lò nướng thơm lừng đậm vị', 8),
  ('10000000-0000-0000-0000-000000000009', 'Món chiên', 'mon-chien', 'Giòn tan rụm, màu sắc bắt mắt thơm ngon khó cưỡng', 9),
  ('10000000-0000-0000-0000-000000000010', 'Đồ uống', 'do-uong', 'Trà thanh mát, cà phê truyền thống và nước ép bổ dưỡng', 10)
on conflict (slug) do update set
  ten = excluded.ten,
  mo_ta = excluded.mo_ta,
  thu_tu = excluded.thu_tu;

-- 3. TẠO 20 CÔNG THỨC MẪU CHI TIẾT
-- Tác giả: c1000000-0000-0000-0000-000000000001 (Chef Trần Văn Minh)
insert into public.cong_thuc (
  id, tieu_de, slug, mo_ta, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau,
  khau_phan, do_kho, calories, tac_gia_id, tac_gia_la_pro, trang_thai, noi_bat, luot_xem,
  anh_dai_dien, video_url
) values
  -- 1. Phở bò Hà Nội
  (
    '20000000-0000-0000-0000-000000000001',
    'Phở bò Hà Nội truyền thống',
    'pho-bo-ha-noi',
    'Hương vị phở bò cổ truyền với nước dùng trong veo, ngọt thanh tự nhiên từ xương bò hầm cùng thảo mộc hồi, quế, thảo quả nướng thơm lừng.',
    '[{"ten":"Xương ống bò","so_luong":1.5,"don_vi":"kg"},{"ten":"Thịt thăn bò","so_luong":400,"don_vi":"g"},{"ten":"Bánh phở tươi","so_luong":500,"don_vi":"g"},{"ten":"Hành tây, gừng","so_luong":2,"don_vi":"củ"},{"ten":"Hoa hồi, quế thanh, thảo quả","so_luong":1,"don_vi":"gói"},{"ten":"Hành hoa, ngò gai","so_luong":100,"don_vi":"g"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Rửa sạch xương bò, chần qua nước sôi 5 phút rồi rửa lại nước lạnh để nước dùng trong sạch.","anh":null},{"thu_tu":2,"noi_dung":"Nướng cháy xém hành tây, gừng, hoa hồi, quế và thảo quả, sau đó cạo sạch vỏ đen rồi bọc vào túi vải.","anh":null},{"thu_tu":3,"noi_dung":"Cho xương bò và túi thảo mộc vào nồi với 4 lít nước, hầm nhỏ lửa trong 3-4 giờ, thường xuyên hớt bọt.","anh":null},{"thu_tu":4,"noi_dung":"Nêm gia vị: nước mắm ngon, muối tinh, đường phèn cho nước dùng vừa vị thanh nhẹ.","anh":null},{"thu_tu":5,"noi_dung":"Chần bánh phở xếp vào tô, đặt thịt bò tái mỏng lên trên, rắc hành hoa rồi chan nước dùng thật sôi.","anh":null}]'::jsonb,
    30, 180, 4, 'trung_binh', 450,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', true, 4200,
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 2. Bún chả Hà Nội
  (
    '20000000-0000-0000-0000-000000000002',
    'Bún chả Hà Nội nướng than hoa',
    'bun-cha-ha-noi',
    'Chả viên và chả miếng nướng xém cạnh thơm phức, ăn kèm bát nước chấm chua ngọt ấm nóng và đĩa rau sống tươi mát.',
    '[{"ten":"Thịt ba chỉ","so_luong":400,"don_vi":"g"},{"ten":"Thịt nạc vai xay","so_luong":300,"don_vi":"g"},{"ten":"Bún tươi","so_luong":600,"don_vi":"g"},{"ten":"Nước hàng (nước màu)","so_luong":2,"don_vi":"muỗng"},{"ten":"Đu đủ xanh, cà rốt","so_luong":1,"don_vi":"củ"},{"ten":"Nước mắm, đường, dấm, tỏi ớt","so_luong":1,"don_vi":"phần"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Thái ba chỉ lát mỏng; thịt vai ướp hành tỏi băm, nước mắm, đường, dầu hào và nước hàng.","anh":null},{"thu_tu":2,"noi_dung":"Vo viên thịt nạc thành từng miếng dẹt; xếp thịt miếng và thịt viên lên vỉ nướng.","anh":null},{"thu_tu":3,"noi_dung":"Nướng trên than hoa đến khi thịt vàng óng xém cạnh, dậy mùi thơm nức.","anh":null},{"thu_tu":4,"noi_dung":"Pha nước chấm ấm theo tỷ lệ: 1 mắm, 1 đường, 1 dấm, 5 nước lọc; thả dưa góp đu đủ cà rốt vào.","anh":null},{"thu_tu":5,"noi_dung":"Gắp chả vào bát nước chấm, dọn kèm bún tươi và rau kinh giới, tía tô.","anh":null}]'::jsonb,
    45, 30, 4, 'trung_binh', 520,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', true, 3850,
    'https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 3. Bánh mì thịt nướng
  (
    '20000000-0000-0000-0000-000000000003',
    'Bánh mì thịt nướng giòn rụm',
    'banh-mi-thit-nuong',
    'Bánh mì vỏ giòn tan kẹp thịt nướng sả thơm lừng, pate béo ngậy cùng đồ chua chua cay hài hòa đậm chất đường phố Việt.',
    '[{"ten":"Bánh mì ổ","so_luong":4,"don_vi":"ổ"},{"ten":"Thịt nạc dăm","so_luong":300,"don_vi":"g"},{"ten":"Sả băm, tỏi băm","so_luong":3,"don_vi":"muỗng"},{"ten":"Pate gan","so_luong":100,"don_vi":"g"},{"ten":"Đồ chua cà rốt củ cải","so_luong":100,"don_vi":"g"},{"ten":"Dưa leo, ngò rí, ớt","so_luong":1,"don_vi":"phần"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Thịt nạc dăm thái mỏng ướp sả, tỏi băm, mật ong, nước mắm, tiêu trong 30 phút.","anh":null},{"thu_tu":2,"noi_dung":"Xiên thịt vào que hoặc nướng áp chảo lửa lớn cho thịt chín vàng thơm.","anh":null},{"thu_tu":3,"noi_dung":"Nướng lại ổ bánh mì cho vỏ giòn nóng hổi rồi rọc một bên bụng bánh.","anh":null},{"thu_tu":4,"noi_dung":"Quét lớp pate gan béo ngậy, xếp thịt nướng, dưa leo, đồ chua và vài cọng ngò rí.","anh":null},{"thu_tu":5,"noi_dung":"Rưới chút tương ớt cay nồng và nước sốt thịt nướng rồi thưởng thức ngay.","anh":null}]'::jsonb,
    20, 15, 4, 'de', 380,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 2900,
    'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 4. Cơm tấm sườn bì chả
  (
    '20000000-0000-0000-0000-000000000004',
    'Cơm tấm sườn bì chả Sài Gòn',
    'com-tam-suon-bi-cha',
    'Đĩa cơm tấm chuẩn vị Sài Gòn với miếng sườn cốt lết nướng mật ong thơm lừng, chả trứng hấp mềm xốp và bì trộn thính gạo.',
    '[{"ten":"Gạo tấm thơm","so_luong":300,"don_vi":"g"},{"ten":"Sườn cốt lết heo","so_luong":4,"don_vi":"miếng"},{"ten":"Trứng vịt","so_luong":3,"don_vi":"quả"},{"ten":"Thịt nạc băm, mộc nhĩ","so_luong":150,"don_vi":"g"},{"ten":"Bì heo trộn thính","so_luong":150,"don_vi":"g"},{"ten":"Mỡ hành, ớt tỏi băm","so_luong":1,"don_vi":"phần"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Ướp sườn cốt lết với nước cốt hành tỏi, sữa đặc, mật ong, nước tương và dầu hào qua đêm.","anh":null},{"thu_tu":2,"noi_dung":"Trộn thịt băm, mộc nhĩ, trứng, miến rồi hấp chín làm chả trứng thơm bùi.","anh":null},{"thu_tu":3,"noi_dung":"Nướng sườn trên lửa than vừa để thịt chín mềm mọng bên trong, vàng bóng bên ngoài.","anh":null},{"thu_tu":4,"noi_dung":"Nấu chín gạo tấm, xới cơm ra đĩa, quét mỡ hành xanh mướt lên mặt.","anh":null},{"thu_tu":5,"noi_dung":"Bày sườn, chả trứng, bì, dưa leo cà chua và chan nước mắm chua ngọt kẹo quánh.","anh":null}]'::jsonb,
    40, 35, 4, 'trung_binh', 680,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', true, 4900,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 5. Sushi cá hồi Nigiri
  (
    '20000000-0000-0000-0000-000000000005',
    'Sushi cá hồi Nigiri tươi ngon',
    'sushi-ca-hoi-nigiri',
    'Món sushi chuẩn Nhật Bản kết hợp giữa hạt cơm giấm dẻo ngọt và lát cá hồi sashimi tươi béo ngậy tan ngay đầu lưỡi.',
    '[{"ten":"Cá hồi tươi ăn sống (sashimi grade)","so_luong":300,"don_vi":"g"},{"ten":"Gạo Nhật hạt tròn","so_luong":250,"don_vi":"g"},{"ten":"Giấm sushi chuyên dụng","so_luong":3,"don_vi":"muỗng"},{"ten":"Wasabi tươi","so_luong":1,"don_vi":"tuýp"},{"ten":"Nước tương Nhật, gừng hồng","so_luong":1,"don_vi":"phần"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Nấu chín cơm gạo Nhật, trộn nhẹ tay với giấm gạo sushi, làm nguội nhanh bằng quạt.","anh":null},{"thu_tu":2,"noi_dung":"Dùng dao sắc nghiêng góc 45 độ thái cá hồi thành các lát mỏng hình chữ nhật vừa ăn.","anh":null},{"thu_tu":3,"noi_dung":"Làm ướt bàn tay với nước giấm loãng, nắm cơm thành viên thon dài vừa miệng.","anh":null},{"thu_tu":4,"noi_dung":"Chấm một chút wasabi vào giữa lát cá hồi, đặt lên viên cơm và dùng hai ngón tay miết nhẹ.","anh":null},{"thu_tu":5,"noi_dung":"Xếp sushi ra đĩa gỗ, thưởng thức cùng nước tương shoyu và gừng ngâm chua ngọt.","anh":null}]'::jsonb,
    30, 20, 2, 'kho', 320,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 2150,
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 6. Mì Ramen Tonkotsu
  (
    '20000000-0000-0000-0000-000000000006',
    'Mì Ramen Tonkotsu nước dùng xương hầm',
    'mi-ramen-tonkotsu',
    'Món mì quốc hồn quốc túy của Nhật Bản với nước dùng xương heo hầm đặc sánh màu trắng sữa, sợi mì dai ngon và thịt xá xíu Chashu mềm tan.',
    '[{"ten":"Xương ống heo, chân giò","so_luong":1,"don_vi":"kg"},{"ten":"Mì ramen sợi tươi","so_luong":4,"don_vi":"vắt"},{"ten":"Thịt ba chỉ cuộn (Chashu)","so_luong":300,"don_vi":"g"},{"ten":"Trứng lòng đào ngâm tương (Ajitsuke)","so_luong":4,"don_vi":"quả"},{"ten":"Rong biển Nori, măng khô Menma","so_luong":1,"don_vi":"gói"},{"ten":"Hành baro, mè rang","so_luong":50,"don_vi":"g"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Ninh xương heo lửa lớn liên tục trong 6-8 tiếng để tạo màu nước dùng trắng đục tự nhiên.","anh":null},{"thu_tu":2,"noi_dung":"Cuộn tròn ba chỉ heo, kho rim với xì dầu, mirin và rượu sake đến khi mềm rục.","anh":null},{"thu_tu":3,"noi_dung":"Luộc mì ramen vừa chín tới (khoảng 90 giây) rồi vớt ráo nước.","anh":null},{"thu_tu":4,"noi_dung":"Cho sốt tare vào đáy tô, múc nước dùng Tonkotsu sôi sùng sục rồi trút mì vào giữa.","anh":null},{"thu_tu":5,"noi_dung":"Xếp lát thịt Chashu, nửa quả trứng ngâm tương, rong biển, rắc mè và hành baro lên trên.","anh":null}]'::jsonb,
    40, 240, 4, 'kho', 650,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', true, 4100,
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 7. Há cảo tôm thịt Dimsum
  (
    '20000000-0000-0000-0000-000000000007',
    'Há cảo tôm thịt hấp Dimsum Quảng Đông',
    'ha-cao-tom-thit-dimsum',
    'Lớp vỏ bột tàn mì trong suốt mỏng manh bọc lấy nhân tôm tươi giòn sần sật và thịt băm ngọt đậm đà.',
    '[{"ten":"Tôm tươi bóc vỏ","so_luong":300,"don_vi":"g"},{"ten":"Thịt nạc dăm băm","so_luong":100,"don_vi":"g"},{"ten":"Bột tàn mì","so_luong":150,"don_vi":"g"},{"ten":"Bột năng","so_luong":50,"don_vi":"g"},{"ten":"Dầu mè, hạt nêm, tiêu","so_luong":1,"don_vi":"muỗng"},{"ten":"Hành lá, măng tây băm","so_luong":50,"don_vi":"g"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Trộn bột tàn mì và bột năng với nước thật sôi, nhồi bột thành khối mịn dẻo không dính tay.","anh":null},{"thu_tu":2,"noi_dung":"Tôm đập dập trộn cùng thịt băm, măng tây, dầu mè và hạt nêm quết đều cho dai dẻo.","anh":null},{"thu_tu":3,"noi_dung":"Chia bột thành từng viên nhỏ, cán thật mỏng thành hình tròn đều.","anh":null},{"thu_tu":4,"noi_dung":"Múc nhân tôm vào giữa, xếp ly hình vỏ sò khéo léo để khóa kín mép bánh.","anh":null},{"thu_tu":5,"noi_dung":"Xếp bánh vào xửng tre lót giấy nến, hấp lửa lớn 6-8 phút đến khi vỏ trong vắt.","anh":null}]'::jsonb,
    45, 10, 4, 'trung_binh', 260,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 1890,
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 8. Pizza Margherita Ý
  (
    '20000000-0000-0000-0000-000000000008',
    'Pizza Margherita sốt cà chua phô mai Ý',
    'pizza-margherita',
    'Chiếc bánh pizza trứ danh nước Ý với đế bánh nướng xốp giòn phồng rộp, phô mai Mozzarella chảy béo ngậy và lá húng tây thơm ngát.',
    '[{"ten":"Bột mì số 11 (Bread flour)","so_luong":300,"don_vi":"g"},{"ten":"Men nở khô (Instant yeast)","so_luong":4,"don_vi":"g"},{"ten":"Sốt cà chua San Marzano","so_luong":150,"don_vi":"g"},{"ten":"Phô mai Mozzarella tươi","so_luong":200,"don_vi":"g"},{"ten":"Lá húng tây tươi (Basil)","so_luong":15,"don_vi":"lá"},{"ten":"Dầu ô liu nguyên chất","so_luong":2,"don_vi":"muỗng"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Nhồi bột mì với men nở, muối và nước ấm trong 15 phút, ủ bột nở gấp đôi trong 2 giờ.","anh":null},{"thu_tu":2,"noi_dung":"Dùng tay ấn nhẹ từ giữa ra rìa để tạo hình tròn bánh, giữ viền bánh dày hơn lòng bánh.","anh":null},{"thu_tu":3,"noi_dung":"Thoa đều một lớp mỏng sốt cà chua lên mặt, xé nhỏ phô mai Mozzarella rải đều.","anh":null},{"thu_tu":4,"noi_dung":"Bật lò nướng ở nhiệt độ tối đa 250°C, nướng bánh trong 8-10 phút cho viền xém phồng rộp.","anh":null},{"thu_tu":5,"noi_dung":"Lấy pizza ra, rải lá húng tây tươi và rưới chút dầu ô liu lên trên rồi cắt miếng thưởng thức.","anh":null}]'::jsonb,
    90, 10, 3, 'trung_binh', 580,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', true, 3450,
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 9. Mì Ý Pasta Carbonara
  (
    '20000000-0000-0000-0000-000000000009',
    'Mì Ý Pasta Carbonara chuẩn vị Rome',
    'mi-y-pasta-carbonara',
    'Món mì Ý huyền thoại không dùng kem whipping cream, chỉ dùng lòng đỏ trứng béo bùi, phô mai Parmesan và thịt má heo xông khói giòn rụm.',
    '[{"ten":"Mì Spaghetti","so_luong":200,"don_vi":"g"},{"ten":"Thịt má heo xông khói (Guanciale/Bacon)","so_luong":100,"don_vi":"g"},{"ten":"Lòng đỏ trứng gà","so_luong":3,"don_vi":"quả"},{"ten":"Phô mai Parmesan mài mịn","so_luong":50,"don_vi":"g"},{"ten":"Tiêu đen đập dập","so_luong":1,"don_vi":"muỗng"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Luộc mì Spaghetti trong nước sôi có muối khoảng 8 phút cho sợi mì đạt chuẩn độ dẻo Al Dente.","anh":null},{"thu_tu":2,"noi_dung":"Thái thịt xông khói thành miếng nhỏ, áp chảo lửa vừa cho ra bớt mỡ và giòn xém.","anh":null},{"thu_tu":3,"noi_dung":"Đánh tan 3 lòng đỏ trứng cùng phô mai Parmesan mài nhuyễn và tiêu đen trong một chiếc âu nhỏ.","anh":null},{"thu_tu":4,"noi_dung":"Vớt mì vào chảo thịt nóng, tắt bếp ngay, thêm chút nước luộc mì rồi đổ hỗn hợp trứng phô mai vào đảo nhanh.","anh":null},{"thu_tu":5,"noi_dung":"Hơi nóng của mì sẽ làm chín trứng mượt mà, gắp ra đĩa rắc thêm phô mai và thưởng thức ngay.","anh":null}]'::jsonb,
    15, 12, 2, 'de', 510,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 2800,
    'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 10. Bò bít tết sốt tiêu đen
  (
    '20000000-0000-0000-0000-000000000010',
    'Bò bít tết thăn lưng sốt tiêu đen',
    'bo-bit-tet-sot-tieu-den',
    'Miếng thịt bò mềm mọng nước áp chảo cùng bơ tỏi và lá hương thảo, đượm sốt tiêu đen cay nồng đánh thức mọi giác quan.',
    '[{"ten":"Thịt thăn lưng bò (Ribeye)","so_luong":300,"don_vi":"g"},{"ten":"Bơ lạt","so_luong":30,"don_vi":"g"},{"ten":"Tỏi nguyên nhánh, hương thảo (Rosemary)","so_luong":2,"don_vi":"nhánh"},{"ten":"Tiêu đen hạt đập dập","so_luong":1,"don_vi":"muỗng"},{"ten":"Rượu vang đỏ, nước dùng bò","so_luong":50,"don_vi":"ml"},{"ten":"Muối biển, dầu ô liu","so_luong":1,"don_vi":"muỗng"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Dùng giấy thấm khô miếng bò, rắc đều muối biển và tiêu đen lên hai mặt thịt trước khi áp chảo 5 phút.","anh":null},{"thu_tu":2,"noi_dung":"Làm nóng chảo gang thật rực, cho dầu ô liu vào rồi áp chảo miếng bò mỗi mặt 2 phút.","anh":null},{"thu_tu":3,"noi_dung":"Hạ lửa, cho bơ lạt, tỏi và hương thảo vào; nghiêng chảo múc bơ tan rưới liên tục lên bề mặt thịt.","anh":null},{"thu_tu":4,"noi_dung":"Gắp thịt ra đĩa để thịt nghỉ 5-7 phút cho nước ngọt phân bổ đều vào từng thớ thịt.","anh":null},{"thu_tu":5,"noi_dung":"Tận dụng chảo bò chế rượu vang, nước dùng và tiêu đen nấu sệt lại làm sốt tiêu chan lên thịt.","anh":null}]'::jsonb,
    15, 10, 2, 'trung_binh', 490,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 3600,
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 11. Đậu hũ sốt cà chua
  (
    '20000000-0000-0000-0000-000000000011',
    'Đậu hũ sốt cà chua thanh đạm',
    'dau-hu-sot-ca-chua',
    'Món ăn dân dã mà đậm đà hao cơm với từng miếng đậu chiên vàng ngấm đều sốt cà chua sánh đỏ, dậy mùi hành hoa thơm phức.',
    '[{"ten":"Đậu hũ trắng","so_luong":4,"don_vi":"miếng"},{"ten":"Cà chua chín mọng","so_luong":3,"don_vi":"quả"},{"ten":"Hành hoa, hành khô","so_luong":3,"don_vi":"nhánh"},{"ten":"Hạt nêm chay, nước mắm chay, đường","so_luong":1,"don_vi":"muỗng"},{"ten":"Dầu ăn","so_luong":50,"don_vi":"ml"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Cắt đậu hũ thành khối vuông vừa ăn, thấm khô nước rồi chiên vàng đều các mặt trên chảo dầu.","anh":null},{"thu_tu":2,"noi_dung":"Cà chua băm nhuyễn; hành khô thái mỏng phi thơm trên chảo dầu nóng.","anh":null},{"thu_tu":3,"noi_dung":"Trút cà chua vào xào nhuyễn mịn, thêm chút nước lọc, nêm hạt nêm chay và đường vừa vị.","anh":null},{"thu_tu":4,"noi_dung":"Thả các miếng đậu hũ đã chiên vào chảo sốt, đậy vung om lửa nhỏ 5 phút cho ngấm sâu gia vị.","anh":null},{"thu_tu":5,"noi_dung":"Rắc hành hoa thái nhỏ lên trên, tắt bếp và múc ra đĩa dùng cùng cơm nóng.","anh":null}]'::jsonb,
    10, 15, 3, 'de', 210,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 1600,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 12. Salad rau củ sốt mè rang
  (
    '20000000-0000-0000-0000-000000000012',
    'Salad rau củ sốt mè rang thanh mát',
    'salad-rau-cu-sot-me-rang',
    'Đĩa salad rực rỡ sắc màu tươi ngon, giàu chất xơ và vitamin kết hợp cùng nước sốt mè rang thơm bùi hấp dẫn.',
    '[{"ten":"Xà lách Romaine, xà lách mỡ","so_luong":200,"don_vi":"g"},{"ten":"Cà chua bi","so_luong":10,"don_vi":"quả"},{"ten":"Dưa leo baby","so_luong":2,"don_vi":"trái"},{"ten":"Bắp ngọt luộc chín","so_luong":50,"don_vi":"g"},{"ten":"Nước sốt mè rang Kewpie","so_luong":4,"don_vi":"muỗng"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Rửa sạch rau xà lách, ngâm nước muối loãng 10 phút rồi vớt ra quay ráo nước hoàn toàn.","anh":null},{"thu_tu":2,"noi_dung":"Cà chua bi bổ đôi, dưa leo thái lát mỏng tròn hoặc hình vát chéo.","anh":null},{"thu_tu":3,"noi_dung":"Bày rau xà lách xuống đáy tô lớn, xếp cà chua bi, dưa leo và bắp ngọt lên trên.","anh":null},{"thu_tu":4,"noi_dung":"Rưới đều nước sốt mè rang lên khắp bề mặt đĩa salad ngay trước khi ăn.","anh":null},{"thu_tu":5,"noi_dung":"Trộn nhẹ tay và thưởng thức vị giòn mát rượi thanh mát sảng khoái.","anh":null}]'::jsonb,
    15, 0, 2, 'de', 150,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 1420,
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 13. Bánh flan caramel
  (
    '20000000-0000-0000-0000-000000000013',
    'Bánh flan caramel mềm mịn núng nính',
    'banh-flan-caramel',
    'Từng chiếc bánh flan thơm lừng mùi trứng sữa, không bị rỗ mặt, ăn kèm nước caramel ngọt đắng nhẹ và đá bào cà phê.',
    '[{"ten":"Trứng gà tươi","so_luong":5,"don_vi":"quả"},{"ten":"Sữa tươi không đường","so_luong":400,"don_vi":"ml"},{"ten":"Sữa đặc Ông Thọ","so_luong":120,"don_vi":"g"},{"ten":"Đường cát trắng","so_luong":80,"don_vi":"g"},{"ten":"Nước cốt chanh, vani","so_luong":1,"don_vi":"muỗng"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Đun đường với chút nước không khuấy đến khi ngả màu cánh gián, thêm nước cốt chanh rồi tráng đáy khuôn.","anh":null},{"thu_tu":2,"noi_dung":"Khuấy đều sữa tươi và sữa đặc làm ấm khoảng 50°C trên bếp.","anh":null},{"thu_tu":3,"noi_dung":"Đánh tan nhẹ 3 quả trứng nguyên và 2 lòng đỏ, rót từ từ sữa ấm vào khuấy một chiều nhẹ nhàng.","anh":null},{"thu_tu":4,"noi_dung":"Lọc hỗn hợp trứng sữa qua rây 2 lần cho thật mịn rồi rót vào các hũ caramel.","anh":null},{"thu_tu":5,"noi_dung":"Hấp cách thủy lửa thật nhỏ trong 30 phút hoặc nướng cách thủy ở 150°C, để lạnh trước khi dùng.","anh":null}]'::jsonb,
    25, 30, 6, 'de', 220,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 3100,
    'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 14. Chè ba màu Nam Bộ
  (
    '20000000-0000-0000-0000-000000000014',
    'Chè ba màu Nam Bộ nước cốt dừa',
    'che-ba-mau-nam-bo',
    'Ly chè bắt mắt với ba tầng rực rỡ từ đậu đỏ ngọt bùi, đậu xanh béo mịn và thạch lá dứa giòn dai hòa quyện nước cốt dừa béo ngậy.',
    '[{"ten":"Đậu đỏ hạt","so_luong":150,"don_vi":"g"},{"ten":"Đậu xanh không vỏ","so_luong":150,"don_vi":"g"},{"ten":"Lá dứa tươi xay lấy nước","so_luong":50,"don_vi":"ml"},{"ten":"Bột rau câu giòn (Agar)","so_luong":10,"don_vi":"g"},{"ten":"Nước cốt dừa đậm đặc","so_luong":250,"don_vi":"ml"},{"ten":"Đường phèn, bột năng","so_luong":1,"don_vi":"phần"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Hầm chín nhừ đậu đỏ với đường phèn; đậu xanh hấp chín rồi sên nhuyễn mịn cùng đường cát.","anh":null},{"thu_tu":2,"noi_dung":"Nấu bột rau câu với nước cốt lá dứa tạo màu xanh mướt, để đông rồi thái sợi dài vừa ăn.","anh":null},{"thu_tu":3,"noi_dung":"Nấu sôi nước cốt dừa cùng chút bột năng và nhúm muối cho sánh sệt béo ngậy.","anh":null},{"thu_tu":4,"noi_dung":"Múc vào ly một lớp đậu đỏ, tiếp đến lớp đậu xanh sên, trên cùng là thạch lá dứa giòn xanh.","anh":null},{"thu_tu":5,"noi_dung":"Chan nước cốt dừa thơm béo và thêm thật nhiều đá bào lên trên rồi trộn đều.","anh":null}]'::jsonb,
    30, 45, 4, 'de', 310,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 2450,
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 15. Gỏi cuốn tôm thịt
  (
    '20000000-0000-0000-0000-000000000015',
    'Gỏi cuốn tôm thịt chấm tương đen',
    'goi-cuon-tom-thit',
    'Món ăn nhẹ tươi mát nổi tiếng toàn cầu, cuốn khéo léo với tôm đỏ au, thịt luộc thái mỏng, bún tươi và rau hẹ thanh nhã.',
    '[{"ten":"Tôm sú tươi","so_luong":300,"don_vi":"g"},{"ten":"Thịt ba chỉ heo","so_luong":300,"don_vi":"g"},{"ten":"Bánh tráng dẻo mỏng","so_luong":1,"don_vi":"xấp"},{"ten":"Bún tươi","so_luong":300,"don_vi":"g"},{"ten":"Rau xà lách, rau thơm, hẹ","so_luong":200,"don_vi":"g"},{"ten":"Tương đen bơ đậu phộng, hành phi","so_luong":1,"don_vi":"chén"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Luộc tôm chín đỏ lột vỏ xẻ đôi lưng; luộc thịt ba chỉ chín tới ngâm nước lạnh rồi thái lát mỏng.","anh":null},{"thu_tu":2,"noi_dung":"Làm ướt bánh tráng nhẹ tay, trải phẳng lên thớt sạch.","anh":null},{"thu_tu":3,"noi_dung":"Xếp xà lách, rau thơm, bún tươi và thịt luộc; đặt tôm đỏ úp mặt xuống bánh tráng cùng nhánh hẹ dài.","anh":null},{"thu_tu":4,"noi_dung":"Cuộn tròn chặt tay để lộ phần lưng tôm đỏ và cọng hẹ nhô ra ngoài đẹp mắt.","anh":null},{"thu_tu":5,"noi_dung":"Pha tương đen xào bơ đậu phộng rắc đậu phộng rang giã nhỏ chấm kèm.","anh":null}]'::jsonb,
    20, 15, 4, 'de', 240,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 3300,
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 16. Chả giò hải sản
  (
    '20000000-0000-0000-0000-000000000016',
    'Chả giò hải sản mayonnaise giòn rụm',
    'cha-gio-hai-san',
    'Cuốn chả giò rế chiên vàng ươm với nhân tôm mực ngọt lịm hòa quyện cùng sốt mayonnaise béo thơm ngậy.',
    '[{"ten":"Tôm sú tươi lột vỏ","so_luong":200,"don_vi":"g"},{"ten":"Mực ống tươi thái hạt lựu","so_luong":150,"don_vi":"g"},{"ten":"Bánh tráng rế cuốn chả giò","so_luong":1,"don_vi":"gói"},{"ten":"Cà rốt, hành tây hạt lựu","so_luong":1,"don_vi":"củ"},{"ten":"Sốt Mayonnaise","so_luong":4,"don_vi":"muỗng"},{"ten":"Dầu chiên bánh","so_luong":300,"don_vi":"ml"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Chần sơ tôm mực băm nhỏ, trộn đều cùng cà rốt, hành tây và sốt mayonnaise.","anh":null},{"thu_tu":2,"noi_dung":"Trải bánh tráng rế, múc một muỗng nhân vào giữa rồi cuốn tròn thon dài vừa vặn.","anh":null},{"thu_tu":3,"noi_dung":"Đun nóng dầu ăn đến 170°C, thả chả giò vào chiên ngập dầu lửa vừa.","anh":null},{"thu_tu":4,"noi_dung":"Chiên đến khi vỏ rế chuyển màu vàng ươm giòn rụm thì vớt ra giấy thấm dầu.","anh":null},{"thu_tu":5,"noi_dung":"Bày ra đĩa ăn kèm tương ớt hoặc sốt xí muội chua cay bùng nổ hương vị.","anh":null}]'::jsonb,
    25, 15, 4, 'de', 340,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 2750,
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 17. Canh chua cá lóc Nam Bộ
  (
    '20000000-0000-0000-0000-000000000017',
    'Canh chua cá lóc Nam Bộ chuẩn vị',
    'canh-chua-ca-loc-nam-bo',
    'Bát canh chua bốc khói nghi ngút thơm ngát ngò gai rau ngổ, vị chua thanh thoát từ me chín và cá lóc đồng chắc ngọt thịt.',
    '[{"ten":"Cá lóc đồng làm sạch","so_luong":500,"don_vi":"g"},{"ten":"Me vắt chua","so_luong":50,"don_vi":"g"},{"ten":"Bạc hà (dọc mùng), đậu bắp","so_luong":100,"don_vi":"g"},{"ten":"Thơm (dứa), cà chua","so_luong":1,"don_vi":"quả"},{"ten":"Giá đỗ tươi, rau ngổ, ngò gai","so_luong":100,"don_vi":"g"},{"ten":"Nước mắm ngon, ớt sừng","so_luong":2,"don_vi":"muỗng"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Cá lóc cắt khúc ướp chút nước mắm, tiêu trong 15 phút. Dằm me với nước sôi lọc lấy nước cốt.","anh":null},{"thu_tu":2,"noi_dung":"Phi thơm tỏi băm, xào sơ cà chua và thơm cho lên màu nước đẹp.","anh":null},{"thu_tu":3,"noi_dung":"Đổ 1.2 lít nước vào đun sôi, trút nước cốt me và thả cá lóc vào nấu chín vớt bọt liên tục.","anh":null},{"thu_tu":4,"noi_dung":"Thả bạc hà, đậu bắp vào nấu 2 phút; nêm nước mắm và đường cho vị chua ngọt hài hòa.","anh":null},{"thu_tu":5,"noi_dung":"Tắt bếp, cho giá đỗ, rắc rau ngổ, ngò gai và ớt lát lên mặt, múc ra tô lớn thưởng thức.","anh":null}]'::jsonb,
    20, 20, 4, 'de', 220,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 2600,
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 18. Súp bí đỏ kem tươi
  (
    '20000000-0000-0000-0000-000000000018',
    'Súp bí đỏ kem tươi kiểu Pháp',
    'sup-bi-do-kem-tuoi',
    'Bát súp vàng óng mượt mịn như nhung, vị ngọt tự nhiên của bí đỏ hòa quyện cùng vị béo ngậy của kem tươi whipping cream.',
    '[{"ten":"Bí đỏ chín vàng","so_luong":500,"don_vi":"g"},{"ten":"Hành tây","so_luong":1,"don_vi":"củ"},{"ten":"Bơ lạt","so_luong":30,"don_vi":"g"},{"ten":"Nước dùng gà hầm","so_luong":400,"don_vi":"ml"},{"ten":"Kem tươi (Whipping cream)","so_luong":80,"don_vi":"ml"},{"ten":"Bánh mì nướng bơ tỏi ăn kèm","so_luong":2,"don_vi":"lát"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Gọt vỏ bí đỏ thái khối nhỏ; hành tây thái hạt lựu.","anh":null},{"thu_tu":2,"noi_dung":"Làm tan bơ trong nồi, xào hành tây cho thơm trong rồi trút bí đỏ vào đảo đều 5 phút.","anh":null},{"thu_tu":3,"noi_dung":"Đổ nước dùng gà vào nấu sôi nhỏ lửa 15-20 phút đến khi bí chín mềm nhừ.","anh":null},{"thu_tu":4,"noi_dung":"Dùng máy xay cầm tay xay nhuyễn mịn súp ngay trong nồi, nêm nhúm muối và tiêu trắng.","anh":null},{"thu_tu":5,"noi_dung":"Múc súp ra bát, vẽ đường viền kem tươi lên mặt và thưởng thức cùng bánh mì bơ tỏi giòn.","anh":null}]'::jsonb,
    15, 20, 3, 'de', 180,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 1950,
    'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 19. Cà phê sữa đá truyền thống
  (
    '20000000-0000-0000-0000-000000000019',
    'Cà phê sữa đá pha phin truyền thống',
    'ca-phe-sua-da-truyen-thong',
    'Thức uống biểu tượng của văn hóa Việt Nam, đậm đà vị cà phê Robusta nguyên chất quyện lẫn vị ngọt béo ngậy của sữa đặc và đá lạnh mát rượi.',
    '[{"ten":"Bột cà phê Robusta rang xay mộc","so_luong":25,"don_vi":"g"},{"ten":"Sữa đặc có đường","so_luong":40,"don_vi":"ml"},{"ten":"Nước sôi 95°C","so_luong":100,"don_vi":"ml"},{"ten":"Đá viên sạch","so_luong":1,"don_vi":"ly"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Tráng phin nhôm qua nước sôi cho nóng, cho sữa đặc vào đáy ly thủy tinh.","anh":null},{"thu_tu":2,"noi_dung":"Cho 25g bột cà phê vào phin, lắc nhẹ cho phẳng mặt rồi đặt gài nén nhẹ tay.","anh":null},{"thu_tu":3,"noi_dung":"Rót 20ml nước sôi vào đáy phin ủ cà phê nở đều trong 2 phút.","anh":null},{"thu_tu":4,"noi_dung":"Rót tiếp 60ml nước sôi lên trên, đậy nắp chờ từng giọt cà phê đậm đặc chiết xuất xuống ly.","anh":null},{"thu_tu":5,"noi_dung":"Dùng thìa khuấy tan đều sữa đặc và cà phê, rót vào ly đầy đá viên rồi thưởng thức.","anh":null}]'::jsonb,
    5, 7, 1, 'de', 160,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 3900,
    'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ),

  -- 20. Trà đào cam sả
  (
    '20000000-0000-0000-0000-000000000020',
    'Trà đào cam sả thanh nhiệt giải khát',
    'tra-dao-cam-sa',
    'Thức uống thanh mát giải nhiệt hoàn hảo với hương sả thơm dìu dịu, vị chua ngọt từ cam tươi và từng miếng đào ngâm giòn sần sật.',
    '[{"ten":"Trà túi lọc hương đào (Cozy/Lipton)","so_luong":2,"don_vi":"gói"},{"ten":"Cam vàng Mỹ","so_luong":1,"don_vi":"quả"},{"ten":"Cây sả tươi đập dập","so_luong":3,"don_vi":"cây"},{"ten":"Đào ngâm đóng hộp kèm siro","so_luong":3,"don_vi":"miếng"},{"ten":"Nước đường mía","so_luong":20,"don_vi":"ml"},{"ten":"Đá viên","so_luong":1,"don_vi":"ly"}]'::jsonb,
    '[{"thu_tu":1,"noi_dung":"Đập dập 3 cây sả nấu cùng 300ml nước sôi trong 5 phút để lấy nước hương sả thơm.","anh":null},{"thu_tu":2,"noi_dung":"Ngâm 2 túi trà đào vào nước sả nóng trong 3-5 phút rồi vớt túi lọc ra.","anh":null},{"thu_tu":3,"noi_dung":"Vắt lấy nước cốt nửa quả cam vàng; nửa quả còn lại cắt lát tròn để trang trí.","anh":null},{"thu_tu":4,"noi_dung":"Pha nước trà sả cùng nước cam, siro đào và nước đường khuấy đều trong bình lắc cùng đá.","anh":null},{"thu_tu":5,"noi_dung":"Rót ra ly, xếp các miếng đào ngâm và lát cam vàng lên trên, trang trí nhánh sả tươi.","anh":null}]'::jsonb,
    10, 5, 2, 'de', 120,
    'c1000000-0000-0000-0000-000000000001', true, 'xuat_ban', false, 3700,
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  )
on conflict (slug) do update set
  tieu_de = excluded.tieu_de,
  mo_ta = excluded.mo_ta,
  nguyen_lieu = excluded.nguyen_lieu,
  cac_buoc = excluded.cac_buoc,
  thoi_gian_chuan_bi = excluded.thoi_gian_chuan_bi,
  thoi_gian_nau = excluded.thoi_gian_nau,
  khau_phan = excluded.khau_phan,
  do_kho = excluded.do_kho,
  calories = excluded.calories,
  tac_gia_id = excluded.tac_gia_id,
  tac_gia_la_pro = excluded.tac_gia_la_pro,
  trang_thai = excluded.trang_thai,
  noi_bat = excluded.noi_bat,
  luot_xem = excluded.luot_xem,
  anh_dai_dien = excluded.anh_dai_dien,
  video_url = excluded.video_url,
  updated_at = now();

-- 4. TẠO 5 KHÓA HỌC MẪU
insert into public.khoa_hoc (
  id, tieu_de, slug, mo_ta, anh_dai_dien, cap_do, giang_vien_id, trang_thai, noi_bat, so_bai_hoc, tong_thoi_gian
) values
  ('30000000-0000-0000-0000-000000000001', 'Nấu ăn cơ bản cho người mới bắt đầu', 'nau-an-co-ban-cho-nguoi-moi', 'Khóa học nhập môn trang bị kỹ năng dùng dao, chế biến nhiệt và gia vị.', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', 'co_ban', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', true, 2, 60),
  ('30000000-0000-0000-0000-000000000002', 'Ẩm thực Việt Nam truyền thống ba miền', 'am-thuc-viet-nam-truyen-thong', 'Bí quyết nước dùng phở, bún chả và các món kho đậm đà chuẩn vị quê hương.', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800', 'trung_cap', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', true, 2, 75),
  ('30000000-0000-0000-0000-000000000003', 'Làm bánh Âu cơ bản tại nhà', 'lam-banh-au-co-ban', 'Kỹ thuật nhồi bột, ủ bột và làm các món bánh nướng Pháp, Ý kinh điển.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', 'chuyen_sau', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', false, 2, 90),
  ('30000000-0000-0000-0000-000000000004', 'Ẩm thực chay thanh đạm & dinh dưỡng', 'am-thuc-chay-thanh-dam', 'Cân bằng vi chất dinh dưỡng và biến tấu rau củ quả thành món ăn hấp dẫn.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800', 'co_ban', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', false, 2, 50),
  ('30000000-0000-0000-0000-000000000005', 'Nghệ thuật pha chế đồ uống hiện đại', 'pha-che-do-uong-hien-dai', 'Kỹ thuật pha cà phê, trà trái cây và sinh tố chuẩn barista chuyên nghiệp.', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800', 'co_ban', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', false, 2, 45)
on conflict (slug) do update set
  tieu_de = excluded.tieu_de,
  mo_ta = excluded.mo_ta,
  anh_dai_dien = excluded.anh_dai_dien,
  cap_do = excluded.cap_do,
  giang_vien_id = excluded.giang_vien_id,
  trang_thai = excluded.trang_thai,
  noi_bat = excluded.noi_bat,
  so_bai_hoc = excluded.so_bai_hoc,
  tong_thoi_gian = excluded.tong_thoi_gian;

-- 5. TẠO 10 BÀI HỌC MẪU (2 bài / khóa học, có bài Free xem thử và bài Pro HD)
insert into public.bai_hoc (
  id, khoa_hoc_id, tieu_de, mo_ta, video_url, video_hd_url, chi_pro, thoi_gian_phut, thu_tu, xem_truoc,
  tai_lieu, tai_lieu_pro, bai_tap
) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Bài 1: Kỹ thuật cầm dao và các nhát cắt cơ bản', 'Luyện tập cắt sợi julienne, xúc xắc brunoise và bảo quản dao bén.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false, 30, 1, true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Bài 2: Điều chỉnh nhiệt độ chảo và kỹ năng áp chảo', 'Bí quyết căn nhiệt giúp thực phẩm chín đều không bị dai khô.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 30, 2, false, '[]'::jsonb, '[{"ten":"So_tay_nhiet_do_nau_an.pdf","url":"#"}]'::jsonb, '[{"cau_hoi":"Áp chảo bò nên để chảo ở mức nhiệt nào?","cac_lua_chon":["Nhiệt độ thật cao","Nhiệt độ thấp","Nhiệt độ trung bình","Để nguội"],"dap_an_dung":0,"giai_thich":"Chảo gang thật nóng giúp xém mặt ngoài và giữ nước ngọt bên trong."}]'::jsonb),

  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'Bài 1: Nấu nước dùng phở bò trong veo ngọt thanh', 'Kỹ thuật khử mùi xương bò và nướng hồi quế thảo quả chuẩn vị Hà Nội.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false, 40, 1, true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', 'Bài 2: Pha nước mắm bún chả và ướp thịt nướng than', 'Tỷ lệ mắm đường dấm vàng óng và kỹ thuật giữ thịt mềm mọng nước.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 35, 2, false, '[]'::jsonb, '[{"ten":"Bi_quyet_gia_vi_truyen_thong.pdf","url":"#"}]'::jsonb, '[]'::jsonb),

  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000003', 'Bài 1: Hiểu về các loại men và bột mì', 'Phân biệt bột số 8, số 11, số 13 và cách kích hoạt men nở thành công.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false, 45, 1, true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000003', 'Bài 2: Kỹ thuật nhồi bột bánh mì bằng tay chuẩn màng', 'Cách kéo màng mỏng gluten và canh thời điểm bánh nở đẹp nhất.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 45, 2, false, '[]'::jsonb, '[{"ten":"Bang_nhiet_do_lo_nuong.pdf","url":"#"}]'::jsonb, '[]'::jsonb),

  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000004', 'Bài 1: Nấu nước dùng rau củ ngọt tự nhiên', 'Dùng bắp ngọt, củ cải, cà rốt và mía lau tạo vị ngọt thay mì chính.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false, 25, 1, true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('40000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000004', 'Bài 2: Chế biến món nấm đùi gà kho tiêu xanh', 'Cách sơ chế nấm giòn sần sật ngấm đậm sốt tiêu xanh cay the.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 25, 2, false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb),

  ('40000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000005', 'Bài 1: Kỹ thuật ủ trà đậm đà không bị chát', 'Căn chỉnh nhiệt độ nước 85-90°C và thời gian hãm trà trái cây.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false, 20, 1, true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb),
  ('40000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000005', 'Bài 2: Làm milk foam kem mặn béo ngậy', 'Đánh bông kem whipping và phô mai tươi bồng bềnh phủ trên ly trà.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 25, 2, false, '[]'::jsonb, '[{"ten":"Cong_thuc_milk_foam.pdf","url":"#"}]'::jsonb, '[]'::jsonb)
on conflict (id) do update set
  khoa_hoc_id = excluded.khoa_hoc_id,
  tieu_de = excluded.tieu_de,
  mo_ta = excluded.mo_ta,
  video_url = excluded.video_url,
  video_hd_url = excluded.video_hd_url,
  chi_pro = excluded.chi_pro,
  thoi_gian_phut = excluded.thoi_gian_phut,
  thu_tu = excluded.thu_tu,
  xem_truoc = excluded.xem_truoc,
  tai_lieu_pro = excluded.tai_lieu_pro,
  bai_tap = excluded.bai_tap;

-- 6. TẠO 5 BÀI VIẾT BLOG MẪU
insert into public.bai_viet (
  id, tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, tac_gia_id, trang_thai, luot_xem
) values
  ('50000000-0000-0000-0000-000000000001', '10 mẹo làm bếp thông minh cho người mới bắt đầu', '10-meo-lam-bep-thong-minh', 'Tổng hợp những mẹo vặt hữu ích giúp bạn sơ chế nhanh hơn và giữ trọn hương vị tươi ngon của nguyên liệu.', 'Nấu ăn là một nghệ thuật nhưng cũng là một môn khoa học đòi hỏi sự quan sát tỉ mỉ...', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', 1200),
  ('50000000-0000-0000-0000-000000000002', 'Bí quyết chọn thịt bò và cá tươi ngon chuẩn nhà hàng', 'bi-quyet-chon-thit-bo-ca-tuoi-ngon', 'Hướng dẫn cách nhận biết thớ thịt bò đỏ hồng đàn hồi và mắt cá tươi trong veo không bị tanh.', 'Một món ăn ngon bắt đầu từ khâu tuyển chọn nguyên liệu chuẩn mực nhất...', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', 980),
  ('50000000-0000-0000-0000-000000000003', 'Bảo quản rau củ trong tủ lạnh tươi xanh suốt 2 tuần', 'bao-quan-rau-cu-tu-lanh-2-tuan', 'Kỹ thuật bọc khăn giấy giữ ẩm và phân loại trái cây sinh khí ethylene thông minh.', 'Tủ lạnh không phải là chiếc hộp thần kỳ nếu bạn không nắm vững kỹ thuật bảo quản độ ẩm...', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', 1450),
  ('50000000-0000-0000-0000-000000000004', '5 dụng cụ nhà bếp thiết yếu mọi căn bếp đều nên có', '5-dung-cu-nha-bep-thiet-yeu', 'Đầu tư đúng vào một con dao đầu bếp sắc bén, chảo gang chất lượng và thớt gỗ tự nhiên.', 'Không cần mua sắm quá nhiều đồ đạc cồng kềnh, chỉ cần sở hữu 5 món bảo bối cốt lõi...', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', 830),
  ('50000000-0000-0000-0000-000000000005', 'Nghệ thuật trình bày đĩa ăn bắt mắt như MasterChef', 'nghe-thuat-trinh-bay-dia-an-masterchef', 'Nguyên tắc tương phản màu sắc, quy tắc số lẻ và kỹ thuật vẽ nước sốt chấm phá tinh tế.', 'Con người thưởng thức món ăn bằng mắt trước khi chạm đũa nếm thử hương vị...', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', 2100)
on conflict (slug) do update set
  tieu_de = excluded.tieu_de,
  tom_tat = excluded.tom_tat,
  noi_dung = excluded.noi_dung,
  anh_dai_dien = excluded.anh_dai_dien,
  trang_thai = excluded.trang_thai,
  luot_xem = excluded.luot_xem;

-- 7. TẠO 20 BÌNH LUẬN & 30 ĐÁNH GIÁ MẪU
do $$
declare
  r_ct record;
begin
  for r_ct in select id from public.cong_thuc limit 20 loop
    -- Bình luận mẫu
    insert into public.binh_luan (cong_thuc_id, nguoi_dung_id, noi_dung)
    values
      (r_ct.id, 'd1000000-0000-0000-0000-000000000001', 'Công thức hướng dẫn rất chi tiết, tôi làm theo và cả nhà đều khen ngon tuyệt vời!')
    on conflict do nothing;

    -- Đánh giá sao mẫu (5 sao và 4 sao)
    insert into public.danh_gia (cong_thuc_id, nguoi_dung_id, so_sao, noi_dung)
    values
      (r_ct.id, 'd1000000-0000-0000-0000-000000000001', 5, 'Chuẩn vị nhà hàng, công thức cực kỳ tâm huyết!')
    on conflict do nothing;

    insert into public.danh_gia (cong_thuc_id, nguoi_dung_id, so_sao, noi_dung)
    values
      (r_ct.id, 'd1000000-0000-0000-0000-000000000002', 4, 'Món ăn ngon miệng, hướng dẫn dễ hiểu cho người mới tập nấu.')
    on conflict do nothing;
  end loop;
end $$;