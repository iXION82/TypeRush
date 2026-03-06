import api from "../api/api";
import type { ScorePayload } from "../types/type";

export const createScoreAndUpdateUser = async (
  scoreData: ScorePayload
) => {
  try {
    const userId = scoreData.userId;

    // 1. Create the score record
    const scoreRes = await api.post("/score/create", {
      userId,
      accuracy: scoreData.accuracy,
      netWPM: scoreData.netWPM,
      scoreValue: scoreData.scoreValue,
    });
    const score = scoreRes.data;
    const scoreIds = score._id;

    // 2. Atomically update user stats + push scoreId
    const userRes = await api.patch(`/user/${userId}`, {
      scoreIds,
      exp: scoreData.exp ?? 0,
      totalCharsTyped: scoreData.totalCharsTyped ?? 0,
      totalTimeTyped: scoreData.totalTimeTyped ?? 0,
      gamesPlayed: 1,
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
