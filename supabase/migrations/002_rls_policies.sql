-- =====================================================
-- RLS + HÀM TRỢ GIÚP + TRIGGER BẢO VỆ (idempotent)
-- =====================================================

-- ---------- 1. HÀM TRỢ GIÚP (security definer để tránh đệ quy RLS) ----------
create or replace function public.vai_tro_hien_tai()
returns text language sql stable security definer set search_path = public as $$
  select vai_tro from public.profiles where id = auth.uid() and trang_thai = 'hoat_dong'
$$;

-- Trả về id người dùng nếu tài khoản còn hoạt động (tài khoản bị khóa → null → không ghi được)
create or replace function public.uid_hop_le()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.profiles where id = auth.uid() and trang_thai = 'hoat_dong'
$$;

create or replace function public.la_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.vai_tro_hien_tai() = 'admin', false)
$$;

create or replace function public.la_support()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.vai_tro_hien_tai() in ('support','admin'), false)
$$;

create or replace function public.la_chef()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.vai_tro_hien_tai() in ('chef','admin'), false)
$$;

create or replace function public.la_chu_khoa_hoc(p_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.khoa_hoc where id = p_id and dau_bep_id = auth.uid())
$$;

-- Có quyền học: đã đăng ký và (khóa miễn phí hoặc đã thanh toán)
create or replace function public.co_quyen_hoc(p_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.dang_ky_khoa_hoc d
    join public.khoa_hoc k on k.id = d.khoa_hoc_id
    where d.nguoi_dung_id = auth.uid() and d.khoa_hoc_id = p_id
      and (d.da_thanh_toan or k.mien_phi)
  )
$$;

-- Danh sách bài học công khai (chỉ tiêu đề, KHÔNG lộ video/tài liệu)
create or replace function public.danh_sach_bai_hoc_cong_khai(p_khoa_hoc_id uuid)
returns table (id uuid, tieu_de text, thoi_gian_phut int, thu_tu int, xem_truoc boolean)
language sql stable security definer set search_path = public as $$
  select b.id, b.tieu_de, b.thoi_gian_phut, b.thu_tu, b.xem_truoc
  from public.bai_hoc b join public.khoa_hoc k on k.id = b.khoa_hoc_id
  where b.khoa_hoc_id = p_khoa_hoc_id and k.trang_thai = 'xuat_ban'
  order by b.thu_tu
$$;

-- Tra cứu chứng chỉ công khai (không lộ email, id người dùng)
create or replace function public.tra_cuu_chung_chi(p_ma text)
returns table (ma_chung_chi text, ho_ten text, khoa_hoc text, ngay_cap timestamptz)
language sql stable security definer set search_path = public as $$
  select c.ma_chung_chi, p.ho_ten, k.tieu_de, c.ngay_cap
  from public.chung_chi c
  join public.profiles p on p.id = c.nguoi_dung_id
  join public.khoa_hoc k on k.id = c.khoa_hoc_id
  where c.ma_chung_chi = upper(trim(p_ma))
$$;

