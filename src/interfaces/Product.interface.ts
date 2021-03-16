import { Document, Model } from 'mongoose';

// Interface for mongoose Document
export interface ProductDocument extends Document {
    _id: string;
    url: string;
    title: string;
    imageUrl: string;
    currency: string;
    priceHistory: Array<{
        price: number;
        date: Date;
    }>;
}

// Interface for mongoose Model
export interface ProductModel extends Model<ProductDocument> {}
