import { supabase } from "@/lib/supabaseClient";

export default async function AdminGamesPage() {
  const { data: games, error } = await supabase
    .from("games")
    .select("id, game_date, opponent")
    .order("game_date", { ascending: false });

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-md space-y-4">

        <a href="/admin" className="text-sm underline">
          ← 管理者メニューへ
        </a>

        <h1 className="text-2xl font-bold">入力状況確認</h1>

        {error && (
          <div className="rounded-xl border p-3 text-sm text-red-600">
            エラー: {error.message}
          </div>
        )}

        {games?.map((g) => (
          <a
            key={g.id}
            href={`/admin/games/${g.id}`}
            className="block rounded-xl border p-3 hover:bg-gray-50"
          >
            <div className="font-medium">{g.opponent}</div>
            <div className="text-xs text-gray-500">{g.game_date}</div>
          </a>
        ))}

      </div>
    </main>
  );
}
