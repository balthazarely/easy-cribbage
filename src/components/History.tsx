import { useState, useMemo } from "react";
import { FaUndo } from "react-icons/fa";
import type { ScoreEntry } from "../types/score";
import type { Settings } from "../types/settings";
import { themes } from "../themes";

interface HistoryProps {
  entries: ScoreEntry[];
  settings: Settings;
  resetToIndex: (index: number) => void;
  reset: () => void;
}

export default function History({ entries, settings, resetToIndex, reset }: HistoryProps) {
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const playerName = (player: 1 | 2 | 3) => {
    if (player === 1) return settings.playerOneName;
    if (player === 2) return settings.playerTwoName;
    return settings.playerThreeName;
  };

  // Cumulative score for each player at each index
  const runningTotals = useMemo(() =>
    entries.map((_, i) => {
      const slice = entries.slice(0, i + 1);
      return {
        1: slice.filter((e) => e.player === 1).reduce((s, e) => s + e.score, 0),
        2: slice.filter((e) => e.player === 2).reduce((s, e) => s + e.score, 0),
        3: slice.filter((e) => e.player === 3).reduce((s, e) => s + e.score, 0),
      };
    }),
  [entries]);

  // Scores that would result from rewinding to pendingIndex
  const rewindScores = pendingIndex !== null ? runningTotals[pendingIndex] : null;

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
        const total = runningTotals[originalIndex][entry.player];
        return (
          <div key={originalIndex} className={`flex items-center px-3 py-2 rounded-xl border ${themes[entry.player].card} ${themes[entry.player].border} gap-3`}>
            <span className="opacity-60 w-24 shrink-0">{playerName(entry.player)}</span>
            <span className="font-semibold">+{entry.score}</span>
            <span className="opacity-40 text-sm flex-1">→ {total}</span>
            <span className="text-xs opacity-40">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            {reversedIndex > 0 && (
              <button
                onClick={() => setPendingIndex(originalIndex)}
                className="p-2 rounded-lg bg-white/10 active:bg-white/20 opacity-60"
              >
                <FaUndo size={14} />
              </button>
            )}
          </div>
        );
      })}

      {entries.length > 0 && (
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full py-4 rounded-xl bg-red-600 active:bg-red-700 font-semibold text-lg mt-2"
        >
          Reset Scores
        </button>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4 animate-fade-in" onClick={() => setShowResetConfirm(false)}>
          <div className="bg-slate-800 rounded-2xl w-full p-6 flex flex-col gap-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-center">Reset Scores?</h3>
            <p className="text-center opacity-60 text-sm">This will clear all score history and cannot be undone.</p>
            <button
              onClick={() => { reset(); setShowResetConfirm(false); }}
              className="w-full py-4 rounded-xl bg-red-600 active:bg-red-700 font-semibold text-lg"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="w-full py-4 rounded-xl bg-white/10 active:bg-white/20 font-semibold text-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {pendingIndex !== null && rewindScores && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4 animate-fade-in" onClick={() => setPendingIndex(null)}>
          <div className="bg-slate-800 rounded-2xl w-full p-6 flex flex-col gap-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-center">Rewind to this point?</h3>
            <p className="text-center opacity-60 text-sm">All scores after this entry will be removed.</p>
            <div className="flex gap-2">
              {([1, 2, 3] as const)
                .filter((p) => p !== 3 || settings.playerThreeEnabled)
                .map((p) => (
                  <div key={p} className={`flex-1 flex flex-col items-center py-3 rounded-xl border ${themes[p].card} ${themes[p].border}`}>
                    <span className="text-xs opacity-50 mb-1">{playerName(p)}</span>
                    <span className="text-2xl font-bold">{rewindScores[p]}</span>
                  </div>
                ))}
            </div>
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
