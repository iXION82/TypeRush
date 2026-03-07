import api from "../api/api";
import type { ScorePayload } from "../types/type";

export const createScoreAndUpdateUser = async (
  scoreData: ScorePayload
) => {
  try {
    const userId = scoreData.userId;

    const scoreRes = await api.post("/score/create", {
      userId,
      accuracy: scoreData.accuracy,
      netWPM: scoreData.netWPM,
      scoreValue: scoreData.scoreValue,
      gameMode: scoreData.gameMode,
      punctuation: scoreData.punctuation,
      numbers: scoreData.numbers,
    });
    const score = scoreRes.data;
    const scoreIds = score._id;

    const userRes = await api.patch(`/user/${userId}`, {
      scoreIds,
      exp: scoreData.exp ?? 0,
      totalCharsTyped: scoreData.totalCharsTyped ?? 0,
      totalTimeTyped: scoreData.totalTimeTyped ?? 0,
      gamesPlayed: 1,
      ...(scoreData.newLevel !== undefined && { level: scoreData.newLevel }),
    });

    return {
      score,
      user: userRes.data,
    };
  } catch (error) {
    console.error("Failed to create score & update user", error);
    throw error;
  }
};
