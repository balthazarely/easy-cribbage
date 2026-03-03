import { useState } from "react";
import { FaUndo } from "react-icons/fa";
import type { ScoreEntry } from "../types/score";
import type { Settings } from "../types/settings";

interface HistoryProps {
  entries: ScoreEntry[];
  settings: Settings;
  resetToIndex: (index: number) => void;
}

export default function History({ entries, settings, resetToIndex }: HistoryProps) {
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  const playerName = (player: 1 | 2) =>
    player === 1 ? settings.playerOneName : settings.playerTwoName;

  const handleConfirm = () => {
    if (pendingIndex !== null) {
      resetToIndex(pendingIndex);
      setPendingIndex(null);
    }
  };

  return (
    <div className="flex flex-col p-4 gap-2">
      <h2 className="text-xl font-bold mb-2">Score History</h2>
      {entries.length === 0 && (
        <p className="opacity-50">No scores yet.</p>
      )}
      {[...entries].reverse().map((entry, reversedIndex) => {
        const originalIndex = entries.length - 1 - reversedIndex;
        return (
          <div key={originalIndex} className="flex items-center py-2 border-b border-white/10 gap-3">
            <span className="opacity-60 w-24">{playerName(entry.player)}</span>
            <span className="font-semibold flex-1">+{entry.score}</span>
            <span className="text-xs opacity-40">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <button
              onClick={() => setPendingIndex(originalIndex)}
              className="p-2 rounded-lg bg-white/10 active:bg-white/20 opacity-60"
            >
              <FaUndo size={14} />
            </button>
          </div>
        );
      })}

      {pendingIndex !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full p-6 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-center">Rewind to this point?</h3>
            <p className="text-center opacity-60 text-sm">All scores after this entry will be removed.</p>
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-xl bg-red-600 active:bg-red-700 font-semibold text-lg"
            >
              Yes, Rewind
            </button>
            <button
              onClick={() => setPendingIndex(null)}
              className="w-full py-4 rounded-xl bg-white/10 active:bg-white/20 font-semibold text-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
