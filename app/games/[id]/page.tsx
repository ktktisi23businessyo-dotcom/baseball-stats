"use client";

import { useState } from "react";

type PageProps = {
  params: { id: string };
};

export default function GameInputPage({ params }: PageProps) {
  const gameId = params.id;

  // ★ ここに、さっきSupabaseで作ったusersのuuidを貼る
  const userId = "af3aaadb-8c20-4fa6-a7ee-08971c0352c2";

  const [ab, setAb] = useState(0);
  const [h, setH] = useState(0);
  const [outs, setOuts] = useState(0);
  const [er, setEr] = useState(0);
  const [status, setStatus] = useState("");

  const saveStat = async () => {
    setStatus("送信中...");

    try {
      const res = await fetch("/api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          game_id: gameId,
          user_id: userId,
          ab,
          h,
          outs,
          er
        })
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus(`エラー: ${json.error}`);
        return;
      }

      setStatus("保存成功！");
    } catch {
      setStatus("通信エラー");
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-md space-y-4">

        <a href="/games" className="text-sm underline">
          ← 試合一覧へ
        </a>

        <h1 className="text-2xl font-bold">成績入力</h1>

        <div className="space-y-3 rounded-xl border p-4">

          <label className="block text-sm">
            打数（AB）
            <input
              type="number"
              className="w-full rounded-lg border px-3 py-2 mt-1"
              value={ab}
              onChange={(e) => setAb(Number(e.target.value))}
            />
          </label>

          <label className="block text-sm">
            安打（H）
            <input
              type="number"
              className="w-full rounded-lg border px-3 py-2 mt-1"
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
            />
          </label>

          <label className="block text-sm">
            アウト数（OUT）
            <input
              type="number"
              className="w-full rounded-lg border px-3 py-2 mt-1"
              value={outs}
              onChange={(e) => setOuts(Number(e.target.value))}
            />
          </label>

          <label className="block text-sm">
            自責点（ER）
            <input
              type="number"
              className="w-full rounded-lg border px-3 py-2 mt-1"
              value={er}
              onChange={(e) => setEr(Number(e.target.value))}
            />
          </label>

          <button
            onClick={saveStat}
            className="w-full rounded-xl bg-black px-4 py-3 text-white font-medium"
          >
            保存する
          </button>

          {status && <p className="text-sm text-gray-700">{status}</p>}
        </div>
      </div>
    </main>
  );
}
