export type ScorePayload = {
  netWPM: number;
  accuracy: number;
  scoreValue: number;
  userId: string;
  gameMode: string;
  punctuation: boolean;
  numbers: boolean;
  totalCharsTyped?: number;
  totalTimeTyped?: number;
  exp?: number;
  newLevel?: number;
};