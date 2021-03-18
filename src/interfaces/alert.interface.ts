import { Document, Model } from 'mongoose';
import { ProductDocument, ProductObject } from './product.interface';
import { ObjectId } from '../types';

// What is sent by API
export interface AlertObject {
    id: string;
    product: ProductObject;
    targetPrice: number;
    createdAt: string;
    updatedAt: string;
}

// Interface for mongoose Document
// Too different to extend AlertObject
export interface AlertDocument extends Document {
    _id: ObjectId;
    product: string | ProductDocument; // if populated
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