-- Tăng lượt xem (ghi đè hàm ở 001: có cờ để trigger bảo vệ cho phép)
create or replace function public.tang_luot_xem_cong_thuc(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform set_config('app.cho_phep_sua_luot_xem', '1', true);
  update public.cong_thuc set luot_xem = luot_xem + 1 where id = p_id and trang_thai = 'xuat_ban';
  perform set_config('app.cho_phep_sua_luot_xem', '0', true);
end $$;

-- ---------- 2. VIEW HỒ SƠ CÔNG KHAI (chỉ cột an toàn) ----------
create or replace view public.ho_so_cong_khai as
  select id, username, ho_ten, avatar_url, bio, vai_tro from public.profiles;
grant select on public.ho_so_cong_khai to anon, authenticated;

-- View điểm trung bình đánh giá
create or replace view public.cong_thuc_diem as
  select cong_thuc_id, round(avg(diem), 1) as diem_tb, count(*) as so_danh_gia
  from public.danh_gia group by cong_thuc_id;
grant select on public.cong_thuc_diem to anon, authenticated;

-- ---------- 3. TRIGGER BẢO VỆ (chặn tự nâng quyền / sửa trường nhạy cảm) ----------
create or replace function public.bao_ve_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.la_admin() then
    new.id := old.id;
    new.vai_tro := old.vai_tro;
    new.trang_thai := old.trang_thai;
  end if;
  return new;
end $$;
drop trigger if exists trg_bao_ve_profile on public.profiles;
create trigger trg_bao_ve_profile before update on public.profiles
  for each row execute function public.bao_ve_profile();

-- Tên bắt đầu bằng trg_z_ để chạy SAU trigger updated_at
create or replace function public.bao_ve_cong_thuc()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Chỉ tăng lượt xem: giữ nguyên ngày cập nhật
  if tg_op = 'UPDATE' and coalesce(current_setting('app.cho_phep_sua_luot_xem', true), '0') = '1' then
    new.updated_at := old.updated_at;
    return new;
  end if;
  if auth.uid() is not null and not public.la_admin() then
    if tg_op = 'INSERT' then
      new.noi_bat := false; new.luot_xem := 0; new.ly_do_tu_choi := null;
    else
      new.noi_bat := old.noi_bat; new.luot_xem := old.luot_xem;
      new.ly_do_tu_choi := old.ly_do_tu_choi; new.tac_gia_id := old.tac_gia_id;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_z_bao_ve_cong_thuc on public.cong_thuc;
create trigger trg_z_bao_ve_cong_thuc before insert or update on public.cong_thuc
  for each row execute function public.bao_ve_cong_thuc();

-- Chef không tự xuất bản khóa học: phải chờ admin duyệt
create or replace function public.bao_ve_khoa_hoc()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.la_admin() then
    if tg_op = 'INSERT' then
      if new.trang_thai = 'xuat_ban' then new.trang_thai := 'cho_duyet'; end if;
    else
      new.dau_bep_id := old.dau_bep_id;
      if new.trang_thai = 'xuat_ban' and old.trang_thai <> 'xuat_ban' then
        new.trang_thai := 'cho_duyet';
      end if;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_bao_ve_khoa_hoc on public.khoa_hoc;
create trigger trg_bao_ve_khoa_hoc before insert or update on public.khoa_hoc
  for each row execute function public.bao_ve_khoa_hoc();

create or replace function public.bao_ve_binh_luan()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.la_admin() then
    new.da_duyet := old.da_duyet; new.nguoi_dung_id := old.nguoi_dung_id;
    new.cong_thuc_id := old.cong_thuc_id; new.binh_luan_cha_id := old.binh_luan_cha_id;
  end if;
  return new;
end $$;
drop trigger if exists trg_bao_ve_binh_luan on public.binh_luan;
create trigger trg_bao_ve_binh_luan before update on public.binh_luan
  for each row execute function public.bao_ve_binh_luan();

create or replace function public.bao_ve_ticket()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.la_support() then
    new.nguoi_dung_id := old.nguoi_dung_id; new.ma_ticket := old.ma_ticket;
    new.nhan_vien_ho_tro_id := old.nhan_vien_ho_tro_id; new.do_uu_tien := old.do_uu_tien;
  end if;
  return new;
end $$;
drop trigger if exists trg_bao_ve_ticket on public.ticket_ho_tro;
create trigger trg_bao_ve_ticket before update on public.ticket_ho_tro
  for each row execute function public.bao_ve_ticket();

-- ---------- 4. RATE LIMITING NGAY TRONG DATABASE ----------
-- Tham số: (số lần tối đa, trong bao nhiêu phút, tên cột người gửi)
create or replace function public.gioi_han_tan_suat()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_so int;
begin
  if auth.uid() is null then return new; end if;  -- bỏ qua service role
  execute format(
    'select count(*) from public.%I where %I = $1 and created_at > now() - make_interval(mins => $2)',
    tg_table_name, tg_argv[2])
  into v_so using (to_jsonb(new) ->> tg_argv[2])::uuid, tg_argv[1]::int;
  if v_so >= tg_argv[0]::int then
    raise exception 'Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút';
  end if;
  return new;
end $$;

drop trigger if exists trg_gioi_han on public.binh_luan;
create trigger trg_gioi_han before insert on public.binh_luan
  for each row execute function public.gioi_han_tan_suat('10', '1', 'nguoi_dung_id');
drop trigger if exists trg_gioi_han on public.ticket_ho_tro;
create trigger trg_gioi_han before insert on public.ticket_ho_tro
  for each row execute function public.gioi_han_tan_suat('5', '60', 'nguoi_dung_id');
drop trigger if exists trg_gioi_han on public.tin_nhan_ticket;
create trigger trg_gioi_han before insert on public.tin_nhan_ticket
  for each row execute function public.gioi_han_tan_suat('30', '1', 'nguoi_gui_id');

-- ---------- 5. TỰ TẠO THÔNG BÁO (kích hoạt Realtime) ----------
create or replace function public.thong_bao_binh_luan()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_tac_gia uuid; v_tieu_de text; v_slug text; v_cha uuid; v_ten text;
begin
  select tac_gia_id, tieu_de, slug into v_tac_gia, v_tieu_de, v_slug
    from public.cong_thuc where id = new.cong_thuc_id;
  select coalesce(ho_ten, username) into v_ten from public.profiles where id = new.nguoi_dung_id;
  if new.binh_luan_cha_id is not null then
    select nguoi_dung_id into v_cha from public.binh_luan where id = new.binh_luan_cha_id;
    if v_cha is not null and v_cha <> new.nguoi_dung_id then
      insert into public.thong_bao (nguoi_dung_id, tieu_de, noi_dung, loai, lien_ket)
      values (v_cha, 'Có người trả lời bình luận của bạn',
              v_ten || ' đã trả lời trong "' || v_tieu_de || '"', 'tra_loi_binh_luan', '/cong-thuc/' || v_slug);
    end if;
  end if;
  if v_tac_gia <> new.nguoi_dung_id and v_tac_gia is distinct from v_cha then
    insert into public.thong_bao (nguoi_dung_id, tieu_de, noi_dung, loai, lien_ket)
    values (v_tac_gia, 'Bình luận mới',
            v_ten || ' đã bình luận về "' || v_tieu_de || '"', 'binh_luan_moi', '/cong-thuc/' || v_slug);
  end if;
  return null;
end $$;
drop trigger if exists trg_thong_bao_binh_luan on public.binh_luan;
create trigger trg_thong_bao_binh_luan after insert on public.binh_luan
  for each row execute function public.thong_bao_binh_luan();

create or replace function public.thong_bao_duyet_cong_thuc()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.trang_thai = 'cho_duyet' and new.trang_thai in ('xuat_ban','tu_choi') then
    insert into public.thong_bao (nguoi_dung_id, tieu_de, noi_dung, loai, lien_ket)
    values (
      new.tac_gia_id,
      case when new.trang_thai = 'xuat_ban' then 'Công thức đã được duyệt' else 'Công thức bị từ chối' end,
      '"' || new.tieu_de || '"' || case when new.trang_thai = 'tu_choi'
        then ' – Lý do: ' || coalesce(new.ly_do_tu_choi, 'Không nêu lý do') else '' end,
      'duyet_cong_thuc', '/cong-thuc-da-gui');
  end if;
  return null;
end $$;
drop trigger if exists trg_thong_bao_duyet on public.cong_thuc;
create trigger trg_thong_bao_duyet after update on public.cong_thuc
  for each row execute function public.thong_bao_duyet_cong_thuc();

create or replace function public.thong_bao_tin_nhan_ticket()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_t record;
begin
  if new.la_noi_bo then return null; end if;
  select ma_ticket, nguoi_dung_id, nhan_vien_ho_tro_id into v_t
    from public.ticket_ho_tro where id = new.ticket_id;
  if new.nguoi_gui_id = v_t.nguoi_dung_id then
    if v_t.nhan_vien_ho_tro_id is not null then
      insert into public.thong_bao (nguoi_dung_id, tieu_de, noi_dung, loai, lien_ket)
      values (v_t.nhan_vien_ho_tro_id, 'Người dùng phản hồi ' || v_t.ma_ticket,
              left(new.noi_dung, 120), 'ticket', '/nhan-vien/ticket/' || new.ticket_id);
    end if;
  else
    insert into public.thong_bao (nguoi_dung_id, tieu_de, noi_dung, loai, lien_ket)
    values (v_t.nguoi_dung_id, 'Hỗ trợ đã trả lời ' || v_t.ma_ticket,
            left(new.noi_dung, 120), 'ticket', '/ho-tro/' || new.ticket_id);
  end if;
  return null;
end $$;
drop trigger if exists trg_thong_bao_ticket on public.tin_nhan_ticket;
create trigger trg_thong_bao_ticket after insert on public.tin_nhan_ticket
  for each row execute function public.thong_bao_tin_nhan_ticket();

-- ---------- 6. BẬT RLS CHO 20 BẢNG ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','danh_muc','cong_thuc','cong_thuc_danh_muc','khoa_hoc','bai_hoc',
    'dang_ky_khoa_hoc','tien_do_bai_hoc','cong_thuc_da_luu','binh_luan','danh_gia','bai_viet',
    'ticket_ho_tro','tin_nhan_ticket','thong_bao','cau_hinh_he_thong','nhat_ky_hoat_dong',
    'bao_cao_vi_pham','thanh_toan','chung_chi']
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Xóa toàn bộ policy cũ trong schema public để tạo lại (idempotent)
do $$
declare r record;
begin
  for r in select tablename, policyname from pg_policies where schemaname = 'public' loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- ---------- 7. POLICIES ----------

