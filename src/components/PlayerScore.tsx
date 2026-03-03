import { useRef, useState } from "react";

interface PlayerScoreProps {
  player: 1 | 2;
  score: number;
  addScore: (player: 1 | 2, score: number) => void;
  setPlayerScore: (player: 1 | 2, score: number) => void;
  name: string;
  orientation: number;
}

type Mode = "add" | "set";

const themes = {
  1: {
    card: "bg-blue-950",
    button: "bg-blue-800 active:bg-blue-700",
    modeActive: "bg-blue-700",
    modeInactive: "bg-blue-900",
  },
  2: {
    card: "bg-rose-950",
    button: "bg-rose-800 active:bg-rose-700",
    modeActive: "bg-rose-700",
    modeInactive: "bg-rose-900",
  },
};

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
  const [mode, setMode] = useState<Mode>("add");
  const lastTap = useRef<number>(0);
  const theme = themes[player];

  const handleScorePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setInputValue("");
      setMode("add");
      setShowInput(true);
    }
    lastTap.current = now;
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
        className="flex flex-col flex-1 items-center justify-center gap-1"
        onPointerDown={handleScorePress}
      >
        <span className="text-2xl font-semibold opacity-50 uppercase tracking-widest">
          {name}
        </span>
        <span className="text-[9rem] font-bold leading-none">{score}</span>
      </div>

      <div className="flex gap-2 p-2">
        <button
          onClick={() => addScore(player, 1)}
          className={`flex-1 py-14 rounded-xl text-5xl font-bold ${theme.button}`}
        >
          +1
        </button>
        <button
          onClick={() => addScore(player, 2)}
          className={`flex-1 py-14 rounded-xl text-5xl font-bold ${theme.button}`}
        >
          +2
        </button>
      </div>

      {showInput && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl w-full p-6 flex flex-col gap-4">
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
      )}
    </div>
  );
}
