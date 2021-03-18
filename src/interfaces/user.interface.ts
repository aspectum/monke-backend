import { Document, Model } from 'mongoose';
import { AlertModel } from './alert.interface';
import { ObjectId } from '../types';

// What is sent by API
export interface UserObject {
    id: string;
    username: string;
    email: string;
}

// User data interface (input when signing up)
export interface RegisterData extends Omit<UserObject, 'id'> {
    password: string;
}

// --------------- MONGOOSE INTERFACES --------------- //
// Interface for mongoose Document
export interface UserDocument extends Omit<UserObject, 'id'>, Document {
    _id: ObjectId;
    encryptedPassword: string;
    alerts: Array<ObjectId | AlertModel>; // if populated
    activated: boolean;
    addAlert(alertId: ObjectId): Promise<UserDocument>;
    removeAlert(alertId: ObjectId): Promise<UserDocument>;
}

// Interface for mongoose Model
export interface UserModel extends Model<UserDocument> {}
