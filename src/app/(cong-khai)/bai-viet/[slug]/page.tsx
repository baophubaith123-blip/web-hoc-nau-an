import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { taoSupabaseServer } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ChiTietBaiViet({ params }: Props) {
  const { slug } = await params;
  const supabase = await taoSupabaseServer();

  const { data: bv } = await supabase
    .from("bai_viet")
    .select("*, tac_gia:profiles(id, ho_ten, avatar_url, bio)")
    .eq("slug", slug)
    .eq("trang_thai", "xuat_ban")
    .maybeSingle();

  if (!bv) {
    notFound();
  }

  // Tăng lượt xem bài viết
  await supabase
    .from("bai_viet")
    .update({ luot_xem: (bv.luot_xem || 0) + 1 })
    .eq("id", bv.id);

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-16">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground">
        <Link href="/bai-viet">
          <ArrowLeft className="h-4 w-4" />
          Tất cả bài viết
        </Link>
      </Button>

      <div className="space-y-4 border-b pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          {bv.tieu_de}
        </h1>

        {bv.tom_tat && (
          <p className="text-base text-muted-foreground leading-relaxed italic">
            {bv.tom_tat}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={bv.tac_gia?.avatar_url || undefined} />
              <AvatarFallback>{(bv.tac_gia?.ho_ten || "U").charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {bv.tac_gia?.ho_ten || "Ban biên tập"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Calendar className="h-3 w-3" />
                <span>{new Date(bv.created_at).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>{bv.luot_xem || 0} lượt xem</span>
          </div>
        </div>
      </div>

      {bv.anh_dai_dien && (
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
          <Image
            src={bv.anh_dai_dien}
            alt={bv.tieu_de}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Nội dung bài viết */}
      <div className="prose dark:prose-invert max-w-none text-base text-foreground/90 leading-relaxed whitespace-pre-line space-y-4">
        {bv.noi_dung}
      </div>
    </article>
  );
}
