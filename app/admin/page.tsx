"use client";

import { useState } from "react";

export default function AdminPage() {
  const [gameDate, setGameDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [status, setStatus] = useState<string>("");

  const createGame = async () => {
    setStatus("送信中...");
    try {
      const res = await fetch("/api/admin/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": "admin123",
        },
        body: JSON.stringify({ game_date: gameDate, opponent }),
      });

      const json = await res.json();
      if (!res.ok) {
        setStatus(`エラー: ${json.error ?? "unknown"}`);
        return;
      }

      setStatus(`作成OK: ${json.game.opponent} (${json.game.game_date})`);
      setGameDate("");
      setOpponent("");
    } catch {
      setStatus("通信エラー（再試行してね）");
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-bold">管理者メニュー</h1>

        <section className="grid grid-cols-1 gap-3">
          <a
            href="/admin/games"
            className="rounded-xl border px-4 py-3 text-center font-medium"
          >
            入力状況確認へ
          </a>
        </section>

        <section className="rounded-xl border p-4 space-y-3">
          <h2 className="font-semibold">試合作成（MVP）</h2>

          <label className="block text-sm space-y-1">
            <div className="text-gray-600">試合日</div>
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
            />
          </label>

          <label className="block text-sm space-y-1">
            <div className="text-gray-600">対戦相手</div>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="〇〇クラブ"
            />
          </label>

          <button
            onClick={createGame}
            className="w-full rounded-xl bg-black px-4 py-3 text-white font-medium"
          >
            作成する
          </button>

          {status && <p className="text-sm text-gray-700">{status}</p>}
        </section>

        <a href="/" className="text-sm underline">
          ← ホームへ
        </a>
      </div>
    </main>
  );
}
