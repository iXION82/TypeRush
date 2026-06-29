import mongoose, { Document, Schema } from 'mongoose';

export interface IScore extends Document {
    scoreValue: number;
    netWPM: number;
    accuracy: number;
    userId: mongoose.Types.ObjectId;
    gameMode: string;
    punctuation: boolean;
    numbers: boolean;
    history?: { time: number; wpm: number; accuracy: number }[];
    keystrokes?: { key: string; timestamp: number; correct: boolean }[];
    missedKeys?: Map<string, number>;
}

const ScoreSchema = new Schema({
    scoreValue: { type: Number, required: true },
    netWPM: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    gameMode: { type: String, required: true },
    punctuation: { type: Boolean, required: true },
    numbers: { type: Boolean, required: true },
    history: [{
        time: { type: Number, required: true },
        wpm: { type: Number, required: true },
        accuracy: { type: Number, required: true }
    }],
    keystrokes: [{
        key: { type: String, required: true },
        timestamp: { type: Number, required: true },
        correct: { type: Boolean, required: true }
    }],
    missedKeys: { type: Map, of: Number }
}, { timestamps: true });

export default mongoose.model<IScore>('Score', ScoreSchema);