-- 1. profiles
create policy profiles_xem on public.profiles for select
  using (id = auth.uid() or public.la_support());
create policy profiles_sua_minh on public.profiles for update
  using (id = auth.uid()) with check (id = public.uid_hop_le());
create policy profiles_admin on public.profiles for all
  using (public.la_admin()) with check (public.la_admin());

-- 2. danh_muc
create policy danh_muc_xem on public.danh_muc for select
  using (trang_thai = 'hoat_dong' or public.la_admin());
create policy danh_muc_admin on public.danh_muc for all
  using (public.la_admin()) with check (public.la_admin());

-- 3. cong_thuc
create policy cong_thuc_xem on public.cong_thuc for select
  using ((trang_thai = 'xuat_ban' and deleted_at is null) or tac_gia_id = auth.uid() or public.la_admin());
create policy cong_thuc_tao on public.cong_thuc for insert
  with check (tac_gia_id = public.uid_hop_le() and (trang_thai in ('nhap','cho_duyet') or public.la_chef()));
create policy cong_thuc_sua on public.cong_thuc for update
  using (tac_gia_id = auth.uid())
  with check (tac_gia_id = public.uid_hop_le() and (trang_thai in ('nhap','cho_duyet') or public.la_chef()));
create policy cong_thuc_admin on public.cong_thuc for all
  using (public.la_admin()) with check (public.la_admin());

