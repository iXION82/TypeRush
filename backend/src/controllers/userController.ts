import type { Request, Response } from 'express';
import User from '../models/User.js';

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { scoreIds, exp, totalCharsTyped, totalTimeTyped, gamesPlayed, level, avaPic, name } = req.body;

        const updateOps: Record<string, any> = {};

        if (scoreIds) {
            updateOps.$push = { scoreIds };
        }

        const incFields: Record<string, number> = {};
        if (exp != null) incFields.exp = exp;
        if (totalCharsTyped != null) incFields.totalCharsTyped = totalCharsTyped;
        if (totalTimeTyped != null) incFields.totalTimeTyped = totalTimeTyped;
        if (gamesPlayed != null) incFields.gamesPlayed = gamesPlayed;

        if (Object.keys(incFields).length > 0) {
            updateOps.$inc = incFields;
        }

        const setFields: Record<string, any> = {};
        if (level != null) setFields.level = level;
        if (avaPic != null) setFields.avaPic = avaPic;
        const nameVal: string | undefined = name as string | undefined;
        if (nameVal != null && nameVal.trim() !== '') setFields.name = nameVal.trim();

        if (Object.keys(setFields).length > 0) {
            updateOps.$set = setFields;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateOps,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserStats = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id)
            .select('exp level totalCharsTyped totalTimeTyped gamesPlayed');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id)
            .select('name email avaPic exp level totalCharsTyped totalTimeTyped gamesPlayed bestScores');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
