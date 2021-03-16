import { Document, Schema, Model } from 'mongoose';
import { ProductModel } from './Product.interface';

// Interface for mongoose Document
export interface AlertDocument extends Document {
    _id: Schema.Types.ObjectId;
    ASIN: string | ProductModel; // if populated
    targetPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for mongoose Model
export interface AlertModel extends Model<AlertDocument> {}
