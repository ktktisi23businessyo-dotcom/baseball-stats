import { supabase } from "@/lib/supabaseClient";

type PageProps = {
  params: { id: string };
};

export default async function AdminGameDetailPage({ params }: PageProps) {
  const gameId = params.id;

  // 試合情報取得
  const { data: game } = await supabase
    .from("games")
    .select("id, game_date, opponent")
    .eq("id", gameId)
    .single();

  // 入力済みユーザー取得
  const { data: stats } = await supabase
    .from("stats")
    .select("user_id, users!inner(display_name)")
    .eq("game_id", gameId);

  const enteredUsers =
    stats?.map((s: any) => ({
      user_id: s.user_id,
      display_name: s.users?.display_name ?? "NoName",
    })) ?? [];

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-md space-y-4">

        <a href="/admin/games" className="text-sm underline">
          ← 入力状況一覧へ
        </a>

        <h1 className="text-2xl font-bold">入力状況詳細</h1>

        {game && (
          <div className="rounded-xl border p-4">
            <div className="font-semibold">{game.opponent}</div>
            <div className="text-sm text-gray-600">{game.game_date}</div>
          </div>
        )}

        <div className="rounded-xl border p-4 space-y-2">
          <div className="font-semibold">
            入力済み人数：{enteredUsers.length} 人
          </div>

          {enteredUsers.length === 0 ? (
            <p className="text-sm text-gray-600">まだ入力者はいません</p>
          ) : (
            <ul className="space-y-2">
              {enteredUsers.map((u) => (
                <li
                  key={u.user_id}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  {u.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
