import api from "../api/api"; 
import type { ScorePayload } from "../types/type";

export const createScoreAndUpdateUser = async (
  scoreData: ScorePayload
) => {
  try {
    const userId=scoreData.userId;
    const scoreRes = await api.post("/score/create", scoreData);
    const score = scoreRes.data;
    const scoreIds = score._id;

    const userRes = await api.patch(`/user/${userId}`, {
      scoreIds,
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
