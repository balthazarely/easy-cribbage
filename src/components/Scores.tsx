import type { ScoreEntry } from "../types/score";
import type { Settings } from "../types/settings";
import PlayerScore from "./PlayerScore";

interface ScoresProps {
  entries: ScoreEntry[];
  addScore: (player: 1 | 2, score: number) => void;
  setPlayerScore: (player: 1 | 2, score: number) => void;
  settings: Settings;
}

export default function Scores({ entries, addScore, setPlayerScore, settings }: ScoresProps) {
  const individualScore = (se: 1 | 2) => {
    return entries
      .filter((e) => e.player === se)
      .reduce((sum, e) => sum + e.score, 0);
  };
  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <PlayerScore player={1} score={individualScore(1)} addScore={addScore} setPlayerScore={setPlayerScore} name={settings.playerOneName} orientation={settings.playerOneOrientation} />
      <PlayerScore player={2} score={individualScore(2)} addScore={addScore} setPlayerScore={setPlayerScore} name={settings.playerTwoName} orientation={settings.playerTwoOrientation} />
    </div>
  );
}
