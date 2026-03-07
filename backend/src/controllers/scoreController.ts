import type { Request, Response } from 'express';
import Score from '../models/Score.js';
import Leaderboard from '../models/Leaderboard.js';

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

        await Leaderboard.findOneAndUpdate(
            { category },
            {
                $push: {
                    topScores: {
                        $each: [{
                            scoreId: createdScore._id,
                            scoreValue: createdScore.scoreValue,
                            userId: createdScore.userId
                        }],
                        $sort: { scoreValue: -1 },
                        $slice: 10
                    }
                }
            },
            { upsert: true, new: true }
        );

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
            // We can also populate the score data if we need more than scoreValue, but the basic info is often enough.
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
