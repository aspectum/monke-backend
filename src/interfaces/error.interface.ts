import { Document, Model } from 'mongoose';
import { ObjectId } from '../types';

export interface ErrorData {
    name: String;
    message: String;
    stack: String;
}

// Interface for mongoose Document
export interface ErrorDocument extends Document {
    _id: ObjectId;
    name: string;
    errorObj: Object; // Object or Error?
    createdAt: Date;
}

// Interface for mongoose Model
export interface ErrorModel extends Model<ErrorDocument> {}
