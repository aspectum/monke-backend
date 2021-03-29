import { Document, Model } from 'mongoose';
import { ObjectId } from '../types';
import { ProductDocument, ProductObject } from './product.interface';

// What is sent by API
export interface AlertObject {
    id: string;
    title: string;
    product: ProductObject;
    targetPrice: number;
    wasNotified: boolean;
    createdAt: string;
    updatedAt: string;
}

// Interface for mongoose Document
// (Too different to extend AlertObject)
export interface AlertDocument extends Document {
    _id: ObjectId;
    title: string;
    product: string | ProductDocument; // if populated
    targetPrice: number;
    wasNotified: boolean;
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
