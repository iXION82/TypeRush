import mongoose, { Document, Schema } from 'mongoose';

export interface IScore extends Document {
    scoreValue: number;
    netWPM: number;
    accuracy: number;
    userId: mongoose.Types.ObjectId;
}

const ScoreSchema = new Schema({
    scoreValue: { type: Number, required: true },
    netWPM: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

export default mongoose.model<IScore>('Score', ScoreSchema);
