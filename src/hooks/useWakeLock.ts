import { useEffect } from "react";

export function useWakeLock() {
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;

    const acquire = async () => {
      try {
        if (document.visibilityState === "visible") {
          lock = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Device denied the lock (e.g. low battery mode) — fail silently
      }
    };

    acquire();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") acquire();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      lock?.release();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);
}
