import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboard extends Document {
    category: string;
    topScores: [{
        scoreId: mongoose.Types.ObjectId;
        scoreValue: number;
        userId: mongoose.Types.ObjectId;
    }];
}

const LeaderboardSchema = new Schema({
    category: { type: String, required: true, unique: true },
    topScores: [{
        scoreId: { type: Schema.Types.ObjectId, ref: 'Score', required: true },
        scoreValue: { type: Number, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    }]
}, { timestamps: true });

export default mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
