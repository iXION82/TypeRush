export type ScorePayload = {
  netWPM: number;
  accuracy: number;
  scoreValue: number;
  userId: string;
  totalCharsTyped?: number;
  totalTimeTyped?: number;
  exp?: number;
};