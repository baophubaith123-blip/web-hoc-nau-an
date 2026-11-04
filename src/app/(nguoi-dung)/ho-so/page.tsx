import { FormHoSoClient } from "./form-ho-so-client";
import { yeuCauVaiTro } from "@/lib/supabase/server";

export default async function TrangHoSo() {
  const phien = await yeuCauVaiTro();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Quản lý thông tin cá nhân và thiết lập bảo mật tài khoản
        </p>
      </div>

      <FormHoSoClient profile={phien.profile} />
    </div>
  );
}
