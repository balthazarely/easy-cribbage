import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import type { Settings as SettingsType } from "../types/settings";

interface SettingsProps {
  reset: () => void;
  hasScores: boolean;
  settings: SettingsType;
  changePlayerName: (player: 1 | 2 | 3, name: string) => void;
  setOrientation: (player: 1 | 2 | 3, degrees: number) => void;
  togglePlayerThree: () => void;
}

export default function Settings({ reset, hasScores, settings, changePlayerName, setOrientation, togglePlayerThree }: SettingsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  const orientation = (player: 1 | 2 | 3) => {
    if (player === 1) return settings.playerOneOrientation;
    if (player === 2) return settings.playerTwoOrientation;
    return settings.playerThreeOrientation;
  };

  const playerName = (player: 1 | 2 | 3) => {
    if (player === 1) return settings.playerOneName;
    if (player === 2) return settings.playerTwoName;
    return settings.playerThreeName;
  };

  const cycleOrientation = (player: 1 | 2 | 3) => {
    const next = (orientation(player) + 90) % 360;
    setOrientation(player, next);
  };

  const handleReset = () => {
    reset();
    setShowConfirm(false);
  };

  const activePlayers: (1 | 2 | 3)[] = settings.playerThreeEnabled ? [1, 2, 3] : [1, 2];

  return (
    <div className="flex flex-col p-4 gap-6">
      <h2 className="text-xl font-bold">Settings</h2>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50">Players</h3>
        {([1, 2] as const).map((player) => (
          <div key={player} className="flex flex-col gap-1">
            <label className="text-sm opacity-60">Player {player}</label>
            <input
              type="text"
              value={playerName(player)}
              onChange={(e) => changePlayerName(player, e.target.value)}
              className="w-full bg-white/10 rounded-xl px-4 py-3 text-white text-lg outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        ))}

        <div className="flex items-center justify-between py-2">
          <span className="text-sm opacity-60">Enable Player 3</span>
          <button
            onClick={togglePlayerThree}
            className={`relative w-14 h-7 rounded-full transition-colors ${settings.playerThreeEnabled ? "bg-green-600" : "bg-white/20"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${settings.playerThreeEnabled ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
        </div>

        {settings.playerThreeEnabled && (
          <div className="flex flex-col gap-1">
            <label className="text-sm opacity-60">Player 3</label>
            <input
              type="text"
              value={settings.playerThreeName}
              onChange={(e) => changePlayerName(3, e.target.value)}
              className="w-full bg-white/10 rounded-xl px-4 py-3 text-white text-lg outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50">Orientation</h3>
        {settings.playerThreeEnabled && (
          <p className="text-sm opacity-40">Rotation is disabled when 3 players are enabled.</p>
        )}
        <div className="flex gap-2">
          {activePlayers.map((player) => (
            <button
              key={player}
              onClick={() => cycleOrientation(player)}
              disabled={settings.playerThreeEnabled}
              className="flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-xl bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed active:enabled:bg-white/20"
            >
              <FaArrowUp
                size={36}
                style={{ transform: `rotate(${orientation(player)}deg)`, transition: "transform 0.3s" }}
              />
              <span className="text-xs opacity-50">
                {playerName(player)} · {orientation(player)}°
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50">How to Use</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
            <span className="text-lg mt-0.5">👆</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">Quick tap</span>
              <span className="text-sm opacity-60">Tap the +1 or +2 buttons to add points instantly.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
            <span className="text-lg mt-0.5">✋</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">Press and hold the score area</span>
              <span className="text-sm opacity-60">Hold on a player's score to manually enter any value or set an exact score.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50">Install</h3>
        <button
          onClick={() => setShowInstall(true)}
          className="w-full py-4 rounded-xl bg-white/10 active:bg-white/20 font-semibold text-lg"
        >
          Add to Home Screen
        </button>
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

      {showInstall && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4 animate-fade-in" onClick={() => setShowInstall(false)}>
          <div className="bg-slate-800 rounded-2xl w-full p-6 flex flex-col gap-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold">Add to Home Screen</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <span className="bg-white/10 rounded-lg p-2"><FiShare size={20} /></span>
                <span className="opacity-80">Tap the <span className="font-semibold">Share</span> button in Safari's toolbar</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <span className="bg-white/10 rounded-lg p-2 text-lg font-bold">+</span>
                <span className="opacity-80">Tap <span className="font-semibold">Add to Home Screen</span></span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <span className="bg-white/10 rounded-lg p-2 text-lg">✓</span>
                <span className="opacity-80">Tap <span className="font-semibold">Add</span> to confirm</span>
              </div>
            </div>
            <button
              onClick={() => setShowInstall(false)}
              className="w-full py-4 rounded-xl bg-white/10 active:bg-white/20 font-semibold text-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4 animate-fade-in" onClick={() => setShowConfirm(false)}>
          <div className="bg-slate-800 rounded-2xl w-full p-6 flex flex-col gap-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
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
