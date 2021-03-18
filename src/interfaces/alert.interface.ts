import { Document, Model } from 'mongoose';
import { ProductModel } from './product.interface';
import { ObjectId } from '../types';

// Interface for mongoose Document
export interface AlertDocument extends Document {
    _id: ObjectId;
    product: string | ProductModel; // if populated
    targetPrice: number;
    user: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for mongoose Model
export interface AlertModel extends Model<AlertDocument> {}

// Alert data interface (input when creating new alert)
export interface AlertData {
    url: string;
    targetPrice: number;
}
