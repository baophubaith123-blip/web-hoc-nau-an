"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { taoSupabaseClient } from "@/lib/supabase/client";
import { capNhatAvatar } from "@/lib/actions/ho-so";
import { cn } from "@/lib/utils/cn";

interface TaiAvatarProps {
  userId: string;
  avatarUrl: string | null;
  hoTen: string;
}

/**
 * Ảnh đại diện trên trang hồ sơ: bấm vào để tải ảnh mới lên Storage (bucket "avatars",
 * thư mục theo id người dùng), sau đó lưu URL qua Server Action capNhatAvatar.
 */
export function TaiAvatar({ userId, avatarUrl, hoTen }: TaiAvatarProps) {
  const router = useRouter();
  const oChonTapRef = useRef<HTMLInputElement>(null);
  const [dangTai, setDangTai] = useState(false);

  const chuCaiDau = hoTen
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((tu) => tu[0]?.toUpperCase())
    .join("");

  const xuLyChonAnh = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const tap = e.target.files?.[0];
    e.target.value = "";
    if (!tap) return;
    if (!tap.type.startsWith("image/")) {
      toast.error("Vui lòng chọn một tệp hình ảnh");
      return;
    }
    if (tap.size > 2 * 1024 * 1024) {
      toast.error("Ảnh đại diện tối đa 2MB");
      return;
    }
    setDangTai(true);
    try {
      const supabase = taoSupabaseClient();
      const phanMoRong = tap.name.split(".").pop()?.toLowerCase() || "jpg";
      const duongDan = `${userId}/avatar-${Date.now()}.${phanMoRong}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(duongDan, tap, { upsert: true, contentType: tap.type });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(duongDan);
      const res = await capNhatAvatar(data.publicUrl);
      if (!res.thanh_cong) {
        toast.error(res.loi);
        return;
      }
      toast.success("Đã cập nhật ảnh đại diện!");
      router.refresh();
    } catch {
      toast.error("Không tải được ảnh lên, vui lòng thử lại");
    } finally {
      setDangTai(false);
    }
  };

  const xuLyXoaAnh = async () => {
    setDangTai(true);
    try {
      const res = await capNhatAvatar(null);
      if (!res.thanh_cong) {
        toast.error(res.loi);
        return;
      }
      toast.success("Đã xóa ảnh đại diện");
      router.refresh();
    } catch {
      toast.error("Không xóa được ảnh, vui lòng thử lại");
    } finally {
      setDangTai(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => oChonTapRef.current?.click()}
          disabled={dangTai}
          title="Đổi ảnh đại diện"
          className="group relative block h-24 w-24 overflow-hidden rounded-full bg-primary/10 ring-4 ring-background transition-transform hover:scale-[1.03] md:h-28 md:w-28"
        >
          {avatarUrl ? (
            <Image src={avatarUrl} alt={hoTen} fill className="object-cover" sizes="112px" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary">
              {chuCaiDau || "B"}
            </span>
          )}
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/45 text-white transition-opacity",
              dangTai ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            {dangTai ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
          </span>
        </button>
        <input
          ref={oChonTapRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={xuLyChonAnh}
        />
      </div>
      {avatarUrl && (
        <button
          type="button"
          onClick={xuLyXoaAnh}
          disabled={dangTai}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xóa ảnh
        </button>
      )}
    </div>
  );
}
