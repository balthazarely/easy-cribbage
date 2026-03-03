import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiEdit2 } from "react-icons/fi";
import { themes } from "../themes";

interface PlayerScoreProps {
  player: 1 | 2 | 3;
  score: number;
  addScore: (player: 1 | 2 | 3, score: number) => void;
  setPlayerScore: (player: 1 | 2 | 3, score: number) => void;
  name: string;
  orientation: number;
}


export default function PlayerScore({
  player,
  score,
  addScore,
  setPlayerScore,
  name,
  orientation,
}: PlayerScoreProps) {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState<"add" | "set">("add");
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const theme = themes[player];

  const handlePointerDown = () => {
    holdTimer.current = setTimeout(() => {
      setInputValue("");
      setMode("add");
      setShowInput(true);
    }, 500);
  };

  const handlePointerUp = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  const handleSubmit = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val) && val >= 0) {
      mode === "add" ? addScore(player, val) : setPlayerScore(player, val);
    }
    setShowInput(false);
  };

  return (
    <div
      className={`flex flex-col flex-1 w-full rounded-2xl overflow-hidden select-none ${theme.card}`}
      style={{
        WebkitTapHighlightColor: "transparent",
        transform: `rotate(${orientation}deg)`,
      }}
    >
      <div
        className="relative flex flex-col flex-[3] min-h-0 items-center justify-center gap-1 py-3"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <FiEdit2 className="absolute top-3 right-3 opacity-20" size={14} />
        <span className="text-[clamp(0.875rem,2.5dvh,1.5rem)] font-semibold opacity-50 uppercase tracking-widest">
          {name}
        </span>
        <span className="text-[clamp(2rem,10dvh,9rem)] font-bold leading-none">
          {score}
        </span>
      </div>

      <div className="flex flex-[2] gap-2 p-2">
        <button
          onClick={() => addScore(player, 1)}
          className={`flex-1 h-full rounded-xl text-[clamp(1.5rem,4dvh,3rem)] font-bold ${theme.button}`}
        >
          +1
        </button>
        <button
          onClick={() => addScore(player, 2)}
          className={`flex-1 h-full rounded-xl text-[clamp(1.5rem,4dvh,3rem)] font-bold ${theme.button}`}
        >
          +2
        </button>
      </div>

      {showInput && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4 animate-fade-in" onClick={() => setShowInput(false)}>
          <div className="animate-slide-up w-full" onClick={(e) => e.stopPropagation()}>
          <div
            className="bg-slate-800 rounded-2xl w-full p-6 flex flex-col gap-4"
            style={{ transform: `rotate(${orientation}deg)` }}
          >
            <h3 className="text-xl font-bold text-center">{name}</h3>

            <div className="flex rounded-xl overflow-hidden">
              <button
                onClick={() => setMode("add")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "add" ? theme.modeActive : theme.modeInactive}`}
              >
                Add Points
              </button>
              <button
                onClick={() => setMode("set")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "set" ? theme.modeActive : theme.modeInactive}`}
              >
                Set Score
              </button>
            </div>

            <input
              type="number"
              inputMode="numeric"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={mode === "add" ? "Points to add" : "New score"}
              className="w-full bg-white/10 rounded-xl px-4 py-4 text-white text-2xl text-center outline-none focus:ring-2 focus:ring-white/30"
            />

            <button
              onClick={handleSubmit}
              className={`w-full py-4 rounded-xl font-semibold text-lg ${theme.button}`}
            >
              {mode === "add" ? "Add" : "Set"}
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="w-full py-4 rounded-xl bg-white/10 active:bg-white/20 font-semibold text-lg"
            >
              Cancel
            </button>
          </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
