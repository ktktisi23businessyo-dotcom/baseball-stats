export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-md space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">草野球 個人成績集計</h1>
          <p className="text-sm text-gray-600">
            LINE（LIFF）で動くMVP。試合ごとの入力 → 自動集計 → ランキング表示。
          </p>
        </header>

        <section className="rounded-xl border p-4 space-y-3">
          <h2 className="font-semibold">まずやること</h2>
          <ol className="list-decimal pl-5 text-sm space-y-2 text-gray-700">
            <li>ログイン（LIFF連携）</li>
            <li>試合一覧を見る</li>
            <li>自分の成績を入力する</li>
          </ol>
        </section>

        <section className="grid grid-cols-1 gap-3">
          <a
            href="/games"
            className="rounded-xl bg-black px-4 py-3 text-center text-white font-medium"
          >
            試合一覧へ
          </a>
          <a
            href="/me"
            className="rounded-xl border px-4 py-3 text-center font-medium"
          >
            自分の成績を見る
          </a>
          <a
            href="/ranking"
            className="rounded-xl border px-4 py-3 text-center font-medium"
          >
            ランキングを見る
          </a>
          <a
            href="/admin"
            className="rounded-xl border px-4 py-3 text-center font-medium"
          >
            管理者メニュー
          </a>
        </section>

        <footer className="pt-4 text-xs text-gray-500">
          MVP優先：入力→保存→集計→閲覧（4月始まり年度対応）
        </footer>
      </div>
    </main>
  );
}
