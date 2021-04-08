import { Document, Model } from 'mongoose';
import { ObjectId } from '../types';
import { AlertDocument } from './alert.interface';

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
    alerts: ObjectId[] | AlertDocument[]; // if populated
    activated: boolean;
    addAlert(alertId: ObjectId): Promise<UserDocument>;
    removeAlert(alertId: ObjectId): Promise<UserDocument>;
}

// Populated interface
export interface UserDocumentPopulatedAlerts extends Omit<UserDocument, 'alerts'> {
    alerts: AlertDocument[];
}

// Interface for mongoose Model
export interface UserModel extends Model<UserDocument> {}
