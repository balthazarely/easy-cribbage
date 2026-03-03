import { useState, useEffect } from "react";
import type { ScoreEntry } from "../types/score";

export function useScoreHistory() {
  const [entries, setEntries] = useState<ScoreEntry[]>(() => {
    const saved = localStorage.getItem("cribbage-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cribbage-history", JSON.stringify(entries));
  }, [entries]);

  const addScore = (player: 1 | 2, score: number) => {
    const newEntry: ScoreEntry = {
      player,
      score,
      timestamp: new Date(),
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const undo = () => {
    setEntries((prev) => prev.slice(0, -1));
  };

  const reset = () => {
    setEntries([]);
  };

  const resetToIndex = (index: number) => {
    setEntries((prev) => prev.slice(0, index + 1));
  };

  const setPlayerScore = (player: 1 | 2, score: number) => {
    setEntries((prev) => [
      ...prev.filter((e) => e.player !== player),
      { player, score, timestamp: new Date() },
    ]);
  };

  return {
    entries,
    addScore,
    undo,
    reset,
    resetToIndex,
    setPlayerScore,
  };
}
