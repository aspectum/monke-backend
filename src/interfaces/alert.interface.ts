import { Document, Model } from 'mongoose';
import { ObjectId } from '../types';
import { ProductDocument, ProductObject } from './product.interface';
// I'm pretty sure it's fixed, but eslint still complains, so...
// eslint-disable-next-line import/no-cycle
import { UserDocumentWithoutAlerts } from './user.interface';

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

// To avoid dependency cycle
// (Too different to extend AlertObject)
export interface AlertDocumentWithoutUser extends Document {
    _id: ObjectId;
    title: string;
    product: string | ProductDocument; // if populated
    targetPrice: number;
    wasNotified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for mongoose Document
export interface AlertDocument extends AlertDocumentWithoutUser {
    user: ObjectId | UserDocumentWithoutAlerts;
}

// Populated interfaces

export interface AlertDocumentPopulatedProduct extends Omit<AlertDocument, 'product'> {
    product: ProductDocument;
}

export interface AlertDocumentPopulatedUser extends Omit<AlertDocument, 'user'> {
    user: UserDocumentWithoutAlerts;
}

export interface AlertDocumentPopulatedAll extends Omit<AlertDocumentPopulatedProduct, 'user'> {
    user: UserDocumentWithoutAlerts;
}

// Interface for mongoose Model
export interface AlertModel extends Model<AlertDocument> {}

// Alert data interface (input when creating new alert)
export interface AlertData {
    url: string;
    targetPrice: number;
}
