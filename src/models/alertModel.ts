import { Schema, model } from 'mongoose';

import { AlertDocument, AlertModel } from '../interfaces';

// Defining the model for the alerts
const alertSchema = new Schema<AlertDocument, AlertModel>(
    {
        ASIN: {
            type: String,
            required: true,
            ref: 'Product',
        },
        targetPrice: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const Alert = model<AlertDocument, AlertModel>('Alert', alertSchema);
