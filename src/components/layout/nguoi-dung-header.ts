import type { layPhienHienTai } from "@/lib/supabase/server";
import type { VaiTro } from "@/types";

// Thông tin tối thiểu truyền từ Server sang Header (không đưa cả profile xuống client)
export type NguoiDungHeader = {
  id: string;
  ho_ten: string;
  email: string;
  avatar_url: string | null;
  vai_tro: VaiTro;
  la_pro?: boolean;
  goi_het_han?: string | null;
};

type Phien = NonNullable<Awaited<ReturnType<typeof layPhienHienTai>>>;

export function taoNguoiDungHeader(phien: Phien): NguoiDungHeader {
  return {
    id: phien.user.id,
    ho_ten: phien.profile.ho_ten ?? phien.profile.username ?? "Bạn",
    email: phien.user.email ?? "",
    avatar_url: phien.profile.avatar_url,
    vai_tro: phien.profile.vai_tro as VaiTro,
    la_pro: !!phien.profile.la_pro,
    goi_het_han: phien.profile.goi_het_han,
  };
}