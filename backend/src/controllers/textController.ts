import type { Request, Response } from 'express';
import TextAsset from '../models/text.js';

export const getRandomText = async (req: Request, res: Response) => {
    try {
        const { mode, count, numbers, punctuation } = { ...req.query, ...req.body };

        const matchStage: any = { mode: mode };

        if (count) matchStage.wordCount = Number(count);

        matchStage.includeNumbers = numbers === 'true' || numbers === true;
        matchStage.includePunctuation = punctuation === 'true' || punctuation === true;

        const randomText = await TextAsset.aggregate([
            { $match: matchStage },
            { $sample: { size: 1 } },
            { $project: { _id: 0, content: 1 } }
        ]);

        if (randomText.length > 0) {
            return res.status(200).json({ content: randomText[0].content });
        }

        return res.status(200).json({
            content: "The quick brown fox jumps over the lazy dog. (Fallback: No match found.)"
        });

    } catch (error) {
        console.error("Error fetching text:", error);
        res.status(500).json({ message: "Server error" });
    }
};