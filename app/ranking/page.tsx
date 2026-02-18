import { supabase } from "@/lib/supabaseClient";
import RankingClient from "./RankingClient";

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

type Agg = {
  user_id: string;
  display_name: string;
  ab: number;
  h: number;
  outs: number;
  er: number;
};

export default async function RankingPage({ searchParams }: PageProps) {
  const qsStart = searchParams?.start ?? null;
  const qsEnd = searchParams?.end ?? null;

  const fiscal = getFiscalRangeJST();
  const start = isDateStr(qsStart) ? (qsStart as string) : fiscal.start;
  const end = isDateStr(qsEnd) ? (qsEnd as string) : fiscal.end;

  const modeLabel = isDateStr(qsStart) && isDateStr(qsEnd) ? "任意期間" : "年度";

  const { data, error } = await supabase
    .from("stats")
    .select("user_id, ab, h, outs, er, games!inner(game_date), users!inner(display_name)")
    .gte("games.game_date", start)
    .lte("games.game_date", end);

  if (error) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-md space-y-4">
          <a href="/" className="text-sm underline">
            ← ホームへ
          </a>
          <h1 className="text-2xl font-bold">ランキング（{modeLabel}）</h1>
          <div className="rounded-xl border p-3 text-sm text-red-600">
            エラー: {error.message}
          </div>
        </div>
      </main>
    );
  }

  const map = new Map<string, Agg>();

  (data ?? []).forEach((r: any) => {
    const user_id = r.user_id as string;
    const name = r.users?.display_name ?? "NoName";

    if (!map.has(user_id)) {
      map.set(user_id, { user_id, display_name: name, ab: 0, h: 0, outs: 0, er: 0 });
    }
    const a = map.get(user_id)!;
    a.ab += r.ab ?? 0;
    a.h += r.h ?? 0;
    a.outs += r.outs ?? 0;
    a.er += r.er ?? 0;
  });

  const list = Array.from(map.values());

  const avgRanking = list
    .filter((x) => x.ab > 0)
    .map((x) => ({ ...x, avg: x.h / x.ab }))
    .sort((a, b) => b.avg - a.avg);

  const eraRanking = list
    .filter((x) => x.outs > 0)
    .map((x) => ({ ...x, era: (x.er * 27) / x.outs }))
    .sort((a, b) => a.era - b.era);

  const fmtAvg = (v: number) => v.toFixed(3).replace(/^0/, "");
  const fmtEra = (v: number) => v.toFixed(2);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-md space-y-6">
        <a href="/" className="text-sm underline">
          ← ホームへ
        </a>

        <header className="space-y-1">
          <h1 className="text-2xl font-bold">ランキング（{modeLabel}）</h1>
          <div className="text-sm text-gray-600">
            期間：{start} 〜 {end}
          </div>
        </header>

        <section className="space-y-2">
          <h2 className="font-semibold">打率ランキング</h2>
          {avgRanking.length === 0 ? (
            <p className="text-sm text-gray-600">データがありません</p>
          ) : (
            <ol className="space-y-2">
              {avgRanking.map((p, idx) => (
                <li key={p.user_id} className="rounded-xl border p-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {idx + 1}. {p.display_name}
                    </span>
                    <span className="font-semibold">{fmtAvg(p.avg)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    H {p.h} / AB {p.ab}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">防御率ランキング</h2>
          {eraRanking.length === 0 ? (
            <p className="text-sm text-gray-600">データがありません</p>
          ) : (
            <ol className="space-y-2">
              {eraRanking.map((p, idx) => (
                <li key={p.user_id} className="rounded-xl border p-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {idx + 1}. {p.display_name}
                    </span>
                    <span className="font-semibold">{fmtEra(p.era)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ER {p.er} / OUT {p.outs}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="rounded-xl border p-4 text-sm text-gray-700 space-y-2">
          <div className="font-semibold">任意期間の見方（URL）</div>
          <RankingClient />
          <div className="break-all text-xs text-gray-600">
            /ranking?start=2026-02-01&end=2026-02-28
          </div>
        </div>
      </div>
    </main>
  );
}