-- 4. cong_thuc_danh_muc
create policy ctdm_xem on public.cong_thuc_danh_muc for select
  using (exists (select 1 from public.cong_thuc c where c.id = cong_thuc_danh_muc.cong_thuc_id));
create policy ctdm_ghi on public.cong_thuc_danh_muc for all
  using (exists (select 1 from public.cong_thuc c
    where c.id = cong_thuc_danh_muc.cong_thuc_id and (c.tac_gia_id = auth.uid() or public.la_admin())))
  with check (exists (select 1 from public.cong_thuc c
    where c.id = cong_thuc_danh_muc.cong_thuc_id and (c.tac_gia_id = public.uid_hop_le() or public.la_admin())));

-- 5. khoa_hoc
create policy khoa_hoc_xem on public.khoa_hoc for select
  using (trang_thai = 'xuat_ban' or dau_bep_id = auth.uid() or public.la_admin() or public.co_quyen_hoc(id));
create policy khoa_hoc_tao on public.khoa_hoc for insert
  with check (dau_bep_id = public.uid_hop_le() and public.la_chef());
create policy khoa_hoc_sua on public.khoa_hoc for update
  using (dau_bep_id = auth.uid() and public.la_chef())
  with check (dau_bep_id = public.uid_hop_le() and public.la_chef());
