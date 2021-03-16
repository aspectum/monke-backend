import { Document, Schema, Model } from 'mongoose';
import { AlertModel } from './Alert.interface';

// Interface for mongoose Document
export interface UserDocument extends Document {
    _id: Schema.Types.ObjectId;
    username: string;
    email: string;
    encryptedPassword: string;
    alerts: Array<Schema.Types.ObjectId | AlertModel>; // if populated
    activated: boolean;
    addAlert(): UserDocument;
    removeAlert(): UserDocument;
}

// Interface for mongoose Model
export interface UserModel extends Model<UserDocument> {}
