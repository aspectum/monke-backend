import { Document, Schema } from 'mongoose';

export default interface AlertDocument extends Document {
    _id: Schema.Types.ObjectId; // not sure if this is right
    ASIN: string;
    targetPrice: number;
    createdAt: Date; // not sure if this is right
    updatedAt: Date;
}
