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