create policy khoa_hoc_admin on public.khoa_hoc for all
  using (public.la_admin()) with check (public.la_admin());

-- 6. bai_hoc (chỉ xem được nếu: xem trước / đã có quyền học / chủ khóa / admin)
create policy bai_hoc_xem on public.bai_hoc for select
  using (
    public.la_admin() or public.la_chu_khoa_hoc(khoa_hoc_id) or public.co_quyen_hoc(khoa_hoc_id)
    or (xem_truoc and exists (select 1 from public.khoa_hoc k
        where k.id = bai_hoc.khoa_hoc_id and k.trang_thai = 'xuat_ban'))
  );
create policy bai_hoc_chef on public.bai_hoc for all
  using (public.la_chef() and public.la_chu_khoa_hoc(khoa_hoc_id))
  with check (public.la_chef() and public.la_chu_khoa_hoc(khoa_hoc_id));
create policy bai_hoc_admin on public.bai_hoc for all
  using (public.la_admin()) with check (public.la_admin());

-- 7. dang_ky_khoa_hoc (user chỉ tự đăng ký khóa MIỄN PHÍ; khóa trả phí do server ghi sau thanh toán)
create policy dkkh_xem on public.dang_ky_khoa_hoc for select
  using (nguoi_dung_id = auth.uid() or public.la_chu_khoa_hoc(khoa_hoc_id) or public.la_admin());
create policy dkkh_tao on public.dang_ky_khoa_hoc for insert
  with check (
    nguoi_dung_id = public.uid_hop_le() and da_thanh_toan = false and phan_tram_tien_do = 0
    and ngay_hoan_thanh is null and ma_giao_dich is null
    and exists (select 1 from public.khoa_hoc k
      where k.id = dang_ky_khoa_hoc.khoa_hoc_id and k.mien_phi and k.trang_thai = 'xuat_ban')
  );
create policy dkkh_admin on public.dang_ky_khoa_hoc for all
  using (public.la_admin()) with check (public.la_admin());

-- 8. tien_do_bai_hoc
create policy tdbh_xem on public.tien_do_bai_hoc for select
  using (nguoi_dung_id = auth.uid() or public.la_admin());
create policy tdbh_tao on public.tien_do_bai_hoc for insert
  with check (nguoi_dung_id = public.uid_hop_le() and exists (
    select 1 from public.bai_hoc b where b.id = tien_do_bai_hoc.bai_hoc_id and public.co_quyen_hoc(b.khoa_hoc_id)));
create policy tdbh_sua on public.tien_do_bai_hoc for update
  using (nguoi_dung_id = auth.uid())
  with check (nguoi_dung_id = public.uid_hop_le() and exists (
    select 1 from public.bai_hoc b where b.id = tien_do_bai_hoc.bai_hoc_id and public.co_quyen_hoc(b.khoa_hoc_id)));

