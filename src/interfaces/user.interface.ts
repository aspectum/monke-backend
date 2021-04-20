import { Document, Model } from 'mongoose';
import { ObjectId } from '../types';
// I'm pretty sure it's fixed, but eslint still complains, so...
// eslint-disable-next-line import/no-cycle
import { AlertDocumentWithoutUser } from './alert.interface';

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

// To avoid dependency cycle
export interface UserDocumentWithoutAlerts extends Omit<UserObject, 'id'>, Document {
    _id: ObjectId;
    encryptedPassword: string;
    activated: boolean;
    addAlert(alertId: ObjectId): Promise<UserDocument>;
    removeAlert(alertId: ObjectId): Promise<UserDocument>;
}

// --------------- MONGOOSE INTERFACES --------------- //
// Interface for mongoose Document
export interface UserDocument extends UserDocumentWithoutAlerts {
    alerts: ObjectId[] | AlertDocumentWithoutUser[]; // if populated
}

// Populated interface
export interface UserDocumentPopulatedAlerts extends Omit<UserDocument, 'alerts'> {
    alerts: AlertDocumentWithoutUser[];
}

// Interface for mongoose Model
export interface UserModel extends Model<UserDocument> {}
