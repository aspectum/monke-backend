import { Document, Model } from 'mongoose';
import { AlertModel } from './alert.interface';
import { ObjectId } from '../types';

// Interface for mongoose Document
export interface UserDocument extends Document {
    _id: ObjectId;
    username: string;
    email: string;
    encryptedPassword: string;
    alerts: Array<ObjectId | AlertModel>; // if populated
    activated: boolean;
    addAlert(alertId: ObjectId): Promise<UserDocument>;
    removeAlert(alertId: ObjectId): Promise<UserDocument>;
}

// Interface for mongoose Model
export interface UserModel extends Model<UserDocument> {}

// User data interface (input when signing up)
export interface UserData {
    username: string;
    email: string;
    password: string;
}
