import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Menu from "./components/Menu";
import { useScoreHistory } from "./hooks/useScoreHistory";
import { useSettings } from "./hooks/useSettings";
import History from "./components/History";
import Settings from "./components/Settings";
import Scores from "./components/Scores";

function App() {
  const { entries, addScore, reset, resetToIndex, setPlayerScore, undoPlayerScore } = useScoreHistory();
  const { settings, changePlayerName, setOrientation, togglePlayerThree } = useSettings();
  const [winnerDismissed, setWinnerDismissed] = useState(false);

  return (
    <div className="flex flex-col h-dvh w-full bg-slate-900 text-white pt-[env(safe-area-inset-top)]">
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route
            path="/"
            element={<Scores entries={entries} addScore={addScore} setPlayerScore={setPlayerScore} undoPlayerScore={undoPlayerScore} settings={settings} reset={reset} winnerDismissed={winnerDismissed} setWinnerDismissed={setWinnerDismissed} />}
          />
          <Route path="/history" element={<History entries={entries} settings={settings} resetToIndex={resetToIndex} reset={reset} />} />
          <Route path="/settings" element={<Settings reset={reset} hasScores={entries.length > 0} settings={settings} changePlayerName={changePlayerName} setOrientation={setOrientation} togglePlayerThree={togglePlayerThree} />} />
        </Routes>
      </div>
      <Menu />
    </div>
  );
}

export default App;
