import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    scoreIds: mongoose.Types.ObjectId[];
    avaPic: number;
    exp: number;
    level: number;
    totalCharsTyped: number;
    totalTimeTyped: number;
    gamesPlayed: number;
    bestScores: Map<string, number>;
}

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    scoreIds: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    avaPic: { type: Number, default: 1, min: 1, max: 11 },
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    totalCharsTyped: { type: Number, default: 0 },
    totalTimeTyped: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    bestScores: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
