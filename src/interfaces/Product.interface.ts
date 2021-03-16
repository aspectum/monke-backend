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

// Product data interfaces
// After scraping, before parsing
export interface RawProductData {
    ASIN: string;
    url: string;
    title: string;
    imageUrl: string;
    price: string;
}

// After parsing
export interface ProductData {
    ASIN: string;
    url: string;
    title: string;
    imageUrl: string;
    price: number;
    currency: string;
    error?: Error;
}
