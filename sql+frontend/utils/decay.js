import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { dbPromise } from "../db/dbPromise";
import { getLatestScoreHistory, insertScoreHistory } from "../db/scoreHistory";

// ✅ Switch this to false in production
const TEST_MODE = true;

// ✅ Decay interval (ms)
const oneDay = TEST_MODE ? 60000 : 86400000; // 1 min (testing) or 1 day (production)

// ✅ Main decay logic
export const applyDecay = async () => {
  const db = await dbPromise;
  const latestScore = await getLatestScoreHistory();
  const now = new Date();

  // Fallback to now if no decay recorded
  let lastDecay = latestScore?.lastDecay ? new Date(latestScore.lastDecay) : new Date();

  // ✅ Remove time for daily mode, keep exact for test mode
  if (!TEST_MODE) {
    lastDecay = new Date(lastDecay.getFullYear(), lastDecay.getMonth(), lastDecay.getDate());
  }
  const today = TEST_MODE ? now : new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let difference = today - lastDecay;
  let numOfDecays = 0;

  console.log(`🧮 decay difference: ${difference}ms vs interval ${oneDay}ms`);

  if (difference >= oneDay) {
    while (difference >= oneDay) {
      numOfDecays++;
      difference -= oneDay;
    }

    const decayAmount = -1 * numOfDecays;
    console.log(`⚠️ Applying decay: ${decayAmount}`);

    // ⬇️ Insert decayed score (negative value)
    await insertScoreHistory(decayAmount, undefined, true);
  }
};

// ✅ Hook to apply decay when app resumes or loads
export const useDailyDecay = (isDbReady) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!isDbReady) return;

    applyDecay(); // 🟢 Run once on mount

    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        applyDecay(); // 🔁 Recheck on resume
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isDbReady]);
};
