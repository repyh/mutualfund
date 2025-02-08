import { Schema, model, models } from 'mongoose';
import User from '@/types/interfaces/User';

export default models.User ?? model('User', new Schema<User>({
    id: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: false
    },
    origin: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}));