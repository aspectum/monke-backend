import { Document, Model } from 'mongoose';
import { ObjectId } from '../types';

// Interface for mongoose Document
export interface ErrorDocument extends Document {
    _id: ObjectId;
    name: string;
    errorSimple: string;
    errorDetailed: string;
    createdAt: Date;
}

// Interface for mongoose Model
export interface ErrorModel extends Model<ErrorDocument> {}
