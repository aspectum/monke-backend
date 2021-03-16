import { Document, Schema } from 'mongoose';

export default interface UserDocument extends Document {
    _id: Schema.Types.ObjectId; // not sure if this is right
    username: string;
    email: string;
    encryptedPassword: string;
    alerts: any[]; // TODO: create type for this (ObjectId | alert interface)
    activated: boolean;
}
