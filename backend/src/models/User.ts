import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    scoreIds: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    scoreIds: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
