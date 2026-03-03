import { useState, useEffect } from "react";
import type { Settings } from "../types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("cribbage-settings");
    return saved
      ? JSON.parse(saved)
      : { playerOneName: "Player 1", playerTwoName: "Player 2", maxScore: 121, playerOneOrientation: 0, playerTwoOrientation: 0 };
  });

  useEffect(() => {
    localStorage.setItem("cribbage-settings", JSON.stringify(settings));
  }, [settings]);

  const changePlayerName = (player: 1 | 2, name: string) => {
    setSettings((prev) => ({
      ...prev,
      ...(player === 1 ? { playerOneName: name } : { playerTwoName: name }),
    }));
  };

  const setOrientation = (player: 1 | 2, degrees: number) => {
    const key = player === 1 ? "playerOneOrientation" : "playerTwoOrientation";
    setSettings((prev) => ({ ...prev, [key]: degrees }));
  };

  return { settings, changePlayerName, setOrientation };
}