-- 9. cong_thuc_da_luu
create policy ctdl_cua_toi on public.cong_thuc_da_luu for all
  using (nguoi_dung_id = auth.uid()) with check (nguoi_dung_id = public.uid_hop_le());

-- 10. binh_luan
create policy binh_luan_xem on public.binh_luan for select
  using ((deleted_at is null and da_duyet) or nguoi_dung_id = auth.uid() or public.la_admin());
create policy binh_luan_tao on public.binh_luan for insert
  with check (nguoi_dung_id = public.uid_hop_le() and exists (
    select 1 from public.cong_thuc c
    where c.id = binh_luan.cong_thuc_id and c.trang_thai = 'xuat_ban' and c.deleted_at is null));
create policy binh_luan_sua on public.binh_luan for update
  using (nguoi_dung_id = auth.uid()) with check (nguoi_dung_id = public.uid_hop_le());
create policy binh_luan_admin on public.binh_luan for all
  using (public.la_admin()) with check (public.la_admin());

-- 11. danh_gia
create policy danh_gia_xem on public.danh_gia for select using (true);
create policy danh_gia_tao on public.danh_gia for insert
  with check (nguoi_dung_id = public.uid_hop_le() and exists (
    select 1 from public.cong_thuc c
    where c.id = danh_gia.cong_thuc_id and c.trang_thai = 'xuat_ban' and c.deleted_at is null));
create policy danh_gia_sua on public.danh_gia for update
  using (nguoi_dung_id = auth.uid()) with check (nguoi_dung_id = public.uid_hop_le());
create policy danh_gia_xoa on public.danh_gia for delete using (nguoi_dung_id = auth.uid());
create policy danh_gia_admin on public.danh_gia for all
  using (public.la_admin()) with check (public.la_admin());

-- 12. bai_viet
create policy bai_viet_xem on public.bai_viet for select
  using (trang_thai = 'xuat_ban' or public.la_admin());
create policy bai_viet_admin on public.bai_viet for all
  using (public.la_admin()) with check (public.la_admin());

-- 13. ticket_ho_tro
create policy ticket_xem on public.ticket_ho_tro for select
  using (nguoi_dung_id = auth.uid() or public.la_support());
create policy ticket_tao on public.ticket_ho_tro for insert
  with check (nguoi_dung_id = public.uid_hop_le() and trang_thai = 'moi' and nhan_vien_ho_tro_id is null);
create policy ticket_sua_minh on public.ticket_ho_tro for update
  using (nguoi_dung_id = auth.uid())
  with check (nguoi_dung_id = public.uid_hop_le() and trang_thai in ('moi','dang_xu_ly','dong'));
create policy ticket_support on public.ticket_ho_tro for update
  using (public.la_support()) with check (public.la_support());
create policy ticket_xoa on public.ticket_ho_tro for delete using (public.la_admin());

-- 14. tin_nhan_ticket (ghi chú nội bộ: user KHÔNG thấy, kể cả qua Realtime)
create policy tin_nhan_xem on public.tin_nhan_ticket for select
  using (public.la_support() or (not la_noi_bo and exists (
    select 1 from public.ticket_ho_tro t where t.id = tin_nhan_ticket.ticket_id)));
create policy tin_nhan_tao on public.tin_nhan_ticket for insert
  with check (nguoi_gui_id = public.uid_hop_le() and (
    public.la_support() or (not la_noi_bo and exists (
      select 1 from public.ticket_ho_tro t
      where t.id = tin_nhan_ticket.ticket_id and t.nguoi_dung_id = public.uid_hop_le()))));

-- 15. thong_bao
create policy thong_bao_xem on public.thong_bao for select using (nguoi_dung_id = auth.uid());
create policy thong_bao_sua on public.thong_bao for update
  using (nguoi_dung_id = auth.uid()) with check (nguoi_dung_id = auth.uid());
