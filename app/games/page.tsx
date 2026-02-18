import { supabase } from "@/lib/supabaseClient";

export default async function GamesPage() {
  const { data, error } = await supabase
    .from("games")
    .select("id, game_date, opponent")
    .order("game_date", { ascending: false });

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-md space-y-4">
        <a href="/" className="text-sm underline">
          ← ホームへ
        </a>

        <h1 className="text-2xl font-bold">試合一覧</h1>

        {error && (
          <div className="rounded-xl border p-3 text-sm text-red-600">
            接続エラー: {error.message}
          </div>
        )}

        {!error && (!data || data.length === 0) && (
          <p className="text-sm text-gray-600">
            まだ試合がありません
          </p>
        )}

        {!error && data && data.length > 0 && (
          <div className="space-y-2">
            {data.map((g) => (
              <a
                key={g.id}
                href={`/games/${g.id}`}
                className="block rounded-xl border p-3 hover:bg-gray-50 transition"
              >
                <div className="font-medium">{g.opponent}</div>
                <div className="text-xs text-gray-500">{g.game_date}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
