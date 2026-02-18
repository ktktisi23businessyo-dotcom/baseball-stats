import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const game_id = String(body.game_id ?? "");
    const user_id = String(body.user_id ?? "");
    const ab = Number(body.ab ?? 0);
    const h = Number(body.h ?? 0);
    const outs = Number(body.outs ?? 0);
    const er = Number(body.er ?? 0);

    // バリデーション
    if (!game_id || !user_id) {
      return NextResponse.json({ error: "game_id and user_id required" }, { status: 400 });
    }

    if (
      ab < 0 ||
      h < 0 ||
      outs < 0 ||
      er < 0 ||
      !Number.isInteger(ab) ||
      !Number.isInteger(h) ||
      !Number.isInteger(outs) ||
      !Number.isInteger(er)
    ) {
      return NextResponse.json({ error: "invalid numeric input" }, { status: 400 });
    }

    if (h > ab) {
      return NextResponse.json({ error: "H cannot exceed AB" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("stats")
      .upsert(
        [
          {
            game_id,
            user_id,
            ab,
            h,
            outs,
            er,
            updated_at: new Date().toISOString()
          }
        ],
        { onConflict: "game_id,user_id" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stat: data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}