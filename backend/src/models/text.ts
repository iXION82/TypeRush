import mongoose, { Document, Schema } from 'mongoose';

export interface IText extends Document {
    content: string;
    mode: 'time' | 'words' | 'zen';
    wordCount: number;
    includeNumbers: boolean;
    includePunctuation: boolean;
    language: string;
}

const TextSchema = new Schema({
    content: { 
        type: String, 
        required: true, 
        trim: true 
    },
    mode: { 
        type: String, 
        enum: ['time', 'words', 'zen'], 
        required: true, 
        index: true 
    },
    wordCount: { 
        type: Number, 
        required: true 
    },
    includeNumbers: { 
        type: Boolean, 
        default: false, 
        index: true 
    },
    includePunctuation: { 
        type: Boolean, 
        default: false, 
        index: true 
    },
    language: { 
        type: String, 
        default: 'english' 
    }
}, { timestamps: true });

export default mongoose.model<IText>('Text', TextSchema);