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
  history?: { time: number; wpm: number; accuracy: number }[];
  keystrokes?: { key: string; timestamp: number; correct: boolean }[];
  missedKeys?: Record<string, number>;
};