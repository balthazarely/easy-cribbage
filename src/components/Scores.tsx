import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { playVictory } from "../utils/sound";
import type { ScoreEntry } from "../types/score";
import type { Settings } from "../types/settings";
import PlayerScore from "./PlayerScore";
import GuideModal from "./GuideModal";
import { useWakeLock } from "../hooks/useWakeLock";

interface ScoresProps {
  entries: ScoreEntry[];
  addScore: (player: 1 | 2 | 3, score: number) => void;
  setPlayerScore: (player: 1 | 2 | 3, score: number) => void;
  undoPlayerScore: (player: 1 | 2 | 3) => void;
  settings: Settings;
  reset: () => void;
  winnerDismissed: boolean;
  setWinnerDismissed: (v: boolean) => void;
}

export default function Scores({
  entries,
  addScore,
  setPlayerScore,
  undoPlayerScore,
  settings,
  reset,
  winnerDismissed,
  setWinnerDismissed,
}: ScoresProps) {
  useWakeLock();
  const [showGuide, setShowGuide] = useState(() => !localStorage.getItem("cribbage-guide-seen"));

  const individualScore = (se: 1 | 2 | 3) => {
    return entries
      .filter((e) => e.player === se)
      .reduce((sum, e) => sum + e.score, 0);
  };

  const scores: { player: 1 | 2 | 3; name: string; score: number }[] = [
    { player: 1, name: settings.playerOneName, score: individualScore(1) },
    { player: 2, name: settings.playerTwoName, score: individualScore(2) },
    ...(settings.playerThreeEnabled
      ? [
          {
            player: 3 as const,
            name: settings.playerThreeName,
            score: individualScore(3),
          },
        ]
      : []),
  ];

  const winner = scores.find((s) => s.score >= 121);

  useEffect(() => {
    if (!winner) {
      setWinnerDismissed(false);
      return;
    }
    if (winnerDismissed) return;

    const burst = () => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 },
        zIndex: 100,
      });
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.4, x: 0.2 },
        angle: 60,
        zIndex: 100,
      });
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.4, x: 0.8 },
        angle: 120,
        zIndex: 100,
      });
    };

    burst();
    playVictory();
  }, [winner, winnerDismissed]);

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <PlayerScore
        player={1}
        score={scores[0].score}
        addScore={addScore}
        setPlayerScore={setPlayerScore}
        undoPlayerScore={undoPlayerScore}
        name={settings.playerOneName}
        orientation={settings.playerOneOrientation}
      />
      <PlayerScore
        player={2}
        score={scores[1].score}
        addScore={addScore}
        setPlayerScore={setPlayerScore}
        undoPlayerScore={undoPlayerScore}
        name={settings.playerTwoName}
        orientation={settings.playerTwoOrientation}
      />
      {settings.playerThreeEnabled && (
        <PlayerScore
          player={3}
          score={scores[2].score}
          addScore={addScore}
          setPlayerScore={setPlayerScore}
          undoPlayerScore={undoPlayerScore}
          name={settings.playerThreeName}
          orientation={settings.playerThreeOrientation}
        />
      )}

      {showGuide && (
        <GuideModal onClose={() => { localStorage.setItem("cribbage-guide-seen", "1"); setShowGuide(false); }} />
      )}

      {winner && !winnerDismissed && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          onClick={() => setWinnerDismissed(true)}
        >
          <div
            className="bg-slate-800 rounded-2xl w-full p-8 flex flex-col items-center gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl">🏆</div>
            <h2 className="text-2xl font-bold text-center">
              {winner.name} Wins!
            </h2>
            <p className="text-center opacity-60 text-sm">
              Reached {winner.score} points
            </p>
            <button
              onClick={() => setWinnerDismissed(true)}
              className="w-full py-4 rounded-xl bg-white/10 active:bg-white/20 font-semibold text-lg mt-2"
            >
              Continue Playing
            </button>
            <button
              onClick={() => { reset(); setWinnerDismissed(true); }}
              className="w-full py-4 rounded-xl bg-red-600 active:bg-red-700 font-semibold text-lg"
            >
              Reset Scores
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
