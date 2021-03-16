import { Document } from 'mongoose';

export default interface ProductDocument extends Document {
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
