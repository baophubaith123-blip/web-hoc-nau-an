-- ============================================================
-- 009: Thùng rác (hoàn tác xóa) cho công thức / khóa học / bài viết
--      + nới CHECK gói Pro (việc tồn từ đợt 2)
-- ------------------------------------------------------------
-- Mục đích:
--  - Thống nhất XÓA MỀM cho 3 loại nội dung: dòng bị xóa được set
--    deleted_at + lưu trạng thái trước khi xóa vào
--    trang_thai_truoc_xoa, nằm trong Thùng rác tối đa 30 ngày,
--    khôi phục được về ĐÚNG trạng thái cũ; quá 30 ngày Admin dọn
--    vĩnh viễn bằng nút "Dọn thùng rác" (không cron).
--  - cong_thuc ĐÃ có deleted_at từ migration 001 — chỉ bổ sung
--    cột nhớ trạng thái. khoa_hoc / bai_viet bổ sung cả hai cột.
--
-- RLS: KHÔNG thêm / KHÔNG sửa policy nào.
--  - Việc lọc nội dung đã xóa khỏi các trang hiển thị làm ở tầng
--    ứng dụng (mọi truy vấn hiển thị lọc deleted_at IS NULL) —
--    đúng cách cong_thuc đang làm từ trước tới nay.
--  - Các thao tác thùng rác (xóa mềm / khôi phục / xóa vĩnh viễn)
--    chạy qua Server Action: action kiểm tra chủ sở hữu / vai trò
--    TƯỜNG MINH bằng client phiên trước, rồi mới ghi bằng admin
--    client (service role). Lý do không ghi bằng client phiên:
--    (1) WITH CHECK của cong_thuc_sua / bai_viet_sua chỉ cho user
--        thường đưa trang_thai về 'nhap'/'cho_duyet' — ghi bằng
--        client phiên sẽ không giữ được trạng thái xuất bản khi
--        xóa/khôi phục (đây là lý do code cũ phải ép 'nhap').
--    (2) Chưa có policy DELETE cho chủ sở hữu ở cả 3 bảng (chỉ
--        admin có FOR ALL) — xóa vĩnh viễn của chủ sở hữu sẽ bị
--        RLS chặn dù action đã kiểm tra quyền.
--    Vì quyền đã được kiểm tra tường minh trong action trước khi
--    dùng admin client, không cần nới thêm policy ghi nào.
--
-- Chạy lặp lại an toàn (idempotent) như lệ 007/008.
-- Chạy trong Supabase SQL Editor như các migration trước.
-- LƯU Ý: code đợt 3 đã được viết để chạy ĐÚNG hành vi cũ khi
-- migration này chưa được dán (suy giảm duyên dáng) — dán xong
-- thì thùng rác kích hoạt đầy đủ, không cần deploy lại.
-- ============================================================

-- ---------- 1. CÔNG THỨC: cột nhớ trạng thái trước xóa ----------
-- (deleted_at đã có từ migration 001)
alter table public.cong_thuc
  add column if not exists trang_thai_truoc_xoa text;

-- Index phục vụ trang thùng rác (liệt kê dòng đã xóa, mới nhất trước)
create index if not exists idx_cong_thuc_thung_rac
  on public.cong_thuc (deleted_at desc)
  where deleted_at is not null;

-- ---------- 2. KHÓA HỌC: xóa mềm + cột nhớ trạng thái ----------
alter table public.khoa_hoc
  add column if not exists deleted_at timestamptz;

alter table public.khoa_hoc
  add column if not exists trang_thai_truoc_xoa text;

-- Index lọc nội dung còn "sống" theo trạng thái (như idx_cong_thuc_trang_thai)
create index if not exists idx_khoa_hoc_trang_thai_song
  on public.khoa_hoc (trang_thai)
  where deleted_at is null;

create index if not exists idx_khoa_hoc_thung_rac
  on public.khoa_hoc (deleted_at desc)
  where deleted_at is not null;

-- ---------- 3. BÀI VIẾT: xóa mềm + cột nhớ trạng thái ----------
alter table public.bai_viet
  add column if not exists deleted_at timestamptz;

alter table public.bai_viet
  add column if not exists trang_thai_truoc_xoa text;

create index if not exists idx_bai_viet_trang_thai_song
  on public.bai_viet (trang_thai)
  where deleted_at is null;

create index if not exists idx_bai_viet_thung_rac
  on public.bai_viet (deleted_at desc)
  where deleted_at is not null;

-- ---------- 4. NỚI CHECK GÓI PRO (việc tồn từ đợt 2) ----------
-- Hiện trạng (migration 003): ma_goi chỉ được là 'pro_thang'/'pro_nam'
-- và thoi_han_ngay chỉ được là 30/365 — trang quản lý gói của Admin
-- không tạo được gói có mã/thời hạn khác. Nới như sau:
--  - Bỏ CHECK trên ma_goi (tính duy nhất vẫn do ràng buộc UNIQUE
--    trên cột ma_goi bảo đảm; mã gói do Admin đặt khi tạo gói).
--  - CHECK trên thoi_han_ngay nới thành chỉ cần > 0 ngày.
alter table public.goi_premium
  drop constraint if exists goi_premium_ma_goi_check;

do $$
declare c text;
begin
  select conname into c
  from pg_constraint
  where conrelid = 'public.goi_premium'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%thoi_han_ngay%';
  if c is not null then
    execute format('alter table public.goi_premium drop constraint %I', c);
  end if;
end $$;

alter table public.goi_premium
  add constraint goi_premium_thoi_han_ngay_check
  check (thoi_han_ngay > 0);
