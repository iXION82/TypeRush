import type { Request, Response } from 'express';
import Score from '../models/Score.js';

export const ScoreCreation = async (req: Request, res: Response) => {
    try {
        const { userId,accuracy,netWPM,scoreValue } = req.body;

        const newScore = new Score({
            userId,
            accuracy,
            netWPM,
            scoreValue,
        });

        await newScore.save();
        res.status(201).json({ message : "Score saved" });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


