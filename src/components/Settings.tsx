import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import type { Settings as SettingsType } from "../types/settings";

interface SettingsProps {
  reset: () => void;
  hasScores: boolean;
  settings: SettingsType;
  changePlayerName: (player: 1 | 2, name: string) => void;
  setOrientation: (player: 1 | 2, degrees: number) => void;
}

export default function Settings({ reset, hasScores, settings, changePlayerName, setOrientation }: SettingsProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const orientation = (player: 1 | 2) =>
    player === 1 ? settings.playerOneOrientation : settings.playerTwoOrientation;

  const cycleOrientation = (player: 1 | 2) => {
    const next = (orientation(player) + 90) % 360;
    setOrientation(player, next);
  };

  const handleReset = () => {
    reset();
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col p-4 gap-6">
      <h2 className="text-xl font-bold">Settings</h2>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50">Player Names</h3>
        {([1, 2] as const).map((player) => (
          <div key={player} className="flex flex-col gap-1">
            <label className="text-sm opacity-60">Player {player}</label>
            <input
              type="text"
              value={player === 1 ? settings.playerOneName : settings.playerTwoName}
              onChange={(e) => changePlayerName(player, e.target.value)}
              className="w-full bg-white/10 rounded-xl px-4 py-3 text-white text-lg outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50">Orientation</h3>
        <div className="flex gap-2">
          {([1, 2] as const).map((player) => (
            <button
              key={player}
              onClick={() => cycleOrientation(player)}
              className="flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-xl bg-white/10 active:bg-white/20"
            >
              <FaArrowUp
                size={36}
                style={{ transform: `rotate(${orientation(player)}deg)`, transition: "transform 0.3s" }}
              />
              <span className="text-xs opacity-50">
                {player === 1 ? settings.playerOneName : settings.playerTwoName} · {orientation(player)}°
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50">Game</h3>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={!hasScores}
          className="w-full py-4 rounded-xl bg-red-600 text-white font-semibold text-lg disabled:opacity-30 disabled:cursor-not-allowed active:enabled:bg-red-700"
        >
          Reset Scores
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full p-6 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-center">Reset Scores?</h3>
            <p className="text-center opacity-60 text-sm">This will clear all score history and cannot be undone.</p>
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-xl bg-red-600 active:bg-red-700 font-semibold text-lg"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowConfirm(false)}
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
