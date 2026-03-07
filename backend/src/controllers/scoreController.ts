import type { Request, Response } from 'express';
import Score from '../models/Score.js';

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
        res.status(201).json(createdScore);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


