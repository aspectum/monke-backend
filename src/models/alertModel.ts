import { Schema, model } from 'mongoose';

import { AlertDocument } from '../interfaces';

// Defining the model for the alerts
const alertSchema = new Schema<AlertDocument>(
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

export default model('Alert', alertSchema);
