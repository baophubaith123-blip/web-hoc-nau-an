-- Migration 006: Bo sung 2 cot con thieu cua bang thanh_toan
-- (loai_thanh_toan + goi_id theo dung dinh nghia o migration 003 muc 1.5 —
-- ban chay tren Supabase hien tai chua co 2 cot nay nen API tao URL thanh toan
-- loi PGRST204 "Could not find the 'goi_id' column"). Chay lap lai an toan.

alter table public.thanh_toan
  add column if not exists loai_thanh_toan text not null default 'goi_premium'
    check (loai_thanh_toan in ('khoa_hoc', 'goi_premium')),
  add column if not exists goi_id uuid;

alter table public.thanh_toan
  alter column khoa_hoc_id drop not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'fk_thanh_toan_goi') then
    alter table public.thanh_toan
      add constraint fk_thanh_toan_goi
      foreign key (goi_id) references public.goi_premium(id) on delete set null;
  end if;
end $$;

-- Nap lai schema cache cho PostgREST de API nhan cot moi ngay
notify pgrst, 'reload schema';
