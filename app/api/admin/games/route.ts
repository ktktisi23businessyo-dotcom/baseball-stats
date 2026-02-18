import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const adminKey = process.env.ADMIN_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const key = req.headers.get("x-admin-key");
    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const game_date = String(body.game_date ?? "");
    const opponent = String(body.opponent ?? "").trim();

    if (!game_date || !/^\d{4}-\d{2}-\d{2}$/.test(game_date)) {
      return NextResponse.json({ error: "game_date is invalid" }, { status: 400 });
    }
    if (!opponent) {
      return NextResponse.json({ error: "opponent is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("games")
      .insert([{ game_date, opponent }])
      .select("id, game_date, opponent")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ game: data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
