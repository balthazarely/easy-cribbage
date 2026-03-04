import { useState, useEffect } from "react";
import type { Settings } from "../types/settings";

const nameKeys: Record<1 | 2 | 3, keyof Settings> = {
  1: "playerOneName",
  2: "playerTwoName",
  3: "playerThreeName",
};

const orientationKeys: Record<1 | 2 | 3, keyof Settings> = {
  1: "playerOneOrientation",
  2: "playerTwoOrientation",
  3: "playerThreeOrientation",
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("cribbage-settings");
    return saved
      ? JSON.parse(saved)
      : {
          playerOneName: "Player 1",
          playerTwoName: "Player 2",
          maxScore: 121,
          playerOneOrientation: 0,
          playerTwoOrientation: 0,
          playerThreeEnabled: false,
          playerThreeName: "Player 3",
          playerThreeOrientation: 0,
        };
  });

  useEffect(() => {
    localStorage.setItem("cribbage-settings", JSON.stringify(settings));
  }, [settings]);

  const changePlayerName = (player: 1 | 2 | 3, name: string) => {
    setSettings((prev) => ({ ...prev, [nameKeys[player]]: name }));
  };

  const setOrientation = (player: 1 | 2 | 3, degrees: number) => {
    setSettings((prev) => ({ ...prev, [orientationKeys[player]]: degrees }));
  };

  const togglePlayerThree = () => {
    setSettings((prev) => ({
      ...prev,
      playerThreeEnabled: !prev.playerThreeEnabled,
      ...(!prev.playerThreeEnabled && {
        playerOneOrientation: 0,
        playerTwoOrientation: 0,
        playerThreeOrientation: 0,
      }),
    }));
  };

  return { settings, changePlayerName, setOrientation, togglePlayerThree };
}
