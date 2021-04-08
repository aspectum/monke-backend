import { Document, Model } from 'mongoose';
import { ObjectId } from '../types';
import { ProductDocument, ProductObject } from './product.interface';
import { UserDocument } from './user.interface';

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
    user: ObjectId | UserDocument;
    createdAt: Date;
    updatedAt: Date;
}

// Populated interfaces

export interface AlertDocumentPopulatedProduct extends Omit<AlertDocument, 'product'> {
    product: ProductDocument;
}

export interface AlertDocumentPopulatedUser extends Omit<AlertDocument, 'user'> {
    user: UserDocument;
}

export interface AlertDocumentPopulatedAll extends Omit<AlertDocumentPopulatedProduct, 'user'> {
    user: UserDocument;
}

// Interface for mongoose Model
export interface AlertModel extends Model<AlertDocument> {}

// Alert data interface (input when creating new alert)
export interface AlertData {
    url: string;
    targetPrice: number;
}
