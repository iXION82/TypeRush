const BASE_EXP = 100;
const MULTIPLIER = 1.1;


export function expRequiredForLevel(level: number): number {
    return Math.floor(BASE_EXP * Math.pow(MULTIPLIER, level - 1));
}

export interface LevelData {
    level: number;
    currentLevelExp: number;   // XP earned within the current level
    expForNextLevel: number;   // XP needed to complete this level
    progress: number;          // 0–1 fraction through the current level
}


export function getLevelData(totalExp: number): LevelData {
    let level = 1;
    let remaining = totalExp;

    while (true) {
        const needed = expRequiredForLevel(level);
        if (remaining < needed) break;
        remaining -= needed;
        level++;
    }

    const expForNextLevel = expRequiredForLevel(level);
    const progress = expForNextLevel > 0 ? remaining / expForNextLevel : 0;

    return { level, currentLevelExp: remaining, expForNextLevel, progress };
}
