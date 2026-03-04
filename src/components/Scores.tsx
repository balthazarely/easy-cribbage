import type { ScoreEntry } from "../types/score";
import type { Settings } from "../types/settings";
import PlayerScore from "./PlayerScore";
import { useWakeLock } from "../hooks/useWakeLock";

interface ScoresProps {
  entries: ScoreEntry[];
  addScore: (player: 1 | 2 | 3, score: number) => void;
  setPlayerScore: (player: 1 | 2 | 3, score: number) => void;
  undoPlayerScore: (player: 1 | 2 | 3) => void;
  settings: Settings;
}

export default function Scores({ entries, addScore, setPlayerScore, undoPlayerScore, settings }: ScoresProps) {
  useWakeLock();

  const individualScore = (se: 1 | 2 | 3) => {
    return entries
      .filter((e) => e.player === se)
      .reduce((sum, e) => sum + e.score, 0);
  };
  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <PlayerScore player={1} score={individualScore(1)} addScore={addScore} setPlayerScore={setPlayerScore} undoPlayerScore={undoPlayerScore} name={settings.playerOneName} orientation={settings.playerOneOrientation} />
      <PlayerScore player={2} score={individualScore(2)} addScore={addScore} setPlayerScore={setPlayerScore} undoPlayerScore={undoPlayerScore} name={settings.playerTwoName} orientation={settings.playerTwoOrientation} />
      {settings.playerThreeEnabled && (
        <PlayerScore player={3} score={individualScore(3)} addScore={addScore} setPlayerScore={setPlayerScore} undoPlayerScore={undoPlayerScore} name={settings.playerThreeName} orientation={settings.playerThreeOrientation} />
      )}
    </div>
  );
}
