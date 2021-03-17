import { Document, Schema, Model } from 'mongoose';
import { ProductModel } from './Product.interface';

// Interface for mongoose Document
export interface AlertDocument extends Document {
    _id: Schema.Types.ObjectId;
    product: string | ProductModel; // if populated
    targetPrice: number;
    user: Schema.Types.ObjectId;
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
