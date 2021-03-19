import { Document, Model } from 'mongoose';

interface Price {
    price: number;
    date: Date;
}

// What is sent by API
export interface ProductObject {
    ASIN: string;
    url: string;
    title: string;
    imageUrl: string;
    currency: string;
    priceHistory: Array<Price>;
}

// --------------- MONGOOSE INTERFACES --------------- //
// Interface for mongoose Document
export interface ProductDocument extends Omit<ProductObject, 'ASIN'>, Document {
    _id: string;
}

// Interface for mongoose Model
export interface ProductModel extends Model<ProductDocument> {}

// ------------ PRODUCT DATA INTERFACES ------------ //
// Scraped data, before parsing
export interface RawProductData {
    ASIN: string;
    url: string;
    title: string;
    imageUrl: string;
    price: string;
}

// After parsing
export interface ProductData extends Omit<RawProductData, 'price'> {
    price: number;
    currency: string;
}
