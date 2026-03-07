import type { Request, Response } from 'express';
import Score from '../models/Score.js';
import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';

interface ScoreBody {
    userId: string;
    accuracy: number;
    netWPM: number;
    scoreValue: number;
    gameMode: string;
    punctuation: boolean;
    numbers: boolean;
}

export const ScoreCreation = async (req: Request, res: Response) => {
    try {
        const { userId, accuracy, netWPM, scoreValue, gameMode, punctuation, numbers } = req.body;

        const newScore = new Score({
            userId,
            accuracy,
            netWPM,
            scoreValue,
            gameMode,
            punctuation,
            numbers
        });

        const createdScore = await newScore.save();

        const category = `${gameMode}-${punctuation ? 'puncTrue' : 'puncFalse'}-${numbers ? 'numTrue' : 'numFalse'}`;

        let leaderboard = await Leaderboard.findOne({ category });
        if (!leaderboard) {
            leaderboard = new Leaderboard({ category, topScores: [] });
        }

        const existingScoreIndex = leaderboard.topScores!.findIndex(
            s => s.userId.toString() === userId.toString()
        );

        let isLeaderboardUpdated = false;

        if (existingScoreIndex !== -1) {
            if (createdScore.scoreValue > leaderboard.topScores![existingScoreIndex]!.scoreValue) {
                // Replace the lower score with the new higher score
                leaderboard.topScores![existingScoreIndex] = {
                    scoreId: createdScore._id,
                    scoreValue: createdScore.scoreValue,
                    userId: createdScore.userId
                } as any;
                isLeaderboardUpdated = true;
            }
        } else {
            // New user score for this category
            leaderboard.topScores!.push({
                scoreId: createdScore._id,
                scoreValue: createdScore.scoreValue,
                userId: createdScore.userId
            } as any);
            isLeaderboardUpdated = true;
        }

        if (isLeaderboardUpdated) {
            leaderboard.topScores!.sort((a, b) => b.scoreValue - a.scoreValue);
            if (leaderboard.topScores!.length > 10) {
                leaderboard.topScores = leaderboard.topScores!.slice(0, 10) as any;
            }
            await leaderboard.save();
        }

        // Update personal best score in User model
        const userStr = String(userId);
        const userDoc = await User.findById(userStr);
        if (userDoc) {
            const currentBest = userDoc.bestScores?.get(category) || 0;
            if (createdScore.scoreValue > currentBest) {
                // We have a new personal best for this category
                // Use Mongoose Map syntax to set
                if (!userDoc.bestScores) {
                    // @ts-ignore - assigning a new Map if undefined
                    userDoc.bestScores = new Map();
                }
                userDoc.bestScores.set(category, createdScore.scoreValue);
                await userDoc.save();
            }
        }

        res.status(201).json(createdScore);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        if (!category || typeof category !== 'string') {
            return res.status(400).json({ message: 'Category is required' });
        }

        const leaderboard = await Leaderboard.findOne({ category })
            .populate({
                path: 'topScores.userId',
                select: 'name avaPic _id'
            })
            .populate({
                path: 'topScores.scoreId',
                select: 'accuracy netWPM createdAt'
            });

        if (!leaderboard) {
            return res.status(200).json([]);
        }

        res.status(200).json(leaderboard.topScores);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
