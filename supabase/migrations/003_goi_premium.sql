-- ==============================================================================
-- 003_goi_premium.sql — MÔ HÌNH GÓI PREMIUM (PRO THÁNG & PRO NĂM)
-- Idempotent script: chạy lại an toàn không lỗi
-- ==============================================================================

-- ---------- 1. SỬA CÁC BẢNG CŨ ----------

-- 1.1 Bảng profiles: thêm thông tin gói Pro
alter table public.profiles
  add column if not exists la_pro boolean not null default false,
  add column if not exists goi_hien_tai_id uuid,
  add column if not exists goi_het_han timestamptz;

-- 1.2 Bảng khoa_hoc: bỏ các cột thanh toán lẻ để chuyển sang quyền theo gói Pro
alter table public.khoa_hoc
  drop column if exists gia,
  drop column if exists mien_phi,
  drop column if exists co_chung_chi,
  drop column if exists co_tai_lieu,
  drop column if exists co_bai_tap,
  drop column if exists ho_tro_1_1;

-- 1.3 Bảng bai_hoc: thêm cờ Pro và video HD, tài liệu Pro
alter table public.bai_hoc
  add column if not exists chi_pro boolean not null default false,
  add column if not exists video_hd_url text,
  add column if not exists tai_lieu_pro jsonb not null default '[]'::jsonb;

-- 1.4 Bảng cong_thuc: đánh dấu công thức đăng bởi Pro
alter table public.cong_thuc
  add column if not exists tac_gia_la_pro boolean not null default false;

-- 1.5 Bảng thanh_toan: hỗ trợ thanh toán gói Premium bên cạnh khóa học
alter table public.thanh_toan
  add column if not exists loai_thanh_toan text not null default 'goi_premium' check (loai_thanh_toan in ('khoa_hoc', 'goi_premium')),
  add column if not exists goi_id uuid;

alter table public.thanh_toan
  alter column khoa_hoc_id drop not null;

-- ---------- 2. TẠO 4 BẢNG MỚI CHO GÓI PREMIUM ----------

-- 2.1 Bảng danh mục gói Premium
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

-- 2.2 Bảng lịch sử gói người dùng đã mua / được cấp
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

-- 2.3 Bảng yêu cầu nâng cấp Pro (chờ Admin duyệt)
create table if not exists public.yeu_cau_nang_cap (
  id uuid primary key default gen_random_uuid(),
  ma_yeu_cau text not null unique,
  nguoi_dung_id uuid not null references public.profiles(id) on delete cascade,
  goi_id uuid not null references public.goi_premium(id) on delete restrict,
  trang_thai text not null default 'cho_duyet' check (trang_thai in ('cho_duyet', 'da_duyet', 'tu_choi', 'da_huy')),
  thanh_toan_id uuid references public.thanh_toan(id) on delete set null,
  ly_do_tu_choi text,
  nguoi_duyet_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.4 Bảng cache quyền người dùng
create table if not exists public.quyen_nguoi_dung (
  nguoi_dung_id uuid primary key references public.profiles(id) on delete cascade,
  la_pro boolean not null default false,
  goi_hien_tai_id uuid references public.goi_premium(id) on delete set null,
  ngay_het_han timestamptz,
  cap_nhat_luc timestamptz not null default now()
);

-- Ràng buộc khóa ngoại ngược cho thanh_toan và profiles nếu chưa có
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'fk_profiles_goi_hien_tai') then
    alter table public.profiles
      add constraint fk_profiles_goi_hien_tai
      foreign key (goi_hien_tai_id) references public.goi_premium(id) on delete set null;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'fk_thanh_toan_goi') then
    alter table public.thanh_toan
      add constraint fk_thanh_toan_goi
      foreign key (goi_id) references public.goi_premium(id) on delete set null;
  end if;
end $$;

-- ---------- 3. DỮ LIỆU BAN ĐẦU 2 GÓI PRO ----------
insert into public.goi_premium (ma_goi, ten, mo_ta, thoi_han_ngay, gia, quyen_loi, thu_tu, hoat_dong)
values
  (
    'pro_thang',
    'Pro Tháng',
    'Trải nghiệm trọn vẹn toàn bộ tính năng cao cấp trong 30 ngày.',
    30,
    99000,
    '["Xem video HD 1080p sắc nét", "Tải tài liệu công thức độc quyền (PDF)", "Làm bài tập trắc nghiệm có chấm điểm", "Nhận chứng chỉ tốt nghiệp (PDF + mã QR)", "Quyền đăng tải công thức chia sẻ cộng đồng", "Huy hiệu Pro vương miện vàng", "Hỗ trợ 1-1 chuyên sâu cùng đầu bếp", "Trải nghiệm học tập không quảng cáo"]'::jsonb,
    1,
    true
  ),
  (
    'pro_nam',
    'Pro Năm',
    'Gói tiết kiệm 33% chi phí, thỏa sức nấu nướng và nhận chứng chỉ trọn năm.',
    365,
    799000,
    '["Xem video HD 1080p sắc nét", "Tải tài liệu công thức độc quyền (PDF)", "Làm bài tập trắc nghiệm có chấm điểm", "Nhận chứng chỉ tốt nghiệp (PDF + mã QR)", "Quyền đăng tải công thức chia sẻ cộng đồng", "Huy hiệu Pro vương miện vàng", "Hỗ trợ 1-1 chuyên sâu cùng đầu bếp", "Trải nghiệm học tập không quảng cáo"]'::jsonb,
    2,
    true
  )
