import mongoose, { Document, Schema } from 'mongoose';

export interface IScore extends Document {
    scoreValue: number;
    netWPM: number;
    accuracy: number;
    userId: mongoose.Types.ObjectId;
    gameMode: string;
    punctuation: boolean;
    numbers: boolean;
}

const ScoreSchema = new Schema({
    scoreValue: { type: Number, required: true },
    netWPM: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    gameMode: { type: String, required: true },
    punctuation: { type: Boolean, required: true },
    numbers: { type: Boolean, required: true }
}, { timestamps: true });

export default mongoose.model<IScore>('Score', ScoreSchema);
