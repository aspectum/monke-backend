import { model, Schema } from 'mongoose';
import { AlertDocument, AlertModel } from '../interfaces';

// Defining the model for the alerts
const alertSchema = new Schema<AlertDocument, AlertModel>(
    {
        title: {
            type: String,
            required: true,
        },
        product: {
            type: String,
            required: true,
            ref: 'Product',
        },
        targetPrice: {
            type: Number,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        wasNotified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Alert = model<AlertDocument, AlertModel>('Alert', alertSchema);
