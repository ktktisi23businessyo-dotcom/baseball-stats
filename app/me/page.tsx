import { supabase } from "@/lib/supabaseClient";

function getFiscalRangeJST() {
  const now = new Date();
  const jst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

  const year = jst.getFullYear();
  const month = jst.getMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;

  const start = `${startYear}-04-01`;
  const end = `${startYear + 1}-03-31`;
  return { start, end };
}

function isDateStr(v: string | null) {
  return !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

type PageProps = {
  searchParams?: { start?: string; end?: string };
};

export default async function MePage({ searchParams }: PageProps) {
  const userId = "af3aaadb-8c20-4fa6-a7ee-08971c0352c2";

  const qsStart = searchParams?.start ?? null;
  const qsEnd = searchParams?.end ?? null;

  const fiscal = getFiscalRangeJST();

  const start = isDateStr(qsStart) ? (qsStart as string) : fiscal.start;
  const end = isDateStr(qsEnd) ? (qsEnd as string) : fiscal.end;

  const modeLabel = isDateStr(qsStart) && isDateStr(qsEnd) ? "任意期間" : "年度";

  const { data, error } = await supabase
    .from("stats")
    .select("ab, h, outs, er, games!inner(game_date)")
    .eq("user_id", userId)
    .gte("games.game_date", start)
    .lte("games.game_date", end);

  const totals = (data ?? []).reduce(
    (acc, r: any) => {
      acc.ab += r.ab ?? 0;
      acc.h += r.h ?? 0;
      acc.outs += r.outs ?? 0;
      acc.er += r.er ?? 0;
      return acc;
    },
    { ab: 0, h: 0, outs: 0, er: 0 }
  );

  const avg =
    totals.ab > 0 ? (totals.h / totals.ab).toFixed(3).replace(/^0/, "") : "-";

  const era =
    totals.outs > 0 ? ((totals.er * 27) / totals.outs).toFixed(2) : "-";

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-md space-y-4">
        <a href="/" className="text-sm underline">
          ← ホームへ
        </a>

        <h1 className="text-2xl font-bold">自分の成績（{modeLabel}）</h1>

        <div className="text-sm text-gray-600">
          集計期間：{start} 〜 {end}
        </div>

        {error && (
          <div className="rounded-xl border p-3 text-sm text-red-600">
            エラー: {error.message}
          </div>
        )}

        {!error && (
          <div className="rounded-xl border p-4 space-y-2">
            <div className="flex justify-between">
              <span>打数 AB</span>
              <span className="font-semibold">{totals.ab}</span>
            </div>
            <div className="flex justify-between">
              <span>安打 H</span>
              <span className="font-semibold">{totals.h}</span>
            </div>
            <div className="flex justify-between">
              <span>打率 AVG</span>
              <span className="font-semibold">{avg}</span>
            </div>

            <hr />

            <div className="flex justify-between">
              <span>投球アウト OUT</span>
              <span className="font-semibold">{totals.outs}</span>
            </div>
            <div className="flex justify-between">
              <span>自責点 ER</span>
              <span className="font-semibold">{totals.er}</span>
            </div>
            <div className="flex justify-between">
              <span>防御率 ERA</span>
              <span className="font-semibold">{era}</span>
            </div>
          </div>
        )}

        <div className="rounded-xl border p-4 text-sm text-gray-700 space-y-2">
          <div className="font-semibold">任意期間の見方（URL）</div>
          <div className="break-all text-xs text-gray-600">
            /me?start=2026-02-01&end=2026-02-28
          </div>
          <div className="text-xs text-gray-500">
            次のStepでカレンダー入力UIを付けます（URL打たなくてOKにする）。
          </div>
        </div>
      </div>
    </main>
  );
}
