"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function isDateStr(v: string | null) {
  return !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export default function RankingClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const initialStart = sp.get("start");
  const initialEnd = sp.get("end");

  const [start, setStart] = useState(isDateStr(initialStart) ? initialStart! : "");
  const [end, setEnd] = useState(isDateStr(initialEnd) ? initialEnd! : "");

  const canApply = useMemo(() => {
    return isDateStr(start) && isDateStr(end) && start <= end;
  }, [start, end]);

  const apply = () => {
    if (!canApply) return;
    router.push(`/ranking?start=${start}&end=${end}`);
  };

  const resetToFiscal = () => {
    router.push("/ranking");
  };

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="font-semibold">期間を選ぶ</div>

      <div className="grid grid-cols-1 gap-3">
        <label className="text-sm">
          開始日
          <input
            type="date"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>

        <label className="text-sm">
          終了日
          <input
            type="date"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={apply}
          disabled={!canApply}
          className="flex-1 rounded-xl bg-black px-4 py-2 text-white font-medium disabled:opacity-40"
        >
          適用
        </button>
        <button
          onClick={resetToFiscal}
          className="flex-1 rounded-xl border px-4 py-2 font-medium"
        >
          年度に戻す
        </button>
      </div>

      {!canApply && (start || end) && (
        <p className="text-xs text-gray-500">
          日付は YYYY-MM-DD。開始日 ≤ 終了日 にしてね。
        </p>
      )}
    </div>
  );
}
