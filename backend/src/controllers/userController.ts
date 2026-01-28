import type { Request, Response } from 'express';
import User from '../models/User.js';

export const updateUser = async (req: Request, res: Response) => {
     try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
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


