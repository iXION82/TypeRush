import {
    Clock, Keyboard, Star, Trophy, ArrowLeft, ArrowUpCircle, Crown, Flame, Target, Award, Zap, Lock, BookOpen
} from 'lucide-react';
import type { UserData } from '../context/AuthContext';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    isUnlocked: (user: UserData) => boolean;
    progress: (user: UserData) => { current: number; max: number };
}

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'games-1', title: 'Breaking the Ice', description: 'Complete your first game.', icon: Flame, isUnlocked: (u) => u.gamesPlayed >= 1, progress: (u) => ({ current: u.gamesPlayed, max: 1 }) },
    { id: 'games-10', title: 'Warming Up', description: 'Play 10 games.', icon: Flame, isUnlocked: (u) => u.gamesPlayed >= 10, progress: (u) => ({ current: u.gamesPlayed, max: 10 }) },
    { id: 'games-100', title: 'Keyboard Warrior', description: 'Play 100 games.', icon: Target, isUnlocked: (u) => u.gamesPlayed >= 100, progress: (u) => ({ current: u.gamesPlayed, max: 100 }) },
    { id: 'games-500', title: 'The Regular', description: 'Play 500 games.', icon: Star, isUnlocked: (u) => u.gamesPlayed >= 500, progress: (u) => ({ current: u.gamesPlayed, max: 500 }) },
    { id: 'games-1000', title: 'Addicted to the Click', description: 'Play 1,000 games.', icon: Crown, isUnlocked: (u) => u.gamesPlayed >= 1000, progress: (u) => ({ current: u.gamesPlayed, max: 1000 }) },

    { id: 'time-15m', title: 'Coffee Break', description: 'Accumulate 15 minutes of total typing time.', icon: Clock, isUnlocked: (u) => u.totalTimeTyped >= 900, progress: (u) => ({ current: u.totalTimeTyped, max: 900 }) },
    { id: 'time-1h', title: 'In the Zone', description: 'Accumulate 1 hour of total typing time.', icon: Clock, isUnlocked: (u) => u.totalTimeTyped >= 3600, progress: (u) => ({ current: u.totalTimeTyped, max: 3600 }) },
    { id: 'time-20h', title: 'Part-Time Job', description: 'Accumulate 20 hours of total typing time.', icon: Clock, isUnlocked: (u) => u.totalTimeTyped >= 72000, progress: (u) => ({ current: u.totalTimeTyped, max: 72000 }) },
    { id: 'time-24h', title: 'Dedicated Typist', description: 'Accumulate a full 24 hours of total typing time.', icon: Clock, isUnlocked: (u) => u.totalTimeTyped >= 86400, progress: (u) => ({ current: u.totalTimeTyped, max: 86400 }) },

    { id: 'chars-1k', title: 'Pen Pal', description: 'Type 1,000 total characters.', icon: Keyboard, isUnlocked: (u) => u.totalCharsTyped >= 1000, progress: (u) => ({ current: u.totalCharsTyped, max: 1000 }) },
    { id: 'chars-10k', title: 'Short Story', description: 'Type 10,000 total characters.', icon: BookOpen, isUnlocked: (u) => u.totalCharsTyped >= 10000, progress: (u) => ({ current: u.totalCharsTyped, max: 10000 }) },
    { id: 'chars-100k', title: 'Novelist', description: 'Type 100,000 total characters.', icon: BookOpen, isUnlocked: (u) => u.totalCharsTyped >= 100000, progress: (u) => ({ current: u.totalCharsTyped, max: 100000 }) },
    { id: 'chars-1m', title: 'Million Keystroke March', description: 'Type 1,000,000 total characters.', icon: Award, isUnlocked: (u) => u.totalCharsTyped >= 1000000, progress: (u) => ({ current: u.totalCharsTyped, max: 1000000 }) },

    { id: 'level-5', title: 'Moving Up', description: 'Reach Level 5.', icon: Zap, isUnlocked: (u) => u.level >= 5, progress: (u) => ({ current: u.level, max: 5 }) },
    { id: 'level-10', title: 'Double Digits', description: 'Reach Level 10.', icon: Zap, isUnlocked: (u) => u.level >= 10, progress: (u) => ({ current: u.level, max: 10 }) },
    { id: 'level-50', title: 'Halfway There', description: 'Reach Level 50.', icon: Zap, isUnlocked: (u) => u.level >= 50, progress: (u) => ({ current: u.level, max: 50 }) },
    { id: 'level-100', title: 'Grandmaster', description: 'Reach Level 100.', icon: Crown, isUnlocked: (u) => u.level >= 100, progress: (u) => ({ current: u.level, max: 100 }) },
];