on conflict (ma_goi) do update set
  ten = excluded.ten,
  mo_ta = excluded.mo_ta,
  thoi_han_ngay = excluded.thoi_han_ngay,
  gia = excluded.gia,
  quyen_loi = excluded.quyen_loi,
  thu_tu = excluded.thu_tu,
  hoat_dong = excluded.hoat_dong,
  updated_at = now();

-- ---------- 4. HÀM VÀ TRIGGER TỰ ĐỘNG DUYỆT NÂNG CẤP ----------

-- Hàm kiểm tra người dùng có đang là Pro hợp lệ không
create or replace function public.la_pro(p_nguoi_dung_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = p_nguoi_dung_id
      and la_pro = true
      and (goi_het_han is not null and goi_het_han > now())
  );
$$;

-- Trigger: Khi admin duyệt yêu cầu nâng cấp -> Tự động kích hoạt Pro
create or replace function public.xu_ly_duyet_nang_cap()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_goi record;
  v_ngay_bat_dau timestamptz := now();
  v_ngay_het_han timestamptz;
  v_goi_hien_tai_het_han timestamptz;
begin
  -- Chỉ xử lý khi chuyển trạng thái sang 'da_duyet'
  if new.trang_thai = 'da_duyet' and (old.trang_thai is distinct from 'da_duyet') then
    select * into v_goi from public.goi_premium where id = new.goi_id;
    if not found then
      raise exception 'Không tìm thấy gói premium tương ứng';
    end if;

    -- Lấy ngày hết hạn hiện tại nếu đang còn Pro để gia hạn tiếp nối
    select goi_het_han into v_goi_hien_tai_het_han from public.profiles where id = new.nguoi_dung_id;
    if v_goi_hien_tai_het_han is not null and v_goi_hien_tai_het_han > now() then
      v_ngay_bat_dau := v_goi_hien_tai_het_han;
    end if;
    v_ngay_het_han := v_ngay_bat_dau + (v_goi.thoi_han_ngay || ' days')::interval;

    -- 1. Cập nhật profiles
    update public.profiles
    set la_pro = true,
        goi_hien_tai_id = v_goi.id,
        goi_het_han = v_ngay_het_han,
        updated_at = now()
    where id = new.nguoi_dung_id;

    -- 2. Thêm vào lịch sử goi_nguoi_dung
    insert into public.goi_nguoi_dung (
      nguoi_dung_id, goi_id, ngay_bat_dau, ngay_het_han, trang_thai, cap_boi_admin, ghi_chu
    ) values (
      new.nguoi_dung_id, v_goi.id, v_ngay_bat_dau, v_ngay_het_han, 'hoat_dong', (new.thanh_toan_id is null), 'Duyệt yêu cầu: ' || new.ma_yeu_cau
    );

    -- 3. Cập nhật bảng cache quyen_nguoi_dung
    insert into public.quyen_nguoi_dung (
      nguoi_dung_id, la_pro, goi_hien_tai_id, ngay_het_han, cap_nhat_luc
    ) values (
      new.nguoi_dung_id, true, v_goi.id, v_ngay_het_han, now()
    )
    on conflict (nguoi_dung_id) do update set
      la_pro = true,
      goi_hien_tai_id = excluded.goi_hien_tai_id,
      ngay_het_han = excluded.ngay_het_han,
      cap_nhat_luc = now();

    -- 4. Bắn thông báo realtime cho học viên
    insert into public.thong_bao (
      nguoi_dung_id, tieu_de, noi_dung, loai, lien_ket
    ) values (
      new.nguoi_dung_id,
      '🎉 Nâng cấp Pro thành công!',
      'Yêu cầu nâng cấp gói ' || v_goi.ten || ' đã được phê duyệt. Hạn dùng đến: ' || to_char(v_ngay_het_han at time zone 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI'),
      'he_thong',
      '/goi-cua-toi'
    );
  end if;

  return new;
end $$;

drop trigger if exists trg_xu_ly_duyet_nang_cap on public.yeu_cau_nang_cap;
create trigger trg_xu_ly_duyet_nang_cap
  after update on public.yeu_cau_nang_cap
  for each row execute function public.xu_ly_duyet_nang_cap();

-- Hàm kiểm tra và thu hồi Pro khi hết hạn
create or replace function public.kiem_tra_het_han_goi()
returns void language plpgsql security definer set search_path = public as $$
begin
  -- Đánh dấu hết hạn trong goi_nguoi_dung
  update public.goi_nguoi_dung
  set trang_thai = 'het_han'
  where trang_thai = 'hoat_dong' and ngay_het_han <= now();

  -- Tắt cờ la_pro trên profiles
  update public.profiles
  set la_pro = false,
      goi_hien_tai_id = null
  where la_pro = true and goi_het_han is not null and goi_het_han <= now();

  -- Đồng bộ cache quyen_nguoi_dung
  update public.quyen_nguoi_dung
  set la_pro = false,
      goi_hien_tai_id = null,
      cap_nhat_luc = now()
  where la_pro = true and ngay_het_han is not null and ngay_het_han <= now();
end $$;
