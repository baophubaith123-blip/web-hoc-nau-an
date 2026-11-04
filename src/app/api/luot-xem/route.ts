import { NextResponse, type NextRequest } from "next/server";
import { taoSupabaseClient } from "@/lib/supabase/client";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ loi: "Thiếu ID công thức" }, { status: 400 });
    }

    const supabase = taoSupabaseAdmin();
    const { error } = await supabase.rpc("tang_luot_xem_cong_thuc", { p_id: id });

    if (error) {
      console.error("[RPC TANG LUOT XEM LOI]", error);
      return NextResponse.json({ thanh_cong: false }, { status: 500 });
    }

    return NextResponse.json({ thanh_cong: true });
  } catch (e) {
    console.error("[API LUOT XEM LOI]", e);
    return NextResponse.json({ thanh_cong: false }, { status: 500 });
  }
}