create policy thong_bao_xoa on public.thong_bao for delete using (nguoi_dung_id = auth.uid());
create policy thong_bao_admin on public.thong_bao for all
  using (public.la_admin()) with check (public.la_admin());

-- 16. cau_hinh_he_thong (khóa bắt đầu bằng "cong_khai." thì ai cũng đọc được)
create policy cau_hinh_xem on public.cau_hinh_he_thong for select
  using (khoa like 'cong_khai.%' or public.la_admin());
create policy cau_hinh_admin on public.cau_hinh_he_thong for all
  using (public.la_admin()) with check (public.la_admin());

-- 17. nhat_ky_hoat_dong
create policy nhat_ky_xem on public.nhat_ky_hoat_dong for select using (public.la_admin());
create policy nhat_ky_tao on public.nhat_ky_hoat_dong for insert
  with check (nguoi_dung_id = public.uid_hop_le());

-- 18. bao_cao_vi_pham
create policy bao_cao_xem on public.bao_cao_vi_pham for select
  using (nguoi_bao_cao_id = auth.uid() or public.la_admin());
create policy bao_cao_tao on public.bao_cao_vi_pham for insert
  with check (nguoi_bao_cao_id = public.uid_hop_le() and trang_thai = 'moi' and nguoi_xu_ly_id is null);
create policy bao_cao_admin on public.bao_cao_vi_pham for all
  using (public.la_admin()) with check (public.la_admin());

-- 19. thanh_toan (chỉ SERVER/service role được tạo; chef xem doanh thu khóa của mình)
create policy thanh_toan_xem on public.thanh_toan for select
  using (nguoi_dung_id = auth.uid() or public.la_chu_khoa_hoc(khoa_hoc_id) or public.la_admin());
create policy thanh_toan_admin on public.thanh_toan for all
  using (public.la_admin()) with check (public.la_admin());

-- 20. chung_chi
create policy chung_chi_xem on public.chung_chi for select
  using (nguoi_dung_id = auth.uid() or public.la_admin());
create policy chung_chi_admin on public.chung_chi for all
  using (public.la_admin()) with check (public.la_admin());

-- ---------- 8. REALTIME ----------
do $$
declare t text;
begin
  foreach t in array array['binh_luan','thong_bao','tin_nhan_ticket','ticket_ho_tro','tien_do_bai_hoc','dang_ky_khoa_hoc']
  loop
    if not exists (select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ---------- 9. STORAGE (tạo bucket + policy) ----------
insert into storage.buckets (id, name, public) values
  ('avatars','avatars',true), ('cong-thuc','cong-thuc',true),
  ('khoa-hoc','khoa-hoc',true), ('bai-viet','bai-viet',true)
on conflict (id) do nothing;

drop policy if exists "tep_xem_cong_khai" on storage.objects;
create policy "tep_xem_cong_khai" on storage.objects for select
  using (bucket_id in ('avatars','cong-thuc','khoa-hoc','bai-viet'));

-- Đường dẫn tệp phải dạng: <user_id>/ten-file.jpg
drop policy if exists "tep_ghi" on storage.objects;
create policy "tep_ghi" on storage.objects for all to authenticated
  using (
    bucket_id in ('avatars','cong-thuc','khoa-hoc','bai-viet') and (
      public.la_admin()
      or (bucket_id in ('avatars','cong-thuc') and (storage.foldername(name))[1] = auth.uid()::text)
      or (bucket_id = 'khoa-hoc' and public.la_chef() and (storage.foldername(name))[1] = auth.uid()::text)))
  with check (
    bucket_id in ('avatars','cong-thuc','khoa-hoc','bai-viet') and (
      public.la_admin()
      or (bucket_id in ('avatars','cong-thuc') and (storage.foldername(name))[1] = auth.uid()::text)
      or (bucket_id = 'khoa-hoc' and public.la_chef() and (storage.foldername(name))[1] = auth.uid()::text)));